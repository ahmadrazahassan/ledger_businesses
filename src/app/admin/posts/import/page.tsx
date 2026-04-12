import { createClient } from '@/lib/supabase/server';
import { ImportPostsForm } from './import-posts-form';

export default async function ImportPostsPage() {
  const supabase = await createClient();

  const [authorsRes, categoriesRes] = await Promise.all([
    supabase.from('authors').select('id, name').eq('is_active', true).order('name'),
    supabase.from('categories').select('id, name, slug').eq('is_active', true).order('sort_order'),
  ]);

  const initialAuthors = authorsRes.error ? [] : (authorsRes.data ?? []);
  const initialCategories = categoriesRes.error ? [] : (categoriesRes.data ?? []);

  const serverLoadError =
    authorsRes.error?.message || categoriesRes.error?.message || null;

  return (
    <ImportPostsForm
      initialAuthors={initialAuthors}
      initialCategories={initialCategories}
      serverLoadError={serverLoadError}
    />
  );
}
