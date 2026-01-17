import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
    Check, ArrowRight, ArrowLeft, Scissors,
    RefreshCw, TrendingDown, Pause, Gift, Target, DollarSign, Plus, Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Day6QuickCutsProps {
    onComplete: (formData: Record<string, unknown>) => void;
    defaultValues?: Record<string, unknown>;
}

interface CutItem {
    id: string;
    category: string;
    categoryLabel: string;
    actionType: string;
    actionLabel: string;
    specificCut: string;
    clearLimit: string;
    limitValue: number;
}

const LEAK_CATEGORIES = [
    { value: 'food_delivery', label: 'Comida fora / Delivery', icon: '🍔', examples: 'iFood, Rappi, restaurantes' },
    { value: 'market_impulse', label: 'Mercado "sem lista"', icon: '🛒', examples: 'Besteiras, beliscar, itens nao planejados' },
    { value: 'transport', label: 'Transporte', icon: '🚗', examples: 'Uber por impulso, estacionamento' },
    { value: 'subscriptions', label: 'Assinaturas / Apps', icon: '📱', examples: 'Streaming, apps, mensalidades' },
    { value: 'small_purchases', label: 'Comprinhas pequenas', icon: '🛍️', examples: 'Itens de desejo, besteirinhas' },
];

const ACTION_TYPES = [
    { value: 'swap', label: 'Troca', icon: RefreshCw, color: 'blue', description: 'Trocar por algo mais barato' },
    { value: 'reduce', label: 'Reducao', icon: TrendingDown, color: 'orange', description: 'Diminuir quantidade/frequencia' },
    { value: 'pause', label: 'Pausa', icon: Pause, color: 'red', description: 'Cortar por 7 dias' },
];

const CUT_EXAMPLES: Record<string, { action: string; text: string }[]> = {
    food_delivery: [
        { action: 'swap', text: 'Trocar delivery por comida simples em casa' },
        { action: 'reduce', text: 'Delivery 1x por semana em vez de 3-4x' },
        { action: 'pause', text: 'Zero delivery por 7 dias' },
    ],
    market_impulse: [
        { action: 'swap', text: 'Trocar doces por frutas' },
        { action: 'reduce', text: 'Limite de R$50 em besteiras por semana' },
        { action: 'pause', text: 'So comprar o que esta na lista por 7 dias' },
    ],
    transport: [
        { action: 'swap', text: 'Uber por onibus/metro 2x na semana' },
        { action: 'reduce', text: 'Maximo 3 corridas por semana' },
        { action: 'pause', text: 'Pausar corridas a menos de 2km' },
    ],
    subscriptions: [
        { action: 'swap', text: 'Trocar streaming premium por basico' },
        { action: 'reduce', text: 'Cancelar 1-2 assinaturas menos usadas' },
        { action: 'pause', text: 'Pausar TODAS as assinaturas nao essenciais' },
    ],
    small_purchases: [
        { action: 'swap', text: 'Antes de comprar, anotar no "caderno do depois"' },
        { action: 'reduce', text: 'Limite de R$100/semana para desejos' },
        { action: 'pause', text: 'Zero compras de desejo por 7 dias' },
    ],
};

const EMOTIONAL_REWARDS = [
    'Menos sufoco',
    'Mais previsibilidade',
    'Menos culpa',
    'Mais controle',
    'Menos ansiedade financeira',
    'Mais tranquilidade',
];

