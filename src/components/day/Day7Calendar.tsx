import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus, Trash2, Calendar, AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface Day7CalendarProps {
  onComplete: (values: Record<string, unknown>) => void;
  defaultValues?: Record<string, unknown>;
}

type CalendarSource = 'existing' | 'fixed' | 'debt' | 'manual';
type CalendarPriority = 'essential' | 'important' | 'negotiable';
type CalendarCategory =
  | 'housing'
  | 'utilities'
  | 'transport'
  | 'health'
  | 'education'
  | 'insurance'
  | 'subscriptions'
  | 'card'
  | 'debt'
  | 'taxes'
  | 'other';
type CalendarPaymentMethod = 'boleto' | 'pix' | 'debit' | 'card' | 'cash' | 'transfer';

interface CalendarDraft {
  localId: string;
  serverId?: string;
  title: string;
  value: string;
  dueDate: string;
  isFixed: boolean;
  isCritical: boolean;
  category: CalendarCategory;
  paymentMethod: CalendarPaymentMethod;
  priority: CalendarPriority;
  source: CalendarSource;
  sourceDebtId?: string;
}

interface CalendarRow {
  id: string;
  title: string;
  value: number | null;
  due_date: string | null;
  is_fixed: boolean | null;
  is_critical: boolean | null;
  source_debt_id: string | null;
}

interface IncomeRow {
  source: string;
  amount: number | null;
  received_on: number | null;
}

interface FixedExpenseRow {
  id: string;
  name: string;
  category: string | null;
  amount: number | null;
  due_date: number | null;
  priority: string | null;
  auto_debit: boolean | null;
  payment_method: string | null;
}

interface DebtRow {
  id: string;
  creditor: string;
  installment_value: number | null;
  due_day: number | null;
  is_critical: boolean | null;
}

const SOURCE_LABEL: Record<CalendarSource, string> = {
  existing: 'Calendario',
  fixed: 'Conta fixa',
  debt: 'Divida',
  manual: 'Manual',
};

const CATEGORY_OPTIONS: { value: CalendarCategory; label: string }[] = [
  { value: 'housing', label: 'Habitacao' },
  { value: 'utilities', label: 'Servicos' },
  { value: 'transport', label: 'Transporte' },
  { value: 'health', label: 'Saude' },
  { value: 'education', label: 'Educacao' },
  { value: 'insurance', label: 'Seguros' },
  { value: 'subscriptions', label: 'Assinaturas' },
  { value: 'card', label: 'Cartao' },
  { value: 'debt', label: 'Dividas' },
  { value: 'taxes', label: 'Impostos' },
  { value: 'other', label: 'Outros' },
];

const PAYMENT_OPTIONS: { value: CalendarPaymentMethod; label: string }[] = [
  { value: 'boleto', label: 'Boleto' },
  { value: 'pix', label: 'PIX' },
  { value: 'debit', label: 'Debito auto' },
  { value: 'card', label: 'Cartao' },
  { value: 'transfer', label: 'Transferencia' },
  { value: 'cash', label: 'Dinheiro' },
];

const PRIORITY_OPTIONS: { value: CalendarPriority; label: string }[] = [
  { value: 'essential', label: 'Essencial' },
  { value: 'important', label: 'Importante' },
  { value: 'negotiable', label: 'Negociavel' },
];

const formatDate = (value: string) => {
  if (!value) return '-';
  const [year, month, day] = value.split('-').map((part) => Number(part));
  if (!year || !month || !day) return value;
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
};

const getDayFromDate = (value: string) => {
  if (!value) return null;
  const parts = value.split('-');
  const day = Number(parts[2]);
  return Number.isFinite(day) ? day : null;
};

const buildDateFromDay = (day: number | null | undefined) => {
  if (!day) return '';
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const lastDay = new Date(year, month, 0).getDate();
  const safeDay = Math.min(Math.max(day, 1), lastDay);
  return `${year}-${String(month).padStart(2, '0')}-${String(safeDay).padStart(2, '0')}`;
};

const parseAmount = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const normalized = trimmed.includes(',')
    ? trimmed.replace(/\./g, '').replace(',', '.')
    : trimmed;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const sanitizeCurrencyInput = (value: string) => {
  return value.replace(/[^\d.,]/g, '');
};

