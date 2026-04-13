'use server';

import { revalidatePath } from 'next/cache';
import type { SupabaseClient } from '@supabase/supabase-js';
import { insertPostWithCategories } from '@/app/admin/posts/post-insert-shared';
import { createClient } from '@/lib/supabase/server';
import { parseHtmlForImport, titleFromFileName } from '@/lib/import/html-import';
import type { ImportHtmlArticleResult, PostFormData, PostStatus } from '@/lib/types/database';
import { slugify } from '@/lib/utils';

const MAX_HTML_CHARS = 15 * 1024 * 1024;

async function resolveUniquePostSlug(supabase: SupabaseClient, baseSlug: string): Promise<string> {
  const base = (baseSlug || 'article').slice(0, 200);
  let i = 0;
  while (true) {
    const candidate = i === 0 ? base : `${base}-${i}`;
    const { data } = await supabase.from('posts').select('id').eq('slug', candidate).maybeSingle();
    if (!data) return candidate;
    i += 1;
    if (i > 5000) return `${base}-${Date.now()}`;
  }
}

function publishedAtForStatus(status: PostStatus): string | null {
  if (status === 'published') return new Date().toISOString();
  return null;
}

export async function importHtmlArticle(input: {
  fileName: string;
  html: string;
  author_id: string;
  category_id: string;
  category_ids?: string[];
  status: PostStatus;
}): Promise<ImportHtmlArticleResult> {
  const { fileName, html, author_id, category_id, category_ids, status } = input;

  if (!fileName?.trim() || !html) {
    return { success: false, fileName: fileName?.trim() || '(unknown)', message: 'Missing file name or HTML content.' };
  }
  if (html.length > MAX_HTML_CHARS) {
    return { success: false, fileName, message: 'HTML exceeds maximum size.' };
  }

  let parsed;
  try {
    parsed = parseHtmlForImport(html);
  } catch (e) {
    return {
      success: false,
      fileName,
      message: e instanceof Error ? e.message : 'Failed to parse HTML.',
    };
  }

  let title = parsed.title.trim();
  if (!title) {
    title = titleFromFileName(fileName);
  }

  const content = parsed.content_html.trim();
  if (!content) {
    return { success: false, fileName, title, message: 'No article content found after parsing.' };
  }

  const supabase = await createClient();

  const baseSlug = slugify(title) || slugify(titleFromFileName(fileName)) || 'imported-article';
  const uniqueSlug = await resolveUniquePostSlug(supabase, baseSlug);

  const categoryIds = category_ids?.length ? category_ids : [category_id];

  const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  const postData: PostFormData = {
    title: title.slice(0, 500),
    slug: uniqueSlug,
    excerpt: (parsed.excerpt || title).slice(0, 2000),
    content_html: parsed.content_html,
    content_text: textContent,
    cover_image: parsed.cover_image || '',
    author_id,
    category_id,
    category_ids: categoryIds,
    tags: parsed.tags,
    status,
    published_at: publishedAtForStatus(status),
    featured_rank: null,
    seo_title: (parsed.seo_title || title).slice(0, 500),
    seo_description: (parsed.seo_description || parsed.excerpt || title).slice(0, 500),
    og_image: parsed.cover_image || '',
    canonical_url: undefined,
  };

  const result = await insertPostWithCategories(supabase, postData);

  if (!result.success) {
    return { success: false, fileName, title, message: result.error };
  }

  revalidatePath('/admin');
  revalidatePath('/admin/posts');

  return {
    success: true,
    fileName,
    title: result.post.title,
    slug: result.post.slug,
    postId: result.post.id,
  };
}
