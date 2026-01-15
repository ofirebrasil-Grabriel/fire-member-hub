import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Edit, CheckCircle2 } from 'lucide-react';
import { OutputMetricValue } from '@/services/dayEngine';
import { generateDayAnalysis } from '@/lib/dayAnalysis';
import { generateDayReport } from '@/lib/printReport';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface DayCompletedTabProps {
    dayId: number;
    dayTitle: string;
    completedAt: string;
    metrics: OutputMetricValue[];
    formData: Record<string, unknown>;
    onEdit: () => void;
}

export default function DayCompletedTab({
    dayId,
    dayTitle,
    completedAt,
    metrics,
    formData,
    onEdit,
}: DayCompletedTabProps) {
    const analysis = useMemo(
        () => generateDayAnalysis(dayId, formData),
        [dayId, formData]
    );

    const handlePrint = async () => {
        await generateDayReport({
            dayId,
            dayTitle,
            completedAt,
            metrics,
            formData,
            analysis,
        });
    };

    const formatMetricValue = (metric: OutputMetricValue): string => {
        switch (metric.format) {
            case 'currency':
                return formatCurrency(Number(metric.value) || 0);
            case 'percent':
                return `${metric.value}%`;
            case 'number':
                return String(metric.value);
            default:
                return String(metric.value);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500" id="day-report">
            {/* Header de Sucesso */}
            <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-3">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-green-500">Desafio Concluído!</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Concluído em {new Date(completedAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
            </div>

            {/* Métricas do Dia */}
            <Card className="glass-card border-primary/10">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        📊 Métricas do Dia {dayId}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {metrics.map((metric) => (
                            <div
                                key={metric.key}
                                className="p-3 rounded-lg bg-surface/50 border border-border/30"
                            >
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    {metric.icon && <span>{metric.icon}</span>}
                                    {metric.label}
                                </p>
                                <p className={cn(
                                    "text-lg font-bold mt-1",
                                    metric.format === 'currency' && "text-primary"
                                )}>
                                    {formatMetricValue(metric)}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Análise do Dia */}
            <Card className="glass-card border-primary/10">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        💡 Análise do Dia
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{analysis}</p>
                </CardContent>
            </Card>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handlePrint}
                >
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir Relatório
                </Button>
                <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={onEdit}
                >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar Tarefa
                </Button>
            </div>
        </div>
    );
}
