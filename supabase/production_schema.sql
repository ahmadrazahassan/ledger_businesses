-- ╔══════════════════════════════════════════════════════════════════╗
-- ║  LEDGER BUSINESSES — Production Database Schema                ║
-- ║  Supabase SQL Editor — Paste & Run                             ║
-- ║  Version: 2.0.0 (Production Ready)                             ║
-- ║  Generated: 2026-02-20                                         ║
-- ╚══════════════════════════════════════════════════════════════════╝
--
-- This file creates a complete, production-ready database schema:
--   1. Extensions (uuid, full-text search)
--   2. Custom enums (post_status, banner_placement, user_role, subscriber_status)
--   3. All tables with proper constraints and relationships
--   4. Performance indexes
--   5. Automated triggers (updated_at, post_count sync, search vectors)
--   6. RPC functions (search, trending, dashboard stats)
--   7. Row Level Security (RLS) policies
--   8. Storage buckets (covers, avatars, banners)
--   9. Single author: Fiza Kanwal
--   10. Essential categories (no dummy data)
--
-- IMPORTANT: Run this ONCE in a fresh Supabase project.
-- ──────────────────────────────────────────────────────────────────


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 0. EXTENSIONS
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 1. ENUMS
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO $$ BEGIN
  CREATE TYPE post_status AS ENUM ('draft', 'published', 'scheduled', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE banner_placement AS ENUM ('leaderboard', 'inline-card', 'sidebar');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('owner', 'admin', 'editor', 'viewer');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE subscriber_status AS ENUM ('active', 'unsubscribed', 'bounced');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 2. TABLES
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


-- ── 2.1 PROFILES (linked to auth.users) ──

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  avatar_url  TEXT DEFAULT '',
  role        user_role NOT NULL DEFAULT 'viewer',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'User profiles linked 1:1 to Supabase Auth. Role determines admin access level.';


-- ── 2.2 AUTHORS ──

CREATE TABLE IF NOT EXISTS public.authors (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  bio         TEXT NOT NULL DEFAULT '',
  avatar_url  TEXT DEFAULT '',
  email       TEXT,
  twitter     TEXT,
  linkedin    TEXT,
  website     TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_authors_slug ON public.authors(slug);
CREATE INDEX IF NOT EXISTS idx_authors_active ON public.authors(is_active) WHERE is_active = true;

COMMENT ON TABLE public.authors IS 'Editorial authors / contributors. Separate from auth profiles.';


-- ── 2.3 CATEGORIES ──

CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  color       TEXT NOT NULL DEFAULT '#1e1f26',
  icon        TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  post_count  INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON public.categories(sort_order);

COMMENT ON TABLE public.categories IS 'Article categories. post_count is auto-synced via trigger.';


-- ── 2.4 POSTS ──

CREATE TABLE IF NOT EXISTS public.posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  excerpt         TEXT NOT NULL DEFAULT '',
  content_html    TEXT NOT NULL DEFAULT '',
  content_text    TEXT NOT NULL DEFAULT '',
  cover_image     TEXT DEFAULT '',
  author_id       UUID NOT NULL REFERENCES public.authors(id) ON DELETE RESTRICT,
  category_id     UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  tags            TEXT[] NOT NULL DEFAULT '{}',
  status          post_status NOT NULL DEFAULT 'draft',
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  reading_time    INT NOT NULL DEFAULT 1,
  featured_rank   INT,
  view_count      INT NOT NULL DEFAULT 0,
  like_count      INT NOT NULL DEFAULT 0,
  -- SEO
  seo_title       TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  og_image        TEXT DEFAULT '',
  canonical_url   TEXT,
  -- Full-text search vector (auto-maintained)
  search_vector   TSVECTOR
);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.posts(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON public.posts(featured_rank) WHERE featured_rank IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_posts_tags ON public.posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_posts_search ON public.posts USING GIN(search_vector);

COMMENT ON TABLE public.posts IS 'Core content table. English is primary language; translations in post_translations.';


-- ── 2.5 POST TRANSLATIONS (multilingual support) ──

CREATE TABLE IF NOT EXISTS public.post_translations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id         UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  language        TEXT NOT NULL DEFAULT 'ar',
  title           TEXT NOT NULL,
  excerpt         TEXT NOT NULL DEFAULT '',
  content_html    TEXT NOT NULL DEFAULT '',
  content_text    TEXT NOT NULL DEFAULT '',
  seo_title       TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(post_id, language)
);

CREATE INDEX IF NOT EXISTS idx_translations_post ON public.post_translations(post_id);
CREATE INDEX IF NOT EXISTS idx_translations_lang ON public.post_translations(language);

COMMENT ON TABLE public.post_translations IS 'Translations keyed by post + language. Add rows for each language.';


-- ── 2.6 BANNERS / ADS ──

CREATE TABLE IF NOT EXISTS public.banners (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  placement_key   banner_placement NOT NULL,
  style_variant   TEXT NOT NULL DEFAULT 'default',
  image_url       TEXT DEFAULT '',
  link_url        TEXT NOT NULL DEFAULT '',
  label           TEXT NOT NULL DEFAULT 'Sponsor',
  alt_text        TEXT DEFAULT '',
  impressions     INT NOT NULL DEFAULT 0,
  clicks          INT NOT NULL DEFAULT 0,
  start_date      TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_date        TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '1 year'),
  active          BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_banners_placement ON public.banners(placement_key);
CREATE INDEX IF NOT EXISTS idx_banners_active ON public.banners(active, start_date, end_date);

COMMENT ON TABLE public.banners IS 'Sponsor/ad placements. Filtered by placement_key + active + date range.';


-- ── 2.7 POST VIEWS (analytics) ──

CREATE TABLE IF NOT EXISTS public.post_views (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_id     UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  viewer_ip   INET,
  user_agent  TEXT,
  referrer    TEXT,
  country     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_post_views_post ON public.post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_post_views_created ON public.post_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_views_recent ON public.post_views(post_id, created_at DESC);

COMMENT ON TABLE public.post_views IS 'Granular page-view analytics per post. Rolled up via view_count on posts.';


-- ── 2.8 NEWSLETTER SUBSCRIBERS ──

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           TEXT NOT NULL UNIQUE,
  name            TEXT,
  status          subscriber_status NOT NULL DEFAULT 'active',
  source          TEXT NOT NULL DEFAULT 'website',
  subscribed_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON public.newsletter_subscribers(status);

COMMENT ON TABLE public.newsletter_subscribers IS 'Email newsletter list. Managed from admin panel.';


-- ── 2.9 SITE SETTINGS (key-value) ──

CREATE TABLE IF NOT EXISTS public.site_settings (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.site_settings IS 'Global site configuration. Key-value store for flexible settings.';


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 3. TRIGGERS & FUNCTIONS
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


-- ── 3.1 Auto-update updated_at ──

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$ BEGIN
  CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.authors
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.post_translations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.banners
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ── 3.2 Auto-generate search vector on posts ──

CREATE OR REPLACE FUNCTION public.posts_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.excerpt, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.content_text, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$ BEGIN
  CREATE TRIGGER posts_search_vector_trigger
    BEFORE INSERT OR UPDATE OF title, excerpt, content_text, tags ON public.posts
    FOR EACH ROW EXECUTE FUNCTION public.posts_search_vector_update();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ── 3.3 Auto-sync category post_count ──

CREATE OR REPLACE FUNCTION public.sync_category_post_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Recount for affected categories
  IF TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN
    UPDATE public.categories SET post_count = (
      SELECT COUNT(*) FROM public.posts
      WHERE category_id = OLD.category_id AND status = 'published'
    ) WHERE id = OLD.category_id;
  END IF;

  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.categories SET post_count = (
      SELECT COUNT(*) FROM public.posts
      WHERE category_id = NEW.category_id AND status = 'published'
    ) WHERE id = NEW.category_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$ BEGIN
  CREATE TRIGGER sync_post_count
    AFTER INSERT OR UPDATE OF category_id, status OR DELETE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION public.sync_category_post_count();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ── 3.4 Auto-create profile on user signup ──

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    'viewer'::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ── 3.5 Increment view count on post_views insert ──

CREATE OR REPLACE FUNCTION public.increment_post_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.posts
  SET view_count = view_count + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$ BEGIN
  CREATE TRIGGER on_post_view_insert
    AFTER INSERT ON public.post_views
    FOR EACH ROW EXECUTE FUNCTION public.increment_post_view_count();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ── 3.6 Increment banner impressions/clicks ──

CREATE OR REPLACE FUNCTION public.record_banner_impression(banner_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.banners SET impressions = impressions + 1 WHERE id = banner_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.record_banner_click(banner_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.banners SET clicks = clicks + 1 WHERE id = banner_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 4. RPC FUNCTIONS (called from the frontend)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


-- ── 4.1 Full-text search ──

CREATE OR REPLACE FUNCTION public.search_posts(
  search_query TEXT,
  result_limit INT DEFAULT 20,
  result_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  excerpt TEXT,
  cover_image TEXT,
  published_at TIMESTAMPTZ,
  reading_time INT,
  tags TEXT[],
  author_name TEXT,
  author_avatar TEXT,
  category_name TEXT,
  category_slug TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    p.cover_image,
    p.published_at,
    p.reading_time,
    p.tags,
    a.name AS author_name,
    a.avatar_url AS author_avatar,
    c.name AS category_name,
    c.slug AS category_slug,
    ts_rank(p.search_vector, websearch_to_tsquery('english', search_query)) AS rank
  FROM public.posts p
  JOIN public.authors a ON a.id = p.author_id
  JOIN public.categories c ON c.id = p.category_id
  WHERE p.status = 'published'
    AND (
      p.search_vector @@ websearch_to_tsquery('english', search_query)
      OR p.title ILIKE '%' || search_query || '%'
      OR p.excerpt ILIKE '%' || search_query || '%'
    )
  ORDER BY rank DESC, p.published_at DESC
  LIMIT result_limit
  OFFSET result_offset;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;


-- ── 4.2 Trending posts (by recent views in last 7 days) ──

CREATE OR REPLACE FUNCTION public.get_trending_posts(
  result_limit INT DEFAULT 8
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  excerpt TEXT,
  cover_image TEXT,
  published_at TIMESTAMPTZ,
  reading_time INT,
  author_name TEXT,
  category_name TEXT,
  category_slug TEXT,
  recent_views BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    p.cover_image,
    p.published_at,
    p.reading_time,
    a.name AS author_name,
    c.name AS category_name,
    c.slug AS category_slug,
    COUNT(pv.id) AS recent_views
  FROM public.posts p
  JOIN public.authors a ON a.id = p.author_id
  JOIN public.categories c ON c.id = p.category_id
  LEFT JOIN public.post_views pv ON pv.post_id = p.id
    AND pv.created_at > now() - INTERVAL '7 days'
  WHERE p.status = 'published'
  GROUP BY p.id, p.title, p.slug, p.excerpt, p.cover_image,
           p.published_at, p.reading_time, a.name, c.name, c.slug
  ORDER BY recent_views DESC, p.published_at DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;


-- ── 4.3 Dashboard statistics (admin) ──

CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS TABLE (
  published_posts BIGINT,
  draft_posts BIGINT,
  scheduled_posts BIGINT,
  active_categories BIGINT,
  active_authors BIGINT,
  newsletter_subscribers BIGINT,
  total_views BIGINT,
  weekly_views BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM public.posts WHERE status = 'published'),
    (SELECT COUNT(*) FROM public.posts WHERE status = 'draft'),
    (SELECT COUNT(*) FROM public.posts WHERE status = 'scheduled'),
    (SELECT COUNT(*) FROM public.categories WHERE is_active = true),
    (SELECT COUNT(*) FROM public.authors WHERE is_active = true),
    (SELECT COUNT(*) FROM public.newsletter_subscribers WHERE status = 'active'),
    (SELECT COALESCE(SUM(view_count), 0) FROM public.posts),
    (SELECT COUNT(*) FROM public.post_views WHERE created_at > now() - INTERVAL '7 days');
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;


-- ── 4.4 Get active banner by placement ──

CREATE OR REPLACE FUNCTION public.get_active_banner(p_placement banner_placement)
RETURNS SETOF public.banners AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.banners
  WHERE placement_key = p_placement
    AND active = true
    AND start_date <= now()
    AND end_date >= now()
  ORDER BY created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;


-- ── 4.5 Check if user is admin ──

CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role IN ('owner', 'admin', 'editor')
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;


-- ── 4.6 Auto-publish scheduled posts (call via cron or edge function) ──

CREATE OR REPLACE FUNCTION public.publish_scheduled_posts()
RETURNS INT AS $$
DECLARE
  affected INT;
BEGIN
  UPDATE public.posts
  SET status = 'published'
  WHERE status = 'scheduled'
    AND published_at <= now();
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 5. ROW LEVEL SECURITY (RLS)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


-- ── 5.1 Profiles ──

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles: public read" ON public.profiles;
CREATE POLICY "Profiles: public read"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Profiles: owner update" ON public.profiles;
CREATE POLICY "Profiles: owner update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- ── 5.2 Authors ──

ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authors: public read" ON public.authors;
CREATE POLICY "Authors: public read"
  ON public.authors FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authors: admin manage" ON public.authors;
CREATE POLICY "Authors: admin manage"
  ON public.authors FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));


-- ── 5.3 Categories ──

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Categories: public read" ON public.categories;
CREATE POLICY "Categories: public read"
  ON public.categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Categories: admin manage" ON public.categories;
CREATE POLICY "Categories: admin manage"
  ON public.categories FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));


-- ── 5.4 Posts ──

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Posts: public read published" ON public.posts;
CREATE POLICY "Posts: public read published"
  ON public.posts FOR SELECT
  USING (status = 'published' OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Posts: admin manage" ON public.posts;
CREATE POLICY "Posts: admin manage"
  ON public.posts FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));


-- ── 5.5 Post Translations ──

ALTER TABLE public.post_translations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Translations: public read" ON public.post_translations;
CREATE POLICY "Translations: public read"
  ON public.post_translations FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Translations: admin manage" ON public.post_translations;
CREATE POLICY "Translations: admin manage"
  ON public.post_translations FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));


