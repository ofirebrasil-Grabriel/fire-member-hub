Vou analisar o estado atual do projeto e comparar com a visão do prompt que você compartilhou para criar um plano de implementação detalhado.

Agora entendo completamente a situação. Vou analisar as diferenças entre o estado atual e a visão do prompt para criar um plano detalhado.

## Análise: Estado Atual vs. Visão do Prompt

| Aspecto | Estado Atual | Visão do Prompt |
|---------|--------------|-----------------|
| **Navegação** | Múltiplas páginas (`/dia/1`, `/dia/2`...) | Tela única `/app` com modais |
| **Experiência** | Página completa por dia | Modal wizard por dia |
| **Inputs** | Checklist simples + diário livre | Formulários estruturados com schema por dia |
| **Outputs** | Nenhum output visual | OutputPanel com métricas após completar |
| **CRUD** | Não existe | CRUD embutido no modal (dívidas, calendário, negociações) |
| **Dados** | Apenas progresso genérico | Tabelas específicas (debts, calendar_items, negotiations) |
| **Progressão** | Baseada em `currentDay` | Calculada automaticamente |
| **Gamificação** | Básica (progresso %) | Placar, ansiedade/clareza, celebrações |

# Plano de Implementação: Transformação para "FIRE 15D App" Single-Screen

## Visão Geral da Transformação

Vamos transformar a área de membros atual em um **sistema de execução guiada single-screen**, onde:
- Uma única tela principal exibe o "Caminho 15D"
- Cada dia abre um **Modal** com wizard de inputs + output + CRUD (quando necessário)
- Dados são salvos em tabelas específicas no Supabase (debts, calendar_items, negotiations)

---

## EPIC 1: Banco de Dados - Novas Tabelas para CRUD

### 1.1 Tabela `user_profile` (Dia 1)
```sql
CREATE TABLE user_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  fixed_time time,
  sources text[], -- bancos, cartões, crediário
  anxiety_score integer CHECK (anxiety_score >= 0 AND anxiety_score <= 10),
  clarity_score integer CHECK (clarity_score >= 0 AND clarity_score <= 10),
  no_new_debt_commitment boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
-- RLS: user_id = auth.uid()
```

### 1.2 Tabela `debts` (Dia 2 - CRUD)
```sql
CREATE TABLE debts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  creditor text NOT NULL,
  type text, -- cartão, empréstimo, crediário, etc.
  installment_value decimal(12,2),
  total_balance decimal(12,2),
  due_day integer CHECK (due_day >= 1 AND due_day <= 31),
  status text DEFAULT 'pending', -- pending, negotiating, paid
  is_critical boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
-- RLS: user_id = auth.uid()
```

### 1.3 Tabela `calendar_items` (Dia 3 - CRUD)
```sql
CREATE TABLE calendar_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  value decimal(12,2),
  due_date date,
  is_fixed boolean DEFAULT false,
  is_critical boolean DEFAULT false,
  source_debt_id uuid REFERENCES debts(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
-- RLS: user_id = auth.uid()
```

### 1.4 Tabela `monthly_budget` (Dia 4/7)
```sql
CREATE TABLE monthly_budget (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  month_year text NOT NULL, -- "2026-01"
  income decimal(12,2),
  essentials jsonb DEFAULT '{}', -- {alimentação: 800, transporte: 200, ...}
  minimum_debts decimal(12,2),
  gap decimal(12,2), -- calculado: income - essentials - debts
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, month_year)
);
```

### 1.5 Tabela `card_policy` (Dia 5/14)
```sql
CREATE TABLE card_policy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  weekly_limit decimal(12,2),
  installment_rule text, -- 'never', 'exceptions_only'
  blocked_categories text[], -- delivery, shopee, etc.
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### 1.6 Tabela `cuts` (Dia 6)
```sql
CREATE TABLE cuts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item text NOT NULL,
  estimated_value decimal(12,2),
  category text, -- assinaturas, alimentação, lazer
  status text DEFAULT 'proposed', -- proposed, executed
  created_at timestamptz DEFAULT now()
);
```

### 1.7 Tabela `negotiations` (Dia 11/12 - CRUD)
```sql
CREATE TABLE negotiations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  debt_id uuid REFERENCES debts(id) ON DELETE SET NULL,
  creditor text NOT NULL,
  channel text, -- whatsapp, telefone
  script_used boolean DEFAULT false,
  status text DEFAULT 'pending', -- pending, in_progress, accepted, rejected
  max_entry decimal(12,2),
  max_installment decimal(12,2),
  notes text,
  response text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### 1.8 Tabela `plan_306090` (Dia 13)
