import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Edit, CheckCircle2 } from 'lucide-react';
import { OutputMetricValue } from '@/services/dayEngine';
import { generateDayAnalysis } from '@/lib/dayAnalysis';
import { generateDayReport } from '@/lib/printReport';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { ReportRenderer } from './reports';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { AiDayReportPayload, formatAiDayReportText } from '@/lib/aiDayReport';
import { fetchAiDayReportMeta, generateAiDayReport } from '@/services/aiReports';
import AiAnalysisCard from '@/components/day/AiAnalysisCard';
import { useDays } from '@/hooks/useDays';
import { DAY_ENGINE } from '@/config/dayEngine';

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
    const { user } = useAuth();
    const { progress } = useUserProgress();
    const { days } = useDays();
    const [aiReport, setAiReport] = useState<AiDayReportPayload | null>(null);
    const [aiStatus, setAiStatus] = useState<'idle' | 'loading' | 'ready' | 'disabled' | 'budget_exceeded' | 'error'>('idle');

    const analysis = useMemo(
        () => generateDayAnalysis(dayId, formData),
        [dayId, formData]
    );

    const dayContent = useMemo(
        () => days.find((day) => day.id === dayId) ?? null,
        [days, dayId]
    );

    const dayConfig = useMemo(
        () => DAY_ENGINE.find((day) => day.id === dayId) ?? null,
        [dayId]
    );

    const dayContext = useMemo(
        () => ({
            title: dayTitle,
            subtitle: dayConfig?.subtitle ?? null,
            objective: dayConfig?.objective ?? null,
            tips: dayConfig?.tips ?? null,
            morning_message: dayContent?.morningMessage ?? null,
            concept_title: dayContent?.conceptTitle ?? null,
            concept: dayContent?.concept ?? null,
            task_title: dayContent?.taskTitle ?? null,
            description: dayContent?.description ?? null,
        }),
        [dayTitle, dayConfig?.subtitle, dayConfig?.objective, dayConfig?.tips, dayContent]
    );

    const formDataSnapshot = useMemo(() => JSON.stringify(formData || {}), [formData]);
    const metricsSnapshot = useMemo(() => JSON.stringify(metrics || []), [metrics]);
    const dayContextSnapshot = useMemo(() => JSON.stringify(dayContext || {}), [dayContext]);

    useEffect(() => {
        if (!user?.id) return;
        let active = true;

        const loadAiReport = async () => {
            setAiStatus('loading');
            const existing = await fetchAiDayReportMeta(user.id, dayId);
            if (!active) return;
            if (existing.report) {
                const completedAtDate = new Date(completedAt);
                const updatedAtDate = existing.updatedAt ? new Date(existing.updatedAt) : null;
                if (updatedAtDate && updatedAtDate >= completedAtDate) {
                    setAiReport(existing.report);
                    setAiStatus('ready');
                    return;
                }
            }

            const result = await generateAiDayReport({
                dayId,
                dayTitle,
                formData,
                metrics,
                userName: progress.userName,
                dayContext,
            });
            if (!active) return;
            if (result.report) {
                setAiReport(result.report);
                setAiStatus('ready');
            } else {
                setAiStatus(result.status as typeof aiStatus);
            }
        };

        loadAiReport();
        return () => {
            active = false;
        };
    }, [user?.id, dayId, dayTitle, formDataSnapshot, metricsSnapshot, dayContextSnapshot]);

    const analysisText = aiReport ? formatAiDayReportText(aiReport) : analysis;

    const handlePrint = async () => {
        await generateDayReport({
            dayId,
            dayTitle,
            completedAt,
            metrics,
            formData,
            analysis: analysisText,
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

    // Tenta renderizar um relatório customizado para o dia
    const customReport = (
        <ReportRenderer
            dayId={dayId}
            dayTitle={dayTitle}
            formData={formData}
            completedAt={completedAt}
            metrics={metrics}
            onPrint={handlePrint}
            onEdit={onEdit}
            aiReport={aiReport}
        />
    );

    // Se existe um relatório customizado para este dia, usa ele
    if (customReport.type !== null && customReport.props.dayId && [1, 2].includes(dayId)) {
        return customReport;
    }

    // Fallback: relatório genérico para dias sem customização
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
            {aiReport ? (
                <AiAnalysisCard report={aiReport} title="Analise do Dia" />
            ) : (
                <Card className="glass-card border-primary/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            💡 Análise do Dia
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {aiStatus === 'loading' ? (
                            <p className="text-muted-foreground leading-relaxed">
                                Gerando analise personalizada...
                            </p>
                        ) : (
                            <p className="text-muted-foreground leading-relaxed">{analysis}</p>
                        )}
                    </CardContent>
                </Card>
            )}

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
