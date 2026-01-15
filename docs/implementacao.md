# Plano de Implementação - FIRE Brasil 15D

## 1. ANÁLISE DA ESTRUTURA ATUAL

### 1.1 O que já existe no código

| Componente | Status | Localização |
|------------|--------|-------------|
| `dayEngine.ts` | ⚠️ Simplificado | `src/config/dayEngine.ts` |
| Tabela `debts` | ✅ Implementado | `supabase/migrations/...debts.sql` |
| Tabela `calendar_items` | ✅ Implementado | `supabase/migrations/...calendar.sql` |
| Tabela `cuts` | ✅ Implementado | `supabase/migrations/...cuts.sql` |
| Tabela `negotiations` | ✅ Implementado | `supabase/migrations/...negotiations.sql` |
| Tabela `plan_306090` | ⚠️ Básico | `supabase/migrations/...plan_306090.sql` |
| `UserProgressContext` | ⚠️ localStorage | `src/contexts/UserProgressContext.tsx` |
| Hooks de CRUD | ✅ Básico | `src/hooks/useDebts.ts`, etc. |

### 1.2 GAPs Identificados

1. **dayEngine.ts não reflete estrutura_curso.md** - Títulos e tarefas divergem
2. **Formulários complexos dos dias não existem** - Dia 1 tem 12 perguntas, código tem 5 inputs
3. **Faltam tabelas**: `income_items`, `fixed_expenses`, `variable_expenses`, `transactions`, `shadow_expenses`, `agreements`, `negotiation_plans`, `emergency_fund`, `weekly_protocol`, `decision_rules`, `progress_dashboard`
4. **Progresso não sincroniza com Supabase** - Usa localStorage
5. **Não há geração de PDF** - Edge Function necessária
6. **Faltam campos**: `motivation_phrase`, `reward_label`, `pdf_url` na tabela `days`

---

## 2. MIGRAÇÕES SQL NECESSÁRIAS

### 2.1 Atualizar tabela `days`

```sql
-- Migration: add_motivation_reward_to_days.sql
ALTER TABLE public.days 
ADD COLUMN IF NOT EXISTS motivation_phrase text,
ADD COLUMN IF NOT EXISTS reward_label text,
ADD COLUMN IF NOT EXISTS reward_icon text;
```

### 2.2 Criar tabela `day_progress`

```sql
-- Migration: create_day_progress.sql
CREATE TABLE public.day_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day_id integer NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  completed_tasks jsonb DEFAULT '[]',
  form_data jsonb DEFAULT '{}',
  mood text,
  diary_entry text,
  pdf_url text,
  reward_claimed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, day_id)
);

ALTER TABLE public.day_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own progress" ON public.day_progress
  FOR ALL USING (auth.uid() = user_id);
```

### 2.3 Criar tabelas financeiras

```sql
-- Migration: create_income_items.sql
CREATE TABLE public.income_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  source text NOT NULL,
  amount numeric(12,2) NOT NULL,
  received_on integer CHECK (received_on >= 1 AND received_on <= 31),
  recurrence text CHECK (recurrence IN ('monthly', 'weekly', 'one_time')),
  created_at timestamptz DEFAULT now()
);

-- Migration: create_fixed_expenses.sql
CREATE TABLE public.fixed_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  category text,
  amount numeric(12,2) NOT NULL,
  due_date integer,
  payment_method text,
  priority text CHECK (priority IN ('essential', 'important', 'negotiable', 'pausable')),
  created_at timestamptz DEFAULT now()
);

-- Migration: create_variable_expenses.sql
CREATE TABLE public.variable_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  category text,
  amount numeric(12,2) NOT NULL,
  spent_on date NOT NULL,
  is_essential boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Migration: create_transactions.sql
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  description text NOT NULL,
  amount numeric(12,2) NOT NULL,
  category text,
  is_shadow boolean DEFAULT false,
  status text CHECK (status IN ('essential', 'superfluous', 'shadow')),
  created_at timestamptz DEFAULT now()
);

-- Migration: create_shadow_expenses.sql
CREATE TABLE public.shadow_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  estimated_amount numeric(12,2),
  status text CHECK (status IN ('cut', 'pause', 'keep')),
  comment text,
  created_at timestamptz DEFAULT now()
);
```

### 2.4 Criar tabelas de negociação

