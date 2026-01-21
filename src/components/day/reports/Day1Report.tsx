import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Edit, CheckCircle2, Clock, Bell, Target, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

interface Day1ReportProps {
    formData: Record<string, unknown>;
    completedAt: string;
    onPrint: () => void;
    onEdit: () => void;
}

// Mapas de labels para exibição
const FEELING_LABELS: Record<string, { label: string; emoji: string }> = {
    anxious: { label: 'Ansioso(a)', emoji: '😰' },
    calm: { label: 'Tranquilo(a)', emoji: '😌' },
    confused: { label: 'Confuso(a)', emoji: '😕' },
    scared: { label: 'Com medo', emoji: '😨' },
    indifferent: { label: 'Indiferente', emoji: '😐' },
};

const BLOCKER_LABELS: Record<string, { label: string; emoji: string }> = {
    low_income: { label: 'Ganho pouco', emoji: '💸' },
    overspending: { label: 'Gasto demais', emoji: '🛒' },
    debts: { label: 'Dívidas', emoji: '💳' },
    no_control: { label: 'Falta de controle', emoji: '📊' },
    dont_know: { label: 'Não sei por onde começar', emoji: '❓' },
};

const PERIOD_LABELS: Record<string, { label: string; emoji: string }> = {
    morning: { label: 'Manhã', emoji: '🌅' },
    afternoon: { label: 'Tarde', emoji: '☀️' },
    night: { label: 'Noite', emoji: '🌙' },
};

const BREATHE_LABELS = [
    { min: 0, max: 3, label: 'Não aguento mais', color: 'bg-red-500', emoji: '😫' },
    { min: 4, max: 6, label: 'Sobrevivendo', color: 'bg-yellow-500', emoji: '😐' },
    { min: 7, max: 8, label: 'Respirando', color: 'bg-green-400', emoji: '😊' },
    { min: 9, max: 10, label: 'Tranquilo', color: 'bg-green-600', emoji: '😌' },
];

const CHANNEL_LABELS: Record<string, string> = {
    push: '📱 Push',
    whatsapp: '💬 WhatsApp',
    email: '📧 E-mail',
    sms: '📩 SMS',
};

