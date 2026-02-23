// ── Ledger Businesses — Database Types ──
// Maps directly to Supabase tables defined in
// supabase/migrations/00001_initial_schema.sql

// ── Enums ──

export type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export type BannerPlacement = 'leaderboard' | 'inline-card' | 'sidebar';

export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer';

export type SubscriberStatus = 'active' | 'unsubscribed' | 'bounced';


// ── Row Types (match Supabase tables 1:1) ──

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatar_url: string;
  email: string | null;
  twitter: string | null;
  linkedin: string | null;
  website: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string | null;
  sort_order: number;
  post_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content_html: string;
  content_text: string;
  cover_image: string;
  author_id: string;
  category_id: string; // Primary category (kept for backward compatibility)
  tags: string[];
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  reading_time: number;
  featured_rank: number | null;
  view_count: number;
  like_count: number;
  seo_title: string;
  seo_description: string;
  og_image: string;
  canonical_url: string | null;
}

export interface PostCategory {
  id: string;
  post_id: string;
  category_id: string;
  is_primary: boolean;
  created_at: string;
}

export interface CategoryWithPrimary extends Category {
  is_primary?: boolean;
}

export interface PostWithRelations extends Post {
  author: Author;
  category: Category; // Primary category
  categories?: CategoryWithPrimary[]; // All categories
}

export interface PostTranslation {
  id: string;
  post_id: string;
  language: string;
  title: string;
  excerpt: string;
  content_html: string;
  content_text: string;
  seo_title: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: string;
  placement_key: BannerPlacement;
  style_variant: string;
  image_url: string;
  link_url: string;
  label: string;
  alt_text: string;
  impressions: number;
  clicks: number;
  start_date: string;
  end_date: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostView {
  id: number;
  post_id: string;
  viewer_ip: string | null;
  user_agent: string | null;
  referrer: string | null;
  country: string | null;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name: string | null;
  status: SubscriberStatus;
  source: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
}


// ── Form types for admin ──

export interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content_html: string;
  content_text: string;
  cover_image: string;
  author_id: string;
  category_id: string; // Primary category
  category_ids?: string[]; // All selected categories
  tags: string[];
  status: PostStatus;
  published_at: string | null;
  featured_rank: number | null;
  seo_title: string;
  seo_description: string;
  og_image: string;
  canonical_url?: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  color?: string;
  icon?: string;
  sort_order?: number;
}

export interface AuthorFormData {
  name: string;
  slug: string;
  bio: string;
  avatar_url?: string;
  email?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
}

export interface BannerFormData {
  placement_key: BannerPlacement;
  style_variant: string;
  image_url: string;
  link_url: string;
  label: string;
  alt_text?: string;
  start_date: string;
  end_date: string;
  active: boolean;
}


// ── Bulk import ──

export interface BulkImportRow {
  title: string;
  slug?: string;
  excerpt: string;
  content_html: string;
  category_slug: string;
  tags: string[];
  status: PostStatus;
  published_at?: string;
  cover_image?: string;
  seo_title?: string;
  seo_description?: string;
}

export interface BulkImportResult {
  row: BulkImportRow;
  status: 'valid' | 'duplicate' | 'error';
  message?: string;
}


// ── RPC return types ──

export interface SearchPostResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  published_at: string;
  reading_time: number;
  tags: string[];
  author_name: string;
  author_avatar: string;
  category_name: string;
  category_slug: string;
  rank: number;
}

export interface TrendingPostResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  published_at: string;
  reading_time: number;
  author_name: string;
  category_name: string;
  category_slug: string;
  recent_views: number;
}

export interface DashboardStats {
  published_posts: number;
  draft_posts: number;
  scheduled_posts: number;
  active_categories: number;
  active_authors: number;
  newsletter_subscribers: number;
  total_views: number;
  weekly_views: number;
}
