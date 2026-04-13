'use server';

import { revalidatePath } from 'next/cache';
import DOMPurify from 'isomorphic-dompurify';
import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/utils';
import type { ImportPostInput, ImportRowResult } from '@/lib/types/database';
import { insertPostWithCategories } from './post-insert-shared';

function plainTextFromHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function excerptFromContent(html: string) {
  const text = plainTextFromHtml(html);
  if (!text) return '';
  const max = 220;
  if (text.length <= max) return text;
  return `${text.slice(0, 217).trimEnd()}…`;
}

function sanitizeImportHtml(html: string) {
  try {
    return DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
    });
  } catch {
    // Fallback to raw HTML so one malformed document cannot crash the import action.
    return html;
  }
}

async function ensureUniqueSlug(supabase: Awaited<ReturnType<typeof createClient>>, baseSlug: string) {
  const base = baseSlug || 'post';
  for (let n = 0; n < 200; n++) {
    const candidate = n === 0 ? base : `${base}-${n + 1}`;
    const { data } = await supabase.from('posts').select('id').eq('slug', candidate).maybeSingle();
    if (!data) return candidate;
  }
  return `${base}-${Date.now()}`;
}

export async function importPostsAsDrafts(
  rows: ImportPostInput[],
  authorId: string,
  defaultCategoryId: string
): Promise<{ results: ImportRowResult[] }> {
  try {
    const supabase = await createClient();

    const { data: categories, error: catErr } = await supabase
      .from('categories')
      .select('id, slug')
      .eq('is_active', true);

    if (catErr || !categories?.length) {
      return {
        results: rows.map((row, rowIndex) => ({
          rowIndex,
          title: row.title,
          slug: row.slug || slugify(row.title),
          status: 'error' as const,
          message: catErr?.message || 'No categories available',
        })),
      };
    }

    const slugToId = new Map(
      categories
        .filter((c): c is { id: string; slug: string } => typeof c.slug === 'string' && c.slug.trim().length > 0)
        .map((c) => [c.slug.toLowerCase(), c.id])
    );

    const results: ImportRowResult[] = [];

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];

      try {
        const title = row.title?.trim();
        if (!title) {
          results.push({
            rowIndex,
            title: '(untitled)',
            slug: '',
            status: 'skipped',
            message: 'Missing title',
          });
          continue;
        }

        const rawHtml = row.content_html?.trim();
        if (!rawHtml) {
          results.push({
            rowIndex,
            title,
            slug: row.slug || slugify(title),
            status: 'skipped',
            message: 'Missing content_html',
          });
          continue;
        }

        const content_html = sanitizeImportHtml(rawHtml);
        const baseSlug = (row.slug?.trim() || slugify(title)).slice(0, 200);
        const uniqueSlug = await ensureUniqueSlug(supabase, baseSlug);

        const catSlug = row.category_slug?.trim().toLowerCase();
        const primaryCategoryId = catSlug ? slugToId.get(catSlug) ?? defaultCategoryId : defaultCategoryId;

        const excerpt = row.excerpt?.trim() || excerptFromContent(content_html);

        const form = {
          title,
          slug: uniqueSlug,
          excerpt,
          content_html,
          content_text: plainTextFromHtml(content_html),
          cover_image: row.cover_image?.trim() || '',
          author_id: authorId,
          category_id: primaryCategoryId,
          category_ids: [primaryCategoryId],
          tags: Array.isArray(row.tags) ? row.tags : [],
          status: 'draft' as const,
          published_at: null,
          featured_rank: null,
          seo_title: row.seo_title?.trim() || title,
          seo_description: row.seo_description?.trim() || excerpt,
          og_image: row.cover_image?.trim() || '',
          canonical_url: undefined as string | undefined,
        };

        const inserted = await insertPostWithCategories(supabase, form);

        if (!inserted.success) {
          results.push({
            rowIndex,
            title,
            slug: uniqueSlug,
            status: 'error',
            message: inserted.error,
          });
          continue;
        }

        results.push({
          rowIndex,
          title,
          slug: inserted.post.slug,
          postId: inserted.post.id,
          status: 'created',
        });
      } catch (error) {
        results.push({
          rowIndex,
          title: row.title?.trim() || '(untitled)',
          slug: row.slug?.trim() || slugify(row.title || 'post'),
          status: 'error',
          message: error instanceof Error ? error.message : 'Unexpected row error',
        });
      }
    }

    revalidatePath('/admin/posts');
    revalidatePath('/admin');

    return { results };
  } catch (error) {
    return {
      results: rows.map((row, rowIndex) => ({
        rowIndex,
        title: row.title || '(untitled)',
        slug: row.slug || slugify(row.title || 'post'),
        status: 'error' as const,
        message: error instanceof Error ? error.message : 'Import failed on server',
      })),
    };
  }
}

export async function publishPostIds(ids: string[]) {
  if (ids.length === 0) return { success: true as const, published: 0 };

  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('posts')
    .update({
      status: 'published',
      published_at: now,
      updated_at: now,
    })
    .in('id', ids)
    .eq('status', 'draft')
    .select('id');

  if (error) {
    return { success: false as const, error: error.message, published: 0 };
  }

  const published = data?.length ?? 0;

  revalidatePath('/admin/posts');
  revalidatePath('/admin');
  revalidatePath('/');

  return { success: true as const, published };
}
