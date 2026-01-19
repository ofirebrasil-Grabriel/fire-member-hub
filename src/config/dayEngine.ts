// =============================================
// FIRE 15D - Day Engine Configuration
// =============================================

export type InputFieldType =
  | 'text'
  | 'number'
  | 'time'
  | 'checkbox'
  | 'slider'
  | 'select'
  | 'checkboxGroup'
  | 'textarea'
  | 'currency';

export type CrudType = 'debts' | 'calendar' | 'negotiations' | 'cuts';
export type Phase = 'dossie' | 'contencao' | 'acordos' | 'motor';

export interface InputField {
  name: string;
  label: string;
  type: InputFieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  min?: number;
  max?: number;
  defaultValue?: unknown;
  helperText?: string;
}

export interface OutputMetric {
  key: string;
  label: string;
  format: 'currency' | 'number' | 'percent' | 'text';
  icon?: string;
}

export interface DayConfig {
  id: number;
  title: string;
  subtitle: string;
  objective: string;
  badge: string;
  emoji: string;
  phase: Phase;
  inputs: InputField[];
  crudType?: CrudType;
  outputMetrics: OutputMetric[];
  tips?: string[];
  customComponent?: boolean;
}

export const PHASE_LABELS: Record<Phase, { label: string; color: string }> = {
  dossie: { label: 'Dossiê', color: 'text-blue-400' },
  contencao: { label: 'Contenção', color: 'text-yellow-400' },
  acordos: { label: 'Acordos', color: 'text-orange-400' },
  motor: { label: 'Motor 30/90', color: 'text-green-400' },
};

