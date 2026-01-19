-- =============================================
-- Day 1 Redesign - New Tables Migration
-- =============================================

-- 1. Initial Assessment (Questionário 8 perguntas)
CREATE TABLE IF NOT EXISTS public.initial_assessment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  money_feeling VARCHAR(50) NOT NULL, -- anxious/calm/confused/scared/indifferent
  has_overdue_bills VARCHAR(20) NOT NULL, -- yes/no/unsure
  monthly_income DECIMAL(12,2) NOT NULL,
  top_expenses JSONB NOT NULL DEFAULT '[]', -- ["Aluguel", "Mercado", "Transporte"]
  shares_finances BOOLEAN NOT NULL DEFAULT false,
  shares_with VARCHAR(100),
  biggest_blocker VARCHAR(100) NOT NULL, -- low_income/overspending/debts/no_control/dont_know
  main_goal TEXT NOT NULL, -- max 200 chars
  tried_before BOOLEAN NOT NULL DEFAULT false,
  what_blocked TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.initial_assessment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assessment" ON public.initial_assessment 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assessment" ON public.initial_assessment 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assessment" ON public.initial_assessment 
  FOR UPDATE USING (auth.uid() = user_id);

-- 2. Daily Log (Termômetro Respirar - rastreado todos os 15 dias)
CREATE TABLE IF NOT EXISTS public.daily_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 15),
  breathe_score INTEGER NOT NULL CHECK (breathe_score >= 0 AND breathe_score <= 10),
  breathe_reason TEXT NOT NULL,
  completed_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'draft', -- draft/completed
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, day_number)
);

ALTER TABLE public.daily_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own logs" ON public.daily_log 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs" ON public.daily_log 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own logs" ON public.daily_log 
  FOR UPDATE USING (auth.uid() = user_id);

-- 3. User Commitment (Compromisso diário)
CREATE TABLE IF NOT EXISTS public.user_commitment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  daily_time_period VARCHAR(20) NOT NULL, -- morning/afternoon/night
  daily_time_exact TIME NOT NULL,
  reminder_enabled BOOLEAN DEFAULT true,
  reminder_channels JSONB NOT NULL DEFAULT '["push"]', -- ["push", "whatsapp", "email"]
  minimum_step VARCHAR(100) NOT NULL, -- passo mínimo de emergência
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_commitment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own commitment" ON public.user_commitment 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own commitment" ON public.user_commitment 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own commitment" ON public.user_commitment 
  FOR UPDATE USING (auth.uid() = user_id);

-- 4. Add fields to user_profile if not exist
ALTER TABLE public.user_profile 
  ADD COLUMN IF NOT EXISTS current_day INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo';

-- 5. Triggers for updated_at
CREATE TRIGGER set_initial_assessment_updated_at 
  BEFORE UPDATE ON public.initial_assessment 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_user_commitment_updated_at 
  BEFORE UPDATE ON public.user_commitment 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 6. Indexes for performance
CREATE INDEX IF NOT EXISTS initial_assessment_user_id_idx ON public.initial_assessment(user_id);
CREATE INDEX IF NOT EXISTS daily_log_user_id_idx ON public.daily_log(user_id);
CREATE INDEX IF NOT EXISTS daily_log_day_number_idx ON public.daily_log(user_id, day_number);
CREATE INDEX IF NOT EXISTS user_commitment_user_id_idx ON public.user_commitment(user_id);
