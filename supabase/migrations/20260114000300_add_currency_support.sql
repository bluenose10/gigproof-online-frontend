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
