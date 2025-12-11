import { Layout } from '@/components/layout/Layout';
import { DayCard } from '@/components/dashboard/DayCard';
import { useDays } from '@/hooks/useDays';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { Flame, Trophy, Target, Loader2 } from 'lucide-react';

const Challenge = () => {
  const { days, loading, error } = useDays();
  const { getCompletedDaysCount, getProgressPercentage } = useUserProgress();
  const totalDays = days.length || 15;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Carregando desafio...</span>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Erro ao carregar</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </Layout>
    );
  }

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
              <h1 className="text-2xl md:text-3xl font-bold">Desafio {totalDays} Dias FIRE</h1>
              <p className="text-muted-foreground">
                Transforme sua vida financeira em {totalDays} dias
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
              <p className="text-2xl font-bold text-fire">{totalDays - getCompletedDaysCount()}</p>
              <p className="text-xs text-muted-foreground">Dias Restantes</p>
            </div>
          </div>
        </div>

        {/* Days Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Todos os Dias</h2>
          {days.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-muted-foreground">Nenhum dia cadastrado ainda.</p>
              <p className="text-sm text-muted-foreground mt-2">O administrador precisa criar o conteúdo do desafio.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {days.map((day, index) => (
                <div 
                  key={day.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <DayCard day={day} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Challenge;