```sql
-- Migration: create_negotiation_plans.sql
CREATE TABLE public.negotiation_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  debt_id uuid REFERENCES public.debts(id) ON DELETE CASCADE,
  objective text CHECK (objective IN ('reduce_interest', 'extend_term', 'discount_cash', 'suspend')),
  max_monthly_payment numeric(12,2),
  priority text CHECK (priority IN ('high', 'medium', 'low')),
  contact_info jsonb,
  scripts text,
  scheduled_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Migration: create_negotiation_sessions.sql
CREATE TABLE public.negotiation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  negotiation_plan_id uuid REFERENCES public.negotiation_plans(id) ON DELETE CASCADE,
  scheduled_at timestamptz,
  status text CHECK (status IN ('pending', 'completed', 'counter_offer', 'accepted', 'rejected')),
  notes text,
  proposed_value numeric(12,2),
  proposed_installments integer,
  created_at timestamptz DEFAULT now()
);

-- Migration: create_agreements.sql
CREATE TABLE public.agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  debt_id uuid REFERENCES public.debts(id),
  total_amount numeric(12,2) NOT NULL,
  monthly_payment numeric(12,2) NOT NULL,
  interest_rate numeric(5,2),
  installments integer NOT NULL,
  start_date date NOT NULL,
  contract_path text,
  created_at timestamptz DEFAULT now()
);
```

### 2.5 Criar tabelas Plano 30/90 e Regras

```sql
-- Migration: create_plans.sql
CREATE TABLE public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cycle_type text NOT NULL CHECK (cycle_type IN ('30', '90')),
  mode text CHECK (mode IN ('emergency', 'balance', 'traction')),
  start_date date NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.plan_essentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid REFERENCES public.plans(id) ON DELETE CASCADE,
  name text NOT NULL,
  due_date integer,
  minimum_amount numeric(12,2),
  payment_method text
);

CREATE TABLE public.plan_debt_priorities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid REFERENCES public.plans(id) ON DELETE CASCADE,
  debt_id uuid REFERENCES public.debts(id),
  action_type text CHECK (action_type IN ('negotiate', 'pay_minimum', 'protect')),
  action_value numeric(12,2)
);

CREATE TABLE public.plan_levers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid REFERENCES public.plans(id) ON DELETE CASCADE,
  type text,
  goal_text text NOT NULL,
  weekly_action text,
  success_criteria text
);

-- Migration: create_emergency_fund.sql
CREATE TABLE public.emergency_fund (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  account_info text,
  monthly_contribution numeric(12,2),
  goal_amount numeric(12,2),
  current_balance numeric(12,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Migration: create_weekly_protocol.sql
CREATE TABLE public.weekly_protocol (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  day_of_week integer CHECK (day_of_week >= 0 AND day_of_week <= 6),
  time time,
  checklist jsonb NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Migration: create_decision_rules.sql
CREATE TABLE public.decision_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  primary_trigger text,
  default_action text,
  levels jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Migration: create_progress_dashboard.sql
CREATE TABLE public.progress_dashboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  indicators jsonb NOT NULL,
  commitment_phrase text,
  created_at timestamptz DEFAULT now()
);
```

---

## 3. IMPLEMENTAÇÃO POR DIA

### DIA 1 - Boas-vindas e Despertar

**Objetivo**: Reconhecer emoções, crenças sobre dinheiro, conhecer regras do desafio.

**Formulário (12 perguntas)**:
```typescript
interface Day1FormData {
  feeling_about_money: 'light' | 'heavy' | 'want_to_run';
  first_money_memories: string;
  rich_people_traits: string;
  poor_people_traits: string;
  current_emotions: string[];
  ideal_life: string;
  current_issues: string[];
  monthly_income: number;
  biggest_expense: string;
  has_partner: 'yes' | 'no' | 'sometimes';
  biggest_block: string;
  goal_15_days: string;
  schedule_time: string;
  breath_score: number; // 0-10
  breath_note: string;
}
```

**Componente**: `src/components/day/Day1Form.tsx`

**Salvar em**: `day_progress.form_data` (JSON)

---

### DIA 2 - Raio-X do Caos

**Objetivo**: Mapear entradas e saídas de dinheiro.

**Stepper 3 passos**:
1. Entradas → CRUD `income_items`
2. Saídas fixas → CRUD `fixed_expenses`
3. Saídas variáveis + dívidas → CRUD `variable_expenses` + `debts`

**Componente**: `src/components/day/Day2Stepper.tsx`

