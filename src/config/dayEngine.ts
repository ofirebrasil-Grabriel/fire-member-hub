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
    title: "Raio-X do Caos",
    subtitle: "Fotografia completa do seu dinheiro",
    objective: "Mapeie receitas, despesas e dividas para enxergar sua realidade com clareza.",
    badge: "20-25 min",
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
    title: "Arqueologia Financeira",
    subtitle: "Investigue seus padroes",
    objective: "Analise seus gastos e identifique gatilhos e vazamentos para mudar o padrao.",
    badge: "25-30 min",
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
    title: "Regra da Pausa",
    subtitle: "Protecao contra impulsos",
    objective: "Crie seu contrato de regras e limites para proteger seu futuro.",
    badge: "20 min",
    emoji: "🛡️",
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
    subtitle: "Limites claros, menos ansiedade",
    objective: "Escolha 1 cartao principal, bloqueie os outros e defina excecoes com limite semanal.",
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
    title: "Vazamentos Invisiveis",
    subtitle: "Cortes simples que liberam folego",
    objective: "Escolha vazamentos e defina cortes claros por 7 dias.",
    badge: "15 min",
    emoji: "🕵️",
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
    title: "Vencimentos: O Que Vence e Quando",
    subtitle: "Calendario financeiro",
    objective: "Organize vencimentos para evitar juros e surpresas.",
    badge: "20-30 min",
    emoji: "🗓️",
    phase: 'contencao',
    customComponent: true,
    inputs: [],
    outputMetrics: [
      { key: 'totalObligations', label: 'Obrigacoes', format: 'number', icon: '📆' },
      { key: 'criticalCount', label: 'Criticas', format: 'number', icon: '⚠️' },
      { key: 'nextDueDate', label: 'Proximo vencimento', format: 'text', icon: '⏳' },
    ],
    tips: [
      'Alinhe vencimentos com sua data de recebimento',
      'Evite atrasos para cortar juros desnecessarios',
      'Configure lembretes para contas criticas',
    ],
  },
  {
    id: 8,
    title: "Prioridades Quando Nao Da Pra Pagar Tudo",
    subtitle: "Fila de pagamento",
    objective: "Classifique contas por impacto e defina o que pagar, negociar ou pausar.",
    badge: "20-25 min",
    emoji: "🧭",
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
    title: "Orcamento Minimo de 30 Dias",
    subtitle: "Quanto custa seu mes basico",
    objective: "Construa um orcamento minimo realista para os proximos 30 dias.",
    badge: "20-30 min",
    emoji: "🧮",
    phase: 'acordos',
    customComponent: true,
    inputs: [],
    outputMetrics: [
      { key: 'totalBudget', label: 'Orcamento total', format: 'currency', icon: '📊' },
      { key: 'status', label: 'Status', format: 'text', icon: '📋' },
      { key: 'adjustment', label: 'Ajuste sugerido', format: 'currency', icon: '🔧' },
    ],
    tips: [
      'Use os dados do Dia 2 para nao subestimar despesas',
      'Se nao cabe, volte ao Dia 6 para novos cortes',
    ],
  },
  {
    id: 10,
    title: "Mapa de Negociacao",
    subtitle: "Prepare propostas seguras",
    objective: "Defina limites e script para negociar com clareza.",
    badge: "25-35 min",
    emoji: "🧭",
    phase: 'acordos',
    customComponent: true,
    inputs: [],
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
    title: "Estudar Negociacao",
    subtitle: "Treino e confianca",
    objective: "Pratique cenarios para negociar com seguranca.",
    badge: "15 min",
    emoji: "📚",
    phase: 'acordos',
    customComponent: true,
    inputs: [],
    outputMetrics: [
      { key: 'quizScore', label: 'Pontuacao', format: 'number', icon: '🧠' },
      { key: 'confidenceLevel', label: 'Confianca', format: 'number', icon: '📈' },
    ],
    tips: [
      'Conhecimento reduz ansiedade na hora da ligacao',
      'Anote frases e argumentos que funcionam para voce',
    ],
  },
  {
    id: 12,
    title: "Fechar Acordo",
    subtitle: "Registrar o acordo com seguranca",
    objective: "Registre valores, parcelas e economia do acordo fechado.",
    badge: "20 min",
    emoji: "🤝",
    phase: 'acordos',
    customComponent: true,
    inputs: [],
    outputMetrics: [
      { key: 'agreementTotal', label: 'Valor do acordo', format: 'currency', icon: '✅' },
      { key: 'monthlyPayment', label: 'Parcela mensal', format: 'currency', icon: '📅' },
      { key: 'savings', label: 'Economia', format: 'currency', icon: '💰' },
    ],
    tips: [
      'Registre tudo por escrito para sua protecao',
      'Se algo nao couber no seu orcamento, renegocie',
    ],
  },

  // =================== FASE 4: MOTOR 30/90 (Dias 13-15) ===================
  {
    id: 13,
    title: "Novas Regras de Vida",
    subtitle: "Mantras pessoais",
    objective: "Defina 3 regras que vao proteger seu futuro financeiro.",
    badge: "15 min",
    emoji: "🧭",
    phase: 'motor',
    customComponent: true,
    inputs: [],
    outputMetrics: [
      { key: 'rulesCount', label: 'Regras definidas', format: 'number', icon: '🧭' },
      { key: 'mantra', label: 'Mantra', format: 'text', icon: '✨' },
    ],
    tips: [
      'Regras claras evitam decisoes no impulso',
      'Seja realista para conseguir manter no longo prazo',
    ],
  },
  {
    id: 14,
    title: "Plano 30/90",
    subtitle: "Mapa de futuro",
    objective: "Defina metas para 30 e 90 dias com base no seu momento.",
    badge: "15 min",
    emoji: "📈",
    phase: 'motor',
    customComponent: true,
    inputs: [],
    outputMetrics: [
      { key: 'goals30', label: 'Metas 30 dias', format: 'number', icon: '🎯' },
      { key: 'goals60', label: 'Metas 60 dias', format: 'number', icon: '📅' },
      { key: 'goals90', label: 'Metas 90 dias', format: 'number', icon: '🚀' },
    ],
    tips: [
      'Metas SMART: especificas e realistas',
      'Menos metas bem feitas > muitas metas abandonadas',
    ],
  },
  {
    id: 15,
    title: "Formatura FIRE",
    subtitle: "Celebrar e manter o ritual",
    objective: "Defina seu protocolo semanal para manter a nova rotina.",
    badge: "10-15 min",
    emoji: "🎓",
    phase: 'motor',
    customComponent: true,
    inputs: [],
    outputMetrics: [
      { key: 'ritualDay', label: 'Dia do ritual', format: 'text', icon: '📅' },
      { key: 'checklistItems', label: 'Itens no checklist', format: 'number', icon: '✅' },
      { key: 'challengeComplete', label: 'Desafio concluído!', format: 'text', icon: '🎓' },
    ],
    tips: [
      'Parabens! Voce completou o Desafio FIRE 15D!',
      'Mantenha o ritual semanal e siga seu plano 30/90',
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
