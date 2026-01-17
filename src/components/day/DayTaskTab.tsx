import { DayConfig } from '@/config/dayEngine';
import Day1Wizard from '@/components/day/Day1Wizard';
import Day2FinancialMapper from '@/components/day/Day2FinancialMapper';
import Day3TriggerAnalysis from '@/components/day/Day3TriggerAnalysis';
import Day4SpendingRules from '@/components/day/Day4SpendingRules';
import Day5CardPolicy from '@/components/day/Day5CardPolicy';
import Day6QuickCuts from '@/components/day/Day6QuickCuts';
import Day8PaymentQueue from '@/components/day/Day8PaymentQueue';
import { DayInputForm } from '@/components/challenge/DayInputForm';
import { CrudSection, CrudType } from '@/components/challenge/CrudSection';
import { Loader2 } from 'lucide-react';

interface DayTaskTabProps {
    dayId: number;
    config: DayConfig;
    defaultValues?: Record<string, unknown>;
    onComplete: (values: Record<string, unknown>) => void;
    onInputSubmit?: (values: Record<string, unknown>) => void;
    onCrudComplete?: () => void;
    phase: 'input' | 'crud' | 'output';
    payload: Record<string, unknown>;
    isLoading: boolean;
}

export default function DayTaskTab({
    dayId,
    config,
    defaultValues,
    onComplete,
    onInputSubmit,
    onCrudComplete,
    phase,
    payload,
    isLoading,
}: DayTaskTabProps) {
    // Se tem customComponent, renderiza o componente específico
    if (config.customComponent) {
        return (
            <div className="animate-in fade-in duration-300">
                {dayId === 1 && (
                    <Day1Wizard
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {dayId === 2 && (
                    <Day2FinancialMapper
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {dayId === 3 && (
                    <Day3TriggerAnalysis
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {dayId === 4 && (
                    <Day4SpendingRules
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {dayId === 5 && (
                    <Day5CardPolicy
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {dayId === 6 && (
                    <Day6QuickCuts
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {dayId === 8 && (
                    <Day8PaymentQueue
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {/* Adicione mais dias customizados aqui conforme necessário */}
                {![1, 2, 3, 4, 5, 6, 8].includes(dayId) && (
                    <div className="text-center py-8 text-muted-foreground">
                        Componente customizado para o Dia {dayId} ainda não implementado.
                    </div>
                )}
            </div>
        );
    }

    // Se não tem customComponent, usa o fluxo genérico
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {isLoading && (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            )}

            {!isLoading && phase === 'input' && config.inputs.length > 0 && onInputSubmit && (
                <DayInputForm
                    inputs={config.inputs}
                    onSubmit={onInputSubmit}
                    defaultValues={defaultValues}
                />
            )}

            {!isLoading && phase === 'crud' && config.crudType && (
                <CrudSection
                    type={config.crudType as CrudType}
                />
            )}
        </div>
    );
}
