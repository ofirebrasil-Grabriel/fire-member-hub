import { cn } from '@/lib/utils';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { moodOptions } from '@/data/challengeData';

interface MoodSelectorProps {
  dayId: number;
}

export const MoodSelector = ({ dayId }: MoodSelectorProps) => {
  const { progress, updateDayProgress } = useUserProgress();
  const selectedMood = progress.daysProgress[dayId]?.mood;

  const handleMoodSelect = (moodId: string) => {
    updateDayProgress(dayId, { mood: moodId });
  };

  return (
    <div className="glass-card p-6">
      <h3 className="font-semibold mb-2">Como você está se sentindo?</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Registre seu humor para acompanhar sua jornada emocional
      </p>
      
      <div className="flex flex-wrap gap-3">
        {moodOptions.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleMoodSelect(mood.id)}
            className={cn(
              "mood-btn",
              selectedMood === mood.id && "selected"
            )}
            title={mood.label}
          >
            {mood.emoji}
          </button>
        ))}
      </div>
      
      {selectedMood && (
        <p className="mt-4 text-sm text-muted-foreground">
          Humor registrado: <span className="text-foreground font-medium">
            {moodOptions.find(m => m.id === selectedMood)?.label}
          </span>
        </p>
      )}
    </div>
  );
};
