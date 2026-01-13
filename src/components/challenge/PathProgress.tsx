import { motion } from 'framer-motion';
import { DAY_ENGINE } from '@/config/dayEngine';
import { DayNode } from '@/components/challenge/DayNode';

interface PathProgressProps {
  currentDay: number;
  completedDays: number[];
  canAccessDay: (dayId: number) => boolean;
  onSelect: (dayId: number) => void;
}

export const PathProgress = ({ currentDay, completedDays, canAccessDay, onSelect }: PathProgressProps) => {
  const containerVariants = {
    show: {
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const nodeVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  const resolveStatus = (dayId: number) => {
    if (completedDays.includes(dayId)) return 'completed';
    if (dayId === currentDay) return 'current';
    return canAccessDay(dayId) ? 'available' : 'locked';
  };

  const firstRow = DAY_ENGINE.slice(0, 10);
  const secondRow = DAY_ENGINE.slice(10);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      <div className="grid grid-cols-10 gap-3">
        {firstRow.map((day) => (
          <motion.div key={day.id} variants={nodeVariants}>
            <DayNode dayId={day.id} status={resolveStatus(day.id)} onSelect={onSelect} />
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-3 justify-center">
        {secondRow.map((day) => (
          <motion.div key={day.id} variants={nodeVariants}>
            <DayNode dayId={day.id} status={resolveStatus(day.id)} onSelect={onSelect} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
