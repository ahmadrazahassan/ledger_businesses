'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/utils';
import type { PostStatus } from '@/lib/types/database';

export interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content_html: string;
  content_text: string;
  cover_image: string;
  author_id: string;
  category_id: string;
  tags: string[];
  status: PostStatus;
  published_at: string | null;
  featured_rank: number | null;
  seo_title: string;
  seo_description: string;
  og_image: string;
  canonical_url?: string;
}

export async function createPost(data: PostFormData) {
  try {
    const supabase = await createClient();

    // Extract text content from HTML
    const textContent = data.content_html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Calculate reading time (238 words per minute)
    const wordCount = textContent.split(' ').length;
    const reading_time = Math.max(1, Math.ceil(wordCount / 238));

    // Prepare post data
    const postData = {
      title: data.title,
      slug: data.slug || slugify(data.title),
      excerpt: data.excerpt,
      content_html: data.content_html,
      content_text: textContent,
      cover_image: data.cover_image || '',
      author_id: data.author_id,
      category_id: data.category_id,
      tags: data.tags,
      status: data.status,
      published_at: data.status === 'published' && !data.published_at 
        ? new Date().toISOString() 
        : data.published_at,
      reading_time,
      featured_rank: data.featured_rank,
      seo_title: data.seo_title || data.title,
      seo_description: data.seo_description || data.excerpt,
      og_image: data.og_image || data.cover_image || '',
      canonical_url: data.canonical_url || null,
    };

    const { data: post, error } = await supabase
      .from('posts')
      .insert(postData)
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/posts');
    revalidatePath('/admin');
    
    return { success: true, post };
  } catch (error) {
    console.error('Exception creating post:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create post',
    };
  }
}

export async function updatePost(id: string, data: PostFormData) {
  try {
    const supabase = await createClient();

    // Extract text content from HTML
    const textContent = data.content_html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Calculate reading time
    const wordCount = textContent.split(' ').length;
    const reading_time = Math.max(1, Math.ceil(wordCount / 238));

    const postData = {
      title: data.title,
      slug: data.slug || slugify(data.title),
      excerpt: data.excerpt,
      content_html: data.content_html,
      content_text: textContent,
      cover_image: data.cover_image || '',
      author_id: data.author_id,
      category_id: data.category_id,
      tags: data.tags,
      status: data.status,
      published_at: data.published_at,
      reading_time,
      featured_rank: data.featured_rank,
      seo_title: data.seo_title || data.title,
      seo_description: data.seo_description || data.excerpt,
      og_image: data.og_image || data.cover_image || '',
      canonical_url: data.canonical_url || null,
      updated_at: new Date().toISOString(),
    };

    const { data: post, error } = await supabase
      .from('posts')
      .update(postData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating post:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/posts');
    revalidatePath(`/admin/posts/${id}/edit`);
    revalidatePath('/admin');
    
    return { success: true, post };
  } catch (error) {
    console.error('Exception updating post:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update post',
    };
  }
}

export async function deletePost(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting post:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/posts');
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error) {
    console.error('Exception deleting post:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete post',
    };
  }
}

export async function getAuthors() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching authors:', error);
    return [];
  }
}

export async function getCategories() {
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

export async function getPosts() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:authors(*),
        category:categories(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPost(id: string) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:authors(*),
        category:categories(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}
