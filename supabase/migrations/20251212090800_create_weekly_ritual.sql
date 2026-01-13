-- Create weekly_ritual table for Day 14
CREATE TABLE public.weekly_ritual (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  checklist jsonb DEFAULT '[]'::jsonb,
  day_of_week integer CHECK (day_of_week >= 0 AND day_of_week <= 6),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.weekly_ritual ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own weekly_ritual"
  ON public.weekly_ritual FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weekly_ritual"
  ON public.weekly_ritual FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weekly_ritual"
  ON public.weekly_ritual FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own weekly_ritual"
  ON public.weekly_ritual FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_weekly_ritual_updated_at
  BEFORE UPDATE ON public.weekly_ritual
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX weekly_ritual_user_id_idx ON public.weekly_ritual(user_id);
