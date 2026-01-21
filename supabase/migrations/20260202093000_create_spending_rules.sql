-- Create spending_rules table for Day 4
CREATE TABLE IF NOT EXISTS public.spending_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  banned_list jsonb NOT NULL DEFAULT '[]',
  exceptions jsonb NOT NULL DEFAULT '[]',
  total_limit numeric(12,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.spending_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own spending_rules" ON public.spending_rules
  FOR ALL USING (auth.uid() = user_id);

CREATE TRIGGER update_spending_rules_updated_at
  BEFORE UPDATE ON public.spending_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS spending_rules_user_id_idx ON public.spending_rules(user_id);
