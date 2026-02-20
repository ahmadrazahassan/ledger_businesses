# Quick Fix - User Creation Issue

## The Problem
You ran the schema successfully (tables are created), but creating a user through Supabase dashboard fails.

## The Solution (2 minutes)

### Step 1: Run This SQL
Go to **SQL Editor** and paste:

```sql
CREATE POLICY "Profiles: service role insert"
  ON public.profiles FOR INSERT
  WITH CHECK (true);
```

Click **Run**.

### Step 2: Create User
1. Go to **Authentication** > **Users**
2. Click **Add User**
3. Email: `quadcore0022@gmail.com`
4. Password: (your choice)
5. ✓ Check "Auto Confirm User"
6. Click **Create user**
7. **Copy the UUID** (looks like: `abc12345-1234-...`)

### Step 3: Make User Admin
Go back to **SQL Editor** and run (replace the UUID):

```sql
UPDATE public.profiles
SET role = 'owner'::user_role
WHERE id = 'PASTE-YOUR-UUID-HERE'::uuid;
```

### Step 4: Verify
Run this:

```sql
SELECT p.role, u.email
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.role = 'owner';
```

You should see your email with role = 'owner'.

## Done! 🎉

Now you can:
- Log in to your app
- Access `/admin`
- Create posts
- Manage content

---

**Need more help?** See `TROUBLESHOOTING.md` for detailed solutions.
