import { Trophy, Target, Calendar, Zap } from 'lucide-react';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useDays } from '@/hooks/useDays';

export const StatsCards = () => {
  const { progress, getCompletedDaysCount } = useUserProgress();
  const { days } = useDays();
  const totalDays = days.length || 15;
  
  const completedDays = getCompletedDaysCount();
  const totalTasks = Object.values(progress.daysProgress).reduce(
    (acc, day) => acc + (day.completedTasks?.length || 0), 
    0
  );
  
  const daysSinceStart = Math.floor(
    (new Date().getTime() - new Date(progress.startedAt).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;
  
  const streak = completedDays; // Simplified streak calculation

  const stats = [
    {
      icon: Trophy,
      label: 'Dias Completos',
      value: completedDays,
      suffix: `/${totalDays}`,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: Target,
      label: 'Tarefas Feitas',
      value: totalTasks,
      suffix: '',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Calendar,
      label: 'Dias no Desafio',
      value: daysSinceStart,
      suffix: '',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      icon: Zap,
      label: 'Sequência',
      value: streak,
      suffix: ' dias',
      color: 'text-fire',
      bgColor: 'bg-fire/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="glass-card p-4 animate-fade-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center mb-3`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
            <span className="text-sm text-muted-foreground">{stat.suffix}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};
