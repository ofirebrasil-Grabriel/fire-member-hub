import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Lock, Play, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LUCIDE_ICON_MAP, type LucideIconName } from '@/components/icons/lucideIconMap';

export type TrackStatus = 'completed' | 'current' | 'available' | 'locked';

interface TrackPhase {
  label: string;
  icon: ComponentType<{ className?: string }>;
  tone: string;
}

export interface TrackItem {
  id: number;
  title: string;
  objective: string;
  badge: string;
  emoji: string;
  iconName?: LucideIconName | null;
  phase: TrackPhase;
  status: TrackStatus;
}

interface ChallengeTrackProps {
  items: TrackItem[];
  onSelect: (dayId: number) => void;
}

const chipBase =
  'inline-flex items-center gap-1 rounded-full border border-border/60 bg-surface/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider';

const statusLabels: Record<TrackStatus, string> = {
  completed: 'Concluido',
  current: 'Hoje',
  available: 'Disponivel',
  locked: 'Bloqueado',
};

const statusBadgeClasses: Record<TrackStatus, string> = {
  completed: `${chipBase} text-success/90`,
  current: `${chipBase} text-primary/80`,
  available: `${chipBase} text-muted-foreground`,
  locked: `${chipBase} text-muted-foreground/70`,
};

const statusIconMap: Record<TrackStatus, ComponentType<{ className?: string }>> = {
  completed: CheckCircle2,
  current: Play,
  available: Sparkles,
  locked: Lock,
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const TrackPathCard = ({
  item,
  onSelect,
  iconSide = 'right',
  iconPosition = 'side',
  className,
}: {
  item: TrackItem;
  onSelect: (dayId: number) => void;
  iconSide?: 'left' | 'right';
  iconPosition?: 'side' | 'top';
  className?: string;
}) => {
  const isLocked = item.status === 'locked';
  const StatusIcon = statusIconMap[item.status];
  const Icon = item.iconName ? LUCIDE_ICON_MAP[item.iconName] : statusIconMap[item.status];
  const actionLabel =
    item.status === 'locked'
      ? 'Bloqueado'
      : item.status === 'completed'
        ? 'Revisar'
        : item.status === 'current'
          ? 'Continuar'
          : 'Abrir';

  return (
    <motion.button
      type="button"
      variants={itemVariants}
      onClick={() => !isLocked && onSelect(item.id)}
      disabled={isLocked}
      className={cn(
        'group relative rounded-[30px] border border-border/60 bg-gradient-glass px-6 py-6 text-left shadow-glass transition-all duration-300 lg:px-10',
        iconPosition === 'top' && 'pt-14',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        !isLocked && 'hover:-translate-y-0.5 hover:border-primary/30',
        isLocked && 'cursor-not-allowed opacity-60',
        className
      )}
    >
      <span className="pointer-events-none absolute inset-0 rounded-[26px] bg-gradient-to-br from-highlight/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Ícone no topo - versão mobile */}
      {iconPosition === 'top' && (
        <div className="absolute left-1/2 top-0 flex h-[56px] w-[56px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[18px] border border-border/70 bg-surface/80 shadow-glass">
          <Icon
            className={cn(
              'h-6 w-6',
              item.status === 'completed' && 'text-success',
              item.status === 'current' && 'text-primary',
              item.status === 'available' && 'text-muted-foreground',
              item.status === 'locked' && 'text-primary'
            )}
          />
        </div>
      )}

      {/* Ícone lateral - versão desktop */}
      {iconPosition === 'side' && (
        <div
          className={cn(
            'absolute top-1/2 flex h-[72px] w-[72px] -translate-y-1/2 items-center justify-center rounded-[22px] border border-border/70 bg-surface/80 shadow-glass',
            iconSide === 'left' ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'
          )}
        >
          <Icon
            className={cn(
              'h-8 w-8',
              item.status === 'completed' && 'text-success',
              item.status === 'current' && 'text-primary',
              item.status === 'available' && 'text-muted-foreground',
              item.status === 'locked' && 'text-primary'
            )}
          />
        </div>
      )}

      <div className="relative space-y-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-3">
          <span
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[9px] font-medium uppercase tracking-wider lg:px-3 lg:text-[10px]',
              item.phase.tone
            )}
          >
            <item.phase.icon className="h-3 w-3" />
            {item.phase.label}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground lg:text-[11px]">
            Dia {item.id} | {item.badge}
          </span>
        </div>

        <div className="space-y-2">
          <h3
            className={cn(
              'text-xl font-semibold leading-tight lg:text-2xl',
              isLocked && 'text-muted-foreground/80'
            )}
          >
            {item.title}
          </h3>
          <p
            className={cn(
              'mx-auto max-w-[420px] text-sm leading-relaxed text-muted-foreground lg:text-base',
              isLocked && 'text-muted-foreground/60'
            )}
          >
            {item.objective}
          </p>
        </div>

        <div className="h-px w-full bg-border/60" />

        <div className="grid grid-cols-3 items-center text-[10px] uppercase tracking-wider text-muted-foreground lg:text-[11px]">
          <span className="inline-flex items-center gap-1.5 justify-self-start lg:gap-2">
            <StatusIcon className="h-3 w-3" />
            {actionLabel}
          </span>
          <ChevronRight className="h-4 w-4 rotate-90 justify-self-center text-muted-foreground/70" />
          <span className={cn(statusBadgeClasses[item.status], 'justify-self-end text-[9px] lg:text-[11px]')}>
            {statusLabels[item.status]}
          </span>
        </div>
      </div>
    </motion.button>
  );
};

