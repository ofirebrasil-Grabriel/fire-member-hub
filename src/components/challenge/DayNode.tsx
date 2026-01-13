import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DayNodeStatus = 'locked' | 'current' | 'completed' | 'available';

interface DayNodeProps {
  dayId: number;
  status: DayNodeStatus;
  onSelect?: (dayId: number) => void;
}

export const DayNode = ({ dayId, status, onSelect }: DayNodeProps) => {
  const isLocked = status === 'locked';

  return (
    <motion.button
      type="button"
      onClick={() => !isLocked && onSelect?.(dayId)}
      whileHover={!isLocked ? { y: -4 } : undefined}
      className={cn(
        'relative h-12 w-12 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all',
        status === 'completed' && 'bg-success/20 border-success text-success',
        status === 'current' && 'bg-gradient-fire border-transparent text-white shadow-fire',
        status === 'available' && 'bg-surface border-border text-foreground',
        status === 'locked' && 'bg-surface/40 border-border text-muted-foreground cursor-not-allowed'
      )}
    >
      {status === 'completed' ? <Check className="w-5 h-5" /> : dayId}
      {status === 'current' && (
        <span className="absolute -inset-1 rounded-full border border-primary/40 animate-pulse" />
      )}
    </motion.button>
  );
};
