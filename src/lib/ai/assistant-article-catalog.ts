import { createClient } from '@/lib/supabase/server';
import { toAbsoluteUrl } from '@/lib/site';

export type AssistantArticleLine = {
  title: string;
  slug: string;
  url: string;
  categoryName: string;
  blurb: string;
};

const MAX_ARTICLES = 40;
const MAX_BLURB = 180;

/**
 * Recent published posts for the assistant system prompt so the model can recommend real article URLs only.
 */
export async function fetchAssistantArticleCatalog(): Promise<AssistantArticleLine[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('posts')
      .select('title, slug, excerpt, category:categories(name, slug)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(MAX_ARTICLES);

    if (error || !data?.length) return [];

    return data.map((row) => {
      const excerpt = (row.excerpt ?? '').replace(/\s+/g, ' ').trim();
      const blurb =
        excerpt.length > MAX_BLURB
          ? `${excerpt.slice(0, MAX_BLURB - 1).trimEnd()}…`
          : excerpt;
      const categoryName = row.category && typeof row.category === 'object' && 'name' in row.category
        ? String((row.category as { name: string }).name)
        : 'General';
      return {
        title: row.title,
        slug: row.slug,
        url: toAbsoluteUrl(`/articles/${row.slug}`),
        categoryName,
        blurb,
      };
    });
  } catch {
    return [];
  }
}
