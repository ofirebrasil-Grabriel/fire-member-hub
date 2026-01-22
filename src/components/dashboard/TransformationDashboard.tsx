import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TrendingUp, Heart, Target, Wallet, Award } from 'lucide-react';

interface TransformationDashboardProps {
    className?: string;
}

// Labels do termômetro emocional
const BREATHE_LABELS = [
    { min: 0, max: 3, label: 'Não aguento mais', emoji: '😫', color: 'text-red-500' },
    { min: 4, max: 5, label: 'Sobrevivendo', emoji: '😐', color: 'text-yellow-500' },
    { min: 6, max: 7, label: 'Respirando', emoji: '😊', color: 'text-green-400' },
    { min: 8, max: 10, label: 'Tranquilo', emoji: '😌', color: 'text-green-600' },
];

const getBreatheInfo = (score: number) => {
    return BREATHE_LABELS.find(l => score >= l.min && score <= l.max) || BREATHE_LABELS[0];
};

// Narrativas de transformação por fase
const TRANSFORMATION_PHASES = [
    { days: [1, 2, 3], phase: 'Descoberta', description: 'Entendendo sua realidade', emoji: '🔍' },
    { days: [4, 5, 6], phase: 'Consciência', description: 'Identificando padrões', emoji: '💡' },
    { days: [7, 8, 9], phase: 'Estruturação', description: 'Organizando as finanças', emoji: '📋' },
    { days: [10, 11, 12], phase: 'Ação', description: 'Renegociando e cortando', emoji: '⚡' },
    { days: [13, 14, 15], phase: 'Consolidação', description: 'Criando novos hábitos', emoji: '🏆' },
];

const getCurrentPhase = (currentDay: number) => {
    return TRANSFORMATION_PHASES.find(p => p.days.includes(currentDay)) || TRANSFORMATION_PHASES[0];
};

