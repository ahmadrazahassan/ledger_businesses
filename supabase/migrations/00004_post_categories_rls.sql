-- RLS for post_categories: required when RLS is enabled so admins can manage junction rows
-- and anonymous/authenticated readers can resolve categories for published posts.

ALTER TABLE IF EXISTS public.post_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "post_categories: read published or admin" ON public.post_categories;
CREATE POLICY "post_categories: read published or admin"
  ON public.post_categories
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.posts p
      WHERE p.id = post_categories.post_id
        AND (p.status = 'published' OR public.is_admin(auth.uid()))
    )
  );

DROP POLICY IF EXISTS "post_categories: admin write" ON public.post_categories;
CREATE POLICY "post_categories: admin write"
  ON public.post_categories
  FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

COMMENT ON TABLE public.post_categories IS 'Junction: posts ↔ categories. Managed by admins; readable for published posts.';
