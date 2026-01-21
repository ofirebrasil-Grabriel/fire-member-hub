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

const getIsoDate = (date = new Date()) => date.toISOString().slice(0, 10);

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

const saveInitialAssessment = async (userId: string, payload: Record<string, unknown>) => {
  const assessment = {
    user_id: userId,
    money_feeling: String(payload.money_feeling || ''),
    has_overdue_bills: String(payload.has_overdue_bills || ''),
    monthly_income: toNumber(payload.monthly_income),
    top_expenses: Array.isArray(payload.top_expenses) ? payload.top_expenses : [],
    shares_finances: Boolean(payload.shares_finances),
    shares_with: payload.shares_with ? String(payload.shares_with) : null,
    biggest_blocker: String(payload.biggest_blocker || ''),
    main_goal: String(payload.main_goal || ''),
    tried_before: Boolean(payload.tried_before),
    what_blocked: payload.what_blocked ? String(payload.what_blocked) : null,
  };

  const { error } = await supabase
    .from('initial_assessment')
    .upsert(assessment, { onConflict: 'user_id' });

  if (error) {
    const message = String((error as { message?: string }).message || '');
    if (message.includes('404') || message.includes('spending_rules')) {
      throw new Error(
        'Tabela spending_rules nao existe no Supabase. Rode a migration 20260202093000_create_spending_rules.sql.'
      );
    }
    throw error;
  }
};

