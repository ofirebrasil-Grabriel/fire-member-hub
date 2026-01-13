import { Link } from 'react-router-dom';
import { Check, Lock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { DayContent } from '@/hooks/useDays';

interface DayCardProps {
  day: DayContent;
}

export const DayCard = ({ day }: DayCardProps) => {
  const { progress, canAccessDay } = useUserProgress();
  const dayProgress = progress.daysProgress[day.id];
  const isCompleted = dayProgress?.completed;
  const isCurrent = progress.currentDay === day.id;
  const isLocked = !canAccessDay(day.id);

  const cardContent = (
    <div
      className={cn(
        "day-card glass-card p-4 md:p-5 border-2 border-transparent",
        isCompleted && "completed border-success/50",
        isCurrent && !isCompleted && "current",
        isLocked && "locked"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Day Number */}
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
          isCompleted 
            ? "bg-success/20 text-success" 
            : isCurrent 
              ? "bg-gradient-fire text-white shadow-fire" 
              : isLocked 
                ? "bg-surface text-muted-foreground" 
                : "bg-surface text-foreground"
        )}>
          {isCompleted ? (
            <Check className="w-6 h-6" />
          ) : isLocked ? (
            <Lock className="w-5 h-5" />
          ) : (
            <span className="text-lg font-bold">{day.id}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{day.emoji}</span>
            <h3 className={cn(
              "font-semibold truncate",
              isLocked ? "text-muted-foreground" : "text-foreground"
            )}>
              {day.title}
            </h3>
          </div>
          <p className={cn(
            "text-sm truncate",
            isLocked ? "text-muted-foreground/60" : "text-muted-foreground"
          )}>
            {day.subtitle}
          </p>
          
          {/* Task Progress */}
          {!isLocked && dayProgress?.completedTasks && day.taskSteps?.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-1.5 flex-1 bg-surface rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-fire rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(dayProgress.completedTasks.length / day.taskSteps.length) * 100}%` 
                    }}
                  />
                </div>
                <span>
                  {dayProgress.completedTasks.length}/{day.taskSteps.length}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Arrow */}
        {!isLocked && (
          <ChevronRight className={cn(
            "w-5 h-5 flex-shrink-0 transition-transform",
            "text-muted-foreground group-hover:text-foreground group-hover:translate-x-1"
          )} />
        )}
      </div>
    </div>
  );

  if (isLocked) {
    return cardContent;
  }

  return (
    <Link to={`/app?day=${day.id}`} className="block group">
      {cardContent}
    </Link>
  );
};
