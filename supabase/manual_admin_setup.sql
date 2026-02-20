-- ╔══════════════════════════════════════════════════════════════════╗
-- ║  MANUAL ADMIN SETUP                                             ║
-- ║  Use this if automatic user creation is not working             ║
-- ╚══════════════════════════════════════════════════════════════════╝

-- STEP 1: First, create the user through Supabase Dashboard:
-- Go to Authentication > Users > Add User
-- Email: quadcore0022@gmail.com
-- Password: (your secure password)
-- Auto Confirm User: ✓ (checked)
-- Click "Create user"

-- STEP 2: After user is created, copy the user's UUID from the dashboard
-- Then run this SQL, replacing 'YOUR-USER-UUID-HERE' with the actual UUID:

-- Example UUID format: 12345678-1234-1234-1234-123456789abc

INSERT INTO public.profiles (id, full_name, avatar_url, role)
VALUES (
  'YOUR-USER-UUID-HERE'::uuid,  -- ⚠️ REPLACE THIS with your actual user UUID
  'Admin User',
  '',
  'owner'::user_role
)
ON CONFLICT (id) DO UPDATE
SET role = 'owner'::user_role;

-- ✅ After running this, you should be able to log in as admin


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- ALTERNATIVE: If you already created the user and just need to promote them
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Find your user UUID by going to Authentication > Users in Supabase dashboard
-- Then run this to promote them to owner:

UPDATE public.profiles
SET role = 'owner'::user_role
WHERE id = 'YOUR-USER-UUID-HERE'::uuid;  -- ⚠️ REPLACE THIS


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- VERIFY: Check if profile was created correctly
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT 
  p.id,
  p.full_name,
  p.role,
  u.email,
  p.created_at
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.role IN ('owner', 'admin');

-- You should see your user with role = 'owner'
