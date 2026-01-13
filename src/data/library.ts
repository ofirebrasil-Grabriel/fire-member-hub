// =============================================
// FIRE 15D - Resource Library (Static Content)
// =============================================

export interface Script {
  id: string;
  title: string;
  channel: 'whatsapp' | 'phone' | 'email';
  text: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  category: 'safety' | 'negotiation' | 'general';
}

export interface CutSuggestion {
  category: string;
  items: string[];
  avgSavings: string;
}

// =================== SCRIPTS DE NEGOCIAÇÃO ===================
export const NEGOTIATION_SCRIPTS: Script[] = [
  {
    id: 'whatsapp-opening',
    title: 'Abertura WhatsApp',
    channel: 'whatsapp',
    text: `Olá! Sou cliente e gostaria de negociar minha dívida.

Meu CPF: [SEU CPF]
Nome: [SEU NOME]

Qual a melhor proposta disponível para quitação ou parcelamento?`,
  },
  {
    id: 'whatsapp-counter',
    title: 'Contra-proposta WhatsApp',
    channel: 'whatsapp',
    text: `Agradeço a proposta, mas infelizmente não consigo esse valor.

Minha situação atual permite:
- Entrada máxima: R$ [VALOR]
- Parcela máxima: R$ [VALOR]

Há alguma condição especial que se encaixe nisso?`,
  },
  {
    id: 'phone-opening',
    title: 'Abertura Telefone',
    channel: 'phone',
    text: `"Boa tarde, meu nome é [NOME], CPF [CPF].

Estou ligando para negociar minha dívida. Gostaria de saber qual a melhor proposta disponível hoje.

Estou passando por dificuldades financeiras e quero resolver essa situação."`,
  },
  {
    id: 'phone-retention',
    title: 'Pedir Setor de Retenção',
    channel: 'phone',
    text: `"Essa proposta não cabe no meu orçamento atual.

Posso falar com o setor de retenção ou negociação especial? 

Tenho interesse em resolver, mas preciso de condições mais acessíveis."`,
  },
  {
    id: 'email-formal',
    title: 'Email Formal',
    channel: 'email',
    text: `Assunto: Solicitação de Negociação de Dívida - CPF [SEU CPF]

Prezados,

Venho por meio deste solicitar a negociação da minha dívida referente a [PRODUTO/SERVIÇO].

Encontro-me em dificuldades financeiras temporárias e busco uma solução que permita a quitação do débito de forma viável.

Minha proposta:
- Entrada: R$ [VALOR]
- Parcelas: [X] de R$ [VALOR]

Aguardo retorno com as opções disponíveis.

Atenciosamente,
[SEU NOME]
[SEU TELEFONE]`,
  },
];

// =================== CHECKLIST ANTI-GOLPE ===================
export const ANTI_FRAUD_CHECKLIST: ChecklistItem[] = [
  {
    id: 'official-channel',
    text: 'Sempre use canais oficiais (app, site ou 0800 do credor)',
    category: 'safety',
  },
  {
    id: 'no-upfront',
    text: 'NUNCA pague nada adiantado para "liberar" negociação',
    category: 'safety',
  },
  {
    id: 'verify-boleto',
    text: 'Confira o boleto no app do banco antes de pagar',
    category: 'safety',
  },
  {
    id: 'check-beneficiary',
    text: 'Verifique se o beneficiário do boleto é o credor correto',
    category: 'safety',
  },
  {
    id: 'no-pix-unknown',
    text: 'Não faça PIX para contas de pessoas físicas',
    category: 'safety',
  },
  {
    id: 'record-everything',
    text: 'Anote protocolo, data, hora e nome do atendente',
    category: 'negotiation',
  },
  {
    id: 'get-written',
    text: 'Peça confirmação por escrito (email ou SMS)',
    category: 'negotiation',
  },
  {
    id: 'compare-offers',
    text: 'Compare propostas - ligue mais de uma vez',
    category: 'negotiation',
  },
];