**Output automático**: Calcular totais e sobra/falta

---

### DIA 3 - Arqueologia Financeira

**Objetivo**: Investigar últimos 90 dias, identificar padrões.

**Funcionalidades**:
- Upload/import de extratos (CSV/OFX) → `transactions`
- Tabela interativa para categorizar
- Marcar despesas sombra (`is_shadow = true`)
- Identificar Top 5 despesas

**Componente**: `src/components/day/Day3TransactionTable.tsx`

---

### DIA 4 - Regra da Pausa

**Objetivo**: Congelar cartões, ativar regra 24h.

**Formulário**:
```typescript
interface Day4FormData {
  frozen_cards: string[];
  emergency_card: string;
  triggers: string[];
  substitute_actions: string[];
  rule_24h_enabled: boolean;
}
```

**Salvar em**: `card_policy` + `day_progress.form_data`

---

### DIA 5 - Cartão: Parar Fatura

**Objetivo**: Controlar cartão, evitar rotativo.

**Funcionalidades**:
- Listar faturas em aberto
- Calcular rotativo
- Definir regras de uso

**Salvar em**: `card_policy`

---

### DIA 6 - Vazamentos Invisíveis

**Objetivo**: Eliminar gastos pequenos recorrentes.

**CRUD**: `shadow_expenses` com status (cut/pause/keep)

**Output**: Economia total prevista

---

### DIA 7 - Vencimentos

**Objetivo**: Organizar por data de vencimento.

**Componente**: Calendário visual
- Dados de `fixed_expenses`, `debts`, `agreements`
- Permitir alterar datas

---

### DIA 8 - Prioridades

**Objetivo**: Decidir o que pagar primeiro quando não dá.

**Matriz de prioridade**:
- Classificar `fixed_expenses` por priority
- Atualizar `fixed_expenses.priority`

---

### DIA 9 - Orçamento Mínimo 30 Dias

**Objetivo**: Construir orçamento mínimo realista.

**Calcular**:
- Total essenciais
- Tetos variáveis
- Comparar com renda

**Salvar em**: `monthly_budget`

---

### DIA 10 - Mapa de Negociação

**Objetivo**: Criar plano para negociar dívidas.

**CRUD**: `negotiation_plans`
- Vincular a `debts`
- Definir objetivo, limite, scripts

---

### DIA 11 - Estudar Negociação

**Objetivo**: Aprender a negociar.

**Funcionalidades**:
- Exibir materiais (vídeos, textos)
- Editor de scripts
- Simulador de conversa (opcional)

---

### DIA 12 - Fechar Acordo

**Objetivo**: Executar negociações.

**CRUD**: `negotiation_sessions` + `agreements`

---

### DIA 13 - Novas Regras de Vida

**Objetivo**: Criar hábitos sustentáveis.

**Salvar em**:
- `card_policy` (regras de cartão)
- `emergency_fund` (caixinha)
- `weekly_ritual` (rotina)

---

### DIA 14 - Plano 30/90

**Objetivo**: Plano integrado.

**CRUD**: `plans` + relações
- `plan_essentials`
- `plan_debt_priorities`
- `plan_levers`

---

### DIA 15 - Formatura

**Objetivo**: Protocolo semanal + painel de progresso.

**Salvar em**:
- `weekly_protocol`
- `decision_rules`
- `progress_dashboard`

**Output**: Certificado de conclusão

---

## 4. HOOKS A CRIAR

| Hook | Tabela | Arquivo |
|------|--------|---------|
| `useIncomeItems` | `income_items` | `src/hooks/useIncomeItems.ts` |
| `useFixedExpenses` | `fixed_expenses` | `src/hooks/useFixedExpenses.ts` |
| `useVariableExpenses` | `variable_expenses` | `src/hooks/useVariableExpenses.ts` |
| `useTransactions` | `transactions` | `src/hooks/useTransactions.ts` |
| `useShadowExpenses` | `shadow_expenses` | `src/hooks/useShadowExpenses.ts` |
| `useNegotiationPlans` | `negotiation_plans` | `src/hooks/useNegotiationPlans.ts` |
| `useNegotiationSessions` | `negotiation_sessions` | `src/hooks/useNegotiationSessions.ts` |
| `useAgreements` | `agreements` | `src/hooks/useAgreements.ts` |
| `usePlans` | `plans` + relações | `src/hooks/usePlans.ts` |
| `useEmergencyFund` | `emergency_fund` | `src/hooks/useEmergencyFund.ts` |
| `useWeeklyProtocol` | `weekly_protocol` | `src/hooks/useWeeklyProtocol.ts` |
| `useDecisionRules` | `decision_rules` | `src/hooks/useDecisionRules.ts` |
| `useProgressDashboard` | `progress_dashboard` | `src/hooks/useProgressDashboard.ts` |
| `useDayProgress` | `day_progress` | `src/hooks/useDayProgress.ts` |

