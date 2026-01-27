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
