import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Target, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DayInputForm } from '@/components/challenge/DayInputForm';
import { DayModalContent } from '@/components/challenge/DayModalContent';
import { CrudSection, CrudType } from '@/components/challenge/CrudSection';
import { OutputPanel } from '@/components/challenge/OutputPanel';
import { completeDay, getDayConfig, calculateOutputMetrics, OutputMetricValue } from '@/services/dayEngine';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useDay } from '@/hooks/useDays';
import DayTaskTab from '@/components/day/DayTaskTab';
import DayCompletedTab from '@/components/day/DayCompletedTab';
import DayCelebrationModal from '@/components/day/DayCelebrationModal';

interface DayModalProps {
  dayId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompleted?: (dayId: number, payload?: Record<string, unknown>) => void;
  onNavigateToNextDay?: (nextDayId: number) => void;
}

type ModalPhase = 'input' | 'crud' | 'output';

export const DayModal = ({ dayId, open, onOpenChange, onCompleted, onNavigateToNextDay }: DayModalProps) => {
  const { user } = useAuth();
  const { progress } = useUserProgress();
  const config = useMemo(() => getDayConfig(dayId), [dayId]);
  const { day } = useDay(dayId);
  const [phase, setPhase] = useState<ModalPhase>('input');
  const [panel, setPanel] = useState<'conteudo' | 'tarefa' | 'concluido'>('conteudo');
  const [payload, setPayload] = useState<Record<string, unknown>>({});
  const [metrics, setMetrics] = useState<OutputMetricValue[]>([]);
  const [saving, setSaving] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!config || !open) return;

    // Se tiver customComponent, pula direto para a aba de execução
    // Se não, segue a lógica normal
    let nextPhase: ModalPhase;
    if (config.customComponent) {
      nextPhase = 'output'; // Custom components handle their own flow
    } else if (config.inputs.length > 0) {
      nextPhase = 'input';
    } else if (config.crudType) {
      nextPhase = 'crud';
    } else {
      nextPhase = 'output';
    }
    setPhase(nextPhase);

    const isCompleted = Boolean(progress.daysProgress[dayId]?.completed);
    const storedFormData = progress.daysProgress[dayId]?.form_data;

    if (isCompleted && storedFormData && user?.id) {
      setPanel('concluido');
      calculateOutputMetrics(dayId, user.id, storedFormData as Record<string, unknown>)
        .then(setMetrics)
        .catch(err => console.error("Erro ao carregar métricas:", err));
    } else {
      setPanel('conteudo');
      setMetrics([]);
    }

    setPayload({});
  }, [config, open, dayId, user?.id, progress.daysProgress]);

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
  const defaultValues = progress.daysProgress[dayId]?.form_data;
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
      setPanel('concluido');
      setShowCelebration(true);
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
            className="fixed inset-0 z-50 flex items-center justify-center sm:p-4"
          >
            <div className="modal-content flex h-full flex-col sm:h-auto">
              <div className="sticky top-0 z-10 shrink-0 space-y-2 border-b border-border/50 bg-popover/95 p-3 backdrop-blur-sm sm:rounded-t-2xl sm:p-4">
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  <div className="flex-1 space-y-1 sm:space-y-2">
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-medium sm:gap-2 sm:text-xs">
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
                    <h2 className="text-lg font-bold leading-tight text-foreground sm:text-xl">{displayTitle}</h2>
                  </div>
                  <button
                    onClick={() => onOpenChange(false)}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted sm:p-2"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="hidden items-start gap-2 rounded-lg bg-muted/40 p-2 text-xs text-muted-foreground sm:flex sm:p-3 sm:text-sm">
                    <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="line-clamp-2">{displaySubtitle}</p>
                  </div>

                  <div className="rounded-full bg-surface/70 p-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-[11px]">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => setPanel('conteudo')}
                        className={cn(
                          'flex-1 rounded-full px-2 py-1.5 text-center transition-colors sm:px-3 sm:py-2',
                          panel === 'conteudo' && 'bg-background text-foreground shadow-sm'
                        )}
                      >
                        Tema do dia
                      </button>
                      {!isCompleted ? (
                        <button
                          type="button"
                          onClick={() => setPanel('tarefa')}
                          className={cn(
                            'flex-1 rounded-full px-2 py-1.5 text-center transition-colors sm:px-3 sm:py-2',
                            panel === 'tarefa' && 'bg-background text-foreground shadow-sm'
                          )}
                        >
                          Tarefa do dia
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPanel('concluido')}
                          className={cn(
                            'flex-1 rounded-full px-2 py-1.5 text-center transition-colors sm:px-3 sm:py-2',
                            panel === 'concluido' && 'bg-background text-foreground shadow-sm'
                          )}
                        >
                          ✅ Desafio concluído
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-body flex-1 space-y-4">
                {panel === 'conteudo' && (
                  <DayModalContent dayId={dayId} />
                )}

                {panel === 'tarefa' && (
                  <DayTaskTab
                    dayId={dayId}
                    config={config}
                    defaultValues={defaultValues as Record<string, unknown>}
                    onComplete={handleCompleteDay}
                    onInputSubmit={handleInputSubmit}
                    onCrudComplete={handleCrudComplete}
                    phase={phase}
                    payload={payload}
                    isLoading={saving}
                  />
                )}

                {panel === 'concluido' && (
                  <>
                    {isEditing ? (
                      <DayTaskTab
                        dayId={dayId}
                        config={config}
                        defaultValues={defaultValues as Record<string, unknown>}
                        onComplete={(values) => {
                          handleCompleteDay(values);
                          setIsEditing(false);
                        }}
                        onInputSubmit={handleInputSubmit}
                        onCrudComplete={handleCrudComplete}
                        phase={phase}
                        payload={payload}
                        isLoading={saving}
                      />
                    ) : (
                      <DayCompletedTab
                        dayId={dayId}
                        dayTitle={day?.title || config.title}
                        completedAt={progress.daysProgress[dayId]?.completedAt || new Date().toISOString()}
                        metrics={metrics.length > 0 ? metrics : []}
                        formData={defaultValues as Record<string, unknown> || {}}
                        onEdit={() => setIsEditing(true)}
                      />
                    )}
                  </>
                )}
              </div>

              <DayCelebrationModal
                isOpen={showCelebration}
                onClose={() => setShowCelebration(false)}
                onContinue={() => {
                  onOpenChange(false);
                  if (dayId < 15 && onNavigateToNextDay) {
                    onNavigateToNextDay(dayId + 1);
                  }
                }}
                dayId={dayId}
                dayTitle={day?.title || config.title}
                motivationPhrase={day?.motivationPhrase || ''}
                rewardLabel={day?.rewardLabel || 'Conquista desbloqueada'}
                rewardIcon={day?.rewardIcon || 'award'}
              />

              {/* Footer fixo para o botão no mobile */}
              {panel === 'tarefa' && phase === 'crud' && (
                <div className="sticky bottom-0 border-t border-border/50 bg-popover/95 p-4 backdrop-blur-sm">
                  <Button className="btn-fire w-full sm:w-auto sm:ml-auto sm:block" onClick={handleCrudComplete} disabled={saving}>
                    {saving ? 'Salvando...' : 'Concluir dia'}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
