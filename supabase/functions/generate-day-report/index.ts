import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
// @deno-types="https://esm.sh/@supabase/supabase-js@2"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type AiReportPayload = Record<string, unknown>;

type AiReportNormalized = {
  summary: string;
  highlights: string[];
  risks: string[];
  next_actions: string[];
  tone_message: string;
};

type Provider = 'openai' | 'google';

type SettingsMap = {
  ai_enabled?: boolean;
  ai_provider?: Provider;
  ai_model?: string;
  ai_budget_brl?: number;
  ai_prompt_version?: string;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_PRICING_USD: Record<string, { input: number; output: number }> = {
  'gpt-4o-mini': { input: 0.15, output: 0.6 },
  'gpt-4o': { input: 5, output: 15 },
};

const DEFAULT_USD_BRL_RATE = 5.0;

const parseSettingValue = (value: unknown): unknown => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return '';
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  }
  return value;
};

const buildSettings = (rows: Array<{ key: string; value: unknown }>): SettingsMap => {
  const map: SettingsMap = {};
  for (const row of rows) {
    const parsed = parseSettingValue(row.value);
    switch (row.key) {
      case 'ai_enabled':
        map.ai_enabled = Boolean(parsed);
        break;
      case 'ai_provider':
        map.ai_provider = typeof parsed === 'string' ? (parsed as Provider) : undefined;
        break;
      case 'ai_model':
        map.ai_model = typeof parsed === 'string' ? parsed : undefined;
        break;
      case 'ai_budget_brl':
        map.ai_budget_brl = Number(parsed) || 0;
        break;
      case 'ai_prompt_version':
        map.ai_prompt_version = typeof parsed === 'string' ? parsed : undefined;
        break;
      default:
        break;
    }
  }
  return map;
};

const normalizeReport = (value: AiReportPayload): AiReportNormalized => {
  const safe = (text: unknown) => (typeof text === 'string' ? text.trim() : '');
  const safeList = (list: unknown) =>
    Array.isArray(list) ? list.map((item) => String(item)).filter(Boolean) : [];

  return {
    summary: safe(value.summary),
    highlights: safeList(value.highlights).slice(0, 3),
    risks: safeList(value.risks).slice(0, 3),
    next_actions: safeList(value.next_actions).slice(0, 3),
    tone_message: safe(value.tone_message),
  };
};

