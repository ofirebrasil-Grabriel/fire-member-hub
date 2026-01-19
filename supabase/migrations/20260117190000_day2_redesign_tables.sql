-- =============================================
-- Day 2 Redesign - Tables and Adjustments
-- =============================================

-- 1. Financial Snapshot (Resumo consolidado do Raio-X)
CREATE TABLE IF NOT EXISTS public.financial_snapshot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_income DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_fixed DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_variable DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_debt_payments DECIMAL(12,2) NOT NULL DEFAULT 0,
  balance DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_debt_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  emotional_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.financial_snapshot ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own snapshot" ON public.financial_snapshot 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own snapshot" ON public.financial_snapshot 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own snapshot" ON public.financial_snapshot 
  FOR UPDATE USING (auth.uid() = user_id);

-- 2. Adjustments to Debts
ALTER TABLE public.debts ADD COLUMN IF NOT EXISTS interest_rate DECIMAL(5,2);
ALTER TABLE public.debts ADD COLUMN IF NOT EXISTS installments_remaining INTEGER;

-- 3. Adjustments to Fixed Expenses
ALTER TABLE public.fixed_expenses ADD COLUMN IF NOT EXISTS classification VARCHAR(20) DEFAULT 'essential' 
  CHECK (classification IN ('essential', 'important', 'negotiable'));

-- 4. Adjustments to Variable Expenses
ALTER TABLE public.variable_expenses ADD COLUMN IF NOT EXISTS monthly_average DECIMAL(12,2) DEFAULT 0;
ALTER TABLE public.variable_expenses ADD COLUMN IF NOT EXISTS classification VARCHAR(20) DEFAULT 'superfluous'
  CHECK (classification IN ('essential', 'superfluous', 'cut'));

-- 5. Trigger for updated_at
CREATE OR REPLACE TRIGGER set_financial_snapshot_updated_at 
  BEFORE UPDATE ON public.financial_snapshot 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 6. Index
CREATE INDEX IF NOT EXISTS financial_snapshot_user_id_idx ON public.financial_snapshot(user_id);
