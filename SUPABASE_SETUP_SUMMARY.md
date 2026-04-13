# Supabase Setup - Complete Summary

## What You Have

✅ **Fresh Production Database Schema**
- File: `supabase/production_schema.sql`
- 9 tables, all indexes, triggers, RLS policies
- Author: Fiza Kanwal (single author)
- 10 categories ready for content
- No dummy/test data

## Setup Process (5 Steps)

### 1️⃣ Run Main Schema
**File**: `supabase/production_schema.sql`
- Open Supabase Dashboard > SQL Editor
- Copy entire file contents
- Paste and Run
- ✅ Verify: 9 tables created

### 2️⃣ Fix User Creation
**File**: `supabase/fix_user_creation.sql`
- Run this in SQL Editor
- Fixes RLS policy blocking user creation
- ✅ Verify: No errors

### 3️⃣ Create Admin User
**Via Dashboard**: Authentication > Users > Add User
- Email: `quadcore0022@gmail.com`
- Password: (your secure password)
- ✓ Auto Confirm User
- ✅ Copy the UUID

### 4️⃣ Promote to Owner
**File**: `supabase/manual_admin_setup.sql`
- Replace `YOUR-USER-UUID-HERE` with your UUID
- Run in SQL Editor
- ✅ Verify: Role = 'owner'

### 5️⃣ Test Login
- Go to your app login page
- Enter credentials
- Should redirect to `/admin`
- ✅ Success!

## Files Guide

| File | Purpose | When to Use |
|------|---------|-------------|
| `production_schema.sql` | Main database setup | First, always |
| `fix_user_creation.sql` | Fix RLS for user creation | After main schema |
| `manual_admin_setup.sql` | Manual user/profile setup | If auto-creation fails |
| `DATABASE_SETUP.md` | Complete setup guide | Reference |
| `TROUBLESHOOTING.md` | Detailed problem solving | When issues occur |
| `QUICK_FIX.md` | 2-minute fix guide | Quick reference |

## Quick Commands

### Check Tables Exist
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;
```

### Check Author
```sql
SELECT name, slug FROM public.authors;
```
Should show: Fiza Kanwal

### Check Categories
```sql
SELECT name, slug FROM public.categories ORDER BY sort_order;
```
Should show: 10 categories

### Check Your Admin User
```sql
SELECT p.role, u.email FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.role = 'owner';
```
Should show: your email with role = owner

### Promote User to Owner
```sql
UPDATE public.profiles
SET role = 'owner'::user_role
WHERE id = 'YOUR-UUID'::uuid;
```

## Database Structure

### Tables (9)
1. **profiles** - User accounts (linked to auth.users)
2. **authors** - Content creators (Fiza Kanwal)
3. **categories** - Article categories (10 pre-configured)
4. **posts** - Main content with full-text search
5. **post_translations** - Multilingual support
6. **banners** - Sponsor/ad placements
7. **post_views** - Analytics
8. **newsletter_subscribers** - Email list
9. **site_settings** - Global config

### Storage Buckets (3)
- **covers** - Post cover images (5MB limit)
- **avatars** - Author avatars (2MB limit)
- **banners** - Banner images (5MB limit)

### Key Functions
- `search_posts()` - Full-text search
- `get_trending_posts()` - Trending by views
- `get_dashboard_stats()` - Admin metrics
- `is_admin()` - Permission check
- `publish_scheduled_posts()` - Auto-publish

## Author Details

**Fiza Kanwal**
- UUID: `a1111111-1111-1111-1111-111111111111`
- Slug: `fiza-kanwal`
- Email: `fiza.kanwal@ledgerthebusinesses.co.uk`
- Twitter: `@fizakanwal`
- LinkedIn: `fizakanwal`

## Categories (10)

1. Business (#05ce78)
2. Artificial Intelligence (#3b82f6)
3. Startups (#f59e0b)
4. B2B (#8b5cf6)
5. Software (#ef4444)
6. GPTs & LLMs (#06b6d4)
7. Case Studies (#84cc16)
8. Funding (#ec4899)
9. Operations (#10b981)
10. Strategy (#f97316)

## Common Issues

### ❌ User creation fails
**Fix**: Run `fix_user_creation.sql`

### ❌ Can't log in to admin
**Fix**: Check role is 'owner' or 'admin'

### ❌ Tables are empty
**Fix**: Re-run `production_schema.sql`

### ❌ "Access Denied" in admin
**Fix**: Promote user to owner role

## Next Steps After Setup

1. ✅ Upload author avatar: `/public/avatars/fiza.jpg`
2. ✅ Create your first post in admin panel
3. ✅ Test newsletter subscription
4. ✅ Configure a banner (optional)
5. ✅ Test search functionality
6. ✅ Review analytics in dashboard

## Support Resources

- **Quick Fix**: `QUICK_FIX.md` (2-minute solution)
- **Detailed Guide**: `DATABASE_SETUP.md` (complete walkthrough)
- **Troubleshooting**: `TROUBLESHOOTING.md` (all issues & fixes)
- **Supabase Docs**: https://supabase.com/docs

## Status Check

Run this comprehensive check:

```sql
-- Tables
SELECT COUNT(*) as table_count FROM information_schema.tables 
WHERE table_schema = 'public';
-- Should be: 9

-- Author
SELECT COUNT(*) as author_count FROM public.authors;
-- Should be: 1

-- Categories
SELECT COUNT(*) as category_count FROM public.categories;
-- Should be: 10

-- Admin Users
SELECT COUNT(*) as admin_count FROM public.profiles 
WHERE role IN ('owner', 'admin');
-- Should be: 1 (you)

-- Storage Buckets
SELECT COUNT(*) as bucket_count FROM storage.buckets;
-- Should be: 3

-- Functions
SELECT COUNT(*) as function_count FROM information_schema.routines 
WHERE routine_schema = 'public' AND routine_type = 'FUNCTION';
-- Should be: 8+
```

All counts match? **You're ready to go! 🚀**

---

**Version**: 2.0.0 Production  
**Author**: Fiza Kanwal  
**Date**: February 20, 2026  
**Status**: ✅ Production Ready