-- ── 5.6 Banners ──

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Banners: public read active" ON public.banners;
CREATE POLICY "Banners: public read active"
  ON public.banners FOR SELECT
  USING (active = true OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Banners: admin manage" ON public.banners;
CREATE POLICY "Banners: admin manage"
  ON public.banners FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));


-- ── 5.7 Post Views ──

ALTER TABLE public.post_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Post views: anyone insert" ON public.post_views;
CREATE POLICY "Post views: anyone insert"
  ON public.post_views FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Post views: admin read" ON public.post_views;
CREATE POLICY "Post views: admin read"
  ON public.post_views FOR SELECT
  USING (public.is_admin(auth.uid()));


-- ── 5.8 Newsletter Subscribers ──

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Newsletter: anyone subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Newsletter: anyone subscribe"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Newsletter: admin read" ON public.newsletter_subscribers;
CREATE POLICY "Newsletter: admin read"
  ON public.newsletter_subscribers FOR SELECT
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Newsletter: admin manage" ON public.newsletter_subscribers;
CREATE POLICY "Newsletter: admin manage"
  ON public.newsletter_subscribers FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));


-- ── 5.9 Site Settings ──

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Settings: public read" ON public.site_settings;
CREATE POLICY "Settings: public read"
  ON public.site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Settings: admin manage" ON public.site_settings;
