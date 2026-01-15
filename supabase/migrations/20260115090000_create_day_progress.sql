-- Migration: create_day_progress
-- Description: Tabela para armazenar progresso do usuário em cada dia do desafio

-- Criar tabela day_progress
CREATE TABLE IF NOT EXISTS public.day_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day_id integer NOT NULL,
  
  -- Status de conclusão
  completed boolean DEFAULT false,
  completed_at timestamptz,
  completed_tasks jsonb DEFAULT '[]',
  
  -- Dados do formulário
  form_data jsonb DEFAULT '{}',
  mood integer CHECK (mood >= 0 AND mood <= 10),
  diary_entry text,
  
  -- Output
  pdf_url text,
  reward_claimed boolean DEFAULT false,
  reward_timestamp timestamptz,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints
  UNIQUE (user_id, day_id)
);

-- Enable RLS
ALTER TABLE public.day_progress ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own day_progress"
  ON public.day_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own day_progress"
  ON public.day_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own day_progress"
  ON public.day_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own day_progress"
  ON public.day_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER update_day_progress_updated_at
  BEFORE UPDATE ON public.day_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX day_progress_user_id_idx ON public.day_progress(user_id);
CREATE INDEX day_progress_day_id_idx ON public.day_progress(day_id);
CREATE INDEX day_progress_completed_idx ON public.day_progress(completed);
