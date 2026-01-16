import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Heart, Brain, Target, Clock, DollarSign, Users, Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Day1WizardProps {
    onComplete: (formData: Record<string, unknown>) => void;
    defaultValues?: Record<string, unknown>;
}

// Wizard step configuration
interface WizardStep {
    id: number;
    field: string;
    question: string;
    subtitle?: string;
    type: 'select' | 'textarea' | 'multiselect' | 'currency' | 'text' | 'time' | 'dual-textarea';
    icon: React.ReactNode;
    options?: { value: string; label: string }[];
    placeholder?: string;
    required?: boolean;
    secondField?: string;
    secondPlaceholder?: string;
}

const WIZARD_STEPS: WizardStep[] = [
    {
        id: 1,
        field: 'feeling_about_money',
        question: 'Como você se sente hoje quando pensa em dinheiro?',
        type: 'select',
        icon: <Heart className="h-8 w-8" />,
        required: true,
        options: [
            { value: 'light', label: '😌 Leve, tranquilo' },
            { value: 'heavy', label: '😔 Pesado, preocupado' },
            { value: 'run', label: '😰 Dá vontade de fugir' },
        ],
    },
    {
        id: 2,
        field: 'first_money_memories',
        question: 'Quais são suas primeiras lembranças envolvendo dinheiro?',
        subtitle: 'Elas são positivas ou negativas?',
        type: 'textarea',
        icon: <Brain className="h-8 w-8" />,
        placeholder: 'Ex: "Lembro de ouvir meus pais brigando por causa de contas..." ou "Minha avó sempre me dava moedas para guardar no cofrinho..."',
        required: true,
    },
    {
        id: 3,
        field: 'rich_people_traits',
        secondField: 'poor_people_traits',
        question: 'Quando você pensa em pessoas ricas e pobres...',
        subtitle: 'Quais características vêm à mente?',
        type: 'dual-textarea',
        icon: <Users className="h-8 w-8" />,
        placeholder: 'Ex: "São sortudas, tiveram oportunidades, trabalham demais..."',
        secondPlaceholder: 'Ex: "São humildes, honestas, não tiveram chance..."',
        required: true,
    },
    {
        id: 4,
        field: 'current_emotions',
        question: 'Quais emoções surgem quando você pensa nas suas finanças?',
        subtitle: 'Selecione uma ou mais',
        type: 'multiselect',
        icon: <Heart className="h-8 w-8" />,
        required: true,
        options: [
            { value: 'fear', label: '😨 Medo' },
            { value: 'anxiety', label: '😰 Ansiedade' },
            { value: 'anger', label: '😠 Raiva' },
            { value: 'hope', label: '🌟 Esperança' },
            { value: 'indifference', label: '😐 Indiferença' },
            { value: 'shame', label: '😳 Vergonha' },
            { value: 'guilt', label: '😔 Culpa' },
        ],
    },
    {
        id: 5,
        field: 'ideal_life',
        question: 'Se dinheiro não fosse um problema, como você gostaria de viver?',
        subtitle: 'Quais projetos pessoais e profissionais realizaria?',
        type: 'textarea',
        icon: <Sparkles className="h-8 w-8" />,
        placeholder: 'Ex: "Moraria numa casa com quintal, viajaria todo ano, abriria meu próprio negócio..."',
        required: true,
    },
    {
        id: 6,
        field: 'current_issues',
        question: 'Você está com...',
        subtitle: 'Selecione todas que se aplicam',
        type: 'multiselect',
        icon: <Target className="h-8 w-8" />,
        required: true,
        options: [
            { value: 'late_bills', label: '📋 Boleto atrasado' },
            { value: 'growing_invoice', label: '💳 Fatura crescendo' },
            { value: 'paying_minimum', label: '💸 Pagando só o mínimo' },
            { value: 'limit_exceeded', label: '🚫 Limite estourado' },
            { value: 'no_savings', label: '🏦 Sem reserva' },
            { value: 'none', label: '✨ Nenhum desses' },
        ],
    },
    {
        id: 7,
        field: 'monthly_income',
        question: 'Quanto você ganha por mês?',
        subtitle: 'Aproximadamente',
        type: 'currency',
        icon: <DollarSign className="h-8 w-8" />,
        placeholder: '3500',
        required: true,
    },
    {
        id: 8,
        field: 'biggest_expense',
        question: 'O que mais pesa no seu mês?',
        type: 'text',
        icon: <DollarSign className="h-8 w-8" />,
        placeholder: 'Ex: Aluguel R$ 1.200, cartão de crédito, mercado...',
        required: true,
    },
    {
        id: 9,
        field: 'has_partner',
        secondField: 'partner_who',
        question: 'Você tem alguém para dividir a vida financeira?',
        type: 'select',
        icon: <Users className="h-8 w-8" />,
        required: true,
        options: [
            { value: 'yes', label: '✅ Sim' },
            { value: 'no', label: '❌ Não' },
            { value: 'sometimes', label: '🔄 Às vezes' },
        ],
    },
    {
        id: 10,
        field: 'biggest_blocks',
        question: 'O que mais te trava na hora de lidar com dinheiro?',
        subtitle: 'Selecione uma ou mais',
        type: 'multiselect',
        icon: <Target className="h-8 w-8" />,
        required: true,
        options: [
            { value: 'see_numbers', label: '🔢 Ver os números' },
            { value: 'debt_calls', label: '📞 Cobranças' },
            { value: 'home_conflict', label: '🏠 Briga em casa' },
            { value: 'no_energy', label: '😴 Falta de energia' },
            { value: 'dont_know_start', label: '❓ Não sei por onde começar' },
        ],
    },
    {
        id: 11,
        field: 'goals_15_days',
        question: 'O que você mais quer nesses 15 dias?',
        subtitle: 'Selecione seus principais objetivos',
        type: 'multiselect',
        icon: <Sparkles className="h-8 w-8" />,
        required: true,
        options: [
            { value: 'breathe', label: '🌬️ Respirar' },
            { value: 'organize_due_dates', label: '📅 Organizar vencimentos' },
            { value: 'start_agreements', label: '🤝 Iniciar acordos' },
            { value: 'plan_30_90', label: '📊 Montar plano 30/90' },
            { value: 'stop_debt', label: '🚫 Parar de fazer dívidas' },
            { value: 'peace', label: '☮️ Ter paz de espírito' },
        ],
    },
    {
        id: 12,
        field: 'schedule_period',
        secondField: 'schedule_time',
        question: 'Qual o melhor horário para seus 10 minutos diários?',
        type: 'time',
        icon: <Clock className="h-8 w-8" />,
        required: true,
        options: [
            { value: 'morning', label: '🌅 Manhã' },
            { value: 'afternoon', label: '☀️ Tarde' },
            { value: 'night', label: '🌙 Noite' },
        ],
    },
];

