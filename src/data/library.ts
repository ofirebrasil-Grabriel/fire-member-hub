export const NEGOTIATION_SCRIPTS = {
  whatsapp: [
    {
      title: 'Abertura de negociacao',
      text: 'Ola, gostaria de negociar minha divida com [CREDOR]. Qual a melhor proposta disponivel?'
    },
    {
      title: 'Pedido de desconto',
      text: 'Existe algum desconto a vista ou condicao especial para quitar esta divida?'
    },
  ],
  phone: [
    {
      title: 'Introducao por telefone',
      text: 'Bom dia, meu nome e [NOME]. Quero negociar a divida com a empresa. Pode me ajudar?'
    },
    {
      title: 'Limites de pagamento',
      text: 'Consigo pagar no maximo R$ [VALOR] de entrada e parcelas de R$ [VALOR].'
    },
  ],
};

export const ANTI_FRAUD_CHECKLIST = [
  'Nunca pague boletos recebidos por email ou WhatsApp sem validar.',
  'Confirme o valor e a conta bancaria no app oficial do credor.',
  'Desconfie de descontos muito acima da media.',
  'Evite enviar dados pessoais em canais nao oficiais.',
];

export const CUT_CATEGORIES = {
  assinaturas: ['Streaming', 'Apps pagos', 'Academias'],
  alimentacao: ['Delivery', 'Almocos fora', 'Cafe diario'],
  lazer: ['Eventos pagos', 'Compras por impulso'],
  transporte: ['Apps de mobilidade', 'Estacionamento'],
};
