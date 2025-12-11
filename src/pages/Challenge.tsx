import { Layout } from '@/components/layout/Layout';
import { DayCard } from '@/components/dashboard/DayCard';
import { challengeDays } from '@/data/challengeData';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { Flame, Trophy, Target } from 'lucide-react';

const Challenge = () => {
  const { getCompletedDaysCount, getProgressPercentage } = useUserProgress();

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="glass-card p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-fire flex items-center justify-center shadow-fire">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Desafio 15 Dias FIRE</h1>
              <p className="text-muted-foreground">
                Transforme sua vida financeira em 15 dias
              </p>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-surface/50 text-center">
              <Trophy className="w-6 h-6 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold text-success">{getCompletedDaysCount()}</p>
              <p className="text-xs text-muted-foreground">Dias Completos</p>
            </div>
            <div className="p-4 rounded-xl bg-surface/50 text-center">
              <Target className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary">{getProgressPercentage()}%</p>
              <p className="text-xs text-muted-foreground">Progresso</p>
            </div>
            <div className="p-4 rounded-xl bg-surface/50 text-center">
              <Flame className="w-6 h-6 text-fire mx-auto mb-2" />
              <p className="text-2xl font-bold text-fire">{15 - getCompletedDaysCount()}</p>
              <p className="text-xs text-muted-foreground">Dias Restantes</p>
            </div>
          </div>
        </div>

        {/* Days Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Todos os Dias</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {challengeDays.map((day, index) => (
              <div 
                key={day.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <DayCard day={day} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Challenge;
