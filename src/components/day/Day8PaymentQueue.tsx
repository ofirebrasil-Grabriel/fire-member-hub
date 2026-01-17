import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
    Check, ArrowRight, ArrowLeft, Calendar, DollarSign, AlertTriangle,
    Plus, Trash2, Shield, Home, Briefcase, CreditCard, Coffee,
    Zap, Clock, MessageSquare, CheckCircle2, Circle
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

interface Day8PaymentQueueProps {
    onComplete: (formData: Record<string, unknown>) => void;
    defaultValues?: Record<string, unknown>;
}

interface BillItem {
    id: string;
    name: string;
    amount: number;
    dueDate: string;
    impact: string;
    consequence: string;
    priority: number;
    status: 'pay_now' | 'negotiate' | 'pause' | 'pending';
}

interface ActionItem {
    id: string;
    type: 'protection' | 'risk_reduction' | 'cut';
    description: string;
    completed: boolean;
}

const IMPACT_OPTIONS = [
    { value: 'health', label: 'Protege vida/saude', icon: Shield, color: 'red', priority: 1 },
    { value: 'housing', label: 'Protege moradia', icon: Home, color: 'orange', priority: 2 },
    { value: 'income', label: 'Protege renda', icon: Briefcase, color: 'yellow', priority: 3 },
    { value: 'credit', label: 'Protege credito/nome', icon: CreditCard, color: 'blue', priority: 4 },
    { value: 'comfort', label: 'Conforto/lazer', icon: Coffee, color: 'gray', priority: 5 },
];

const CONSEQUENCE_OPTIONS = [
    { value: 'immediate', label: 'Imediata e grave', icon: Zap, description: 'Corte, despejo, perda de renda', multiplier: 1 },
    { value: 'gradual', label: 'Gradual', icon: Clock, description: 'Multa pequena, atraso administravel', multiplier: 2 },
    { value: 'negotiable', label: 'Negociavel', icon: MessageSquare, description: 'Da pra pedir extensao/parcelar', multiplier: 3 },
];

const BILL_SUGGESTIONS = [
    { name: 'Aluguel', amount: 0, category: 'housing' },
    { name: 'Condominio', amount: 0, category: 'housing' },
    { name: 'Agua', amount: 0, category: 'housing' },
    { name: 'Luz', amount: 0, category: 'housing' },
    { name: 'Gas', amount: 0, category: 'housing' },
    { name: 'Internet', amount: 0, category: 'income' },
    { name: 'Telefone', amount: 0, category: 'income' },
    { name: 'Transporte/Combustivel', amount: 0, category: 'income' },
    { name: 'Cartao de credito', amount: 0, category: 'credit' },
    { name: 'Emprestimo', amount: 0, category: 'credit' },
    { name: 'Financiamento', amount: 0, category: 'housing' },
    { name: 'Parcela loja', amount: 0, category: 'credit' },
    { name: 'Plano de saude', amount: 0, category: 'health' },
    { name: 'Remedios', amount: 0, category: 'health' },
    { name: 'Alimentacao basica', amount: 0, category: 'health' },
];