CREATE POLICY "Settings: admin manage"
  ON public.site_settings FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 6. STORAGE BUCKETS
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('covers', 'covers', true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/avif']),
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg','image/png','image/webp']),
  ('banners', 'banners', true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO NOTHING;


-- Storage policies: public read, admin upload

-- Covers
DROP POLICY IF EXISTS "Covers: public read" ON storage.objects;
CREATE POLICY "Covers: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');

DROP POLICY IF EXISTS "Covers: admin upload" ON storage.objects;
CREATE POLICY "Covers: admin upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'covers' AND public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Covers: admin update" ON storage.objects;
CREATE POLICY "Covers: admin update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'covers' AND public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Covers: admin delete" ON storage.objects;
CREATE POLICY "Covers: admin delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'covers' AND public.is_admin(auth.uid()));

-- Avatars
DROP POLICY IF EXISTS "Avatars: public read" ON storage.objects;
CREATE POLICY "Avatars: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Avatars: admin upload" ON storage.objects;
CREATE POLICY "Avatars: admin upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Avatars: admin update" ON storage.objects;
CREATE POLICY "Avatars: admin update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Avatars: admin delete" ON storage.objects;
CREATE POLICY "Avatars: admin delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND public.is_admin(auth.uid()));

-- Banners
DROP POLICY IF EXISTS "Banners media: public read" ON storage.objects;
CREATE POLICY "Banners media: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'banners');

DROP POLICY IF EXISTS "Banners media: admin upload" ON storage.objects;
CREATE POLICY "Banners media: admin upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'banners' AND public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Banners media: admin update" ON storage.objects;
CREATE POLICY "Banners media: admin update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'banners' AND public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Banners media: admin delete" ON storage.objects;
CREATE POLICY "Banners media: admin delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'banners' AND public.is_admin(auth.uid()));


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 7. PRODUCTION DATA (Author + Categories Only)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


-- ── 7.1 Author: Fiza Kanwal ──

INSERT INTO public.authors (id, name, slug, bio, avatar_url, email, twitter, linkedin, is_active) VALUES
  (
    'a1111111-1111-1111-1111-111111111111',
    'Fiza Kanwal',
    'fiza-kanwal',
    'Senior editor covering enterprise technology, AI, B2B strategy, and the future of work. Passionate about making complex business concepts accessible to decision-makers.',
    '',
    'fiza@ledgerbusinesses.com',
    'fizakanwal',
    'fizakanwal',
    true
  )
ON CONFLICT (slug) DO NOTHING;


-- ── 7.2 Essential Categories ──

INSERT INTO public.categories (id, name, slug, description, color, sort_order, is_active) VALUES
  (
    'c1111111-1111-1111-1111-111111111111',
    'Business',
    'business',
    'Strategy, operations, and leadership insights for modern enterprises.',
    '#05ce78',
    1,
    true
  ),
  (
    'c2222222-2222-2222-2222-222222222222',
    'Artificial Intelligence',
    'ai',
    'AI research, implementation strategies, and industry impact analysis.',
    '#3b82f6',
    2,
    true
  ),
  (
    'c3333333-3333-3333-3333-333333333333',
    'Startups',
    'startups',
    'Funding rounds, founder stories, and the evolving startup landscape.',
    '#f59e0b',
    3,
    true
  ),
  (
    'c4444444-4444-4444-4444-444444444444',
    'B2B',
    'b2b',
    'Enterprise sales, SaaS metrics, and business-to-business technology trends.',
    '#8b5cf6',
    4,
    true
  ),
  (
    'c5555555-5555-5555-5555-555555555555',
    'Software',
    'software',
    'Engineering practices, architecture decisions, and developer tooling.',
    '#ef4444',
    5,
    true
  ),
  (
    'c6666666-6666-6666-6666-666666666666',
    'GPTs & LLMs',
    'gpts',
    'Large language models, prompt engineering, and generative AI applications.',
    '#06b6d4',
    6,
    true
  ),
  (
    'c7777777-7777-7777-7777-777777777777',
    'Case Studies',
    'case-studies',
    'In-depth analysis of real-world implementations and their outcomes.',
    '#84cc16',
    7,
    true
  ),
  (
    'c8888888-8888-8888-8888-888888888888',
    'Funding',
    'funding',
    'Venture capital trends, fundraising strategies, and market analysis.',
    '#ec4899',
    8,
    true
  ),
  (
    'c9999999-9999-9999-9999-999999999999',
    'Operations',
    'operations',
    'Operational excellence, process optimization, and organizational efficiency.',
    '#10b981',
    9,
    true
  ),
  (
    'caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Strategy',
    'strategy',
    'Strategic planning, competitive analysis, and long-term business thinking.',
    '#f97316',
    10,
    true
  )
ON CONFLICT (slug) DO NOTHING;


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 8. COMPLETION
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ✅ Database schema is complete and production-ready
-- ✅ All tables, indexes, triggers, and RLS policies are in place
-- ✅ Storage buckets configured with proper access policies
-- ✅ Single author: Fiza Kanwal
-- ✅ 10 essential categories ready for content
-- ✅ No temporary or dummy data included
--
-- NEXT STEPS:
-- 1. Copy this entire file
-- 2. Open your Supabase project dashboard
-- 3. Go to SQL Editor
-- 4. Paste and run this script
-- 5. Verify all tables are created in the Table Editor
-- 6. Create your first admin user via Supabase Auth
-- 7. Manually promote that user to 'admin' or 'owner' role in profiles table
-- 8. Start creating content!
--
-- For questions or issues, refer to the Supabase documentation:
-- https://supabase.com/docs

