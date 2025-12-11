import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { TaskStep } from '@/hooks/useDays';

interface TaskListProps {
  dayId: number;
  tasks: TaskStep[];
}

export const TaskList = ({ dayId, tasks }: TaskListProps) => {
  const { progress, toggleTask } = useUserProgress();
  const dayProgress = progress.daysProgress[dayId];
  const completedTasks = dayProgress?.completedTasks || [];

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => {
        const isCompleted = completedTasks.includes(task.id);
        
        return (
          <div
            key={task.id}
            className={cn(
              "flex items-start gap-4 p-4 rounded-xl transition-all duration-200 cursor-pointer group",
              isCompleted 
                ? "bg-success/10 border border-success/30" 
                : "bg-surface/50 border border-border/50 hover:bg-surface hover:border-border"
            )}
            onClick={() => toggleTask(dayId, task.id)}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className={cn(
              "task-checkbox flex-shrink-0 mt-0.5",
              isCompleted && "checked"
            )}>
              {isCompleted && <Check className="w-4 h-4 text-white" />}
            </div>
            
            <div className="flex-1">
              <p className={cn(
                "font-medium transition-all",
                isCompleted && "text-success line-through opacity-75"
              )}>
                {task.text}
              </p>
            </div>
            
            <span className={cn(
              "text-xs px-2 py-1 rounded-full flex-shrink-0",
              isCompleted 
                ? "bg-success/20 text-success" 
                : "bg-muted text-muted-foreground"
            )}>
              {index + 1}/{tasks.length}
            </span>
          </div>
        );
      })}
    </div>
  );
};
