import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Day15GraduationProps {
  onComplete: (values: Record<string, unknown>) => void;
  defaultValues?: Record<string, unknown>;
}

const WEEKDAYS = [
  { value: '0', label: 'Domingo' },
  { value: '1', label: 'Segunda' },
  { value: '2', label: 'Terca' },
  { value: '3', label: 'Quarta' },
  { value: '4', label: 'Quinta' },
  { value: '5', label: 'Sexta' },
  { value: '6', label: 'Sabado' },
];

const CHECKLIST_ITEMS = [
  { value: 'review_calendar', label: 'Revisar vencimentos da semana' },
  { value: 'check_balance', label: 'Conferir saldo das contas' },
  { value: 'update_debts', label: 'Atualizar status das dividas' },
  { value: 'review_budget', label: 'Revisar orcamento' },
  { value: 'plan_week', label: 'Planejar gastos da semana' },
  { value: 'celebrate', label: 'Celebrar pequenas vitorias' },
];

type DailyLogRow = {
  day_number: number | null;
  breathe_score: number | null;
  breathe_reason: string | null;
};

const Day15Graduation: React.FC<Day15GraduationProps> = ({ onComplete, defaultValues }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [mainGoal, setMainGoal] = useState('');
  const [baselineScore, setBaselineScore] = useState<number | null>(null);
  const [baselineReason, setBaselineReason] = useState('');
  const [finalScore, setFinalScore] = useState(6);
  const [finalReason, setFinalReason] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [checklist, setChecklist] = useState<string[]>([]);
  const [nextCommitment, setNextCommitment] = useState('');

  useEffect(() => {
    if (!defaultValues) return;
    if (defaultValues.day_of_week !== undefined) setDayOfWeek(String(defaultValues.day_of_week));
    if (Array.isArray(defaultValues.checklist)) setChecklist(defaultValues.checklist as string[]);
    if (defaultValues.next_commitment) setNextCommitment(String(defaultValues.next_commitment));
    if (defaultValues.breathe_score !== undefined) setFinalScore(Number(defaultValues.breathe_score));
    if (defaultValues.breathe_reason) setFinalReason(String(defaultValues.breathe_reason));
  }, [defaultValues]);

  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [{ data: assessment }, { data: logs }] = await Promise.all([
          supabase
            .from('initial_assessment')
            .select('main_goal')
            .eq('user_id', user.id)
            .maybeSingle(),
          supabase
            .from('daily_log')
            .select('day_number, breathe_score, breathe_reason')
            .eq('user_id', user.id)
            .in('day_number', [1, 15]),
        ]);

        if (assessment?.main_goal) setMainGoal(String(assessment.main_goal));

        const rows = (logs || []) as DailyLogRow[];
        const day1 = rows.find((row) => row.day_number === 1);
        const day15 = rows.find((row) => row.day_number === 15);
        const hasDefaultScore = defaultValues
          ? Object.prototype.hasOwnProperty.call(defaultValues, 'breathe_score')
          : false;
        const hasDefaultReason = defaultValues
          ? Object.prototype.hasOwnProperty.call(defaultValues, 'breathe_reason')
          : false;

        if (day1?.breathe_score !== null && day1?.breathe_score !== undefined) {
          setBaselineScore(Number(day1.breathe_score));
        }
        if (day1?.breathe_reason) setBaselineReason(day1.breathe_reason);

        if (!hasDefaultScore && day15?.breathe_score !== null && day15?.breathe_score !== undefined) {
          setFinalScore(Number(day15.breathe_score));
        }
        if (!hasDefaultReason && day15?.breathe_reason) {
          setFinalReason(day15.breathe_reason);
        }
      } catch (error) {
        console.error('Erro ao carregar Dia 15', error);
        toast({ title: 'Erro ao carregar dados finais', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [defaultValues, user?.id]);

  const scoreDelta = useMemo(() => {
    if (baselineScore === null) return null;
    return finalScore - baselineScore;
  }, [baselineScore, finalScore]);

  const certificateName = useMemo(() => {
    const metadata = user?.user_metadata as { full_name?: string; name?: string } | undefined;
    return metadata?.full_name || metadata?.name || user?.email || 'Voce';
  }, [user?.email, user?.user_metadata]);

  const canComplete = Boolean(dayOfWeek) && checklist.length > 0 && finalReason.trim().length > 0;

  const handleComplete = () => {
    if (!dayOfWeek) {
      toast({ title: 'Escolha o dia do ritual semanal', variant: 'destructive' });
      return;
    }
    if (checklist.length === 0) {
      toast({ title: 'Selecione pelo menos 1 item do ritual', variant: 'destructive' });
      return;
    }
    if (!finalReason.trim()) {
      toast({ title: 'Conte em 1 frase como voce se sente hoje', variant: 'destructive' });
      return;
    }

    onComplete({
      day_of_week: dayOfWeek,
      checklist,
      next_commitment: nextCommitment.trim(),
      breathe_score: finalScore,
      breathe_reason: finalReason.trim(),
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center p-10 text-sm text-muted-foreground">
        Carregando formatura...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="glass-card border-primary/10">
        <CardContent className="p-4 space-y-3 text-sm text-muted-foreground">
          <p>Voce chegou ate aqui. Agora vamos registrar seu ritual e fechar com clareza.</p>
          {mainGoal && <p>Seu objetivo principal: <span className="text-foreground">{mainGoal}</span></p>}
        </CardContent>
      </Card>

      <Card className="glass-card border-border/60">
        <CardContent className="p-4 space-y-4">
          <p className="text-xs uppercase text-muted-foreground">Retrospectiva do termometro</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border/60 p-3">
              <p className="text-xs text-muted-foreground">Dia 1</p>
              <p className="text-2xl font-semibold">{baselineScore !== null ? baselineScore : '—'}</p>
              {baselineReason && <p className="text-xs text-muted-foreground">{baselineReason}</p>}
            </div>
            <div className="rounded-lg border border-border/60 p-3">
              <p className="text-xs text-muted-foreground">Dia 15</p>
              <p className="text-2xl font-semibold">{finalScore}</p>
              {scoreDelta !== null && (
                <p className="text-xs text-muted-foreground">
                  {scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta} pontos vs Dia 1
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase text-muted-foreground">Como voce se sente hoje?</p>
            <Slider
              value={[finalScore]}
              onValueChange={(value) => setFinalScore(value[0] ?? finalScore)}
              min={0}
              max={10}
              step={1}
            />
            <Textarea
              value={finalReason}
              onChange={(event) => setFinalReason(event.target.value)}
              placeholder="Descreva em 1 frase como voce esta agora"
              rows={2}
              className="bg-background"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-border/60">
        <CardContent className="p-4 space-y-4">
          <p className="text-xs uppercase text-muted-foreground">Ritual semanal FIRE</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Dia do ritual</p>
              <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Selecione o dia" />
                </SelectTrigger>
                <SelectContent>
                  {WEEKDAYS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Compromisso</p>
              <Input
                value={nextCommitment}
                onChange={(event) => setNextCommitment(event.target.value)}
                placeholder="Ex: Toda segunda as 20h"
                className="bg-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Checklist do ritual</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {CHECKLIST_ITEMS.map((item) => (
                <label key={item.value} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={checklist.includes(item.value)}
                    onCheckedChange={(checked) => {
                      setChecklist((prev) => {
                        if (checked) return [...prev, item.value];
                        return prev.filter((value) => value !== item.value);
                      });
                    }}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-primary/10">
        <CardContent className="p-4 space-y-3">
          <p className="text-xs uppercase text-muted-foreground">Certificado FIRE</p>
          <div className="rounded-lg border border-border/60 p-3 text-sm">
            <p className="text-muted-foreground">Concluinte</p>
            <p className="text-lg font-semibold">{certificateName}</p>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="btn-fire" onClick={handleComplete} disabled={!canComplete}>
          Concluir Dia 15
        </Button>
      </div>
    </div>
  );
};

export default Day15Graduation;
