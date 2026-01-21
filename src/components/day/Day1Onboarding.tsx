import React, { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
    ChevronLeft, ChevronRight, Check, Bell, Smartphone,
    Mail, MessageSquare, DollarSign, AlertCircle, Target, Sparkles,
    Users, HelpCircle, Heart, Frown, Meh, Smile, PartyPopper
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Day1OnboardingProps {
    onComplete: (formData: Record<string, unknown>) => void;
    defaultValues?: Record<string, unknown>;
}

// Step 1: 8 Questions
interface Question {
    id: number;
    field: string;
    question: string;
    type: 'select' | 'currency' | 'multi-text' | 'radio-conditional' | 'textarea';
    options?: { value: string; label: string; icon?: string }[];
    placeholder?: string;
    conditionalField?: string;
    maxLength?: number;
}

const QUESTIONS: Question[] = [
    {
        id: 1,
        field: 'money_feeling',
        question: 'Como você se sente ao pensar em dinheiro?',
        type: 'select',
        options: [
            { value: 'anxious', label: 'Ansioso(a)', icon: '😰' },
            { value: 'calm', label: 'Tranquilo(a)', icon: '😌' },
            { value: 'confused', label: 'Confuso(a)', icon: '😕' },
            { value: 'scared', label: 'Com medo', icon: '😨' },
            { value: 'indifferent', label: 'Indiferente', icon: '😐' },
        ],
    },
    {
        id: 2,
        field: 'has_overdue_bills',
        question: 'Você tem boletos atrasados neste momento?',
        type: 'select',
        options: [
            { value: 'yes', label: 'Sim', icon: '📋' },
            { value: 'no', label: 'Não', icon: '✅' },
            { value: 'unsure', label: 'Não sei ao certo', icon: '🤔' },
        ],
    },
    {
        id: 3,
        field: 'monthly_income',
        question: 'Qual sua renda mensal aproximada?',
        type: 'currency',
        placeholder: '3500',
    },
    {
        id: 4,
        field: 'top_expenses',
        question: 'Quais são suas 3 maiores despesas mensais?',
        type: 'multi-text',
        placeholder: 'Ex: Aluguel, Mercado, Transporte...',
    },
    {
        id: 5,
        field: 'shares_finances',
        question: 'Você divide sua vida financeira com alguém?',
        type: 'radio-conditional',
        options: [
            { value: 'yes', label: 'Sim' },
            { value: 'no', label: 'Não' },
        ],
        conditionalField: 'shares_with',
    },
    {
        id: 6,
        field: 'biggest_blocker',
        question: 'Qual seu maior travamento financeiro?',
        type: 'select',
        options: [
            { value: 'low_income', label: 'Ganho pouco', icon: '💸' },
            { value: 'overspending', label: 'Gasto demais', icon: '🛒' },
            { value: 'debts', label: 'Dívidas', icon: '💳' },
            { value: 'no_control', label: 'Falta de controle', icon: '📊' },
            { value: 'dont_know', label: 'Não sei por onde começar', icon: '❓' },
        ],
    },
    {
        id: 7,
        field: 'main_goal',
        question: 'O que você mais quer conquistar nestes 15 dias?',
        type: 'textarea',
        placeholder: 'Ex: Sair do vermelho, ter uma reserva de emergência, parar de fazer dívidas...',
        maxLength: 200,
    },
    {
        id: 8,
        field: 'tried_before',
        question: 'Você já tentou organizar suas finanças antes?',
        type: 'radio-conditional',
        options: [
            { value: 'yes', label: 'Sim' },
            { value: 'no', label: 'Não' },
        ],
        conditionalField: 'what_blocked',
    },
];

// Thermometer config
const BREATHE_LABELS = [
    { min: 0, max: 3, label: 'Não aguento mais', color: 'bg-red-500', emoji: '😫' },
    { min: 4, max: 6, label: 'Sobrevivendo', color: 'bg-yellow-500', emoji: '😐' },
    { min: 7, max: 8, label: 'Respirando', color: 'bg-green-400', emoji: '😊' },
    { min: 9, max: 10, label: 'Tranquilo', color: 'bg-green-600', emoji: '😌' },
];

const PERIOD_OPTIONS = [
    { value: 'morning', label: 'Manhã', icon: '🌅', time: '6h-12h' },
    { value: 'afternoon', label: 'Tarde', icon: '☀️', time: '12h-18h' },
    { value: 'night', label: 'Noite', icon: '🌙', time: '18h-24h' },
];

// Minimum step options
const MINIMUM_STEPS = [
    { value: 'open_app', label: 'Só abrir o app e ver meu progresso' },
    { value: 'note_bill', label: 'Anotar apenas 1 conta que vence hoje' },
    { value: 'read_message', label: 'Ler a mensagem do dia' },
    { value: 'other', label: 'Outro' },
];

const Day1Onboarding: React.FC<Day1OnboardingProps> = ({ onComplete, defaultValues }) => {
    // Main step: 1=Questions, 2=Thermometer, 3=Commitment, 4=Review, 5=Celebration
    const [mainStep, setMainStep] = useState<1 | 2 | 3 | 4 | 5>(1);
    const [questionIndex, setQuestionIndex] = useState(0);

    // Form data
    const [formData, setFormData] = useState<Record<string, unknown>>({
        // Step 1: Questions
        money_feeling: '',
        has_overdue_bills: '',
        monthly_income: '',
        top_expenses: ['', '', ''],
        shares_finances: '',
        shares_with: '',
        biggest_blocker: '',
        main_goal: '',
        tried_before: '',
        what_blocked: '',
        // Step 2: Thermometer
        breathe_score: 5,
        breathe_reason: '',
        // Step 3: Commitment
        daily_time_period: '',
        reminder_enabled: true,
        reminder_channels: ['push'],
        minimum_step: '',
        minimum_step_custom: '',
    });

    const [direction, setDirection] = useState<'next' | 'prev'>('next');

    const currentQuestion = QUESTIONS[questionIndex];

    useEffect(() => {
        if (!defaultValues) return;

        const minimumStepLabel = String(defaultValues.minimum_step || '');
        const matchingMinimumStep = MINIMUM_STEPS.find((step) => step.label === minimumStepLabel);

        setFormData((prev) => ({
            ...prev,
            money_feeling: String(defaultValues.money_feeling || ''),
            has_overdue_bills: String(defaultValues.has_overdue_bills || ''),
            monthly_income: defaultValues.monthly_income ? String(defaultValues.monthly_income) : '',
            top_expenses: Array.isArray(defaultValues.top_expenses)
                ? defaultValues.top_expenses
                : ['', '', ''],
            shares_finances: defaultValues.shares_finances ? 'yes' : 'no',
            shares_with: String(defaultValues.shares_with || ''),
            biggest_blocker: String(defaultValues.biggest_blocker || ''),
            main_goal: String(defaultValues.main_goal || ''),
            tried_before: defaultValues.tried_before ? 'yes' : 'no',
            what_blocked: String(defaultValues.what_blocked || ''),
            breathe_score: Number(defaultValues.breathe_score ?? 5),
            breathe_reason: String(defaultValues.breathe_reason || ''),
            daily_time_period: String(defaultValues.daily_time_period || ''),
            reminder_enabled: Boolean(
                defaultValues.reminder_enabled === undefined ? true : defaultValues.reminder_enabled
            ),
            reminder_channels: Array.isArray(defaultValues.reminder_channels)
                ? defaultValues.reminder_channels
                : ['push'],
            minimum_step: matchingMinimumStep ? matchingMinimumStep.value : minimumStepLabel ? 'other' : '',
            minimum_step_custom: matchingMinimumStep ? '' : minimumStepLabel,
        }));
    }, [defaultValues]);

    // Update field
    const updateField = (field: string, value: unknown) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Get breathe label
    const getBreatheLabel = (score: number) => {
        return BREATHE_LABELS.find(l => score >= l.min && score <= l.max) || BREATHE_LABELS[0];
    };

    // Toggle channel
    const toggleChannel = (channel: string) => {
        const current = formData.reminder_channels as string[];
        const updated = current.includes(channel)
            ? current.filter(c => c !== channel)
            : [...current, channel];
        updateField('reminder_channels', updated);
    };

    // Validation
    const canProceedQuestion = (): boolean => {
        const q = currentQuestion;
        const value = formData[q.field];

        switch (q.type) {
            case 'select':
                return Boolean(value);
            case 'currency':
                return Number(value) > 0;
            case 'multi-text':
                const expenses = value as string[];
                return expenses.filter(e => e.trim()).length >= 1;
            case 'radio-conditional': {
                if (!value) return false;
                if (value === 'yes' && q.conditionalField) {
                    return Boolean(String(formData[q.conditionalField] || '').trim());
                }
                return true;
            }
            case 'textarea':
                return Boolean(value) && String(value).trim().length > 0;
            default:
                return Boolean(value);
        }
    };

    const canProceedThermometer = Boolean(String(formData.breathe_reason || '').trim());

    const canProceedCommitment = Boolean(formData.daily_time_period) &&
        (formData.minimum_step !== 'other' ? Boolean(formData.minimum_step) : Boolean(formData.minimum_step_custom));

    // Progress
    const totalProgress = useMemo(() => {
        if (mainStep === 1) return ((questionIndex + 1) / QUESTIONS.length) * 25;
        if (mainStep === 2) return 25 + 25;
        if (mainStep === 3) return 50 + 25;
        if (mainStep === 4) return 75 + 25;
        return 100;
    }, [mainStep, questionIndex]);

    // Navigate questions
    const nextQuestion = () => {
        if (questionIndex < QUESTIONS.length - 1) {
            setDirection('next');
            setQuestionIndex(prev => prev + 1);
        } else {
            setMainStep(2);
        }
    };

    const prevQuestion = () => {
        if (questionIndex > 0) {
            setDirection('prev');
            setQuestionIndex(prev => prev - 1);
        }
    };

    // Handle complete
    const handleComplete = () => {
        const finalStep = formData.minimum_step === 'other'
            ? formData.minimum_step_custom
            : MINIMUM_STEPS.find(m => m.value === formData.minimum_step)?.label;

        onComplete({
            // Assessment data
            money_feeling: formData.money_feeling,
            has_overdue_bills: formData.has_overdue_bills,
            monthly_income: Number(formData.monthly_income),
            top_expenses: (formData.top_expenses as string[]).filter(e => e.trim()),
            shares_finances: formData.shares_finances === 'yes',
            shares_with: formData.shares_finances === 'yes' ? formData.shares_with : null,
            biggest_blocker: formData.biggest_blocker,
            main_goal: formData.main_goal,
            tried_before: formData.tried_before === 'yes',
            what_blocked: formData.tried_before === 'yes' ? formData.what_blocked : null,
            // Thermometer
            breathe_score: formData.breathe_score,
            breathe_reason: formData.breathe_reason,
            // Commitment
            daily_time_period: formData.daily_time_period,
            daily_time_exact: null,
            reminder_enabled: formData.reminder_enabled,
            reminder_channels: formData.reminder_channels,
            minimum_step: finalStep,
        });
        setMainStep(5);
    };

    // Render question
    const renderQuestion = () => {
        const q = currentQuestion;

        switch (q.type) {
            case 'select':
                return (
                    <div className="space-y-3">
                        {q.options?.map(opt => (
                            <div
                                key={opt.value}
                                onClick={() => updateField(q.field, opt.value)}
                                className={cn(
                                    "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3",
                                    formData[q.field] === opt.value
                                        ? "glass-card border-primary shadow-lg"
                                        : "border-border/30 hover:bg-muted/50"
                                )}
                            >
                                {opt.icon && <span className="text-2xl">{opt.icon}</span>}
                                <span className="text-lg">{opt.label}</span>
                                {formData[q.field] === opt.value && (
                                    <Check className="ml-auto h-5 w-5 text-green-500" />
                                )}
                            </div>
                        ))}
                    </div>
                );

            case 'currency':
                return (
                    <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                        <Input
                            type="number"
                            placeholder={q.placeholder}
                            value={formData[q.field] as string}
                            onChange={e => updateField(q.field, e.target.value)}
                            className="pl-12 text-2xl h-16 text-center glass-card"
                        />
                    </div>
                );

            case 'multi-text':
                return (
                    <div className="space-y-3">
                        {[0, 1, 2].map(i => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                                    {i + 1}
                                </span>
                                <Input
                                    placeholder={`Despesa ${i + 1}...`}
                                    value={(formData.top_expenses as string[])[i] || ''}
                                    onChange={e => {
                                        const expenses = [...(formData.top_expenses as string[])];
                                        expenses[i] = e.target.value;
                                        updateField('top_expenses', expenses);
                                    }}
                                    className="glass-card"
                                />
                            </div>
                        ))}
                    </div>
                );

            case 'radio-conditional':
                return (
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            {q.options?.map(opt => (
                                <div
                                    key={opt.value}
                                    onClick={() => updateField(q.field, opt.value)}
                                    className={cn(
                                        "flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all text-center",
                                        formData[q.field] === opt.value
                                            ? "glass-card border-primary"
                                            : "border-border/30 hover:bg-muted/50"
                                    )}
                                >
                                    <span className="text-lg">{opt.label}</span>
                                </div>
                            ))}
                        </div>
                        {formData[q.field] === 'yes' && q.conditionalField && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <Label className="text-sm text-muted-foreground mb-2 block">
                                    {q.field === 'shares_finances' ? 'Com quem?' : 'O que travou?'}
                                </Label>
                                <Input
                                    placeholder={q.field === 'shares_finances' ? 'Ex: Cônjuge, parceiro(a)...' : 'Ex: Falta de disciplina, imprevistos...'}
                                    value={formData[q.conditionalField] as string}
                                    onChange={e => updateField(q.conditionalField!, e.target.value)}
                                    className="glass-card"
                                />
                            </div>
                        )}
                    </div>
                );

            case 'textarea':
                return (
                    <div>
                        <Textarea
                            placeholder={q.placeholder}
                            value={formData[q.field] as string}
                            onChange={e => updateField(q.field, e.target.value.slice(0, q.maxLength))}
                            rows={4}
                            className="glass-card resize-none"
                        />
                        <p className="text-xs text-muted-foreground mt-2 text-right">
                            {String(formData[q.field] || '').length}/{q.maxLength}
                        </p>
                    </div>
                );
        }
    };

    // Render thermometer
    const renderThermometer = () => {
        const score = formData.breathe_score as number;
        const label = getBreatheLabel(score);

        return (
            <div className="space-y-6">
                <Card className="glass-card border-primary/10">
                    <CardContent className="p-4 text-sm text-muted-foreground flex items-center gap-3">
                        <Heart className="h-5 w-5 text-primary" />
                        <span>
                            Este termometro e so seu. Serve para ajustar o ritmo, nao para julgar voce.
                        </span>
                    </CardContent>
                </Card>
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Termômetro Emocional</h2>
                    <p className="text-muted-foreground text-sm">
                        De 0 a 10, como você está se sentindo financeiramente hoje?
                    </p>
                </div>

                {/* Emoji */}
                <div className="text-center">
                    <span className="text-7xl animate-bounce">{label.emoji}</span>
                </div>

                {/* Score display */}
                <div className="text-center">
                    <span className={cn("text-5xl font-bold", label.color.replace('bg-', 'text-'))}>
                        {score}
                    </span>
                    <p className={cn("text-lg font-medium mt-2", label.color.replace('bg-', 'text-'))}>
                        {label.label}
                    </p>
                </div>

                {/* Slider */}
                <div className="px-4">
                    <Slider
                        value={[score]}
                        onValueChange={([v]) => updateField('breathe_score', v)}
                        min={0}
                        max={10}
                        step={1}
                        className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0</span>
                        <span>5</span>
                        <span>10</span>
                    </div>
                </div>

                {/* Justification */}
                <div>
                    <Label className="text-sm mb-2 block">Por que você deu essa nota?</Label>
                    <Textarea
                        placeholder="Ex: Estou preocupado com as contas atrasadas..."
                        value={formData.breathe_reason as string}
                        onChange={e => updateField('breathe_reason', e.target.value.slice(0, 150))}
                        rows={3}
                        className="glass-card resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                        {String(formData.breathe_reason || '').length}/150
                    </p>
                </div>
            </div>
        );
    };

    // Render commitment
    const renderCommitment = () => {
        return (
            <div className="space-y-6">
                <Card className="glass-card border-primary/10">
                    <CardContent className="p-4 text-sm text-muted-foreground flex items-center gap-3">
                        <Target className="h-5 w-5 text-primary" />
                        <span>
                            Dez minutos por dia ja criam tracao. O importante e ter um periodo fixo.
                        </span>
                    </CardContent>
                </Card>
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Seu Compromisso Diário</h2>
                    <p className="text-muted-foreground text-sm">
                        Qual o melhor periodo para dedicar 10 minutos ao App FIRE?
                    </p>
                </div>

                {/* Period */}
                <div className="grid grid-cols-3 gap-3">
                    {PERIOD_OPTIONS.map(p => (
                        <div
                            key={p.value}
                            onClick={() => updateField('daily_time_period', p.value)}
                            className={cn(
                                "p-4 rounded-xl border-2 cursor-pointer transition-all text-center",
                                formData.daily_time_period === p.value
                                    ? "glass-card border-primary"
                                    : "border-border/30 hover:bg-muted/50"
                            )}
                        >
                            <span className="text-2xl block mb-1">{p.icon}</span>
                            <span className="font-medium">{p.label}</span>
                            <span className="text-xs text-muted-foreground block">{p.time}</span>
                        </div>
                    ))}
                </div>

                {/* Reminder toggle */}
                <div className="glass-card p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            <span className="font-medium">Quero receber lembretes</span>
                        </div>
                        <button
                            onClick={() => updateField('reminder_enabled', !formData.reminder_enabled)}
                            className={cn(
                                "w-12 h-6 rounded-full transition-colors relative",
                                formData.reminder_enabled ? "bg-primary" : "bg-muted"
                            )}
                        >
                            <span
                                className={cn(
                                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                                    formData.reminder_enabled ? "left-7" : "left-1"
                                )}
                            />
                        </button>
                    </div>

                    {formData.reminder_enabled && (
                        <div className="flex gap-2 animate-in fade-in">
                            {[
                                { value: 'push', icon: Smartphone, label: 'Push' },
                                { value: 'whatsapp', icon: MessageSquare, label: 'WhatsApp' },
                                { value: 'email', icon: Mail, label: 'E-mail' },
                            ].map(ch => (
                                <button
                                    key={ch.value}
                                    onClick={() => toggleChannel(ch.value)}
                                    className={cn(
                                        "flex-1 py-2 px-3 rounded-lg border-2 transition-all flex items-center justify-center gap-1",
                                        (formData.reminder_channels as string[]).includes(ch.value)
                                            ? "border-primary bg-primary/10"
                                            : "border-border/30"
                                    )}
                                >
                                    <ch.icon className="h-4 w-4" />
                                    <span className="text-xs">{ch.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Minimum step */}
                <div>
                    <Label className="text-sm mb-2 flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" />
                        Passo mínimo de emergência
                    </Label>
                    <p className="text-xs text-muted-foreground mb-3">
                        Se o dia estiver difícil, qual a menor ação que você consegue fazer?
                    </p>
                    <div className="space-y-2">
                        {MINIMUM_STEPS.map(step => (
                            <div
                                key={step.value}
                                onClick={() => updateField('minimum_step', step.value)}
                                className={cn(
                                    "p-3 rounded-lg border-2 cursor-pointer transition-all",
                                    formData.minimum_step === step.value
                                        ? "border-primary bg-primary/5"
                                        : "border-border/30 hover:bg-muted/50"
                                )}
                            >
                                {step.label}
                            </div>
                        ))}
                        {formData.minimum_step === 'other' && (
                            <Input
                                placeholder="Descreva seu passo mínimo..."
                                value={formData.minimum_step_custom as string}
                                onChange={e => updateField('minimum_step_custom', e.target.value)}
                                className="mt-2 glass-card"
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Render review
    const renderReview = () => {
        const breatheLabel = getBreatheLabel(formData.breathe_score as number);
        const feeling = QUESTIONS[0].options?.find(o => o.value === formData.money_feeling);
        const blocker = QUESTIONS[5].options?.find(o => o.value === formData.biggest_blocker);

        return (
            <div className="space-y-6">
                <Card className="glass-card border-primary/10">
                    <CardContent className="p-4 text-sm text-muted-foreground flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <span>
                            Revisao rapida para garantir que esta tudo fiel a sua realidade.
                        </span>
                    </CardContent>
                </Card>
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Revisão</h2>
                    <p className="text-muted-foreground text-sm">
                        Confira suas respostas antes de concluir
                    </p>
                </div>

                <Card className="glass-card">
                    <CardContent className="p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Sentimento</span>
                            <span className="flex items-center gap-2">
                                {feeling?.icon} {feeling?.label}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Termômetro</span>
                            <span className="flex items-center gap-2">
                                {breatheLabel.emoji} {formData.breathe_score}/10 - {breatheLabel.label}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Renda</span>
                            <span>R$ {Number(formData.monthly_income).toLocaleString('pt-BR')}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Maior bloqueio</span>
                            <span className="flex items-center gap-2">
                                {blocker?.icon} {blocker?.label}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Periodo</span>
                            <span className="flex items-center gap-2">
                                {PERIOD_OPTIONS.find(p => p.value === formData.daily_time_period)?.icon || '⏰'}
                                {PERIOD_OPTIONS.find(p => p.value === formData.daily_time_period)?.label || '-'}
                            </span>
                        </div>

                        <div className="pt-2 border-t">
                            <span className="text-muted-foreground text-sm">Seu objetivo:</span>
                            <p className="text-sm mt-1 italic">&quot;{formData.main_goal}&quot;</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    // Render celebration
    const renderCelebration = () => {
        return (
            <div className="text-center space-y-6 py-8">
                {/* Confetti effect with CSS */}
                <div className="relative">
                    <PartyPopper className="h-20 w-20 mx-auto text-primary animate-bounce" />
                    <Sparkles className="absolute top-0 left-1/4 h-8 w-8 text-yellow-400 animate-ping" />
                    <Sparkles className="absolute top-4 right-1/4 h-6 w-6 text-orange-400 animate-ping delay-100" />
                </div>

                <h2 className="text-2xl font-bold">Você completou o Dia 1!</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    Esse é o começo da sua jornada para a liberdade financeira.
                    Amanhã você vai mapear toda sua situação no Raio-X do Caos.
                </p>

                <Card className="glass-card max-w-sm mx-auto">
                    <CardContent className="p-4 text-left">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">
                                📋
                            </div>
                            <div>
                                <p className="font-bold">Dia 2 — Raio-X do Caos</p>
                                <p className="text-xs text-muted-foreground">Mapeie receitas, despesas e dívidas</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Button className="btn-fire w-full max-w-sm" onClick={() => window.location.reload()}>
                    <Target className="mr-2 h-4 w-4" />
                    Ver Meu Progresso
                </Button>
            </div>
        );
    };

    // Main render
    if (mainStep === 5) {
        return renderCelebration();
    }

    return (
        <div className="flex flex-col min-h-[400px]">
            {/* Progress */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                        {mainStep === 1 && `Pergunta ${questionIndex + 1} de ${QUESTIONS.length}`}
                        {mainStep === 2 && 'Termômetro'}
                        {mainStep === 3 && 'Compromisso'}
                        {mainStep === 4 && 'Revisão'}
                    </span>
                    <span className="text-sm font-medium">{Math.round(totalProgress)}%</span>
                </div>
                <Progress value={totalProgress} className="h-2" />
            </div>

            {/* Content */}
            <div className={cn(
                "flex-1 animate-in duration-300",
                direction === 'next' ? "fade-in slide-in-from-right-4" : "fade-in slide-in-from-left-4"
            )}>
                {mainStep === 1 && (
                    <div className="space-y-6">
                        <Card className="glass-card border-primary/10">
                            <CardContent className="p-4 text-sm text-muted-foreground flex items-center gap-3">
                                <Heart className="h-5 w-5 text-primary" />
                                <span>
                                    Aqui nao tem julgamento. Sua sinceridade e a base para um plano realista.
                                </span>
                            </CardContent>
                        </Card>
                        <div className="text-center">
                            <h2 className="text-xl font-bold mb-2">{currentQuestion.question}</h2>
                        </div>
                        {renderQuestion()}
                    </div>
                )}

                {mainStep === 2 && renderThermometer()}
                {mainStep === 3 && renderCommitment()}
                {mainStep === 4 && renderReview()}
            </div>

            {/* Navigation */}
            <div className="flex gap-3 mt-8 pt-4 border-t border-border/30">
                <Button
                    variant="outline"
                    onClick={() => {
                        setDirection('prev');
                        if (mainStep === 1 && questionIndex > 0) {
                            prevQuestion();
                        } else if (mainStep > 1) {
                            setMainStep((mainStep - 1) as 1 | 2 | 3 | 4);
                        }
                    }}
                    disabled={mainStep === 1 && questionIndex === 0}
                    className="flex-1 glass-card"
                >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Button>

                {mainStep === 1 && (
                    <Button
                        onClick={nextQuestion}
                        disabled={!canProceedQuestion()}
                        className="flex-1 btn-fire"
                    >
                        {questionIndex === QUESTIONS.length - 1 ? 'Termômetro' : 'Próxima'}
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                )}

                {mainStep === 2 && (
                    <Button
                        onClick={() => { setDirection('next'); setMainStep(3); }}
                        disabled={!canProceedThermometer}
                        className="flex-1 btn-fire"
                    >
                        Compromisso
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                )}

                {mainStep === 3 && (
                    <Button
                        onClick={() => { setDirection('next'); setMainStep(4); }}
                        disabled={!canProceedCommitment}
                        className="flex-1 btn-fire"
                    >
                        Revisar
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                )}

                {mainStep === 4 && (
                    <Button
                        onClick={handleComplete}
                        className="flex-1 btn-fire"
                    >
                        <Check className="mr-2 h-4 w-4" />
                        Concluir Dia 1
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Day1Onboarding;