export default function Day1Report({
    formData,
    completedAt,
    onPrint,
    onEdit,
}: Day1ReportProps) {
    // Extrair dados do formData
    const moneyFeeling = formData.money_feeling as string;
    const hasOverdueBills = formData.has_overdue_bills as string;
    const monthlyIncome = Number(formData.monthly_income) || 0;
    const topExpenses = (formData.top_expenses as string[]) || [];
    const sharesFinances = formData.shares_finances as boolean;
    const sharesWith = formData.shares_with as string;
    const biggestBlocker = formData.biggest_blocker as string;
    const mainGoal = formData.main_goal as string;
    const triedBefore = formData.tried_before as boolean;
    const whatBlocked = formData.what_blocked as string;

    const breatheScore = Number(formData.breathe_score) || 5;
    const breatheReason = formData.breathe_reason as string;

    const dailyPeriod = formData.daily_time_period as string;
    const reminderEnabled = formData.reminder_enabled as boolean;
    const reminderChannels = (formData.reminder_channels as string[]) || [];
    const minimumStep = formData.minimum_step as string;

    // Helper functions
    const getBreatheLabel = (score: number) => {
        return BREATHE_LABELS.find(l => score >= l.min && score <= l.max) || BREATHE_LABELS[0];
    };

    const breatheInfo = getBreatheLabel(breatheScore);
    const feelingInfo = FEELING_LABELS[moneyFeeling] || { label: moneyFeeling, emoji: '❓' };
    const blockerInfo = BLOCKER_LABELS[biggestBlocker] || { label: biggestBlocker, emoji: '❓' };
    const periodInfo = PERIOD_LABELS[dailyPeriod] || { label: dailyPeriod, emoji: '⏰' };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header de Sucesso */}
            <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-3">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-green-500">Dia 1 Concluído!</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Seu desafio começou em {new Date(completedAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                    })}
                </p>
            </div>

            {/* Seção 1: Resumo do Questionário */}
            <Card className="glass-card border-primary/10">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        📋 Seu Retrato Financeiro
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Como se sente com dinheiro */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50 border border-border/30">
                        <span className="text-sm text-muted-foreground">Como você se sente com dinheiro?</span>
                        <span className="font-medium flex items-center gap-1">
                            <span>{feelingInfo.emoji}</span> {feelingInfo.label}
                        </span>
                    </div>

                    {/* Boletos atrasados */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50 border border-border/30">
                        <span className="text-sm text-muted-foreground">Boletos atrasados?</span>
                        <span className={cn(
                            "font-medium",
                            hasOverdueBills === 'yes' ? 'text-red-500' : 'text-green-500'
                        )}>
                            {hasOverdueBills === 'yes' ? '⚠️ Sim' : hasOverdueBills === 'no' ? '✅ Não' : '🤔 Não tenho certeza'}
                        </span>
                    </div>

                    {/* Renda mensal */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50 border border-border/30">
                        <span className="text-sm text-muted-foreground">Renda mensal aproximada</span>
                        <span className="font-bold text-primary text-lg">
                            {formatCurrency(monthlyIncome)}
                        </span>
                    </div>

                    {/* Top 3 despesas */}
                    {topExpenses.length > 0 && (
                        <div className="p-3 rounded-lg bg-surface/50 border border-border/30">
                            <p className="text-sm text-muted-foreground mb-2">Suas 3 maiores despesas:</p>
                            <div className="flex flex-wrap gap-2">
                                {topExpenses.filter(e => e).map((expense, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                                        {expense}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Divide finanças */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50 border border-border/30">
                        <span className="text-sm text-muted-foreground">Divide finanças com alguém?</span>
                        <span className="font-medium">
                            {sharesFinances ? `👥 Sim${sharesWith ? ` (${sharesWith})` : ''}` : '👤 Não'}
                        </span>
                    </div>

                    {/* Maior travamento */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50 border border-border/30">
                        <span className="text-sm text-muted-foreground">Maior travamento financeiro</span>
                        <span className="font-medium flex items-center gap-1">
                            <span>{blockerInfo.emoji}</span> {blockerInfo.label}
                        </span>
                    </div>

                    {/* O que quer conquistar */}
                    {mainGoal && (
                        <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                            <p className="text-sm text-muted-foreground mb-1">🎯 O que você quer conquistar:</p>
                            <p className="font-medium text-foreground italic">"{mainGoal}"</p>
                        </div>
                    )}

                    {/* Tentou antes */}
                    {triedBefore && whatBlocked && (
                        <div className="p-3 rounded-lg bg-surface/50 border border-border/30">
                            <p className="text-sm text-muted-foreground mb-1">O que impediu no passado:</p>
                            <p className="text-sm text-foreground">{whatBlocked}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Seção 2: Termômetro Emocional */}
            <Card className="glass-card border-primary/10">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        Termômetro Emocional
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-4">
                        <span className="text-5xl mb-2 block">{breatheInfo.emoji}</span>
                        <span className={cn(
                            "text-4xl font-bold",
                            breatheInfo.color.replace('bg-', 'text-')
                        )}>
                            {breatheScore}/10
                        </span>
                        <p className={cn(
                            "text-lg font-medium mt-1",
                            breatheInfo.color.replace('bg-', 'text-')
                        )}>
                            {breatheInfo.label}
                        </p>
                    </div>

                    {/* Barra visual */}
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden mt-4">
                        <div
                            className={cn("h-full transition-all", breatheInfo.color)}
                            style={{ width: `${(breatheScore / 10) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0</span>
                        <span>5</span>
                        <span>10</span>
                    </div>

                    {breatheReason && (
                        <div className="mt-4 p-3 rounded-lg bg-surface/50 border border-border/30">
                            <p className="text-sm text-muted-foreground">Justificativa:</p>
                            <p className="text-sm italic mt-1">"{breatheReason}"</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Seção 3: Compromisso Diário */}
            <Card className="glass-card border-primary/10">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Seu Compromisso Diário
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Periodo */}
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Periodo escolhido</p>
                            <p className="font-bold text-xl">
                                {periodInfo.emoji} {periodInfo.label}
                            </p>
                        </div>
                    </div>

                    {/* Lembretes */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50 border border-border/30">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                            <Bell className="h-4 w-4" /> Lembretes ativos
                        </span>
                        <span className={cn(
                            "font-medium",
                            reminderEnabled ? 'text-green-500' : 'text-muted-foreground'
                        )}>
                            {reminderEnabled ? '✅ Sim' : '❌ Não'}
                        </span>
                    </div>

                    {/* Canais de lembrete */}
                    {reminderEnabled && reminderChannels.length > 0 && (
                        <div className="p-3 rounded-lg bg-surface/50 border border-border/30">
                            <p className="text-sm text-muted-foreground mb-2">Canais de notificação:</p>
                            <div className="flex flex-wrap gap-2">
                                {reminderChannels.map((channel, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-muted text-sm">
                                        {CHANNEL_LABELS[channel] || channel}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Passo mínimo */}
                    {minimumStep && (
                        <div className="p-3 rounded-lg bg-surface/50 border border-border/30">
                            <p className="text-sm text-muted-foreground mb-1">Seu passo mínimo (dias difíceis):</p>
                            <p className="font-medium text-foreground">{minimumStep}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={onPrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Baixar PDF
                </Button>
                <Button variant="secondary" className="flex-1" onClick={onEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar Respostas
                </Button>
            </div>
        </div>
    );
}