---

## 5. EDGE FUNCTIONS

### 5.1 `complete-day`

```
POST /functions/v1/complete-day
Body: { dayId, formData, mood, tasks }
Response: { motivationPhrase, reward, pdfUrl }
```

### 5.2 `generate-day-pdf`

Gera PDF com resumo do dia usando template HTML.

---

## 6. COMPONENTES DE UI

| Componente | Dia | Descrição |
|------------|-----|-----------|
| `Day1Form.tsx` | 1 | Formulário 12 perguntas + termômetro |
| `Day2Stepper.tsx` | 2 | Stepper entradas/saídas/dívidas |
| `Day3TransactionTable.tsx` | 3 | Tabela categorizável |
| `Day4PauseRule.tsx` | 4 | Congelamento + gatilhos |
| `Day5CardControl.tsx` | 5 | Faturas e regras |
| `Day6ShadowExpenses.tsx` | 6 | Lista cut/pause/keep |
| `Day7Calendar.tsx` | 7 | Calendário vencimentos |
| `Day8PriorityMatrix.tsx` | 8 | Drag-and-drop prioridades |
| `Day9BudgetBuilder.tsx` | 9 | Calculadora orçamento |
| `Day10NegotiationMap.tsx` | 10 | Lista planos |
| `Day11StudyMaterials.tsx` | 11 | Vídeos + scripts |
| `Day12AgreementForm.tsx` | 12 | Formulário acordos |
| `Day13LifeRules.tsx` | 13 | Cards regras |
| `Day14Plan3090.tsx` | 14 | Stepper 5 passos |
| `Day15Graduation.tsx` | 15 | Protocolo + certificado |

---

## 7. ROTEIRO DE EXECUÇÃO

### Fase 1: Banco de Dados (1-2 dias)
1. [ ] Criar todas as migrações SQL
2. [ ] Executar migrações no Supabase
3. [ ] Adicionar RLS policies
4. [ ] Testar tabelas via SQL Editor

### Fase 2: Hooks (1-2 dias)
1. [ ] Criar todos os hooks listados
2. [ ] Testar CRUD básico

### Fase 3: Atualizar dayEngine (1 dia)
1. [ ] Alinhar títulos com estrutura_curso.md
2. [ ] Adicionar campos de motivação/recompensa

### Fase 4: Componentes por Dia (5-7 dias)
1. [ ] Implementar Day1Form até Day15Graduation
2. [ ] Integrar com DayModal

### Fase 5: Edge Functions (2-3 dias)
1. [ ] Implementar complete-day
2. [ ] Implementar generate-day-pdf
3. [ ] Testar geração de PDF

### Fase 6: Migrar Progresso (1 dia)
1. [ ] Refatorar UserProgressContext para usar Supabase
2. [ ] Migrar dados existentes

### Fase 7: Testes e Deploy (2-3 dias)
1. [ ] Testar fluxo completo dia a dia
2. [ ] Corrigir bugs
3. [ ] Deploy

**Total estimado: 15-20 dias de desenvolvimento**

---

## 8. PRIORIDADE DE IMPLEMENTAÇÃO

1. **CRÍTICO**: Migrações SQL + `day_progress`
2. **ALTO**: Componentes Dias 1-5 (Fase Dossie)
3. **MÉDIO**: Componentes Dias 6-9 (Fase Contenção)
4. **MÉDIO**: Componentes Dias 10-12 (Fase Acordos)
5. **BAIXO**: Componentes Dias 13-15 (Fase Motor)
6. **BAIXO**: Edge Functions de PDF

---

## 9. OBSERVAÇÕES FINAIS

1. **infra.md** e **infra 2.md** estão alinhados com este plano
2. A estrutura de `dayEngine.ts` precisa ser completamente refeita
3. Priorizar sincronização com Supabase sobre localStorage
4. Cada dia deve ter motivação + recompensa conforme regra global
5. PDFs são secundários - foco primeiro no fluxo funcional
