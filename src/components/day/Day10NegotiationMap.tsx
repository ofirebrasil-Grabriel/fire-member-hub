import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { cn, formatCurrency } from '@/lib/utils';

interface Day10NegotiationMapProps {
  onComplete: (values: Record<string, unknown>) => void;
  defaultValues?: Record<string, unknown>;
}

interface DebtRow {
  id: string;
  creditor: string;
  type: string | null;
  installment_value: number | null;
  total_balance: number | null;
  status: string | null;
  is_critical: boolean | null;
}

interface BudgetRow {
  income: number | null;
  essentials: Record<string, number> | null;
  minimum_debts: number | null;
  gap: number | null;
}

type DebtStatus = 'current' | 'overdue' | 'negative';
type DebtPriority = 'high' | 'medium' | 'low';
type DebtObjective =
  | 'discount_lump_sum'
  | 'reduce_interest'
  | 'extend_term'
  | 'pause'
  | 'installment';

interface NegotiationDebt {
  localId: string;
  serverId?: string;
  creditor: string;
  debtType: string;
  totalAmount: string;
  interestRate: string;
  installmentValue: string;
  status: DebtStatus;
  priority: DebtPriority;
  objective: DebtObjective;
  maxMonthly: string;
  maxTerm: string;
  minDiscount: string;
  script: string;
  scheduleDate: string;
  scheduleTime: string;
}

const DEBT_TYPES = [
  { value: 'card', label: 'Cartao' },
  { value: 'loan', label: 'Emprestimo' },
  { value: 'financing', label: 'Financiamento' },
  { value: 'overdraft', label: 'Cheque especial' },
  { value: 'other', label: 'Outro' },
];

const STATUS_OPTIONS: { value: DebtStatus; label: string }[] = [
  { value: 'current', label: 'Em dia' },
  { value: 'overdue', label: 'Atrasada' },
  { value: 'negative', label: 'Negativada' },
];

const PRIORITY_OPTIONS: { value: DebtPriority; label: string }[] = [
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Media' },
  { value: 'low', label: 'Baixa' },
];

const OBJECTIVE_OPTIONS: { value: DebtObjective; label: string }[] = [
  { value: 'discount_lump_sum', label: 'Desconto a vista' },
  { value: 'reduce_interest', label: 'Reduzir juros' },
  { value: 'extend_term', label: 'Alongar prazo' },
  { value: 'pause', label: 'Pausar cobranca' },
  { value: 'installment', label: 'Parcelar com juros menores' },
];

const ANTI_FRAUD_CHECKLIST = [
  { value: 'official_channel', label: 'Usar apenas canais oficiais' },
  { value: 'no_upfront', label: 'Nunca pagar adiantado para "liberar"' },
  { value: 'verify_boleto', label: 'Conferir boleto no app do banco' },
  { value: 'record_call', label: 'Anotar todas as conversas' },
];

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
const sanitizePercentInput = (value: string) => value.replace(/[^\d.,]/g, '');

const buildDefaultScript = (
  debt: NegotiationDebt,
  maxEntry: string,
  maxInstallment: string
) => {
  const creditor = debt.creditor || 'credor';
  return [
    `1. ABERTURA`,
    `Bom dia, meu nome e [SEU NOME]. Gostaria de renegociar minha divida com ${creditor}.`,
    ``,
    `2. CONTEXTO`,
    `Reorganizei meu orcamento e quero regularizar minha situacao.`,
    ``,
    `3. PROPOSTA`,
    `Consigo pagar ate R$ ${maxInstallment || '0'} por mes, ou R$ ${maxEntry || '0'} a vista.`,
    ``,
    `4. PERGUNTAS`,
    `- Qual o valor total com desconto?`,
    `- Qual a taxa do parcelamento?`,
    `- Posso receber a proposta por escrito?`,
    ``,
    `5. FECHAMENTO`,
    `Posso analisar e retornar em 24 horas?`,
  ].join('\n');
};

