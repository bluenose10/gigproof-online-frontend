-- Migration: 20260108094838_8272aacb-a86f-4fae-838b-d1ca8c680501.sql
-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Enable RLS on both tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- User roles RLS policies
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
-- Migration: 20260108095330_090b0935-5b54-4e0a-92c5-7bc93759bf82.sql
-- Create plaid_items table to store connected bank accounts
CREATE TABLE public.plaid_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  institution_id TEXT,
  institution_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_id)
);

-- Create transactions table to store fetched transactions
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plaid_item_id UUID REFERENCES public.plaid_items(id) ON DELETE CASCADE NOT NULL,
  transaction_id TEXT NOT NULL UNIQUE,
  account_id TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  date DATE NOT NULL,
  name TEXT,
  merchant_name TEXT,
  category TEXT[],
  pending BOOLEAN DEFAULT false,
  is_gig_income BOOLEAN DEFAULT false,
  platform_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create income_summaries table for calculated data
CREATE TABLE public.income_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  weekly_average DECIMAL(12, 2) DEFAULT 0,
  monthly_average DECIMAL(12, 2) DEFAULT 0,
  total_90_days DECIMAL(12, 2) DEFAULT 0,
  platform_breakdown JSONB DEFAULT '[]'::jsonb,
  consistency_score INTEGER DEFAULT 0,
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.plaid_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income_summaries ENABLE ROW LEVEL SECURITY;

-- RLS policies for plaid_items
CREATE POLICY "Users can view their own plaid items"
ON public.plaid_items FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plaid items"
ON public.plaid_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plaid items"
ON public.plaid_items FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for transactions
CREATE POLICY "Users can view their own transactions"
ON public.transactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
ON public.transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS policies for income_summaries
CREATE POLICY "Users can view their own income summary"
ON public.income_summaries FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own income summary"
ON public.income_summaries FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own income summary"
ON public.income_summaries FOR UPDATE
USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_date ON public.transactions(date);
CREATE INDEX idx_transactions_is_gig_income ON public.transactions(is_gig_income);
CREATE INDEX idx_plaid_items_user_id ON public.plaid_items(user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_plaid_items_updated_at
BEFORE UPDATE ON public.plaid_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_income_summaries_updated_at
BEFORE UPDATE ON public.income_summaries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- Migration: 20260109000000_create_reports_table.sql
-- Create reports table to store generated report metadata
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  report_id TEXT NOT NULL UNIQUE,
  is_premium BOOLEAN DEFAULT false,
  period_start DATE,
  period_end DATE,
  weekly_average DECIMAL(12, 2),
  monthly_average DECIMAL(12, 2),
  total_90_days DECIMAL(12, 2),
  consistency_score INTEGER,
  platform_breakdown JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- RLS policies for reports
CREATE POLICY "Users can view their own reports"
ON public.reports FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports"
ON public.reports FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reports"
ON public.reports FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_reports_user_id ON public.reports(user_id);
CREATE INDEX idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX idx_reports_report_id ON public.reports(report_id);

-- Add trigger for updated_at
CREATE TRIGGER update_reports_updated_at
BEFORE UPDATE ON public.reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Migration: 20260111000000_create_missing_profiles.sql
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

-- Migration: 20260114000000_add_stripe_fields.sql
-- Add Stripe-related fields to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_id TEXT;

-- Create an index for faster lookups by stripe_customer_id
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);

