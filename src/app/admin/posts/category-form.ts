import type { PostFormData } from '@/lib/types/database';

/** Deduplicates IDs, ensures primary is one of the selected categories. */
export function normalizePostCategories(data: PostFormData):
  | { categoryIds: string[]; primaryCategoryId: string }
  | { error: string } {
  const rawIds =
    data.category_ids && data.category_ids.length > 0 ? data.category_ids : [data.category_id];
  const categoryIds = [...new Set(rawIds.filter(Boolean) as string[])];
  if (categoryIds.length === 0) {
    return { error: 'At least one category is required.' };
  }
  let primaryCategoryId = data.category_id;
  if (!primaryCategoryId || !categoryIds.includes(primaryCategoryId)) {
    primaryCategoryId = categoryIds[0];
  }
  return { categoryIds, primaryCategoryId };
}
