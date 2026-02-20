import type { Category, CategoryFormData } from '@/lib/types/database';
import { createClient } from '@/lib/supabase/client';

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return (data as Category[]) || [];
}

export async function getAllCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return (data as Category[]) || [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data as Category;
}

export async function createCategory(formData: CategoryFormData): Promise<Category> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .insert({ ...formData, post_count: 0 })
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

export async function updateCategory(id: string, formData: Partial<CategoryFormData>): Promise<Category> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .update(formData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}
