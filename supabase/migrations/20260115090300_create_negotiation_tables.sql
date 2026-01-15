-- Migration: create_negotiation_tables
-- Description: Criar tabelas de negociação para Dias 10-12

-- =============================================
-- NEGOTIATION PLANS (Planos de negociação)
-- =============================================
CREATE TABLE IF NOT EXISTS public.negotiation_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  debt_id uuid REFERENCES public.debts(id) ON DELETE CASCADE,
  
  -- Objetivo e limites
  objective text CHECK (objective IN ('reduce_interest', 'extend_term', 'discount_cash', 'suspend_temporarily', 'other')),
  max_monthly_payment numeric(12,2),
  ideal_monthly_payment numeric(12,2),
  priority text CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  
  -- Contato
  contact_phone text,
  contact_email text,
  contact_hours text,
  documents_needed text,
  
  -- Script e preparação
  scripts text,
  key_arguments text,
  
  -- Agendamento
  scheduled_at timestamptz,
  status text CHECK (status IN ('planning', 'scheduled', 'in_progress', 'completed', 'cancelled')) DEFAULT 'planning',
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.negotiation_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own negotiation_plans" ON public.negotiation_plans
  FOR ALL USING (auth.uid() = user_id);

CREATE TRIGGER update_negotiation_plans_updated_at
  BEFORE UPDATE ON public.negotiation_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX negotiation_plans_user_id_idx ON public.negotiation_plans(user_id);
CREATE INDEX negotiation_plans_debt_id_idx ON public.negotiation_plans(debt_id);
CREATE INDEX negotiation_plans_status_idx ON public.negotiation_plans(status);

-- =============================================
-- NEGOTIATION SESSIONS (Sessões de negociação)
-- =============================================
CREATE TABLE IF NOT EXISTS public.negotiation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  negotiation_plan_id uuid REFERENCES public.negotiation_plans(id) ON DELETE CASCADE NOT NULL,
  
  -- Quando
  scheduled_at timestamptz,
  completed_at timestamptz,
  
  -- Status
  status text CHECK (status IN ('pending', 'completed', 'counter_offer', 'accepted', 'rejected', 'no_answer', 'rescheduled')) DEFAULT 'pending',
  
  -- Proposta recebida
  proposed_total_value numeric(12,2),
  proposed_monthly_value numeric(12,2),
  proposed_installments integer,
  proposed_interest numeric(5,2),
  proposed_entry_value numeric(12,2),
  
  -- Notas
  notes text,
  next_steps text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.negotiation_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own negotiation_sessions" ON public.negotiation_sessions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.negotiation_plans np
      WHERE np.id = negotiation_plan_id AND np.user_id = auth.uid()
    )
  );

CREATE TRIGGER update_negotiation_sessions_updated_at
  BEFORE UPDATE ON public.negotiation_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX negotiation_sessions_plan_id_idx ON public.negotiation_sessions(negotiation_plan_id);
CREATE INDEX negotiation_sessions_status_idx ON public.negotiation_sessions(status);

-- =============================================
-- AGREEMENTS (Acordos fechados)
-- =============================================
CREATE TABLE IF NOT EXISTS public.agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  debt_id uuid REFERENCES public.debts(id) ON DELETE SET NULL,
  negotiation_plan_id uuid REFERENCES public.negotiation_plans(id) ON DELETE SET NULL,
  
  -- Detalhes do acordo
  creditor_name text NOT NULL,
  original_value numeric(12,2),
  total_amount numeric(12,2) NOT NULL,
  entry_amount numeric(12,2) DEFAULT 0,
  monthly_payment numeric(12,2) NOT NULL,
  interest_rate numeric(5,2),
  installments integer NOT NULL,
  
  -- Datas
  start_date date NOT NULL,
  end_date date,
  next_payment_date date,
  
  -- Documentos
  contract_path text,
  boleto_path text,
  
  -- Status
  status text CHECK (status IN ('active', 'completed', 'defaulted', 'cancelled')) DEFAULT 'active',
  paid_installments integer DEFAULT 0,
  
  -- Economia gerada
  savings numeric(12,2),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own agreements" ON public.agreements
  FOR ALL USING (auth.uid() = user_id);

CREATE TRIGGER update_agreements_updated_at
  BEFORE UPDATE ON public.agreements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX agreements_user_id_idx ON public.agreements(user_id);
CREATE INDEX agreements_debt_id_idx ON public.agreements(debt_id);
CREATE INDEX agreements_status_idx ON public.agreements(status);
CREATE INDEX agreements_next_payment_date_idx ON public.agreements(next_payment_date);