const extractSections = (payload: AiReportPayload) => {
  const toText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
  const toList = (value: unknown) =>
    Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : [];
  const formatLabel = (key: string) => key.replace(/_/g, ' ');
  const titleCase = (value: string) =>
    value
      .split(' ')
      .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
      .join(' ');

  const knownKeys = new Set([
    'summary',
    'highlights',
    'tone_message',
    'toneMessage',
  ]);

  const labelOverrides: Record<string, string> = {
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

  const toneMessage = toText(payload.tone_message ?? payload.toneMessage);
  const summary = toText(payload.summary);
  const highlights = toList(payload.highlights);

  const extras: Array<{ title: string; value: string | string[] }> = [];
  Object.entries(payload).forEach(([key, value]) => {
    if (knownKeys.has(key)) return;
    if (value === null || value === undefined) return;
    if (typeof value === 'string' && !value.trim()) return;

    const customTitle = labelOverrides[key];

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

  return { toneMessage, summary, highlights, extras };
};

const formatReportText = (payload: AiReportPayload): string => {
  const sections = extractSections(payload);
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

const buildPrompt = (
  dayId: number,
  dayTitle: string,
  formData: unknown,
  metrics: unknown,
  userName: string | null,
  dayContext: unknown
) => {
  const system = `Você é o Mentor do Desafio FIRE 15D. Sua missão é processar os dados do dia e devolver clareza, segurança e direção.
Diretrizes de Tom:
- Empatia Radical: Sem julgamentos, foco na evolução.
- Linguagem Positiva: Substitua termos de "falha/risco" por "oportunidade/proteção".
- Identidade: Você é um guia humano e estratégico, nunca se identifique como IA.
- Foco: Transformar dados frios em clareza emocional e estratégica.`;
  const user = `
DADOS DO DIA (JSON):
${JSON.stringify({
  day_id: dayId,
  day_title: dayTitle,
  user_name: userName,
  form_data: formData,
  metrics,
  day_context: dayContext,
})}
DADOS DO DIA ${dayId} - ${dayTitle}:
Usuário: ${userName || "Participante"}
Entradas do Formulário: ${JSON.stringify(formData)}
Métricas Calculadas: ${JSON.stringify(metrics)}
Contexto do dia: ${dayContext ? JSON.stringify(dayContext) : 'Sem contexto adicional'}

TAREFA:
Analise as entradas acima e gere um relatório em JSON puro, focado no dia atual. Use o contexto do dia (mensagem matinal, conceito FIRE, objetivo do dia) para ajustar o tom e a orientacao.
Adapte o conteúdo ao tipo de dado (emocional, numérico, planejamento).
O JSON deve conter:
- summary: resumo curto do que os dados mostram
- highlights: lista com pontos positivos ou insights importantes
- tone_message: frase de apoio para reduzir ansiedade (use o nome do usuario uma vez, se tiver)
- 1 a 3 campos personalizados, criados por voce conforme o dia (ex.: orientacoes_hoje, tarefas_hoje, foco_do_dia, resumo_emocional, clareza_financeira, etc.)

Regras:
- Responda apenas com JSON valido (sem markdown).
- Frases curtas, claras e diretas.
- Linguagem positiva e construtiva; nao use palavras como \"risco\", \"problema\", \"falha\".
- Nao use emojis.
- Se faltar dados, mantenha tom acolhedor e pratico.
`;
  return { system, user };
};

const generateOpenAIReport = async (
  prompt: { system: string; user: string },
  model: string,
  apiKey: string,
  usdToBrl: number
) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? '{}';
  const usage = data.usage || {};
  const promptTokens = Number(usage.prompt_tokens) || 0;
  const completionTokens = Number(usage.completion_tokens) || 0;
  const pricing = OPENAI_PRICING_USD[model] || OPENAI_PRICING_USD['gpt-4o-mini'];
  const costUsd = (promptTokens / 1_000_000) * pricing.input + (completionTokens / 1_000_000) * pricing.output;
  const costBrl = costUsd * usdToBrl;

  return {
    raw: content,
    tokens: promptTokens + completionTokens,
    costBrl,
  };
};

const generateGoogleReport = async (
  prompt: { system: string; user: string },
  model: string,
  apiKey: string
) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${prompt.system}\n\n${prompt.user}` }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          response_mime_type: 'application/json',
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google AI error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';

  return {
    raw,
    tokens: null as number | null,
    costBrl: null as number | null,
  };
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    return new Response(JSON.stringify({ error: 'Missing Supabase env' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: authHeader } },
  });
  const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();

  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const body = await req.json();
  const dayId = Number(body?.day_id);
  const dayTitle = String(body?.day_title || '');
  const userName = body?.user_name ? String(body.user_name) : null;
  const formData = body?.form_data ?? {};
  const metrics = body?.metrics ?? [];
  const dayContext = body?.day_context ?? null;

  if (!dayId || Number.isNaN(dayId)) {
    return new Response(JSON.stringify({ error: 'Invalid day_id' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { data: settingsRows, error: settingsError } = await adminClient
    .from('settings')
    .select('key, value')
    .in('key', ['ai_enabled', 'ai_provider', 'ai_model', 'ai_budget_brl', 'ai_prompt_version']);

  if (settingsError) {
    return new Response(JSON.stringify({ error: 'Settings not available' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const settings = buildSettings(settingsRows || []);
  const aiEnabled = settings.ai_enabled ?? true;
  const budgetBrl = settings.ai_budget_brl ?? 0;
  const usdToBrl = DEFAULT_USD_BRL_RATE;

  if (!aiEnabled || budgetBrl <= 0) {
    return new Response(JSON.stringify({ status: 'disabled' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { data: usageRows } = await adminClient
    .from('ai_day_reports')
    .select('cost_brl')
    .gte('created_at', monthStart.toISOString());

  const spent = (usageRows || []).reduce((sum: number, row: { cost_brl: number | null }) => {
    return sum + (Number(row.cost_brl) || 0);
  }, 0);
  if (spent >= budgetBrl) {
    return new Response(JSON.stringify({ status: 'budget_exceeded', spent_brl: spent }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const provider = settings.ai_provider ?? 'openai';
  const model = settings.ai_model ?? (provider === 'google' ? 'gemini-1.5-flash' : 'gpt-4o-mini');
  const promptVersion = settings.ai_prompt_version ?? 'v1';

  const prompt = buildPrompt(dayId, dayTitle, formData, metrics, userName, dayContext);

  let rawContent = '{}';
  let tokensTotal: number | null = null;
  let costBrl: number | null = null;

  if (provider === 'google') {
    const apiKey = Deno.env.get('GOOGLE_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing GOOGLE_API_KEY' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const result = await generateGoogleReport(prompt, model, apiKey);
    rawContent = result.raw;
    tokensTotal = result.tokens;
    costBrl = result.costBrl;
  } else {
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const result = await generateOpenAIReport(prompt, model, apiKey, usdToBrl);
    rawContent = result.raw;
    tokensTotal = result.tokens;
    costBrl = result.costBrl;
  }

  let payload: AiReportPayload = {};
  try {
    const parsed = JSON.parse(rawContent);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      payload = parsed as AiReportPayload;
    }
  } catch {
    payload = {};
  }

  const normalized = normalizeReport(payload);
  if (!normalized.summary) {
    normalized.summary = 'Dados recebidos. Vamos transformar isso em clareza nos proximos dias.';
  }

  if (!payload.summary) {
    payload = { ...payload, summary: normalized.summary };
  }
  if (normalized.tone_message && !payload.tone_message) {
    payload = { ...payload, tone_message: normalized.tone_message };
  }

  const analysisText = formatReportText(payload);

  const { error: upsertError } = await adminClient
    .from('ai_day_reports')
    .upsert(
      {
        user_id: user.id,
        day_id: dayId,
        analysis_json: payload,
        analysis_text: analysisText,
        provider,
        model,
        prompt_version: promptVersion,
        tokens_total: tokensTotal,
        cost_brl: costBrl,
      },
      { onConflict: 'user_id,day_id' }
    );

  if (upsertError) {
    return new Response(JSON.stringify({ error: 'Failed to store report' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({ status: 'ok', analysis: payload, analysis_text: analysisText }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
