import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

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
  iconName: string | null;
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
  icon_name: string | null;
  morning_message: string | null;
  morning_audio_url: string | null;
  concept: string | null;
  concept_title: string | null;
  concept_audio_url: string | null;
  task_title: string | null;
  task_steps: Json | null;
  tools: Json | null;
  reflection_questions: string[] | null;
  commitment: string | null;
  next_day_preview: string | null;
  description: string | null;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const tryParseJson = (value: string): unknown | null => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const parseToolString = (raw: string) => {
  let trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    trimmed = trimmed.slice(1, -1);
  }

  const tryParseVariants = (value: string): unknown => {
    let parsed = tryParseJson(value);

    // Recursive parsing for double-stringified JSON
    if (typeof parsed === 'string' && (parsed.startsWith('{') || parsed.startsWith('['))) {
      return tryParseVariants(parsed);
    }

    if (!parsed && value.includes('\\"')) {
      parsed = tryParseJson(value.replace(/\\"/g, '"'));
    }

    return parsed;
  };

  let parsed = tryParseVariants(trimmed);
  if (!parsed && trimmed.includes("'")) {
    parsed = tryParseVariants(trimmed.replace(/'/g, '"'));
  }

  if (isRecord(parsed)) {
    return {
      name: String(parsed.name ?? 'Recurso'),
      url: String(parsed.url ?? ''),
      type: String(parsed.type ?? 'text'),
    };
  }

  const nameMatch = trimmed.match(/['"]name['"]\s*:\s*['"]([^'"]+)['"]/);
  const urlMatch = trimmed.match(/['"]url['"]\s*:\s*['"]([^'"]+)['"]/);
  if (nameMatch || urlMatch) {
    return {
      name: nameMatch?.[1] ?? 'Recurso',
      url: urlMatch?.[1] ?? '',
      type: 'text',
    };
  }

  return null;
};

const mapDatabaseToContent = (dbDay: DatabaseDay): DayContent => {
  // Parse tools - support both old string[] format and new ResourceFile[] format
  let parsedTools: ResourceFile[] = [];
  if (Array.isArray(dbDay.tools)) {
    parsedTools = dbDay.tools.map((tool) => {
      // Caso 1: tool é uma string (formato antigo)
      if (typeof tool === 'string') {
        const parsed = parseToolString(tool);
        return parsed ?? { name: tool, url: '', type: 'text' };
      }

      // Caso 2: tool é um objeto
      if (isRecord(tool)) {
        const nameValue = tool.name;
        const urlValue = tool.url;
        const typeValue = tool.type;

        // Se name é uma string simples (não parece JSON), usa direto
        if (typeof nameValue === 'string' && nameValue.trim() &&
          !nameValue.trim().startsWith('{') && !nameValue.trim().startsWith('[')) {
          return {
            name: nameValue.trim(),
            url: typeof urlValue === 'string' ? urlValue : '',
            type: typeof typeValue === 'string' ? typeValue : 'text',
          };
        }

        // Se name parece ser JSON, tenta parsear
        if (typeof nameValue === 'string' && nameValue.trim()) {
          const parsed = parseToolString(nameValue);
          if (parsed) return parsed;
        }

        // Fallback: tenta usar os campos como vieram, limpando se necessário
        let finalName = typeof nameValue === 'string' ? nameValue.trim() : 'Recurso';
        if (finalName.startsWith('{') || finalName.startsWith('[')) {
          finalName = 'Recurso';
        }

        return {
          name: finalName || 'Recurso',
          url: typeof urlValue === 'string' ? urlValue : '',
          type: typeof typeValue === 'string' ? typeValue : 'text',
        };
      }

      return { name: 'Recurso', url: '', type: 'text' };
    });
  }

  // Parse task_steps
  let parsedTasks: TaskStep[] = [];
  if (Array.isArray(dbDay.task_steps)) {
    parsedTasks = dbDay.task_steps.map((task, index) => {
      if (isRecord(task)) {
        return {
          id: String(task.id ?? `task-${index}`),
          text: String(task.text ?? ''),
        };
      }
      return { id: `task-${index}`, text: '' };
    });
  }

  return {
    id: dbDay.id,
    title: dbDay.title,
    subtitle: dbDay.subtitle,
    emoji: dbDay.emoji || '📅',
    iconName: dbDay.icon_name ?? null,
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

  const fetchDays = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchDays();
  }, [fetchDays]);

  return { days, loading, error, refetch: fetchDays };
};

export const useDay = (dayId: number) => {
  const [day, setDay] = useState<DayContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDay = useCallback(async () => {
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
  }, [dayId]);

  useEffect(() => {
    if (dayId) {
      fetchDay();
    }
  }, [dayId, fetchDay]);

  return { day, loading, error, refetch: fetchDay };
};
