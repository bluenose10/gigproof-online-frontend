-- Create plaid_items table to store connected bank accounts
CREATE TABLE public.plaid_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  institution_id TEXT,
  institution_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_id)
);

-- Create transactions table to store fetched transactions
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plaid_item_id UUID REFERENCES public.plaid_items(id) ON DELETE CASCADE NOT NULL,
  transaction_id TEXT NOT NULL UNIQUE,
  account_id TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  date DATE NOT NULL,
  name TEXT,
  merchant_name TEXT,
  category TEXT[],
  pending BOOLEAN DEFAULT false,
  is_gig_income BOOLEAN DEFAULT false,
  platform_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create income_summaries table for calculated data
CREATE TABLE public.income_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  weekly_average DECIMAL(12, 2) DEFAULT 0,
  monthly_average DECIMAL(12, 2) DEFAULT 0,
  total_90_days DECIMAL(12, 2) DEFAULT 0,
  platform_breakdown JSONB DEFAULT '[]'::jsonb,
  consistency_score INTEGER DEFAULT 0,
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.plaid_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income_summaries ENABLE ROW LEVEL SECURITY;

-- RLS policies for plaid_items
CREATE POLICY "Users can view their own plaid items"
ON public.plaid_items FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plaid items"
ON public.plaid_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plaid items"
ON public.plaid_items FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for transactions
CREATE POLICY "Users can view their own transactions"
ON public.transactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
ON public.transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS policies for income_summaries
CREATE POLICY "Users can view their own income summary"
ON public.income_summaries FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own income summary"
ON public.income_summaries FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own income summary"
ON public.income_summaries FOR UPDATE
USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_date ON public.transactions(date);
CREATE INDEX idx_transactions_is_gig_income ON public.transactions(is_gig_income);
CREATE INDEX idx_plaid_items_user_id ON public.plaid_items(user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_plaid_items_updated_at
BEFORE UPDATE ON public.plaid_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_income_summaries_updated_at
BEFORE UPDATE ON public.income_summaries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();