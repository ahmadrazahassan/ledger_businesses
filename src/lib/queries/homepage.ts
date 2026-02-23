'use server';

import { createClient } from '@/lib/supabase/server';
import type { PostWithRelations } from '@/lib/types/database';

export async function getFeaturedPosts(): Promise<PostWithRelations[]> {
  try {
    const supabase = await createClient();
    
    // First try to get posts with featured_rank
    const { data: featuredData, error: featuredError } = await supabase
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

    if (featuredError) throw featuredError;
    
    // If we have featured posts, fetch their categories and return
    if (featuredData && featuredData.length > 0) {
      // Fetch categories for each post
      for (const post of featuredData) {
        const { data: postCategories } = await supabase
          .from('post_categories')
          .select(`
            category_id,
            is_primary,
            category:categories(*)
          `)
          .eq('post_id', post.id);

        if (postCategories) {
          post.categories = postCategories.map(pc => ({
            ...pc.category,
            is_primary: pc.is_primary,
          }));
        }
      }
      return featuredData;
    }
    
    // Otherwise, fall back to latest posts with highest views
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('posts')
      .select(`
        *,
        author:authors(*),
        category:categories(*)
      `)
      .eq('status', 'published')
      .order('view_count', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(3);

    if (fallbackError) throw fallbackError;
    
    // Fetch categories for fallback posts
    if (fallbackData) {
      for (const post of fallbackData) {
        const { data: postCategories } = await supabase
          .from('post_categories')
          .select(`
            category_id,
            is_primary,
            category:categories(*)
          `)
          .eq('post_id', post.id);

        if (postCategories) {
          post.categories = postCategories.map(pc => ({
            ...pc.category,
            is_primary: pc.is_primary,
          }));
        }
      }
    }
    
    return fallbackData || [];
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
