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
    title: "Setup & Placar",
    subtitle: "Configure sua jornada",
    objective: "Defina seu horário fixo para o desafio e faça o diagnóstico inicial da sua situação financeira.",
    badge: "15 min",
    emoji: "🎯",
    phase: 'dossie',
    inputs: [
      { 
        name: 'fixed_time', 
        label: 'Horário fixo para o desafio', 
        type: 'time', 
        required: true,
        placeholder: '08:00'
      },
      { 
        name: 'sources', 
        label: 'Quais são suas fontes de dívidas?', 
        type: 'checkboxGroup', 
        options: [
          { value: 'banks', label: '🏦 Bancos' },
          { value: 'cards', label: '💳 Cartões' },
          { value: 'loans', label: '📋 Crediário' },
          { value: 'family', label: '👨‍👩‍👧 Família/Amigos' },
          { value: 'utilities', label: '💡 Contas de Consumo' },
        ]
      },
      { 
        name: 'anxiety_score', 
        label: 'Ansiedade ao pensar em dinheiro', 
        type: 'slider',
        min: 0,
        max: 10
      },
      { 
        name: 'clarity_score', 
        label: 'Clareza sobre suas finanças', 
        type: 'slider',
        min: 0,
        max: 10
      },
      { 
        name: 'commitment', 
        label: 'Comprometo-me a não fazer novas parcelas por 15 dias', 
        type: 'checkbox', 
        required: true 
      },
    ],
    outputMetrics: [
      { key: 'profileCreated', label: 'Perfil criado', format: 'text', icon: '✅' },
      { key: 'commitment', label: 'Regra 15 dias ativa', format: 'text', icon: '🔒' },
      { key: 'anxietyScore', label: 'Ansiedade inicial', format: 'number', icon: '📊' },
    ],
    tips: [
      'Escolha um horário em que você tenha 15 minutos de paz',
      'Seja honesto nos scores - não há resposta certa',
    ],
  },
  {
    id: 2,
    title: "Lista Mestra de Dívidas",
    subtitle: "Mapeando o caos",
    objective: "Mapeie TODAS as suas dívidas em um só lugar. Sem ver a realidade, não há como mudar.",
    badge: "15 min",
    emoji: "🔦",
    phase: 'dossie',
    crudType: 'debts',
    inputs: [],
    outputMetrics: [
      { key: 'totalDebts', label: 'Total de dívidas', format: 'number', icon: '📋' },
      { key: 'criticalCount', label: 'Dívidas críticas', format: 'number', icon: '🚨' },
      { key: 'totalValue', label: 'Valor total', format: 'currency', icon: '💰' },
    ],
    tips: [
      'Inclua TUDO, mesmo as dívidas que dão vergonha',
      'Marque como crítica se tiver juros altos ou risco de nome sujo',
    ],
  },
  {
    id: 3,
    title: "Calendário 30 Dias",
    subtitle: "O que vence quando",
    objective: "Visualize todos os vencimentos do próximo mês para não ser pego de surpresa.",
    badge: "15 min",
    emoji: "📅",
    phase: 'dossie',
    crudType: 'calendar',
    inputs: [],
    outputMetrics: [
      { key: 'totalItems', label: 'Itens no calendário', format: 'number', icon: '📅' },
      { key: 'criticalItems', label: 'Vencimentos críticos', format: 'number', icon: '🔴' },
      { key: 'totalMonth', label: 'Total do mês', format: 'currency', icon: '💸' },
    ],
    tips: [
      'Clique em "Importar das dívidas" para gerar automaticamente',
      'Adicione contas fixas como água, luz, internet',
    ],
  },
  {
    id: 4,
    title: "Gap Mensal",
    subtitle: "Quanto preciso este mês",
    objective: "Calcule a diferença entre sua renda e suas despesas essenciais + dívidas mínimas.",
    badge: "15 min",
    emoji: "📊",
    phase: 'dossie',
    inputs: [
      { 
        name: 'income', 
        label: 'Renda mensal total', 
        type: 'currency', 
        required: true,
        placeholder: '3000.00'
      },
      { 
        name: 'alimentacao', 
        label: 'Alimentação', 
        type: 'currency',
        placeholder: '800.00'
      },
      { 
        name: 'transporte', 
        label: 'Transporte', 
        type: 'currency',
        placeholder: '300.00'
      },
      { 
        name: 'moradia', 
        label: 'Moradia (aluguel/condomínio)', 
        type: 'currency',
        placeholder: '1000.00'
      },
      { 
        name: 'saude', 
        label: 'Saúde', 
        type: 'currency',
        placeholder: '200.00'
      },
      { 
        name: 'minimum_debts', 
        label: 'Mínimo das dívidas (parcelas)', 
        type: 'currency',
        placeholder: '500.00'
      },
    ],
    outputMetrics: [
      { key: 'income', label: 'Renda', format: 'currency', icon: '💵' },
      { key: 'expenses', label: 'Despesas', format: 'currency', icon: '📤' },
      { key: 'gap', label: 'Sobra/Falta', format: 'currency', icon: '📈' },
    ],
    tips: [
      'Use valores reais, não ideais',
      'Se o gap for negativo, precisamos encontrar margem',
    ],
  },

  // =================== FASE 2: CONTENÇÃO (Dias 5-8) ===================
  {
    id: 5,
    title: "Travas Anti-Rombo",
    subtitle: "Política do cartão",
    objective: "Defina regras claras para evitar novos gastos e proteger sua margem.",
    badge: "10 min",
    emoji: "🛑",
    phase: 'contencao',
    inputs: [
      { 
        name: 'weekly_limit', 
        label: 'Limite semanal do cartão', 
        type: 'currency',
        placeholder: '200.00'
      },
      { 
        name: 'installment_rule', 
        label: 'Regra de parcelamento', 
        type: 'select',
        options: [
          { value: 'never', label: '🚫 Nunca parcelar' },
          { value: 'exceptions', label: '⚠️ Só exceções (saúde/emergência)' },
        ],
        required: true
      },
      { 
        name: 'blocked_categories', 
        label: 'Gastos proibidos por 15 dias', 
        type: 'checkboxGroup',
        options: [
          { value: 'delivery', label: '🍕 Delivery' },
          { value: 'streaming', label: '📺 Streaming' },
          { value: 'shopping', label: '🛒 Compras online' },
          { value: 'clothes', label: '👕 Roupas' },
          { value: 'entertainment', label: '🎬 Entretenimento' },
          { value: 'subscriptions', label: '📱 Assinaturas' },
        ]
      },
    ],
    outputMetrics: [
      { key: 'weeklyLimit', label: 'Limite semanal', format: 'currency', icon: '💳' },
      { key: 'blockedCount', label: 'Categorias bloqueadas', format: 'number', icon: '🚫' },
      { key: 'rule', label: 'Regra ativa', format: 'text', icon: '✅' },
    ],
    tips: [
      'Comece com limites agressivos - você pode ajustar depois',
      'Coloque o cartão físico em um lugar difícil de acessar',
    ],
  },
  {
    id: 6,
    title: "Cortes de Impacto",
    subtitle: "Onde cortar gastos",
    objective: "Identifique os 10 principais cortes que podem gerar margem imediata.",
    badge: "15 min",
    emoji: "✂️",
    phase: 'contencao',
    crudType: 'cuts',
    inputs: [],
    outputMetrics: [
      { key: 'totalCuts', label: 'Cortes identificados', format: 'number', icon: '✂️' },
      { key: 'totalSavings', label: 'Economia potencial', format: 'currency', icon: '💰' },
      { key: 'executedCuts', label: 'Já executados', format: 'number', icon: '✅' },
    ],
    tips: [
      'Foque em assinaturas e gastos recorrentes primeiro',
      'Pequenos cortes somam - R$30/mês = R$360/ano',
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
    title: "Reduzir 1 Conta Fixa",
    subtitle: "Ação imediata",
    objective: "Escolha UMA conta fixa e execute uma ação para reduzi-la hoje.",
    badge: "10 min",
    emoji: "📞",
    phase: 'contencao',
    inputs: [
      { 
        name: 'selected_bill', 
        label: 'Conta escolhida', 
        type: 'text',
        required: true,
        placeholder: 'Ex: Internet, Telefone, Seguro...'
      },
      { 
        name: 'action_type', 
        label: 'Ação realizada', 
        type: 'select',
        options: [
          { value: 'reduce', label: '📉 Reduzir plano' },
          { value: 'cancel', label: '❌ Cancelar' },
          { value: 'negotiate', label: '🤝 Negociar desconto' },
          { value: 'substitute', label: '🔄 Trocar por mais barato' },
        ],
        required: true
      },
      { 
        name: 'monthly_savings', 
        label: 'Economia mensal conseguida', 
        type: 'currency',
        required: true
      },
    ],
    outputMetrics: [
      { key: 'bill', label: 'Conta alterada', format: 'text', icon: '📋' },
      { key: 'action', label: 'Ação', format: 'text', icon: '✅' },
      { key: 'yearlySavings', label: 'Economia anual', format: 'currency', icon: '💰' },
    ],
    tips: [
      'Ligue HOJE - não deixe para amanhã',
      'Peça para falar com o setor de cancelamento (melhores ofertas)',
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
