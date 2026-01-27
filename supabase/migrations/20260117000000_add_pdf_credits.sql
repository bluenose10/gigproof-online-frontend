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
