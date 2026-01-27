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
