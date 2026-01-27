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
