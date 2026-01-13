-- Create cuts table for Day 6
CREATE TABLE public.cuts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  item text NOT NULL,
  estimated_value numeric(12,2),
  category text,
  status text NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'executed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.cuts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cuts"
  ON public.cuts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cuts"
  ON public.cuts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cuts"
  ON public.cuts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cuts"
  ON public.cuts FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_cuts_updated_at
  BEFORE UPDATE ON public.cuts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX cuts_user_id_idx ON public.cuts(user_id);
