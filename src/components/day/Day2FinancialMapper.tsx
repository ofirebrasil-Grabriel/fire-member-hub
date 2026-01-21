import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowRight, ArrowLeft, Plus, X, Check, Trash2, Sparkles, AlertTriangle } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PieChart, Pie, Cell, BarChart, Bar,
    XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import confetti from 'canvas-confetti';

interface Day2FinancialMapperProps {
    onComplete: (formData: Record<string, unknown>) => void;
    defaultValues?: Record<string, unknown>;
}

type Step = 'income' | 'fixed' | 'daily' | 'debts' | 'summary';

const STEPS: Step[] = ['income', 'fixed', 'daily', 'debts', 'summary'];

// Categorias de contas fixas com emojis amigáveis
const FIXED_CATEGORIES = [
    { id: 'housing', emoji: '🏠', label: 'Casa/Aluguel' },
    { id: 'electricity', emoji: '💡', label: 'Luz' },
    { id: 'water', emoji: '💧', label: 'Água' },
    { id: 'internet', emoji: '🌐', label: 'Internet' },
    { id: 'phone', emoji: '📱', label: 'Celular' },
    { id: 'transport', emoji: '🚗', label: 'Transporte' },
    { id: 'health', emoji: '🏥', label: 'Saúde/Plano' },
    { id: 'education', emoji: '📚', label: 'Educação' },
];

// Categorias de gastos do dia a dia
const DAILY_CATEGORIES = [
    { id: 'market', emoji: '🛒', label: 'Mercado' },
    { id: 'food', emoji: '🍔', label: 'Comida fora' },
    { id: 'transport', emoji: '⛽', label: 'Combustível/Uber' },
    { id: 'pharmacy', emoji: '💊', label: 'Farmácia' },
    { id: 'clothing', emoji: '👕', label: 'Roupas' },
    { id: 'leisure', emoji: '🎬', label: 'Lazer' },
    { id: 'subscriptions', emoji: '📱', label: 'Assinaturas' },
    { id: 'other', emoji: '📦', label: 'Outros' },
];

interface ExpenseItem {
    id: string;
    category: string;
    emoji: string;
    label: string;
    amount: number;
}

interface DebtItem {
    id: string;
    name: string;
    monthlyPayment: number;
    totalAmount: number;
}

