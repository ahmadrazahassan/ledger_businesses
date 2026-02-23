# Multi-Category Support Implementation Guide

## Overview
This document outlines the implementation of multi-category support for blog posts, allowing each post to be associated with multiple categories while maintaining a primary category for URL structure and main categorization.

## What Has Been Completed ✅

### 1. Database Schema (Migration Ready)
- **File**: `supabase/migrations/00002_add_multi_category_support.sql`
- **Changes**:
  - Created `post_categories` junction table for many-to-many relationships
  - Added indexes for optimal query performance
  - Migrated existing single-category data to new structure
  - Created triggers to ensure only one primary category per post
  - Created `posts_with_categories` view for easy querying
  - Maintained backward compatibility with existing `posts.category_id` column
  - Added automatic sync between primary category and `posts.category_id`

### 2. TypeScript Types Updated
- **File**: `src/lib/types/database.ts`
- **Changes**:
  - Added `PostCategory` interface for junction table
  - Added `CategoryWithPrimary` interface
  - Updated `PostWithRelations` to include `categories` array
  - Updated `PostFormData` to include `category_ids` array

### 3. Social Media Links Updated
- **Files**: 
  - `src/components/layout/footer.tsx`
  - `src/app/contact/page.tsx`
- **Changes**:
  - Removed Twitter and LinkedIn links
  - Added Instagram link: https://www.instagram.com/fiza_rana_42?igsh=MW54NGt2YjRzNG85dA==
  - Updated contact page social section

### 4. Migration Script Created
- **File**: `scripts/run-multi-category-migration.mjs`
- **Purpose**: Helper script to guide migration execution
- **Usage**: `npm run migrate:multi-category`

## What Needs To Be Done Next 🚧

### Step 1: Run the Database Migration
```bash
# Option 1: Using Supabase CLI (Recommended)
supabase db push

# Option 2: Using Supabase Dashboard
# 1. Go to SQL Editor in Supabase Dashboard
# 2. Copy contents of supabase/migrations/00002_add_multi_category_support.sql
# 3. Paste and execute
```

### Step 2: Update Backend Actions
**File**: `src/app/admin/posts/actions.ts`

Need to update:
- `createPost()` - Handle multiple category IDs
- `updatePost()` - Update post_categories junction table
- `getPost()` - Fetch all categories for a post
- `getPosts()` - Include categories array in results

Example implementation:
```typescript
export async function createPost(data: PostFormData) {
  const supabase = await createAdminClient();
  
  // 1. Create the post
  const { data: post, error: postError } = await supabase
    .from('posts')
    .insert({
      // ... post data
      category_id: data.category_id, // Primary category
    })
    .select()
    .single();

  if (postError || !post) return { success: false, error: postError?.message };

  // 2. Insert category relationships
  if (data.category_ids && data.category_ids.length > 0) {
    const categoryRelations = data.category_ids.map((catId, index) => ({
      post_id: post.id,
      category_id: catId,
      is_primary: catId === data.category_id, // Mark primary
    }));

    const { error: catError } = await supabase
      .from('post_categories')
      .insert(categoryRelations);

    if (catError) {
      // Rollback: delete the post
      await supabase.from('posts').delete().eq('id', post.id);
      return { success: false, error: catError.message };
    }
  }

  return { success: true, data: post };
}
```

### Step 3: Update Frontend Forms

**File**: `src/app/admin/posts/new/page.tsx`

Replace single category dropdown with multi-select:
```typescript
const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
const [primaryCategory, setPrimaryCategory] = useState('');

// In the form:
<div>
  <label className={labelClass}>Categories (Select Multiple)</label>
  <div className="space-y-2 max-h-48 overflow-y-auto p-3 bg-white border border-ink/[0.08] rounded-2xl">
    {categories.map((category) => (
      <label key={category.id} className="flex items-center gap-3 cursor-pointer hover:bg-ink/[0.02] p-2 rounded-lg transition-colors">
        <input
          type="checkbox"
          checked={selectedCategories.includes(category.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedCategories([...selectedCategories, category.id]);
              if (!primaryCategory) setPrimaryCategory(category.id);
            } else {
              setSelectedCategories(selectedCategories.filter(id => id !== category.id));
              if (primaryCategory === category.id) {
                setPrimaryCategory(selectedCategories[0] || '');
              }
            }
          }}
          className="w-4 h-4 text-accent border-ink/20 rounded focus:ring-accent"
        />
        <span className="text-sm text-ink">{category.name}</span>
        {primaryCategory === category.id && (
          <span className="ml-auto text-xs font-bold text-accent">Primary</span>
        )}
      </label>
    ))}
  </div>
  
  {selectedCategories.length > 1 && (
    <div className="mt-3">
      <label className="text-xs font-semibold text-ink/60 mb-2 block">Primary Category</label>
      <select
        value={primaryCategory}
        onChange={(e) => setPrimaryCategory(e.target.value)}
        className={inputClass}
      >
        {categories
          .filter(c => selectedCategories.includes(c.id))
          .map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
      </select>
    </div>
  )}
</div>
```

