-- Migration: create_financial_tables
-- Description: Criar tabelas financeiras base para Dias 2-9

-- =============================================
-- INCOME ITEMS (Entradas de renda)
-- =============================================
CREATE TABLE IF NOT EXISTS public.income_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  source text NOT NULL,
  amount numeric(12,2) NOT NULL,
  received_on integer CHECK (received_on >= 1 AND received_on <= 31),
  recurrence text CHECK (recurrence IN ('monthly', 'weekly', 'biweekly', 'one_time')) DEFAULT 'monthly',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.income_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own income_items" ON public.income_items
  FOR ALL USING (auth.uid() = user_id);

CREATE TRIGGER update_income_items_updated_at
  BEFORE UPDATE ON public.income_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX income_items_user_id_idx ON public.income_items(user_id);

-- =============================================
-- FIXED EXPENSES (Despesas fixas)
-- =============================================
CREATE TABLE IF NOT EXISTS public.fixed_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  category text CHECK (category IN ('housing', 'utilities', 'transport', 'education', 'health', 'insurance', 'subscriptions', 'other')),
  amount numeric(12,2) NOT NULL,
  due_date integer CHECK (due_date >= 1 AND due_date <= 31),
  payment_method text,
  priority text CHECK (priority IN ('essential', 'important', 'negotiable', 'pausable')) DEFAULT 'important',
  auto_debit boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.fixed_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own fixed_expenses" ON public.fixed_expenses
  FOR ALL USING (auth.uid() = user_id);

CREATE TRIGGER update_fixed_expenses_updated_at
  BEFORE UPDATE ON public.fixed_expenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX fixed_expenses_user_id_idx ON public.fixed_expenses(user_id);
CREATE INDEX fixed_expenses_category_idx ON public.fixed_expenses(category);
CREATE INDEX fixed_expenses_priority_idx ON public.fixed_expenses(priority);

-- =============================================
-- VARIABLE EXPENSES (Despesas variáveis)
-- =============================================
CREATE TABLE IF NOT EXISTS public.variable_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  category text CHECK (category IN ('food', 'transport', 'leisure', 'shopping', 'health', 'other')),
  amount numeric(12,2) NOT NULL,
  spent_on date NOT NULL,
  is_essential boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.variable_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own variable_expenses" ON public.variable_expenses
  FOR ALL USING (auth.uid() = user_id);

CREATE TRIGGER update_variable_expenses_updated_at
  BEFORE UPDATE ON public.variable_expenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX variable_expenses_user_id_idx ON public.variable_expenses(user_id);
CREATE INDEX variable_expenses_spent_on_idx ON public.variable_expenses(spent_on);

-- =============================================
-- TRANSACTIONS (Transações para arqueologia financeira)
-- =============================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  description text NOT NULL,
  amount numeric(12,2) NOT NULL,
  category text,
  is_shadow boolean DEFAULT false,
  status text CHECK (status IN ('essential', 'superfluous', 'shadow', 'uncategorized')) DEFAULT 'uncategorized',
  source text, -- bank, card, manual
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own transactions" ON public.transactions
  FOR ALL USING (auth.uid() = user_id);

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX transactions_user_id_idx ON public.transactions(user_id);
CREATE INDEX transactions_date_idx ON public.transactions(date);
CREATE INDEX transactions_is_shadow_idx ON public.transactions(is_shadow);

-- =============================================
-- SHADOW EXPENSES (Despesas sombra identificadas)
-- =============================================
CREATE TABLE IF NOT EXISTS public.shadow_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  estimated_amount numeric(12,2),
  frequency text CHECK (frequency IN ('daily', 'weekly', 'monthly', 'occasional')) DEFAULT 'monthly',
  status text CHECK (status IN ('cut', 'pause', 'keep', 'pending')) DEFAULT 'pending',
  monthly_limit numeric(12,2),
  comment text,
  action_taken_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.shadow_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own shadow_expenses" ON public.shadow_expenses
  FOR ALL USING (auth.uid() = user_id);

CREATE TRIGGER update_shadow_expenses_updated_at
  BEFORE UPDATE ON public.shadow_expenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX shadow_expenses_user_id_idx ON public.shadow_expenses(user_id);
CREATE INDEX shadow_expenses_status_idx ON public.shadow_expenses(status);
