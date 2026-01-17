import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
    Check, ArrowRight, ArrowLeft, Ban, ShieldCheck,
    Plus, Trash2, DollarSign
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

interface Day4SpendingRulesProps {
    onComplete: (formData: Record<string, unknown>) => void;
    defaultValues?: Record<string, unknown>;
}

interface BannedSpending {
    id: string;
    name: string;
    reason: string;
    substitute: string;
}

interface AllowedException {
    id: string;
    name: string;
    limit: number;
    observation: string;
}

// Suggestions based on common triggers from Day 3
const BANNED_SUGGESTIONS = [
    '🍔 Delivery / iFood',
    '☕ Cafés na rua',
    '👕 Roupas novas',
    '🛒 Compras online impulsivas',
    '🍺 Bares e baladas',
    '🎮 Games e in-app purchases',
    '💅 Salão / estética não essencial',
    '📱 Apps pagos desnecessários',
];

const EXCEPTION_SUGGESTIONS = [
    { name: '💊 Remédios', limit: 200 },
    { name: '🍚 Alimentação básica', limit: 600 },
    { name: '🚌 Transporte trabalho', limit: 300 },
    { name: '💡 Luz', limit: 150 },
    { name: '💧 Água', limit: 100 },
    { name: '🏠 Aluguel/Moradia', limit: 0 },
    { name: '📞 Internet/Telefone', limit: 150 },
    { name: '⛽ Combustível', limit: 400 },
];

