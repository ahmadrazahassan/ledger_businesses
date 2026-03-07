-- 1. Insert new categories
INSERT INTO public.categories (id, name, slug, description, sort_order, is_active)
VALUES 
  (uuid_generate_v4(), 'Accounting & Bookkeeping', 'accounting-bookkeeping', 'Accounting & Bookkeeping related articles', 1, true),
  (uuid_generate_v4(), 'Invoicing', 'invoicing', 'Invoicing related articles', 2, true),
  (uuid_generate_v4(), 'Payroll', 'payroll', 'Payroll related articles', 3, true),
  (uuid_generate_v4(), 'HR', 'hr', 'HR related articles', 4, true),
  (uuid_generate_v4(), 'Reporting & Business Insights', 'reporting-business-insights', 'Reporting & Business Insights related articles', 5, true),
  (uuid_generate_v4(), 'VAT & Tax Compliance', 'vat-tax-compliance', 'VAT & Tax Compliance related articles', 6, true);

-- 2. Migrate existing posts to the first new category
DO $$
DECLARE
  new_cat_id UUID;
BEGIN
  -- Get the ID of the first new category
  SELECT id INTO new_cat_id FROM public.categories WHERE slug = 'accounting-bookkeeping' LIMIT 1;

  -- Update posts.category_id for posts that have old categories
  UPDATE public.posts
  SET category_id = new_cat_id
  WHERE category_id IN (
    SELECT id FROM public.categories WHERE slug NOT IN (
      'accounting-bookkeeping', 'invoicing', 'payroll', 'hr', 'reporting-business-insights', 'vat-tax-compliance'
    )
  );

  -- Delete old post_categories entries
  DELETE FROM public.post_categories
  WHERE category_id IN (
    SELECT id FROM public.categories WHERE slug NOT IN (
      'accounting-bookkeeping', 'invoicing', 'payroll', 'hr', 'reporting-business-insights', 'vat-tax-compliance'
    )
  );
  
  -- Ensure all posts have a primary category entry in post_categories
  INSERT INTO public.post_categories (post_id, category_id, is_primary)
  SELECT id, new_cat_id, true
  FROM public.posts
  ON CONFLICT (post_id, category_id) DO NOTHING;
  
  -- Make sure at least one is primary if somehow missed (though the above insert sets is_primary=true)
  -- The trigger ensures single primary.

  -- 3. Delete old categories
  DELETE FROM public.categories
  WHERE slug NOT IN (
    'accounting-bookkeeping', 'invoicing', 'payroll', 'hr', 'reporting-business-insights', 'vat-tax-compliance'
  );
END $$;
