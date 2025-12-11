import { useUserProgress } from '@/contexts/UserProgressContext';
import { useDays } from '@/hooks/useDays';

interface ProgressRingProps {
  size?: number;
  strokeWidth?: number;
}

export const ProgressRing = ({ size = 200, strokeWidth = 12 }: ProgressRingProps) => {
  const { getCompletedDaysCount } = useUserProgress();
  const { days } = useDays();
  const totalDays = days.length || 15;
  const completedDays = getCompletedDaysCount();
  const percentage = Math.round((completedDays / totalDays) * 100);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className="progress-ring"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          className="text-surface"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className="progress-ring-circle"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          stroke="url(#fire-gradient)"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <defs>
          <linearGradient id="fire-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(24, 100%, 55%)" />
            <stop offset="100%" stopColor="hsl(24, 100%, 45%)" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-fire">{percentage}%</span>
        <span className="text-sm text-muted-foreground mt-1">
          {completedDays}/{totalDays} dias
        </span>
      </div>
    </div>
  );
};
