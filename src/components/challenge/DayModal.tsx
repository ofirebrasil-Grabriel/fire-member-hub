import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Target, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DayInputForm } from '@/components/challenge/DayInputForm';
import { DayModalContent } from '@/components/challenge/DayModalContent';
import { CrudSection, CrudType } from '@/components/challenge/CrudSection';
import { OutputPanel } from '@/components/challenge/OutputPanel';
import { completeDay, getDayConfig, OutputMetricValue } from '@/services/dayEngine';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useDay } from '@/hooks/useDays';

interface DayModalProps {
  dayId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompleted?: (dayId: number, payload?: Record<string, unknown>) => void;
}

type ModalPhase = 'input' | 'crud' | 'output';

export const DayModal = ({ dayId, open, onOpenChange, onCompleted }: DayModalProps) => {
  const { user } = useAuth();
  const { progress } = useUserProgress();
  const config = useMemo(() => getDayConfig(dayId), [dayId]);
  const { day } = useDay(dayId);
  const [phase, setPhase] = useState<ModalPhase>('input');
  const [panel, setPanel] = useState<'conteudo' | 'execucao'>('conteudo');
  const [payload, setPayload] = useState<Record<string, unknown>>({});
  const [metrics, setMetrics] = useState<OutputMetricValue[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!config) return;
    const nextPhase: ModalPhase = config.inputs.length > 0 ? 'input' : config.crudType ? 'crud' : 'output';
    setPhase(nextPhase);
    setPanel('conteudo');
    setPayload({});
    setMetrics([]);
  }, [config, open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  if (!config) return null;
  const displayTitle = day?.title ?? config.title;
  const displaySubtitle = day?.subtitle ?? config.objective;
  const defaultValues = progress.daysProgress[dayId]?.payload;
  const isCompleted = Boolean(progress.daysProgress[dayId]?.completed);

  const handleCompleteDay = async (values: Record<string, unknown>) => {
    if (!user?.id) {
      toast({ title: 'Usuario nao autenticado', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const result = await completeDay(dayId, values, user.id);
      setMetrics(result);
      setPhase('output');
      setPanel('execucao');
      onCompleted?.(dayId, values);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro inesperado';
      toast({ title: 'Erro ao concluir dia', description: message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputSubmit = async (values: Record<string, unknown>) => {
    setPayload(values);

    if (config.crudType) {
      setPhase('crud');
      return;
    }

    await handleCompleteDay(values);
  };

  const handleCrudComplete = async () => {
    await handleCompleteDay(payload);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="modal-overlay"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="modal-content">
              <div className="sticky top-0 z-10 space-y-2 rounded-t-2xl border-b border-border/50 bg-popover/95 p-4 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                      <span className="text-primary">DIA {config.id}</span>
                      <span className="flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-primary">
                        <Clock className="h-3 w-3" />
                        {config.badge}
                      </span>
                      {isCompleted && (
                        <span className="rounded-full bg-success/20 px-2 py-0.5 text-success">
                          Concluido
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-foreground">{displayTitle}</h2>
                  </div>
                  <button
                    onClick={() => onOpenChange(false)}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2 rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">
                    <Target className="mt-0.5 h-4 w-4 text-primary" />
                    <p>{displaySubtitle}</p>
                  </div>

                  <div className="rounded-full bg-surface/70 p-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPanel('conteudo')}
                        className={cn(
                          'flex-1 rounded-full px-3 py-2 text-center transition-colors',
                          panel === 'conteudo' && 'bg-background text-foreground shadow-sm'
                        )}
                      >
                        Tema do dia
                      </button>
                      <button
                        type="button"
                        onClick={() => setPanel('execucao')}
                        className={cn(
                          'flex-1 rounded-full px-3 py-2 text-center transition-colors',
                          panel === 'execucao' && 'bg-background text-foreground shadow-sm'
                        )}
                      >
                        Tarefa do dia
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-body space-y-4">
                {panel === 'conteudo' && (
                  <DayModalContent dayId={dayId} />
                )}

                {panel === 'execucao' && (
                  <>
                    {day?.commitment && (
                      <div className="glass-card p-4">
                        <h4 className="text-sm font-semibold">Seu compromisso</h4>
                        <p className="mt-2 text-sm text-muted-foreground">{day.commitment}</p>
                      </div>
                    )}
                    {phase === 'input' && (
                      <DayInputForm
                        inputs={config.inputs}
                        onSubmit={handleInputSubmit}
                        defaultValues={defaultValues}
                        submitLabel={config.crudType ? 'Continuar' : 'Concluir dia'}
                        isSubmitting={saving}
                      />
                    )}

                    {phase === 'crud' && (
                      <div className="space-y-6">
                        <CrudSection type={config.crudType as CrudType} />
                        <div className="flex justify-end">
                          <Button className="btn-fire" onClick={handleCrudComplete} disabled={saving}>
                            {saving ? 'Salvando...' : 'Concluir dia'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {phase === 'output' && (
                      <OutputPanel metrics={metrics} nextDay={dayId < 15 ? dayId + 1 : null} />
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
