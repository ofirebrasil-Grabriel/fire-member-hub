import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface Day13LifeRulesProps {
  onComplete: (values: Record<string, unknown>) => void;
  defaultValues?: Record<string, unknown>;
}

const MANTRA_SUGGESTIONS = [
  'Disciplina hoje, liberdade amanhã.',
  'Regras claras protegem meu futuro.',
  'Eu decido antes do impulso.',
  'Cada escolha fortalece minha liberdade.',
];

const Day13LifeRules: React.FC<Day13LifeRulesProps> = ({ onComplete, defaultValues }) => {
  const [rule1, setRule1] = useState('');
  const [rule2, setRule2] = useState('');
  const [rule3, setRule3] = useState('');
  const [mantra, setMantra] = useState('');

  useEffect(() => {
    if (!defaultValues) return;
    if (defaultValues.rule_1) setRule1(String(defaultValues.rule_1));
    if (defaultValues.rule_2) setRule2(String(defaultValues.rule_2));
    if (defaultValues.rule_3) setRule3(String(defaultValues.rule_3));
    if (defaultValues.mantra) setMantra(String(defaultValues.mantra));
  }, [defaultValues]);

  const previewMantra = useMemo(() => {
    if (mantra.trim()) return mantra.trim();
    if (rule1.trim()) return rule1.trim();
    return 'Regras claras protegem meu futuro.';
  }, [mantra, rule1]);

  const canComplete = rule1.trim() && rule2.trim() && rule3.trim();

  const handleComplete = () => {
    if (!canComplete) {
      toast({ title: 'Preencha as 3 regras de vida', variant: 'destructive' });
      return;
    }

    onComplete({
      rule_1: rule1.trim(),
      rule_2: rule2.trim(),
      rule_3: rule3.trim(),
      mantra: previewMantra,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="glass-card border-primary/10">
        <CardContent className="p-4 text-sm text-muted-foreground">
          Escreva 3 regras simples que te protegem de recaidas. Depois escolha um mantra.
        </CardContent>
      </Card>

      <Card className="glass-card border-border/60">
        <CardContent className="p-4 space-y-4">
          <Input
            value={rule1}
            onChange={(event) => setRule1(event.target.value)}
            placeholder="Regra 1 (ex: Compras acima de R$100 so depois de 24h)"
            className="bg-background"
          />
          <Input
            value={rule2}
            onChange={(event) => setRule2(event.target.value)}
            placeholder="Regra 2 (ex: Revisar gastos todo domingo)"
            className="bg-background"
          />
          <Input
            value={rule3}
            onChange={(event) => setRule3(event.target.value)}
            placeholder="Regra 3 (ex: Lazer limitado a R$X por semana)"
            className="bg-background"
          />
        </CardContent>
      </Card>

      <Card className="glass-card border-primary/10">
        <CardContent className="p-4 space-y-3">
          <p className="text-xs uppercase text-muted-foreground">Mantra pessoal</p>
          <Textarea
            value={mantra}
            onChange={(event) => setMantra(event.target.value)}
            placeholder="Escreva uma frase curta de compromisso"
            rows={3}
            className="bg-background"
          />
          <div className="flex flex-wrap gap-2">
            {MANTRA_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setMantra(suggestion)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs transition-colors',
                  mantra === suggestion
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border/60 hover:bg-muted/40'
                )}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-primary/10">
        <CardContent className="p-4 space-y-2 text-sm">
          <p className="font-semibold">Resumo das suas regras</p>
          <p>1. {rule1 || '—'}</p>
          <p>2. {rule2 || '—'}</p>
          <p>3. {rule3 || '—'}</p>
          <p className="text-muted-foreground">Mantra: {previewMantra}</p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="btn-fire" onClick={handleComplete} disabled={!canComplete}>
          Concluir Dia 13
        </Button>
      </div>
    </div>
  );
};

export default Day13LifeRules;
