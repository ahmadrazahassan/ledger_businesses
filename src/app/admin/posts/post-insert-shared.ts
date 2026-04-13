import type { SupabaseClient } from '@supabase/supabase-js';
import type { PostFormData } from '@/lib/types/database';
import { slugify } from '@/lib/utils';
import { normalizePostCategories } from './category-form';

function contentTextFromHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Inserts a post and its category rows. Rolls back the post if categories fail.
 * Mirrors the logic previously inlined in createPost.
 */
export async function insertPostWithCategories(
  supabase: SupabaseClient,
  data: PostFormData
): Promise<
  | { success: true; post: { id: string; slug: string; title: string } }
  | { success: false; error: string; code?: string }
> {
  const textContent = contentTextFromHtml(data.content_html);
  const wordCount = textContent.split(/\s+/).filter(Boolean).length;
  const reading_time = Math.max(1, Math.ceil(wordCount / 238));

  const normalized = normalizePostCategories(data);
  if ('error' in normalized) {
    return { success: false, error: normalized.error };
  }
  const { categoryIds, primaryCategoryId } = normalized;

  const postData = {
    title: data.title,
    slug: data.slug || slugify(data.title),
    excerpt: data.excerpt,
    content_html: data.content_html,
    content_text: textContent,
    cover_image: data.cover_image || '',
    author_id: data.author_id,
    category_id: primaryCategoryId,
    tags: data.tags,
    status: data.status,
    published_at:
      data.status === 'published' && !data.published_at ? new Date().toISOString() : data.published_at,
    reading_time,
    featured_rank: data.featured_rank,
    seo_title: data.seo_title || data.title,
    seo_description: data.seo_description || data.excerpt,
    og_image: data.og_image || data.cover_image || '',
    canonical_url: data.canonical_url ?? null,
  };

  const { data: post, error } = await supabase.from('posts').insert(postData).select('id, slug, title').single();

  if (error) {
    return { success: false, error: error.message, code: error.code };
  }

  const categoryRelations = categoryIds.map((catId) => ({
    post_id: post.id,
    category_id: catId,
    is_primary: catId === primaryCategoryId,
  }));

  const { error: catError } = await supabase.from('post_categories').insert(categoryRelations);

  if (catError) {
    await supabase.from('posts').delete().eq('id', post.id);
    return { success: false, error: `Failed to set categories: ${catError.message}` };
  }

  return { success: true, post };
}
