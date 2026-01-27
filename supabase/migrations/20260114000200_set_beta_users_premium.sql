-- During the beta phase, we want all users to have unlimited access
-- This migration updates the default value and updates existing users

-- 1. Update existing profiles to unlimited
UPDATE public.profiles 
SET subscription_status = 'unlimited' 
WHERE subscription_status = 'free' OR subscription_status IS NULL;

-- 2. Update default value for future signups
ALTER TABLE public.profiles 
ALTER COLUMN subscription_status SET DEFAULT 'unlimited';
