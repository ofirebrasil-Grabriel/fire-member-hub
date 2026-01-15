import { DayConfig } from '@/config/dayEngine';
import Day1Form from '@/components/day/Day1Form';
import Day2Stepper from '@/components/day/Day2Stepper';
import Day3TransactionTable from '@/components/day/Day3TransactionTable';
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
                    <Day1Form
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {dayId === 2 && (
                    <Day2Stepper
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {dayId === 3 && (
                    <Day3TransactionTable
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {/* Adicione mais dias customizados aqui conforme necessário */}
                {![1, 2, 3].includes(dayId) && (
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
