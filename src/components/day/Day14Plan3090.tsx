import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn, formatCurrency } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Day14Plan3090Props {
  onComplete: (values: Record<string, unknown>) => void;
  defaultValues?: Record<string, unknown>;
}

type PlanMode = 'emergencia' | 'equilibrar' | 'tracao';

interface BudgetRow {
  income: number | null;
  gap: number | null;
}

const MODE_OPTIONS: { value: PlanMode; label: string; description: string }[] = [
  {
    value: 'emergencia',
    label: 'Modo Emergencia',
    description: 'Foco 100% no basico, sem gastos nao essenciais.',
  },
  {
    value: 'equilibrar',
    label: 'Modo Equilibrar',
    description: 'Manter o basico e reduzir dividas com cuidado.',
  },
  {
    value: 'tracao',
    label: 'Modo Tracao',
    description: 'Comecar a criar sobra e acelerar a reserva.',
  },
];

const splitLines = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

const joinLines = (value?: string[] | null) => (value && value.length > 0 ? value.join('\n') : '');

const Day14Plan3090: React.FC<Day14Plan3090Props> = ({ onComplete, defaultValues }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<PlanMode | null>(null);
  const [goals30, setGoals30] = useState('');
  const [goals60, setGoals60] = useState('');
  const [goals90, setGoals90] = useState('');
  const [commitment, setCommitment] = useState('');
  const [budget, setBudget] = useState<BudgetRow | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        if (defaultValues && Object.keys(defaultValues).length > 0) {
          if (defaultValues.goals_30) setGoals30(joinLines(defaultValues.goals_30 as string[]));
          if (defaultValues.goals_60) setGoals60(joinLines(defaultValues.goals_60 as string[]));
          if (defaultValues.goals_90) setGoals90(joinLines(defaultValues.goals_90 as string[]));
          if (defaultValues.mode) setMode(defaultValues.mode as PlanMode);
          if (defaultValues.commitment_phrase) setCommitment(String(defaultValues.commitment_phrase));
          setLoading(false);
          return;
        }

        const [{ data: plan }, { data: budgetRow }] = await Promise.all([
          supabase.from('plan_306090').select('goals_30, goals_60, goals_90').eq('user_id', user.id).maybeSingle(),
          supabase
            .from('monthly_budget')
            .select('income, gap')
            .eq('user_id', user.id)
            .order('month_year', { ascending: false })
            .limit(1)
            .maybeSingle(),
        ]);

        if (plan) {
          setGoals30(joinLines(plan.goals_30));
          setGoals60(joinLines(plan.goals_60));
          setGoals90(joinLines(plan.goals_90));
        }

        if (budgetRow) {
          setBudget(budgetRow as BudgetRow);
          const gap = Number((budgetRow as BudgetRow).gap || 0);
          if (gap < 0) setMode('emergencia');
          if (gap === 0) setMode('equilibrar');
          if (gap > 0) setMode('tracao');
        }
      } catch (error) {
        console.error('Erro ao carregar Dia 14', error);
        toast({ title: 'Erro ao carregar plano 30/90', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [defaultValues, user?.id]);

  const canComplete = splitLines(goals30).length > 0 && splitLines(goals90).length > 0;

  const handleComplete = () => {
    if (!canComplete) {
      toast({ title: 'Defina pelo menos 1 meta de 30 e 90 dias', variant: 'destructive' });
      return;
    }

    onComplete({
      goals_30: splitLines(goals30),
      goals_60: splitLines(goals60),
      goals_90: splitLines(goals90),
      mode,
      commitment_phrase: commitment.trim(),
    });
  };

  const budgetLabel = useMemo(() => {
    if (!budget) return null;
    const gap = Number(budget.gap || 0);
    return gap >= 0
      ? `Sobra estimada: ${formatCurrency(gap)}`
      : `Falta estimada: ${formatCurrency(Math.abs(gap))}`;
  }, [budget]);

  if (loading) {
    return (
      <div className="flex justify-center p-10 text-sm text-muted-foreground">
        Carregando plano 30/90...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="glass-card border-primary/10">
        <CardContent className="p-4 text-sm text-muted-foreground space-y-1">
          <p>Defina metas simples e realistas para 30 e 90 dias.</p>
          {budgetLabel && <p>{budgetLabel}</p>}
        </CardContent>
      </Card>

      <Card className="glass-card border-border/60">
        <CardContent className="p-4 space-y-3">
          <p className="text-xs uppercase text-muted-foreground">Modo de operacao</p>
          <div className="grid gap-2 md:grid-cols-3">
            {MODE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMode(option.value)}
                className={cn(
                  'rounded-lg border p-3 text-left text-sm transition-colors',
                  mode === option.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border/60 hover:bg-muted/40'
                )}
              >
                <p className="font-semibold">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-border/60">
        <CardContent className="p-4 space-y-3">
          <p className="text-xs uppercase text-muted-foreground">Metas 30 dias</p>
          <Textarea
            value={goals30}
            onChange={(event) => setGoals30(event.target.value)}
            placeholder="Uma meta por linha (ex: Pagar aluguel em dia)"
            rows={4}
            className="bg-background"
          />
        </CardContent>
      </Card>

      <Card className="glass-card border-border/60">
        <CardContent className="p-4 space-y-3">
          <p className="text-xs uppercase text-muted-foreground">Metas 60 dias</p>
          <Textarea
            value={goals60}
            onChange={(event) => setGoals60(event.target.value)}
            placeholder="Metas intermediarias (opcional)"
            rows={3}
            className="bg-background"
          />
        </CardContent>
      </Card>

      <Card className="glass-card border-border/60">
        <CardContent className="p-4 space-y-3">
          <p className="text-xs uppercase text-muted-foreground">Metas 90 dias</p>
          <Textarea
            value={goals90}
            onChange={(event) => setGoals90(event.target.value)}
            placeholder="Uma meta por linha (ex: Reduzir juros totais)"
            rows={4}
            className="bg-background"
          />
        </CardContent>
      </Card>

      <Card className="glass-card border-primary/10">
        <CardContent className="p-4 space-y-3">
          <p className="text-xs uppercase text-muted-foreground">Frase de compromisso</p>
          <Textarea
            value={commitment}
            onChange={(event) => setCommitment(event.target.value)}
            placeholder="Ex: Vou seguir esse plano com foco nos proximos 90 dias"
            rows={2}
            className="bg-background"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="btn-fire" onClick={handleComplete} disabled={!canComplete}>
          Concluir Dia 14
        </Button>
      </div>
    </div>
  );
};

export default Day14Plan3090;
