export type DayPhase = 'dossie' | 'contencao' | 'acordos' | 'motor';

export type InputFieldType =
  | 'text'
  | 'number'
  | 'time'
  | 'checkbox'
  | 'slider'
  | 'select'
  | 'checkboxGroup'
  | 'textarea'
  | 'currency'
  | 'date';

export interface InputOption {
  value: string;
  label: string;
}

export interface InputField {
  name: string;
  label: string;
  type: InputFieldType;
  options?: InputOption[];
  required?: boolean;
  validation?: string;
  placeholder?: string;
  helperText?: string;
}

export interface OutputMetric {
  key: string;
  label: string;
  format: 'currency' | 'number' | 'percent' | 'text';
}

export interface DayConfig {
  id: number;
  title: string;
  objective: string;
  badge: string;
  phase: DayPhase;
  inputs: InputField[];
  crudType?: 'debts' | 'calendar' | 'negotiations' | 'cuts';
  outputMetrics?: OutputMetric[];
}

export const DAY_ENGINE: DayConfig[] = [
  {
    id: 1,
    title: 'Setup e Placar',
    objective: 'Defina seu horario fixo e crie seu ponto de partida',
    badge: '15 min',
    phase: 'dossie',
    inputs: [
      { name: 'fixed_time', label: 'Horario fixo para o desafio', type: 'time', required: true },
      {
        name: 'sources',
        label: 'Fontes de dividas',
        type: 'checkboxGroup',
        options: [
          { value: 'banks', label: 'Bancos' },
          { value: 'cards', label: 'Cartoes' },
          { value: 'loans', label: 'Emprestimos' },
          { value: 'installments', label: 'Crediario' },
        ],
      },
      { name: 'anxiety_score', label: 'Ansiedade ao pensar em dinheiro (0-10)', type: 'slider' },
      { name: 'clarity_score', label: 'Clareza sobre suas financas (0-10)', type: 'slider' },
      {
        name: 'no_new_debt_commitment',
        label: 'Comprometo-me a nao fazer novas parcelas por 15 dias',
        type: 'checkbox',
        required: true,
      },
    ],
    outputMetrics: [
      { key: 'profileCreated', label: 'Perfil criado', format: 'text' },
      { key: 'commitment', label: 'Regra ativa', format: 'text' },
    ],
  },
  {
    id: 2,
    title: 'Lista Mestra de Dividas',
    objective: 'Mapeie todas as dividas em um so lugar',
    badge: '15 min',
    phase: 'dossie',
    crudType: 'debts',
    inputs: [],
    outputMetrics: [
      { key: 'totalDebts', label: 'Total de dividas', format: 'number' },
      { key: 'criticalCount', label: 'Dividas criticas', format: 'number' },
      { key: 'totalValue', label: 'Valor total', format: 'currency' },
    ],
  },
  {
    id: 3,
    title: 'Calendario 30 Dias',
    objective: 'Organize vencimentos e gastos essenciais',
    badge: '15 min',
    phase: 'dossie',
    crudType: 'calendar',
    inputs: [],
    outputMetrics: [
      { key: 'totalItems', label: 'Itens no calendario', format: 'number' },
      { key: 'fixedCount', label: 'Fixos', format: 'number' },
      { key: 'totalValue', label: 'Valor total', format: 'currency' },
    ],
  },
  {
    id: 4,
    title: 'Gap Mensal',
    objective: 'Calcule seu saldo real e o espaco para agir',
    badge: '15 min',
    phase: 'dossie',
    inputs: [
      { name: 'month_year', label: 'Mes de referencia (YYYY-MM)', type: 'text', required: true },
      { name: 'income', label: 'Renda mensal', type: 'currency', required: true },
      { name: 'essentials_housing', label: 'Moradia', type: 'currency' },
      { name: 'essentials_food', label: 'Alimentacao', type: 'currency' },
      { name: 'essentials_transport', label: 'Transporte', type: 'currency' },
      { name: 'essentials_health', label: 'Saude', type: 'currency' },
      { name: 'essentials_other', label: 'Outros essenciais', type: 'currency' },
      { name: 'minimum_debts', label: 'Minimo das dividas', type: 'currency' },
    ],
    outputMetrics: [
      { key: 'gap', label: 'Gap mensal', format: 'currency' },
      { key: 'essentialsTotal', label: 'Essenciais', format: 'currency' },
      { key: 'minimumDebts', label: 'Minimo dividas', format: 'currency' },
    ],
  },
  {
    id: 5,
    title: 'Politica de Cartao',
    objective: 'Defina limites e regras do cartao',
    badge: '15 min',
    phase: 'contencao',
    inputs: [
      { name: 'weekly_limit', label: 'Limite semanal', type: 'currency', required: true },
      {
        name: 'installment_rule',
        label: 'Regra de parcelas',
        type: 'select',
        options: [
          { value: 'never', label: 'Nunca parcelar' },
          { value: 'exceptions_only', label: 'Somente excecoes' },
        ],
      },
      {
        name: 'blocked_categories',
        label: 'Categorias bloqueadas',
        type: 'checkboxGroup',
        options: [
          { value: 'delivery', label: 'Delivery' },
          { value: 'marketplace', label: 'Marketplace' },
          { value: 'apps', label: 'Apps' },
          { value: 'lazer', label: 'Lazer' },
        ],
      },
    ],
    outputMetrics: [
      { key: 'weeklyLimit', label: 'Limite semanal', format: 'currency' },
      { key: 'policyActive', label: 'Politica ativa', format: 'text' },
    ],
  },
  {
    id: 6,
    title: 'Cortes de Impacto',
    objective: 'Liste cortes com maior impacto',
    badge: '15 min',
    phase: 'contencao',
    crudType: 'cuts',
    inputs: [],
    outputMetrics: [
      { key: 'cutsCount', label: 'Cortes mapeados', format: 'number' },
      { key: 'estimatedSavings', label: 'Economia estimada', format: 'currency' },
    ],
  },
  {
    id: 7,
    title: 'Orcamento 30D',
    objective: 'Monte o orcamento do mes',
    badge: '15 min',
    phase: 'contencao',
    inputs: [
      { name: 'month_year', label: 'Mes de referencia (YYYY-MM)', type: 'text', required: true },
      { name: 'income', label: 'Renda mensal', type: 'currency', required: true },
      { name: 'essentials_housing', label: 'Moradia', type: 'currency' },
      { name: 'essentials_food', label: 'Alimentacao', type: 'currency' },
      { name: 'essentials_transport', label: 'Transporte', type: 'currency' },
      { name: 'essentials_health', label: 'Saude', type: 'currency' },
      { name: 'essentials_other', label: 'Outros essenciais', type: 'currency' },
      { name: 'minimum_debts', label: 'Minimo das dividas', type: 'currency' },
    ],
    outputMetrics: [
      { key: 'gap', label: 'Gap mensal', format: 'currency' },
      { key: 'essentialsTotal', label: 'Essenciais', format: 'currency' },
      { key: 'minimumDebts', label: 'Minimo dividas', format: 'currency' },
    ],
  },
  {
    id: 8,
    title: 'Reducao de Contas Fixas',
    objective: 'Negocie e reduza custos fixos',
    badge: '15 min',
    phase: 'contencao',
    inputs: [
      { name: 'fixed_item_name', label: 'Conta fixa prioritaria', type: 'text', required: true },
      { name: 'current_value', label: 'Valor atual', type: 'currency' },
      { name: 'target_value', label: 'Valor desejado', type: 'currency' },
      { name: 'action_plan', label: 'Plano de acao', type: 'textarea' },
    ],
    outputMetrics: [
      { key: 'plannedSavings', label: 'Economia planejada', format: 'currency' },
    ],
  },
  {
    id: 9,
    title: 'Ordem de Ataque',
    objective: 'Defina a ordem para quitar dividas',
    badge: '15 min',
    phase: 'acordos',
    inputs: [
      {
        name: 'attack_strategy',
        label: 'Estrategia principal',
        type: 'select',
        options: [
          { value: 'avalanche', label: 'Avalanche (juros maiores)' },
          { value: 'snowball', label: 'Bola de neve (dividas menores)' },
          { value: 'critical_first', label: 'Prioridade critica' },
        ],
      },
      { name: 'priority_notes', label: 'Ordem detalhada e observacoes', type: 'textarea' },
    ],
    outputMetrics: [
      { key: 'strategy', label: 'Estrategia escolhida', format: 'text' },
    ],
  },
  {
    id: 10,
    title: 'Proposta Base',
    objective: 'Estabeleca limites e metas para negociar',
    badge: '15 min',
    phase: 'acordos',
    inputs: [
      { name: 'max_entry', label: 'Entrada maxima', type: 'currency' },
      { name: 'max_installment', label: 'Parcela maxima', type: 'currency' },
      {
        name: 'preferred_channel',
        label: 'Canal preferido',
        type: 'select',
        options: [
          { value: 'whatsapp', label: 'WhatsApp' },
          { value: 'phone', label: 'Telefone' },
          { value: 'email', label: 'Email' },
        ],
      },
      { name: 'negotiation_notes', label: 'Notas da proposta', type: 'textarea' },
    ],
    outputMetrics: [
      { key: 'baseDefined', label: 'Proposta definida', format: 'text' },
    ],
  },
  {
    id: 11,
    title: 'Negociacao 1',
    objective: 'Inicie as negociacoes prioritarias',
    badge: '15 min',
    phase: 'acordos',
    crudType: 'negotiations',
    inputs: [],
    outputMetrics: [
      { key: 'negotiationsTotal', label: 'Negociacoes', format: 'number' },
      { key: 'acceptedCount', label: 'Acordos fechados', format: 'number' },
      { key: 'pendingCount', label: 'Pendentes', format: 'number' },
    ],
  },
  {
    id: 12,
    title: 'Negociacao 2',
    objective: 'Acompanhe respostas e ajuste propostas',
    badge: '15 min',
    phase: 'acordos',
    crudType: 'negotiations',
    inputs: [],
    outputMetrics: [
      { key: 'negotiationsTotal', label: 'Negociacoes', format: 'number' },
      { key: 'acceptedCount', label: 'Acordos fechados', format: 'number' },
      { key: 'pendingCount', label: 'Pendentes', format: 'number' },
    ],
  },
  {
    id: 13,
    title: 'Plano 30/60/90',
    objective: 'Defina metas para 30, 60 e 90 dias',
    badge: '15 min',
    phase: 'motor',
    inputs: [
      { name: 'goals_30', label: 'Metas 30 dias (uma por linha)', type: 'textarea' },
      { name: 'goals_60', label: 'Metas 60 dias (uma por linha)', type: 'textarea' },
      { name: 'goals_90', label: 'Metas 90 dias (uma por linha)', type: 'textarea' },
    ],
    outputMetrics: [
      { key: 'goalsCount', label: 'Total de metas', format: 'number' },
    ],
  },
  {
    id: 14,
    title: 'Ritual Semanal',
    objective: 'Crie seu ritual de revisao semanal',
    badge: '15 min',
    phase: 'motor',
    inputs: [
      {
        name: 'day_of_week',
        label: 'Dia da semana',
        type: 'select',
        options: [
          { value: '0', label: 'Domingo' },
          { value: '1', label: 'Segunda' },
          { value: '2', label: 'Terca' },
          { value: '3', label: 'Quarta' },
          { value: '4', label: 'Quinta' },
          { value: '5', label: 'Sexta' },
          { value: '6', label: 'Sabado' },
        ],
      },
      { name: 'checklist', label: 'Checklist (um item por linha)', type: 'textarea' },
    ],
    outputMetrics: [
      { key: 'ritualItems', label: 'Itens do ritual', format: 'number' },
      { key: 'ritualDay', label: 'Dia escolhido', format: 'text' },
    ],
  },
  {
    id: 15,
    title: 'Finalizacao',
    objective: 'Consolide aprendizados e proximos passos',
    badge: '15 min',
    phase: 'motor',
    inputs: [
      { name: 'final_reflection', label: 'Principal aprendizado', type: 'textarea' },
      { name: 'celebration', label: 'Como vai celebrar?', type: 'text' },
      { name: 'next_commitment', label: 'Compromisso para o futuro', type: 'text' },
    ],
    outputMetrics: [
      { key: 'challengeDone', label: 'Desafio concluido', format: 'text' },
      { key: 'nextStep', label: 'Proximo compromisso', format: 'text' },
    ],
  },
];
