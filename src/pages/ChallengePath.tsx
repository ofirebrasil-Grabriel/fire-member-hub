import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  ChevronRight,
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
    dossie: { label: 'Dossie', icon: BookOpen },
    contencao: { label: 'Contencao', icon: Shield },
    acordos: { label: 'Acordos', icon: Sparkles },
    motor: { label: 'Motor', icon: Rocket },
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
    completed: 'bg-success/20 text-success',
    current: 'bg-primary/20 text-primary',
    available: 'bg-primary/10 text-primary',
    locked: 'bg-muted/50 text-muted-foreground',
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
      <div className="space-y-6">
        <div className="glass-card rounded-2xl flex flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface/60 border border-border/60">
              <img src="/favicon-v2.svg" alt="FIRE" className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-semibold">FIRE 15D</p>
              <p className="text-xs text-muted-foreground">Dia {progress.currentDay} de {totalDays}</p>
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
                <span>{completedCount}</span>
                <span className="text-[10px] text-muted-foreground">de {totalDays}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <span className="text-2xl">{currentDayEmoji}</span>
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                  Dia {progress.currentDay} de {totalDays}
                </span>
                {currentDayBadge && (
                  <span className="rounded-full bg-surface/70 px-2 py-0.5">{currentDayBadge}</span>
                )}
                {currentDayPhase && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface/70 px-2 py-0.5">
                    <currentDayPhase.icon className="h-3 w-3" />
                    {currentDayPhase.label}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-semibold">{currentDayTitle}</h2>
              <p className="text-sm text-muted-foreground">{currentDaySubtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button className="btn-fire" onClick={() => handleSelectDay(currentDayConfig?.id ?? progress.currentDay)}>
              Continuar dia <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <motion.div
            className="relative w-full overflow-clip"
            variants={timelineVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Timeline color="secondary" orientation="vertical" className="gap-5">
              {DAY_ENGINE.map((day, index) => {
                const dayContent = dayContentMap.get(day.id);
                const dayTitle = dayContent?.title ?? day.title;
                const dayObjective = dayContent?.subtitle ?? day.objective;
                const status = getStatus(day.id);
                const isLocked = status === 'locked';
                const isCurrent = status === 'current';
                const isCompleted = status === 'completed';
                const phase = phaseMeta[day.phase];
                const isLast = index === DAY_ENGINE.length - 1;

                return (
                  <motion.div key={day.id} variants={itemVariants}>
                    <TimelineItem>
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
                            {dayTitle}
                          </div>
                          <div
                            className={cn(
                              'text-sm text-muted-foreground',
                              isLocked && 'text-muted-foreground/60'
                            )}
                          >
                            {dayObjective}
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
                  </motion.div>
                );
              })}
            </Timeline>
          </motion.div>
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
