import type { DashboardStats } from '@/lib/types/database';
import { createClient } from '@/lib/supabase/client';

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('v_dashboard_stats')
    .select('*')
    .single();

  if (error) {
    // Fallback: compute stats individually if the view doesn't exist
    const [posts, drafts, scheduled, categories, authors, subscribers] = await Promise.all([
      supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
      supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'scheduled'),
      supabase.from('categories').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('authors').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    ]);

    return {
      published_posts: posts.count || 0,
      draft_posts: drafts.count || 0,
      scheduled_posts: scheduled.count || 0,
      active_categories: categories.count || 0,
      active_authors: authors.count || 0,
      newsletter_subscribers: subscribers.count || 0,
      total_views: 0,
      weekly_views: 0,
    };
  }

  return data as DashboardStats;
}
