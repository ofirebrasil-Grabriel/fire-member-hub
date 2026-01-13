-- =============================================
-- FIRE 15D APP - Complete Database Schema
-- =============================================

-- 1. User Profile (Day 1 setup)
CREATE TABLE public.user_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  fixed_time time,
  sources text[] DEFAULT '{}',
  anxiety_score integer CHECK (anxiety_score >= 0 AND anxiety_score <= 10),
  clarity_score integer CHECK (clarity_score >= 0 AND clarity_score <= 10),
  no_new_debt_commitment boolean DEFAULT false,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.user_profile FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.user_profile FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.user_profile FOR UPDATE USING (auth.uid() = user_id);

-- 2. Debts (Day 2 CRUD)
CREATE TABLE public.debts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  creditor text NOT NULL,
  type text,
  installment_value decimal(12,2),
  total_balance decimal(12,2),
  due_day integer CHECK (due_day >= 1 AND due_day <= 31),
  status text DEFAULT 'pending',
  is_critical boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own debts" ON public.debts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own debts" ON public.debts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own debts" ON public.debts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own debts" ON public.debts FOR DELETE USING (auth.uid() = user_id);

-- 3. Calendar Items (Day 3 CRUD)
CREATE TABLE public.calendar_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  value decimal(12,2),
  due_date date,
  is_fixed boolean DEFAULT false,
  is_critical boolean DEFAULT false,
  source_debt_id uuid REFERENCES public.debts(id) ON DELETE SET NULL,
  paid boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.calendar_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own calendar" ON public.calendar_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own calendar" ON public.calendar_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own calendar" ON public.calendar_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own calendar" ON public.calendar_items FOR DELETE USING (auth.uid() = user_id);

-- 4. Monthly Budget (Day 4/7)
CREATE TABLE public.monthly_budget (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  month_year text NOT NULL,
  income decimal(12,2),
  essentials jsonb DEFAULT '{}',
  minimum_debts decimal(12,2),
  leisure decimal(12,2),
  gap decimal(12,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, month_year)
);

ALTER TABLE public.monthly_budget ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own budget" ON public.monthly_budget FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own budget" ON public.monthly_budget FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own budget" ON public.monthly_budget FOR UPDATE USING (auth.uid() = user_id);

-- 5. Card Policy (Day 5/14)
CREATE TABLE public.card_policy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  weekly_limit decimal(12,2),
  installment_rule text DEFAULT 'never',
  blocked_categories text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.card_policy ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own policy" ON public.card_policy FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own policy" ON public.card_policy FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own policy" ON public.card_policy FOR UPDATE USING (auth.uid() = user_id);

-- 6. Cuts (Day 6)
CREATE TABLE public.cuts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item text NOT NULL,
  estimated_value decimal(12,2),
  category text,
  status text DEFAULT 'proposed',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.cuts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cuts" ON public.cuts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cuts" ON public.cuts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cuts" ON public.cuts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cuts" ON public.cuts FOR DELETE USING (auth.uid() = user_id);

-- 7. Negotiations (Day 11/12 CRUD)
CREATE TABLE public.negotiations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  debt_id uuid REFERENCES public.debts(id) ON DELETE SET NULL,
  creditor text NOT NULL,
  channel text,
  script_used boolean DEFAULT false,
  status text DEFAULT 'pending',
  max_entry decimal(12,2),
  max_installment decimal(12,2),
  notes text,
  response text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.negotiations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own negotiations" ON public.negotiations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own negotiations" ON public.negotiations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own negotiations" ON public.negotiations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own negotiations" ON public.negotiations FOR DELETE USING (auth.uid() = user_id);

-- 8. Plan 30/60/90 (Day 13)
CREATE TABLE public.plan_306090 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  goals_30 text[] DEFAULT '{}',
  goals_60 text[] DEFAULT '{}',
  goals_90 text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.plan_306090 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own plan" ON public.plan_306090 FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own plan" ON public.plan_306090 FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own plan" ON public.plan_306090 FOR UPDATE USING (auth.uid() = user_id);

-- 9. Weekly Ritual (Day 14)
CREATE TABLE public.weekly_ritual (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  checklist jsonb DEFAULT '[]',
  day_of_week integer CHECK (day_of_week >= 0 AND day_of_week <= 6),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.weekly_ritual ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ritual" ON public.weekly_ritual FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ritual" ON public.weekly_ritual FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ritual" ON public.weekly_ritual FOR UPDATE USING (auth.uid() = user_id);

-- 10. Add payload column to day_progress
ALTER TABLE public.day_progress 
ADD COLUMN IF NOT EXISTS payload jsonb DEFAULT '{}';

-- 11. Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 12. Add triggers for updated_at
CREATE TRIGGER set_user_profile_updated_at BEFORE UPDATE ON public.user_profile FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_debts_updated_at BEFORE UPDATE ON public.debts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_monthly_budget_updated_at BEFORE UPDATE ON public.monthly_budget FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_card_policy_updated_at BEFORE UPDATE ON public.card_policy FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_negotiations_updated_at BEFORE UPDATE ON public.negotiations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_plan_306090_updated_at BEFORE UPDATE ON public.plan_306090 FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();