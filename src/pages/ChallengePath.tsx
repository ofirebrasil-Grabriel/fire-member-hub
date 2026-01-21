import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, ChevronRight, Rocket, Shield, Sparkles } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { DayModal } from '@/components/challenge/DayModal';
import { LibraryModal } from '@/components/challenge/LibraryModal';
import { DAY_ENGINE } from '@/config/dayEngine';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { Button } from '@/components/ui/button';
import { useDays } from '@/hooks/useDays';
import { ChallengeTrack } from '@/components/challenge/ChallengeTrack';
import { LUCIDE_ICON_MAP, type LucideIconName } from '@/components/icons/lucideIconMap';
import { TransformationDashboard } from '@/components/dashboard';

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
  const currentDayIconName = (currentDayContent?.iconName ?? null) as LucideIconName | null;
  const CurrentDayIcon = currentDayIconName ? LUCIDE_ICON_MAP[currentDayIconName] : null;
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

  const chipBase =
    'inline-flex items-center gap-1 rounded-full border border-border/60 bg-surface/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider';

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
      <div className="max-h-96 mx-auto max-w-[calc(80vw-0px)] px-auto md:px-2 space-y-8">
        <div className="relative w-full overflow-hidden rounded-3xl border border-border/60 bg-surface/60 px-2 py-7 md:px-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-gradient-glass opacity-30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-surface/70 blur-3xl" />
          <div className="relative items-end grid gap-6 xl:grid-cols-[1.3fr_0.7fr] lg:max-w-[calc(80vw-0px)]">
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

              <div className="glass-card flex items-center justify-center h-auto flex-col gap-6 p-4 md:p-7  ">
                <div className="flex items-center justify-center gap-2">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border/60 bg-surface/70 text-foreground">
                    {CurrentDayIcon ? (
                      <CurrentDayIcon className="h-12 w-12 text-primary" />
                    ) : (
                      <span className="text-2xl">{currentDayEmoji}</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Hoje</p>
                    <h2 className="text-base font-semibold md:text-lg">{currentDayTitle}</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">{currentDaySubtitle}</p>
                  </div>
                </div>
                <Button
                  className="btn-fire w-8/12 inline-flex items-center justify-center gap-2 "
                  onClick={() => handleSelectDay(currentDayConfig?.id ?? progress.currentDay)}
                >
                  Continuar dia <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="glass-card flex min-w-72 max-h-96 h-auto flex-col gap-6 p-4 md:p-7">
              <div className="text-center">
                <p className="text-[22px] font-bold tracking-tight">Seu progresso</p>
                <p className="text-[14px] text-muted-foreground  tracking-wider font-medium">Acompanhe a evolução</p>
              </div>

              <div className="flex items-center justify-center gap-4 relative px-2">
                {/* Lado Esquerdo: Gráfico Circular (Atrás) */}
                <div className="shrink-0 relative z-0">
                  <div
                    className="relative h-36 w-36 rounded-full p-[6px] shadow-glow-sm border border-white/10"
                    style={{
                      background: `conic-gradient(hsl(var(--primary)) 0% ${progressPercent}%, hsl(var(--muted)/0.2) ${progressPercent}% 100%)`,
                    }}
                  >
                    <div className="absolute inset-[6px] flex flex-col items-center justify-center rounded-full bg-background/80 backdrop-blur-md">
                      <span className="text-3xl font-black text-fire">{progressPercent}%</span>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">meta</span>
                    </div>
                  </div>
                </div>

                {/* Lado Direito: Card de Status (Reduzido) */}
                <div className="relative z-10 -ml-2 w-32">
                  <div className="flex flex-col items-center justify-right rounded-xl border border-white/20 bg-white/10 p-3 text-center backdrop-blur-xl shadow-2xl ring-1 ring-black/20">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-3xl font-black text-foreground">{completedCount}</span>
                      <span className="text-muted-foreground/60 font-medium text-xs">/</span>
                      <span className="text-base font-bold text-muted-foreground/60">{totalDays}</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 mt-0.5">Dias</p>

                    <div className="mt-2 w-full border-t border-white/10 pt-2">
                      <p className="text-[14px] font-bold text-primary/90 italic whitespace-nowrap">
                        {daysRemaining} restantes
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="btn-fire-3d w-full flex items-center justify-center gap-2 mt-auto h-12"
                onClick={() => setLibraryOpen(true)}
              >
                <BookOpen className="h-5 w-5" />
                <span>Biblioteca</span>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            Trilha de Evolução
          </div>
          <h3 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            Sua jornada
          </h3>
          <p className="text-sm text-muted-foreground/90 md:text-base max-w-xl mx-auto leading-relaxed">
            Cada etapa foi desenhada para destravar a próxima com clareza.
            Siga o caminho e acompanhe seu progresso real.
          </p>
        </div>

        {/* Dashboard de Transformação */}
        <TransformationDashboard className="max-w-2xl mx-auto" />

        <div className="justify-center items-center space-y-5 md:px-2">
          <ChallengeTrack
            items={DAY_ENGINE.map((day) => {
              const dayContent = dayContentMap.get(day.id);
              return {
                id: day.id,
                title: dayContent?.title ?? day.title,
                objective: dayContent?.subtitle ?? day.objective,
                badge: day.badge,
                emoji: dayContent?.emoji ?? '📅',
                iconName: (dayContent?.iconName ?? null) as LucideIconName | null,
                phase: phaseMeta[day.phase],
                status: getStatus(day.id),
              };
            })}
            onSelect={handleSelectDay}
          />
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
          onNavigateToNextDay={(nextDayId) => {
            setSelectedDay(nextDayId);
            setSearchParams({ day: String(nextDayId) });
          }}
        />
      )}

      <LibraryModal open={libraryOpen} onOpenChange={setLibraryOpen} />
    </Layout>
  );
};

export default ChallengePath;
