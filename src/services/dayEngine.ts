import { supabase } from '@/integrations/supabase/client';
import { DAY_ENGINE, DayConfig, OutputMetric } from '@/config/dayEngine';
import type { Json } from '@/integrations/supabase/types';

export interface OutputMetricValue extends OutputMetric {
  value: string | number;
}

const toNumber = (value: unknown) => {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return 0;

  const numeric = value.replace(/[^\d,.-]/g, '');
  if (!numeric) return 0;

  const normalized = numeric.includes(',')
    ? numeric.replace(/\./g, '').replace(',', '.')
    : numeric;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toBoolean = (value: unknown) => Boolean(value);

const splitLines = (value: unknown) => {
  if (typeof value !== 'string') return [] as string[];
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

const getMonthYear = (date = new Date()) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  return `${year}-${month}`;
};

const getDayOfWeekLabel = (value: number | null) => {
  const labels = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];
  if (value === null || value === undefined || value < 0 || value > 6) return '-';
  return labels[value] || '-';
};

export const getDayConfig = (dayId: number): DayConfig | undefined =>
  DAY_ENGINE.find((day) => day.id === dayId);

const extractEssentials = (payload: Record<string, unknown>) => {
  return Object.entries(payload).reduce<Record<string, number>>((acc, [key, value]) => {
    if (!key.startsWith('essentials_')) return acc;
    const mappedKey = key.replace('essentials_', '');
    acc[mappedKey] = toNumber(value);
    return acc;
  }, {});
};

const sumValues = (values: number[]) => values.reduce((total, value) => total + value, 0);

