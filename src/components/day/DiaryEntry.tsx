import { useState, useEffect } from 'react';
import { BookOpen, Save } from 'lucide-react';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface DiaryEntryProps {
  dayId: number;
}

export const DiaryEntry = ({ dayId }: DiaryEntryProps) => {
  const { progress, updateDayProgress } = useUserProgress();
  const [entry, setEntry] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedEntry = progress.daysProgress[dayId]?.diaryEntry || '';
    setEntry(savedEntry);
  }, [dayId, progress.daysProgress]);

  const handleSave = () => {
    updateDayProgress(dayId, { diaryEntry: entry });
    setSaved(true);
    toast({
      title: "Diário salvo!",
      description: "Suas reflexões foram registradas com sucesso.",
    });
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Diário de Sentimentos</h3>
          <p className="text-sm text-muted-foreground">
            Registre suas reflexões e emoções do dia
          </p>
        </div>
      </div>
      
      <Textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Como você está se sentindo hoje? O que aprendeu? Quais desafios enfrentou?"
        className="min-h-[150px] bg-surface/50 border-border/50 resize-none focus:border-primary"
      />
      
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-muted-foreground">
          {entry.length} caracteres
        </span>
        <Button 
          onClick={handleSave}
          className="btn-fire"
          disabled={!entry.trim()}
        >
          <Save className="w-4 h-4 mr-2" />
          {saved ? 'Salvo!' : 'Salvar'}
        </Button>
      </div>
    </div>
  );
};