-- Migration: 20260114000100_secure_plaid_tokens.sql
-- Create a secure table for Plaid Access Tokens
-- This table is NOT accessible by ordinary users via RLS
CREATE TABLE public.plaid_tokens (
  plaid_item_id UUID PRIMARY KEY REFERENCES public.plaid_items(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.plaid_tokens ENABLE ROW LEVEL SECURITY;

-- Note: No SELECT/UPDATE/DELETE policies are added for authenticated users.
-- This means ordinary user tokens cannot see let alone read this table.
-- Only the Service Role (used in Edge Functions) will have access.

-- Move existing tokens to the new table
INSERT INTO public.plaid_tokens (plaid_item_id, access_token)
SELECT id, access_token FROM public.plaid_items;

-- Remove the unencrypted column from the public table
ALTER TABLE public.plaid_items DROP COLUMN access_token;

-- Migration: 20260114000200_set_beta_users_premium.sql
-- During the beta phase, we want all users to have unlimited access
-- This migration updates the default value and updates existing users

-- 1. Update existing profiles to unlimited
UPDATE public.profiles 
SET subscription_status = 'unlimited' 
WHERE subscription_status = 'free' OR subscription_status IS NULL;

-- 2. Update default value for future signups
ALTER TABLE public.profiles 
ALTER COLUMN subscription_status SET DEFAULT 'unlimited';

-- Migration: 20260114000300_add_currency_support.sql
-- Add iso_currency_code to relevant tables to support international users
ALTER TABLE IF EXISTS public.income_summaries 
ADD COLUMN IF NOT EXISTS iso_currency_code TEXT DEFAULT 'USD';

ALTER TABLE IF EXISTS public.transactions 
ADD COLUMN IF NOT EXISTS iso_currency_code TEXT DEFAULT 'USD';

ALTER TABLE IF EXISTS public.reports 
ADD COLUMN IF NOT EXISTS iso_currency_code TEXT DEFAULT 'USD';

-- Update existing records to USD as a safe default
UPDATE public.income_summaries SET iso_currency_code = 'USD' WHERE iso_currency_code IS NULL;
UPDATE public.transactions SET iso_currency_code = 'USD' WHERE iso_currency_code IS NULL;
UPDATE public.reports SET iso_currency_code = 'USD' WHERE iso_currency_code IS NULL;

-- Migration: 20260114000400_harden_security_definer_functions.sql
-- Harden security definer functions to prevent search_path injection attacks
-- This resolves the 'function_search_path_mutable' warning in Supabase

-- 1. Harden public.handle_new_user
ALTER FUNCTION public.handle_new_user() SET search_path = "";

-- 2. Harden public.has_role 
ALTER FUNCTION public.has_role(uuid, public.app_role) SET search_path = "";

-- 3. Harden public.update_updated_at_column
ALTER FUNCTION public.update_updated_at_column() SET search_path = "";

-- Migration: 20260117000000_add_pdf_credits.sql
-- Remove subscription fields and add PDF credits system
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS subscription_status,
DROP COLUMN IF EXISTS subscription_id,
ADD COLUMN IF NOT EXISTS pdf_credits INTEGER DEFAULT 0;

-- Create function to check if user can generate PDF
CREATE OR REPLACE FUNCTION public.can_generate_pdf(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_pdf_credits INTEGER;
BEGIN
  -- Get user's PDF credits
  SELECT pdf_credits
  INTO v_pdf_credits
  FROM public.profiles
  WHERE id = p_user_id;

  -- If user doesn't exist, return false
  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Check if user has credits remaining
  RETURN v_pdf_credits > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to use a PDF credit after generation
CREATE OR REPLACE FUNCTION public.use_pdf_credit(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET pdf_credits = pdf_credits - 1
  WHERE id = p_user_id
  AND pdf_credits > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add comment explaining the credits
COMMENT ON COLUMN public.profiles.pdf_credits IS 'Number of PDF reports user can generate. 1 credit = $19.99, 10 credits = $39.99';

-- Migration: 20260117000000_add_pdf_limits.sql
-- Add PDF generation tracking to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS pdfs_generated_this_month INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_pdf_reset_date TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create function to reset monthly PDF counter
CREATE OR REPLACE FUNCTION public.reset_monthly_pdf_counter()
RETURNS void AS $$
BEGIN
  -- Reset counter for users whose last reset was over 30 days ago
  UPDATE public.profiles
  SET
    pdfs_generated_this_month = 0,
    last_pdf_reset_date = now()
  WHERE
    subscription_status = 'unlimited'
    AND last_pdf_reset_date < (now() - INTERVAL '30 days');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to check if user can generate PDF
CREATE OR REPLACE FUNCTION public.can_generate_pdf(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_subscription_status TEXT;
  v_pdfs_generated INTEGER;
  v_last_reset TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get user's subscription info
  SELECT
    subscription_status,
    pdfs_generated_this_month,
    last_pdf_reset_date
  INTO
    v_subscription_status,
    v_pdfs_generated,
    v_last_reset
  FROM public.profiles
  WHERE id = p_user_id;

  -- If user doesn't exist, return false
  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Reset counter if it's been more than 30 days
  IF v_last_reset < (now() - INTERVAL '30 days') THEN
    UPDATE public.profiles
    SET
      pdfs_generated_this_month = 0,
      last_pdf_reset_date = now()
    WHERE id = p_user_id;
    v_pdfs_generated := 0;
  END IF;

  -- Check subscription status and limits
  CASE v_subscription_status
    WHEN 'unlimited' THEN
      -- Unlimited users can generate up to 10 PDFs per month
      RETURN v_pdfs_generated < 10;
    WHEN 'premium' THEN
      -- Premium users get 1 PDF, then need to pay again
      RETURN v_pdfs_generated < 1;
    ELSE
      -- No subscription, can't generate PDF
      RETURN false;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to increment PDF counter after generation
CREATE OR REPLACE FUNCTION public.increment_pdf_counter(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET pdfs_generated_this_month = pdfs_generated_this_month + 1
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add comment explaining the limit
COMMENT ON COLUMN public.profiles.pdfs_generated_this_month IS 'Number of PDFs generated this month. Max 10 for unlimited, max 1 for premium (then must repurchase)';

-- Migration: 20260117000001_cleanup_subscription_columns.sql
-- Clean up any remaining subscription-related columns
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS subscription_status CASCADE,
DROP COLUMN IF EXISTS subscription_id CASCADE,
DROP COLUMN IF EXISTS subscription_tier CASCADE,
DROP COLUMN IF EXISTS pdfs_generated_this_month CASCADE,
DROP COLUMN IF EXISTS last_pdf_reset_date CASCADE;

-- Ensure pdf_credits column exists
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS pdf_credits INTEGER DEFAULT 0;

-- Add comment
COMMENT ON COLUMN public.profiles.pdf_credits IS 'Number of PDF reports user can generate. 1 credit = $19.99, 10 credits = $119.99';

-- Migration: 20260120000000_add_verification_code.sql
-- Add verification columns to reports table
ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS verification_code VARCHAR(20),
  ADD COLUMN IF NOT EXISTS verification_hash TEXT,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS verification_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMP WITH TIME ZONE;

-- Add unique constraint on verification_code
ALTER TABLE public.reports
  ADD CONSTRAINT reports_verification_code_key UNIQUE (verification_code);

-- Create index for fast verification lookups
CREATE INDEX IF NOT EXISTS idx_reports_verification_code ON public.reports(verification_code);

-- Create verification logs table for analytics
CREATE TABLE IF NOT EXISTS public.verification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_code VARCHAR(20),
  result VARCHAR(20), -- 'valid', 'invalid', 'expired'
  ip_address VARCHAR(50),
  user_agent TEXT,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on verification_logs
ALTER TABLE public.verification_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert verification logs (for public verification endpoint)
CREATE POLICY "Anyone can log verifications"
ON public.verification_logs FOR INSERT
WITH CHECK (true);

-- Policy: Only authenticated users can read their own verification logs (future enhancement)
CREATE POLICY "Users can read verification logs"
ON public.verification_logs FOR SELECT
USING (true); -- Public read for now, can be restricted later

-- Migration: 20260121000000_add_pdf_hash.sql
-- Add PDF hash column for tamper detection
ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS pdf_hash TEXT;

-- Create index for PDF hash lookups
CREATE INDEX IF NOT EXISTS idx_reports_pdf_hash ON public.reports(pdf_hash);

-- Add comment explaining the column
COMMENT ON COLUMN public.reports.pdf_hash IS 'SHA-256 hash of the generated PDF file for tamper detection';

-- Migration: 20260121130000_lock_reports_table_enhanced.sql
-- Enhanced RLS lockdown for reports table
-- Defense-in-depth: REVOKE privileges + explicit RLS policies
-- This prevents users from creating fake income reports

-- Step 1: Remove write privileges from client roles (defense-in-depth)
REVOKE INSERT, UPDATE, DELETE ON TABLE public.reports FROM anon, authenticated;

-- Allow authenticated users to read (they can view their own reports)
GRANT SELECT ON TABLE public.reports TO authenticated;

-- Step 2: Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop old policies (cleanup from previous implementation)
DO $$
DECLARE
  p record;
BEGIN
  FOR p IN
    SELECT polname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'reports'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.reports;', p.polname);
  END LOOP;
END $$;

-- Step 4: Add read-only policy for authenticated users
-- Users can only SELECT reports where user_id = their auth.uid()
CREATE POLICY "reports_select_own"
ON public.reports
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Step 5: Explicitly deny all client writes (future-proof)
-- Even though REVOKE already blocks writes, explicit policies make intent clear

CREATE POLICY "reports_no_insert"
ON public.reports
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "reports_no_update"
ON public.reports
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "reports_no_delete"
ON public.reports
FOR DELETE
TO anon, authenticated
USING (false);

-- Note: Edge Functions using service_role key bypass RLS and can still write
-- This is the correct behavior - only server-controlled Edge Functions can create/update reports

-- Migration: 20260121140000_lock_income_summaries_table.sql
-- Migration: Lock down income_summaries table with defense-in-depth security
-- Purpose: Prevent users from poisoning authoritative income data
-- Date: January 21, 2026

-- First, let's see what we're working with (for logging/debugging)
DO $$
BEGIN
    RAISE NOTICE 'Locking down income_summaries table...';
END $$;

-- Layer 1: REVOKE write privileges from anon and authenticated roles
-- This prevents users from modifying income data at the PostgreSQL privilege level
REVOKE INSERT, UPDATE, DELETE ON TABLE public.income_summaries FROM anon, authenticated;
GRANT SELECT ON TABLE public.income_summaries TO authenticated;

-- Drop any existing policies (to start fresh)
DROP POLICY IF EXISTS "Users can insert their own income summaries" ON public.income_summaries;
DROP POLICY IF EXISTS "Users can update their own income summaries" ON public.income_summaries;
DROP POLICY IF EXISTS "Users can delete their own income summaries" ON public.income_summaries;
DROP POLICY IF EXISTS "income_summaries_select_own" ON public.income_summaries;
DROP POLICY IF EXISTS "income_summaries_no_insert" ON public.income_summaries;
DROP POLICY IF EXISTS "income_summaries_no_update" ON public.income_summaries;
DROP POLICY IF EXISTS "income_summaries_no_delete" ON public.income_summaries;

-- Layer 2: Create explicit RLS deny policies for defense-in-depth
-- Even if privileges are re-granted, these policies will block writes

-- Users can only SELECT their own income summaries
CREATE POLICY "income_summaries_select_own"
ON public.income_summaries FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Explicit deny for INSERT (users cannot create fake income summaries)
CREATE POLICY "income_summaries_no_insert"
ON public.income_summaries FOR INSERT
TO anon, authenticated
WITH CHECK (false);

-- Explicit deny for UPDATE (users cannot modify income summaries)
CREATE POLICY "income_summaries_no_update"
ON public.income_summaries FOR UPDATE
TO anon, authenticated
USING (false) WITH CHECK (false);

-- Explicit deny for DELETE (users cannot delete income summaries)
CREATE POLICY "income_summaries_no_delete"
ON public.income_summaries FOR DELETE
TO anon, authenticated
USING (false);

-- Ensure RLS is enabled on the table
ALTER TABLE public.income_summaries ENABLE ROW LEVEL SECURITY;

-- Log completion
DO $$
BEGIN
    RAISE NOTICE 'income_summaries table locked down successfully';
    RAISE NOTICE 'Users can: SELECT their own summaries';
    RAISE NOTICE 'Users CANNOT: INSERT, UPDATE, or DELETE summaries';
    RAISE NOTICE 'Only Edge Functions (service_role) can write to this table';
END $$;

-- Migration: 20260121150000_create_verification_lockouts.sql
-- Migration: Create verification lockouts table for rate limiting
-- Purpose: Prevent brute-force attacks on verification codes
-- Date: January 21, 2026

-- Create table to track verification lockouts
CREATE TABLE IF NOT EXISTS public.verification_lockouts (
  ip_address TEXT PRIMARY KEY,
  locked_until TIMESTAMPTZ NOT NULL,
  failure_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create table to log verification attempts
CREATE TABLE IF NOT EXISTS public.verification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  verification_code TEXT,
  success BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for quick lookups by IP and timestamp
CREATE INDEX IF NOT EXISTS idx_verification_logs_ip_time
ON public.verification_logs(ip_address, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_verification_lockouts_ip
ON public.verification_lockouts(ip_address);

-- Enable RLS (only service_role can access these tables)
ALTER TABLE public.verification_lockouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_logs ENABLE ROW LEVEL SECURITY;

-- No policies needed - only Edge Functions (service_role) should access these tables
-- This prevents users from tampering with rate limiting data

COMMENT ON TABLE public.verification_lockouts IS 'Tracks IP addresses that are temporarily locked out due to excessive failed verification attempts';
COMMENT ON TABLE public.verification_logs IS 'Logs all verification attempts for rate limiting and abuse detection';

