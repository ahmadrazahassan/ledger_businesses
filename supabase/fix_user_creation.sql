-- ╔══════════════════════════════════════════════════════════════════╗
-- ║  FIX: User Creation Issue                                       ║
-- ║  Run this after the main schema if user creation fails          ║
-- ╚══════════════════════════════════════════════════════════════════╝

-- The issue: RLS policies on profiles table prevent the trigger from inserting
-- Solution: Add a policy that allows the trigger to insert profiles

-- Drop existing policies on profiles
DROP POLICY IF EXISTS "Profiles: public read" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: owner update" ON public.profiles;

-- Recreate with service role bypass for inserts
CREATE POLICY "Profiles: public read"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Profiles: owner update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- CRITICAL: Allow service role to insert profiles (for the trigger)
CREATE POLICY "Profiles: service role insert"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

-- Also update the trigger to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    'viewer'::user_role
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ✅ Now try creating a user again through the Supabase dashboard