const Day8PaymentQueue: React.FC<Day8PaymentQueueProps> = ({ onComplete }) => {
    const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

    // Step 1: Survival window
    const [nextPayDate, setNextPayDate] = useState('');
    const [availableMoney, setAvailableMoney] = useState<number>(0);

    // Step 2 & 3: Bills
    const [bills, setBills] = useState<BillItem[]>([]);
    const [newBillName, setNewBillName] = useState('');

    // Current bill being edited
    const [currentBillId, setCurrentBillId] = useState<string | null>(null);

    // Step 5: Plan choice
    const [selectedPlan, setSelectedPlan] = useState<'A' | 'B' | 'C' | null>(null);
    const [emergencyReason, setEmergencyReason] = useState('');

    // Step 6: Actions
    const [actions, setActions] = useState<ActionItem[]>([
        { id: '1', type: 'protection', description: '', completed: false },
        { id: '2', type: 'risk_reduction', description: '', completed: false },
        { id: '3', type: 'cut', description: '', completed: false },
    ]);

    // Get current bill
    const currentBill = bills.find(b => b.id === currentBillId);

    // Add bill from suggestion
    const handleAddBillSuggestion = (suggestion: typeof BILL_SUGGESTIONS[0]) => {
        const newBill: BillItem = {
            id: `bill-${Date.now()}`,
            name: suggestion.name,
            amount: 0,
            dueDate: '',
            impact: suggestion.category,
            consequence: '',
            priority: 99,
            status: 'pending',
        };
        setBills(prev => [...prev, newBill]);
        setCurrentBillId(newBill.id);
    };

    // Add custom bill
    const handleAddCustomBill = () => {
        if (!newBillName.trim()) return;
        const newBill: BillItem = {
            id: `bill-${Date.now()}`,
            name: newBillName.trim(),
            amount: 0,
            dueDate: '',
            impact: '',
            consequence: '',
            priority: 99,
            status: 'pending',
        };
        setBills(prev => [...prev, newBill]);
        setCurrentBillId(newBill.id);
        setNewBillName('');
    };

    // Remove bill
    const handleRemoveBill = (id: string) => {
        setBills(prev => prev.filter(b => b.id !== id));
        if (currentBillId === id) setCurrentBillId(null);
    };

    // Update bill
    const updateBill = (id: string, updates: Partial<BillItem>) => {
        setBills(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    // Calculate priority for a bill
    const calculatePriority = (bill: BillItem): number => {
        const impactOption = IMPACT_OPTIONS.find(i => i.value === bill.impact);
        const consequenceOption = CONSEQUENCE_OPTIONS.find(c => c.value === bill.consequence);
        if (!impactOption || !consequenceOption) return 99;
        return impactOption.priority * consequenceOption.multiplier;
    };

    // Sort bills by priority
    const sortedBills = useMemo(() => {
        return [...bills]
            .map(b => ({ ...b, priority: calculatePriority(b) }))
            .sort((a, b) => a.priority - b.priority);
    }, [bills]);

    // Stats
    const stats = useMemo(() => {
        const essential = sortedBills.filter(b => b.priority <= 3).reduce((sum, b) => sum + b.amount, 0);
        const important = sortedBills.filter(b => b.priority > 3 && b.priority <= 6).reduce((sum, b) => sum + b.amount, 0);
        const canWait = sortedBills.filter(b => b.priority > 6).reduce((sum, b) => sum + b.amount, 0);
        const total = essential + important + canWait;
        const gap = total - availableMoney;

        const payNow = sortedBills.filter(b => b.status === 'pay_now').reduce((sum, b) => sum + b.amount, 0);
        const negotiate = sortedBills.filter(b => b.status === 'negotiate').reduce((sum, b) => sum + b.amount, 0);
        const pause = sortedBills.filter(b => b.status === 'pause').reduce((sum, b) => sum + b.amount, 0);

        return { essential, important, canWait, total, gap, payNow, negotiate, pause };
    }, [sortedBills, availableMoney]);

    // Validation
    const canProceedStep1 = !!nextPayDate && availableMoney > 0;
    const canProceedStep2 = bills.length >= 1;
    const canProceedStep3 = bills.every(b => b.impact && b.consequence && b.amount > 0);
    const canProceedStep4 = true; // Just confirmation
    const canProceedStep5 = stats.gap <= 0 || (selectedPlan !== null && (selectedPlan !== 'C' || emergencyReason.length > 0));
    const canComplete = actions.every(a => a.description.length > 0);

    // Update action
    const updateAction = (id: string, description: string) => {
        setActions(prev => prev.map(a => a.id === id ? { ...a, description } : a));
    };

    // Handle complete
    const handleComplete = () => {
        onComplete({
            nextPayDate,
            availableMoney,
            bills: sortedBills.map(b => ({
                name: b.name,
                amount: b.amount,
                dueDate: b.dueDate,
                impact: IMPACT_OPTIONS.find(i => i.value === b.impact)?.label || b.impact,
                consequence: CONSEQUENCE_OPTIONS.find(c => c.value === b.consequence)?.label || b.consequence,
                priority: b.priority,
                status: b.status,
            })),
            totalBills: stats.total,
            gap: stats.gap,
            selectedPlan: stats.gap > 0 ? selectedPlan : null,
            emergencyReason: selectedPlan === 'C' ? emergencyReason : null,
            actions: actions.map(a => ({
                type: a.type === 'protection' ? 'Protecao' : a.type === 'risk_reduction' ? 'Reducao de risco' : 'Corte',
                description: a.description,
            })),
            payNowTotal: stats.payNow,
            negotiateTotal: stats.negotiate,
            pauseTotal: stats.pause,
        });
    };

    return (
        <div className="space-y-6">
            {/* Progress */}
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6].map(s => (
                    <div
                        key={s}
                        className={cn(
                            "h-1.5 flex-1 rounded-full transition-colors",
                            s <= step ? "bg-primary" : "bg-muted"
                        )}
                    />
                ))}
            </div>

            {/* Step 1: Survival Window */}
            {step === 1 && (
                <div className="space-y-4">
                    <div className="glass-card p-4">
                        <h3 className="font-bold text-lg mb-2">Passo 1: Janela de sobrevivencia</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Ate quando voce precisa segurar? Defina o proximo recebimento e quanto tem disponivel.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <Label className="text-xs">Data do proximo recebimento:</Label>
                                <div className="relative mt-1">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="date"
                                        value={nextPayDate}
                                        onChange={(e) => setNextPayDate(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs">Dinheiro disponivel para contas:</Label>
                                <div className="relative mt-1">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        placeholder="0,00"
                                        value={availableMoney || ''}
                                        onChange={(e) => setAvailableMoney(parseFloat(e.target.value) || 0)}
                                        className="pl-10"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Use o saldo real do Dia 4 como ponto de partida
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={() => setStep(2)} disabled={!canProceedStep1}>
                            Proximo <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 2: Add Bills */}
            {step === 2 && (
                <div className="space-y-4">
                    <div className="glass-card p-4">
                        <h3 className="font-bold text-lg mb-2">Passo 2: Liste as contas ate {nextPayDate}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            O que vence ate a data do proximo recebimento?
                        </p>

                        {/* Suggestions */}
                        <div className="mb-4">
                            <Label className="text-xs mb-2 block">Sugestoes:</Label>
                            <div className="flex flex-wrap gap-2">
                                {BILL_SUGGESTIONS.map((sug, i) => {
                                    const isAdded = bills.some(b => b.name === sug.name);
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => !isAdded && handleAddBillSuggestion(sug)}
                                            disabled={isAdded}
                                            className={cn(
                                                "px-3 py-1.5 rounded-full text-xs transition-colors",
                                                isAdded
                                                    ? "bg-muted text-muted-foreground line-through opacity-60"
                                                    : "glass-card hover:bg-muted border border-gray-200/30"
                                            )}
                                        >
                                            {sug.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Bills list */}
                        <div className="space-y-2">
                            {bills.map(bill => (
                                <div
                                    key={bill.id}
                                    className={cn(
                                        "p-3 rounded-lg border cursor-pointer transition-all",
                                        currentBillId === bill.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                                    )}
                                    onClick={() => setCurrentBillId(bill.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{bill.name}</span>
                                            {bill.amount > 0 && (
                                                <span className="text-xs text-muted-foreground">
                                                    {formatCurrency(bill.amount)}
                                                </span>
                                            )}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={(e) => { e.stopPropagation(); handleRemoveBill(bill.id); }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {currentBillId === bill.id && (
                                        <div className="mt-3 pt-3 border-t space-y-3">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <Label className="text-xs">Valor:</Label>
                                                    <Input
                                                        type="number"
                                                        placeholder="0,00"
                                                        value={bill.amount || ''}
                                                        onChange={(e) => updateBill(bill.id, { amount: parseFloat(e.target.value) || 0 })}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Vencimento:</Label>
                                                    <Input
                                                        type="date"
                                                        value={bill.dueDate}
                                                        onChange={(e) => updateBill(bill.id, { dueDate: e.target.value })}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Add custom */}
                        <div className="flex gap-2 mt-4">
                            <Input
                                placeholder="Adicionar outra conta..."
                                value={newBillName}
                                onChange={(e) => setNewBillName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomBill()}
                            />
                            <Button variant="outline" onClick={handleAddCustomBill} disabled={!newBillName.trim()}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-between gap-4">
                        <Button variant="outline" onClick={() => setStep(1)}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                        </Button>
                        <Button onClick={() => setStep(3)} disabled={!canProceedStep2}>
                            Proximo <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 3: Classify Bills */}
            {step === 3 && (
                <div className="space-y-4">
                    <div className="glass-card p-4">
                        <h3 className="font-bold text-lg mb-2">Passo 3: Classifique cada conta</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Marque o impacto e a consequencia de nao pagar
                        </p>

                        <div className="space-y-3">
                            {bills.map(bill => (
                                <Card
                                    key={bill.id}
                                    className={cn(
                                        "overflow-hidden cursor-pointer transition-all",
                                        currentBillId === bill.id ? "border-2 border-primary" : "",
                                        bill.impact && bill.consequence && bill.amount > 0 ? "border-green-500/50" : ""
                                    )}
                                    onClick={() => setCurrentBillId(bill.id)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium">{bill.name}</span>
                                            <span className="text-sm">{formatCurrency(bill.amount)}</span>
                                        </div>

                                        {currentBillId === bill.id && (
                                            <div className="space-y-4 pt-2 border-t">
                                                {/* Impact */}
                                                <div>
                                                    <Label className="text-xs mb-2 block">O que essa conta protege?</Label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {IMPACT_OPTIONS.map(opt => {
                                                            const Icon = opt.icon;
                                                            return (
                                                                <button
                                                                    key={opt.value}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        updateBill(bill.id, { impact: opt.value });
                                                                    }}
                                                                    className={cn(
                                                                        "px-3 py-1.5 rounded-full text-xs transition-colors flex items-center gap-1",
                                                                        bill.impact === opt.value
                                                                            ? opt.color === 'red' ? "bg-red-500 text-white"
                                                                                : opt.color === 'orange' ? "bg-orange-500 text-white"
                                                                                    : opt.color === 'yellow' ? "bg-yellow-500 text-black"
                                                                                        : opt.color === 'blue' ? "bg-blue-500 text-white"
                                                                                            : "bg-gray-500 text-white"
                                                                            : "bg-muted hover:bg-muted/80"
                                                                    )}
                                                                >
                                                                    <Icon className="h-3 w-3" /> {opt.label}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Consequence */}
                                                <div>
                                                    <Label className="text-xs mb-2 block">Consequencia de nao pagar?</Label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {CONSEQUENCE_OPTIONS.map(opt => {
                                                            const Icon = opt.icon;
                                                            return (
                                                                <button
                                                                    key={opt.value}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        updateBill(bill.id, { consequence: opt.value });
                                                                    }}
                                                                    className={cn(
                                                                        "px-3 py-1.5 rounded-full text-xs transition-colors flex items-center gap-1",
                                                                        bill.consequence === opt.value
                                                                            ? "bg-primary text-primary-foreground"
                                                                            : "bg-muted hover:bg-muted/80"
                                                                    )}
                                                                >
                                                                    <Icon className="h-3 w-3" /> {opt.label}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {currentBillId !== bill.id && bill.impact && bill.consequence && (
                                            <p className="text-xs text-muted-foreground">
                                                {IMPACT_OPTIONS.find(i => i.value === bill.impact)?.label} • {CONSEQUENCE_OPTIONS.find(c => c.value === bill.consequence)?.label}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between gap-4">
                        <Button variant="outline" onClick={() => setStep(2)}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                        </Button>
                        <Button onClick={() => setStep(4)} disabled={!canProceedStep3}>
                            Ver Fila <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 4: Priority Queue */}
            {step === 4 && (
                <div className="space-y-4">
                    <div className="glass-card p-4">
                        <h3 className="font-bold text-lg mb-2">Passo 4: Fila de Prioridade</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Contas ordenadas por urgencia. Defina o que fazer com cada uma.
                        </p>

                        <div className="space-y-2">
                            {sortedBills.map((bill, index) => (
                                <div
                                    key={bill.id}
                                    className={cn(
                                        "p-3 rounded-lg border transition-all",
                                        bill.priority <= 3 ? "border-red-500/50 bg-red-500/5" :
                                            bill.priority <= 6 ? "border-orange-500/50 bg-orange-500/5" :
                                                "border-gray-500/30"
                                    )}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                                                {index + 1}
                                            </span>
                                            <span className="font-medium">{bill.name}</span>
                                        </div>
                                        <span className="font-bold">{formatCurrency(bill.amount)}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => updateBill(bill.id, { status: 'pay_now' })}
                                            className={cn(
                                                "flex-1 py-1.5 rounded text-xs transition-colors",
                                                bill.status === 'pay_now'
                                                    ? "bg-green-500 text-white"
                                                    : "bg-muted hover:bg-green-500/20"
                                            )}
                                        >
                                            Pagar
                                        </button>
                                        <button
                                            onClick={() => updateBill(bill.id, { status: 'negotiate' })}
                                            className={cn(
                                                "flex-1 py-1.5 rounded text-xs transition-colors",
                                                bill.status === 'negotiate'
                                                    ? "bg-yellow-500 text-black"
                                                    : "bg-muted hover:bg-yellow-500/20"
                                            )}
                                        >
                                            Negociar
                                        </button>
                                        <button
                                            onClick={() => updateBill(bill.id, { status: 'pause' })}
                                            className={cn(
                                                "flex-1 py-1.5 rounded text-xs transition-colors",
                                                bill.status === 'pause'
                                                    ? "bg-red-500 text-white"
                                                    : "bg-muted hover:bg-red-500/20"
                                            )}
                                        >
                                            Pausar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                <p className="text-xs text-muted-foreground">Essencial</p>
                                <p className="text-lg font-bold text-red-500">{formatCurrency(stats.essential)}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                <p className="text-xs text-muted-foreground">Importante</p>
                                <p className="text-lg font-bold text-orange-500">{formatCurrency(stats.important)}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-gray-500/10 border border-gray-500/20">
                                <p className="text-xs text-muted-foreground">Pode esperar</p>
                                <p className="text-lg font-bold">{formatCurrency(stats.canWait)}</p>
                            </div>
                            <div className={cn(
                                "p-3 rounded-lg border",
                                stats.gap > 0 ? "bg-red-500/20 border-red-500" : "bg-green-500/10 border-green-500/20"
                            )}>
                                <p className="text-xs text-muted-foreground">Gap</p>
                                <p className={cn("text-lg font-bold", stats.gap > 0 ? "text-red-500" : "text-green-500")}>
                                    {stats.gap > 0 ? `-${formatCurrency(stats.gap)}` : formatCurrency(Math.abs(stats.gap))}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between gap-4">
                        <Button variant="outline" onClick={() => setStep(3)}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                        </Button>
                        <Button onClick={() => setStep(stats.gap > 0 ? 5 : 6)}>
                            {stats.gap > 0 ? 'Resolver Gap' : 'Definir Acoes'} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 5: Plan A/B/C */}
            {step === 5 && stats.gap > 0 && (
                <div className="space-y-4">
                    <div className="glass-card p-4">
                        <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            <p className="text-sm">Falta <strong className="text-red-500">{formatCurrency(stats.gap)}</strong> para pagar tudo</p>
                        </div>

                        <h3 className="font-bold text-lg mb-2">Passo 5: Escolha a estrategia</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Nao da pra pagar tudo. Qual plano voce vai usar?
                        </p>

                        <div className="space-y-3">
                            {/* Plan A */}
                            <Card
                                className={cn(
                                    "cursor-pointer transition-all",
                                    selectedPlan === 'A' ? "border-2 border-green-500 bg-green-500/5" : "hover:bg-muted/50"
                                )}
                                onClick={() => setSelectedPlan('A')}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">A</span>
                                        <span className="font-medium">Reduz risco rapido (recomendado)</span>
                                    </div>
                                    <ul className="text-sm text-muted-foreground ml-10 list-disc">
                                        <li>Negociar 1-3 contas antes do vencimento</li>
                                        <li>Agendar pagamentos do essencial</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Plan B */}
                            <Card
                                className={cn(
                                    "cursor-pointer transition-all",
                                    selectedPlan === 'B' ? "border-2 border-yellow-500 bg-yellow-500/5" : "hover:bg-muted/50"
                                )}
                                onClick={() => setSelectedPlan('B')}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-8 h-8 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold">B</span>
                                        <span className="font-medium">Adiamento consciente</span>
                                    </div>
                                    <ul className="text-sm text-muted-foreground ml-10 list-disc">
                                        <li>Escolher o que atrasar com criterio</li>
                                        <li>Definir data de acao futura</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Plan C */}
                            <Card
                                className={cn(
                                    "cursor-pointer transition-all",
                                    selectedPlan === 'C' ? "border-2 border-red-500 bg-red-500/5" : "hover:bg-muted/50"
                                )}
                                onClick={() => setSelectedPlan('C')}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">C</span>
                                        <span className="font-medium">Emergencia real</span>
                                    </div>
                                    <ul className="text-sm text-muted-foreground ml-10 list-disc">
                                        <li>Usar cartao emergencial (Dia 5)</li>
                                        <li>Somente saude/moradia/renda</li>
                                    </ul>

                                    {selectedPlan === 'C' && (
                                        <div className="mt-3 ml-10">
                                            <Label className="text-xs">Qual risco voce esta evitando?</Label>
                                            <Textarea
                                                placeholder="Justifique o uso do cartao emergencial..."
                                                value={emergencyReason}
                                                onChange={(e) => setEmergencyReason(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                rows={2}
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex justify-between gap-4">
                        <Button variant="outline" onClick={() => setStep(4)}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                        </Button>
                        <Button onClick={() => setStep(6)} disabled={!canProceedStep5}>
                            Definir Acoes <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 6: Actions */}
            {step === 6 && (
                <div className="space-y-4">
                    <div className="glass-card p-4">
                        <h3 className="font-bold text-lg mb-2">Passo 6: 3 Acoes para HOJE</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Defina 1 acao de cada tipo para executar hoje
                        </p>

                        <div className="space-y-4">
                            {/* Protection Action */}
                            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="h-5 w-5 text-green-500" />
                                    <span className="font-medium">Acao de Protecao</span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">
                                    Agendar pagamento essencial
                                </p>
                                <Input
                                    placeholder="Ex: Agendar pagamento do aluguel para dia 15"
                                    value={actions[0].description}
                                    onChange={(e) => updateAction('1', e.target.value)}
                                />
                            </div>

                            {/* Risk Reduction */}
                            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                                <div className="flex items-center gap-2 mb-2">
                                    <MessageSquare className="h-5 w-5 text-yellow-500" />
                                    <span className="font-medium">Reducao de Risco</span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">
                                    Negociar/adiar antes de vencer
                                </p>
                                <Input
                                    placeholder="Ex: Ligar para operadora e pedir extensao"
                                    value={actions[1].description}
                                    onChange={(e) => updateAction('2', e.target.value)}
                                />
                            </div>

                            {/* Cut */}
                            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                                <div className="flex items-center gap-2 mb-2">
                                    <Trash2 className="h-5 w-5 text-red-500" />
                                    <span className="font-medium">Corte</span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">
                                    Pausar/cancelar algo nao essencial
                                </p>
                                <Input
                                    placeholder="Ex: Cancelar assinatura da Netflix"
                                    value={actions[2].description}
                                    onChange={(e) => updateAction('3', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="mt-6 p-4 rounded-lg bg-muted/50">
                            <h4 className="font-medium mb-3">Resumo do Dia 8:</h4>
                            <div className="space-y-2 text-sm">
                                <p><strong>Janela:</strong> ate {nextPayDate} com {formatCurrency(availableMoney)}</p>
                                <p><strong>Total contas:</strong> {formatCurrency(stats.total)}</p>
                                {stats.gap > 0 && <p><strong>Gap:</strong> {formatCurrency(stats.gap)} (Plano {selectedPlan})</p>}
                                <p><strong>Pagar agora:</strong> {formatCurrency(stats.payNow)}</p>
                                <p><strong>Negociar:</strong> {formatCurrency(stats.negotiate)}</p>
                                <p><strong>Pausar:</strong> {formatCurrency(stats.pause)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between gap-4">
                        <Button variant="outline" onClick={() => setStep(stats.gap > 0 ? 5 : 4)}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                        </Button>
                        <Button
                            onClick={handleComplete}
                            disabled={!canComplete}
                            className="flex-1 btn-fire"
                        >
                            <Check className="mr-2 h-4 w-4" /> Concluir Dia 8
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Day8PaymentQueue;
