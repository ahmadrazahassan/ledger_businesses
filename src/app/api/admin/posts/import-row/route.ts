import { NextResponse } from 'next/server';
import DOMPurify from 'isomorphic-dompurify';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/utils';
import { insertPostWithCategories } from '@/app/admin/posts/post-insert-shared';
import type { ImportPostInput, ImportRowResult } from '@/lib/types/database';

export const runtime = 'nodejs';
export const maxDuration = 60;

type ImportRowRequest = {
  row: ImportPostInput;
  rowIndex: number;
  authorId: string;
  defaultCategoryId: string;
};

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
    return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  } catch {
    return html;
  }
}

async function ensureUniqueSlug(supabase: Awaited<ReturnType<typeof createClient>>, baseSlug: string) {
  const base = baseSlug || 'post';
  for (let n = 0; n < 100; n++) {
    const candidate = n === 0 ? base : `${base}-${n + 1}`;
    const { data } = await supabase.from('posts').select('id').eq('slug', candidate).maybeSingle();
    if (!data) return candidate;
  }
  return `${base}-${Date.now()}`;
}

export async function POST(req: Request) {
  let body: ImportRowRequest | null = null;
  try {
    body = (await req.json()) as ImportRowRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const row = body?.row;
  const rowIndex = typeof body?.rowIndex === 'number' ? body.rowIndex : 0;
  const authorId = body?.authorId?.trim();
  const defaultCategoryId = body?.defaultCategoryId?.trim();

  if (!row || !authorId || !defaultCategoryId) {
    return NextResponse.json({ error: 'row, authorId and defaultCategoryId are required' }, { status: 400 });
  }

  const title = row.title?.trim();
  if (!title) {
    const result: ImportRowResult = {
      rowIndex,
      title: '(untitled)',
      slug: '',
      status: 'skipped',
      message: 'Missing title',
    };
    return NextResponse.json({ result });
  }

  const rawHtml = row.content_html?.trim();
  if (!rawHtml) {
    const result: ImportRowResult = {
      rowIndex,
      title,
      slug: row.slug || slugify(title),
      status: 'skipped',
      message: 'Missing content_html',
    };
    return NextResponse.json({ result });
  }

  try {
    const supabase = await createClient();
    const { data: categories, error: catErr } = await supabase
      .from('categories')
      .select('id, slug')
      .eq('is_active', true);

    if (catErr || !categories?.length) {
      return NextResponse.json(
        {
          result: {
            rowIndex,
            title,
            slug: row.slug || slugify(title),
            status: 'error',
            message: catErr?.message || 'No categories available',
          } satisfies ImportRowResult,
        },
        { status: 200 }
      );
    }

    const slugToId = new Map(
      categories
        .filter((c): c is { id: string; slug: string } => typeof c.slug === 'string' && c.slug.trim().length > 0)
        .map((c) => [c.slug.toLowerCase(), c.id])
    );

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
      return NextResponse.json({
        result: {
          rowIndex,
          title,
          slug: uniqueSlug,
          status: 'error',
          message: inserted.error,
        } satisfies ImportRowResult,
      });
    }

    revalidatePath('/admin/posts');
    revalidatePath('/admin');

    return NextResponse.json({
      result: {
        rowIndex,
        title,
        slug: inserted.post.slug,
        postId: inserted.post.id,
        status: 'created',
      } satisfies ImportRowResult,
    });
  } catch (error) {
    return NextResponse.json({
      result: {
        rowIndex,
        title,
        slug: row.slug || slugify(title),
        status: 'error',
        message: error instanceof Error ? error.message : 'Import failed on server',
      } satisfies ImportRowResult,
    });
  }
}
