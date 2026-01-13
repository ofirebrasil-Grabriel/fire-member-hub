-- Create negotiations table for Day 11/12
CREATE TABLE public.negotiations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  debt_id uuid REFERENCES public.debts(id) ON DELETE SET NULL,
  creditor text NOT NULL,
  channel text,
  script_used boolean DEFAULT false,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'accepted', 'rejected')),
  max_entry numeric(12,2),
  max_installment numeric(12,2),
  notes text,
  response text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.negotiations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own negotiations"
  ON public.negotiations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own negotiations"
  ON public.negotiations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own negotiations"
  ON public.negotiations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own negotiations"
  ON public.negotiations FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_negotiations_updated_at
  BEFORE UPDATE ON public.negotiations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX negotiations_user_id_idx ON public.negotiations(user_id);
CREATE INDEX negotiations_debt_id_idx ON public.negotiations(debt_id);
