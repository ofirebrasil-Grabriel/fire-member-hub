import React, { useState } from 'react';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { IncomeItem, useIncomeItems } from '@/hooks/useIncomeItems';
import { FixedExpense, useFixedExpenses } from '@/hooks/useFixedExpenses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, DollarSign, Calendar, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Day2StepperProps {
    onComplete: (formData: Record<string, unknown>) => void;
    defaultValues?: Record<string, unknown>;
}

const STEPS = [
    { id: 'income', title: 'Entradas', description: 'Fontes de renda mensal' },
    { id: 'fixed', title: 'Saídas Fixas', description: 'Despesas recorrentes' },
    { id: 'summary', title: 'Resumo', description: 'Visão geral' },
];

const CATEGORIES = [
    { value: 'housing', label: 'Habitação' },
    { value: 'utilities', label: 'Serviços Públicos' },
    { value: 'transport', label: 'Transporte' },
    { value: 'education', label: 'Educação' },
    { value: 'health', label: 'Saúde' },
    { value: 'insurance', label: 'Seguros' },
    { value: 'subscriptions', label: 'Assinaturas' },
    { value: 'other', label: 'Outros' },
];

const Day2Stepper: React.FC<Day2StepperProps> = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [incomeItems, setIncomeItems] = useState<Partial<IncomeItem>[]>([
        { source: '', amount: 0, received_on: 5, recurrence: 'monthly' },
    ]);
    const [fixedExpenses, setFixedExpenses] = useState<Partial<FixedExpense>[]>([
        { name: '', amount: 0, category: 'housing', due_date: 10 },
    ]);
    const [saving, setSaving] = useState(false);

    const incomeHook = useIncomeItems();
    const expenseHook = useFixedExpenses();

    // Income handlers
    const addIncomeItem = () => {
        setIncomeItems([...incomeItems, { source: '', amount: 0, received_on: 5, recurrence: 'monthly' }]);
    };

    const removeIncomeItem = (index: number) => {
        if (incomeItems.length > 1) {
            setIncomeItems(incomeItems.filter((_, i) => i !== index));
        }
    };

    const updateIncomeItem = (index: number, field: keyof IncomeItem, value: unknown) => {
        const updated = [...incomeItems];
        updated[index] = { ...updated[index], [field]: value };
        setIncomeItems(updated);
    };

    // Fixed expense handlers
    const addFixedExpense = () => {
        setFixedExpenses([...fixedExpenses, { name: '', amount: 0, category: 'other', due_date: 10 }]);
    };

    const removeFixedExpense = (index: number) => {
        if (fixedExpenses.length > 1) {
            setFixedExpenses(fixedExpenses.filter((_, i) => i !== index));
        }
    };

    const updateFixedExpense = (index: number, field: keyof FixedExpense, value: unknown) => {
        const updated = [...fixedExpenses];
        updated[index] = { ...updated[index], [field]: value };
        setFixedExpenses(updated);
    };

    // Calculations
    const totalIncome = incomeItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalExpenses = fixedExpenses.reduce((sum, item) => sum + (item.amount || 0), 0);
    const balance = totalIncome - totalExpenses;

    // Navigation
    const canGoNext = () => {
        if (currentStep === 0) {
            return incomeItems.some(item => item.source && item.amount && item.amount > 0);
        }
        if (currentStep === 1) {
            return fixedExpenses.some(item => item.name && item.amount && item.amount > 0);
        }
        return true;
    };

    const goNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const goBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = async () => {
        setSaving(true);
        try {
            // Salvar income items
            for (const item of incomeItems) {
                if (item.source && item.amount) {
                    await incomeHook.create({
                        source: item.source,
                        amount: item.amount,
                        received_on: item.received_on,
                        recurrence: item.recurrence as 'monthly' | 'weekly' | 'biweekly' | 'one_time',
                    });
                }
            }

            // Salvar fixed expenses
            for (const expense of fixedExpenses) {
                if (expense.name && expense.amount) {
                    await expenseHook.create({
                        name: expense.name,
                        amount: expense.amount,
                        category: expense.category as any,
                        due_date: expense.due_date,
                    });
                }
            }

            toast({ title: 'Dados salvos com sucesso!' });

            onComplete({
                totalIncome,
                totalExpenses,
                balance,
                incomeItemsCount: incomeItems.filter(i => i.source && i.amount).length,
                fixedExpensesCount: fixedExpenses.filter(e => e.name && e.amount).length,
            });
        } catch (error) {
            toast({ title: 'Erro ao salvar', variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Stepper Header */}
            <div className="flex items-center justify-between mb-8">
                {STEPS.map((step, index) => (
                    <React.Fragment key={step.id}>
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${index < currentStep
                                        ? 'bg-green-500 text-white'
                                        : index === currentStep
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground'
                                    }`}
                            >
                                {index < currentStep ? <Check className="h-5 w-5" /> : index + 1}
                            </div>
                            <span className="text-xs mt-2 text-center font-medium">{step.title}</span>
                        </div>
                        {index < STEPS.length - 1 && (
                            <div className={`flex-1 h-1 mx-2 rounded ${index < currentStep ? 'bg-green-500' : 'bg-muted'}`} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Step Content */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-4">{STEPS[currentStep].title}</h3>
                <p className="text-sm text-muted-foreground mb-6">{STEPS[currentStep].description}</p>

                {/* Step 1: Income */}
                {currentStep === 0 && (
                    <div className="space-y-4">
                        {incomeItems.map((item, index) => (
                            <div key={index} className="flex items-end gap-3 p-4 rounded-lg bg-surface/50 border border-border/50">
                                <div className="flex-1">
                                    <Label className="text-xs">Fonte</Label>
                                    <Input
                                        placeholder="Ex: Salário"
                                        value={item.source || ''}
                                        onChange={(e) => updateIncomeItem(index, 'source', e.target.value)}
                                    />
                                </div>
                                <div className="w-32">
                                    <Label className="text-xs">Valor</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            className="pl-9"
                                            placeholder="0,00"
                                            value={item.amount || ''}
                                            onChange={(e) => updateIncomeItem(index, 'amount', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                </div>
                                <div className="w-24">
                                    <Label className="text-xs">Dia</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={31}
                                        value={item.received_on || 5}
                                        onChange={(e) => updateIncomeItem(index, 'received_on', parseInt(e.target.value) || 5)}
                                    />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeIncomeItem(index)}
                                    disabled={incomeItems.length === 1}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" onClick={addIncomeItem} className="w-full">
                            <Plus className="mr-2 h-4 w-4" /> Adicionar entrada
                        </Button>
                        <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Total de Entradas</span>
                                <span className="text-xl font-bold text-primary">
                                    R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Fixed Expenses */}
                {currentStep === 1 && (
                    <div className="space-y-4">
                        {fixedExpenses.map((expense, index) => (
                            <div key={index} className="flex items-end gap-3 p-4 rounded-lg bg-surface/50 border border-border/50">
                                <div className="flex-1">
                                    <Label className="text-xs">Despesa</Label>
                                    <Input
                                        placeholder="Ex: Aluguel"
                                        value={expense.name || ''}
                                        onChange={(e) => updateFixedExpense(index, 'name', e.target.value)}
                                    />
                                </div>
                                <div className="w-36">
                                    <Label className="text-xs">Categoria</Label>
                                    <Select
                                        value={expense.category || 'other'}
                                        onValueChange={(value) => updateFixedExpense(index, 'category', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map((cat) => (
                                                <SelectItem key={cat.value} value={cat.value}>
                                                    {cat.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-28">
                                    <Label className="text-xs">Valor</Label>
                                    <Input
                                        type="number"
                                        placeholder="0,00"
                                        value={expense.amount || ''}
                                        onChange={(e) => updateFixedExpense(index, 'amount', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="w-20">
                                    <Label className="text-xs">Vence</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={31}
                                        value={expense.due_date || 10}
                                        onChange={(e) => updateFixedExpense(index, 'due_date', parseInt(e.target.value) || 10)}
                                    />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFixedExpense(index)}
                                    disabled={fixedExpenses.length === 1}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" onClick={addFixedExpense} className="w-full">
                            <Plus className="mr-2 h-4 w-4" /> Adicionar despesa
                        </Button>
                        <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Total de Despesas Fixas</span>
                                <span className="text-xl font-bold text-destructive">
                                    R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Summary */}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                                <div className="text-sm text-muted-foreground">Total Entradas</div>
                                <div className="text-2xl font-bold text-green-500">
                                    R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                                <div className="text-sm text-muted-foreground">Total Saídas</div>
                                <div className="text-2xl font-bold text-red-500">
                                    R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        </div>

                        <div className={`p-6 rounded-xl text-center ${balance >= 0 ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'} border`}>
                            <div className="text-sm uppercase tracking-wider text-muted-foreground">
                                {balance >= 0 ? 'Sobra' : 'Falta'}
                            </div>
                            <div className={`text-4xl font-black mt-2 ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                R$ {Math.abs(balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="p-3 rounded-lg bg-muted/50">
                                <div className="text-muted-foreground">Fontes de renda</div>
                                <div className="font-bold">{incomeItems.filter(i => i.source).length}</div>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50">
                                <div className="text-muted-foreground">Despesas fixas</div>
                                <div className="font-bold">{fixedExpenses.filter(e => e.name).length}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={goBack}
                    disabled={currentStep === 0}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                </Button>

                {currentStep < STEPS.length - 1 ? (
                    <Button onClick={goNext} disabled={!canGoNext()}>
                        Próximo <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button onClick={handleComplete} disabled={saving} className="btn-fire">
                        {saving ? 'Salvando...' : 'Concluir Dia 2'}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Day2Stepper;
