-- Create card_policy table for Day 5/14
CREATE TABLE public.card_policy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  weekly_limit numeric(12,2),
  installment_rule text CHECK (installment_rule IS NULL OR installment_rule IN ('never', 'exceptions_only')),
  blocked_categories text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.card_policy ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own card_policy"
  ON public.card_policy FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own card_policy"
  ON public.card_policy FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own card_policy"
  ON public.card_policy FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own card_policy"
  ON public.card_policy FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_card_policy_updated_at
  BEFORE UPDATE ON public.card_policy
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX card_policy_user_id_idx ON public.card_policy(user_id);
