import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Lock, Play, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

const TrackShowcaseCard = ({ item, onSelect }: { item: TrackItem; onSelect: (dayId: number) => void }) => {
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
        'group relative w-full max-w-2xl rounded-[32px] border border-border/50 bg-gradient-glass px-6 py-6 text-left shadow-glass transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        !isLocked && 'hover:-translate-y-0.5 hover:border-primary/30',
        isLocked && 'cursor-not-allowed opacity-60'
      )}
    >
      <span className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-br from-highlight/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative space-y-4 text-center">
        <div className="flex items-center justify-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-[20px] border border-border/60 bg-surface/80">
            <span className="text-2xl">{item.emoji}</span>
            <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-primary/70" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider', item.phase.tone)}>
              <item.phase.icon className="h-3 w-3" />
              {item.phase.label}
            </span>
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Dia {item.id}</span>
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{item.badge}</span>
          </div>
          <h3
            className={cn(
              'text-lg font-semibold leading-tight',
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
        {!isLocked && (
          <span className="absolute right-5 top-6 text-muted-foreground/70 transition-colors group-hover:text-muted-foreground">
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </div>
    </motion.button>
  );
};

export const ChallengeTrack = ({ items, onSelect }: ChallengeTrackProps) => {
  return (
    <>
      <div className="space-y-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className={cn(
              'flex w-full justify-center',
              index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'
            )}
          >
            <TrackShowcaseCard item={item} onSelect={onSelect} />
          </motion.div>
        ))}
      </div>
    </>
  );
};