const Day2FinancialMapper: React.FC<Day2FinancialMapperProps> = ({ onComplete, defaultValues }) => {
    const { user } = useAuth();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Estado principal
    const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
    const [fixedExpenses, setFixedExpenses] = useState<Record<string, number>>({});
    const [dailyExpenses, setDailyExpenses] = useState<ExpenseItem[]>([]);
    const [debts, setDebts] = useState<DebtItem[]>([]);
    const [hasDebts, setHasDebts] = useState<boolean | null>(null);
    const [emotionalNote, setEmotionalNote] = useState('');

    // Modais
    const [fixedModalOpen, setFixedModalOpen] = useState(false);
    const [fixedModalCategory, setFixedModalCategory] = useState<typeof FIXED_CATEGORIES[0] | null>(null);
    const [fixedModalValue, setFixedModalValue] = useState('');

    const [dailyModalOpen, setDailyModalOpen] = useState(false);
    const [dailyModalCategory, setDailyModalCategory] = useState<typeof DAILY_CATEGORIES[0] | null>(null);
    const [dailyModalValue, setDailyModalValue] = useState('');

    const [debtModalOpen, setDebtModalOpen] = useState(false);
    const [debtName, setDebtName] = useState('');
    const [debtMonthly, setDebtMonthly] = useState('');
    const [debtTotal, setDebtTotal] = useState('');

    // Cálculos
    const totalFixed = useMemo(() =>
        Object.values(fixedExpenses).reduce((sum, val) => sum + val, 0),
        [fixedExpenses]
    );

    const totalDaily = useMemo(() =>
        dailyExpenses.reduce((sum, item) => sum + item.amount, 0),
        [dailyExpenses]
    );

    const totalDebtPayments = useMemo(() =>
        debts.reduce((sum, item) => sum + item.monthlyPayment, 0),
        [debts]
    );

    const totalDebtAmount = useMemo(() =>
        debts.reduce((sum, item) => sum + item.totalAmount, 0),
        [debts]
    );

    const totalExpenses = totalFixed + totalDaily + totalDebtPayments;
    const balance = monthlyIncome - totalExpenses;

    const currentStep = STEPS[currentStepIndex];
    const progress = ((currentStepIndex + 1) / STEPS.length) * 100;
    const debtRatio = monthlyIncome > 0 ? totalDebtPayments / monthlyIncome : 0;
    const fixedRatio = monthlyIncome > 0 ? totalFixed / monthlyIncome : 0;

    const stepMessageMap: Record<Step, { title: string; message: string }> = {
        income: {
            title: 'Tudo começa pela renda real',
            message: 'Sem julgamento. O foco e entender a foto completa para decidir com clareza.',
        },
        fixed: {
            title: 'Contas fixas dão previsibilidade',
            message: 'Liste o que vence todo mes. Isso evita sustos e juros.',
        },
        daily: {
            title: 'Gastos diarios mostram vazamentos',
            message: 'Nao precisa ser perfeito. Uma estimativa honesta ja ajuda muito.',
        },
        debts: {
            title: 'Dividas mapeadas = pressao menor',
            message: 'Aqui voce tira o peso do segredo e ganha controle.',
        },
        summary: {
            title: 'Seu raio-x esta pronto',
            message: 'Agora temos base para agir. Sem culpa, com estrategia.',
        },
    };

    const summaryPieData = [
        { name: 'Fixas', value: totalFixed },
        { name: 'Dia a dia', value: totalDaily },
        { name: 'Dividas', value: totalDebtPayments },
    ].filter((item) => item.value > 0);

    const barData = [
        { name: 'Renda', value: monthlyIncome },
        { name: 'Despesas', value: totalExpenses },
    ];

    const pieColors = ['#34d399', '#fb923c', '#ef4444'];

    // Carregar dados do Dia 1 e existentes
    useEffect(() => {
        const loadData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                if (defaultValues && Object.keys(defaultValues).length > 0) {
                    const storedDebts = (defaultValues.debts as DebtItem[]) || [];
                    setMonthlyIncome(Number(defaultValues.totalIncome ?? defaultValues.monthly_income ?? 0));
                    setFixedExpenses((defaultValues.fixedExpenses as Record<string, number>) || {});
                    setDailyExpenses((defaultValues.dailyExpenses as ExpenseItem[]) || []);
                    setDebts(storedDebts);
                    setHasDebts(storedDebts.length > 0 ? true : null);
                    setEmotionalNote(String(defaultValues.emotionalNote || ''));
                    return;
                }

                const [assessmentResult, incomeResult, fixedResult, variableResult, debtResult] =
                    await Promise.all([
                        supabase
                            .from('initial_assessment')
                            .select('monthly_income')
                            .eq('user_id', user.id)
                            .maybeSingle(),
                        supabase
                            .from('income_items')
                            .select('amount, recurrence')
                            .eq('user_id', user.id),
                        supabase
                            .from('fixed_expenses')
                            .select('name, amount, category')
                            .eq('user_id', user.id),
                        supabase
                            .from('variable_expenses')
                            .select('id, name, amount, category')
                            .eq('user_id', user.id),
                        supabase
                            .from('debts')
                            .select('id, creditor, installment_value, total_balance')
                            .eq('user_id', user.id),
                    ]);

                const incomeItems = incomeResult.data || [];
                const monthlyFromItems = incomeItems.reduce((sum, item) => {
                    let monthlyAmount = Number(item.amount) || 0;
                    if (item.recurrence === 'weekly') monthlyAmount *= 4;
                    if (item.recurrence === 'biweekly') monthlyAmount *= 2;
                    if (item.recurrence === 'one_time') monthlyAmount = 0;
                    return sum + monthlyAmount;
                }, 0);

                if (monthlyFromItems > 0) {
                    setMonthlyIncome(monthlyFromItems);
                } else if (assessmentResult.data?.monthly_income) {
                    setMonthlyIncome(Number(assessmentResult.data.monthly_income));
                }

                const fixedByLabel = FIXED_CATEGORIES.reduce<Record<string, string>>((acc, item) => {
                    acc[item.label.toLowerCase()] = item.id;
                    return acc;
                }, {});
                const fixedByCategory: Record<string, string> = {
                    housing: 'housing',
                    transport: 'transport',
                    education: 'education',
                    health: 'health',
                };

                const fixedLoaded = (fixedResult.data || []).reduce<Record<string, number>>((acc, item) => {
                    const name = (item.name || '').toLowerCase();
                    let categoryId = fixedByLabel[name] || fixedByCategory[item.category || ''] || '';
                    if (!categoryId && item.category === 'utilities') {
                        if (name.includes('luz') || name.includes('energia')) categoryId = 'electricity';
                        if (name.includes('agua')) categoryId = 'water';
                        if (name.includes('internet')) categoryId = 'internet';
                        if (name.includes('celular') || name.includes('telefone')) categoryId = 'phone';
                    }
                    if (!categoryId) return acc;
                    acc[categoryId] = (acc[categoryId] || 0) + (Number(item.amount) || 0);
                    return acc;
                }, {});
                if (Object.keys(fixedLoaded).length > 0) {
                    setFixedExpenses(fixedLoaded);
                }

                const dailyByLabel = DAILY_CATEGORIES.reduce<Record<string, typeof DAILY_CATEGORIES[0]>>(
                    (acc, item) => {
                        acc[item.label.toLowerCase()] = item;
                        return acc;
                    },
                    {}
                );
                const dailyLoaded = (variableResult.data || []).map((item) => {
                    const name = String(item.name || '');
                    const lowerName = name.toLowerCase();
                    let categoryId = dailyByLabel[lowerName]?.id;
                    if (!categoryId) {
                        if (item.category === 'food') {
                            categoryId = lowerName.includes('mercado') ? 'market' : 'food';
                        } else if (item.category === 'transport') {
                            categoryId = 'transport';
                        } else if (item.category === 'leisure') {
                            categoryId = 'leisure';
                        } else if (item.category === 'shopping') {
                            categoryId = 'clothing';
                        } else if (item.category === 'health') {
                            categoryId = 'pharmacy';
                        } else {
                            categoryId = 'other';
                        }
                    }
                    const category = DAILY_CATEGORIES.find((cat) => cat.id === categoryId) || DAILY_CATEGORIES[0];
                    return {
                        id: String(item.id),
                        category: category.id,
                        emoji: category.emoji,
                        label: name || category.label,
                        amount: Number(item.amount) || 0,
                    } satisfies ExpenseItem;
                });
                if (dailyLoaded.length > 0) {
                    setDailyExpenses(dailyLoaded);
                }

                const debtLoaded = (debtResult.data || []).map((item) => ({
                    id: String(item.id),
                    name: item.creditor || 'Divida',
                    monthlyPayment: Number(item.installment_value) || 0,
                    totalAmount: Number(item.total_balance) || 0,
                }));
                if (debtLoaded.length > 0) {
                    setDebts(debtLoaded);
                    setHasDebts(true);
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [user, defaultValues]);

    // Navegação
    const canProceed = () => {
        switch (currentStep) {
            case 'income':
                return monthlyIncome > 0;
            case 'fixed':
                return true; // Pode pular
            case 'daily':
                return true; // Pode pular
            case 'debts':
                return hasDebts !== null;
            case 'summary':
                return true;
            default:
                return false;
        }
    };

    const nextStep = () => {
        if (currentStepIndex < STEPS.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    };

    // Handlers de despesas fixas
    const openFixedModal = (category: typeof FIXED_CATEGORIES[0]) => {
        setFixedModalCategory(category);
        setFixedModalValue(fixedExpenses[category.id]?.toString() || '');
        setFixedModalOpen(true);
    };

    const saveFixedExpense = () => {
        if (fixedModalCategory) {
            const value = parseFloat(fixedModalValue.replace(/\D/g, '')) / 100 || 0;
            setFixedExpenses(prev => ({
                ...prev,
                [fixedModalCategory.id]: value
            }));
            setFixedModalOpen(false);
            setFixedModalValue('');
        }
    };

    const removeFixedExpense = (categoryId: string) => {
        setFixedExpenses(prev => {
            const updated = { ...prev };
            delete updated[categoryId];
            return updated;
        });
    };

    // Handlers de gastos diários
    const openDailyModal = (category?: typeof DAILY_CATEGORIES[0]) => {
        setDailyModalCategory(category || null);
        setDailyModalValue('');
        setDailyModalOpen(true);
    };

    const saveDailyExpense = () => {
        if (dailyModalCategory) {
            const value = parseFloat(dailyModalValue.replace(/\D/g, '')) / 100 || 0;
            if (value > 0) {
                setDailyExpenses(prev => [...prev, {
                    id: Date.now().toString(),
                    category: dailyModalCategory.id,
                    emoji: dailyModalCategory.emoji,
                    label: dailyModalCategory.label,
                    amount: value
                }]);
            }
            setDailyModalOpen(false);
            setDailyModalValue('');
            setDailyModalCategory(null);
        }
    };

    const removeDailyExpense = (id: string) => {
        setDailyExpenses(prev => prev.filter(item => item.id !== id));
    };

    // Handlers de dívidas
    const saveDebt = () => {
        const monthly = parseFloat(debtMonthly.replace(/\D/g, '')) / 100 || 0;
        const total = parseFloat(debtTotal.replace(/\D/g, '')) / 100 || 0;

        if (debtName && monthly > 0) {
            setDebts(prev => [...prev, {
                id: Date.now().toString(),
                name: debtName,
                monthlyPayment: monthly,
                totalAmount: total || monthly * 12
            }]);
            setDebtModalOpen(false);
            setDebtName('');
            setDebtMonthly('');
            setDebtTotal('');
        }
    };

    const removeDebt = (id: string) => {
        setDebts(prev => prev.filter(item => item.id !== id));
    };

    // Input de moeda
    const formatInputCurrency = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        const amount = parseInt(numbers || '0') / 100;
        return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // Salvar e concluir
    const handleComplete = async () => {
        setSaving(true);
        try {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

            const formData = {
                totalIncome: monthlyIncome,
                totalFixed,
                totalVariable: totalDaily,
                totalDebtsMin: totalDebtPayments,
                totalDebtAmount,
                balance,
                incomeCount: 1,
                expenseCount: Object.keys(fixedExpenses).length,
                debtCount: debts.length,
                emotionalNote,
                fixedExpenses,
                dailyExpenses,
                debts,
            };

            onComplete(formData);
        } catch (error) {
            toast({
                title: 'Erro ao salvar',
                description: 'Tente novamente.',
                variant: 'destructive'
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-6">
            {/* Barra de Progresso */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Passo {currentStepIndex + 1} de {STEPS.length}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            <Card className="glass-card border-primary/10">
                <CardContent className="p-4 flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold">{stepMessageMap[currentStep].title}</p>
                        <p className="text-xs text-muted-foreground">
                            {stepMessageMap[currentStep].message}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* STEP 1: RENDA */}
                    {currentStep === 'income' && (
                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <span className="text-4xl">💰</span>
                                <h2 className="text-xl font-bold">Quanto você ganha por mês?</h2>
                                <p className="text-sm text-muted-foreground">
                                    Inclua salário, freelas, pensão... tudo que entra
                                </p>
                            </div>

                            <div className="max-w-xs mx-auto">
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    className="text-center text-2xl font-bold h-16 bg-white/5"
                                    placeholder="R$ 0,00"
                                    value={monthlyIncome > 0 ? formatCurrency(monthlyIncome) : ''}
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value.replace(/\D/g, '')) / 100 || 0;
                                        setMonthlyIncome(value);
                                    }}
                                />
                            </div>

                            {monthlyIncome > 0 && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center text-sm text-green-500"
                                >
                                    ✓ Renda registrada!
                                </motion.p>
                            )}
                        </div>
                    )}

                    {/* STEP 2: CONTAS FIXAS */}
                    {currentStep === 'fixed' && (
                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <span className="text-4xl">🏠</span>
                                <h2 className="text-xl font-bold">Contas que você paga todo mês</h2>
                                <p className="text-sm text-muted-foreground">
                                    Toque em cada item para adicionar o valor
                                </p>
                            </div>

                            {/* Grid de categorias */}
                            <div className="grid grid-cols-4 gap-3">
                                {FIXED_CATEGORIES.map((cat) => {
                                    const hasValue = fixedExpenses[cat.id] > 0;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => openFixedModal(cat)}
                                            className={cn(
                                                "flex flex-col items-center p-3 rounded-xl transition-all",
                                                "border-2",
                                                hasValue
                                                    ? "border-green-500 bg-green-500/10"
                                                    : "border-border/50 bg-surface/30 hover:bg-surface/50"
                                            )}
                                        >
                                            <span className="text-2xl mb-1">{cat.emoji}</span>
                                            <span className="text-xs text-center leading-tight">{cat.label}</span>
                                            {hasValue && (
                                                <span className="text-xs text-green-500 font-bold mt-1">
                                                    {formatCurrency(fixedExpenses[cat.id])}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Total */}
                            {totalFixed > 0 && (
                                <Card className="bg-primary/10 border-primary/30">
                                    <CardContent className="py-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">Total de contas fixas</span>
                                            <span className="text-xl font-bold text-primary">
                                                {formatCurrency(totalFixed)}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}

                    {/* STEP 3: GASTOS DO DIA A DIA */}
                    {currentStep === 'daily' && (
                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <span className="text-4xl">🛒</span>
                                <h2 className="text-xl font-bold">Gastos do dia a dia</h2>
                                <p className="text-sm text-muted-foreground">
                                    Mercado, restaurantes, uber... quanto você gasta por mês?
                                </p>
                            </div>

                            {/* Botão adicionar */}
                            <Button
                                onClick={() => openDailyModal()}
                                className="w-full btn-fire"
                                size="lg"
                            >
                                <Plus className="mr-2 h-5 w-5" />
                                Adicionar gasto
                            </Button>

                            {/* Lista de gastos */}
                            {dailyExpenses.length > 0 && (
                                <div className="space-y-2">
                                    {dailyExpenses.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between p-3 rounded-lg bg-surface/50 border border-border/30"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{item.emoji}</span>
                                                <span>{item.label}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold">{formatCurrency(item.amount)}</span>
                                                <button
                                                    onClick={() => removeDailyExpense(item.id)}
                                                    className="p-1 hover:bg-red-500/20 rounded"
                                                >
                                                    <X className="h-4 w-4 text-red-500" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Total */}
                            {totalDaily > 0 && (
                                <Card className="bg-orange-500/10 border-orange-500/30">
                                    <CardContent className="py-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">Total de gastos do dia a dia</span>
                                            <span className="text-xl font-bold text-orange-500">
                                                {formatCurrency(totalDaily)}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {dailyExpenses.length === 0 && (
                                <p className="text-center text-sm text-muted-foreground">
                                    💡 Não precisa ser exato. Coloque uma estimativa.
                                </p>
                            )}
                        </div>
                    )}

                    {/* STEP 4: DÍVIDAS */}
                    {currentStep === 'debts' && (
                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <span className="text-4xl">💳</span>
                                <h2 className="text-xl font-bold">Você está devendo algo?</h2>
                                <p className="text-sm text-muted-foreground">
                                    Cartão, empréstimo, financiamento...
                                </p>
                            </div>

                            {hasDebts === null && (
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setHasDebts(true)}
                                        className="w-full p-4 rounded-xl border-2 border-border/50 bg-surface/30 hover:bg-surface/50 transition-all text-left"
                                    >
                                        <span className="text-lg">😔 Sim, tenho dívidas</span>
                                    </button>
                                    <button
                                        onClick={() => setHasDebts(false)}
                                        className="w-full p-4 rounded-xl border-2 border-green-500/50 bg-green-500/10 hover:bg-green-500/20 transition-all text-left"
                                    >
                                        <span className="text-lg">✅ Não, estou em dia!</span>
                                    </button>
                                </div>
                            )}

                            {hasDebts === true && (
                                <div className="space-y-4">
                                    <Button
                                        onClick={() => setDebtModalOpen(true)}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Adicionar dívida
                                    </Button>

                                    {debts.map((debt) => (
                                        <div
                                            key={debt.id}
                                            className="p-4 rounded-lg bg-red-500/10 border border-red-500/30"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium">{debt.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Parcela: {formatCurrency(debt.monthlyPayment)}/mês
                                                    </p>
                                                    {debt.totalAmount > 0 && (
                                                        <p className="text-xs text-red-400">
                                                            Total: {formatCurrency(debt.totalAmount)}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => removeDebt(debt.id)}
                                                    className="p-1 hover:bg-red-500/20 rounded"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => setHasDebts(null)}
                                        className="text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        ← Voltar
                                    </button>
                                </div>
                            )}

                            {hasDebts === false && (
                                <div className="text-center space-y-4">
                                    <p className="text-green-500">🎉 Ótimo! Você está no caminho certo!</p>
                                    <button
                                        onClick={() => setHasDebts(null)}
                                        className="text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        ← Voltar
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 5: RESUMO */}
                    {currentStep === 'summary' && (
                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <span className="text-4xl">📊</span>
                                <h2 className="text-xl font-bold">Seu Raio-X Financeiro</h2>
                            </div>

                            {/* Cards de resumo */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                                    <span>💰 Você ganha</span>
                                    <span className="text-xl font-bold text-green-500">{formatCurrency(monthlyIncome)}</span>
                                </div>
                                <div className="flex justify-between items-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                                    <span>🏠 Contas fixas</span>
                                    <span className="text-xl font-bold text-blue-500">-{formatCurrency(totalFixed)}</span>
                                </div>
                                <div className="flex justify-between items-center p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
                                    <span>🛒 Dia a dia</span>
                                    <span className="text-xl font-bold text-orange-500">-{formatCurrency(totalDaily)}</span>
                                </div>
                                {totalDebtPayments > 0 && (
                                    <div className="flex justify-between items-center p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                                        <span>💳 Dívidas</span>
                                        <span className="text-xl font-bold text-red-500">-{formatCurrency(totalDebtPayments)}</span>
                                    </div>
                                )}

                                <div className="border-t border-border/50 my-2" />

                                <div className={cn(
                                    "flex justify-between items-center p-4 rounded-lg",
                                    balance >= 0 ? "bg-green-500/20 border-2 border-green-500" : "bg-red-500/20 border-2 border-red-500"
                                )}>
                                    <span className="font-bold">{balance >= 0 ? '✅ Sobra' : '⚠️ Falta'}</span>
                                    <span className={cn(
                                        "text-2xl font-bold",
                                        balance >= 0 ? "text-green-500" : "text-red-500"
                                    )}>
                                        {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
                                    </span>
                                </div>
                            </div>

                            {summaryPieData.length > 0 && (
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Card className="bg-card/50 border-primary/10">
                                        <CardContent className="pt-6">
                                            <p className="text-sm font-medium text-muted-foreground mb-3">
                                                Distribuicao das despesas
                                            </p>
                                            <div className="h-52">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={summaryPieData}
                                                            dataKey="value"
                                                            nameKey="name"
                                                            innerRadius={50}
                                                            outerRadius={80}
                                                        >
                                                            {summaryPieData.map((entry, index) => (
                                                                <Cell
                                                                    key={`cell-${entry.name}`}
                                                                    fill={pieColors[index % pieColors.length]}
                                                                />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-card/50 border-primary/10">
                                        <CardContent className="pt-6">
                                            <p className="text-sm font-medium text-muted-foreground mb-3">
                                                Renda x despesas
                                            </p>
                                            <div className="h-52">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={barData}>
                                                        <XAxis dataKey="name" />
                                                        <YAxis />
                                                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                                                        <Bar dataKey="value" fill="#60a5fa" radius={[6, 6, 0, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {(debtRatio > 0.3 || fixedRatio > 0.6) && (
                                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500 flex items-start gap-3">
                                    <AlertTriangle className="h-5 w-5 mt-0.5" />
                                    <div>
                                        <p className="font-semibold">Atenção aos limites</p>
                                        {debtRatio > 0.3 && (
                                            <p>
                                                Sua parcela de dividas esta acima de 30% da renda. Vale olhar isso com carinho.
                                            </p>
                                        )}
                                        {fixedRatio > 0.6 && (
                                            <p>
                                                As contas fixas passam de 60% da renda. Talvez precise renegociar ou reduzir.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Mensagem */}
                            {balance < 0 && (
                                <p className="text-sm text-center text-yellow-500 bg-yellow-500/10 p-3 rounded-lg">
                                    💡 Não se preocupe! Nos próximos dias vamos trabalhar juntos para equilibrar isso.
                                </p>
                            )}

                            {/* Reflexão */}
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Como você se sente vendo esses números?</p>
                                <Textarea
                                    placeholder="Sinceridade total... assustado, aliviado, surpreso?"
                                    value={emotionalNote}
                                    onChange={(e) => setEmotionalNote(e.target.value)}
                                    className="min-h-[80px] bg-white/5"
                                />
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navegação */}
            <div className="flex gap-3 pt-4">
                {currentStepIndex > 0 && (
                    <Button variant="outline" onClick={prevStep} className="flex-1">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar
                    </Button>
                )}

                {currentStep !== 'summary' ? (
                    <Button
                        onClick={nextStep}
                        disabled={!canProceed()}
                        className="flex-1 btn-fire"
                    >
                        Próximo
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button
                        onClick={handleComplete}
                        disabled={saving}
                        className="flex-1 btn-fire"
                    >
                        {saving ? 'Salvando...' : (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Concluir Raio-X
                            </>
                        )}
                    </Button>
                )}
            </div>

            {/* MODAIS */}

            {/* Modal de despesa fixa */}
            <Dialog open={fixedModalOpen} onOpenChange={setFixedModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <span className="text-2xl">{fixedModalCategory?.emoji}</span>
                            Quanto você paga de {fixedModalCategory?.label.toLowerCase()}?
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            type="text"
                            inputMode="numeric"
                            className="text-center text-xl font-bold h-14"
                            placeholder="R$ 0,00"
                            value={fixedModalValue ? formatInputCurrency(fixedModalValue) : ''}
                            onChange={(e) => setFixedModalValue(e.target.value.replace(/\D/g, ''))}
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setFixedModalOpen(false)} className="flex-1">
                                Cancelar
                            </Button>
                            <Button onClick={saveFixedExpense} className="flex-1 btn-fire">
                                Salvar
                            </Button>
                        </div>
                        {fixedExpenses[fixedModalCategory?.id || ''] > 0 && (
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    removeFixedExpense(fixedModalCategory?.id || '');
                                    setFixedModalOpen(false);
                                }}
                                className="w-full text-red-500 hover:text-red-400"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remover este gasto
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal de gasto diário */}
            <Dialog open={dailyModalOpen} onOpenChange={setDailyModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {dailyModalCategory ? `${dailyModalCategory.emoji} ${dailyModalCategory.label}` : 'Adicionar gasto'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {!dailyModalCategory && (
                            <div className="grid grid-cols-4 gap-2">
                                {DAILY_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setDailyModalCategory(cat)}
                                        className="flex flex-col items-center p-2 rounded-lg border border-border/50 hover:bg-surface/50"
                                    >
                                        <span className="text-xl">{cat.emoji}</span>
                                        <span className="text-xs">{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {dailyModalCategory && (
                            <>
                                <p className="text-sm text-muted-foreground text-center">
                                    Quanto você gasta de {dailyModalCategory.label.toLowerCase()} por mês?
                                </p>
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    className="text-center text-xl font-bold h-14"
                                    placeholder="R$ 0,00"
                                    value={dailyModalValue ? formatInputCurrency(dailyModalValue) : ''}
                                    onChange={(e) => setDailyModalValue(e.target.value.replace(/\D/g, ''))}
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => setDailyModalCategory(null)} className="flex-1">
                                        ← Voltar
                                    </Button>
                                    <Button onClick={saveDailyExpense} className="flex-1 btn-fire">
                                        Adicionar
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal de dívida */}
            <Dialog open={debtModalOpen} onOpenChange={setDebtModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>💳 Adicionar dívida</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-muted-foreground">De quem é a dívida?</label>
                            <Input
                                placeholder="Ex: Cartão Nubank, Empréstimo Banco..."
                                value={debtName}
                                onChange={(e) => setDebtName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground">Quanto você paga por mês?</label>
                            <Input
                                type="text"
                                inputMode="numeric"
                                placeholder="R$ 0,00"
                                value={debtMonthly ? formatInputCurrency(debtMonthly) : ''}
                                onChange={(e) => setDebtMonthly(e.target.value.replace(/\D/g, ''))}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground">Total da dívida (opcional)</label>
                            <Input
                                type="text"
                                inputMode="numeric"
                                placeholder="R$ 0,00"
                                value={debtTotal ? formatInputCurrency(debtTotal) : ''}
                                onChange={(e) => setDebtTotal(e.target.value.replace(/\D/g, ''))}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setDebtModalOpen(false)} className="flex-1">
                                Cancelar
                            </Button>
                            <Button onClick={saveDebt} className="flex-1 btn-fire" disabled={!debtName || !debtMonthly}>
                                Adicionar
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Day2FinancialMapper;