const Day10NegotiationMap: React.FC<Day10NegotiationMapProps> = ({ onComplete, defaultValues }) => {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(true);
  const [debts, setDebts] = useState<NegotiationDebt[]>([]);
  const [maxEntry, setMaxEntry] = useState('');
  const [maxInstallment, setMaxInstallment] = useState('');
  const [antiFraud, setAntiFraud] = useState<string[]>([]);
  const [budget, setBudget] = useState<BudgetRow | null>(null);

  const [newCreditor, setNewCreditor] = useState('');
  const [newTotalAmount, setNewTotalAmount] = useState('');
  const [newInstallment, setNewInstallment] = useState('');

  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        if (defaultValues && Object.keys(defaultValues).length > 0) {
          setMaxEntry(String(defaultValues.max_entry ?? ''));
          setMaxInstallment(String(defaultValues.max_installment ?? ''));
          setAntiFraud(Array.isArray(defaultValues.anti_fraud_check) ? defaultValues.anti_fraud_check as string[] : []);
          if (Array.isArray(defaultValues.debts)) {
            const savedDebts = (defaultValues.debts as Array<Record<string, unknown>>).map((debt, index) => ({
              localId: `saved-${index}`,
              creditor: String(debt.creditor || ''),
              debtType: String(debt.debtType || 'other'),
              totalAmount: String(debt.totalAmount || ''),
              interestRate: String(debt.interestRate || ''),
              installmentValue: String(debt.installmentValue || ''),
              status: (debt.status as DebtStatus) || 'overdue',
              priority: (debt.priority as DebtPriority) || 'medium',
              objective: (debt.objective as DebtObjective) || 'installment',
              maxMonthly: String(debt.maxMonthly || ''),
              maxTerm: String(debt.maxTerm || ''),
              minDiscount: String(debt.minDiscount || ''),
              script: String(debt.script || ''),
              scheduleDate: String(debt.scheduleDate || ''),
              scheduleTime: String(debt.scheduleTime || ''),
            }));
            setDebts(savedDebts);
          }
          setLoading(false);
          return;
        }

        const [
          { data: debtRows, error: debtError },
          { data: budgetRows, error: budgetError },
        ] = await Promise.all([
          supabase
            .from('debts')
            .select('id, creditor, type, installment_value, total_balance, status, is_critical')
            .eq('user_id', user.id)
            .neq('status', 'paid'),
          supabase
            .from('monthly_budget')
            .select('income, essentials, minimum_debts, gap')
            .eq('user_id', user.id)
            .order('month_year', { ascending: false })
            .limit(1)
            .maybeSingle(),
        ]);

        if (debtError) throw debtError;
        if (budgetError) throw budgetError;

        const mappedDebts = (debtRows as DebtRow[] | null || []).map((debt) => {
          const priority: DebtPriority = debt.is_critical ? 'high' : 'medium';
          return {
            localId: `debt-${debt.id}`,
            serverId: debt.id,
            creditor: debt.creditor || '',
            debtType: debt.type || 'other',
            totalAmount: debt.total_balance ? String(debt.total_balance) : '',
            interestRate: '',
            installmentValue: debt.installment_value ? String(debt.installment_value) : '',
            status: (debt.status === 'paid' ? 'current' : debt.status === 'negotiating' ? 'overdue' : 'overdue') as DebtStatus,
            priority,
            objective: 'installment' as DebtObjective,
            maxMonthly: '',
            maxTerm: '12',
            minDiscount: '30',
            script: '',
            scheduleDate: '',
            scheduleTime: '',
          };
        });

        setDebts(mappedDebts);
        if (budgetRows) {
          setBudget(budgetRows as BudgetRow);
          const gapValue = Number((budgetRows as BudgetRow).gap || 0);
          if (gapValue > 0) {
            setMaxInstallment(String(gapValue));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar Dia 10', error);
        toast({ title: 'Erro ao carregar dados do Dia 10', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [defaultValues, user?.id]);

  const totals = useMemo(() => {
    const totalDebt = debts.reduce((sum, debt) => sum + parseAmount(debt.totalAmount), 0);
    return { totalDebt };
  }, [debts]);

  const updateDebt = (localId: string, updates: Partial<NegotiationDebt>) => {
    setDebts((prev) =>
      prev.map((debt) => {
        if (debt.localId !== localId) return debt;
        const next = { ...debt, ...updates };
        if (updates.priority === 'high') {
          next.status = next.status || 'overdue';
        }
        return next;
      })
    );
  };

  const handleAddDebt = () => {
    if (!newCreditor.trim()) {
      toast({ title: 'Informe o credor', variant: 'destructive' });
      return;
    }
    const newDebt: NegotiationDebt = {
      localId: `manual-${Date.now()}`,
      creditor: newCreditor.trim(),
      debtType: 'other',
      totalAmount: newTotalAmount.trim(),
      interestRate: '',
      installmentValue: newInstallment.trim(),
      status: 'overdue',
      priority: 'medium',
      objective: 'installment',
      maxMonthly: '',
      maxTerm: '12',
      minDiscount: '30',
      script: '',
      scheduleDate: '',
      scheduleTime: '',
    };
    setDebts((prev) => [...prev, newDebt]);
    setNewCreditor('');
    setNewTotalAmount('');
    setNewInstallment('');
  };

  const canProceedStep1 = debts.length > 0 && debts.every((debt) => debt.creditor.trim() && parseAmount(debt.totalAmount) > 0);
  const canProceedStep2 = parseAmount(maxInstallment) > 0;
  const canProceedStep3 = debts.every((debt) => parseAmount(debt.maxMonthly || '') > 0);

  const handleGenerateScripts = () => {
    setDebts((prev) =>
      prev.map((debt) => ({
        ...debt,
        script: debt.script || buildDefaultScript(debt, maxEntry, maxInstallment),
      }))
    );
  };

  const handleComplete = () => {
    if (!canProceedStep3) {
      toast({ title: 'Preencha objetivos de negociacao', variant: 'destructive' });
      return;
    }

    onComplete({
      max_entry: parseAmount(maxEntry),
      max_installment: parseAmount(maxInstallment),
      anti_fraud_check: antiFraud,
      debts: debts.map((debt) => ({
        creditor: debt.creditor,
        debtType: debt.debtType,
        totalAmount: parseAmount(debt.totalAmount),
        interestRate: parseAmount(debt.interestRate),
        installmentValue: parseAmount(debt.installmentValue),
        status: debt.status,
        priority: debt.priority,
        objective: debt.objective,
        maxMonthly: parseAmount(debt.maxMonthly),
        maxTerm: Number(debt.maxTerm || 0),
        minDiscount: parseAmount(debt.minDiscount),
        script: debt.script,
        scheduleDate: debt.scheduleDate || null,
        scheduleTime: debt.scheduleTime || null,
      })),
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center p-10 text-sm text-muted-foreground">
        Carregando mapa de negociacao...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((value) => (
          <div
            key={value}
            className={cn(
              'flex-1 rounded-full h-1.5',
              step >= value ? 'bg-primary' : 'bg-muted'
            )}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <Card className="glass-card p-4">
            <h3 className="text-lg font-semibold">Passo 1: Suas dividas em um so lugar</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Revise, ajuste valores e marque prioridades.
            </p>

            <div className="mt-4 space-y-3">
              {debts.map((debt) => (
                <div key={debt.localId} className="rounded-lg border border-border/60 p-3 space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      value={debt.creditor}
                      onChange={(event) => updateDebt(debt.localId, { creditor: event.target.value })}
                      placeholder="Credor"
                      className="bg-background"
                    />
                    <Select
                      value={debt.debtType}
                      onValueChange={(value) => updateDebt(debt.localId, { debtType: value })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEBT_TYPES.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <Input
                      value={debt.totalAmount}
                      onChange={(event) =>
                        updateDebt(debt.localId, { totalAmount: sanitizeCurrencyInput(event.target.value) })
                      }
                      placeholder="Valor total (R$)"
                      className="bg-background"
                      inputMode="decimal"
                    />
                    <Input
                      value={debt.interestRate}
                      onChange={(event) =>
                        updateDebt(debt.localId, { interestRate: sanitizePercentInput(event.target.value) })
                      }
                      placeholder="Juros ao mes (%)"
                      className="bg-background"
                      inputMode="decimal"
                    />
                    <Input
                      value={debt.installmentValue}
                      onChange={(event) =>
                        updateDebt(debt.localId, { installmentValue: sanitizeCurrencyInput(event.target.value) })
                      }
                      placeholder="Parcela atual (R$)"
                      className="bg-background"
                      inputMode="decimal"
                    />
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <Select
                      value={debt.status}
                      onValueChange={(value) =>
                        updateDebt(debt.localId, { status: value as DebtStatus })
                      }
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={debt.priority}
                      onValueChange={(value) =>
                        updateDebt(debt.localId, { priority: value as DebtPriority })
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
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Input
                value={newCreditor}
                onChange={(event) => setNewCreditor(event.target.value)}
                placeholder="Novo credor"
                className="bg-background"
              />
              <Input
                value={newTotalAmount}
                onChange={(event) => setNewTotalAmount(sanitizeCurrencyInput(event.target.value))}
                placeholder="Valor total (R$)"
                className="bg-background"
              />
              <Input
                value={newInstallment}
                onChange={(event) => setNewInstallment(sanitizeCurrencyInput(event.target.value))}
                placeholder="Parcela atual (R$)"
                className="bg-background"
              />
            </div>
            <div className="mt-3 flex justify-end">
              <Button variant="outline" onClick={handleAddDebt}>
                Adicionar divida
              </Button>
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
              Total mapeado: {formatCurrency(totals.totalDebt)}
            </div>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => setStep(2)} disabled={!canProceedStep1}>
              Continuar
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Card className="glass-card p-4 space-y-4">
            <h3 className="text-lg font-semibold">Passo 2: Limites de pagamento</h3>
            <p className="text-sm text-muted-foreground">
              Use o orcamento minimo do Dia 9 como referencia.
            </p>

            {budget && (
              <div className="rounded-lg border border-border/60 p-3 text-xs text-muted-foreground">
                <p>Renda: {formatCurrency(Number(budget.income || 0))}</p>
                <p>Gap: {formatCurrency(Number(budget.gap || 0))}</p>
              </div>
            )}

            <div className="grid gap-3 md:grid-cols-2">
              <Input
                value={maxInstallment}
                onChange={(event) => setMaxInstallment(sanitizeCurrencyInput(event.target.value))}
                placeholder="Parcela maxima mensal (R$)"
                className="bg-background"
                inputMode="decimal"
              />
              <Input
                value={maxEntry}
                onChange={(event) => setMaxEntry(sanitizeCurrencyInput(event.target.value))}
                placeholder="Entrada disponivel (R$)"
                className="bg-background"
                inputMode="decimal"
              />
            </div>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              Voltar
            </Button>
            <Button onClick={() => setStep(3)} disabled={!canProceedStep2}>
              Continuar
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <Card className="glass-card p-4 space-y-4">
            <h3 className="text-lg font-semibold">Passo 3: Objetivos e roteiros</h3>
            <p className="text-sm text-muted-foreground">
              Defina objetivo e limite por divida. Gere um roteiro base.
            </p>

            <div className="space-y-4">
              {debts.map((debt) => (
                <div key={debt.localId} className="rounded-lg border border-border/60 p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{debt.creditor}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatCurrency(parseAmount(debt.totalAmount))}
                    </span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <Select
                      value={debt.objective}
                      onValueChange={(value) =>
                        updateDebt(debt.localId, { objective: value as DebtObjective })
                      }
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Objetivo" />
                      </SelectTrigger>
                      <SelectContent>
                        {OBJECTIVE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={debt.maxMonthly}
                      onChange={(event) =>
                        updateDebt(debt.localId, { maxMonthly: sanitizeCurrencyInput(event.target.value) })
                      }
                      placeholder="Max mensal (R$)"
                      className="bg-background"
                      inputMode="decimal"
                    />
                    <Input
                      value={debt.maxTerm}
                      onChange={(event) =>
                        updateDebt(debt.localId, { maxTerm: event.target.value })
                      }
                      placeholder="Prazo max (meses)"
                      className="bg-background"
                    />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      value={debt.minDiscount}
                      onChange={(event) =>
                        updateDebt(debt.localId, { minDiscount: sanitizePercentInput(event.target.value) })
                      }
                      placeholder="Desconto minimo (%)"
                      className="bg-background"
                      inputMode="decimal"
                    />
                    <div className="grid gap-3 md:grid-cols-2">
                      <Input
                        type="date"
                        value={debt.scheduleDate}
                        onChange={(event) =>
                          updateDebt(debt.localId, { scheduleDate: event.target.value })
                        }
                        className="bg-background"
                      />
                      <Input
                        type="time"
                        value={debt.scheduleTime}
                        onChange={(event) =>
                          updateDebt(debt.localId, { scheduleTime: event.target.value })
                        }
                        className="bg-background"
                      />
                    </div>
                  </div>
                  <Textarea
                    value={debt.script}
                    onChange={(event) =>
                      updateDebt(debt.localId, { script: event.target.value })
                    }
                    placeholder="Roteiro de negociacao"
                    className="bg-background"
                    rows={4}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={handleGenerateScripts}>
                Gerar roteiros base
              </Button>
            </div>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              Voltar
            </Button>
            <Button onClick={() => setStep(4)} disabled={!canProceedStep3}>
              Continuar
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <Card className="glass-card p-4 space-y-4">
            <h3 className="text-lg font-semibold">Passo 4: Checklist anti-golpe</h3>
            <p className="text-sm text-muted-foreground">
              Garanta que toda negociacao seja segura.
            </p>

            <div className="space-y-2">
              {ANTI_FRAUD_CHECKLIST.map((item) => (
                <label key={item.value} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={antiFraud.includes(item.value)}
                    onCheckedChange={(checked) => {
                      setAntiFraud((prev) => {
                        if (checked) return [...prev, item.value];
                        return prev.filter((value) => value !== item.value);
                      });
                    }}
                  />
                  {item.label}
                </label>
              ))}
            </div>

            <div className="rounded-lg border border-border/60 p-3 text-xs text-muted-foreground">
              <p>Dividas mapeadas: {debts.length}</p>
              <p>Entrada maxima: {formatCurrency(parseAmount(maxEntry))}</p>
              <p>Parcela maxima: {formatCurrency(parseAmount(maxInstallment))}</p>
            </div>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(3)}>
              Voltar
            </Button>
            <Button className="btn-fire" onClick={handleComplete}>
              Concluir Dia 10
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Day10NegotiationMap;
