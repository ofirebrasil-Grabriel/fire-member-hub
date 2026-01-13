import type { ComponentType } from 'react';
import {
  Banknote,
  BadgeDollarSign,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  HandCoins,
  Landmark,
  LineChart,
  ListChecks,
  PiggyBank,
  Receipt,
  Scale,
  ShieldCheck,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
  CreditCard,
} from 'lucide-react';

export type LucideIconName =
  | 'banknote'
  | 'badge-dollar-sign'
  | 'book-open'
  | 'briefcase'
  | 'calendar'
  | 'check-circle-2'
  | 'circle-dollar-sign'
  | 'credit-card'
  | 'file-text'
  | 'hand-coins'
  | 'landmark'
  | 'line-chart'
  | 'list-checks'
  | 'piggy-bank'
  | 'receipt'
  | 'scale'
  | 'shield-check'
  | 'target'
  | 'trending-down'
  | 'trending-up'
  | 'wallet';

export const LUCIDE_ICON_OPTIONS: Array<{ value: LucideIconName; label: string }> = [
  { value: 'wallet', label: 'Carteira' },
  { value: 'credit-card', label: 'Cartão' },
  { value: 'badge-dollar-sign', label: 'Selo $' },
  { value: 'circle-dollar-sign', label: 'Círculo $' },
  { value: 'banknote', label: 'Nota' },
  { value: 'piggy-bank', label: 'Cofrinho' },
  { value: 'hand-coins', label: 'Mãos & moedas' },
  { value: 'landmark', label: 'Banco' },
  { value: 'receipt', label: 'Recibo' },
  { value: 'scale', label: 'Balança' },
  { value: 'line-chart', label: 'Gráfico' },
  { value: 'trending-up', label: 'Em alta' },
  { value: 'trending-down', label: 'Em baixa' },
  { value: 'target', label: 'Meta' },
  { value: 'list-checks', label: 'Checklist' },
  { value: 'check-circle-2', label: 'Concluído' },
  { value: 'calendar', label: 'Calendário' },
  { value: 'file-text', label: 'Documento' },
  { value: 'book-open', label: 'Dossiê' },
  { value: 'briefcase', label: 'Portfólio' },
  { value: 'shield-check', label: 'Proteção' },
];

export const LUCIDE_ICON_MAP = {
  banknote: Banknote,
  'badge-dollar-sign': BadgeDollarSign,
  'book-open': BookOpen,
  briefcase: Briefcase,
  calendar: Calendar,
  'check-circle-2': CheckCircle2,
  'circle-dollar-sign': CircleDollarSign,
  'credit-card': CreditCard,
  'file-text': FileText,
  'hand-coins': HandCoins,
  landmark: Landmark,
  'line-chart': LineChart,
  'list-checks': ListChecks,
  'piggy-bank': PiggyBank,
  receipt: Receipt,
  scale: Scale,
  'shield-check': ShieldCheck,
  target: Target,
  'trending-down': TrendingDown,
  'trending-up': TrendingUp,
  wallet: Wallet,
} satisfies Record<LucideIconName, ComponentType<{ className?: string }>>;