export const ChallengeTrack = ({ items, onSelect }: ChallengeTrackProps) => {
  const startY = 120;
  const stepY = 160;
  const bubbleSize = 72;
  const bubbleOffset = bubbleSize / 2;
  const trackHeight = startY + (items.length - 1) * stepY + 240;
  const roadPath =
    'M 50 0 C 50 30, 53 30, 53 60 C 53 120, 47 120, 47 180 C 47 240, 53 240, 53 300 C 53 360, 47 360, 47 420 C 47 480, 53 480, 53 540 C 53 600, 47 600, 47 660 C 47 720, 53 720, 53 780 C 53 840, 47 840, 47 900 C 47 960, 53 960, 53 1020 C 53 1080, 47 1080, 47 1140 C 47 1200, 53 1200, 53 1260 C 53 1320, 47 1320, 47 1380 C 47 1440, 53 1440, 53 1500 C 53 1560, 47 1560, 47 1620 C 47 1680, 53 1680, 47 1740 L 50 1800';

  return (
    <>
      <div className="space-y-8 lg:hidden">
        {items.map((item) => (
          <TrackPathCard
            key={item.id}
            item={item}
            onSelect={onSelect}
            iconPosition="top"
            className="mx-auto w-full max-w-[400px]"
          />
        ))}
      </div>

      <div className="relative hidden lg:block">
        <div className="relative mx-auto max-w-[1400px]">
          <div className="relative" style={{ height: trackHeight }}>
            <svg
              viewBox="0 0 100 1800"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              <defs>
                <linearGradient id="road-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                  <stop offset="15%" stopColor="hsl(var(--primary))" stopOpacity="0.45" />
                  <stop offset="85%" stopColor="hsl(var(--primary))" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                d={roadPath}
                fill="none"
                stroke="url(#road-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength="1"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: 'easeInOut' }}
                className="drop-shadow-[0_0_10px_rgba(234,88,12,0.2)]"
              />
            </svg>

            <motion.div
              className="relative h-full"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.01 }}
            >
              {items.map((item, index) => {
                const isLeft = index % 2 !== 0;
                const cardY = startY + index * stepY;
                return (
                  <motion.div
                    key={`card-${item.id}`}
                    variants={itemVariants}
                    className="absolute"
                    style={{
                      ...(isLeft
                        ? { right: '50%', marginRight: bubbleOffset }
                        : { left: '50%', marginLeft: bubbleOffset }),
                      top: cardY,
                      transform: 'translateY(-50%)',
                    }}
                  >
                    <TrackPathCard
                      item={item}
                      onSelect={onSelect}
                      iconSide={isLeft ? 'right' : 'left'}
                      className="w-[640px] max-w-[calc(100vw-4rem)]"
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};
