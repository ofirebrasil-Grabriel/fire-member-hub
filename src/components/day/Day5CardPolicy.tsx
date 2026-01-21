import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
    Check, ArrowRight, ArrowLeft, CreditCard, Lock, Unlock,
    Plus, Trash2, DollarSign, Star, AlertTriangle
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Day5CardPolicyProps {
    onComplete: (formData: Record<string, unknown>) => void;
    defaultValues?: Record<string, unknown>;
}

interface CardItem {
    id: string;
    name: string;
    isMain: boolean;
}

interface CardException {
    id: string;
    name: string;
    weeklyLimit: number;
}

const EXCEPTION_SUGGESTIONS = [
    { name: 'Mercado basico', weeklyLimit: 150 },
    { name: 'Remedios', weeklyLimit: 50 },
    { name: 'Transporte trabalho', weeklyLimit: 60 },
    { name: 'Necessidades casa/filhos', weeklyLimit: 100 },
];

const BLOCKED_REASONS = [
    'Confunde o controle mensal',
    'Gera gastos duplicados',
    'Dificulta acompanhar o limite',
    'Cria ilusao de que "ainda tem credito"',
];

const Day5CardPolicy: React.FC<Day5CardPolicyProps> = ({ onComplete, defaultValues }) => {
    const { user } = useAuth();
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [loading, setLoading] = useState(true);

    // Step 1: Cards list
    const [cards, setCards] = useState<CardItem[]>([]);
    const [newCardName, setNewCardName] = useState('');

    // Step 3: Exceptions
    const [exceptions, setExceptions] = useState<CardException[]>(
        EXCEPTION_SUGGESTIONS.map((s, i) => ({
            id: `exc-${i}`,
            name: s.name,
            weeklyLimit: s.weeklyLimit,
        }))
    );
    const [newException, setNewException] = useState('');

    // Step 4: Weekly limit
    const [weeklyLimit, setWeeklyLimit] = useState<number>(100);

    useEffect(() => {
        const loadData = async () => {
            if (!user?.id) return;
            setLoading(true);
            try {
                if (defaultValues && Object.keys(defaultValues).length > 0) {
                    const storedMain = String(defaultValues.mainCardName || '');
                    const storedBlocked = Array.isArray(defaultValues.blockedCards)
                        ? (defaultValues.blockedCards as string[])
                        : [];
                    const storedExceptions = Array.isArray(defaultValues.exceptions)
                        ? (defaultValues.exceptions as CardException[])
                        : [];
                    const storedWeeklyLimit = Number(defaultValues.weeklyLimit || 0);

                    if (storedMain || storedBlocked.length > 0) {
                        const uniqueNames = [
                            storedMain,
                            ...storedBlocked,
                        ].filter((name, index, arr) => name && arr.indexOf(name) === index);

                        setCards(
                            uniqueNames.map((name, index) => ({
                                id: `card-${index}`,
                                name,
                                isMain: name === storedMain || (!storedMain && index === 0),
                            }))
                        );
                    }

                    if (storedExceptions.length > 0) {
                        setExceptions(
                            storedExceptions.map((item, index) => ({
                                id: item.id || `exc-${index}`,
                                name: item.name,
                                weeklyLimit: Number(item.weeklyLimit) || 0,
                            }))
                        );
                    }

                    if (storedWeeklyLimit > 0) {
                        setWeeklyLimit(storedWeeklyLimit);
                    }
                    return;
                }

                const { data, error } = await supabase
                    .from('card_policy')
                    .select('weekly_limit, blocked_categories')
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (error) throw error;

                if (data?.weekly_limit) {
                    setWeeklyLimit(Number(data.weekly_limit));
                }
            } catch (error) {
                console.error('Erro ao carregar politica do cartao', error);
                toast({ title: 'Erro ao carregar politica do cartao', variant: 'destructive' });
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user?.id, defaultValues]);

    // Add card
    const handleAddCard = () => {
        if (!newCardName.trim()) return;
        setCards(prev => [...prev, {
            id: `card-${Date.now()}`,
            name: newCardName.trim(),
            isMain: prev.length === 0, // First card is main by default
        }]);
        setNewCardName('');
    };

    // Remove card
    const handleRemoveCard = (id: string) => {
        setCards(prev => {
            const filtered = prev.filter(c => c.id !== id);
            // If removed main, set first as main
            if (filtered.length > 0 && !filtered.some(c => c.isMain)) {
                filtered[0].isMain = true;
            }
            return filtered;
        });
    };

    // Set main card
    const handleSetMain = (id: string) => {
        setCards(prev => prev.map(c => ({
            ...c,
            isMain: c.id === id,
        })));
    };

    // Add exception
    const handleAddException = () => {
        if (!newException.trim()) return;
        setExceptions(prev => [...prev, {
            id: `exc-${Date.now()}`,
            name: newException.trim(),
            weeklyLimit: 50,
        }]);
        setNewException('');
    };

    // Remove exception
    const handleRemoveException = (id: string) => {
        setExceptions(prev => prev.filter(e => e.id !== id));
    };

    // Update exception limit
    const updateExceptionLimit = (id: string, limit: number) => {
        setExceptions(prev => prev.map(e =>
            e.id === id ? { ...e, weeklyLimit: limit } : e
        ));
    };

    // Stats
    const stats = useMemo(() => {
        const mainCard = cards.find(c => c.isMain);
        const blockedCards = cards.filter(c => !c.isMain);
        const totalExceptionsLimit = exceptions.reduce((sum, e) => sum + e.weeklyLimit, 0);

        return {
            mainCard,
            blockedCards,
            blockedCount: blockedCards.length,
            exceptionsCount: exceptions.length,
            totalExceptionsLimit,
            weeklyLimit,
        };
    }, [cards, exceptions, weeklyLimit]);

    // Validation
    const canProceedStep1 = cards.length >= 1;
    const canProceedStep2 = cards.some(c => c.isMain);
    const hasExceptions = exceptions.some(e => e.weeklyLimit > 0);
    const canComplete = canProceedStep1 && canProceedStep2 && weeklyLimit > 0 && hasExceptions;

    // Handle complete
    const handleComplete = () => {
        onComplete({
            mainCardName: stats.mainCard?.name || '',
            blockedCount: stats.blockedCount,
            blockedCards: stats.blockedCards.map(c => c.name),
            blocked_categories: stats.blockedCards.map(c => c.name),
            exceptionsCount: stats.exceptionsCount,
            exceptions: exceptions.map(e => ({
                name: e.name,
                weeklyLimit: e.weeklyLimit,
            })),
            weeklyLimit: stats.weeklyLimit,
            weekly_limit: stats.weeklyLimit,
            totalExceptionsLimit: stats.totalExceptionsLimit,
        });
    };

    return (
        <div className="space-y-6">
            <Card className="glass-card border-primary/10">
                <CardContent className="p-4 text-sm text-muted-foreground">
                    Um cartao principal, limite claro e poucas excecoes. Isso reduz ansiedade e evita surpresa.
                </CardContent>
            </Card>

            {loading && (
                <div className="text-sm text-muted-foreground">Carregando politica atual...</div>
            )}

            {/* Progress */}
            <div className="flex gap-1">
                {[1, 2, 3, 4].map(s => (
                    <div
                        key={s}
                        className={cn(
                            "h-1.5 flex-1 rounded-full transition-colors",
                            s <= step ? "bg-primary" : "bg-muted"
                        )}
                    />
                ))}
            </div>

            {/* Step 1: List Cards */}
            {step === 1 && (
                <div className="space-y-4">
                    <div className="glass-card p-4">
                        <h3 className="font-bold text-lg mb-2">Passo 1: Liste seus cartoes</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Adicione todos os cartoes de credito que voce tem.
                            Sem detalhes, so pra enxergar o cenario.
                        </p>

                        <div className="space-y-3">
                            {cards.map((card, index) => (
                                <Card key={card.id} className="overflow-hidden">
                                    <CardContent className="p-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="h-5 w-5 text-primary" />
                                            <span className="font-medium">Cartao {String.fromCharCode(65 + index)}: {card.name}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleRemoveCard(card.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}

                            {cards.length === 0 && (
                                <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                                    <CreditCard className="h-10 w-10 mx-auto mb-2 opacity-30" />
                                    <p>Adicione seus cartoes de credito</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2 mt-4">
                            <Input
                                placeholder="Nome do cartao (ex: Nubank, Inter, Itau...)"
                                value={newCardName}
                                onChange={(e) => setNewCardName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddCard()}
                            />
                            <Button
                                variant="outline"
                                onClick={handleAddCard}
                                disabled={!newCardName.trim()}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

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

            {/* Step 2: Choose Main Card */}
            {step === 2 && (
                <div className="space-y-4">
                    <div className="glass-card p-4">
                        <h3 className="font-bold text-lg mb-2">Passo 2: Escolha 1 cartao principal</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Escolha o cartao que mais faz sentido. Os outros ficam em <strong>"pausa"</strong>.
                        </p>

                        <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 mb-4">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                                <p className="text-sm">
                                    <strong>Regra:</strong> Se voce escolher 1, os outros viram "nao usar".
                                    Voce nao esta cancelando a vida. Esta tirando confusao.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {cards.map((card, index) => (
                                <Card
                                    key={card.id}
                                    className={cn(
                                        "overflow-hidden cursor-pointer transition-all",
                                        card.isMain
                                            ? "border-2 border-primary bg-primary/5"
                                            : "hover:bg-muted/50 opacity-60"
                                    )}
                                    onClick={() => handleSetMain(card.id)}
                                >
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {card.isMain ? (
                                                <Unlock className="h-5 w-5 text-primary" />
                                            ) : (
                                                <Lock className="h-5 w-5 text-muted-foreground" />
                                            )}
                                            <div>
                                                <span className="font-medium">
                                                    Cartao {String.fromCharCode(65 + index)}: {card.name}
                                                </span>
                                                <p className="text-xs text-muted-foreground">
                                                    {card.isMain ? 'CARTAO PRINCIPAL' : 'Bloqueado por 30 dias'}
                                                </p>
                                            </div>
                                        </div>
                                        {card.isMain && (
                                            <Star className="h-5 w-5 text-primary fill-primary" />
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {stats.blockedCount > 0 && (
                            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                <p className="text-sm font-medium text-red-500 mb-2">
                                    Motivos para bloquear os outros:
                                </p>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                    {BLOCKED_REASONS.map((reason, i) => (
                                        <li key={i}>• {reason}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between gap-4">
                        <Button variant="outline" onClick={() => setStep(1)}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                        </Button>
                        <Button
                            onClick={() => setStep(3)}
                            disabled={!canProceedStep2}
                        >
                            Proximo <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 3: Exceptions */}
            {step === 3 && (
                <div className="space-y-4">
                    <div className="glass-card p-4">
                        <h3 className="font-bold text-lg mb-2">Passo 3: Defina excecoes</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Excecao nao pode virar "vale tudo".
                            Sao poucas coisas, bem definidas, com limite semanal.
                        </p>

                        <div className="space-y-3">
                            {exceptions.map(exc => (
                                <Card key={exc.id} className="overflow-hidden">
                                    <CardContent className="p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium">{exc.name}</span>
                                            {!EXCEPTION_SUGGESTIONS.some(s => s.name === exc.name) && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleRemoveException(exc.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Label className="text-xs whitespace-nowrap">Limite semanal:</Label>
                                            <div className="relative flex-1">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="number"
                                                    value={exc.weeklyLimit || ''}
                                                    onChange={(e) => updateExceptionLimit(exc.id, parseFloat(e.target.value) || 0)}
                                                    className="pl-9 h-9"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="flex gap-2 mt-4">
                            <Input
                                placeholder="Adicionar outra excecao..."
                                value={newException}
                                onChange={(e) => setNewException(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddException()}
                            />
                            <Button
                                variant="outline"
                                onClick={handleAddException}
                                disabled={!newException.trim()}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Total excecoes/semana:</span>
                                <span className="font-bold text-primary">
                                    {formatCurrency(stats.totalExceptionsLimit)}
                                </span>
                            </div>
                        </div>

                        {!hasExceptions && (
                            <div className="mt-3 p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 text-sm text-yellow-700">
                                Adicione pelo menos uma excecao com limite realista.
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between gap-4">
                        <Button variant="outline" onClick={() => setStep(2)}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                        </Button>
                        <Button onClick={() => setStep(4)}>
                            Proximo <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 4: Weekly Limit */}
            {step === 4 && (
                <div className="space-y-4">
                    <div className="glass-card p-4">
                        <h3 className="font-bold text-lg mb-2">Passo 4: Modo CONTROLADO</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Defina um limite semanal para o cartao principal.
                            Semanal e curto, da controle e previsibilidade.
                        </p>

                        <div className="p-4 rounded-lg bg-muted/50 space-y-4">
                            <Label className="block">Limite semanal do cartao {stats.mainCard?.name}:</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                                <Input
                                    type="number"
                                    value={weeklyLimit || ''}
                                    onChange={(e) => setWeeklyLimit(parseFloat(e.target.value) || 0)}
                                    className="pl-12 h-14 text-2xl font-bold text-center"
                                />
                            </div>
                            <p className="text-xs text-center text-muted-foreground">
                                Por semana (nao por mes!)
                            </p>
                        </div>

                        {/* Summary */}
                        <div className="mt-6 space-y-3">
                            <h4 className="font-medium">Resumo da sua politica:</h4>

                            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                                <div className="flex items-center gap-2">
                                    <Unlock className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">
                                        <strong>LIBERADO:</strong> {stats.mainCard?.name}
                                        ({formatCurrency(weeklyLimit)}/semana)
                                    </span>
                                </div>
                            </div>

                            {stats.blockedCount > 0 && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Lock className="h-4 w-4 text-red-500" />
                                        <span className="text-sm font-medium">
                                            BLOQUEADOS ({stats.blockedCount}):
                                        </span>
                                    </div>
                                    <ul className="text-xs text-muted-foreground ml-6">
                                        {stats.blockedCards.map(c => (
                                            <li key={c.id}>• {c.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <Check className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm font-medium">
                                        EXCECOES ({stats.exceptionsCount}):
                                    </span>
                                </div>
                                <ul className="text-xs text-muted-foreground ml-6">
                                    {exceptions.map(e => (
                                        <li key={e.id}>• {e.name}: {formatCurrency(e.weeklyLimit)}/sem</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between gap-4">
                        <Button variant="outline" onClick={() => setStep(3)}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                        </Button>
                        <Button
                            onClick={handleComplete}
                            disabled={!canComplete || weeklyLimit <= 0}
                            className="flex-1 btn-fire"
                        >
                            <Check className="mr-2 h-4 w-4" /> Concluir Dia 5
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Day5CardPolicy;
