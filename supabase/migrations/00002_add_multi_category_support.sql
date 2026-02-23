-- Migration: Add Multi-Category Support for Posts
-- This migration creates a junction table to support many-to-many relationship
-- between posts and categories, replacing the single category_id foreign key.

-- Step 1: Create the junction table for post-category relationships
CREATE TABLE IF NOT EXISTS post_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, category_id)
);

-- Step 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_post_categories_post_id ON post_categories(post_id);
CREATE INDEX IF NOT EXISTS idx_post_categories_category_id ON post_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_post_categories_primary ON post_categories(post_id, is_primary) WHERE is_primary = true;

-- Step 3: Migrate existing data from posts.category_id to post_categories
INSERT INTO post_categories (post_id, category_id, is_primary)
SELECT id, category_id, true
FROM posts
WHERE category_id IS NOT NULL
ON CONFLICT (post_id, category_id) DO NOTHING;

-- Step 4: Add a comment for documentation
COMMENT ON TABLE post_categories IS 'Junction table for many-to-many relationship between posts and categories. Each post can have multiple categories, with one marked as primary.';
COMMENT ON COLUMN post_categories.is_primary IS 'Indicates the primary category for the post, used for main categorization and URL structure.';

-- Step 5: Create a function to get primary category for a post
CREATE OR REPLACE FUNCTION get_primary_category(p_post_id UUID)
RETURNS UUID AS $$
  SELECT category_id
  FROM post_categories
  WHERE post_id = p_post_id AND is_primary = true
  LIMIT 1;
$$ LANGUAGE SQL STABLE;

-- Step 6: Create a function to ensure only one primary category per post
CREATE OR REPLACE FUNCTION ensure_single_primary_category()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting a category as primary, unset all other primary flags for this post
  IF NEW.is_primary = true THEN
    UPDATE post_categories
    SET is_primary = false
    WHERE post_id = NEW.post_id
      AND id != NEW.id
      AND is_primary = true;
  END IF;
  
  -- If this is the first category for a post, make it primary
  IF NOT EXISTS (
    SELECT 1 FROM post_categories
    WHERE post_id = NEW.post_id AND is_primary = true AND id != NEW.id
  ) THEN
    NEW.is_primary = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create trigger to enforce single primary category
DROP TRIGGER IF EXISTS trigger_ensure_single_primary_category ON post_categories;
CREATE TRIGGER trigger_ensure_single_primary_category
  BEFORE INSERT OR UPDATE ON post_categories
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_primary_category();

-- Step 8: Create a view for easy querying of posts with their categories
CREATE OR REPLACE VIEW posts_with_categories AS
SELECT 
  p.*,
  COALESCE(
    json_agg(
      json_build_object(
        'id', c.id,
        'name', c.name,
        'slug', c.slug,
        'color', c.color,
        'is_primary', pc.is_primary
      ) ORDER BY pc.is_primary DESC, c.name
    ) FILTER (WHERE c.id IS NOT NULL),
    '[]'::json
  ) as categories,
  (
    SELECT json_build_object(
      'id', c2.id,
      'name', c2.name,
      'slug', c2.slug,
      'color', c2.color,
      'description', c2.description
    )
    FROM post_categories pc2
    JOIN categories c2 ON c2.id = pc2.category_id
    WHERE pc2.post_id = p.id AND pc2.is_primary = true
    LIMIT 1
  ) as primary_category
FROM posts p
LEFT JOIN post_categories pc ON pc.post_id = p.id
LEFT JOIN categories c ON c.id = pc.category_id
GROUP BY p.id;

-- Step 9: Grant permissions (adjust based on your RLS policies)
GRANT SELECT, INSERT, UPDATE, DELETE ON post_categories TO authenticated;
GRANT SELECT ON posts_with_categories TO authenticated, anon;

-- Note: We're keeping the category_id column in posts table for backward compatibility
-- It will be updated via triggers to always reflect the primary category
-- This can be removed in a future migration once all code is updated

-- Step 10: Create trigger to sync primary category back to posts.category_id
CREATE OR REPLACE FUNCTION sync_primary_category_to_posts()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = true THEN
    UPDATE posts
    SET category_id = NEW.category_id
    WHERE id = NEW.post_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_primary_category ON post_categories;
CREATE TRIGGER trigger_sync_primary_category
  AFTER INSERT OR UPDATE ON post_categories
  FOR EACH ROW
  WHEN (NEW.is_primary = true)
  EXECUTE FUNCTION sync_primary_category_to_posts();
