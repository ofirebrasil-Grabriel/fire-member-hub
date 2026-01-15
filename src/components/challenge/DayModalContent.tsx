import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  FolderOpen,
  Lightbulb,
  Loader2,
  MessageSquare,
  Sunrise,
} from 'lucide-react';
import { useDay } from '@/hooks/useDays';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { AudioExpandableCard } from '@/components/day/AudioExpandableCard';
import { ToolsList } from '@/components/day/ToolsList';
import { DiaryEntry } from '@/components/day/DiaryEntry';
import { cn } from '@/lib/utils';

interface DayModalContentProps {
  dayId: number;
}

interface DayStep {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const DayModalContent = ({ dayId }: DayModalContentProps) => {
  const { day, loading } = useDay(dayId);
  const { progress } = useUserProgress();
  const [openStepId, setOpenStepId] = useState<string | null>(null);
  const dayProgress = progress.daysProgress[dayId];
  const hasDiary = Boolean(dayProgress?.diaryEntry?.trim());

  const steps = useMemo<DayStep[]>(() => {
    if (!day) return [];
    const entries: DayStep[] = [];

    if (day.morningMessage) {
      entries.push({
        id: 'morning',
        title: 'Mensagem Matinal',
        description: 'Inicie o dia com o recado principal',
        icon: <Sunrise className="h-4 w-4 text-primary" />,
        content: (
          <AudioExpandableCard
            title="Tema do Dia:"
            subtitle={day.subtitle || undefined}
            text={day.morningMessage}
            audioUrl={day.morningAudioUrl || undefined}
          />
        ),
      });
    }

    if (day.concept) {
      entries.push({
        id: 'concept',
        title: 'Conceito FIRE',
        description: day.conceptTitle || 'Entenda o principio do dia',
        icon: <Lightbulb className="h-4 w-4 text-warning" />,
        content: (
          <AudioExpandableCard
            title="Conceito do Dia:"
            subtitle={day.conceptTitle || undefined}
            text={day.concept}
            audioUrl={day.conceptAudioUrl || undefined}
          />
        ),
      });
    }

    if (day.tools.length > 0) {
      entries.push({
        id: 'tools',
        title: 'Recursos extras',
        description: 'Materiais e recursos recomendados',
        icon: <FolderOpen className="h-4 w-4 text-primary" />,
        content: <ToolsList tools={day.tools} />,
      });
    }

    entries.push({
      id: 'diary',
      title: 'Diario de Sentimentos',
      description: 'Escreva suas reflexoes do dia',
      completed: hasDiary,
      icon: <BookOpen className="h-4 w-4 text-primary" />,
      content: <DiaryEntry dayId={dayId} />,
    });

    if (day.reflectionQuestions.length > 0) {
      entries.push({
        id: 'reflection',
        title: 'Reflexao Guiada',
        description: 'Perguntas para aprofundar o dia',
        icon: <MessageSquare className="h-4 w-4 text-primary" />,
        content: (
          <div className="glass-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <h4 className="font-semibold">Reflexao guiada</h4>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {day.reflectionQuestions.map((question, index) => (
                <li key={question} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface text-xs text-muted-foreground">
                    {index + 1}
                  </span>
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </div>
        ),
      });
    }

    if (day.nextDayPreview) {
      entries.push({
        id: 'next-day',
        title: 'Amanha',
        description: 'O que vem a seguir',
        icon: <ArrowRight className="h-4 w-4 text-primary" />,
        content: (
          <div className="glass-card p-6">
            <h4 className="mb-3 font-semibold">Amanha</h4>
            <p className="text-sm text-muted-foreground">{day.nextDayPreview}</p>
          </div>
        ),
      });
    }

    return entries;
  }, [day, dayId, hasDiary]);

  const firstIncomplete = useMemo(
    () => steps.find((step) => !step.completed) ?? steps[0] ?? null,
    [steps]
  );

  useEffect(() => {
    setOpenStepId(null);
  }, [dayId]);

  useEffect(() => {
    if (!openStepId && firstIncomplete) {
      setOpenStepId(firstIncomplete.id);
    }
  }, [firstIncomplete, openStepId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Carregando conteudo do dia...
      </div>
    );
  }

  if (!day) {
    return (
      <div className="glass-card p-4 text-sm text-muted-foreground">
        Conteudo do dia ainda nao disponivel.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="glass-card p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="font-semibold">Jornada do dia</h4>
            <p className="text-xs text-muted-foreground">
              Abra cada etapa para acessar o conteudo
            </p>
          </div>
        </div>

        <div className="space-y-0">
          {steps.map((step, index) => {
            const isOpen = openStepId === step.id;
            const prevStep = steps[index - 1];
            const isPrevOpen = prevStep && openStepId === prevStep.id;
            const showBorderTop = index > 0 && !isOpen && !isPrevOpen;

            return (
              <div
                key={step.id}
                className={cn('group', isOpen && 'rounded-xl', showBorderTop && 'border-t border-border/50')}
              >
                <div
                  className={cn(
                    'relative overflow-hidden rounded-xl transition-colors',
                    isOpen && 'border border-border/60 bg-surface/40'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenStepId(isOpen ? null : step.id)}
                    className={cn(
                      'flex w-full items-start gap-3 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      isOpen && 'rounded-xl'
                    )}
                  >
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-surface/70">
                      {step.icon}
                    </div>
                    <div className="mt-1 flex-1">
                      <h5 className={cn('font-semibold', step.completed && 'text-primary')}>
                        {step.title}
                      </h5>
                      {step.description && (
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      )}
                    </div>
                    {!isOpen && (
                      <ChevronRight className="mt-1 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    )}
                  </button>
                  <div
                    className={cn(
                      'overflow-hidden px-4 pb-4 transition-all duration-200',
                      isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    )}
                  >
                    {step.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
