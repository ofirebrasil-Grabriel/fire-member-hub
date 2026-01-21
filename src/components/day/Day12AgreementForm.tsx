import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { useAgreements } from '@/hooks/useAgreements';

interface Day12AgreementFormProps {
  onComplete: (values: Record<string, unknown>) => void;
  defaultValues?: Record<string, unknown>;
}

interface DebtRow {
  id: string;
  creditor: string;
  total_balance: number | null;
  installment_value: number | null;
}

const sanitizeCurrencyInput = (value: string) => value.replace(/[^\d.,]/g, '');
const sanitizePercentInput = (value: string) => value.replace(/[^\d.,]/g, '');

const parseAmount = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const normalized = trimmed.includes(',')
    ? trimmed.replace(/\./g, '').replace(',', '.')
    : trimmed;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const addMonths = (date: string, months: number) => {
  const base = new Date(date);
  base.setMonth(base.getMonth() + months);
  return base.toISOString().slice(0, 10);
};

const Day12AgreementForm: React.FC<Day12AgreementFormProps> = ({ onComplete, defaultValues }) => {
  const { user } = useAuth();
  const { create } = useAgreements();
  const [loading, setLoading] = useState(true);
  const [debts, setDebts] = useState<DebtRow[]>([]);
  const [selectedDebtId, setSelectedDebtId] = useState<string>('');

  const [creditorName, setCreditorName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [installments, setInstallments] = useState('');
  const [entryAmount, setEntryAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [savings, setSavings] = useState('');
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('debts')
          .select('id, creditor, total_balance, installment_value')
          .eq('user_id', user.id)
          .neq('status', 'paid');

        if (error) throw error;
        setDebts((data as DebtRow[]) || []);

        if (defaultValues) {
          setCreditorName(String(defaultValues.creditor_name || ''));
          setTotalAmount(String(defaultValues.total_amount || ''));
          setMonthlyPayment(String(defaultValues.monthly_payment || ''));
          setInstallments(String(defaultValues.installments || ''));
          setEntryAmount(String(defaultValues.entry_amount || ''));
          setInterestRate(String(defaultValues.interest_rate || ''));
          setSavings(String(defaultValues.savings || ''));
          setStartDate(String(defaultValues.start_date || ''));
          if (defaultValues.debt_id) {
            setSelectedDebtId(String(defaultValues.debt_id));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar acordos', error);
        toast({ title: 'Erro ao carregar dados do Dia 12', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [defaultValues, user?.id]);

  useEffect(() => {
    if (!selectedDebtId) return;
    const debt = debts.find((item) => item.id === selectedDebtId);
    if (!debt) return;
    setCreditorName(debt.creditor);
    if (!totalAmount) setTotalAmount(debt.total_balance ? String(debt.total_balance) : '');
    if (!monthlyPayment) setMonthlyPayment(debt.installment_value ? String(debt.installment_value) : '');
  }, [debts, selectedDebtId, totalAmount, monthlyPayment]);

  const summary = useMemo(() => {
    const total = parseAmount(totalAmount);
    const monthly = parseAmount(monthlyPayment);
    const count = Number(installments || 0);
    const totalPaid = monthly * count;
    return {
      total,
      monthly,
      count,
      totalPaid,
    };
  }, [totalAmount, monthlyPayment, installments]);

  const canComplete =
    creditorName.trim().length > 0 &&
    summary.total > 0 &&
    summary.monthly > 0 &&
    summary.count > 0 &&
    Boolean(startDate);

  const handleComplete = async () => {
    if (!canComplete) {
      toast({ title: 'Preencha os dados do acordo', variant: 'destructive' });
      return;
    }

    const payload = {
      creditor_name: creditorName.trim(),
      total_amount: summary.total,
      monthly_payment: summary.monthly,
      installments: summary.count,
      entry_amount: parseAmount(entryAmount),
      interest_rate: parseAmount(interestRate),
      savings: parseAmount(savings),
      start_date: startDate,
      next_payment_date: startDate,
      end_date: addMonths(startDate, Math.max(summary.count - 1, 0)),
      debt_id: selectedDebtId || null,
    };

    const agreement = await create({
      debt_id: payload.debt_id || null,
      creditor_name: payload.creditor_name,
      total_amount: payload.total_amount,
      monthly_payment: payload.monthly_payment,
      installments: payload.installments,
      entry_amount: payload.entry_amount || 0,
      interest_rate: payload.interest_rate || null,
      savings: payload.savings || null,
      start_date: payload.start_date,
      next_payment_date: payload.next_payment_date,
      end_date: payload.end_date,
    });

    if (!agreement) {
      toast({ title: 'Nao foi possivel salvar o acordo', variant: 'destructive' });
      return;
    }

    onComplete(payload);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-10 text-sm text-muted-foreground">
        Carregando acordo...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="glass-card border-primary/10">
        <CardContent className="p-4 text-sm text-muted-foreground">
          Registre o acordo fechado para manter controle das parcelas e da economia gerada.
        </CardContent>
      </Card>

      <Card className="glass-card border-border/60">
        <CardContent className="p-4 space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Select value={selectedDebtId} onValueChange={setSelectedDebtId}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Vincular a uma divida (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {debts.map((debt) => (
                  <SelectItem key={debt.id} value={debt.id}>
                    {debt.creditor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={creditorName}
              onChange={(event) => setCreditorName(event.target.value)}
              placeholder="Nome do credor"
              className="bg-background"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <Input
              value={totalAmount}
              onChange={(event) => setTotalAmount(sanitizeCurrencyInput(event.target.value))}
              placeholder="Valor total (R$)"
              className="bg-background"
              inputMode="decimal"
            />
            <Input
              value={monthlyPayment}
              onChange={(event) => setMonthlyPayment(sanitizeCurrencyInput(event.target.value))}
              placeholder="Parcela mensal (R$)"
              className="bg-background"
              inputMode="decimal"
            />
            <Input
              value={installments}
              onChange={(event) => setInstallments(event.target.value.replace(/\D/g, ''))}
              placeholder="Numero de parcelas"
              className="bg-background"
              inputMode="numeric"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <Input
              value={entryAmount}
              onChange={(event) => setEntryAmount(sanitizeCurrencyInput(event.target.value))}
              placeholder="Entrada (R$)"
              className="bg-background"
              inputMode="decimal"
            />
            <Input
              value={interestRate}
              onChange={(event) => setInterestRate(sanitizePercentInput(event.target.value))}
              placeholder="Juros (%)"
              className="bg-background"
              inputMode="decimal"
            />
            <Input
              value={savings}
              onChange={(event) => setSavings(sanitizeCurrencyInput(event.target.value))}
              placeholder="Economia (R$)"
              className="bg-background"
              inputMode="decimal"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="bg-background"
            />
            <div className="rounded-lg border border-border/60 p-3 text-xs text-muted-foreground">
              <p>Valor total: {formatCurrency(summary.total)}</p>
              <p>Parcelas: {summary.count}</p>
              <p>Total pago: {formatCurrency(summary.totalPaid)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="btn-fire" onClick={handleComplete} disabled={!canComplete}>
          Concluir Dia 12
        </Button>
      </div>
    </div>
  );
};

export default Day12AgreementForm;
