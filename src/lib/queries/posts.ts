import type { Post, PostWithRelations, PostFormData } from '@/lib/types/database';
import { createClient } from '@/lib/supabase/client';

// ── Public Queries (client-side, RLS-enforced) ──

export async function getPosts(options?: {
  category?: string;
  status?: string;
  limit?: number;
  offset?: number;
  sort?: 'latest' | 'oldest' | 'popular';
}): Promise<PostWithRelations[]> {
  const supabase = createClient();
  let query = supabase
    .from('posts')
    .select('*, author:authors(*), category:categories(*)')
    .eq('status', options?.status || 'published')
    .order(
      options?.sort === 'popular' ? 'view_count' : 'published_at',
      { ascending: options?.sort === 'oldest' }
    );

  if (options?.category) {
    query = query.eq('category_id', options.category);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as PostWithRelations[]) || [];
}

export async function getPostBySlug(slug: string): Promise<PostWithRelations | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*, author:authors(*), category:categories(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) return null;
  return data as unknown as PostWithRelations;
}

export async function getFeaturedPosts(limit = 3): Promise<PostWithRelations[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*, author:authors(*), category:categories(*)')
    .eq('status', 'published')
    .not('featured_rank', 'is', null)
    .order('featured_rank', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data as unknown as PostWithRelations[]) || [];
}

export async function getTrendingPosts(limit = 8): Promise<PostWithRelations[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*, author:authors(*), category:categories(*)')
    .eq('status', 'published')
    .order('view_count', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as unknown as PostWithRelations[]) || [];
}

export async function searchPosts(query: string): Promise<PostWithRelations[]> {
  const supabase = createClient();

  // Try the full-text search RPC first
  const { data: rpcData, error: rpcError } = await supabase
    .rpc('search_posts', {
      search_query: query,
      result_limit: 20,
      result_offset: 0,
    });

  if (!rpcError && rpcData && rpcData.length > 0) {
    // RPC returns flat rows; re-query for full relations
    const ids = rpcData.map((r: { id: string }) => r.id);
    const { data, error } = await supabase
      .from('posts')
      .select('*, author:authors(*), category:categories(*)')
      .in('id', ids)
      .eq('status', 'published');

    if (!error && data) return data as unknown as PostWithRelations[];
  }

  // Fallback to ILIKE search
  const { data, error } = await supabase
    .from('posts')
    .select('*, author:authors(*), category:categories(*)')
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content_text.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(20);

  if (error) throw error;
  return (data as unknown as PostWithRelations[]) || [];
}

export async function getPostsByCategory(categorySlug: string, limit = 20): Promise<PostWithRelations[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*, author:authors(*), category:categories!inner(*)')
    .eq('status', 'published')
    .eq('categories.slug', categorySlug)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as unknown as PostWithRelations[]) || [];
}

export async function getRelatedPosts(postId: string, categoryId: string, limit = 3): Promise<PostWithRelations[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*, author:authors(*), category:categories(*)')
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .neq('id', postId)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as unknown as PostWithRelations[]) || [];
}

// ── Track view (fire-and-forget) ──

export async function trackPostView(postId: string): Promise<void> {
  const supabase = createClient();
  await supabase.rpc('increment_post_views', { target_post_id: postId });
}


// ── Admin Queries (client-side, authenticated) ──

export async function createPost(data: PostFormData): Promise<Post> {
  const supabase = createClient();
  const { data: post, error } = await supabase
    .from('posts')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return post as Post;
}

export async function updatePost(id: string, data: Partial<PostFormData>): Promise<Post> {
  const supabase = createClient();
  const { data: post, error } = await supabase
    .from('posts')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return post as Post;
}

export async function deletePost(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
}

export async function getAllPostsAdmin(): Promise<PostWithRelations[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*, author:authors(*), category:categories(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as unknown as PostWithRelations[]) || [];
}

export async function checkSlugExists(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = createClient();
  let query = supabase
    .from('posts')
    .select('id')
    .eq('slug', slug);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data } = await query;
  return (data?.length || 0) > 0;
}
