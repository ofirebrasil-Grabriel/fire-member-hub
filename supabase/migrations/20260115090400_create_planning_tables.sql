-- Migration: create_planning_tables
-- Description: Criar tabelas de planejamento e regras para Dias 13-15

-- =============================================
-- PLANS (Planos 30/90)
-- =============================================
CREATE TABLE IF NOT EXISTS public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Configuração
  cycle_type text NOT NULL CHECK (cycle_type IN ('30', '90')),
  mode text CHECK (mode IN ('emergency', 'balance', 'traction')),
  
  -- Datas
  start_date date NOT NULL,
  end_date date,
  
  -- Status
  status text CHECK (status IN ('active', 'completed', 'abandoned')) DEFAULT 'active',
  
  -- Frase de compromisso
  commitment_phrase text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own plans" ON public.plans
  FOR ALL USING (auth.uid() = user_id);

CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX plans_user_id_idx ON public.plans(user_id);
CREATE INDEX plans_status_idx ON public.plans(status);

-- =============================================
-- PLAN ESSENTIALS (Essenciais do plano)
-- =============================================
CREATE TABLE IF NOT EXISTS public.plan_essentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid REFERENCES public.plans(id) ON DELETE CASCADE NOT NULL,
  
  name text NOT NULL,
  due_date integer CHECK (due_date >= 1 AND due_date <= 31),
  minimum_amount numeric(12,2),
  payment_method text,
  alert_days_before integer DEFAULT 3,
  
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.plan_essentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own plan_essentials" ON public.plan_essentials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.plans p WHERE p.id = plan_id AND p.user_id = auth.uid()
    )
  );

-- =============================================
-- PLAN DEBT PRIORITIES (Dívidas prioritárias)
-- =============================================
CREATE TABLE IF NOT EXISTS public.plan_debt_priorities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid REFERENCES public.plans(id) ON DELETE CASCADE NOT NULL,
  debt_id uuid REFERENCES public.debts(id) ON DELETE CASCADE,
  
  action_type text CHECK (action_type IN ('negotiate', 'pay_minimum', 'protect')) NOT NULL,
  action_value numeric(12,2),
  action_due_date date,
  contact_channel text,
  notes text,
  
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.plan_debt_priorities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own plan_debt_priorities" ON public.plan_debt_priorities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.plans p WHERE p.id = plan_id AND p.user_id = auth.uid()
    )
  );

-- =============================================
-- PLAN LEVERS (Alavancas de 90 dias)
-- =============================================
CREATE TABLE IF NOT EXISTS public.plan_levers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid REFERENCES public.plans(id) ON DELETE CASCADE NOT NULL,
  
  type text CHECK (type IN ('extra_income', 'sell_items', 'reduce_service', 'cancel_subscription', 'rent_asset', 'freelance', 'other')),
  goal_text text NOT NULL,
  weekly_action text,
  success_criteria text,
  
  status text CHECK (status IN ('planned', 'in_progress', 'completed', 'abandoned')) DEFAULT 'planned',
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.plan_levers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own plan_levers" ON public.plan_levers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.plans p WHERE p.id = plan_id AND p.user_id = auth.uid()
    )
  );

-- =============================================
-- PLAN CHECKPOINTS (Marcos de revisão)
-- =============================================
CREATE TABLE IF NOT EXISTS public.plan_checkpoints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid REFERENCES public.plans(id) ON DELETE CASCADE NOT NULL,
  
  checkpoint_date date NOT NULL,
  checkpoint_type text CHECK (checkpoint_type IN ('weekly', '30d', '60d', '90d')) NOT NULL,
  checklist jsonb,
  notes text,
  
  completed_at timestamptz,
  
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.plan_checkpoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own plan_checkpoints" ON public.plan_checkpoints
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.plans p WHERE p.id = plan_id AND p.user_id = auth.uid()
    )
  );

-- =============================================
-- EMERGENCY FUND (Caixinha de emergência)
-- =============================================
CREATE TABLE IF NOT EXISTS public.emergency_fund (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  account_info text,
  account_type text CHECK (account_type IN ('savings', 'digital', 'piggy_bank', 'other')),
  monthly_contribution numeric(12,2),
  goal_amount numeric(12,2),
  current_balance numeric(12,2) DEFAULT 0,
  
  auto_transfer boolean DEFAULT false,
  transfer_day integer CHECK (transfer_day >= 1 AND transfer_day <= 31),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.emergency_fund ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own emergency_fund" ON public.emergency_fund
  FOR ALL USING (auth.uid() = user_id);

CREATE TRIGGER update_emergency_fund_updated_at
  BEFORE UPDATE ON public.emergency_fund
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- WEEKLY PROTOCOL (Protocolo semanal)
-- =============================================
CREATE TABLE IF NOT EXISTS public.weekly_protocol (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  day_of_week integer CHECK (day_of_week >= 0 AND day_of_week <= 6),
  time time,
  duration_minutes integer DEFAULT 10,
  
  checklist jsonb NOT NULL DEFAULT '[]',
  
  active boolean DEFAULT true,
  reminder_enabled boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.weekly_protocol ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own weekly_protocol" ON public.weekly_protocol
  FOR ALL USING (auth.uid() = user_id);

CREATE TRIGGER update_weekly_protocol_updated_at
  BEFORE UPDATE ON public.weekly_protocol
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- DECISION RULES (Regras de decisão)
-- =============================================
CREATE TABLE IF NOT EXISTS public.decision_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  primary_trigger text CHECK (primary_trigger IN ('anxiety', 'boredom', 'social_pressure', 'tiredness', 'family', 'other')),
  default_action text CHECK (default_action IN ('pause_24h', 'open_dashboard', 'call_someone', 'walk_10min', 'breathe', 'other')),
  
  -- Níveis de ação
  level_1 jsonb, -- Não piorar
  level_2 jsonb, -- Estabilizar
  level_3 jsonb, -- Ganhar tração
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.decision_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own decision_rules" ON public.decision_rules
  FOR ALL USING (auth.uid() = user_id);

CREATE TRIGGER update_decision_rules_updated_at
  BEFORE UPDATE ON public.decision_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- PROGRESS DASHBOARD (Painel de progresso)
-- =============================================
CREATE TABLE IF NOT EXISTS public.progress_dashboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Indicadores (array de objetos)
  indicators jsonb NOT NULL DEFAULT '[
    {"key": "essentials_on_time", "name": "Essenciais em dia", "target": null},
    {"key": "budget_balance", "name": "Sobra do orçamento", "target": null},
    {"key": "card_control", "name": "Cartão sob controle", "target": null},
    {"key": "emergency_fund", "name": "Caixinha", "target": null}
  ]',
  
  -- Frase final
  commitment_phrase text,
  
  -- Certificado
  certificate_generated_at timestamptz,
  certificate_url text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.progress_dashboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own progress_dashboard" ON public.progress_dashboard
  FOR ALL USING (auth.uid() = user_id);

CREATE TRIGGER update_progress_dashboard_updated_at
  BEFORE UPDATE ON public.progress_dashboard
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
