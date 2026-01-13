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
      tone: 'border-border/60 bg-surface/70 text-primary/80',
    },
    contencao: {
      label: 'Contencao',
      icon: Shield,
      tone: 'border-border/60 bg-surface/70 text-warning/80',
    },
    acordos: {
      label: 'Acordos',
      icon: Sparkles,
      tone: 'border-border/60 bg-surface/70 text-success/80',
    },
    motor: {
      label: 'Motor',
      icon: Rocket,
      tone: 'border-border/60 bg-surface/70 text-primary/80',
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

  const chipBase =
    'inline-flex items-center gap-1 rounded-full border border-border/60 bg-surface/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider';
  const statusBadgeClasses: Record<'completed' | 'current' | 'available' | 'locked', string> = {
    completed: `${chipBase} text-success/90`,
    current: `${chipBase} text-primary/80`,
    available: `${chipBase} text-muted-foreground`,
    locked: `${chipBase} text-muted-foreground/70`,
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
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-surface/60 px-6 py-7 md:px-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-gradient-glass opacity-30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-surface/70 blur-3xl" />

          <div className="relative grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface/70 border border-border/60">
                  <img src="/favicon-v2.svg" alt="FIRE" className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-medium">FIRE 15D</p>
                  <p className="text-xs text-muted-foreground/80">Plano guiado de 15 dias</p>
                </div>
                <span className={`${chipBase} text-primary/80`}>
                  Dia {progress.currentDay} de {totalDays}
                </span>
                {currentDayBadge && (
                  <span className={`${chipBase} text-muted-foreground`}>
                    {currentDayBadge}
                  </span>
                )}
                {currentDayPhase && (
                  <span className={`${chipBase} text-muted-foreground`}>
                    <currentDayPhase.icon className="h-3 w-3" />
                    {currentDayPhase.label}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <h1 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
                  Seu plano simples para sair do caos financeiro
                </h1>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  Um passo por dia, 15 minutos cada. Tudo organizado para você avançar sem ansiedade.
                </p>
              </div>

              <div className="glass-card space-y-3 p-4 md:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-surface/70 text-foreground">
                    <span className="text-2xl">{currentDayEmoji}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Hoje</p>
                    <h2 className="text-base font-semibold md:text-lg">{currentDayTitle}</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">{currentDaySubtitle}</p>
                  </div>
                </div>
                <Button
                  className="btn-fire inline-flex items-center gap-2"
                  onClick={() => handleSelectDay(currentDayConfig?.id ?? progress.currentDay)}
                >
                  Continuar dia <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="glass-card flex h-full flex-col gap-4 p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Seu progresso</p>
                  <p className="text-[11px] text-muted-foreground">Acompanhe a evolução</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setLibraryOpen(true)}>
                  <BookOpen className="h-4 w-4" />
                  Biblioteca
                </Button>
              </div>
              <div className="flex items-center justify-center">
                <div
                  className="relative h-24 w-24 rounded-full p-[3px]"
                  style={{
                    background: `conic-gradient(hsl(var(--primary)) ${progressPercent}%, hsl(var(--muted)) ${progressPercent}% 100%)`,
                  }}
                >
                  <div className="absolute inset-[4px] flex flex-col items-center justify-center rounded-full bg-background text-sm font-semibold">
                    <span className="text-base">{progressPercent}%</span>
                    <span className="text-[11px] text-muted-foreground">concluido</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-border/60 bg-surface/60 p-3">
                  <p className="text-xs text-muted-foreground">Concluidos</p>
                  <p className="text-base font-semibold">{completedCount}</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-surface/60 p-3">
                  <p className="text-xs text-muted-foreground">Restantes</p>
                  <p className="text-base font-semibold">{daysRemaining}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold">Sua jornada</h3>
          <p className="text-sm text-muted-foreground/90">
            Cada etapa foi desenhada para destravar a próxima com clareza.
          </p>
        </div>

        <div className="space-y-5">
          <motion.div
            className="relative w-full overflow-clip"
            variants={timelineVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Timeline color="secondary" orientation="vertical" className="gap-4">
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
                  isCurrent && 'bg-border/70',
                  isLocked && 'bg-border/40',
                  !isCompleted && !isCurrent && !isLocked && 'bg-border/60'
                );
                const cardAccentClass = cn(
                  isCompleted && 'bg-success/40',
                  isCurrent && 'bg-primary/30',
                  isLocked && 'bg-border/40',
                  !isCompleted && !isCurrent && !isLocked && 'bg-border/60'
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
                    <TimelineItem className="items-start gap-4">
                      <TimelineHeader className="w-11 pt-1">
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
                      <TimelineBody className="pt-0.5">
                        <button
                          type="button"
                          onClick={() => handleSelectDay(day.id)}
                          disabled={isLocked}
                          className={cn(
                            'group relative flex w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                            !isLocked && 'hover:-translate-y-0.5',
                            isLocked && 'cursor-not-allowed opacity-60',
                            'transition-all duration-300'
                          )}
                        >
                          <div
                            className={cn(
                              'glass-card relative w-full space-y-2.5 rounded-2xl border border-border/50 px-4 py-3.5 md:px-5',
                              !isLocked && 'hover:border-primary/30',
                              isCurrent && 'border-primary/40 bg-surface/70',
                              isCompleted && 'border-success/40',
                              isLocked && 'border-border/60 bg-surface/40'
                            )}
                          >
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-highlight/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <span className={cn('absolute inset-y-4 left-0 w-1 rounded-r-full', cardAccentClass)} />
                            <div className="relative flex items-start gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-surface/70">
                                <span className="text-xl">{dayEmoji}</span>
                              </div>
                              <div className="flex-1 space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider', phase.tone)}>
                                    <phase.icon className="h-3 w-3" />
                                    {phase.label}
                                  </span>
                                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                                    {day.badge}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <p
                                    className={cn(
                                      'text-[15px] font-semibold leading-snug',
                                      isLocked && 'text-muted-foreground/80'
                                    )}
                                  >
                                    {dayTitle}
                                  </p>
                                  <span
                                    className={cn(
                                      'rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider',
                                      statusBadgeClasses[status]
                                    )}
                                  >
                                    {statusLabels[status]}
                                  </span>
                                </div>
                                <p
                                  className={cn(
                                    'text-sm leading-relaxed text-muted-foreground',
                                    isLocked && 'text-muted-foreground/60'
                                  )}
                                >
                                  {dayObjective}
                                </p>
                                <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
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
