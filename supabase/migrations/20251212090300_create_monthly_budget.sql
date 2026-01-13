-- Create monthly_budget table for Day 4/7
CREATE TABLE public.monthly_budget (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  month_year text NOT NULL,
  income numeric(12,2),
  essentials jsonb DEFAULT '{}'::jsonb,
  minimum_debts numeric(12,2),
  gap numeric(12,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, month_year)
);

ALTER TABLE public.monthly_budget ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own monthly_budget"
  ON public.monthly_budget FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own monthly_budget"
  ON public.monthly_budget FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own monthly_budget"
  ON public.monthly_budget FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own monthly_budget"
  ON public.monthly_budget FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_monthly_budget_updated_at
  BEFORE UPDATE ON public.monthly_budget
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX monthly_budget_user_id_idx ON public.monthly_budget(user_id);