const saveDailyLog = async (userId: string, dayNumber: number, payload: Record<string, unknown>) => {
  const breatheScore = toNumber(payload.breathe_score);
  const breatheReason = String(payload.breathe_reason || '').trim();

  if (!breatheReason) return;

  const { error } = await supabase
    .from('daily_log')
    .upsert(
      {
        user_id: userId,
        day_number: dayNumber,
        breathe_score: breatheScore,
        breathe_reason: breatheReason,
        status: 'completed',
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,day_number' }
    );

  if (error) throw error;
};

const saveUserCommitment = async (userId: string, payload: Record<string, unknown>) => {
  const commitment = {
    user_id: userId,
    daily_time_period: String(payload.daily_time_period || ''),
    daily_time_exact: String(payload.daily_time_exact || '09:00'),
    reminder_enabled: Boolean(payload.reminder_enabled),
    reminder_channels: Array.isArray(payload.reminder_channels) ? payload.reminder_channels : [],
    minimum_step: String(payload.minimum_step || ''),
  };

  const { error } = await supabase
    .from('user_commitment')
    .upsert(commitment, { onConflict: 'user_id' });

  if (error) throw error;
};

const saveDay2Financials = async (userId: string, payload: Record<string, unknown>) => {
  const monthlyIncome = toNumber(payload.totalIncome ?? payload.monthly_income);
  const fixedExpenses = (payload.fixedExpenses as Record<string, number>) || {};
  const dailyExpenses = (payload.dailyExpenses as Array<{ label: string; category: string; amount: number }>) || [];
  const debts = (payload.debts as Array<{
    name: string;
    monthlyPayment: number;
    totalAmount: number;
    installmentsRemaining?: number;
  }>) || [];

  // Income: replace "Renda principal"
  const { error: incomeDeleteError } = await supabase
    .from('income_items')
    .delete()
    .eq('user_id', userId)
    .eq('source', 'Renda principal');

  if (incomeDeleteError) throw incomeDeleteError;

  if (monthlyIncome > 0) {
    const { error } = await supabase.from('income_items').insert({
      user_id: userId,
      source: 'Renda principal',
      amount: monthlyIncome,
      recurrence: 'monthly',
    });
    if (error) throw error;
  }

  // Fixed expenses: replace by name
  const fixedLabels: Record<string, string> = {
    housing: 'Casa/Aluguel',
    electricity: 'Luz',
    water: 'Agua',
    internet: 'Internet',
    phone: 'Celular',
    health: 'Saude/Plano',
    education: 'Educacao',
  };
  const fixedCategoryMap: Record<string, string> = {
    housing: 'housing',
    electricity: 'utilities',
    water: 'utilities',
    internet: 'utilities',
    phone: 'utilities',
    health: 'health',
    education: 'education',
  };

  const fixedNames = Object.keys(fixedExpenses).map((key) => fixedLabels[key] || key);
  if (fixedNames.length > 0) {
    const { error: fixedDeleteError } = await supabase
      .from('fixed_expenses')
      .delete()
      .eq('user_id', userId)
      .in('name', fixedNames);

    if (fixedDeleteError) throw fixedDeleteError;
  }

  const { error: transportDeleteError } = await supabase
    .from('fixed_expenses')
    .delete()
    .eq('user_id', userId)
    .eq('name', 'Transporte');

  if (transportDeleteError) throw transportDeleteError;

  const fixedRows = Object.entries(fixedExpenses)
    .filter(([, amount]) => amount > 0)
    .map(([key, amount]) => ({
      user_id: userId,
      name: fixedLabels[key] || key,
      category: fixedCategoryMap[key] || 'other',
      amount,
      priority: 'essential',
    }));

  if (fixedRows.length > 0) {
    const { error } = await supabase.from('fixed_expenses').insert(fixedRows);
    if (error) throw error;
  }

  // Variable expenses: replace by name
  const variableCategoryMap: Record<string, string> = {
    market: 'food',
    food: 'food',
    transport: 'transport',
    pharmacy: 'health',
    clothing: 'shopping',
    leisure: 'leisure',
    subscriptions: 'other',
    other: 'other',
  };

  const variableNames = dailyExpenses.map((item) => item.label);
  if (variableNames.length > 0) {
    const { error: variableDeleteError } = await supabase
      .from('variable_expenses')
      .delete()
      .eq('user_id', userId)
      .in('name', variableNames);

    if (variableDeleteError) throw variableDeleteError;
  }

  const spentOn = getIsoDate();
  const variableRows = dailyExpenses
    .filter((item) => item.amount > 0)
    .map((item) => ({
      user_id: userId,
      name: item.label,
      category: variableCategoryMap[item.category] || 'other',
      amount: item.amount,
      spent_on: spentOn,
      is_essential: ['market', 'food', 'transport', 'pharmacy'].includes(item.category),
    }));

  if (variableRows.length > 0) {
    const { error } = await supabase.from('variable_expenses').insert(variableRows);
    if (error) throw error;
  }

  // Debts: replace by creditor
  const debtNames = debts.map((item) => item.name);
  if (debtNames.length > 0) {
    const { error: debtDeleteError } = await supabase
      .from('debts')
      .delete()
      .eq('user_id', userId)
      .in('creditor', debtNames);

    if (debtDeleteError) throw debtDeleteError;
  }

  const debtRows = debts
    .filter((item) => item.monthlyPayment > 0)
    .map((item) => ({
      user_id: userId,
      creditor: item.name,
      installment_value: item.monthlyPayment,
      total_balance: item.totalAmount || null,
      installments_remaining: item.installmentsRemaining || null,
      status: 'pending',
      is_critical: false,
    }));

  if (debtRows.length > 0) {
    const { error } = await supabase.from('debts').insert(debtRows);
    if (error) throw error;
  }

  const snapshot = {
    user_id: userId,
    total_income: toNumber(payload.totalIncome),
    total_fixed: toNumber(payload.totalFixed),
    total_variable: toNumber(payload.totalVariable),
    total_debt_payments: toNumber(payload.totalDebtsMin),
    balance: toNumber(payload.balance),
    total_debt_amount: toNumber(payload.totalDebtAmount),
    emotional_note: payload.emotionalNote ? String(payload.emotionalNote) : null,
  };

  const { error } = await supabase
    .from('financial_snapshot')
    .upsert(snapshot, { onConflict: 'user_id' });

  if (error) throw error;
};

const saveSpendingRules = async (userId: string, payload: Record<string, unknown>) => {
  const bannedList = Array.isArray(payload.bannedList) ? payload.bannedList : [];
  const exceptions = Array.isArray(payload.exceptions) ? payload.exceptions : [];
  const totalLimit = toNumber(payload.totalExceptionsLimit ?? payload.total_limit);

  const { error } = await supabase
    .from('spending_rules')
    .upsert(
      {
        user_id: userId,
        banned_list: bannedList,
        exceptions,
        total_limit: totalLimit,
      },
      { onConflict: 'user_id' }
    );

  if (error) throw error;
};

const saveCuts = async (userId: string, payload: Record<string, unknown>) => {
  const cuts = Array.isArray(payload.cuts) ? payload.cuts : [];
  if (cuts.length === 0) return;

  const { error: deleteError } = await supabase
    .from('cuts')
    .delete()
    .eq('user_id', userId);

  if (deleteError) throw deleteError;

  const rows = cuts.map((cut) => {
    const categoryLabel = String(cut.category || '');
    const actionLabel = String(cut.actionLabel || cut.actionType || '');
    const specificCut = String(cut.specificCut || '').trim();
    const clearLimit = String(cut.clearLimit || '').trim();

    const item =
      specificCut ||
      clearLimit ||
      categoryLabel ||
      'Corte';

    return {
      user_id: userId,
      item,
      estimated_value: toNumber(cut.limitValue),
      category: categoryLabel || actionLabel || null,
      status: 'proposed',
    };
  });

  const { error } = await supabase.from('cuts').insert(rows);
  if (error) throw error;
};

const saveShadowExpenses = async (userId: string, payload: Record<string, unknown>) => {
  const analyses = Array.isArray(payload.analyses) ? payload.analyses : [];
  const avoidable = analyses
    .filter((item) => item && typeof item === 'object')
    .filter((item) => (item as { couldAvoid?: boolean }).couldAvoid);

  if (avoidable.length === 0) return;

  const names = avoidable
    .map((item) => String((item as { name?: string }).name || '').trim())
    .filter((name) => name.length > 0);

  if (names.length === 0) return;

  const { error: deleteError } = await supabase
    .from('shadow_expenses')
    .delete()
    .eq('user_id', userId)
    .in('name', names);

  if (deleteError) throw deleteError;

  const rows = avoidable.map((item) => ({
    user_id: userId,
    name: String((item as { name?: string }).name || 'Gasto'),
    estimated_amount: null,
    frequency: 'monthly',
    status: 'pending',
    monthly_limit: null,
    comment: (item as { avoidanceStrategy?: string }).avoidanceStrategy || null,
  }));

  const { error } = await supabase.from('shadow_expenses').insert(rows);
  if (error) throw error;
};
const saveMonthlyBudget = async (userId: string, payload: Record<string, unknown>) => {
  const monthYear = (payload.month_year as string) || getMonthYear();
  const essentials = extractEssentials(payload);
  const essentialsOverride = toNumber(payload.essentials_total);
  const essentialsTotal = essentialsOverride > 0 ? essentialsOverride : sumValues(Object.values(essentials));
  const criticalBills = toNumber(payload.critical_bills);
  const leisureMinimum = toNumber(payload.leisure_minimum);
  const income = toNumber(payload.income);
  const minimumDebts = toNumber(payload.minimum_debts);
  const totalBudget = essentialsTotal + criticalBills + minimumDebts + leisureMinimum;
  const gap = income - totalBudget;

  const essentialsPayload: Record<string, number> = { ...essentials };
  if (essentialsTotal > 0) essentialsPayload.total = essentialsTotal;
  if (criticalBills > 0) essentialsPayload.critical_bills = criticalBills;
  if (leisureMinimum > 0) essentialsPayload.leisure_minimum = leisureMinimum;

  const { error } = await supabase
    .from('monthly_budget')
    .upsert(
      {
        user_id: userId,
        month_year: monthYear,
        income,
        essentials: essentialsPayload,
        minimum_debts: minimumDebts,
        gap,
      },
      { onConflict: 'user_id,month_year' }
    );

  if (error) throw error;

  return { gap, essentialsTotal, minimumDebts };
};

const saveCardPolicy = async (userId: string, payload: Record<string, unknown>) => {
  const weeklyLimit =
    toNumber(payload.weekly_limit) ||
    toNumber(payload.weeklyLimit);
  const blockedCategories =
    (payload.blocked_categories as string[]) ||
    (payload.blockedCards as string[]) ||
    [];
  const { error } = await supabase
    .from('card_policy')
    .upsert(
      {
        user_id: userId,
        weekly_limit: weeklyLimit,
        installment_rule: (payload.installment_rule as string) || null,
        blocked_categories: blockedCategories,
      },
      { onConflict: 'user_id' }
    );

  if (error) throw error;
};

const savePlan306090 = async (userId: string, payload: Record<string, unknown>) => {
  const goals30FromFields = [
    payload.goal_30_1,
    payload.goal_30_2,
    payload.goal_30_3,
  ]
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter((value) => value.length > 0);
  const goals60FromFields = [
    payload.goal_60_1,
    payload.goal_60_2,
  ]
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter((value) => value.length > 0);
  const goals90FromFields = [
    payload.goal_90_1,
    payload.goal_90_2,
  ]
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter((value) => value.length > 0);

  const goals30 = Array.isArray(payload.goals_30)
    ? payload.goals_30
    : splitLines(payload.goals_30).length > 0
      ? splitLines(payload.goals_30)
      : goals30FromFields;
  const goals60 = Array.isArray(payload.goals_60)
    ? payload.goals_60
    : splitLines(payload.goals_60).length > 0
      ? splitLines(payload.goals_60)
      : goals60FromFields;
  const goals90 = Array.isArray(payload.goals_90)
    ? payload.goals_90
    : splitLines(payload.goals_90).length > 0
      ? splitLines(payload.goals_90)
      : goals90FromFields;

  const { error } = await supabase
    .from('plan_306090')
    .upsert(
      {
        user_id: userId,
        goals_30: goals30,
        goals_60: goals60,
        goals_90: goals90,
      },
      { onConflict: 'user_id' }
    );

  if (error) throw error;
};

const saveWeeklyRitual = async (userId: string, payload: Record<string, unknown>) => {
  const checklist = Array.isArray(payload.checklist)
    ? payload.checklist
    : splitLines(payload.checklist);
  const { error } = await supabase
    .from('weekly_ritual')
    .upsert(
      {
        user_id: userId,
        day_of_week: payload.day_of_week === undefined ? null : Number(payload.day_of_week),
        checklist,
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
    const periodMap: Record<string, string> = {
      morning: 'Manha',
      afternoon: 'Tarde',
      night: 'Noite',
    };
    values.commitment_time = periodMap[period] || period || '-';
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
    values.totalObligations = toNumber(payload.totalObligations ?? payload.total_obligations);
    values.criticalCount = toNumber(payload.criticalCount ?? payload.critical_count);
    values.nextDueDate = String(payload.nextDueDate ?? payload.next_due_date ?? '-') || '-';
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
    const monthYear = (payload.month_year as string) || getMonthYear();
    const { data } = await supabase
      .from('monthly_budget')
      .select('gap, essentials, minimum_debts')
      .eq('user_id', userId)
      .eq('month_year', monthYear)
      .maybeSingle();

    const essentials = (data?.essentials as Record<string, number>) || {};
    const essentialsTotal = essentials.total ?? sumValues(Object.values(essentials));
    const leisureMinimum = essentials.leisure_minimum ?? 0;
    const criticalBills = essentials.critical_bills ?? 0;
    const minimumDebts = data?.minimum_debts ?? 0;
    const totalBudget = essentialsTotal + criticalBills + minimumDebts + leisureMinimum;
    const gap = data?.gap ?? 0;

    values.totalBudget = totalBudget;
    values.status = gap >= 0 ? 'Cabe no orcamento' : 'Nao cabe';
    values.adjustment = gap < 0 ? Math.abs(gap) : 0;
  }

  if (dayId === 10) {
    values.maxEntry = toNumber(payload.max_entry);
    values.maxInstallment = toNumber(payload.max_installment);
    const checks = Array.isArray(payload.anti_fraud_check) ? payload.anti_fraud_check.length : 0;
    values.safetyScore = `${checks}/4`;
  }

  if (dayId === 11) {
    values.quizScore = toNumber(payload.quiz_score);
    values.confidenceLevel = toNumber(payload.confidence_level);
  }

  if (dayId === 12) {
    values.agreementTotal = toNumber(payload.total_amount);
    values.monthlyPayment = toNumber(payload.monthly_payment);
    values.savings = toNumber(payload.savings);
  }

  if (dayId === 13) {
    const rules = [payload.rule_1, payload.rule_2, payload.rule_3]
      .map((value) => (typeof value === 'string' ? value.trim() : ''))
      .filter((value) => value.length > 0);
    values.rulesCount = rules.length;
    values.mantra = rules[0] || '-';
  }

  if (dayId === 14) {
    const { data } = await supabase
      .from('plan_306090')
      .select('goals_30, goals_60, goals_90')
      .eq('user_id', userId)
      .maybeSingle();

    const goals30 = data?.goals_30?.length || 0;
    const goals60 = data?.goals_60?.length || 0;
    const goals90 = data?.goals_90?.length || 0;

    values.goals30 = goals30;
    values.goals60 = goals60;
    values.goals90 = goals90;
  }

  if (dayId === 15) {
    const checklist = Array.isArray(payload.checklist) ? payload.checklist : [];
    values.ritualDay = getDayOfWeekLabel(
      payload.day_of_week === undefined ? null : Number(payload.day_of_week)
    );
    values.checklistItems = checklist.length;
    values.challengeComplete = 'Sim';
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
    await saveInitialAssessment(userId, payload);
    await saveUserCommitment(userId, payload);
    await saveDailyLog(userId, 1, payload);
  }

  if (dayId === 2) {
    await saveDay2Financials(userId, payload);
  }

  if (dayId === 3) {
    await saveShadowExpenses(userId, payload);
  }

  if (dayId === 4) {
    await saveSpendingRules(userId, payload);
  }

  if (dayId === 6) {
    await saveCuts(userId, payload);
  }

  if (dayId === 7) {
    await generateCalendarFromDebts(userId);
  }

  if (dayId === 9) {
    await saveMonthlyBudget(userId, payload);
  }

  if (dayId === 5) {
    await saveCardPolicy(userId, payload);
  }

  if (dayId === 14) {
    await savePlan306090(userId, payload);
  }

  if (dayId === 15) {
    await saveWeeklyRitual(userId, payload);
    await saveDailyLog(userId, 15, payload);
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
