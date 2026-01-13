-- Create plan_306090 table for Day 13
CREATE TABLE public.plan_306090 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  goals_30 text[] DEFAULT '{}',
  goals_60 text[] DEFAULT '{}',
  goals_90 text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.plan_306090 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own plan_306090"
  ON public.plan_306090 FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plan_306090"
  ON public.plan_306090 FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plan_306090"
  ON public.plan_306090 FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plan_306090"
  ON public.plan_306090 FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_plan_306090_updated_at
  BEFORE UPDATE ON public.plan_306090
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX plan_306090_user_id_idx ON public.plan_306090(user_id);
