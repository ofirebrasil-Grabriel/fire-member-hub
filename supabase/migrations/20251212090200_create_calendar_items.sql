-- Create calendar_items table for Day 3 CRUD
CREATE TABLE public.calendar_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  value numeric(12,2),
  due_date date,
  is_fixed boolean DEFAULT false,
  is_critical boolean DEFAULT false,
  source_debt_id uuid REFERENCES public.debts(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.calendar_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own calendar_items"
  ON public.calendar_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calendar_items"
  ON public.calendar_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calendar_items"
  ON public.calendar_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own calendar_items"
  ON public.calendar_items FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_calendar_items_updated_at
  BEFORE UPDATE ON public.calendar_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX calendar_items_user_id_idx ON public.calendar_items(user_id);
CREATE INDEX calendar_items_due_date_idx ON public.calendar_items(due_date);
