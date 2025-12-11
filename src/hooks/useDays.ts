import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TaskStep {
  id: string;
  text: string;
}

export interface ResourceFile {
  name: string;
  url: string;
  type: string;
}

export interface DayContent {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  morningMessage: string | null;
  morningAudioUrl: string | null;
  concept: string | null;
  conceptTitle: string | null;
  conceptAudioUrl: string | null;
  taskTitle: string | null;
  taskSteps: TaskStep[];
  tools: ResourceFile[];
  reflectionQuestions: string[];
  commitment: string | null;
  nextDayPreview: string | null;
  description: string | null;
}

interface DatabaseDay {
  id: number;
  title: string;
  subtitle: string;
  emoji: string | null;
  morning_message: string | null;
  morning_audio_url: string | null;
  concept: string | null;
  concept_title: string | null;
  concept_audio_url: string | null;
  task_title: string | null;
  task_steps: any;
  tools: any;
  reflection_questions: string[] | null;
  commitment: string | null;
  next_day_preview: string | null;
  description: string | null;
}

const mapDatabaseToContent = (dbDay: DatabaseDay): DayContent => {
  // Parse tools - support both old string[] format and new ResourceFile[] format
  let parsedTools: ResourceFile[] = [];
  if (Array.isArray(dbDay.tools)) {
    parsedTools = dbDay.tools.map((tool: any) => {
      if (typeof tool === 'string') {
        return { name: tool, url: '', type: 'text' };
      }
      return tool as ResourceFile;
    });
  }

  // Parse task_steps
  let parsedTasks: TaskStep[] = [];
  if (Array.isArray(dbDay.task_steps)) {
    parsedTasks = dbDay.task_steps.map((task: any) => ({
      id: task.id || `task-${Math.random()}`,
      text: task.text || ''
    }));
  }

  return {
    id: dbDay.id,
    title: dbDay.title,
    subtitle: dbDay.subtitle,
    emoji: dbDay.emoji || '📅',
    morningMessage: dbDay.morning_message,
    morningAudioUrl: dbDay.morning_audio_url,
    concept: dbDay.concept,
    conceptTitle: dbDay.concept_title,
    conceptAudioUrl: dbDay.concept_audio_url,
    taskTitle: dbDay.task_title,
    taskSteps: parsedTasks,
    tools: parsedTools,
    reflectionQuestions: dbDay.reflection_questions || [],
    commitment: dbDay.commitment,
    nextDayPreview: dbDay.next_day_preview,
    description: dbDay.description,
  };
};

export const useDays = () => {
  const [days, setDays] = useState<DayContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDays();
  }, []);

  const fetchDays = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error: fetchError } = await supabase
      .from('days')
      .select('*')
      .order('id', { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    const mappedDays = (data || []).map(mapDatabaseToContent);
    setDays(mappedDays);
    setLoading(false);
  };

  return { days, loading, error, refetch: fetchDays };
};

export const useDay = (dayId: number) => {
  const [day, setDay] = useState<DayContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (dayId) {
      fetchDay();
    }
  }, [dayId]);

  const fetchDay = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error: fetchError } = await supabase
      .from('days')
      .select('*')
      .eq('id', dayId)
      .single();

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    if (data) {
      setDay(mapDatabaseToContent(data));
    }
    setLoading(false);
  };

  return { day, loading, error, refetch: fetchDay };
};