export default function TransformationDashboard({ className }: TransformationDashboardProps) {
    const { progress } = useUserProgress();

    // Calcular métricas
    const metrics = useMemo(() => {
        const daysCompleted = Object.values(progress.daysProgress).filter(d => d.completed).length;
        const totalDays = 15;
        const percentComplete = Math.round((daysCompleted / totalDays) * 100);

        // Buscar dados do Dia 1 (termômetro inicial)
        const day1Data = progress.daysProgress[1]?.form_data as Record<string, unknown> | undefined;
        const initialBreathe = Number(day1Data?.breathe_score) || 0;

        // Buscar último termômetro
        let latestBreathe = initialBreathe;
        for (let i = 15; i >= 1; i--) {
            const dayData = progress.daysProgress[i]?.form_data as Record<string, unknown> | undefined;
            if (dayData && Object.prototype.hasOwnProperty.call(dayData, 'breathe_score')) {
                const value = Number(dayData.breathe_score);
                if (!Number.isNaN(value)) {
                    latestBreathe = value;
                    break;
                }
            }
        }

        // Buscar dados do Dia 2 (finanças)
        const day2Data = progress.daysProgress[2]?.form_data as Record<string, unknown> | undefined;
        const totalIncome = Number(day2Data?.totalIncome) || 0;
        const balance = Number(day2Data?.balance) || 0;
        const totalDebt = Number(day2Data?.totalDebtAmount) || 0;

        // Dia atual
        const currentDay = progress.currentDay || 1;

        return {
            daysCompleted,
            totalDays,
            percentComplete,
            initialBreathe,
            latestBreathe,
            breatheChange: latestBreathe - initialBreathe,
            totalIncome,
            balance,
            totalDebt,
            currentDay,
            phase: getCurrentPhase(currentDay),
        };
    }, [progress]);

    const initialInfo = getBreatheInfo(metrics.initialBreathe);
    const currentInfo = getBreatheInfo(metrics.latestBreathe);

    // Se não completou nenhum dia, não mostra o dashboard
    if (metrics.daysCompleted === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("space-y-4", className)}
        >
            {/* Card Principal: Jornada */}
            <Card className="glass-card border-primary/20 overflow-hidden mx-auto">
                <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-transparent">
                    <CardTitle className="text-lg flex items-center gap-2">
                        🔥 Sua Jornada de Transformação
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    {/* Progresso geral */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progresso do desafio</span>
                            <span className="font-bold text-primary">{metrics.daysCompleted}/15 dias</span>
                        </div>
                        <Progress value={metrics.percentComplete} className="h-3" />
                    </div>

                    {/* Fase atual */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <span className="text-2xl">{metrics.phase.emoji}</span>
                        <div>
                            <p className="font-bold text-primary">{metrics.phase.phase}</p>
                            <p className="text-sm text-muted-foreground">{metrics.phase.description}</p>
                        </div>
                    </div>

                    {/* Timeline visual simplificada */}
                    <div className="w-full py-2 flex justify-center">
                        {TRANSFORMATION_PHASES.map((phase, idx) => {
                            const isActive = phase === metrics.phase;
                            const isCompleted = metrics.currentDay > Math.max(...phase.days);
                            return (
                                <div key={phase.phase} className="flex  items-center">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0",
                                        isCompleted && "bg-green-500 text-white",
                                        isActive && "bg-primary text-white ring-2 ring-primary/50",
                                        !isCompleted && !isActive && "bg-muted text-muted-foreground"
                                    )}>
                                        {isCompleted ? '✓' : phase.emoji}
                                    </div>
                                    {idx < TRANSFORMATION_PHASES.length - 1 && (
                                        <div className={cn(
                                            "w-6 h-1 mx-1",
                                            isCompleted ? "bg-green-500" : "bg-muted"
                                        )} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Evolução Emocional */}
            {metrics.initialBreathe > 0 && (
                <Card className="glass-card border-primary/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Heart className="h-4 w-4 text-red-500" />
                            Evolução Emocional
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            {/* Estado inicial */}
                            <div className="text-center">
                                <p className="text-xs text-muted-foreground mb-1">Dia 1</p>
                                <span className="text-3xl">{initialInfo.emoji}</span>
                                <p className={cn("text-lg font-bold", initialInfo.color)}>
                                    {metrics.initialBreathe}/10
                                </p>
                                <p className="text-xs text-muted-foreground">{initialInfo.label}</p>
                            </div>

                            {/* Seta de evolução */}
                            <div className="flex flex-col items-center px-4">
                                <TrendingUp className={cn(
                                    "h-6 w-6",
                                    metrics.breatheChange > 0 ? "text-green-500" :
                                        metrics.breatheChange < 0 ? "text-red-500" : "text-muted-foreground"
                                )} />
                                <span className={cn(
                                    "text-sm font-bold",
                                    metrics.breatheChange > 0 ? "text-green-500" :
                                        metrics.breatheChange < 0 ? "text-red-500" : "text-muted-foreground"
                                )}>
                                    {metrics.breatheChange > 0 ? `+${metrics.breatheChange}` : metrics.breatheChange}
                                </span>
                            </div>

                            {/* Estado atual */}
                            <div className="text-center">
                                <p className="text-xs text-muted-foreground mb-1">Hoje</p>
                                <span className="text-3xl">{currentInfo.emoji}</span>
                                <p className={cn("text-lg font-bold", currentInfo.color)}>
                                    {metrics.latestBreathe}/10
                                </p>
                                <p className="text-xs text-muted-foreground">{currentInfo.label}</p>
                            </div>
                        </div>

                        {/* Mensagem de evolução */}
                        {metrics.breatheChange > 0 && (
                            <p className="text-center text-sm text-green-500 mt-3 bg-green-500/10 p-2 rounded-lg">
                                🎉 Você melhorou {metrics.breatheChange} pontos! Continue assim!
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Próximo Marco */}
            <Card className="glass-card border-primary/10 bg-gradient-to-r from-primary/5 to-transparent">
                <CardContent className="py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Target className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium">Próximo marco</p>
                            <p className="text-xs text-muted-foreground">
                                {metrics.daysCompleted < 3 && "Complete 3 dias para desbloquear a fase de Consciência"}
                                {metrics.daysCompleted >= 3 && metrics.daysCompleted < 6 && "Complete 6 dias para começar a Estruturação"}
                                {metrics.daysCompleted >= 6 && metrics.daysCompleted < 9 && "Complete 9 dias para entrar na fase de Ação"}
                                {metrics.daysCompleted >= 9 && metrics.daysCompleted < 12 && "Complete 12 dias para a Consolidação final"}
                                {metrics.daysCompleted >= 12 && metrics.daysCompleted < 15 && "Faltam apenas ${15 - metrics.daysCompleted} dias para a formatura! 🎓"}
                                {metrics.daysCompleted >= 15 && "🎉 Parabéns! Você completou o desafio!"}
                            </p>
                        </div>
                        {metrics.daysCompleted >= 15 && (
                            <Award className="h-8 w-8 text-yellow-500" />
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
