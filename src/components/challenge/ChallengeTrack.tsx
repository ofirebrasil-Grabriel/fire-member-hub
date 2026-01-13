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
}: {
  item: TrackItem;
  onSelect: (dayId: number) => void;
}) => {
  const isLocked = item.status === 'locked';
  const StatusIcon = statusIconMap[item.status];
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
        'group relative w-[560px] rounded-[26px] border border-border/50 bg-gradient-glass px-8 py-5 text-left shadow-glass transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        !isLocked && 'hover:-translate-y-0.5 hover:border-primary/30',
        isLocked && 'cursor-not-allowed opacity-60'
      )}
    >
      <span className="pointer-events-none absolute inset-0 rounded-[26px] bg-gradient-to-br from-highlight/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative space-y-4">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider',
              item.phase.tone
            )}
          >
            <item.phase.icon className="h-3 w-3" />
            {item.phase.label}
          </span>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Dia {item.id} | {item.badge}
          </span>
        </div>

        <div className="space-y-1">
          <h3
            className={cn(
              'text-xl font-semibold leading-tight',
              isLocked && 'text-muted-foreground/80'
            )}
          >
            {item.title}
          </h3>
          <p
            className={cn(
              'text-sm leading-relaxed text-muted-foreground',
              isLocked && 'text-muted-foreground/60'
            )}
          >
            {item.objective}
          </p>
        </div>

        <div className="h-px w-full bg-border/60" />

        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <StatusIcon className="h-3 w-3" />
            {actionLabel}
          </span>
          <span className={statusBadgeClasses[item.status]}>{statusLabels[item.status]}</span>
        </div>
      </div>
    </motion.button>
  );
};

export const ChallengeTrack = ({ items, onSelect }: ChallengeTrackProps) => {
  const startY = 70;
  const stepY = 150;
  const leftX = 260;
  const rightX = 740;
  const cardOffsetX = 420;
  const trackHeight = startY + (items.length - 1) * stepY + 120;
  const buildPath = (points: Array<{ x: number; y: number }>) => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i += 1) {
      const prev = points[i - 1];
      const curr = points[i];
      const c1x = prev.x;
      const c1y = prev.y + stepY * 0.35;
      const c2x = curr.x;
      const c2y = curr.y - stepY * 0.35;
      d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${curr.x} ${curr.y}`;
    }
    return d;
  };

  return (
    <>
      <div className="space-y-6 lg:hidden">
        {items.map((item) => (
          <TrackPathCard key={item.id} item={item} onSelect={onSelect} />
        ))}
      </div>

      <div className="relative hidden lg:block">
          <div className="relative mx-auto max-w-6xl">
            <div className="relative" style={{ height: trackHeight }}>
              <svg
                viewBox={`0 0 1000 ${trackHeight}`}
                className="pointer-events-none absolute inset-0 h-full w-full"
              >
                {items.length > 1 && (
                  <>
                    <path
                      d={buildPath(
                        items.map((_, index) => ({
                          x: index % 2 === 0 ? leftX : rightX,
                          y: startY + index * stepY,
                        }))
                      )}
                      fill="none"
                      stroke="hsl(var(--border))"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.6"
                    />
                    <path
                      d={buildPath(
                        items.map((_, index) => ({
                          x: index % 2 === 0 ? leftX : rightX,
                          y: startY + index * stepY,
                        }))
                      )}
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="2"
                      strokeDasharray="6 10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.7"
                    />
                  </>
                )}
              </svg>

            <motion.div
              className="relative h-full"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {items.map((item, index) => {
                const nodeX = index % 2 === 0 ? leftX : rightX;
                const nodeY = startY + index * stepY;
                const isLeft = index % 2 === 0;
                const Icon = item.iconName ? LUCIDE_ICON_MAP[item.iconName] : null;
                return (
                  <motion.div
                    key={`node-${item.id}`}
                    variants={itemVariants}
                    className="absolute"
                    style={{ left: nodeX, top: nodeY, transform: 'translate(-50%, -50%)' }}
                  >
                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center rounded-[18px] border border-border/70 bg-surface/80 shadow-glass">
                        {Icon ? (
                          <Icon
                            className={cn(
                              'h-7 w-7',
                              item.status === 'completed' && 'text-success',
                              item.status === 'current' && 'text-primary',
                              item.status === 'available' && 'text-muted-foreground',
                              item.status === 'locked' && 'text-primary'
                            )}
                          />
                        ) : item.status === 'locked' ? (
                          <Lock className="h-5 w-5 text-primary" />
                        ) : item.status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : item.status === 'current' ? (
                          <Play className="h-5 w-5 text-primary" />
                        ) : (
                          <Sparkles className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div
                        className="absolute top-1/2 h-px w-12 -translate-y-1/2 bg-border/70"
                        style={{ left: isLeft ? '100%' : undefined, right: isLeft ? undefined : '100%' }}
                      />
                    </div>
                  </motion.div>
                );
              })}

              {items.map((item, index) => {
                const cardX = index % 2 === 0 ? leftX - cardOffsetX + 10 : rightX + 40;
                const cardY = startY + index * stepY;
                return (
                  <motion.div
                    key={`card-${item.id}`}
                    variants={itemVariants}
                    className="absolute"
                    style={{ left: cardX, top: cardY, transform: 'translateY(-50%)' }}
                  >
                    <TrackPathCard item={item} onSelect={onSelect} />
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