```sql
CREATE TABLE plan_306090 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  goals_30 text[],
  goals_60 text[],
  goals_90 text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### 1.9 Tabela `weekly_ritual` (Dia 14)
```sql
CREATE TABLE weekly_ritual (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  checklist jsonb DEFAULT '[]',
  day_of_week integer CHECK (day_of_week >= 0 AND day_of_week <= 6),
  created_at timestamptz DEFAULT now()
);
```

### 1.10 Atualizar `daily_progress` (payload jsonb)
```sql
ALTER TABLE day_progress 
ADD COLUMN payload jsonb DEFAULT '{}';
```

---

## EPIC 2: Day Engine - Configuração dos 15 Dias

### 2.1 Criar Schema de Configuração
Arquivo: `src/config/dayEngine.ts`

```typescript
export interface DayConfig {
  id: number;
  title: string;
  objective: string;
  badge: string; // "15 min"
  phase: 'dossie' | 'contencao' | 'acordos' | 'motor';
  inputs: InputField[];
  crudType?: 'debts' | 'calendar' | 'negotiations' | 'cuts';
  outputMetrics?: OutputMetric[];
}

export interface InputField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'time' | 'checkbox' | 'slider' | 'select' | 'checkboxGroup' | 'textarea';
  options?: { value: string; label: string }[];
  required?: boolean;
  validation?: string; // zod schema ref
}

export interface OutputMetric {
  key: string;
  label: string;
  format: 'currency' | 'number' | 'percent' | 'text';
  calculation?: string;
}

export const DAY_ENGINE: DayConfig[] = [
  {
    id: 1,
    title: "Setup & Placar",
    objective: "Defina seu horário fixo e faça o diagnóstico inicial",
    badge: "15 min",
    phase: 'dossie',
    inputs: [
      { name: 'fixed_time', label: 'Horário fixo para o desafio', type: 'time', required: true },
      { name: 'sources', label: 'Fontes de dívidas', type: 'checkboxGroup', options: [
        { value: 'banks', label: 'Bancos' },
        { value: 'cards', label: 'Cartões' },
        { value: 'loans', label: 'Crediário' },
      ]},
      { name: 'anxiety_score', label: 'Ansiedade ao pensar em dinheiro (0-10)', type: 'slider' },
      { name: 'clarity_score', label: 'Clareza sobre suas finanças (0-10)', type: 'slider' },
      { name: 'commitment', label: 'Comprometo-me a não fazer novas parcelas por 15 dias', type: 'checkbox', required: true },
    ],
    outputMetrics: [
      { key: 'profileCreated', label: 'Perfil criado', format: 'text' },
      { key: 'commitment', label: 'Regra ativa', format: 'text' },
    ]
  },
  {
    id: 2,
    title: "Lista Mestra de Dívidas",
    objective: "Mapeie todas as suas dívidas em um só lugar",
    badge: "15 min",
    phase: 'dossie',
    crudType: 'debts',
    inputs: [], // CRUD no lugar dos inputs
    outputMetrics: [
      { key: 'totalDebts', label: 'Total de dívidas', format: 'number' },
      { key: 'criticalCount', label: 'Dívidas críticas', format: 'number' },
      { key: 'totalValue', label: 'Valor total', format: 'currency' },
    ]
  },
  // ... configurar os outros 13 dias
];
```

### 2.2 Criar Handler `completeDay`
Arquivo: `src/services/dayEngine.ts`

```typescript
export async function completeDay(dayId: number, payload: any, userId: string) {
  const config = DAY_ENGINE.find(d => d.id === dayId);
  if (!config) throw new Error('Day not found');

  // Salvar em tabela específica baseado no dia
  switch (dayId) {
    case 1:
      await saveUserProfile(userId, payload);
      break;
    case 2:
      // debts já salvos via CRUD
      break;
    case 3:
      await generateCalendarFromDebts(userId);
      break;
    case 4:
      await saveMonthlyBudget(userId, payload);
      break;
    // ... outros dias
  }

  // Sempre salvar em daily_progress
  await supabase.from('day_progress').upsert({
    user_id: userId,
    day_id: dayId,
    completed: true,
    payload,
    completed_at: new Date().toISOString()
  });

  // Calcular métricas de output
  return calculateOutputMetrics(dayId, userId);
}
```

---

## EPIC 3: Frontend - Tela Única com Modais

### 3.1 Nova Página Principal `/app`
Arquivo: `src/pages/ChallengePath.tsx`

**Estrutura Visual:**
```
+--------------------------------------------------+
|  🔥 FIRE 15D           Dia 6/15   [perfil]       |
+--------------------------------------------------+
|                                                  |
|  ○───●───●───●───●───◉───○───○───○───○           |
|  1   2   3   4   5   6   7   8   9  10          |
|                                                  |
|  ○───○───○───○───○                               |
| 11  12  13  14  15                               |
|                                                  |
|  +--------------------------------------------+  |
|  |  ◉ Dia 6 - Cortes de Impacto              |  |
|  |  "Identifique onde cortar gastos"         |  |
|  |  ⏱️ 15 min                                 |  |
|  |                                            |  |
|  |  [Iniciar Dia 6]                          |  |
|  +--------------------------------------------+  |
|                                                  |
+--------------------------------------------------+
```

**Componentes:**
- `PathProgress`: Trilha visual com 15 nós
- `CurrentDayCard`: Card destacado do dia atual
- `DayNode`: Nó individual (locked/current/completed)

### 3.2 Componente `DayModal`
Arquivo: `src/components/challenge/DayModal.tsx`

**Estados do Modal:**
1. **Input Phase**: Formulário com campos do schema
2. **CRUD Phase**: Se `crudType` definido, renderiza CrudSection
3. **Output Phase**: Após concluir, mostra OutputPanel

**Estrutura:**
```tsx

    {/* Header */}

      15 min
      Dia {dayId} — {config.title}

    {/* Objective */}
    {config.objective}

    {/* Form / CRUD / Output */}
    {phase === 'input' && }
    {phase === 'crud' && }
    {phase === 'output' && }

    {/* Actions */}

      Concluir Dia

