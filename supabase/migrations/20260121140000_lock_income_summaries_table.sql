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
