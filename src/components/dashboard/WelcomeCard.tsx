import { Flame, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useDays } from '@/hooks/useDays';

export const WelcomeCard = () => {
  const { progress } = useUserProgress();
  const { days, loading } = useDays();
  const currentDay = days.find(d => d.id === progress.currentDay) || days[0];
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getMotivationalMessage = () => {
    const completedDays = Object.values(progress.daysProgress).filter(d => d.completed).length;
    const totalDays = days.length || 15;
    if (completedDays === 0) return 'Pronto para transformar sua vida financeira?';
    if (completedDays < 5) return 'Você está no caminho certo! Continue assim!';
    if (completedDays < 10) return 'Incrível progresso! Metade do caminho já foi percorrida.';
    if (completedDays < totalDays) return 'A reta final chegou! A liberdade financeira está próxima.';
    return 'Parabéns! Você completou o desafio! 🎉';
  };

  return (
    <div className="glass-card p-6 md:p-8 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-fire rounded-full opacity-10 blur-3xl" />
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {getGreeting()}, <span className="text-fire">{progress.userName}</span>!
            </h2>
            <p className="text-muted-foreground max-w-md">
              {getMotivationalMessage()}
            </p>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <Flame className="w-5 h-5 text-primary" />
            <span className="font-semibold text-primary">Dia {progress.currentDay}</span>
          </div>
        </div>

        {/* Current Day Preview */}
        <div className="mt-6 p-4 bg-surface/50 rounded-xl border border-border/50">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              <span className="text-muted-foreground">Carregando...</span>
            </div>
          ) : currentDay ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{currentDay.emoji}</span>
                <div>
                  <h3 className="font-semibold">{currentDay.title}</h3>
                  <p className="text-sm text-muted-foreground">{currentDay.subtitle}</p>
                </div>
              </div>
              
              <Link 
                to={`/dia/${currentDay.id}`}
                className="inline-flex items-center gap-2 btn-fire text-sm mt-2"
              >
                Continuar Desafio
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          ) : (
            <p className="text-muted-foreground">Nenhum dia disponível ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
};
