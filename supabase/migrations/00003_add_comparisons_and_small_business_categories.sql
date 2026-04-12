-- Ledger Businesses — add Comparisons & Small Business categories
-- Idempotent: safe to run more than once (upserts on slug).
-- Run in Supabase SQL Editor or: supabase db push / psql -f ...

INSERT INTO public.categories (name, slug, description, color, sort_order, is_active)
VALUES
  (
    'Comparisons',
    'comparisons',
    'Software comparisons and side-by-side buying guides for UK businesses.',
    '#52525b',
    7,
    true
  ),
  (
    'Small Business',
    'small-business',
    'Guides and software advice for UK small businesses and sole traders.',
    '#0f766e',
    8,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  color       = EXCLUDED.color,
  sort_order  = EXCLUDED.sort_order,
  is_active   = EXCLUDED.is_active,
  updated_at  = now();