const Day1Wizard: React.FC<Day1WizardProps> = ({ onComplete, defaultValues = {} }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<Record<string, unknown>>({
        feeling_about_money: defaultValues.feeling_about_money || '',
        first_money_memories: defaultValues.first_money_memories || '',
        rich_people_traits: defaultValues.rich_people_traits || '',
        poor_people_traits: defaultValues.poor_people_traits || '',
        current_emotions: defaultValues.current_emotions || [],
        ideal_life: defaultValues.ideal_life || '',
        current_issues: defaultValues.current_issues || [],
        monthly_income: defaultValues.monthly_income || '',
        biggest_expense: defaultValues.biggest_expense || '',
        has_partner: defaultValues.has_partner || '',
        partner_who: defaultValues.partner_who || '',
        biggest_blocks: defaultValues.biggest_blocks || [],
        goals_15_days: defaultValues.goals_15_days || [],
        schedule_period: defaultValues.schedule_period || '',
        schedule_time: defaultValues.schedule_time || '09:00',
    });
    const [saving, setSaving] = useState(false);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');

    const step = WIZARD_STEPS[currentStep];
    const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

    const updateField = (field: string, value: unknown) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleArrayItem = (field: string, item: string) => {
        const current = (formData[field] as string[]) || [];
        const updated = current.includes(item)
            ? current.filter(i => i !== item)
            : [...current, item];
        updateField(field, updated);
    };

    // Validação rigorosa - todos os campos obrigatórios devem ser preenchidos
    const canProceed = (): boolean => {
        const value = formData[step.field];

        switch (step.type) {
            case 'multiselect':
                return (value as string[])?.length > 0;
            case 'time':
                return Boolean(formData.schedule_period) && Boolean(formData.schedule_time);
            case 'dual-textarea':
                return Boolean(formData[step.field]) && Boolean(formData[step.secondField!]);
            case 'textarea':
            case 'text':
                return Boolean(value) && String(value).trim().length > 0;
            case 'currency':
                return Boolean(value) && Number(value) > 0;
            case 'select':
                return Boolean(value);
            default:
                return Boolean(value);
        }
    };

    const handleNext = () => {
        if (currentStep < WIZARD_STEPS.length - 1) {
            setDirection('next');
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setDirection('prev');
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            onComplete(formData);
        } finally {
            setSaving(false);
        }
    };

    // Classes para item selecionado - glass effect em vez de laranja
    const selectedClass = "glass-card border-white/30 shadow-lg scale-[1.02]";
    const unselectedClass = "border-border/50 bg-surface/30 hover:bg-surface/50 hover:border-white/20";

    const renderStepContent = () => {
        switch (step.type) {
            case 'select':
                return (
                    <div className="space-y-3">
                        {step.options?.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => updateField(step.field, option.value)}
                                className={cn(
                                    "p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between",
                                    formData[step.field] === option.value
                                        ? selectedClass
                                        : unselectedClass
                                )}
                            >
                                <span className="text-lg">{option.label}</span>
                                {formData[step.field] === option.value && (
                                    <Check className="h-5 w-5 text-green-500" />
                                )}
                            </div>
                        ))}
                        {step.field === 'has_partner' && formData.has_partner === 'yes' && (
                            <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                                <Label className="text-sm text-muted-foreground mb-2 block">
                                    Quem?
                                </Label>
                                <Input
                                    placeholder="Ex: Meu marido Pedro, minha esposa Ana..."
                                    value={formData.partner_who as string}
                                    onChange={(e) => updateField('partner_who', e.target.value)}
                                    className="glass-card"
                                />
                            </div>
                        )}
                    </div>
                );

            case 'textarea':
                return (
                    <Textarea
                        placeholder={step.placeholder}
                        value={formData[step.field] as string}
                        onChange={(e) => updateField(step.field, e.target.value)}
                        rows={5}
                        className="text-base resize-none glass-card border-border/50"
                    />
                );

            case 'dual-textarea':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label className="text-sm text-muted-foreground mb-2 block">
                                💎 Pessoas ricas
                            </Label>
                            <Textarea
                                placeholder={step.placeholder}
                                value={formData[step.field] as string}
                                onChange={(e) => updateField(step.field, e.target.value)}
                                rows={3}
                                className="resize-none glass-card border-border/50"
                            />
                        </div>
                        <div>
                            <Label className="text-sm text-muted-foreground mb-2 block">
                                🏠 Pessoas pobres
                            </Label>
                            <Textarea
                                placeholder={step.secondPlaceholder}
                                value={formData[step.secondField!] as string}
                                onChange={(e) => updateField(step.secondField!, e.target.value)}
                                rows={3}
                                className="resize-none glass-card border-border/50"
                            />
                        </div>
                    </div>
                );

            case 'multiselect':
                return (
                    <div className="grid grid-cols-2 gap-3">
                        {step.options?.map((option) => {
                            const isSelected = (formData[step.field] as string[])?.includes(option.value);
                            return (
                                <div
                                    key={option.value}
                                    onClick={() => toggleArrayItem(step.field, option.value)}
                                    className={cn(
                                        "p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center relative",
                                        isSelected ? selectedClass : unselectedClass
                                    )}
                                >
                                    <span className="text-sm">{option.label}</span>
                                    {isSelected && (
                                        <Check className="absolute top-2 right-2 h-4 w-4 text-green-500" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );

            case 'currency':
                return (
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                            R$
                        </span>
                        <Input
                            type="number"
                            placeholder={step.placeholder}
                            value={formData[step.field] as string}
                            onChange={(e) => updateField(step.field, e.target.value)}
                            className="pl-12 text-2xl h-14 text-center glass-card border-border/50"
                        />
                    </div>
                );

            case 'text':
                return (
                    <Input
                        placeholder={step.placeholder}
                        value={formData[step.field] as string}
                        onChange={(e) => updateField(step.field, e.target.value)}
                        className="text-lg h-14 glass-card border-border/50"
                    />
                );

            case 'time':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                            {step.options?.map((option) => {
                                const isSelected = formData.schedule_period === option.value;
                                return (
                                    <div
                                        key={option.value}
                                        onClick={() => updateField('schedule_period', option.value)}
                                        className={cn(
                                            "p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center relative",
                                            isSelected ? selectedClass : unselectedClass
                                        )}
                                    >
                                        <span className="text-lg">{option.label}</span>
                                        {isSelected && (
                                            <Check className="absolute top-2 right-2 h-4 w-4 text-green-500" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-center">
                            <Input
                                type="time"
                                value={formData.schedule_time as string}
                                onChange={(e) => updateField('schedule_time', e.target.value)}
                                className="w-32 text-center text-xl h-12 glass-card border-border/50"
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-[500px] flex flex-col">
            {/* Progress bar */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                        Passo {currentStep + 1} de {WIZARD_STEPS.length}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                        {Math.round(progress)}%
                    </span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            {/* Question content */}
            <div
                key={step.id}
                className={cn(
                    "flex-1 animate-in duration-300",
                    direction === 'next'
                        ? "fade-in slide-in-from-right-4"
                        : "fade-in slide-in-from-left-4"
                )}
            >
                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center text-primary">
                        {step.icon}
                    </div>
                </div>

                {/* Question */}
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold mb-2">{step.question}</h2>
                    {step.subtitle && (
                        <p className="text-muted-foreground text-sm">{step.subtitle}</p>
                    )}
                </div>

                {/* Input */}
                <div className="max-w-md mx-auto">
                    {renderStepContent()}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 mt-8 pt-4 border-t border-border/30">
                <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="flex-1 glass-card border-border/50"
                >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={!canProceed() || saving}
                    className="flex-1 btn-fire"
                >
                    {currentStep === WIZARD_STEPS.length - 1 ? (
                        saving ? 'Finalizando...' : 'Concluir Dia 1'
                    ) : (
                        <>
                            Avançar
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default Day1Wizard;
