'use server';

import { createClient } from '@/lib/supabase/server';
import type { PostWithRelations } from '@/lib/types/database';

export async function getFeaturedPosts(): Promise<PostWithRelations[]> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:authors(*),
        category:categories(*)
      `)
      .eq('status', 'published')
      .not('featured_rank', 'is', null)
      .order('featured_rank', { ascending: true })
      .limit(3);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }
}

export async function getLatestPosts(): Promise<PostWithRelations[]> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:authors(*),
        category:categories(*)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    return [];
  }
}

export async function getTrendingPosts(): Promise<PostWithRelations[]> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:authors(*),
        category:categories(*)
      `)
      .eq('status', 'published')
      .order('view_count', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    return [];
  }
}

export async function getEditorPicks(): Promise<PostWithRelations[]> {
  try {
    const supabase = await createClient();
    
    // Get posts with highest engagement (views + likes)
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:authors(*),
        category:categories(*)
      `)
      .eq('status', 'published')
      .order('view_count', { ascending: false })
      .limit(8);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching editor picks:', error);
    return [];
  }
}

export async function getActiveCategories() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
