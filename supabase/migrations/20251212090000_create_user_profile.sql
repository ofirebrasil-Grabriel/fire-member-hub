-- Create user_profile table for Day 1 setup
CREATE TABLE public.user_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  fixed_time time,
  sources text[] DEFAULT '{}',
  anxiety_score integer CHECK (anxiety_score >= 0 AND anxiety_score <= 10),
  clarity_score integer CHECK (clarity_score >= 0 AND clarity_score <= 10),
  no_new_debt_commitment boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own user_profile"
  ON public.user_profile FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own user_profile"
  ON public.user_profile FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own user_profile"
  ON public.user_profile FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own user_profile"
  ON public.user_profile FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_user_profile_updated_at
  BEFORE UPDATE ON public.user_profile
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX user_profile_user_id_idx ON public.user_profile(user_id);
