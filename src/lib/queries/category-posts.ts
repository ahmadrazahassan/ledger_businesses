import { createClient } from '@/lib/supabase/server';
import type { PostWithRelations } from '@/lib/types/database';

const postSelect = `
  *,
  author:authors(*),
  category:categories(*)
`;

/**
 * Published posts linked to a category via `post_categories` (all selected categories),
 * not only `posts.category_id` (primary). Use for category pages and homepage topic strips.
 */
export async function getPublishedPostsForCategoryId(
  categoryId: string,
  options?: { limit?: number }
): Promise<PostWithRelations[]> {
  const supabase = await createClient();

  const { data: links, error: linkError } = await supabase
    .from('post_categories')
    .select('post_id')
    .eq('category_id', categoryId);

  if (linkError) {
    console.error('post_categories by category_id:', linkError);
    return [];
  }

  const junctionIds = [...new Set((links ?? []).map((r) => r.post_id))];

  const { data: primaryRows } = await supabase
    .from('posts')
    .select('id')
    .eq('category_id', categoryId)
    .eq('status', 'published');

  const primaryIds = (primaryRows ?? []).map((r) => r.id);
  const ids = [...new Set([...junctionIds, ...primaryIds])];

  if (ids.length === 0) return [];

  let query = supabase
    .from('posts')
    .select(postSelect)
    .in('id', ids)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (options?.limit != null) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error('posts for category junction:', error);
    return [];
  }

  return (data as PostWithRelations[]) ?? [];
}
