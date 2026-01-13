import { Calendar, Target, Trophy, Zap } from 'lucide-react';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useDays } from '@/hooks/useDays';

export const StatsCards = () => {
  const { progress, getCompletedDaysCount } = useUserProgress();
  const { days } = useDays();
  const totalDays = days.length || 15;
  
  const completedDays = getCompletedDaysCount();
  const currentDay = totalDays > 0 ? Math.min(progress.currentDay, totalDays) : progress.currentDay;
  const remainingDays = Math.max(totalDays - completedDays, 0);
  const percentage = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  const stats = [
    {
      icon: Trophy,
      label: 'Dias completos',
      value: completedDays,
      suffix: `/${totalDays}`,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: Calendar,
      label: 'Dia atual',
      value: currentDay,
      suffix: `/${totalDays}`,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Target,
      label: 'Dias restantes',
      value: remainingDays,
      suffix: ' dias',
      color: 'text-muted-foreground',
      bgColor: 'bg-surface/70',
    },
    {
      icon: Zap,
      label: 'Progresso geral',
      value: percentage,
      suffix: '%',
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