// =================== SUGESTÕES DE CORTES ===================
export const CUT_SUGGESTIONS: CutSuggestion[] = [
  {
    category: '📺 Streaming e Assinaturas',
    items: [
      'Netflix',
      'Spotify',
      'Amazon Prime',
      'Disney+',
      'HBO Max',
      'YouTube Premium',
      'Globoplay',
      'Deezer',
      'Apple TV+',
      'Paramount+',
    ],
    avgSavings: 'R$ 30-60/mês por serviço',
  },
  {
    category: '🍕 Alimentação',
    items: [
      'Delivery (iFood, Rappi)',
      'Cafés na rua',
      'Lanches fora de hora',
      'Refrigerantes e sucos prontos',
      'Restaurantes no almoço',
      'Padaria diária',
    ],
    avgSavings: 'R$ 200-500/mês',
  },
  {
    category: '📱 Telefonia e Internet',
    items: [
      'Plano de celular (trocar por mais barato)',
      'Internet (reduzir velocidade)',
      'TV a cabo (cancelar)',
      'Telefone fixo (cancelar)',
      'Seguro de celular',
    ],
    avgSavings: 'R$ 50-200/mês',
  },
  {
    category: '🚗 Transporte',
    items: [
      'Uber/99 (usar transporte público)',
      'Gasolina (carona solidária)',
      'Estacionamento',
      'Seguro carro (negociar)',
      'Lavagem de carro',
    ],
    avgSavings: 'R$ 100-400/mês',
  },
  {
    category: '💅 Cuidados Pessoais',
    items: [
      'Salão de beleza (espaçar visitas)',
      'Cosméticos (usar o que tem)',
      'Academia (exercício em casa)',
      'Manicure (fazer em casa)',
    ],
    avgSavings: 'R$ 100-300/mês',
  },
  {
    category: '🏠 Casa',
    items: [
      'Energia (apagar luzes, banho mais curto)',
      'Água (reduzir consumo)',
      'Gás (cozinhar mais simples)',
      'Produtos de limpeza (marcas mais baratas)',
      'Faxineira (reduzir frequência)',
    ],
    avgSavings: 'R$ 50-150/mês',
  },
  {
    category: '🎮 Lazer e Entretenimento',
    items: [
      'Jogos e apps pagos',
      'Cinema (streaming em casa)',
      'Bares e festas',
      'Hobbies caros',
      'Presentes (reduzir valor)',
    ],
    avgSavings: 'R$ 100-300/mês',
  },
  {
    category: '🏦 Financeiros',
    items: [
      'Taxas bancárias (migrar para digital)',
      'Cartão de crédito anuidade (pedir isenção)',
      'Seguros desnecessários',
      'Consórcios que não precisa',
    ],
    avgSavings: 'R$ 30-100/mês',
  },
];

// =================== DICAS RÁPIDAS ===================
export const QUICK_TIPS = [
  {
    title: '💡 Regra dos 3 dias',
    text: 'Antes de comprar algo acima de R$100, espere 3 dias. Se ainda quiser, aí compra.',
  },
  {
    title: '💡 Envelope de dinheiro',
    text: 'Separe o dinheiro da semana em envelope físico. Acabou = acabou.',
  },
  {
    title: '💡 Desinstale apps',
    text: 'Delete apps de delivery e shopping do celular. A fricção evita compras por impulso.',
  },
  {
    title: '💡 Lista antes de comprar',
    text: 'Nunca vá ao mercado sem lista. E não compre nada fora dela.',
  },
  {
    title: '💡 Água em restaurante',
    text: 'Peça água da casa, não mineral. Economia pequena que soma.',
  },
  {
    title: '💡 Fim do mês = fim do dinheiro',
    text: 'Não antecipe salário nem peça emprestado. Aprenda a viver com o que tem.',
  },
];

// =================== FRASES MOTIVACIONAIS ===================
export const MOTIVATIONAL_PHRASES = [
  'Você está construindo sua liberdade financeira! 🔥',
  'Cada passo conta. Continue assim! 💪',
  'Mais um dia de vitória no seu caminho FIRE! 🎯',
  'Sua versão futura agradece pelo esforço de hoje! 🚀',
  'Consistência é o segredo. Você está arrasando! ⭐',
  'O caos está virando controle! 📊',
  'Menos uma dívida, mais liberdade! 🆓',
  'Seu eu do futuro está orgulhoso! 🏆',
  'Pequenos passos, grandes mudanças! 👣',
  'Você é mais forte que suas dívidas! 💪',
];

// Helper to get random motivational phrase
export function getRandomMotivationalPhrase(): string {
  return MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)];
}

// Helper to get scripts by channel
export function getScriptsByChannel(channel: 'whatsapp' | 'phone' | 'email'): Script[] {
  return NEGOTIATION_SCRIPTS.filter(s => s.channel === channel);
}

// Helper to get checklist by category
export function getChecklistByCategory(category: 'safety' | 'negotiation' | 'general'): ChecklistItem[] {
  return ANTI_FRAUD_CHECKLIST.filter(c => c.category === category);
}
