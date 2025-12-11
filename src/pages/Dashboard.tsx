import { Layout } from '@/components/layout/Layout';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { WelcomeCard } from '@/components/dashboard/WelcomeCard';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { DayCard } from '@/components/dashboard/DayCard';
import { useDays } from '@/hooks/useDays';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { progress } = useUserProgress();
  const { days, loading } = useDays();
  const totalDays = days.length || 15;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <WelcomeCard />
        
        {/* Stats */}
        <StatsCards />
        
        {/* Progress and Days */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress Ring */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 flex flex-col items-center sticky top-8">
              <h3 className="font-semibold mb-6 text-center">Seu Progresso</h3>
              <ProgressRing size={180} />
              
              <div className="mt-6 w-full">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Dia Atual</span>
                  <span className="font-semibold text-fire">{progress.currentDay}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Meta</span>
                  <span className="font-semibold">{totalDays} dias</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-surface/50 rounded-xl w-full">
                <p className="text-xs text-muted-foreground text-center">
                  💡 Complete as tarefas do dia para desbloquear o próximo
                </p>
              </div>
            </div>
          </div>
          
          {/* Days List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-semibold text-lg">Jornada de {totalDays} Dias</h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Carregando...</span>
              </div>
            ) : days.length === 0 ? (
              <div className="glass-card p-6 text-center">
                <p className="text-muted-foreground">Nenhum dia cadastrado ainda.</p>
              </div>
            ) : (
              <div className="space-y-3">
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
      </div>
    </Layout>
  );
};

export default Dashboard;
