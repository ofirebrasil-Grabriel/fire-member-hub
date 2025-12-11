import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Lightbulb, MessageSquare, Target } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { TaskList } from '@/components/day/TaskList';
import { MoodSelector } from '@/components/day/MoodSelector';
import { DiaryEntry } from '@/components/day/DiaryEntry';
import { ToolsList } from '@/components/day/ToolsList';
import { challengeDays } from '@/data/challengeData';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const DayPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dayId = parseInt(id || '1');
  const { progress, completeDay, canAccessDay } = useUserProgress();
  
  const day = challengeDays.find(d => d.id === dayId);
  const dayProgress = progress.daysProgress[dayId];
  const isCompleted = dayProgress?.completed;
  const completedTasksCount = dayProgress?.completedTasks?.length || 0;
  const totalTasks = day?.taskSteps?.length || 0;
  const allTasksCompleted = completedTasksCount === totalTasks;

  if (!day) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Dia não encontrado</h1>
          <Link to="/" className="text-primary hover:underline">
            Voltar ao Dashboard
          </Link>
        </div>
      </Layout>
    );
  }

  if (!canAccessDay(dayId)) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Dia Bloqueado</h1>
          <p className="text-muted-foreground mb-6">
            Complete o Dia {dayId - 1} para desbloquear este conteúdo.
          </p>
          <Link to={`/dia/${dayId - 1}`} className="btn-fire inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Ir para o Dia {dayId - 1}
          </Link>
        </div>
      </Layout>
    );
  }

  const handleCompleteDay = () => {
    if (!allTasksCompleted) {
      toast({
        title: "Complete todas as tarefas",
        description: "Você precisa completar todas as tarefas antes de finalizar o dia.",
        variant: "destructive",
      });
      return;
    }

    completeDay(dayId);
    toast({
      title: "Parabéns! 🎉",
      description: `Você completou o Dia ${dayId}! Continue assim!`,
    });

    if (dayId < 15) {
      setTimeout(() => navigate(`/dia/${dayId + 1}`), 1500);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <Link 
            to={dayId > 1 ? `/dia/${dayId - 1}` : '/'}
            className="p-2 rounded-lg bg-surface hover:bg-surface-hover transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-3xl">{day.emoji}</span>
              <span className="text-sm text-muted-foreground">Dia {dayId}/15</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{day.title}</h1>
            <p className="text-muted-foreground">{day.subtitle}</p>
          </div>
          
          {dayId < 15 && canAccessDay(dayId + 1) ? (
            <Link 
              to={`/dia/${dayId + 1}`}
              className="p-2 rounded-lg bg-surface hover:bg-surface-hover transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <div className="w-9" />
          )}
        </div>

        {/* Completion Status */}
        {isCompleted && (
          <div className="glass-card p-4 bg-success/10 border-success/30">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-success" />
              <div>
                <p className="font-semibold text-success">Dia Concluído!</p>
                <p className="text-sm text-muted-foreground">
                  Completado em {new Date(dayProgress?.completedAt || '').toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Morning Message */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-xl">🌅</span>
            </div>
            <h2 className="font-semibold text-lg">Mensagem Matinal</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">{day.morningMessage}</p>
        </div>

        {/* Concept */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Conceito FIRE do Dia</h2>
              <p className="text-sm text-muted-foreground">{day.conceptTitle}</p>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">{day.concept}</p>
        </div>

        {/* Tasks */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-fire flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Tarefas Práticas</h2>
                <p className="text-sm text-muted-foreground">{day.taskTitle}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={cn(
                "text-lg font-bold",
                allTasksCompleted ? "text-success" : "text-primary"
              )}>
                {completedTasksCount}/{totalTasks}
              </span>
              <p className="text-xs text-muted-foreground">Completadas</p>
            </div>
          </div>
          
          <TaskList dayId={dayId} tasks={day.taskSteps} />
        </div>

        {/* Tools */}
        <ToolsList tools={day.tools} />

        {/* Mood & Diary */}
        <div className="grid md:grid-cols-2 gap-6">
          <MoodSelector dayId={dayId} />
          <DiaryEntry dayId={dayId} />
        </div>

        {/* Reflection Questions */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-semibold text-lg">Reflexão Guiada</h2>
          </div>
          
          <ul className="space-y-3">
            {day.reflectionQuestions.map((question, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-surface flex items-center justify-center flex-shrink-0 text-sm text-muted-foreground">
                  {index + 1}
                </span>
                <p className="text-muted-foreground">{question}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Commitment & Next Day */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              🎯 Seu Compromisso Hoje
            </h3>
            <p className="text-muted-foreground text-sm">{day.commitment}</p>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              ➡️ Amanhã
            </h3>
            <p className="text-muted-foreground text-sm">{day.nextDayPreview}</p>
          </div>
        </div>

        {/* Complete Day Button */}
        {!isCompleted && (
          <div className="text-center py-6">
            <Button
              onClick={handleCompleteDay}
              disabled={!allTasksCompleted}
              className={cn(
                "btn-fire text-lg px-8 py-6",
                !allTasksCompleted && "opacity-50 cursor-not-allowed"
              )}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              {allTasksCompleted 
                ? `Completar Dia ${dayId}` 
                : `Complete todas as ${totalTasks} tarefas`
              }
            </Button>
            
            {!allTasksCompleted && (
              <p className="text-sm text-muted-foreground mt-3">
                {totalTasks - completedTasksCount} tarefa(s) restante(s)
              </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DayPage;
