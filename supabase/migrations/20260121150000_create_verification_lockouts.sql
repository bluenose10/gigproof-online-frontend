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
