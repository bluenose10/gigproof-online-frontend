-- Function to add PDF credits (used by stripe webhook)
-- SECURITY DEFINER bypasses RLS
CREATE OR REPLACE FUNCTION public.add_pdf_credits(p_user_id UUID, p_credits INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET pdf_credits = pdf_credits + p_credits
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant execute to service role
GRANT EXECUTE ON FUNCTION public.add_pdf_credits(UUID, INTEGER) TO service_role;
