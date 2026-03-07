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
      .limit(100);

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
      .limit(8);

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
    
    // Get posts with high engagement but skip the very top ones to avoid overlap with Trending
    // Using offset to skip potential overlap with Trending
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:authors(*),
        category:categories(*)
      `)
      .eq('status', 'published')
      .order('view_count', { ascending: false })
      .range(8, 15); // Skip first 8 (Trending)

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching editor picks:', error);
    return [];
  }
}

export async function getSecondaryHeroPosts(): Promise<PostWithRelations[]> {
  try {
    const supabase = await createClient();
    
    // Get distinct posts for the second hero section
    // Using published_at to get recent but not necessarily "latest" if we want variety
    // Or we could use a different sort like random if supported, but let's stick to consistent sorting
    // We'll skip the first few to avoid overlap with the main hero
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:authors(*),
        category:categories(*)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(3, 5); // Skip top 3 (Main Hero) and take next 3

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching secondary hero posts:', error);
    return [];
  }
}

export async function getCategoryPosts(slug: string, limit = 4): Promise<PostWithRelations[]> {
  try {
    const supabase = await createClient();
    
    // First get category ID
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single();

    if (!category) return [];

    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:authors(*),
        category:categories(*)
      `)
      .eq('status', 'published')
      .eq('category_id', category.id)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching posts for category ${slug}:`, error);
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
