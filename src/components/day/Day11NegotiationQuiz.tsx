import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface Day11NegotiationQuizProps {
  onComplete: (values: Record<string, unknown>) => void;
  defaultValues?: Record<string, unknown>;
}

interface QuizOption {
  value: string;
  label: string;
  isCorrect?: boolean;
}

interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
  hint: string;
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    prompt: 'O credor oferece a primeira proposta com desconto baixo. O que fazer?',
    hint: 'Negociacao costuma melhorar com contra-proposta.',
    options: [
      { value: 'accept', label: 'Aceitar imediatamente para encerrar', isCorrect: false },
      { value: 'counter', label: 'Pedir proposta por escrito e fazer contra-proposta', isCorrect: true },
      { value: 'ignore', label: 'Desligar e nunca mais responder', isCorrect: false },
    ],
  },
  {
    id: 'q2',
    prompt: 'O atendente pede pagamento antecipado para "liberar o acordo".',
    hint: 'Golpes sao comuns nesse ponto.',
    options: [
      { value: 'pay', label: 'Pagar para garantir o acordo', isCorrect: false },
      { value: 'verify', label: 'Recusar e verificar canais oficiais', isCorrect: true },
      { value: 'split', label: 'Pagar metade agora e metade depois', isCorrect: false },
    ],
  },
  {
    id: 'q3',
    prompt: 'Sua parcela proposta passa do limite mensal definido no Dia 10.',
    hint: 'Prometer mais do que pode gera novos atrasos.',
    options: [
      { value: 'accept', label: 'Aceitar mesmo assim para resolver logo', isCorrect: false },
      { value: 'adjust', label: 'Negociar prazo ou desconto para caber no limite', isCorrect: true },
      { value: 'ignore', label: 'Seguir sem registrar no plano', isCorrect: false },
    ],
  },
  {
    id: 'q4',
    prompt: 'O credor afirma que nao pode reduzir juros, mas oferece prazo maior.',
    hint: 'Prazo maior reduz parcela, mas aumenta custo total.',
    options: [
      { value: 'accept', label: 'Aceitar sem analisar o custo total', isCorrect: false },
      { value: 'analyze', label: 'Pedir simulacao e comparar custo total', isCorrect: true },
      { value: 'quit', label: 'Encerrar a negociacao imediatamente', isCorrect: false },
    ],
  },
];

const Day11NegotiationQuiz: React.FC<Day11NegotiationQuizProps> = ({ onComplete, defaultValues }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [confidence, setConfidence] = useState(5);
  const [keyLearnings, setKeyLearnings] = useState('');

  useEffect(() => {
    if (!defaultValues) return;
    if (defaultValues.confidence_level !== undefined) {
      setConfidence(Number(defaultValues.confidence_level) || 0);
    }
    if (defaultValues.key_learnings) {
      setKeyLearnings(String(defaultValues.key_learnings));
    }
  }, [defaultValues]);

  const score = useMemo(() => {
    return QUESTIONS.reduce((acc, question) => {
      const answer = answers[question.id];
      const option = question.options.find((item) => item.value === answer);
      return acc + (option?.isCorrect ? 1 : 0);
    }, 0);
  }, [answers]);

  const allAnswered = QUESTIONS.every((question) => Boolean(answers[question.id]));
  const canComplete = allAnswered;

  const handleComplete = () => {
    if (!canComplete) {
      toast({ title: 'Responda todas as perguntas do quiz', variant: 'destructive' });
      return;
    }

    onComplete({
      quiz_score: score,
      confidence_level: confidence,
      key_learnings: keyLearnings,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="glass-card border-primary/10">
        <CardContent className="p-4 text-sm text-muted-foreground">
          Treine cenarios reais antes de falar com credores. Responda e veja o que reforcar.
        </CardContent>
      </Card>

      <div className="space-y-4">
        {QUESTIONS.map((question, index) => (
          <Card key={question.id} className="glass-card border-border/60">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Cenario {index + 1}</p>
                  <h4 className="text-sm font-semibold">{question.prompt}</h4>
                </div>
                <span className="text-[11px] text-muted-foreground">{question.hint}</span>
              </div>

              <div className="grid gap-2">
                {question.options.map((option) => {
                  const selected = answers[question.id] === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() =>
                        setAnswers((prev) => ({ ...prev, [question.id]: option.value }))
                      }
                      className={cn(
                        'w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors',
                        selected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border/60 hover:bg-muted/40'
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass-card border-primary/10">
          <CardContent className="p-4 space-y-3">
            <p className="text-xs uppercase text-muted-foreground">Sua pontuacao</p>
            <div className="text-2xl font-bold text-primary">
              {score}/{QUESTIONS.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Respostas corretas para aumentar seguranca.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-primary/10">
          <CardContent className="p-4 space-y-3">
            <p className="text-xs uppercase text-muted-foreground">Confianca para negociar</p>
            <Slider
              value={[confidence]}
              min={0}
              max={10}
              step={1}
              onValueChange={(value) => setConfidence(value[0] ?? 0)}
            />
            <p className="text-xs text-muted-foreground">Nivel atual: {confidence}/10</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-primary/10">
        <CardContent className="p-4 space-y-3">
          <p className="text-xs uppercase text-muted-foreground">Aprendizados principais</p>
          <Textarea
            value={keyLearnings}
            onChange={(event) => setKeyLearnings(event.target.value)}
            placeholder="Ex: sempre pedir proposta por escrito, nao aceitar primeira oferta..."
            rows={3}
            className="bg-background"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="btn-fire" onClick={handleComplete} disabled={!canComplete}>
          Concluir Dia 11
        </Button>
      </div>
    </div>
  );
};

export default Day11NegotiationQuiz;
