# Ledger Businesses - Production Database Setup

## Overview
This document provides instructions for setting up the production database for Ledger Businesses using the fresh SQL schema.

## What's Included

### ✅ Complete Database Schema
- **Extensions**: UUID generation, full-text search (pg_trgm, unaccent)
- **Enums**: post_status, banner_placement, user_role, subscriber_status
- **Tables**: 9 core tables with proper relationships and constraints
- **Indexes**: Performance-optimized indexes for all queries
- **Triggers**: Automated updated_at, search vectors, post counts
- **RPC Functions**: Search, trending posts, dashboard stats, banner management
- **RLS Policies**: Row-level security for all tables
- **Storage Buckets**: covers, avatars, banners with proper access policies

### ✅ Production Data
- **Author**: Fiza Kanwal (single author, no dummy data)
- **Categories**: 10 essential categories ready for content
  - Business
  - Artificial Intelligence
  - Startups
  - B2B
  - Software
  - GPTs & LLMs
  - Case Studies
  - Funding
  - Operations
  - Strategy

### ❌ No Temporary Data
- No dummy posts
- No test banners
- No fake newsletter subscribers
- Clean slate for production content

## Setup Instructions

### Step 1: Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar

### Step 2: Run the Schema
1. Open the file: `supabase/production_schema.sql`
2. Copy the entire contents
3. Paste into the SQL Editor
4. Click **Run** or press `Ctrl+Enter`

### Step 3: Verify Installation
1. Go to **Table Editor** in the left sidebar
2. Verify these tables exist:
   - profiles
   - authors
   - categories
   - posts
   - post_translations
   - banners
   - post_views
   - newsletter_subscribers
   - site_settings

3. Check the **authors** table - you should see one row: Fiza Kanwal
4. Check the **categories** table - you should see 10 categories

### Step 4: Fix User Creation (Important!)
Before creating users, run this fix to allow the trigger to work:

1. Go to **SQL Editor**
2. Run the file: `supabase/fix_user_creation.sql`
3. Or paste this SQL:

```sql
CREATE POLICY "Profiles: service role insert"
  ON public.profiles FOR INSERT
  WITH CHECK (true);
```

### Step 5: Create Your Admin User
1. Go to **Authentication** > **Users**
2. Click **Add User**
3. Enter email: `quadcore0022@gmail.com`
4. Enter a secure password
5. ✓ Check "Auto Confirm User"
6. Click **Create user**
7. **Copy the user's UUID** from the users list

### Step 6: Promote User to Admin
Option A - Via Table Editor:
1. Go to **Table Editor** > **profiles**
2. Find your user's row (by UUID)
3. Edit the **role** column to `owner`
4. Save

Option B - Via SQL (Recommended):
1. Go to **SQL Editor**
2. Run this (replace with your UUID):
```sql
UPDATE public.profiles
SET role = 'owner'::user_role
WHERE id = 'YOUR-USER-UUID-HERE'::uuid;
```

**Troubleshooting**: If user creation fails, see `TROUBLESHOOTING.md` for detailed solutions.

### Step 7: Start Creating Content
You're now ready to:
- Create posts in the admin panel
- Upload cover images
- Manage categories
- Configure banners
- Build your newsletter list

## Database Tables

### Core Content
- **authors**: Content creators (Fiza Kanwal)
- **categories**: Article categories (10 pre-configured)
- **posts**: Main content table with full-text search
- **post_translations**: Multilingual support

### Admin & Analytics
- **profiles**: User accounts linked to Supabase Auth
- **post_views**: Page view analytics
- **newsletter_subscribers**: Email list management
- **banners**: Sponsor/ad placements
- **site_settings**: Global configuration

## Key Features

### Automated Triggers
- **updated_at**: Auto-updates on every row modification
- **search_vector**: Auto-generates full-text search indexes
- **post_count**: Auto-syncs category post counts
- **view_count**: Auto-increments on post views
- **published_at**: Auto-sets when status changes to published

### RPC Functions
- `search_posts(query, limit, offset)`: Full-text search with ranking
- `get_trending_posts(limit)`: Posts by recent view velocity
- `get_dashboard_stats()`: Admin dashboard metrics
- `get_active_banner(placement)`: Active banner by placement
- `is_admin(user_id)`: Check admin permissions
- `publish_scheduled_posts()`: Auto-publish scheduled content

### Security
- Row Level Security (RLS) enabled on all tables
- Public can read published content
- Only admins can create/edit content
- Storage buckets have proper access controls

## Author Information

**Fiza Kanwal**
- ID: `a1111111-1111-1111-1111-111111111111`
- Slug: `fiza-kanwal`
- Bio: Senior editor covering enterprise technology, AI, B2B strategy, and the future of work
- Email: fiza.kanwal@ledgerthebusinesses.co.uk
- Twitter: @fizakanwal
- LinkedIn: fizakanwal

## Categories

1. **Business** (#05ce78) - Strategy, operations, and leadership
2. **Artificial Intelligence** (#3b82f6) - AI research and implementation
3. **Startups** (#f59e0b) - Funding and founder stories
4. **B2B** (#8b5cf6) - Enterprise sales and SaaS metrics
5. **Software** (#ef4444) - Engineering practices
6. **GPTs & LLMs** (#06b6d4) - Large language models
7. **Case Studies** (#84cc16) - Real-world implementations
8. **Funding** (#ec4899) - Venture capital trends
9. **Operations** (#10b981) - Operational excellence
10. **Strategy** (#f97316) - Strategic planning

## File Changes

### Deleted
- ❌ `supabase/migrations/00001_initial_schema.sql` (old schema with temp data)
- ❌ `supabase/sovereign_ink_complete.sql` (old complete schema)

### Created
- ✅ `supabase/production_schema.sql` (fresh, production-ready schema)
- ✅ `DATABASE_SETUP.md` (this file)

### Updated
- ✅ `src/data/seed.ts` (updated author from Ahmed Raza to Fiza Kanwal)

## Next Steps

1. Run the SQL schema in Supabase
2. Create your admin user
3. Promote user to admin role
4. Start creating content in the admin panel
5. Upload author avatar to `/public/avatars/fiza.jpg`
6. Configure your first banner (optional)
7. Test the newsletter subscription form

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Review the SQL file comments for detailed explanations
- Verify RLS policies are working correctly
- Check browser console for any API errors

---

**Database Version**: 2.0.0 (Production Ready)  
**Generated**: February 20, 2026  
**Author**: Fiza Kanwal  
**Status**: ✅ Ready for Production