const Day6QuickCuts: React.FC<Day6QuickCutsProps> = ({ onComplete }) => {
    const [step, setStep] = useState<1 | 2>(1);

    // Step 1: Cuts list
    const [cuts, setCuts] = useState<CutItem[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');

    // Current item being edited
    const [currentCutId, setCurrentCutId] = useState<string | null>(null);

    // Step 2: Rewards
    const [selectedEmotionalRewards, setSelectedEmotionalRewards] = useState<string[]>([]);
    const [bigGoal, setBigGoal] = useState('');

    // Get current cut being edited
    const currentCut = cuts.find(c => c.id === currentCutId);

    // Add category from suggestions
    const handleAddCategory = (category: typeof LEAK_CATEGORIES[0]) => {
        if (cuts.some(c => c.category === category.value)) return;

        const newCut: CutItem = {
            id: `cut-${Date.now()}`,
            category: category.value,
            categoryLabel: category.label,
            actionType: '',
            actionLabel: '',
            specificCut: '',
            clearLimit: '',
            limitValue: 0,
        };
        setCuts(prev => [...prev, newCut]);
        setCurrentCutId(newCut.id);
    };

    // Add custom category
    const handleAddCustomCategory = () => {
        if (!newCategoryName.trim()) return;

        const newCut: CutItem = {
            id: `cut-${Date.now()}`,
            category: 'custom',
            categoryLabel: newCategoryName.trim(),
            actionType: '',
            actionLabel: '',
            specificCut: '',
            clearLimit: '',
            limitValue: 0,
        };
        setCuts(prev => [...prev, newCut]);
        setCurrentCutId(newCut.id);
        setNewCategoryName('');
    };

    // Remove cut
    const handleRemoveCut = (id: string) => {
        setCuts(prev => prev.filter(c => c.id !== id));
        if (currentCutId === id) {
            setCurrentCutId(null);
        }
    };

    // Update cut
    const updateCut = (id: string, updates: Partial<CutItem>) => {
        setCuts(prev => prev.map(c =>
            c.id === id ? { ...c, ...updates } : c
        ));
    };

    // Set action type for current cut
    const handleSetAction = (action: typeof ACTION_TYPES[0]) => {
        if (currentCutId) {
            updateCut(currentCutId, {
                actionType: action.value,
                actionLabel: action.label,
            });
        }
    };

    // Toggle emotional reward
    const toggleReward = (reward: string) => {
        setSelectedEmotionalRewards(prev =>
            prev.includes(reward)
                ? prev.filter(r => r !== reward)
                : [...prev, reward]
        );
    };

    // Get examples for current cut
    const getExamples = () => {
        if (!currentCut) return [];
        const categoryExamples = CUT_EXAMPLES[currentCut.category] || [];
        if (currentCut.actionType) {
            return categoryExamples.filter(e => e.action === currentCut.actionType);
        }
        return categoryExamples;
    };

    // Stats
    const stats = useMemo(() => {
        const completedCuts = cuts.filter(c => c.actionType && c.specificCut && c.clearLimit);
        const totalLimit = cuts.reduce((sum, c) => sum + (c.limitValue || 0), 0);

        return {
            cutsCount: cuts.length,
            completedCuts: completedCuts.length,
            totalLimit,
        };
    }, [cuts]);

    // Validation
    const canProceedStep1 = cuts.length >= 1 && cuts.every(c => c.actionType && c.specificCut && c.clearLimit);
    const canComplete = selectedEmotionalRewards.length > 0 || !!bigGoal;

    // Handle complete
    const handleComplete = () => {
        onComplete({
            cutsCount: stats.cutsCount,
            cuts: cuts.map(c => ({
                category: c.categoryLabel,
                actionType: c.actionLabel,
                specificCut: c.specificCut,
                clearLimit: c.clearLimit,
                limitValue: c.limitValue,
            })),
            totalLimit: stats.totalLimit,
            emotionalRewards: selectedEmotionalRewards,
            bigGoal,
        });
    };

    return (
        <div className="space-y-6">
            {/* Progress */}
            <div className="flex gap-1">
                {[1, 2].map(s => (
                    <div
                        key={s}
                        className={cn(
                            "h-1.5 flex-1 rounded-full transition-colors",
                            s <= step ? "bg-primary" : "bg-muted"
                        )}
                    />
                ))}
            </div>

            {/* Step 1: Cuts */}
            {step === 1 && (
                <div className="space-y-4">
                    <div className="glass-card p-4">
                        <h3 className="font-bold text-lg mb-2">Passo 1: Escolha os vazamentos</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Quais categorias de gasto mais te pegam este mes? Escolha 1 ou mais.
                        </p>

                        {/* Category Suggestions */}
                        <div className="mb-4">
                            <Label className="text-xs mb-2 block">Categorias sugeridas:</Label>
                            <div className="flex flex-wrap gap-2">
                                {LEAK_CATEGORIES.map(cat => {
                                    const isAdded = cuts.some(c => c.category === cat.value);
                                    return (
                                        <button
                                            key={cat.value}
                                            onClick={() => !isAdded && handleAddCategory(cat)}
                                            disabled={isAdded}
                                            className={cn(
                                                "px-3 py-1.5 rounded-full text-xs transition-colors flex items-center gap-1",
                                                isAdded
                                                    ? "bg-surface-hover text-primary line-through opacity-100"
                                                    : "glass-card  text-muted-foreground hover:bg-orange-500/20 border border-gray-200/30"
                                            )}
                                        >
                                            <span>{cat.icon}</span> {cat.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Added Cuts */}
                        <div className="space-y-3">
                            {cuts.map(cut => (
                                <Card
                                    key={cut.id}
                                    className={cn(
                                        "overflow-hidden cursor-pointer transition-all",
                                        currentCutId === cut.id
                                            ? "border-2 border-background-500 glass-card"
                                            : "hover:bg-muted/50",
                                        cut.actionType && cut.specificCut && cut.clearLimit
                                            ? "border-orange-500/50"
                                            : ""
                                    )}
                                    onClick={() => setCurrentCutId(cut.id)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <Scissors className="h-4 w-4 text-orange-500" />
                                                <span className="font-medium">{cut.categoryLabel}</span>
                                                {cut.actionType && cut.specificCut && cut.clearLimit && (
                                                    <Check className="h-4 w-4 text-green-500" />
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveCut(cut.id);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </div>

                                        {currentCutId === cut.id && (
                                            <div className="space-y-4 pt-2 border-t">
                                                {/* Action Type */}
                                                <div>
                                                    <Label className="text-xs mb-2 block">Tipo de acao:</Label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {ACTION_TYPES.map(action => {
                                                            const Icon = action.icon;
                                                            return (
                                                                <button
                                                                    key={action.value}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleSetAction(action);
                                                                    }}
                                                                    className={cn(
                                                                        "px-3 py-1.5 rounded-full text-xs transition-colors flex items-center gap-1",
                                                                        cut.actionType === action.value
                                                                            ? action.color === 'blue' ? "bg-blue-500 text-white"
                                                                                : action.color === 'orange' ? "bg-orange-500 text-white"
                                                                                    : "bg-red-500 text-white"
                                                                            : "bg-muted hover:bg-muted/80"
                                                                    )}
                                                                >
                                                                    <Icon className="h-3 w-3" /> {action.label}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Specific Cut */}
                                                <div>
                                                    <Label className="text-xs mb-1 block">Corte especifico:</Label>
                                                    {getExamples().length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mb-2">
                                                            {getExamples().map((ex, i) => (
                                                                <button
                                                                    key={i}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        updateCut(cut.id, { specificCut: ex.text });
                                                                    }}
                                                                    className={cn(
                                                                        "px-2 py-1 rounded text-xs",
                                                                        cut.specificCut === ex.text
                                                                            ? "bg-primary text-primary-foreground"
                                                                            : "bg-muted/50 hover:bg-muted"
                                                                    )}
                                                                >
                                                                    {ex.text}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <Textarea
                                                        placeholder="Descreva o corte..."
                                                        value={cut.specificCut}
                                                        onChange={(e) => updateCut(cut.id, { specificCut: e.target.value })}
                                                        onClick={(e) => e.stopPropagation()}
                                                        rows={2}
                                                    />
                                                </div>

                                                {/* Clear Limit */}
                                                <div>
                                                    <Label className="text-xs mb-1 block">Regra clara (7 dias):</Label>
                                                    <Textarea
                                                        placeholder='Ex: "Por 7 dias, delivery so 1x"'
                                                        value={cut.clearLimit}
                                                        onChange={(e) => updateCut(cut.id, { clearLimit: e.target.value })}
                                                        onClick={(e) => e.stopPropagation()}
                                                        rows={2}
                                                    />
                                                </div>

                                                {/* Limit Value */}
                                                <div>
                                                    <Label className="text-xs mb-1 block">Limite em R$ (opcional):</Label>
                                                    <div className="relative">
                                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            type="number"
                                                            placeholder="0,00"
                                                            value={cut.limitValue || ''}
                                                            onChange={(e) => updateCut(cut.id, { limitValue: parseFloat(e.target.value) || 0 })}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="pl-9"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {currentCutId !== cut.id && cut.actionType && (
                                            <p className="text-xs text-muted-foreground">
                                                {cut.actionLabel} - {cut.specificCut.substring(0, 50)}...
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}

                            {cuts.length === 0 && (
                                <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                                    <Scissors className="h-10 w-10 mx-auto mb-2 opacity-30" />
                                    <p>Clique nas categorias acima para adicionar cortes</p>
                                </div>
                            )}
                        </div>

                        {/* Add Custom */}
                        <div className="flex gap-2 mt-4">
                            <Input
                                placeholder="Adicionar outro vazamento..."
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomCategory()}
                            />
                            <Button
                                variant="outline"
                                onClick={handleAddCustomCategory}
                                disabled={!newCategoryName.trim()}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center">
                            <p className="text-xs text-muted-foreground">Cortes</p>
                            <p className="text-2xl font-bold text-orange-500">{stats.cutsCount}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                            <p className="text-xs text-muted-foreground">Completos</p>
                            <p className="text-2xl font-bold text-green-500">{stats.completedCuts}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                            <p className="text-xs text-muted-foreground">Limite total</p>
                            <p className="text-xl font-bold text-primary">R$ {stats.totalLimit.toFixed(0)}</p>
                        </div>
                    </div>

                    {cuts.length > 0 && stats.completedCuts < cuts.length && (
                        <p className="text-sm text-center text-muted-foreground">
                            Complete todos os cortes para continuar
                        </p>
                    )}

                    <div className="flex justify-end">
                        <Button
                            onClick={() => setStep(2)}
                            disabled={!canProceedStep1}
                        >
                            Proximo <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 2: Rewards */}
            {step === 2 && (
                <div className="space-y-4">
                    <div className="glass-card p-4">
                        <h3 className="font-bold text-lg mb-2">Passo 2: Marque os premios</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            O que esses cortes compram pra voce? Sem sentido, voce desiste.
                        </p>

                        <div className="space-y-4">
                            {/* Emotional rewards */}
                            <div>
                                <Label className="text-xs mb-2 block">
                                    <Gift className="h-3 w-3 inline mr-1" />
                                    Ganhos imediatos:
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                    {EMOTIONAL_REWARDS.map(reward => (
                                        <button
                                            key={reward}
                                            onClick={() => toggleReward(reward)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-full text-xs transition-colors",
                                                selectedEmotionalRewards.includes(reward)
                                                    ? "bg-green-500 text-white"
                                                    : "bg-muted hover:bg-muted/80"
                                            )}
                                        >
                                            {reward}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Big goal */}
                            <div>
                                <Label className="text-xs">
                                    <Target className="h-3 w-3 inline mr-1" />
                                    Objetivo grande que voce vai alcancar:
                                </Label>
                                <Input
                                    placeholder="Ex: Viagem dos sonhos, casa propria, carro..."
                                    value={bigGoal}
                                    onChange={(e) => setBigGoal(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="mt-6 p-4 rounded-lg bg-muted/50">
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                                <Scissors className="h-4 w-4" />
                                Resumo dos seus cortes ({cuts.length}):
                            </h4>
                            <div className="space-y-2 text-sm">
                                {cuts.map(cut => (
                                    <div key={cut.id} className="p-2 bg-background/50 rounded">
                                        <p><strong>{cut.categoryLabel}:</strong> {cut.actionLabel}</p>
                                        <p className="text-xs text-muted-foreground">{cut.clearLimit}</p>
                                    </div>
                                ))}
                                {selectedEmotionalRewards.length > 0 && (
                                    <p className="pt-2"><strong>Ganhos:</strong> {selectedEmotionalRewards.join(', ')}</p>
                                )}
                                {bigGoal && <p><strong>Objetivo:</strong> {bigGoal}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between gap-4">
                        <Button variant="outline" onClick={() => setStep(1)}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                        </Button>
                        <Button
                            onClick={handleComplete}
                            disabled={!canComplete}
                            className="flex-1 btn-fire"
                        >
                            <Check className="mr-2 h-4 w-4" /> Concluir Dia 6
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Day6QuickCuts;