```

### 3.3 Componente `CrudSection`
Arquivo: `src/components/challenge/CrudSection.tsx`

**Para cada tipo:**
- `debts`: Lista editável de dívidas com form inline
- `calendar`: Itens do calendário 30 dias
- `negotiations`: Cards de negociação com status
- `cuts`: Lista de cortes propostos/executados

**Estrutura:**
```tsx

  {/* Add Button */}
   setAdding(true)}>
    + Adicionar {typeLabels[type]}

  {/* List */}

    {items.map(item => (
       setEditing(item.id)}
        onDelete={() => handleDelete(item.id)}
      />
    ))}

  {/* Inline Form (add/edit) */}
  {(adding || editing) && (
     i.id === editing) : null}
      onSave={handleSave}
      onCancel={() => { setAdding(false); setEditing(null); }}
    />
  )}

```

### 3.4 Componente `OutputPanel`
Arquivo: `src/components/challenge/OutputPanel.tsx`

**Estrutura:**
```tsx

    ✅ Dia Concluído!

    {metrics.map(metric => (

        {metric.value}
        {metric.label}

    ))}

    📅 Dia {dayId + 1} desbloqueado!

```

---

## EPIC 4: Formulários Dinâmicos com Zod

### 4.1 Componente `DayInputForm`
Arquivo: `src/components/challenge/DayInputForm.tsx`

```tsx
// Gera formulário dinamicamente baseado no schema
const schema = generateZodSchema(config.inputs);

  {config.inputs.map(input => (
     (

          {input.label}

            {renderInput(input, field)}

      )}
    />
  ))}

```

### 4.2 Inputs Específicos por Tipo
- **slider**: Componente 0-10 com cores (vermelho→verde)
- **checkboxGroup**: Grid de checkboxes
- **time**: Input de horário HH:MM
- **currency**: Input com máscara R$ 0,00

---

## EPIC 5: Hooks para CRUD

### 5.1 `useDebts()`
```typescript
export function useDebts() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['debts'],
    queryFn: () => supabase.from('debts').select('*').order('created_at')
  });

  const addDebt = useMutation({...});
  const updateDebt = useMutation({...});
  const deleteDebt = useMutation({...});

  const totalValue = useMemo(() => 
    data?.reduce((sum, d) => sum + (d.total_balance || 0), 0) || 0
  , [data]);

  return { debts: data, isLoading, addDebt, updateDebt, deleteDebt, totalValue, refetch };
}
```

### 5.2 `useCalendarItems()`
Similar ao `useDebts`, com função `generateFromDebts()` que cria itens automaticamente.

### 5.3 `useNegotiations()`
Similar, com filtro por debt_id.

---

## EPIC 6: Biblioteca de Recursos

### 6.1 Conteúdo Estático
Arquivo: `src/data/library.ts`

```typescript
export const NEGOTIATION_SCRIPTS = {
  whatsapp: [
    {
      title: "Abertura de negociação",
      text: "Olá, gostaria de negociar minha dívida de [CREDOR]. Qual a melhor proposta disponível?"
    },
    // ...
  ],
  phone: [...]
};

