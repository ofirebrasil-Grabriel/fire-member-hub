import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Target } from 'lucide-react';

interface DayTaskIntroProps {
  title: string;
  motivation: string;
  description: string;
  benefit: string;
  onStart: () => void;
  ctaLabel?: string;
}

const DayTaskIntro: React.FC<DayTaskIntroProps> = ({
  title,
  motivation,
  description,
  benefit,
  onStart,
  ctaLabel = 'Comecar tarefa',
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="glass-card border-primary/20">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/15 p-2">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Mensagem do dia</p>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{motivation}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-border/60">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-muted/50 p-2">
              <Target className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">O que voce vai fazer hoje</p>
              <p className="text-sm text-muted-foreground">{description}</p>
              <p className="text-sm text-muted-foreground">{benefit}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="btn-fire gap-2" onClick={onStart}>
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DayTaskIntro;
