import React from 'react';
import Day1Report from './Day1Report';
import Day2Report from './Day2Report';
import { OutputMetricValue } from '@/services/dayEngine';

interface ReportRendererProps {
    dayId: number;
    dayTitle: string;
    formData: Record<string, unknown>;
    completedAt: string;
    metrics: OutputMetricValue[];
    onPrint: () => void;
    onEdit: () => void;
}

/**
 * Orquestrador de relatórios por dia.
 * Renderiza o componente de relatório específico para cada dia.
 */
export default function ReportRenderer({
    dayId,
    dayTitle,
    formData,
    completedAt,
    metrics,
    onPrint,
    onEdit,
}: ReportRendererProps) {
    switch (dayId) {
        case 1:
            return (
                <Day1Report
                    formData={formData}
                    completedAt={completedAt}
                    onPrint={onPrint}
                    onEdit={onEdit}
                />
            );

        // TODO: Adicionar mais dias conforme implementados
        case 2:
            return (
                <Day2Report
                    formData={formData}
                    completedAt={completedAt}
                    onPrint={onPrint}
                    onEdit={onEdit}
                />
            );

        default:
            // Fallback: retorna null para usar o componente genérico
            return null;
    }
}
