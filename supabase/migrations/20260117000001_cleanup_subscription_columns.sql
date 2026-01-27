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