export const DAY_ENGINE: DayConfig[] = [
  // =================== FASE 1: DOSSIÊ (Dias 1-4) ===================
  {
    id: 1,
    title: "Boas-Vindas e Despertar",
    subtitle: "Reconheça suas emoções",
    objective: "Responda o questionário inicial, avalie seu nível de estresse financeiro e defina seu compromisso diário.",
    badge: "15 min",
    emoji: "🌅",
    phase: 'dossie',
    customComponent: true,
    inputs: [],
    outputMetrics: [
      { key: 'money_feeling', label: 'Sentimento', format: 'text', icon: '💭' },
      { key: 'breathe_score', label: 'Termometro', format: 'number', icon: '🌡️' },
      { key: 'monthly_income', label: 'Renda mensal', format: 'currency', icon: '💰' },
      { key: 'commitment_time', label: 'Horario', format: 'text', icon: '⏰' },
    ],
    tips: [
      'Seja honesto(a) nas respostas - nao há certo ou errado',
      'O termometro sera rastreado ao longo dos 15 dias',
      'Defina um passo minimo para dias dificeis',
    ],
  },
  {
    id: 2,
    title: "Mapeamento Financeiro",
    subtitle: "Sua fotografia financeira",
    objective: "Mapeie todas as suas receitas, despesas e dívidas para ter uma visão completa da sua situação.",
    badge: "20 min",
    emoji: "📋",
    phase: 'dossie',
    customComponent: true,
    inputs: [],
    outputMetrics: [
      { key: 'totalIncome', label: 'Total receitas', format: 'currency', icon: '💰' },
      { key: 'totalExpenses', label: 'Total despesas', format: 'currency', icon: '📉' },
      { key: 'totalDebtsMin', label: 'Mínimo dívidas', format: 'currency', icon: '💳' },
      { key: 'balance', label: 'Saldo mensal', format: 'currency', icon: '📊' },
    ],
    tips: [
      'Inclua TODAS as fontes de renda, mesmo as variáveis',
      'Liste todas as despesas fixas, mesmo as pequenas',
      'Marque dívidas críticas com juros altos ou risco de nome sujo',
    ],
  },
  {
    id: 3,
    title: "Análise de Gatilhos",
    subtitle: "Entenda seus padrões",
    objective: "Identifique os gatilhos emocionais e contextuais que levam você a gastar para criar estratégias de controle.",
    badge: "25 min",
    emoji: "🧠",
    phase: 'dossie',
    customComponent: true,
    inputs: [],
    outputMetrics: [
      { key: 'triggersAnalyzed', label: 'Gatilhos analisados', format: 'number', icon: '🔍' },
      { key: 'avoidableCount', label: 'Gastos evitáveis', format: 'number', icon: '⚠️' },
      { key: 'largePurchasesCount', label: 'Compras +R$1000', format: 'number', icon: '💳' },
    ],
    tips: [
      'Seja honesto sobre suas emoções - não julgue',
      'Identifique padrões que se repetem',
      'Pense em estratégias práticas para cada gatilho',
    ],
  },
  {
    id: 4,
    title: "Regras de Gastos",
    subtitle: "O que pode e o que não pode",
    objective: "Crie sua lista de gastos banidos por 30 dias e defina limites para despesas essenciais.",
    badge: "20 min",
    emoji: "🚫",
    phase: 'dossie',
    customComponent: true,
    inputs: [],
    outputMetrics: [
      { key: 'bannedCount', label: 'Gastos banidos', format: 'number', icon: '🚫' },
      { key: 'exceptionsCount', label: 'Exceções', format: 'number', icon: '✅' },
      { key: 'totalExceptionsLimit', label: 'Limite essencial', format: 'currency', icon: '💰' },
    ],
    tips: [
      'Escolha gastos que você sabe que são desnecessários',
      'Para cada gasto banido, pense em um substituto gratuito',
      'Seja realista com os limites das exceções',
    ],
  },

  // =================== FASE 2: CONTENÇÃO (Dias 5-8) ===================
  {
    id: 5,
    title: "Politica do Cartao",
    subtitle: "Controle de credito",
    objective: "Escolha 1 cartao principal, bloqueie os outros, defina excecoes e limite semanal.",
    badge: "15 min",
    emoji: "💳",
    phase: 'contencao',
    customComponent: true,
    inputs: [],
    outputMetrics: [
      { key: 'mainCardName', label: 'Cartao ativo', format: 'text', icon: '💳' },
      { key: 'blockedCount', label: 'Bloqueados', format: 'number', icon: '🔒' },
      { key: 'weeklyLimit', label: 'Limite semanal', format: 'currency', icon: '💰' },
    ],
    tips: [
      'Escolha o cartao que melhor encaixa com sua renda',
      'Coloque os cartoes bloqueados em lugar dificil de acessar',
      'Limite semanal e mais facil de controlar que mensal',
    ],
  },
  {
    id: 6,
    title: "Cortes Rapidos",
    subtitle: "Doi pouco, libera rapido",
    objective: "Escolha 1 vazamento e faca 1 corte claro por 7 dias.",
    badge: "10 min",
    emoji: "✂️",
    phase: 'contencao',
    customComponent: true,
    inputs: [],
    outputMetrics: [
      { key: 'cutsCount', label: 'Vazamentos', format: 'number', icon: '✂️' },
      { key: 'totalLimit', label: 'Limite total', format: 'currency', icon: '💰' },
    ],
    tips: [
      'Escolha um corte que doi pouco mas libera folego rapido',
      'Melhor 1 corte bem feito que 10 que voce nao cumpre',
      'Sem sentido, voce desiste - lembre do seu objetivo',
    ],
  },
  {
    id: 7,
    title: "Orçamento 30D",
    subtitle: "Cabe ou não cabe",
    objective: "Monte um orçamento realista para os próximos 30 dias com base no seu gap.",
    badge: "15 min",
    emoji: "📝",
    phase: 'contencao',
    inputs: [
      {
        name: 'essentials_total',
        label: 'Total essenciais (do Dia 4)',
        type: 'currency',
        required: true
      },
      {
        name: 'critical_bills',
        label: 'Contas críticas (do calendário)',
        type: 'currency',
        required: true
      },
      {
        name: 'leisure_minimum',
        label: 'Lazer mínimo (opcional)',
        type: 'currency',
        placeholder: '100.00'
      },
    ],
    outputMetrics: [
      { key: 'totalBudget', label: 'Orçamento total', format: 'currency', icon: '📊' },
      { key: 'status', label: 'Status', format: 'text', icon: '📋' },
      { key: 'adjustment', label: 'Ajuste sugerido', format: 'currency', icon: '🔧' },
    ],
    tips: [
      'Se não cabe, volte ao Dia 6 e faça mais cortes',
      'Lazer mínimo evita que você "exploda" e gaste demais',
    ],
  },
  {
    id: 8,
    title: "Fila de Pagamento",
    subtitle: "Priorizar contas",
    objective: "Classifique suas contas por urgencia e defina o que pagar, negociar ou pausar.",
    badge: "20 min",
    emoji: "📋",
    phase: 'contencao',
    customComponent: true,
    inputs: [],
    outputMetrics: [
      { key: 'totalBills', label: 'Total contas', format: 'currency', icon: '📋' },
      { key: 'gap', label: 'Gap', format: 'currency', icon: '⚠️' },
      { key: 'payNowTotal', label: 'Pagar agora', format: 'currency', icon: '✅' },
    ],
    tips: [
      'Classifique por impacto e consequencia para priorizar',
      'Use Plano A (negociar) antes de Plano C (emergencia)',
      'Execute as 3 acoes de hoje sem adiamento',
    ],
  },

  // =================== FASE 3: ACORDOS (Dias 9-12) ===================
  {
    id: 9,
    title: "Ordem de Ataque",
    subtitle: "Priorize suas dívidas",
    objective: "Defina a ordem em que você vai atacar suas dívidas. Foco nos juros altos e críticos.",
    badge: "10 min",
    emoji: "🎯",
    phase: 'acordos',
    inputs: [
      {
        name: 'priority_1',
        label: 'Prioridade #1',
        type: 'text',
        required: true,
        placeholder: 'Nome do credor'
      },
      {
        name: 'priority_2',
        label: 'Prioridade #2',
        type: 'text',
        placeholder: 'Nome do credor'
      },
      {
        name: 'priority_3',
        label: 'Prioridade #3',
        type: 'text',
        placeholder: 'Nome do credor'
      },
      {
        name: 'priority_4',
        label: 'Prioridade #4',
        type: 'text',
        placeholder: 'Nome do credor'
      },
      {
        name: 'priority_5',
        label: 'Prioridade #5',
        type: 'text',
        placeholder: 'Nome do credor'
      },
    ],
    outputMetrics: [
      { key: 'totalPriorities', label: 'Credores priorizados', format: 'number', icon: '📋' },
      { key: 'firstTarget', label: 'Primeiro alvo', format: 'text', icon: '🎯' },
    ],
    tips: [
      'Comece pelos juros mais altos ou risco de nome sujo',
      'Dívidas menores primeiro dão momentum (bola de neve)',
    ],
  },
  {
    id: 10,
    title: "Preparar Proposta",
    subtitle: "Script de negociação",
    objective: "Defina sua proposta máxima e prepare-se para negociar sem cair em golpes.",
    badge: "10 min",
    emoji: "📋",
    phase: 'acordos',
    inputs: [
      {
        name: 'max_entry',
        label: 'Entrada máxima que posso pagar',
        type: 'currency',
        required: true,
        placeholder: '500.00'
      },
      {
        name: 'max_installment',
        label: 'Parcela máxima mensal',
        type: 'currency',
        required: true,
        placeholder: '200.00'
      },
      {
        name: 'anti_fraud_check',
        label: 'Checklist anti-golpe',
        type: 'checkboxGroup',
        options: [
          { value: 'official_channel', label: '✅ Usar apenas canais oficiais' },
          { value: 'no_upfront', label: '✅ Nunca pagar adiantado para "liberar"' },
          { value: 'verify_boleto', label: '✅ Conferir boleto no app do banco' },
          { value: 'record_call', label: '✅ Gravar/anotar todas as conversas' },
        ]
      },
    ],
    outputMetrics: [
      { key: 'maxEntry', label: 'Entrada máxima', format: 'currency', icon: '💵' },
      { key: 'maxInstallment', label: 'Parcela máxima', format: 'currency', icon: '📅' },
      { key: 'safetyScore', label: 'Checklist segurança', format: 'text', icon: '🛡️' },
    ],
    tips: [
      'NUNCA pague por boleto enviado por WhatsApp',
      'Sempre confirme os valores pelo app oficial do credor',
    ],
  },
  {
    id: 11,
    title: "Negociação #1",
    subtitle: "Primeiro contato",
    objective: "Entre em contato com o credor #1 da sua lista e registre o resultado.",
    badge: "15 min",
    emoji: "📞",
    phase: 'acordos',
    crudType: 'negotiations',
    inputs: [],
    outputMetrics: [
      { key: 'negotiationCreated', label: 'Negociação registrada', format: 'text', icon: '📋' },
      { key: 'status', label: 'Status', format: 'text', icon: '📊' },
    ],
    tips: [
      'Use o script da Biblioteca para começar a conversa',
      'Não aceite a primeira proposta - sempre peça desconto',
    ],
  },
  {
    id: 12,
    title: "Negociação #2",
    subtitle: "Segundo contato",
    objective: "Entre em contato com o credor #2 da sua lista e registre o resultado.",
    badge: "15 min",
    emoji: "📞",
    phase: 'acordos',
    crudType: 'negotiations',
    inputs: [],
    outputMetrics: [
      { key: 'totalNegotiations', label: 'Negociações ativas', format: 'number', icon: '📋' },
      { key: 'acceptedCount', label: 'Acordos fechados', format: 'number', icon: '✅' },
    ],
    tips: [
      'Se o primeiro não aceitou, tente novamente em outro horário',
      'Anote TUDO - número de protocolo, nome do atendente',
    ],
  },

  // =================== FASE 4: MOTOR 30/90 (Dias 13-15) ===================
  {
    id: 13,
    title: "Plano 30/60/90",
    subtitle: "Visão de futuro",
    objective: "Defina metas claras para os próximos 30, 60 e 90 dias.",
    badge: "15 min",
    emoji: "📈",
    phase: 'motor',
    inputs: [
      {
        name: 'goal_30_1',
        label: 'Meta 30 dias #1',
        type: 'text',
        required: true,
        placeholder: 'Ex: Quitar dívida X'
      },
      {
        name: 'goal_30_2',
        label: 'Meta 30 dias #2',
        type: 'text',
        placeholder: 'Ex: Reduzir conta de luz'
      },
      {
        name: 'goal_30_3',
        label: 'Meta 30 dias #3',
        type: 'text',
        placeholder: 'Ex: Criar reserva de R$200'
      },
      {
        name: 'goal_60_1',
        label: 'Meta 60 dias #1',
        type: 'text',
        placeholder: 'Ex: Quitar mais 2 dívidas'
      },
      {
        name: 'goal_60_2',
        label: 'Meta 60 dias #2',
        type: 'text',
        placeholder: 'Ex: Reserva de R$500'
      },
      {
        name: 'goal_90_1',
        label: 'Meta 90 dias #1',
        type: 'text',
        placeholder: 'Ex: Todas as dívidas negociadas'
      },
      {
        name: 'goal_90_2',
        label: 'Meta 90 dias #2',
        type: 'text',
        placeholder: 'Ex: Reserva de emergência 1 mês'
      },
    ],
    outputMetrics: [
      { key: 'goals30', label: 'Metas 30 dias', format: 'number', icon: '🎯' },
      { key: 'goals60', label: 'Metas 60 dias', format: 'number', icon: '📅' },
      { key: 'goals90', label: 'Metas 90 dias', format: 'number', icon: '🚀' },
    ],
    tips: [
      'Metas SMART: Específicas, Mensuráveis, Alcançáveis',
      'Menos metas bem feitas > muitas metas abandonadas',
    ],
  },
  {
    id: 14,
    title: "Ritual Semanal",
    subtitle: "Rotina de 10 minutos",
    objective: "Defina seu ritual semanal para manter o controle financeiro após o desafio.",
    badge: "10 min",
    emoji: "🔄",
    phase: 'motor',
    inputs: [
      {
        name: 'day_of_week',
        label: 'Dia do ritual semanal',
        type: 'select',
        options: [
          { value: '0', label: '🌅 Domingo' },
          { value: '1', label: '📅 Segunda' },
          { value: '2', label: '📅 Terça' },
          { value: '3', label: '📅 Quarta' },
          { value: '4', label: '📅 Quinta' },
          { value: '5', label: '📅 Sexta' },
          { value: '6', label: '🌅 Sábado' },
        ],
        required: true
      },
      {
        name: 'checklist',
        label: 'Itens do checklist semanal',
        type: 'checkboxGroup',
        options: [
          { value: 'review_calendar', label: '📅 Revisar vencimentos da semana' },
          { value: 'check_balance', label: '💰 Conferir saldo das contas' },
          { value: 'update_debts', label: '📋 Atualizar status das dívidas' },
          { value: 'review_budget', label: '📊 Revisar orçamento' },
          { value: 'plan_week', label: '🎯 Planejar gastos da semana' },
          { value: 'celebrate', label: '🎉 Celebrar pequenas vitórias' },
        ]
      },
    ],
    outputMetrics: [
      { key: 'ritualDay', label: 'Dia do ritual', format: 'text', icon: '📅' },
      { key: 'checklistItems', label: 'Itens no checklist', format: 'number', icon: '✅' },
    ],
    tips: [
      'Domingo de manhã ou segunda no almoço são ótimos horários',
      'Associe a algo que você já faz (após o café, por exemplo)',
    ],
  },
  {
    id: 15,
    title: "Semana 1 Pronta",
    subtitle: "Ação da semana",
    objective: "Defina UMA ação prioritária para esta semana e agende no calendário.",
    badge: "10 min",
    emoji: "🎓",
    phase: 'motor',
    inputs: [
      {
        name: 'week_action',
        label: 'Ação da semana',
        type: 'select',
        options: [
          { value: 'negotiate', label: '🤝 Negociar uma dívida' },
          { value: 'cut', label: '✂️ Executar um corte' },
          { value: 'extra_payment', label: '💵 Fazer pagamento extra' },
          { value: 'extra_income', label: '💰 Buscar renda extra' },
          { value: 'cancel', label: '❌ Cancelar uma assinatura' },
        ],
        required: true
      },
      {
        name: 'action_detail',
        label: 'Detalhe da ação',
        type: 'text',
        required: true,
        placeholder: 'Ex: Ligar para Nubank às 10h de terça'
      },
      {
        name: 'action_date',
        label: 'Data/hora agendada',
        type: 'text',
        required: true,
        placeholder: 'Ex: Terça, 14h'
      },
    ],
    outputMetrics: [
      { key: 'weekAction', label: 'Ação agendada', format: 'text', icon: '🎯' },
      { key: 'scheduled', label: 'Data', format: 'text', icon: '📅' },
      { key: 'challengeComplete', label: 'Desafio concluído!', format: 'text', icon: '🎓' },
    ],
    tips: [
      'Parabéns! Você completou o Desafio FIRE 15D! 🔥',
      'Agora é manter o ritual semanal e executar o plano 30/60/90',
    ],
  },
];

// Helper to get day config by ID
export function getDayConfig(dayId: number): DayConfig | undefined {
  return DAY_ENGINE.find(d => d.id === dayId);
}

// Helper to get phase days
export function getDaysByPhase(phase: Phase): DayConfig[] {
  return DAY_ENGINE.filter(d => d.phase === phase);
}

// Helper to check if day has CRUD
export function dayHasCrud(dayId: number): boolean {
  const config = getDayConfig(dayId);
  return !!config?.crudType;
}
