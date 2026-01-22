import { supabase } from '@/integrations/supabase/client';
import { AiDayReportPayload } from '@/lib/aiDayReport';

export type AiDayReportMeta = {
  report: AiDayReportPayload | null;
  updatedAt: string | null;
};

const coercePayload = (value: unknown): AiDayReportPayload | null => {
  if (!value) return null;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === 'object') {
        return parsed as AiDayReportPayload;
      }
    } catch {
      return null;
    }
  }
  if (typeof value === 'object') {
    return value as AiDayReportPayload;
  }
  return null;
};

export const fetchAiDayReportMeta = async (userId: string, dayId: number): Promise<AiDayReportMeta> => {
  const { data, error } = await supabase
    .from('ai_day_reports')
    .select('analysis_json, updated_at')
    .eq('user_id', userId)
    .eq('day_id', dayId)
    .maybeSingle();

  if (error) {
    console.warn('Erro ao carregar ai_day_reports:', error.message);
    return { report: null, updatedAt: null };
  }

  if (!data?.analysis_json) return { report: null, updatedAt: data?.updated_at ?? null };

  return {
    report: coercePayload(data.analysis_json),
    updatedAt: data?.updated_at ?? null,
  };
};

export const generateAiDayReport = async (payload: {
  dayId: number;
  dayTitle: string;
  formData: Record<string, unknown>;
  metrics: unknown[];
  userName?: string | null;
  dayContext?: Record<string, unknown> | null;
}): Promise<{ status: string; report: AiDayReportPayload | null }> => {
  const { data, error } = await supabase.functions.invoke('generate-day-report', {
    body: {
      day_id: payload.dayId,
      day_title: payload.dayTitle,
      form_data: payload.formData,
      metrics: payload.metrics,
      user_name: payload.userName ?? null,
      day_context: payload.dayContext ?? null,
    },
  });

  if (error) {
    console.warn('Erro ao gerar relatorio IA:', error.message);
    return { status: 'error', report: null };
  }

  const status = data?.status ?? 'unknown';
  const report = data?.analysis ? coercePayload(data.analysis) : null;

  return { status, report };
};