const saveUserProfile = async (userId: string, payload: Record<string, unknown>) => {
  // Check if profile exists
  const { data: existing } = await supabase
    .from('user_profile')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  const profileData = {
    fixed_time: (payload.fixed_time as string) || null,
    sources: (payload.sources as string[]) || [],
    anxiety_score: payload.anxiety_score === undefined ? null : toNumber(payload.anxiety_score),
    clarity_score: payload.clarity_score === undefined ? null : toNumber(payload.clarity_score),
    no_new_debt_commitment: toBoolean(payload.no_new_debt_commitment),
  };

  if (existing) {
    const { error } = await supabase
      .from('user_profile')
      .update(profileData)
      .eq('user_id', userId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('user_profile')
      .insert({ user_id: userId, ...profileData });
    if (error) throw error;
  }
};

const saveMonthlyBudget = async (userId: string, payload: Record<string, unknown>) => {
  const monthYear = (payload.month_year as string) || getMonthYear();
  const essentials = extractEssentials(payload);
  const essentialsTotal = sumValues(Object.values(essentials));
  const income = toNumber(payload.income);
  const minimumDebts = toNumber(payload.minimum_debts);
  const gap = income - essentialsTotal - minimumDebts;

  const { error } = await supabase
    .from('monthly_budget')
    .upsert(
      {
        user_id: userId,
        month_year: monthYear,
        income,
        essentials,
        minimum_debts: minimumDebts,
        gap,
      },
      { onConflict: 'user_id,month_year' }
    );

  if (error) throw error;

  return { gap, essentialsTotal, minimumDebts };
};

const saveCardPolicy = async (userId: string, payload: Record<string, unknown>) => {
  const { error } = await supabase
    .from('card_policy')
    .upsert(
      {
        user_id: userId,
        weekly_limit: toNumber(payload.weekly_limit),
        installment_rule: (payload.installment_rule as string) || null,
        blocked_categories: (payload.blocked_categories as string[]) || [],
      },
      { onConflict: 'user_id' }
    );

  if (error) throw error;
};

const savePlan306090 = async (userId: string, payload: Record<string, unknown>) => {
  const { error } = await supabase
    .from('plan_306090')
    .upsert(
      {
        user_id: userId,
        goals_30: splitLines(payload.goals_30),
        goals_60: splitLines(payload.goals_60),
        goals_90: splitLines(payload.goals_90),
      },
      { onConflict: 'user_id' }
    );

  if (error) throw error;
};

const saveWeeklyRitual = async (userId: string, payload: Record<string, unknown>) => {
  const { error } = await supabase
    .from('weekly_ritual')
    .upsert(
      {
        user_id: userId,
        day_of_week: payload.day_of_week === undefined ? null : Number(payload.day_of_week),
        checklist: splitLines(payload.checklist),
      },
      { onConflict: 'user_id' }
    );

  if (error) throw error;
};

const generateCalendarFromDebts = async (userId: string) => {
  const { data: debts, error: debtsError } = await supabase
    .from('debts')
    .select('id, creditor, installment_value, due_day, is_critical')
    .eq('user_id', userId);

  if (debtsError) throw debtsError;
  if (!debts || debts.length === 0) return;

  const { data: existingItems, error: itemsError } = await supabase
    .from('calendar_items')
    .select('source_debt_id, due_date')
    .eq('user_id', userId);

  if (itemsError) throw itemsError;

  const existingKeys = new Set(
    (existingItems || []).map(
      (item) => `${item.source_debt_id || 'none'}-${item.due_date || 'none'}`
    )
  );

  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  const itemsToInsert = debts
    .filter((debt) => debt.due_day)
    .map((debt) => {
      const day = Math.min(debt.due_day || 1, lastDay);
      const dueDate = new Date(now.getFullYear(), now.getMonth(), day)
        .toISOString()
        .slice(0, 10);

      return {
        user_id: userId,
        title: `Parcela - ${debt.creditor}`,
        value: debt.installment_value,
        due_date: dueDate,
        is_fixed: true,
        is_critical: debt.is_critical,
        source_debt_id: debt.id,
      };
    })
    .filter((item) => !existingKeys.has(`${item.source_debt_id}-${item.due_date}`));

  if (itemsToInsert.length === 0) return;

  const { error } = await supabase.from('calendar_items').insert(itemsToInsert);
  if (error) throw error;
};

export const calculateOutputMetrics = async (
  dayId: number,
  userId: string,
  payload: Record<string, unknown>
): Promise<OutputMetricValue[]> => {
  const config = getDayConfig(dayId);
  if (!config || !config.outputMetrics) return [];

  const values: Record<string, string | number> = {};

  if (dayId === 1) {
    // Day 1 usa dados do payload do wizard
    const feelingMap: Record<string, string> = {
      light: 'Leve ✨',
      anxious: 'Ansioso(a)',
      calm: 'Tranquilo(a)',
      confused: 'Confuso(a)',
      scared: 'Com medo',
      indifferent: 'Indiferente',
    };
    const feeling = payload.money_feeling as string;
    values.money_feeling = feelingMap[feeling] || feeling || '-';

    values.breathe_score = toNumber(payload.breathe_score);
    values.monthly_income = toNumber(payload.monthly_income);

    const period = payload.daily_time_period as string;
    const time = payload.daily_time_exact as string;
    const periodMap: Record<string, string> = {
      morning: 'Manha',
      afternoon: 'Tarde',
      night: 'Noite',
    };
    values.commitment_time = `${periodMap[period] || period || ''} ${time || ''}`.trim() || '-';
  }

  if (dayId === 2) {
    // Day 2 usa dados do payload do componente
    values.totalIncome = toNumber(payload.totalIncome);
    values.totalExpenses = toNumber(payload.totalExpenses);
    values.totalDebtsMin = toNumber(payload.totalDebtsMin);
    values.balance = toNumber(payload.balance);
  }

  if (dayId === 3) {
    // Day 3 usa dados do payload do componente
    values.triggersAnalyzed = toNumber(payload.triggersAnalyzed);
    values.avoidableCount = toNumber(payload.avoidableCount);
    values.largePurchasesCount = toNumber(payload.largePurchasesCount);
    values.mainTrigger = String(payload.mainTrigger || '');
    values.mainInfluence = String(payload.mainInfluence || '');
  }

  if (dayId === 4) {
    // Day 4 usa dados do payload do componente
    values.bannedCount = toNumber(payload.bannedCount);
    values.exceptionsCount = toNumber(payload.exceptionsCount);
    values.totalExceptionsLimit = toNumber(payload.totalExceptionsLimit);
  }

  if (dayId === 7) {
    const monthYear = (payload.month_year as string) || getMonthYear();
    const { data } = await supabase
      .from('monthly_budget')
      .select('gap, essentials, minimum_debts')
      .eq('user_id', userId)
      .eq('month_year', monthYear)
      .maybeSingle();

    const essentials = (data?.essentials as Record<string, number>) || {};
    values.gap = data?.gap ?? 0;
    values.essentialsTotal = sumValues(Object.values(essentials));
    values.minimumDebts = data?.minimum_debts ?? 0;
  }

  if (dayId === 5) {
    // Day 5 usa dados do payload do componente
    values.mainCardName = String(payload.mainCardName || '');
    values.blockedCount = toNumber(payload.blockedCount);
    values.weeklyLimit = toNumber(payload.weeklyLimit);
    values.exceptionsCount = toNumber(payload.exceptionsCount);
    values.totalExceptionsLimit = toNumber(payload.totalExceptionsLimit);
  }

  if (dayId === 6) {
    // Day 6 usa dados do payload do componente
    values.cutsCount = toNumber(payload.cutsCount);
    values.totalLimit = toNumber(payload.totalLimit);
    values.bigGoal = String(payload.bigGoal || '');
  }

  if (dayId === 8) {
    // Day 8 usa dados do payload do componente
    values.totalBills = toNumber(payload.totalBills);
    values.gap = toNumber(payload.gap);
    values.payNowTotal = toNumber(payload.payNowTotal);
    values.negotiateTotal = toNumber(payload.negotiateTotal);
    values.pauseTotal = toNumber(payload.pauseTotal);
    values.selectedPlan = String(payload.selectedPlan || '');
  }

  if (dayId === 9) {
    values.strategy = (payload.attack_strategy as string) || '-';
  }

  if (dayId === 10) {
    values.baseDefined = payload.max_entry || payload.max_installment ? 'Sim' : 'Nao';
  }

  if (dayId === 11 || dayId === 12) {
    const { data } = await supabase
      .from('negotiations')
      .select('status')
      .eq('user_id', userId);

    const negotiations = data || [];
    values.negotiationsTotal = negotiations.length;
    values.acceptedCount = negotiations.filter((item) => item.status === 'accepted').length;
    values.pendingCount = negotiations.filter((item) => item.status === 'pending').length;
  }

  if (dayId === 13) {
    const { data } = await supabase
      .from('plan_306090')
      .select('goals_30, goals_60, goals_90')
      .eq('user_id', userId)
      .maybeSingle();

    const totalGoals =
      (data?.goals_30?.length || 0) +
      (data?.goals_60?.length || 0) +
      (data?.goals_90?.length || 0);

    values.goalsCount = totalGoals;
  }

  if (dayId === 14) {
    const { data } = await supabase
      .from('weekly_ritual')
      .select('checklist, day_of_week')
      .eq('user_id', userId)
      .maybeSingle();

    const list = Array.isArray(data?.checklist) ? data?.checklist : [];
    values.ritualItems = list.length;
    values.ritualDay = getDayOfWeekLabel(data?.day_of_week ?? null);
  }

  if (dayId === 15) {
    values.challengeDone = 'Sim';
    values.nextStep = (payload.next_commitment as string) || '-';
  }

  return config.outputMetrics.map((metric) => ({
    ...metric,
    value: values[metric.key] ?? '-'
  }));
};

export const completeDay = async (
  dayId: number,
  payload: Record<string, unknown>,
  userId: string
): Promise<OutputMetricValue[]> => {
  const config = getDayConfig(dayId);
  if (!config) throw new Error('Day not found');

  if (dayId === 1) {
    await saveUserProfile(userId, payload);
  }

  if (dayId === 3) {
    await generateCalendarFromDebts(userId);
  }

  if (dayId === 4 || dayId === 7) {
    await saveMonthlyBudget(userId, payload);
  }

  if (dayId === 5) {
    await saveCardPolicy(userId, payload);
  }

  if (dayId === 13) {
    await savePlan306090(userId, payload);
  }

  if (dayId === 14) {
    await saveWeeklyRitual(userId, payload);
  }

  const { error } = await supabase.from('day_progress').upsert(
    {
      user_id: userId,
      day_id: dayId,
      completed: true,
      completed_at: new Date().toISOString(),
      form_data: payload as unknown as Json,
    },
    { onConflict: 'user_id,day_id' }
  );

  if (error) throw error;

  return calculateOutputMetrics(dayId, userId, payload);
};
