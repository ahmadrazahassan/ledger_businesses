# Troubleshooting Guide - User Creation Issues

## Problem: Cannot Create User in Supabase Dashboard

You're seeing the tables created successfully, but when trying to create a user through the Supabase dashboard, it's failing.

## Root Cause

The `handle_new_user()` trigger tries to automatically create a profile when a user signs up, but the Row Level Security (RLS) policies on the `profiles` table are blocking the insert operation.

## Solution Options

### Option 1: Fix the RLS Policies (Recommended)

Run this SQL in the Supabase SQL Editor:

```sql
-- Fix the profiles table RLS to allow trigger inserts
DROP POLICY IF EXISTS "Profiles: service role insert" ON public.profiles;

CREATE POLICY "Profiles: service role insert"
  ON public.profiles FOR INSERT
  WITH CHECK (true);
```

Or simply run the entire file: `supabase/fix_user_creation.sql`

**Then try creating the user again.**

---

### Option 2: Manual User + Profile Creation (Easiest)

If Option 1 doesn't work, do this manually:

#### Step 1: Create User in Dashboard
1. Go to **Authentication** > **Users**
2. Click **Add User**
3. Enter:
   - Email: `quadcore0022@gmail.com`
   - Password: (your secure password)
   - ✓ Check "Auto Confirm User"
4. Click **Create user**
5. **Copy the UUID** shown in the users list (looks like: `12345678-1234-1234-1234-123456789abc`)

#### Step 2: Create Profile Manually
1. Go to **SQL Editor**
2. Run this SQL (replace `YOUR-USER-UUID-HERE` with the UUID you copied):

```sql
INSERT INTO public.profiles (id, full_name, avatar_url, role)
VALUES (
  'YOUR-USER-UUID-HERE'::uuid,
  'Admin User',
  '',
  'owner'::user_role
)
ON CONFLICT (id) DO UPDATE
SET role = 'owner'::user_role;
```

#### Step 3: Verify
Run this to check:

```sql
SELECT 
  p.id,
  p.full_name,
  p.role,
  u.email
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.role = 'owner';
```

You should see your user with role = 'owner'.

---

### Option 3: Temporarily Disable RLS

If you need to create multiple users quickly:

```sql
-- Temporarily disable RLS on profiles
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Create your users through the dashboard

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

⚠️ **Warning**: Only do this in development, never in production!

---

## Verification Steps

After creating your admin user, verify everything works:

### 1. Check Profile Exists
```sql
SELECT * FROM public.profiles WHERE role = 'owner';
```

### 2. Check Author Exists
```sql
SELECT * FROM public.authors WHERE slug = 'fiza-kanwal';
```

### 3. Check Categories Exist
```sql
SELECT name, slug FROM public.categories ORDER BY sort_order;
```

You should see 10 categories.

### 4. Test Login
1. Go to your app's login page
2. Enter your email and password
3. You should be redirected to `/admin`

---

## Common Issues & Fixes

### Issue: "User created but can't log in"
**Fix**: The profile might not have been created. Run Option 2 Step 2 above.

### Issue: "Can log in but see 'Access Denied' in admin"
**Fix**: Your profile role is not set to admin/owner. Run:
```sql
UPDATE public.profiles
SET role = 'owner'::user_role
WHERE id = 'YOUR-USER-UUID'::uuid;
```

### Issue: "Tables are empty"
**Fix**: The schema ran but data wasn't inserted. Run:
```sql
-- Check if author exists
SELECT COUNT(*) FROM public.authors;

-- If 0, insert Fiza Kanwal manually:
INSERT INTO public.authors (id, name, slug, bio, avatar_url, email, twitter, linkedin, is_active) VALUES
  (
    'a1111111-1111-1111-1111-111111111111',
    'Fiza Kanwal',
    'fiza-kanwal',
    'Senior editor covering enterprise technology, AI, B2B strategy, and the future of work.',
    '',
    'fiza@ledgerbusinesses.com',
    'fizakanwal',
    'fizakanwal',
    true
  )
ON CONFLICT (slug) DO NOTHING;
```

### Issue: "RLS policies blocking everything"
**Fix**: Make sure you're logged in as the owner user. Check:
```sql
SELECT auth.uid(); -- Should return your user UUID
SELECT public.is_admin(auth.uid()); -- Should return true
```

---

## Quick Start Checklist

- [ ] Run `supabase/production_schema.sql` in SQL Editor
- [ ] Verify tables created (9 tables should exist)
- [ ] Run `supabase/fix_user_creation.sql` to fix RLS
- [ ] Create user via Authentication > Users
- [ ] Copy user UUID
- [ ] Run manual profile creation SQL with your UUID
- [ ] Verify profile with role = 'owner'
- [ ] Test login at your app
- [ ] Access `/admin` successfully

---

## Still Having Issues?

### Debug Query
Run this comprehensive check:

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies exist
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check triggers exist
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

-- Check functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION';
```

### Contact Support
If none of these solutions work:
1. Check Supabase logs: Dashboard > Logs
2. Check browser console for errors
3. Verify your Supabase project is on a paid plan (if using advanced features)
4. Check Supabase status page: https://status.supabase.com/

---

## Files Reference

- `supabase/production_schema.sql` - Main database schema
- `supabase/fix_user_creation.sql` - Fix for user creation RLS issue
- `supabase/manual_admin_setup.sql` - Manual user/profile creation
- `DATABASE_SETUP.md` - Complete setup guide
- `TROUBLESHOOTING.md` - This file

---

**Last Updated**: February 20, 2026  
**Status**: Ready for Production
