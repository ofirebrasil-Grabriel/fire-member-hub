export type AiDayReportPayload = Record<string, unknown>;

export type AiDayReportSections = {
  toneMessage: string;
  summary: string;
  highlights: string[];
  extras: Array<{ title: string; value: string | string[] }>;
};

const toText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const toList = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item)).filter(Boolean);
};

const formatLabel = (key: string) =>
  key
    .replace(/_/g, ' ');

const titleCase = (value: string) =>
  value
    .split(' ')
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ');

const KNOWN_KEYS = new Set([
  'summary',
  'highlights',
  'tone_message',
  'toneMessage',
]);

const LABEL_OVERRIDES: Record<string, string> = {
  care_actions: 'Acoes de cuidado',
  actions: 'Acoes do dia',
  risks: 'Acoes de cuidado',
  next_actions: 'Orientacoes do dia',
  next_steps: 'Orientacoes do dia',
  actions_today: 'Orientacoes de hoje',
  proximos_passos: 'Orientacoes do dia',
  passos_de_hoje: 'Orientacoes de hoje',
  tarefas_hoje: 'Tarefas de hoje',
  tarefas_de_hoje: 'Tarefas de hoje',
  orientacoes: 'Orientacoes do dia',
  orientacoes_de_hoje: 'Orientacoes de hoje',
  foco_do_dia: 'Foco do dia',
};

export const extractAiSections = (payload: AiDayReportPayload | null): AiDayReportSections => {
  const source = payload && typeof payload === 'object' ? payload : {};

  const toneMessage = toText(source.tone_message ?? source.toneMessage);
  const summary = toText(source.summary);
  const highlights = toList(source.highlights);

  const extras: Array<{ title: string; value: string | string[] }> = [];
  Object.entries(source).forEach(([key, value]) => {
    if (KNOWN_KEYS.has(key)) return;
    if (value === null || value === undefined) return;
    if (typeof value === 'string' && !value.trim()) return;

    const customTitle = LABEL_OVERRIDES[key];

    if (Array.isArray(value)) {
      const list = value.map((item) => String(item)).filter(Boolean);
      if (list.length === 0) return;
      extras.push({ title: customTitle ?? titleCase(formatLabel(key)), value: list });
      return;
    }

    if (typeof value === 'object') {
      try {
        const text = JSON.stringify(value);
        extras.push({ title: customTitle ?? titleCase(formatLabel(key)), value: text });
      } catch {
        return;
      }
      return;
    }

    extras.push({ title: customTitle ?? titleCase(formatLabel(key)), value: String(value) });
  });

  return {
    toneMessage,
    summary,
    highlights,
    extras,
  };
};

export const formatAiDayReportText = (payload: AiDayReportPayload | null): string => {
  const sections = extractAiSections(payload);
  const lines: string[] = [];

  if (sections.toneMessage) {
    lines.push(sections.toneMessage);
    lines.push('');
  }

  if (sections.summary) {
    lines.push('RESUMO');
    lines.push(sections.summary);
    lines.push('');
  }

  if (sections.highlights.length > 0) {
    lines.push('DESTAQUES');
    sections.highlights.forEach((item) => lines.push(`- ${item}`));
    lines.push('');
  }

  sections.extras.forEach((extra) => {
    lines.push(extra.title.toUpperCase());
    if (Array.isArray(extra.value)) {
      extra.value.forEach((item) => lines.push(`- ${item}`));
    } else {
      lines.push(extra.value);
    }
    lines.push('');
  });

  return lines.join('\n').trim();
};
