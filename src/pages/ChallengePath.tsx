import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Lock,
  Play,
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
import { useDays } from '@/hooks/useDays';
import { cn } from '@/lib/utils';

const ChallengePath = () => {
  const { progress, canAccessDay, getCompletedDaysCount, completeDay } = useUserProgress();
  const { days } = useDays();
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

  const phaseMeta = {
    dossie: {
      label: 'Dossie',
      icon: BookOpen,
      tone: 'border-primary/30 bg-primary/10 text-primary',
    },
    contencao: {
      label: 'Contencao',
      icon: Shield,
      tone: 'border-warning/30 bg-warning/10 text-warning',
    },
    acordos: {
      label: 'Acordos',
      icon: Sparkles,
      tone: 'border-success/30 bg-success/10 text-success',
    },
    motor: {
      label: 'Motor',
      icon: Rocket,
      tone: 'border-accent/30 bg-accent/10 text-accent',
    },
  } as const;

  const totalDays = days.length || DAY_ENGINE.length || 15;
  const completedCount = getCompletedDaysCount();
  const currentDayConfig = DAY_ENGINE.find((day) => day.id === progress.currentDay) || DAY_ENGINE[0];
  const currentDayContent = days.find((day) => day.id === progress.currentDay);
  const currentDayTitle = currentDayContent?.title || currentDayConfig?.title || `Dia ${progress.currentDay}`;
  const currentDaySubtitle = currentDayContent?.subtitle || currentDayConfig?.objective || 'Siga para o proximo passo';
  const currentDayEmoji = currentDayContent?.emoji || '📅';
  const currentDayBadge = currentDayConfig?.badge;
  const currentDayPhase = currentDayConfig ? phaseMeta[currentDayConfig.phase] : null;
  const daysRemaining = Math.max(totalDays - completedCount, 0);
  const progressPercent = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;
  const dayContentMap = useMemo(
    () => new Map(days.map((day) => [day.id, day])),
    [days]
  );

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
    completed: 'border border-success/40 bg-success/15 text-success',
    current: 'border border-primary/40 bg-primary/15 text-primary',
    available: 'border border-border/60 bg-surface/60 text-muted-foreground',
    locked: 'border border-border/60 bg-muted/40 text-muted-foreground',
  };

  const timelineVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
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
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-surface/60 px-6 py-8 md:px-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-gradient-glass opacity-30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-surface/70 blur-3xl" />

          <div className="relative grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface/70 border border-border/60">
                  <img src="/favicon-v2.svg" alt="FIRE" className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold">FIRE 15D</p>
                  <p className="text-xs text-muted-foreground">Plano guiado de 15 dias</p>
                </div>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                  Dia {progress.currentDay} de {totalDays}
                </span>
                {currentDayBadge && (
                  <span className="rounded-full bg-surface/70 px-2 py-1 text-xs text-muted-foreground">
                    {currentDayBadge}
                  </span>
                )}
                {currentDayPhase && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface/70 px-2 py-1 text-xs text-muted-foreground">
                    <currentDayPhase.icon className="h-3 w-3" />
                    {currentDayPhase.label}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-semibold md:text-3xl">
                  Seu plano simples para sair do caos financeiro
                </h1>
                <p className="text-sm text-muted-foreground md:text-base">
                  Um passo por dia, 15 minutos cada. Tudo organizado para você avançar sem ansiedade.
                </p>
              </div>

              <div className="glass-card space-y-4 p-4 md:p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <span className="text-2xl">{currentDayEmoji}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Hoje</p>
                    <h2 className="text-lg font-semibold">{currentDayTitle}</h2>
                    <p className="text-sm text-muted-foreground">{currentDaySubtitle}</p>
                  </div>
                </div>
                <Button className="btn-fire" onClick={() => handleSelectDay(currentDayConfig?.id ?? progress.currentDay)}>
                  Continuar dia <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="glass-card flex h-full flex-col gap-4 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Seu progresso</p>
                  <p className="text-xs text-muted-foreground">Acompanhe a evolução</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setLibraryOpen(true)}>
                  <BookOpen className="h-4 w-4" />
                  Biblioteca
                </Button>
              </div>
              <div className="flex items-center justify-center">
                <div
                  className="relative h-28 w-28 rounded-full p-[3px]"
                  style={{
                    background: `conic-gradient(hsl(var(--primary)) ${progressPercent}%, hsl(var(--muted)) ${progressPercent}% 100%)`,
                  }}
                >
                  <div className="absolute inset-[4px] flex flex-col items-center justify-center rounded-full bg-background text-sm font-semibold">
                    <span className="text-lg">{progressPercent}%</span>
                    <span className="text-[11px] text-muted-foreground">concluido</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-border/60 bg-surface/60 p-3">
                  <p className="text-xs text-muted-foreground">Concluidos</p>
                  <p className="text-lg font-semibold">{completedCount}</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-surface/60 p-3">
                  <p className="text-xs text-muted-foreground">Restantes</p>
                  <p className="text-lg font-semibold">{daysRemaining}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Sua jornada</h3>
          <p className="text-sm text-muted-foreground">
            Cada etapa foi desenhada para destravar a próxima com clareza.
          </p>
        </div>

        <div className="space-y-6">
          <motion.div
            className="relative w-full overflow-clip"
            variants={timelineVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Timeline color="secondary" orientation="vertical" className="gap-6">
              {DAY_ENGINE.map((day, index) => {
                const dayContent = dayContentMap.get(day.id);
                const dayTitle = dayContent?.title ?? day.title;
                const dayObjective = dayContent?.subtitle ?? day.objective;
                const dayEmoji = dayContent?.emoji ?? '📅';
                const status = getStatus(day.id);
                const isLocked = status === 'locked';
                const isCurrent = status === 'current';
                const isCompleted = status === 'completed';
                const phase = phaseMeta[day.phase];
                const isLast = index === DAY_ENGINE.length - 1;
                const separatorClass = cn(
                  isCompleted && 'bg-success/40',
                  isCurrent && 'bg-primary/50',
                  isLocked && 'bg-border/40',
                  !isCompleted && !isCurrent && !isLocked && 'bg-border/60'
                );
                const cardAccentClass = cn(
                  isCompleted && 'bg-success/40',
                  isCurrent && 'bg-primary/60',
                  isLocked && 'bg-border/40',
                  !isCompleted && !isCurrent && !isLocked && 'bg-primary/30'
                );
                const StatusIcon = isCompleted ? CheckCircle2 : isCurrent ? Play : isLocked ? Lock : Sparkles;
                const actionLabel = isLocked
                  ? 'Bloqueado'
                  : isCompleted
                    ? 'Revisar'
                    : isCurrent
                      ? 'Continuar'
                      : 'Abrir';

                return (
                  <motion.div key={day.id} variants={itemVariants}>
                    <TimelineItem>
                      <TimelineHeader className="w-12">
                        {!isLast && (
                          <TimelineSeparator
                            className={cn('top-10 h-[calc(100%-2.5rem)]', separatorClass)}
                          />
                        )}
                        <TimelineIcon
                          className={cn(
                            'h-10 w-10 text-[11px] font-semibold',
                            isCurrent && 'border-transparent bg-gradient-fire text-white shadow-fire ring-2 ring-primary/30',
                            isCompleted && 'border-success/50 bg-success/20 text-success',
                            isLocked && 'border-border/70 bg-surface/60 text-muted-foreground',
                            !isCurrent && !isCompleted && !isLocked && 'border-border/70 bg-surface/80 text-foreground'
                          )}
                        >
                          {day.id}
                        </TimelineIcon>
                      </TimelineHeader>
                      <TimelineBody className="-translate-y-2">
                        <button
                          type="button"
                          onClick={() => handleSelectDay(day.id)}
                          disabled={isLocked}
                          className={cn(
                            'group relative flex w-full text-left',
                            !isLocked && 'hover:-translate-y-0.5',
                            isLocked && 'cursor-not-allowed opacity-60',
                            'transition-all duration-300'
                          )}
                        >
                          <div
                            className={cn(
                              'glass-card relative w-full space-y-3 rounded-2xl border border-border/50 px-4 py-4 md:px-5',
                              !isLocked && 'hover:border-primary/30',
                              isCurrent && 'border-primary/40 bg-surface/70',
                              isCompleted && 'border-success/40',
                              isLocked && 'border-border/60 bg-surface/40'
                            )}
                          >
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-highlight/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <span className={cn('absolute inset-y-4 left-0 w-1 rounded-r-full', cardAccentClass)} />
                            <div className="relative flex items-start gap-4">
                              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/70 bg-surface/70">
                                <span className="text-xl">{dayEmoji}</span>
                              </div>
                              <div className="flex-1 space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide', phase.tone)}>
                                    <phase.icon className="h-3 w-3" />
                                    {phase.label}
                                  </span>
                                  <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                    {day.badge}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <p
                                    className={cn(
                                      'text-base font-semibold',
                                      isLocked && 'text-muted-foreground/80'
                                    )}
                                  >
                                    {dayTitle}
                                  </p>
                                  <span
                                    className={cn(
                                      'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                                      statusBadgeClasses[status]
                                    )}
                                  >
                                    {statusLabels[status]}
                                  </span>
                                </div>
                                <p
                                  className={cn(
                                    'text-sm text-muted-foreground',
                                    isLocked && 'text-muted-foreground/60'
                                  )}
                                >
                                  {dayObjective}
                                </p>
                                <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-wide text-muted-foreground">
                                  <span className="inline-flex items-center gap-1">
                                    <StatusIcon className="h-3 w-3" />
                                    {actionLabel}
                                  </span>
                                  {!isLocked && (
                                    <ChevronRight className="h-4 w-4 text-muted-foreground/70 transition-colors group-hover:text-muted-foreground" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                      </TimelineBody>
                    </TimelineItem>
                  </motion.div>
                );
              })}
            </Timeline>
          </motion.div>
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
