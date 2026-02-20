import type { Author, AuthorFormData } from '@/lib/types/database';
import { createClient } from '@/lib/supabase/client';

export async function getAuthors(): Promise<Author[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) throw error;
  return (data as Author[]) || [];
}

export async function getAllAuthors(): Promise<Author[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return (data as Author[]) || [];
}

export async function getAuthorById(id: string): Promise<Author | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Author;
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data as Author;
}

export async function createAuthor(formData: AuthorFormData): Promise<Author> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('authors')
    .insert(formData)
    .select()
    .single();

  if (error) throw error;
  return data as Author;
}

export async function updateAuthor(id: string, formData: Partial<AuthorFormData>): Promise<Author> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('authors')
    .update(formData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Author;
}

export async function deleteAuthor(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('authors').delete().eq('id', id);
  if (error) throw error;
}