const Day4SpendingRules: React.FC<Day4SpendingRulesProps> = ({ onComplete }) => {
    const [currentSection, setCurrentSection] = useState<'banned' | 'exceptions'>('banned');

    // Banned spending state
    const [bannedList, setBannedList] = useState<BannedSpending[]>([]);
    const [newBanned, setNewBanned] = useState('');

    // Exceptions state
    const [exceptions, setExceptions] = useState<AllowedException[]>(
        EXCEPTION_SUGGESTIONS.map((s, i) => ({
            id: `exc-${i}`,
            name: s.name,
            limit: s.limit,
            observation: '',
        }))
    );
    const [newException, setNewException] = useState('');

    // Add banned item
    const handleAddBanned = (name?: string) => {
        const itemName = name || newBanned.trim();
        if (!itemName) return;

        // Check if already exists
        if (bannedList.some(b => b.name.toLowerCase() === itemName.toLowerCase())) return;

        setBannedList(prev => [...prev, {
            id: `ban-${Date.now()}`,
            name: itemName,
            reason: '',
            substitute: '',
        }]);
        setNewBanned('');
    };

    // Remove banned item
    const handleRemoveBanned = (id: string) => {
        setBannedList(prev => prev.filter(b => b.id !== id));
    };

    // Update banned item
    const updateBanned = (id: string, field: keyof BannedSpending, value: string) => {
        setBannedList(prev => prev.map(b =>
            b.id === id ? { ...b, [field]: value } : b
        ));
    };

    // Add exception
    const handleAddException = () => {
        if (!newException.trim()) return;

        setExceptions(prev => [...prev, {
            id: `exc-${Date.now()}`,
            name: newException.trim(),
            limit: 0,
            observation: '',
        }]);
        setNewException('');
    };

    // Remove exception
    const handleRemoveException = (id: string) => {
        setExceptions(prev => prev.filter(e => e.id !== id));
    };

    // Update exception
    const updateException = (id: string, field: keyof AllowedException, value: string | number) => {
        setExceptions(prev => prev.map(e =>
            e.id === id ? { ...e, [field]: value } : e
        ));
    };

    // Stats
    const stats = useMemo(() => {
        const totalLimit = exceptions.reduce((sum, e) => sum + (e.limit || 0), 0);
        const withReasons = bannedList.filter(b => b.reason).length;
        const withSubstitutes = bannedList.filter(b => b.substitute).length;

        return {
            bannedCount: bannedList.length,
            withReasons,
            withSubstitutes,
            exceptionsCount: exceptions.filter(e => e.limit > 0).length,
            totalLimit,
        };
    }, [bannedList, exceptions]);

    // Can complete
    const canComplete = bannedList.length >= 3;

    // Handle complete
    const handleComplete = () => {
        onComplete({
            bannedCount: stats.bannedCount,
            exceptionsCount: stats.exceptionsCount,
            totalExceptionsLimit: stats.totalLimit,
            bannedList: bannedList.map(b => ({
                name: b.name,
                reason: b.reason,
                substitute: b.substitute,
            })),
            exceptions: exceptions.filter(e => e.limit > 0).map(e => ({
                name: e.name,
                limit: e.limit,
                observation: e.observation,
            })),
        });
    };

    return (
        <div className="space-y-6">
            {/* Section Tabs */}
            <div className="flex gap-2">
                <Button
                    variant={currentSection === 'banned' ? 'default' : 'outline'}
                    onClick={() => setCurrentSection('banned')}
                    className="flex-1"
                >
                    <Ban className="mr-2 h-4 w-4" />
                    Não Gasto Mais
                </Button>
                <Button
                    variant={currentSection === 'exceptions' ? 'default' : 'outline'}
                    onClick={() => setCurrentSection('exceptions')}
                    className="flex-1"
                >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Exceções
                </Button>
            </div>

            {/* Section 1: Banned Spending */}
            {currentSection === 'banned' && (
                <div className="space-y-4">
                    <div className="glass-card p-4">
                        <h3 className="font-bold text-lg mb-2">🚫 Lista "Não Gasto Mais"</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Gastos que você se compromete a suspender por 30 dias.
                            Escolha pelo menos 3 itens.
                        </p>

                        {/* Suggestions */}
                        <div className="mb-4">
                            <Label className="text-xs mb-2 block">Sugestões baseadas no seu perfil:</Label>
                            <div className="flex flex-wrap gap-2">
                                {BANNED_SUGGESTIONS.map(suggestion => {
                                    const alreadyAdded = bannedList.some(b => b.name === suggestion);
                                    return (
                                        <button
                                            key={suggestion}
                                            onClick={() => !alreadyAdded && handleAddBanned(suggestion)}
                                            disabled={alreadyAdded}
                                            className={cn(
                                                "px-3 py-1.5 rounded-full text-xs transition-colors",
                                                alreadyAdded
                                                    ? "bg-primary/20 text-primary line-through opacity-60"
                                                    : "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30"
                                            )}
                                        >
                                            {suggestion}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Banned items list */}
                        <div className="space-y-3">
                            {bannedList.map(item => (
                                <Card key={item.id} className="overflow-hidden border-red-500/30">
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Ban className="h-4 w-4 text-red-500" />
                                                <span className="font-medium">{item.name}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleRemoveBanned(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </div>

                                        <div>
                                            <Label className="text-xs">Por que você quer parar?</Label>
                                            <Input
                                                placeholder="Ex: Gasto muito dinheiro sem perceber..."
                                                value={item.reason}
                                                onChange={(e) => updateBanned(item.id, 'reason', e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <Label className="text-xs">Substituto saudável</Label>
                                            <Input
                                                placeholder="Ex: Cozinhar em casa, levar marmita..."
                                                value={item.substitute}
                                                onChange={(e) => updateBanned(item.id, 'substitute', e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {bannedList.length === 0 && (
                                <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                                    <Ban className="h-10 w-10 mx-auto mb-2 opacity-30" />
                                    <p>Clique nas sugestões acima ou adicione seus próprios itens</p>
                                </div>
                            )}
                        </div>

                        {/* Add custom */}
                        <div className="flex gap-2 mt-4">
                            <Input
                                placeholder="Adicionar outro gasto para banir..."
                                value={newBanned}
                                onChange={(e) => setNewBanned(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddBanned()}
                            />
                            <Button
                                variant="outline"
                                onClick={() => handleAddBanned()}
                                disabled={!newBanned.trim()}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                            <p className="text-xs text-muted-foreground">Banidos</p>
                            <p className="text-2xl font-bold text-red-500">{stats.bannedCount}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center">
                            <p className="text-xs text-muted-foreground">Com motivo</p>
                            <p className="text-2xl font-bold text-orange-500">{stats.withReasons}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                            <p className="text-xs text-muted-foreground">C/ substituto</p>
                            <p className="text-2xl font-bold text-green-500">{stats.withSubstitutes}</p>
                        </div>
                    </div>

                    {bannedList.length < 3 && (
                        <p className="text-sm text-center text-muted-foreground">
                            Adicione pelo menos 3 gastos para banir
                        </p>
                    )}
                </div>
            )}

            {/* Section 2: Exceptions */}
            {currentSection === 'exceptions' && (
                <div className="space-y-4">
                    <div className="glass-card p-4">
                        <h3 className="font-bold text-lg mb-2">✅ Exceções Permitidas</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Despesas essenciais que você NÃO pode cortar.
                            Defina um limite para cada uma.
                        </p>

                        <div className="space-y-3">
                            {exceptions.map(item => (
                                <Card key={item.id} className="overflow-hidden border-green-500/30">
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck className="h-4 w-4 text-green-500" />
                                                <span className="font-medium">{item.name}</span>
                                            </div>
                                            {!EXCEPTION_SUGGESTIONS.some(s => s.name === item.name) && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleRemoveException(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            )}
                                        </div>

                                        <div>
                                            <Label className="text-xs">Limite mensal (R$)</Label>
                                            <div className="relative mt-1">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="number"
                                                    placeholder="0,00"
                                                    value={item.limit || ''}
                                                    onChange={(e) => updateException(item.id, 'limit', parseFloat(e.target.value) || 0)}
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-xs">Estratégia para manter sob controle</Label>
                                            <Textarea
                                                placeholder="Ex: Planejar cardápio semanal, usar transporte público 2x na semana..."
                                                value={item.observation}
                                                onChange={(e) => updateException(item.id, 'observation', e.target.value)}
                                                className="mt-1"
                                                rows={2}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Add custom */}
                        <div className="flex gap-2 mt-4">
                            <Input
                                placeholder="Adicionar outra exceção..."
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
                    </div>

                    {/* Summary */}
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Total limite essencial:</span>
                            <span className="text-2xl font-bold text-primary">
                                {formatCurrency(stats.totalLimit)}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Este é o mínimo que você precisa para sobreviver no mês
                        </p>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between gap-4">
                {currentSection === 'exceptions' ? (
                    <>
                        <Button variant="outline" onClick={() => setCurrentSection('banned')}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                        </Button>
                        <Button
                            onClick={handleComplete}
                            disabled={!canComplete}
                            className="flex-1 btn-fire"
                        >
                            <Check className="mr-2 h-4 w-4" /> Concluir Dia 4
                        </Button>
                    </>
                ) : (
                    <>
                        <div />
                        <Button
                            onClick={() => setCurrentSection('exceptions')}
                            disabled={bannedList.length < 3}
                        >
                            Próximo <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Day4SpendingRules;
