-- Migration: Create profiles for existing users who don't have one
-- This is useful for OAuth users where the trigger might not have fired
-- Run this after the main migrations if you have existing users

-- Create profiles for any users in auth.users who don't have a profile
INSERT INTO public.profiles (user_id, email, full_name)
SELECT 
  id, 
  COALESCE(email, ''),
  COALESCE(
    raw_user_meta_data->>'full_name',
    raw_user_meta_data->>'name',
    raw_user_meta_data->>'display_name',
    split_part(COALESCE(email, 'unknown@example.com'), '@', 1)
  ) as full_name
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.profiles)
ON CONFLICT (user_id) DO NOTHING;

-- Also ensure user_roles exist for these users
INSERT INTO public.user_roles (user_id, role)
SELECT 
  id,
  'user'::public.app_role
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_roles)
ON CONFLICT (user_id, role) DO NOTHING;
