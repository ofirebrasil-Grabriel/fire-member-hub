import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import {
    Check, ArrowRight, ArrowLeft, Brain, ShoppingCart,
    ChevronDown, ChevronUp, Plus, Trash2, Receipt
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Day3TransactionTable from '@/components/day/Day3TransactionTable';

interface Day3TriggerAnalysisProps {
    onComplete: (formData: Record<string, unknown>) => void;
    defaultValues?: Record<string, unknown>;
}

interface SpendingAnalysis {
    id: string;
    name: string;
    context: string;
    emotionTrigger: string;
    postPurchaseFeeling: string;
    externalInfluences: string[];
    couldAvoid: boolean;
    avoidanceStrategy: string;
    expanded: boolean;
}

interface LargePurchase {
    description: string;
    reason: string;
    feelingBefore: string;
    feelingAfter: string;
    feelingToday: string;
}

// Common spending categories that people often overspend on
const SPENDING_CATEGORIES = [
    { id: '1', name: '🍔 Delivery / Comida fora', emoji: '🍔' },
    { id: '2', name: '👕 Roupas e acessórios', emoji: '👕' },
    { id: '3', name: '🛒 Compras online (Shopee, Amazon, etc)', emoji: '🛒' },
    { id: '4', name: '☕ Cafés e lanches', emoji: '☕' },
    { id: '5', name: '🚗 Uber / 99 / Transporte', emoji: '🚗' },
    { id: '6', name: '🎮 Games e entretenimento', emoji: '🎮' },
    { id: '7', name: '💅 Beleza e estética', emoji: '💅' },
    { id: '8', name: '🍺 Bares e baladas', emoji: '🍺' },
    { id: '9', name: '📱 Apps e assinaturas', emoji: '📱' },
    { id: '10', name: '🎁 Presentes', emoji: '🎁' },
];

const CONTEXTS = [
    { value: 'after_work', label: 'Após o trabalho (cansado)' },
    { value: 'weekend', label: 'Fim de semana' },
    { value: 'family_outing', label: 'Passeando com família' },
    { value: 'alone_home', label: 'Sozinho em casa' },
    { value: 'online_browsing', label: 'Navegando na internet' },
    { value: 'celebration', label: 'Comemoração' },
    { value: 'lunch_break', label: 'Horário de almoço' },
    { value: 'impulse', label: 'Impulso do momento' },
    { value: 'other', label: 'Outro' },
];

const EMOTIONS = [
    { value: 'stress', label: '😫 Estresse' },
    { value: 'anxiety', label: '😰 Ansiedade' },
    { value: 'boredom', label: '😑 Tédio' },
    { value: 'sadness', label: '😢 Tristeza' },
    { value: 'happiness', label: '😊 Felicidade' },
    { value: 'reward', label: '🏆 Merecimento' },
    { value: 'fomo', label: '😱 Medo de perder' },
    { value: 'comfort', label: '🛋️ Busca de conforto' },
    { value: 'neutral', label: '😐 Neutro/Racional' },
];

const POST_FEELINGS = [
    { value: 'satisfied', label: '😊 Satisfeito(a)' },
    { value: 'regret', label: '😔 Arrependido(a)' },
    { value: 'indifferent', label: '😐 Indiferente' },
    { value: 'guilty', label: '😣 Culpado(a)' },
    { value: 'relieved', label: '😌 Aliviado(a)' },
];

const INFLUENCES = [
    { value: 'friends', label: 'Amigos' },
    { value: 'family', label: 'Familiares' },
    { value: 'coworkers', label: 'Colegas de trabalho' },
    { value: 'social_media', label: 'Redes sociais' },
    { value: 'marketing', label: 'Marketing/Publicidade' },
    { value: 'influencers', label: 'Influenciadores' },
    { value: 'shopping_mall', label: 'Ambiente de shopping' },
    { value: 'sales', label: 'Promoções/Descontos' },
];

const FEELINGS_PURCHASE = [
    { value: 'excited', label: 'Empolgado(a)' },
    { value: 'anxious', label: 'Ansioso(a)' },
    { value: 'impulsive', label: 'Impulsivo(a)' },
    { value: 'planned', label: 'Planejado(a)' },
    { value: 'pressured', label: 'Pressionado(a)' },
    { value: 'happy', label: 'Feliz' },
    { value: 'regretful', label: 'Arrependido(a)' },
    { value: 'satisfied', label: 'Satisfeito(a)' },
    { value: 'indifferent', label: 'Indiferente' },
];

const Day3TriggerAnalysis: React.FC<Day3TriggerAnalysisProps> = ({ onComplete }) => {
    const [currentSection, setCurrentSection] = useState<'transactions' | 'expenses' | 'large'>('transactions');
    const [transactionSummary, setTransactionSummary] = useState<Record<string, unknown>>({});
    const [analyses, setAnalyses] = useState<SpendingAnalysis[]>(
        SPENDING_CATEGORIES.map(cat => ({
            id: cat.id,
            name: cat.name,
            context: '',
            emotionTrigger: '',
            postPurchaseFeeling: '',
            externalInfluences: [],
            couldAvoid: false,
            avoidanceStrategy: '',
            expanded: false,
        }))
    );
    const [customCategory, setCustomCategory] = useState('');
    const [largePurchases, setLargePurchases] = useState<LargePurchase[]>([
        { description: '', reason: '', feelingBefore: '', feelingAfter: '', feelingToday: '' },
        { description: '', reason: '', feelingBefore: '', feelingAfter: '', feelingToday: '' },
        { description: '', reason: '', feelingBefore: '', feelingAfter: '', feelingToday: '' },
    ]);

    // Toggle expense expansion
    const toggleExpanded = (id: string) => {
        setAnalyses(prev => prev.map(a =>
            a.id === id ? { ...a, expanded: !a.expanded } : a
        ));
    };

    // Update analysis field
    const updateAnalysis = (id: string, field: keyof SpendingAnalysis, value: unknown) => {
        setAnalyses(prev => prev.map(a =>
            a.id === id ? { ...a, [field]: value } : a
        ));
    };

    // Toggle influence
    const toggleInfluence = (id: string, influence: string) => {
        setAnalyses(prev => prev.map(a => {
            if (a.id !== id) return a;
            const influences = a.externalInfluences.includes(influence)
                ? a.externalInfluences.filter(i => i !== influence)
                : [...a.externalInfluences, influence];
            return { ...a, externalInfluences: influences };
        }));
    };

    // Add custom category
    const handleAddCustomCategory = () => {
        if (!customCategory.trim()) return;
        const newId = `custom-${Date.now()}`;
        setAnalyses(prev => [...prev, {
            id: newId,
            name: customCategory.trim(),
            context: '',
            emotionTrigger: '',
            postPurchaseFeeling: '',
            externalInfluences: [],
            couldAvoid: false,
            avoidanceStrategy: '',
            expanded: true,
        }]);
        setCustomCategory('');
    };

    // Remove category
    const handleRemoveCategory = (id: string) => {
        setAnalyses(prev => prev.filter(a => a.id !== id));
    };

    // Update large purchase
    const updateLargePurchase = (index: number, field: keyof LargePurchase, value: string) => {
        setLargePurchases(prev => prev.map((p, i) =>
            i === index ? { ...p, [field]: value } : p
        ));
    };

    // Calculate stats
    const stats = useMemo(() => {
        const analyzed = analyses.filter(a => a.emotionTrigger && a.postPurchaseFeeling);
        const avoidable = analyses.filter(a => a.couldAvoid);

        // Find most common trigger
        const triggerCounts: Record<string, number> = {};
        analyzed.forEach(a => {
            if (a.emotionTrigger) {
                triggerCounts[a.emotionTrigger] = (triggerCounts[a.emotionTrigger] || 0) + 1;
            }
        });
        const mainTrigger = Object.entries(triggerCounts)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || '';

        // Find most common influence
        const influenceCounts: Record<string, number> = {};
        analyzed.forEach(a => {
            a.externalInfluences.forEach(inf => {
                influenceCounts[inf] = (influenceCounts[inf] || 0) + 1;
            });
        });
        const mainInfluence = Object.entries(influenceCounts)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || '';

        return {
            analyzed: analyzed.length,
            avoidable: avoidable.length,
            mainTrigger,
            mainInfluence,
            largePurchasesCount: largePurchases.filter(p => p.description).length,
        };
    }, [analyses, largePurchases]);

    // Check if can complete
    const canComplete = stats.analyzed >= 3;

    // Handle complete
    const handleComplete = () => {
        onComplete({
            triggersAnalyzed: stats.analyzed,
            avoidableCount: stats.avoidable,
            mainTrigger: stats.mainTrigger,
            mainInfluence: stats.mainInfluence,
            largePurchasesCount: stats.largePurchasesCount,
            analyses: analyses.filter(a => a.emotionTrigger),
            largePurchases: largePurchases.filter(p => p.description),
            transactionSummary,
        });
    };

    return (
        <div className="space-y-6">
            {/* Section Tabs */}
            <div className="flex gap-2">
                <Button
                    variant={currentSection === 'transactions' ? 'default' : 'outline'}
                    onClick={() => setCurrentSection('transactions')}
                    className="flex-1"
                >
                    <Receipt className="mr-2 h-4 w-4" />
                    Transacoes
                </Button>
                <Button
                    variant={currentSection === 'expenses' ? 'default' : 'outline'}
                    onClick={() => setCurrentSection('expenses')}
                    className="flex-1"
                >
                    <Brain className="mr-2 h-4 w-4" />
                    Raio X dos Gastos
                </Button>
                <Button
                    variant={currentSection === 'large' ? 'default' : 'outline'}
                    onClick={() => setCurrentSection('large')}
                    className="flex-1"
                >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Compras +R$1000
                </Button>
            </div>

            {currentSection === 'transactions' && (
                <div className="space-y-4">
                    <div className="glass-card p-4">
                        <h3 className="font-bold text-lg mb-2">📒 Mapeie seus gastos</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Adicione transacoes dos ultimos 90 dias para identificar gastos sombra.
                        </p>
                        <Day3TransactionTable
                            onComplete={(values) => setTransactionSummary(values)}
                            submitLabel="Salvar transacoes"
                        />
                    </div>
                </div>
            )}

            {/* Section 1: Expense Categories Analysis */}
            {currentSection === 'expenses' && (
                <div className="space-y-4">
                    <div className="glass-card p-4">
                        <h3 className="font-bold text-lg mb-2">🔍 Raio X dos Gatilhos</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Analise as categorias de gastos que mais afetam seu orçamento.
                            Selecione pelo menos 3 e responda as perguntas.
                        </p>

                        <div className="space-y-3">
                            {analyses.map((analysis) => (
                                <Card key={analysis.id} className="overflow-hidden">
                                    {/* Header - always visible */}
                                    <div
                                        onClick={() => toggleExpanded(analysis.id)}
                                        className={cn(
                                            "flex items-center justify-between p-4 cursor-pointer transition-colors",
                                            analysis.expanded ? "bg-primary/5" : "hover:bg-muted/50",
                                            analysis.emotionTrigger && "border-l-4 border-l-primary"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            {analysis.emotionTrigger && (
                                                <Check className="h-4 w-4 text-green-500" />
                                            )}
                                            <p className="font-medium">{analysis.name}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {analysis.id.startsWith('custom-') && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveCategory(analysis.id);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            )}
                                            {analysis.expanded ? (
                                                <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Expanded content */}
                                    {analysis.expanded && (
                                        <CardContent className="p-4 pt-0 space-y-4 bg-muted/20">
                                            {/* Context */}
                                            <div>
                                                <Label className="text-xs">Momento/Contexto mais comum</Label>
                                                <Select
                                                    value={analysis.context}
                                                    onValueChange={(v) => updateAnalysis(analysis.id, 'context', v)}
                                                >
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue placeholder="Quando você costuma gastar com isso?" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {CONTEXTS.map(c => (
                                                            <SelectItem key={c.value} value={c.value}>
                                                                {c.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Emotion Trigger */}
                                            <div>
                                                <Label className="text-xs">Emoção Gatilho (antes da compra)</Label>
                                                <Select
                                                    value={analysis.emotionTrigger}
                                                    onValueChange={(v) => updateAnalysis(analysis.id, 'emotionTrigger', v)}
                                                >
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue placeholder="O que você geralmente está sentindo?" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {EMOTIONS.map(e => (
                                                            <SelectItem key={e.value} value={e.value}>
                                                                {e.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Post-purchase feeling */}
                                            <div>
                                                <Label className="text-xs">Sensação Pós-Compra</Label>
                                                <Select
                                                    value={analysis.postPurchaseFeeling}
                                                    onValueChange={(v) => updateAnalysis(analysis.id, 'postPurchaseFeeling', v)}
                                                >
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue placeholder="Como se sente depois?" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {POST_FEELINGS.map(f => (
                                                            <SelectItem key={f.value} value={f.value}>
                                                                {f.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* External Influences */}
                                            <div>
                                                <Label className="text-xs mb-2 block">Influências Externas</Label>
                                                <div className="flex flex-wrap gap-2">
                                                    {INFLUENCES.map(inf => (
                                                        <button
                                                            key={inf.value}
                                                            onClick={() => toggleInfluence(analysis.id, inf.value)}
                                                            className={cn(
                                                                "px-3 py-1 rounded-full text-xs transition-colors",
                                                                analysis.externalInfluences.includes(inf.value)
                                                                    ? "bg-primary text-primary-foreground"
                                                                    : "bg-muted hover:bg-muted/80"
                                                            )}
                                                        >
                                                            {inf.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Could Avoid */}
                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                                <Checkbox
                                                    id={`avoid-${analysis.id}`}
                                                    checked={analysis.couldAvoid}
                                                    onCheckedChange={(checked) =>
                                                        updateAnalysis(analysis.id, 'couldAvoid', checked)
                                                    }
                                                />
                                                <Label htmlFor={`avoid-${analysis.id}`} className="cursor-pointer text-sm">
                                                    Eu poderia evitar ou reduzir esse tipo de gasto
                                                </Label>
                                            </div>

                                            {/* Avoidance Strategy */}
                                            {analysis.couldAvoid && (
                                                <div>
                                                    <Label className="text-xs">O que faria para evitar/reduzir?</Label>
                                                    <Textarea
                                                        className="mt-1"
                                                        placeholder="Ex: Cozinhar mais em casa, esperar 24h antes de comprar..."
                                                        value={analysis.avoidanceStrategy}
                                                        onChange={(e) =>
                                                            updateAnalysis(analysis.id, 'avoidanceStrategy', e.target.value)
                                                        }
                                                        rows={2}
                                                    />
                                                </div>
                                            )}
                                        </CardContent>
                                    )}
                                </Card>
                            ))}

                            {/* Add custom category */}
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Adicionar outra categoria..."
                                    value={customCategory}
                                    onChange={(e) => setCustomCategory(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomCategory()}
                                />
                                <Button
                                    variant="outline"
                                    onClick={handleAddCustomCategory}
                                    disabled={!customCategory.trim()}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                            <p className="text-xs text-muted-foreground">Analisados</p>
                            <p className="text-2xl font-bold text-primary">{stats.analyzed}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center">
                            <p className="text-xs text-muted-foreground">Evitáveis</p>
                            <p className="text-2xl font-bold text-orange-500">{stats.avoidable}</p>
                        </div>
                    </div>

                    {stats.analyzed < 3 && (
                        <p className="text-sm text-center text-muted-foreground">
                            Analise pelo menos 3 categorias para continuar
                        </p>
                    )}
                </div>
            )}

            {/* Section 2: Large Purchases */}
            {currentSection === 'large' && (
                <div className="space-y-4">
                    <div className="glass-card p-4">
                        <h3 className="font-bold text-lg mb-2">💳 Compras +R$1000 Parceladas</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Reflita sobre suas 3 últimas compras grandes parceladas.
                        </p>

                        {largePurchases.map((purchase, index) => (
                            <Card key={index} className="mb-4 overflow-hidden">
                                <div className="bg-muted/50 p-3 border-b">
                                    <p className="font-medium">Compra {index + 1}</p>
                                </div>
                                <CardContent className="p-4 space-y-4">
                                    <div>
                                        <Label className="text-xs">O que é?</Label>
                                        <Input
                                            placeholder="Ex: iPhone, TV, Móveis..."
                                            value={purchase.description}
                                            onChange={(e) => updateLargePurchase(index, 'description', e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-xs">Por que você comprou?</Label>
                                        <Textarea
                                            placeholder="O que te motivou a fazer essa compra?"
                                            value={purchase.reason}
                                            onChange={(e) => updateLargePurchase(index, 'reason', e.target.value)}
                                            className="mt-1"
                                            rows={2}
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <Label className="text-xs">Antes da compra</Label>
                                            <Select
                                                value={purchase.feelingBefore}
                                                onValueChange={(v) => updateLargePurchase(index, 'feelingBefore', v)}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Sentimento" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {FEELINGS_PURCHASE.map(f => (
                                                        <SelectItem key={f.value} value={f.value}>
                                                            {f.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label className="text-xs">Depois da compra</Label>
                                            <Select
                                                value={purchase.feelingAfter}
                                                onValueChange={(v) => updateLargePurchase(index, 'feelingAfter', v)}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Sentimento" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {FEELINGS_PURCHASE.map(f => (
                                                        <SelectItem key={f.value} value={f.value}>
                                                            {f.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label className="text-xs">Hoje</Label>
                                            <Select
                                                value={purchase.feelingToday}
                                                onValueChange={(v) => updateLargePurchase(index, 'feelingToday', v)}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Sentimento" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {FEELINGS_PURCHASE.map(f => (
                                                        <SelectItem key={f.value} value={f.value}>
                                                            {f.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between gap-4">
                {currentSection === 'transactions' && (
                    <>
                        <div />
                        <Button onClick={() => setCurrentSection('expenses')}>
                            Proximo <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </>
                )}

                {currentSection === 'expenses' && (
                    <>
                        <div />
                        <Button
                            onClick={() => setCurrentSection('large')}
                            disabled={stats.analyzed < 3}
                        >
                            Proximo <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </>
                )}

                {currentSection === 'large' && (
                    <>
                        <Button variant="outline" onClick={() => setCurrentSection('expenses')}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                        </Button>
                        <Button
                            onClick={handleComplete}
                            disabled={!canComplete}
                            className="flex-1 btn-fire"
                        >
                            <Check className="mr-2 h-4 w-4" /> Concluir Dia 3
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Day3TriggerAnalysis;