export const ANTI_FRAUD_CHECKLIST = [
  "Nunca pague por boleto enviado por email/WhatsApp",
  "Confirme o valor e a conta pelo app oficial do credor",
  // ...
];

export const CUT_CATEGORIES = {
  assinaturas: ["Netflix", "Spotify", "Amazon Prime", ...],
  alimentacao: ["Delivery", "Cafés", ...],
  // ...
};
```

### 6.2 Componente `LibraryModal`
Acessível via botão na tela principal com:
- Scripts de negociação (com botão copiar)
- Checklist anti-golpe
- Lista de cortes por categoria

---

## EPIC 7: Animações e UX

### 7.1 Framer Motion
- **PathProgress**: Stagger animation nos nós
- **DayNode**: Hover lift (`whileHover={{ y: -4 }}`)
- **DayModal**: `initial={{ opacity: 0, scale: 0.95 }}` `animate={{ opacity: 1, scale: 1 }}`
- **OutputPanel**: `slide-in-right`
- **CrudSection**: `AnimatePresence` para add/remove items

### 7.2 Estados Visuais
- `.day-node.locked`: Opacidade 50%, cursor not-allowed
- `.day-node.current`: Anel laranja pulsante
- `.day-node.completed`: Ícone ✓ verde

---

## Arquivos a Criar/Modificar

### Novos Arquivos:
| Arquivo | Descrição |
|---------|-----------|
| `src/pages/ChallengePath.tsx` | Nova página única `/app` |
| `src/config/dayEngine.ts` | Schema dos 15 dias |
| `src/services/dayEngine.ts` | Lógica de completar dias |
| `src/components/challenge/DayModal.tsx` | Modal principal |
| `src/components/challenge/DayInputForm.tsx` | Formulário dinâmico |
| `src/components/challenge/CrudSection.tsx` | CRUD embutido |
| `src/components/challenge/OutputPanel.tsx` | Painel de resultados |
| `src/components/challenge/PathProgress.tsx` | Trilha visual |
| `src/components/challenge/DayNode.tsx` | Nó individual |
| `src/components/challenge/LibraryModal.tsx` | Biblioteca de recursos |
| `src/hooks/useDebts.ts` | CRUD dívidas |
| `src/hooks/useCalendarItems.ts` | CRUD calendário |
| `src/hooks/useNegotiations.ts` | CRUD negociações |
| `src/hooks/useUserProfile.ts` | Perfil do usuário |
| `src/data/library.ts` | Conteúdo estático |

### Modificar:
| Arquivo | Mudança |
|---------|---------|
| `src/App.tsx` | Adicionar rota `/app` |
| `src/contexts/UserProgressContext.tsx` | Sincronizar com Supabase |

### Migrations SQL:
| Migration | Conteúdo |
|-----------|----------|
| `create_user_profile.sql` | Tabela user_profile |
| `create_debts.sql` | Tabela debts + RLS |
| `create_calendar_items.sql` | Tabela calendar_items + RLS |
| `create_monthly_budget.sql` | Tabela monthly_budget |
| `create_card_policy.sql` | Tabela card_policy |
| `create_cuts.sql` | Tabela cuts |
| `create_negotiations.sql` | Tabela negotiations + RLS |
| `create_plan_306090.sql` | Tabela plan_306090 |
| `create_weekly_ritual.sql` | Tabela weekly_ritual |
| `add_payload_to_progress.sql` | ALTER day_progress |

---

## Ordem de Execução

### Sprint 1: Fundação
1. Criar todas as migrations (tabelas + RLS)
2. Criar `dayEngine.ts` com schema dos 15 dias
3. Criar hooks de CRUD (useDebts, useCalendarItems, etc.)
4. Criar página `ChallengePath.tsx` com trilha visual básica

### Sprint 2: Modal Base
5. Criar `DayModal` com estrutura de fases
6. Criar `DayInputForm` para formulários dinâmicos
7. Implementar Dia 1 completo (inputs → output)

### Sprint 3: CRUD
8. Criar `CrudSection` genérico
9. Implementar CRUD de dívidas (Dia 2)
10. Implementar CRUD de calendário (Dia 3)
11. Implementar Dia 4 (Gap Mensal) com cálculos

### Sprint 4: Dias 5-8
12. Implementar política de cartão (Dia 5)
13. Implementar cortes (Dia 6)
14. Implementar orçamento 30D (Dia 7)
15. Implementar redução de conta fixa (Dia 8)

### Sprint 5: Dias 9-12
16. Implementar ordem de ataque (Dia 9)
17. Implementar proposta base (Dia 10)
18. Implementar CRUD negociações (Dias 11-12)

### Sprint 6: Dias 13-15 + Polish
19. Implementar plano 30/60/90 (Dia 13)
20. Implementar ritual semanal (Dia 14)
21. Implementar finalização (Dia 15)
22. Adicionar animações Framer Motion
23. Criar LibraryModal com conteúdo

---

## Diagrama da Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    ChallengePath.tsx                     │
│  ┌─────────────────────────────────────────────────┐    │
│  │            PathProgress (15 nós)                 │    │
│  │   ○───●───●───●───●───◉───○───○───○───○          │    │
│  └─────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │           CurrentDayCard                        │    │
│  │   [Iniciar Dia X] → abre DayModal               │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                     DayModal.tsx                         │
│  ┌──────────────────┐  ┌──────────────────┐              │
│  │   DayInputForm   │  │   CrudSection    │              │
│  │   (phase=input)  │  │  (phase=crud)    │              │
│  └──────────────────┘  └──────────────────┘              │
│                          │                               │
│                          ▼                               │
│  ┌─────────────────────────────────────────────────┐    │
│  │              OutputPanel (phase=output)          │    │
│  │   ✅ Dia Concluído!  [Métricas]                  │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

Implementar Sprint 1: Banco de Dados + Estrutura Base
Criar Migrations SQL para as Novas Tabelas
Criar Day Engine com Schema dos 15 Dias
Criar Tela Única com Trilha + Modal
Evoluir Gradualmente: Adicionar CRUD às Páginas Existentes

---

# Status de Execucao (feito)

## Banco de Dados e Tipos
- [x] Migrations criadas para `user_profile`, `debts`, `calendar_items`, `monthly_budget`, `card_policy`, `cuts`, `negotiations`, `plan_306090`, `weekly_ritual`.
- [x] Coluna `payload` adicionada em `day_progress`.
- [x] Tipos do Supabase atualizados em `src/integrations/supabase/types.ts`.

Arquivos:
- `supabase/migrations/20251212090000_create_user_profile.sql`
- `supabase/migrations/20251212090100_create_debts.sql`
- `supabase/migrations/20251212090200_create_calendar_items.sql`
- `supabase/migrations/20251212090300_create_monthly_budget.sql`
- `supabase/migrations/20251212090400_create_card_policy.sql`
- `supabase/migrations/20251212090500_create_cuts.sql`
- `supabase/migrations/20251212090600_create_negotiations.sql`
- `supabase/migrations/20251212090700_create_plan_306090.sql`
- `supabase/migrations/20251212090800_create_weekly_ritual.sql`
- `supabase/migrations/20251212090900_add_payload_to_day_progress.sql`
- `src/integrations/supabase/types.ts`

## Day Engine
- [x] `src/config/dayEngine.ts` com schema completo dos 15 dias.
- [x] `src/services/dayEngine.ts` com `completeDay`, calculos de metricas e side effects (ex.: calendario a partir das dividas).

## Hooks + CRUD
- [x] Hooks CRUD: `useDebts`, `useCalendarItems`, `useNegotiations`, `useCuts`, `useUserProfile`.
- [x] Componentes base: `DayInputForm`, `CrudSection`, `OutputPanel`.

Arquivos:
- `src/hooks/useDebts.ts`
- `src/hooks/useCalendarItems.ts`
- `src/hooks/useNegotiations.ts`
- `src/hooks/useCuts.ts`
- `src/hooks/useUserProfile.ts`
- `src/components/challenge/DayInputForm.tsx`
- `src/components/challenge/CrudSection.tsx`
- `src/components/challenge/OutputPanel.tsx`

## UI Single-Screen
- [x] Nova tela `ChallengePath` com trilha visual e modal por dia.
- [x] `DayModal`, `PathProgress`, `DayNode` e `LibraryModal` implementados.
- [x] Biblioteca estatica criada em `src/data/library.ts`.
- [x] Rotas e navegacao apontando para `/app`.

Arquivos:
- `src/pages/ChallengePath.tsx`
- `src/components/challenge/DayModal.tsx`
- `src/components/challenge/PathProgress.tsx`
- `src/components/challenge/DayNode.tsx`
- `src/components/challenge/LibraryModal.tsx`
- `src/data/library.ts`
- `src/App.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/MobileNav.tsx`
- `src/components/dashboard/DayCard.tsx`
- `src/components/dashboard/WelcomeCard.tsx`

## Progresso com Supabase
- [x] `UserProgressContext` agora sincroniza com `day_progress` e `profiles`.
- [x] `payload` armazenado por dia para reusar nos formularios.

Arquivo:
- `src/contexts/UserProgressContext.tsx`
