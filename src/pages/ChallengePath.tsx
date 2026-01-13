import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  ChevronRight,
  Flame,
  Rocket,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { DayModal } from '@/components/challenge/DayModal';
import { LibraryModal } from '@/components/challenge/LibraryModal';
import {
  Timeline,
  TimelineBody,
  TimelineHeader,
  TimelineIcon,
  TimelineItem,
  TimelineSeparator,
} from '@/components/ui/timeline';
import { DAY_ENGINE } from '@/config/dayEngine';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ChallengePath = () => {
  const { progress, canAccessDay, getCompletedDaysCount, getProgressPercentage, completeDay } = useUserProgress();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const completedDays = useMemo(
    () =>
      Object.entries(progress.daysProgress)
        .filter(([, value]) => value.completed)
        .map(([key]) => Number(key)),
    [progress.daysProgress]
  );

  const currentDayConfig = DAY_ENGINE.find((day) => day.id === progress.currentDay) || DAY_ENGINE[0];
  const daysRemaining = 15 - getCompletedDaysCount();
  const progressPercent = getProgressPercentage();

  const phaseMeta = {
    dossie: { label: 'Dossie', icon: BookOpen },
    contencao: { label: 'Contencao', icon: Shield },
    acordos: { label: 'Acordos', icon: Sparkles },
    motor: { label: 'Motor', icon: Rocket },
  } as const;

  const getStatus = (dayId: number) => {
    if (completedDays.includes(dayId)) return 'completed';
    if (dayId === progress.currentDay) return 'current';
    return canAccessDay(dayId) ? 'available' : 'locked';
  };

  const statusLabels: Record<'completed' | 'current' | 'available' | 'locked', string> = {
    completed: 'Concluido',
    current: 'Hoje',
    available: 'Disponivel',
    locked: 'Bloqueado',
  };

  const statusBadgeClasses: Record<'completed' | 'current' | 'available' | 'locked', string> = {
    completed: 'bg-success/20 text-success',
    current: 'bg-primary/20 text-primary',
    available: 'bg-primary/10 text-primary',
    locked: 'bg-muted/50 text-muted-foreground',
  };

  const handleSelectDay = (dayId: number) => {
    if (!canAccessDay(dayId)) return;
    setSelectedDay(dayId);
    setSearchParams({ day: String(dayId) });
  };

  const handleCompleted = (dayId: number, payload?: Record<string, unknown>) => {
    completeDay(dayId, payload);
  };

  useEffect(() => {
    const param = searchParams.get('day');
    if (!param) return;
    const dayId = Number(param);
    if (!Number.isFinite(dayId) || dayId < 1 || dayId > 15) return;
    if (!canAccessDay(dayId)) return;
    setSelectedDay(dayId);
  }, [searchParams, canAccessDay]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="glass-card rounded-2xl flex flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-fire shadow-fire">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">FIRE 15D</p>
              <p className="text-xs text-muted-foreground">Dia {progress.currentDay} de 15</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setLibraryOpen(true)}>
              <BookOpen className="h-4 w-4" />
              Biblioteca
            </Button>
            <div
              className="relative h-12 w-12 rounded-full p-[2px]"
              style={{
                background: `conic-gradient(hsl(var(--primary)) ${progressPercent}%, hsl(var(--muted)) ${progressPercent}% 100%)`,
              }}
            >
              <div className="absolute inset-[3px] flex flex-col items-center justify-center rounded-full bg-background text-xs font-semibold">
                <span>{getCompletedDaysCount()}</span>
                <span className="text-[10px] text-muted-foreground">de 15</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Pronto para sair do caos?</h2>
            <p className="text-sm text-muted-foreground">
              15 dias, 15 minutos por dia. Um passo de cada vez.
            </p>
          </div>
          {currentDayConfig && (
            <Button className="btn-fire" onClick={() => handleSelectDay(currentDayConfig.id)}>
              Comecar agora <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        <button
          onClick={() => setLibraryOpen(true)}
          className="glass-card rounded-2xl flex items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-surface-hover"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Biblioteca de Recursos</p>
              <p className="text-sm text-muted-foreground">Scripts, dicas e checklist anti-golpe</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>

        <div className="space-y-6">
          <div className="relative w-full overflow-clip">
            <Timeline color="secondary" orientation="vertical" className="gap-5">
              {DAY_ENGINE.map((day, index) => {
                const status = getStatus(day.id);
                const isLocked = status === 'locked';
                const isCurrent = status === 'current';
                const isCompleted = status === 'completed';
                const phase = phaseMeta[day.phase];
                const isLast = index === DAY_ENGINE.length - 1;

                return (
                  <TimelineItem key={day.id}>
                    <TimelineHeader>
                      {!isLast && <TimelineSeparator className="bg-primary/30" />}
                      <TimelineIcon
                        className={cn(
                          'text-[11px] font-semibold',
                          isCurrent && 'border-transparent bg-gradient-fire text-white shadow-fire',
                          isCompleted && 'border-success/50 bg-success/20 text-success',
                          isLocked && 'border-border/70 bg-surface/60 text-muted-foreground',
                          !isCurrent && !isCompleted && !isLocked && 'border-border/70 bg-surface/80 text-foreground'
                        )}
                      >
                        {day.id}
                      </TimelineIcon>
                    </TimelineHeader>
                    <TimelineBody className="-translate-y-1">
                      <button
                        type="button"
                        onClick={() => handleSelectDay(day.id)}
                        disabled={isLocked}
                        className={cn(
                          'flex w-full flex-col gap-1 rounded-xl px-3 py-2 text-left transition-colors',
                          !isLocked && 'hover:bg-surface/40',
                          isLocked && 'cursor-not-allowed opacity-60',
                          isCurrent && 'bg-primary/10',
                          isCompleted && 'bg-success/5'
                        )}
                      >
                        <div
                          className={cn(
                            'text-base font-semibold',
                            isLocked && 'text-muted-foreground/80'
                          )}
                        >
                          {day.title}
                        </div>
                        <div
                          className={cn(
                            'text-sm text-muted-foreground',
                            isLocked && 'text-muted-foreground/60'
                          )}
                        >
                          {day.objective}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                          <span>DIA {day.id}</span>
                          <span>·</span>
                          <span>{day.badge}</span>
                          <span className="inline-flex items-center gap-1">
                            <phase.icon className="h-3 w-3" />
                            {phase.label}
                          </span>
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                              statusBadgeClasses[status]
                            )}
                          >
                            {statusLabels[status]}
                          </span>
                        </div>
                      </button>
                    </TimelineBody>
                  </TimelineItem>
                );
              })}
            </Timeline>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{daysRemaining} dias restantes</span>
          <span>{progressPercent}% concluido</span>
        </div>
      </div>

      {selectedDay !== null && (
        <DayModal
          dayId={selectedDay}
          open={selectedDay !== null}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedDay(null);
              setSearchParams({});
            }
          }}
          onCompleted={handleCompleted}
        />
      )}

      <LibraryModal open={libraryOpen} onOpenChange={setLibraryOpen} />
    </Layout>
  );
};

export default ChallengePath;