const normalizeCategory = (value?: string | null): CalendarCategory => {
  const candidate = (value || '').toLowerCase();
  const found = CATEGORY_OPTIONS.find((option) => option.value === candidate);
  return found?.value || 'other';
};

const normalizePaymentMethod = (value?: string | null): CalendarPaymentMethod => {
  const candidate = (value || '').toLowerCase();
  const found = PAYMENT_OPTIONS.find((option) => option.value === candidate);
  return found?.value || 'boleto';
};

const normalizePriority = (value?: string | null, isCritical?: boolean | null): CalendarPriority => {
  if (value) {
    const candidate = value.toLowerCase();
    const found = PRIORITY_OPTIONS.find((option) => option.value === candidate);
    if (found) return found.value;
  }
  return isCritical ? 'essential' : 'important';
};

const sortByDueDate = (items: CalendarDraft[]) => {
  return [...items].sort((a, b) => {
    const aKey = a.dueDate || '9999-99-99';
    const bKey = b.dueDate || '9999-99-99';
    return aKey.localeCompare(bKey);
  });
};

const Day7Calendar: React.FC<Day7CalendarProps> = ({ onComplete, defaultValues }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<CalendarDraft[]>([]);
  const [incomeItems, setIncomeItems] = useState<IncomeRow[]>([]);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const initialCalendarIds = useRef<Set<string>>(new Set());

  const [newTitle, setNewTitle] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newCategory, setNewCategory] = useState<CalendarCategory>('other');
  const [newPaymentMethod, setNewPaymentMethod] = useState<CalendarPaymentMethod>('boleto');
  const [newPriority, setNewPriority] = useState<CalendarPriority>('important');

  useEffect(() => {
    if (!user?.id) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const { data: calendarItems, error: calendarError } = await supabase
          .from('calendar_items')
          .select('id, title, value, due_date, is_fixed, is_critical, source_debt_id')
          .eq('user_id', user.id)
          .order('due_date', { ascending: true });

        if (calendarError) throw calendarError;

        const defaultCalendarItems = Array.isArray(defaultValues?.calendarItems)
          ? (defaultValues?.calendarItems as Array<Record<string, unknown>>)
          : [];
        const defaultsById = new Map(
          defaultCalendarItems
            .filter((item) => item.id)
            .map((item) => [String(item.id), item])
        );

        if (calendarItems && calendarItems.length > 0) {
          const mapped = calendarItems.map((item: CalendarRow) => {
            const defaults = defaultsById.get(item.id);
            const priority = normalizePriority(
              defaults?.priority ? String(defaults.priority) : undefined,
              item.is_critical
            );
            return {
              localId: `calendar-${item.id}`,
              serverId: item.id,
              title: item.title || '',
              value: item.value ? String(item.value) : '',
              dueDate: item.due_date || '',
              isFixed: Boolean(item.is_fixed),
              isCritical: priority === 'essential',
              category: normalizeCategory(
                defaults?.category ? String(defaults.category) : undefined
              ),
              paymentMethod: normalizePaymentMethod(
                defaults?.payment_method ? String(defaults.payment_method) : undefined
              ),
              priority,
              source: 'existing' as CalendarSource,
              sourceDebtId: item.source_debt_id || undefined,
            };
          });
          initialCalendarIds.current = new Set(calendarItems.map((item: CalendarRow) => item.id));
          setItems(sortByDueDate(mapped));
        }

        const [
          { data: fixedExpenses, error: fixedError },
          { data: debts, error: debtError },
          { data: incomes, error: incomeError },
        ] = await Promise.all([
          supabase
            .from('fixed_expenses')
            .select('id, name, amount, due_date, priority, auto_debit, payment_method, category')
            .eq('user_id', user.id),
          supabase
            .from('debts')
            .select('id, creditor, installment_value, due_day, is_critical')
            .eq('user_id', user.id),
          supabase
            .from('income_items')
            .select('source, amount, received_on')
            .eq('user_id', user.id),
        ]);

        if (fixedError) throw fixedError;
        if (debtError) throw debtError;
        if (incomeError) throw incomeError;

        setIncomeItems((incomes as IncomeRow[]) || []);

        if (calendarItems && calendarItems.length > 0) {
          return;
        }

        if (defaultCalendarItems.length > 0) {
          const fallbackItems = defaultCalendarItems.map((item, index) => {
            const priority = normalizePriority(
              item.priority ? String(item.priority) : undefined,
              Boolean(item.is_critical)
            );
            return {
              localId: `calendar-fallback-${index}`,
              title: String(item.title || ''),
              value: item.value ? String(item.value) : '',
              dueDate: String(item.due_date || ''),
              isFixed: Boolean(item.is_fixed),
              isCritical: priority === 'essential',
              category: normalizeCategory(item.category ? String(item.category) : undefined),
              paymentMethod: normalizePaymentMethod(
                item.payment_method ? String(item.payment_method) : undefined
              ),
              priority,
              source: 'manual' as CalendarSource,
            };
          });
          setItems(sortByDueDate(fallbackItems));
          return;
        }

        const fixedItems = (fixedExpenses || []).map((expense: FixedExpenseRow) => ({
          localId: `fixed-${expense.id}`,
          title: expense.name || '',
          value: expense.amount ? String(expense.amount) : '',
          dueDate: buildDateFromDay(expense.due_date),
          isFixed: true,
          isCritical: expense.priority === 'essential',
          category: normalizeCategory(expense.category),
          paymentMethod: normalizePaymentMethod(expense.payment_method),
          priority: normalizePriority(expense.priority, expense.priority === 'essential'),
          source: 'fixed' as CalendarSource,
        }));

        const debtItems = (debts || []).map((debt: DebtRow) => ({
          localId: `debt-${debt.id}`,
          title: `Parcela - ${debt.creditor}`,
          value: debt.installment_value ? String(debt.installment_value) : '',
          dueDate: buildDateFromDay(debt.due_day),
          isFixed: true,
          isCritical: Boolean(debt.is_critical),
          category: 'debt' as CalendarCategory,
          paymentMethod: 'boleto' as CalendarPaymentMethod,
          priority: normalizePriority(undefined, Boolean(debt.is_critical)),
          source: 'debt' as CalendarSource,
          sourceDebtId: debt.id,
        }));

        const combined = [...fixedItems, ...debtItems];
        if (combined.length > 0) {
          setItems(sortByDueDate(combined));
        }
      } catch (error) {
        console.error('Erro ao carregar calendario', error);
        toast({ title: 'Erro ao carregar vencimentos', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id, defaultValues]);

  useEffect(() => {
    if (!defaultValues) return;
    if (defaultValues.remindersEnabled !== undefined) {
      setRemindersEnabled(Boolean(defaultValues.remindersEnabled));
    }
  }, [defaultValues]);

  const updateItem = (localId: string, updates: Partial<CalendarDraft>) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.localId !== localId) return item;
        const next = { ...item, ...updates };
        if (updates.priority) {
          next.isCritical = updates.priority === 'essential';
        }
        return next;
      })
    );
  };

  const handleRemove = (localId: string) => {
    setItems((prev) => prev.filter((item) => item.localId !== localId));
  };

  const handleAdd = () => {
    if (!newTitle.trim()) {
      toast({ title: 'Informe o nome da conta', variant: 'destructive' });
      return;
    }
    const amountValue = parseAmount(newValue);
    if (!amountValue) {
      toast({ title: 'Informe um valor valido', variant: 'destructive' });
      return;
    }

    const newItem: CalendarDraft = {
      localId: `manual-${Date.now()}`,
      title: newTitle.trim(),
      value: newValue.trim(),
      dueDate: newDueDate,
      isFixed: true,
      isCritical: newPriority === 'essential',
      category: newCategory,
      paymentMethod: newPaymentMethod,
      priority: newPriority,
      source: 'manual',
    };
    setItems((prev) => sortByDueDate([...prev, newItem]));
    setNewTitle('');
    setNewValue('');
    setNewDueDate('');
    setNewCategory('other');
    setNewPaymentMethod('boleto');
    setNewPriority('important');
  };

  const stats = useMemo(() => {
    const totals = items.reduce(
      (acc, item) => {
        const amount = parseAmount(item.value);
        acc.total += amount;
        acc.critical += item.priority === 'essential' ? 1 : 0;
        acc.withDates.push(item.dueDate);
        return acc;
      },
      { total: 0, critical: 0, withDates: [] as string[] }
    );

    const nextDueDate = totals.withDates
      .filter(Boolean)
      .sort()
      .shift();

    return {
      totalObligations: items.length,
      criticalCount: totals.critical,
      totalValue: totals.total,
      nextDueDate: nextDueDate || '',
    };
  }, [items]);

  const cashflow = useMemo(() => {
    const incomeByDay = new Map<number, number>();
    const expenseByDay = new Map<number, number>();

    incomeItems.forEach((income) => {
      const day = income.received_on || 0;
      if (!day) return;
      incomeByDay.set(day, (incomeByDay.get(day) || 0) + Number(income.amount || 0));
    });

    items.forEach((item) => {
      const day = getDayFromDate(item.dueDate);
      if (!day) return;
      expenseByDay.set(day, (expenseByDay.get(day) || 0) + parseAmount(item.value));
    });

    let running = 0;
    const alerts: { day: number; deficit: number }[] = [];

    for (let day = 1; day <= 31; day += 1) {
      running += incomeByDay.get(day) || 0;
      running -= expenseByDay.get(day) || 0;
      if (running < 0 && (expenseByDay.get(day) || 0) > 0) {
        alerts.push({ day, deficit: Math.abs(running) });
      }
    }

    const incomeTotal = [...incomeByDay.values()].reduce((acc, value) => acc + value, 0);
    const expenseTotal = [...expenseByDay.values()].reduce((acc, value) => acc + value, 0);

    return {
      alerts,
      incomeTotal,
      expenseTotal,
      runningBalance: running,
    };
  }, [incomeItems, items]);

  const invalidItems = items.filter(
    (item) => !item.title.trim() || parseAmount(item.value) <= 0 || !item.dueDate
  );
  const canComplete = items.length > 0 && invalidItems.length === 0;

  const handleComplete = async () => {
    if (!user?.id) return;
    if (!canComplete) {
      toast({ title: 'Adicione pelo menos uma obrigacao valida', variant: 'destructive' });
      return;
    }

    const validItems = items.filter((item) => item.title.trim() && parseAmount(item.value) > 0);
    const rows = validItems.map((item) => ({
      ...(item.serverId ? { id: item.serverId } : {}),
      user_id: user.id,
      title: item.title.trim(),
      value: parseAmount(item.value),
      due_date: item.dueDate || null,
      is_fixed: item.isFixed,
      is_critical: item.isCritical,
      source_debt_id: item.sourceDebtId || null,
    }));

    setSaving(true);
    try {
      if (rows.length > 0) {
        const { error: upsertError } = await supabase
          .from('calendar_items')
          .upsert(rows, { onConflict: 'id' });
        if (upsertError) throw upsertError;
      }

      const idsToKeep = new Set(
        validItems.map((item) => item.serverId).filter(Boolean) as string[]
      );
      const idsToDelete = [...initialCalendarIds.current].filter((id) => !idsToKeep.has(id));

      if (idsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('calendar_items')
          .delete()
          .in('id', idsToDelete)
          .eq('user_id', user.id);
        if (deleteError) throw deleteError;
      }

      onComplete({
        totalObligations: stats.totalObligations,
        criticalCount: stats.criticalCount,
        nextDueDate: stats.nextDueDate ? formatDate(stats.nextDueDate) : '-',
        remindersEnabled,
        calendarItems: validItems.map((item) => ({
          id: item.serverId || null,
          title: item.title.trim(),
          value: parseAmount(item.value),
          due_date: item.dueDate || null,
          is_fixed: item.isFixed,
          is_critical: item.isCritical,
          category: item.category,
          payment_method: item.paymentMethod,
          priority: item.priority,
        })),
      });
    } catch (error) {
      console.error('Erro ao salvar calendario', error);
      toast({ title: 'Erro ao salvar vencimentos', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const sortedItems = sortByDueDate(items);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="glass-card border-primary/10">
        <CardContent className="p-4 text-sm text-muted-foreground flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-primary mt-0.5" />
          <span>
            Este calendario evita juros e surpresas. Se nao souber o dia exato, coloque o mais
            proximo possivel.
          </span>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        {[1, 2, 3].map((value) => (
          <div
            key={value}
            className={cn(
              "flex-1 rounded-full h-1.5",
              step >= value ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card/50 border-primary/10">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-muted-foreground">Total de obrigacoes</div>
            <div className="text-2xl font-bold text-primary">{stats.totalObligations}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.totalValue)} no mes
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-warning/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Contas criticas
            </div>
            <div className="text-2xl font-bold text-warning">{stats.criticalCount}</div>
            <p className="text-xs text-muted-foreground">Priorize e evite atrasos</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-primary/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              Proximo vencimento
            </div>
            <div className="text-2xl font-bold text-primary">
              {stats.nextDueDate ? formatDate(stats.nextDueDate) : '-'}
            </div>
            <p className="text-xs text-muted-foreground">Organize antes do prazo</p>
          </CardContent>
        </Card>
      </div>

      {step === 1 && (
        <div className="glass-card p-4 space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Passo 1: Revise e complete seus vencimentos</h3>
            <p className="text-sm text-muted-foreground">
              Ajuste nome, valor, data e prioridade. Inclua contas que faltarem.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
              Nenhuma obrigacao carregada. Adicione abaixo para continuar.
            </div>
          ) : (
            <div className="rounded-lg border border-border/60 overflow-x-auto">
              <Table className="min-w-[980px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Conta</TableHead>
                    <TableHead className="whitespace-nowrap w-32">Valor</TableHead>
                    <TableHead className="whitespace-nowrap w-44">Vencimento</TableHead>
                    <TableHead className="whitespace-nowrap w-40">Categoria</TableHead>
                    <TableHead className="whitespace-nowrap w-36">Pagamento</TableHead>
                    <TableHead className="whitespace-nowrap w-32">Prioridade</TableHead>
                    <TableHead className="whitespace-nowrap w-16 text-center">Remover</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedItems.map((item) => (
                    <TableRow
                      key={item.localId}
                      className={cn(
                        item.priority === 'essential' && 'bg-red-500/5 border-l-2 border-red-500'
                      )}
                    >
                      <TableCell className="space-y-1 min-w-[220px]">
                        <Input
                          value={item.title}
                          onChange={(event) =>
                            updateItem(item.localId, { title: event.target.value })
                          }
                          className="bg-background"
                          placeholder="Nome da conta"
                        />
                        <Badge variant="secondary" className="text-xs">
                          {SOURCE_LABEL[item.source]}
                        </Badge>
                      </TableCell>
                      <TableCell className="min-w-[140px]">
                        <div className="relative">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            R$
                          </span>
                          <Input
                            value={item.value}
                            onChange={(event) =>
                              updateItem(item.localId, {
                                value: sanitizeCurrencyInput(event.target.value),
                              })
                            }
                            inputMode="decimal"
                            className="bg-background min-w-[140px] pl-9"
                            placeholder="0,00"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[160px]">
                        <Input
                          type="date"
                          value={item.dueDate}
                          onChange={(event) =>
                            updateItem(item.localId, { dueDate: event.target.value })
                          }
                          className="bg-background min-w-[160px]"
                        />
                        {!item.dueDate && (
                          <p className="text-[11px] text-red-500 mt-1">
                            Informe a data
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="min-w-[170px]">
                        <Select
                          value={item.category}
                          onValueChange={(value) =>
                            updateItem(item.localId, {
                              category: value as CalendarCategory,
                            })
                          }
                        >
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORY_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="min-w-[150px]">
                        <Select
                          value={item.paymentMethod}
                          onValueChange={(value) =>
                            updateItem(item.localId, {
                              paymentMethod: value as CalendarPaymentMethod,
                            })
                          }
                        >
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Pagamento" />
                          </SelectTrigger>
                          <SelectContent>
                            {PAYMENT_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="min-w-[150px]">
                        <Select
                          value={item.priority}
                          onValueChange={(value) =>
                            updateItem(item.localId, {
                              priority: value as CalendarPriority,
                            })
                          }
                        >
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Prioridade" />
                          </SelectTrigger>
                          <SelectContent>
                            {PRIORITY_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(item.localId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="rounded-lg border border-border/60 p-4 space-y-3">
            <p className="text-sm font-medium">Adicionar obrigacao faltante</p>
            <div className="grid gap-3 md:grid-cols-5">
              <Input
                placeholder="Nome da conta"
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                className="md:col-span-2 bg-background"
              />
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  R$
                </span>
                <Input
                  placeholder="0,00"
                  value={newValue}
                  onChange={(event) => setNewValue(sanitizeCurrencyInput(event.target.value))}
                  inputMode="decimal"
                  className="bg-background pl-9"
                />
              </div>
              <Input
                type="date"
                value={newDueDate}
                onChange={(event) => setNewDueDate(event.target.value)}
                className="bg-background"
              />
              <Select
                value={newCategory}
                onValueChange={(value) => setNewCategory(value as CalendarCategory)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={newPaymentMethod}
                onValueChange={(value) => setNewPaymentMethod(value as CalendarPaymentMethod)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Pagamento" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Select
                value={newPriority}
                onValueChange={(value) => setNewPriority(value as CalendarPriority)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAdd} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setStep(2)} disabled={!canComplete} className="justify-center">
              Continuar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="glass-card p-4 space-y-4">
          <div>
            <h4 className="text-base font-semibold">Passo 2: Sincronize com sua renda</h4>
            <p className="text-sm text-muted-foreground">
              Veja se algum vencimento cai antes de entrar dinheiro.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border/60 p-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                Entradas cadastradas
              </p>
              {incomeItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma renda encontrada. Revise o Dia 2 se precisar.
                </p>
              ) : (
                <div className="space-y-2 text-sm">
                  {incomeItems.map((income, index) => (
                    <div
                      key={`${income.source}-${index}`}
                      className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2"
                    >
                      <span>{income.source || 'Renda'}</span>
                      <span className="text-xs text-muted-foreground">
                        Dia {income.received_on || '-'}
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(Number(income.amount || 0))}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-lg border border-border/60 p-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                Alertas de deficit
              </p>
              {cashflow.alerts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum deficit identificado com os dados atuais.
                </p>
              ) : (
                <div className="space-y-2 text-sm">
                  {cashflow.alerts.map((alert) => (
                    <div
                      key={`alert-${alert.day}`}
                      className="flex items-center justify-between rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-600"
                    >
                      <span>Dia {alert.day}</span>
                      <span>Deficit {formatCurrency(alert.deficit)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border/60 p-3 text-xs text-muted-foreground">
            <p>Entradas previstas: {formatCurrency(cashflow.incomeTotal)}</p>
            <p>Saidas previstas: {formatCurrency(cashflow.expenseTotal)}</p>
            <p>
              Saldo projetado: {formatCurrency(cashflow.runningBalance)}
            </p>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              Voltar
            </Button>
            <Button onClick={() => setStep(3)} disabled={!canComplete}>
              Continuar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="glass-card p-4 space-y-4">
          <div>
            <h4 className="text-base font-semibold">Passo 3: Lembretes e confirmacao</h4>
            <p className="text-sm text-muted-foreground">
              Ative lembretes para evitar atraso. Depois conclua o dia.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={remindersEnabled}
              onCheckedChange={(value) => setRemindersEnabled(Boolean(value))}
            />
            <span className="text-sm">Lembretes ativos</span>
          </div>

          {invalidItems.length > 0 && (
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-700">
              Ajuste {invalidItems.length} obrigacao(oes) com nome, valor e data antes de concluir.
            </div>
          )}

          <div className="rounded-lg border border-border/60 p-3 text-xs text-muted-foreground">
            <p>Obrigacoes: {stats.totalObligations}</p>
            <p>Criticas: {stats.criticalCount}</p>
            <p>
              Proximo vencimento:{' '}
              {stats.nextDueDate ? formatDate(stats.nextDueDate) : '-'}
            </p>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              Voltar
            </Button>
            <Button onClick={handleComplete} className="btn-fire" disabled={saving || !canComplete}>
              {saving ? 'Salvando...' : 'Concluir Dia 7'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Day7Calendar;