**File**: `src/app/admin/posts/[id]/edit/page.tsx`
- Apply same multi-select UI
- Load existing categories on mount
- Update save handler to include all selected categories

### Step 4: Update Query Functions

**File**: `src/lib/queries/homepage.ts` and other query files

Update to fetch categories array:
```typescript
const { data, error } = await supabase
  .from('posts')
  .select(`
    *,
    author:authors(*),
    category:categories!posts_category_id_fkey(*),
    post_categories!inner(
      category:categories(*)
    )
  `)
  .eq('status', 'published');

// Transform the data to include categories array
const postsWithCategories = data?.map(post => ({
  ...post,
  categories: post.post_categories?.map(pc => pc.category) || []
}));
```

### Step 5: Update Article Display Pages

**File**: `src/app/articles/[slug]/page.tsx`

Display all categories:
```typescript
{post.categories && post.categories.length > 0 && (
  <div className="flex flex-wrap gap-2 mb-6">
    {post.categories.map((category) => (
      <Link
        key={category.id}
        href={`/category/${category.slug}`}
        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full transition-colors ${
          category.is_primary
            ? 'bg-accent/15 text-accent hover:bg-accent/25'
            : 'bg-ink/[0.04] text-ink/60 hover:bg-ink/[0.08]'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {category.name}
      </Link>
    ))}
  </div>
)}
```

### Step 6: Update Post Cards

**Files**: 
- `src/components/posts/post-card.tsx`
- `src/components/posts/post-card-hero.tsx`
- `src/components/posts/post-card-compact.tsx`

Show primary category prominently, with option to show all categories on hover or in expanded view.

### Step 7: Testing Checklist

- [ ] Run database migration successfully
- [ ] Create new post with multiple categories
- [ ] Edit existing post and add/remove categories
- [ ] Verify primary category is maintained
- [ ] Check that URL structure uses primary category
- [ ] Verify category pages show posts correctly
- [ ] Test that removing all categories is prevented
- [ ] Verify backward compatibility with existing posts
- [ ] Check that category counts update correctly
- [ ] Test search and filtering with multiple categories

## Database Schema Details

### post_categories Table
```sql
CREATE TABLE post_categories (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, category_id)
);
```

### Key Features
1. **Automatic Primary Category Management**: Trigger ensures only one primary category per post
2. **Backward Compatibility**: `posts.category_id` automatically syncs with primary category
3. **Cascade Deletes**: Removing a post or category cleans up relationships
4. **Performance**: Indexes on post_id, category_id, and primary flag

## Benefits of This Implementation

1. **SEO**: Posts can rank for multiple topics while maintaining clean URL structure
2. **User Experience**: Better content discovery through multiple categorization
3. **Flexibility**: Easy to add/remove categories without breaking existing functionality
4. **Performance**: Optimized queries with proper indexing
5. **Data Integrity**: Triggers ensure consistency
6. **Backward Compatible**: Existing code continues to work during transition

## Migration Safety

- ✅ Non-destructive: Existing data is preserved
- ✅ Reversible: Can rollback if needed
- ✅ Zero downtime: Old and new systems work simultaneously
- ✅ Gradual adoption: Update frontend components incrementally

## Support

For questions or issues during implementation:
- Check migration logs in Supabase Dashboard
- Review trigger execution in Database > Functions
- Test queries in SQL Editor before implementing in code
- Use `posts_with_categories` view for easier querying

---

**Status**: Phase 1 Complete (Database & Types) ✅
**Next**: Phase 2 (Backend Actions & Frontend Forms) 🚧
**Timeline**: Estimated 2-3 hours for complete implementation
