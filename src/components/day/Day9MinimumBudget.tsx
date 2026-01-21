import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

interface Day9MinimumBudgetProps {
  onComplete: (values: Record<string, unknown>) => void;
  defaultValues?: Record<string, unknown>;
}

interface IncomeRow {
  amount: number | null;
}

interface FixedExpenseRow {
  amount: number | null;
}

interface DebtRow {
  installment_value: number | null;
}

interface CalendarRow {
  value: number | null;
  is_critical: boolean | null;
}

const parseAmount = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const normalized = trimmed.includes(',')
    ? trimmed.replace(/\./g, '').replace(',', '.')
    : trimmed;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const sanitizeCurrencyInput = (value: string) => value.replace(/[^\d.,]/g, '');

const getMonthYear = (date = new Date()) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  return `${year}-${month}`;
};

const Day9MinimumBudget: React.FC<Day9MinimumBudgetProps> = ({ onComplete, defaultValues }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState('');
  const [essentialsTotal, setEssentialsTotal] = useState('');
  const [criticalBills, setCriticalBills] = useState('');
  const [minimumDebts, setMinimumDebts] = useState('');
  const [leisureMinimum, setLeisureMinimum] = useState('');

  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      setIncome(String(defaultValues.income ?? ''));
      setEssentialsTotal(String(defaultValues.essentials_total ?? ''));
      setCriticalBills(String(defaultValues.critical_bills ?? ''));
      setMinimumDebts(String(defaultValues.minimum_debts ?? ''));
      setLeisureMinimum(String(defaultValues.leisure_minimum ?? ''));
      setLoading(false);
      return;
    }

    if (!user?.id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [
          { data: incomeItems, error: incomeError },
          { data: fixedExpenses, error: fixedError },
          { data: debts, error: debtError },
          { data: calendarItems, error: calendarError },
        ] = await Promise.all([
          supabase.from('income_items').select('amount').eq('user_id', user.id),
          supabase.from('fixed_expenses').select('amount').eq('user_id', user.id),
          supabase.from('debts').select('installment_value').eq('user_id', user.id),
          supabase
            .from('calendar_items')
            .select('value, is_critical')
            .eq('user_id', user.id),
        ]);

        if (incomeError) throw incomeError;
        if (fixedError) throw fixedError;
        if (debtError) throw debtError;
        if (calendarError) throw calendarError;

        const incomeTotal = (incomeItems as IncomeRow[] | null || []).reduce(
          (sum, item) => sum + Number(item.amount || 0),
          0
        );
        const fixedTotal = (fixedExpenses as FixedExpenseRow[] | null || []).reduce(
          (sum, item) => sum + Number(item.amount || 0),
          0
        );
        const debtTotal = (debts as DebtRow[] | null || []).reduce(
          (sum, item) => sum + Number(item.installment_value || 0),
          0
        );
        const criticalTotal = (calendarItems as CalendarRow[] | null || [])
          .filter((item) => item.is_critical)
          .reduce((sum, item) => sum + Number(item.value || 0), 0);

        setIncome(incomeTotal > 0 ? String(incomeTotal) : '');
        setEssentialsTotal(fixedTotal > 0 ? String(fixedTotal) : '');
        setMinimumDebts(debtTotal > 0 ? String(debtTotal) : '');
        setCriticalBills(criticalTotal > 0 ? String(criticalTotal) : '');
      } catch (error) {
        console.error('Erro ao carregar orcamento minimo', error);
        toast({ title: 'Erro ao carregar dados do Dia 9', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [defaultValues, user?.id]);

  const totals = useMemo(() => {
    const incomeValue = parseAmount(income);
    const essentialsValue = parseAmount(essentialsTotal);
    const criticalValue = parseAmount(criticalBills);
    const debtsValue = parseAmount(minimumDebts);
    const leisureValue = parseAmount(leisureMinimum);
    const totalBudget = essentialsValue + criticalValue + debtsValue + leisureValue;
    const gap = incomeValue - totalBudget;
    return {
      incomeValue,
      essentialsValue,
      criticalValue,
      debtsValue,
      leisureValue,
      totalBudget,
      gap,
    };
  }, [income, essentialsTotal, criticalBills, minimumDebts, leisureMinimum]);

  const canComplete = totals.incomeValue > 0 && totals.totalBudget > 0;

  const handleComplete = () => {
    if (!canComplete) {
      toast({ title: 'Preencha renda e orcamento minimo', variant: 'destructive' });
      return;
    }

    onComplete({
      month_year: getMonthYear(),
      income: totals.incomeValue,
      essentials_total: totals.essentialsValue,
      critical_bills: totals.criticalValue,
      minimum_debts: totals.debtsValue,
      leisure_minimum: totals.leisureValue,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center p-10 text-sm text-muted-foreground">
        Carregando orcamento minimo...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="glass-card border-primary/10">
        <CardContent className="p-4 text-sm text-muted-foreground">
          Defina o minimo necessario para viver nos proximos 30 dias. O foco aqui e clareza.
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card/50 border-primary/10">
          <CardContent className="pt-5 space-y-3">
            <p className="text-xs uppercase text-muted-foreground">Renda mensal</p>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                R$
              </span>
              <Input
                value={income}
                onChange={(event) => setIncome(sanitizeCurrencyInput(event.target.value))}
                inputMode="decimal"
                className="bg-background pl-9"
                placeholder="0,00"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Baseado no Dia 2 (entradas de renda).
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-primary/10">
          <CardContent className="pt-5 space-y-3">
            <p className="text-xs uppercase text-muted-foreground">Essenciais fixas</p>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                R$
              </span>
              <Input
                value={essentialsTotal}
                onChange={(event) => setEssentialsTotal(sanitizeCurrencyInput(event.target.value))}
                inputMode="decimal"
                className="bg-background pl-9"
                placeholder="0,00"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Despesas fixas do Dia 2 (aluguel, contas, etc).
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card/50 border-warning/20">
          <CardContent className="pt-5 space-y-3">
            <p className="text-xs uppercase text-muted-foreground">Contas criticas</p>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                R$
              </span>
              <Input
                value={criticalBills}
                onChange={(event) => setCriticalBills(sanitizeCurrencyInput(event.target.value))}
                inputMode="decimal"
                className="bg-background pl-9"
                placeholder="0,00"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Itens marcados como essenciais no Dia 7.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-primary/10">
          <CardContent className="pt-5 space-y-3">
            <p className="text-xs uppercase text-muted-foreground">Minimo para dividas</p>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                R$
              </span>
              <Input
                value={minimumDebts}
                onChange={(event) => setMinimumDebts(sanitizeCurrencyInput(event.target.value))}
                inputMode="decimal"
                className="bg-background pl-9"
                placeholder="0,00"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Parcelas minimas das dividas.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-primary/10">
          <CardContent className="pt-5 space-y-3">
            <p className="text-xs uppercase text-muted-foreground">Lazer minimo</p>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                R$
              </span>
              <Input
                value={leisureMinimum}
                onChange={(event) => setLeisureMinimum(sanitizeCurrencyInput(event.target.value))}
                inputMode="decimal"
                className="bg-background pl-9"
                placeholder="0,00"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Um valor minimo para descanso sem culpa.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-primary/10">
        <CardContent className="p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Orcamento minimo</span>
            <span className="font-semibold">{formatCurrency(totals.totalBudget)}</span>
          </div>
          <div className="flex justify-between">
            <span>Renda mensal</span>
            <span className="font-semibold">{formatCurrency(totals.incomeValue)}</span>
          </div>
          <div className="flex justify-between">
            <span>Gap</span>
            <span className={totals.gap >= 0 ? 'text-emerald-500' : 'text-red-500'}>
              {totals.gap >= 0 ? formatCurrency(totals.gap) : `-${formatCurrency(Math.abs(totals.gap))}`}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {totals.gap >= 0
              ? 'Cabe no orcamento minimo.'
              : 'Nao cabe no orcamento minimo. Ajuste cortes ou dividas.'}
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleComplete} className="btn-fire" disabled={!canComplete}>
          Concluir Dia 9
        </Button>
      </div>
    </div>
  );
};

export default Day9MinimumBudget;
