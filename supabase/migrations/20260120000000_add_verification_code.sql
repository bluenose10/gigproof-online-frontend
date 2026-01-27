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
