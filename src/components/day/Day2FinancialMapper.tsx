import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Plus, Trash2, DollarSign, Wallet, CreditCard, TrendingUp,
    Check, AlertTriangle, Loader2
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useIncomeItems, IncomeItem } from '@/hooks/useIncomeItems';
import { useFixedExpenses, FixedExpense } from '@/hooks/useFixedExpenses';
import { useDebts, Debt, DebtInput } from '@/hooks/useDebts';
import { Checkbox } from '@/components/ui/checkbox';

interface Day2FinancialMapperProps {
    onComplete: (formData: Record<string, unknown>) => void;
    defaultValues?: Record<string, unknown>;
}

type ItemType = 'income' | 'expense' | 'debt';

interface EditingIncome {
    type: 'income';
    data: Partial<IncomeItem>;
    isNew: boolean;
}

interface EditingExpense {
    type: 'expense';
    data: Partial<FixedExpense>;
    isNew: boolean;
}

interface EditingDebt {
    type: 'debt';
    data: Partial<Debt> & { installments_remaining?: number; category?: string };
    isNew: boolean;
}

type EditingItem = EditingIncome | EditingExpense | EditingDebt | null;

const EXPENSE_CATEGORIES = [
    { value: 'housing', label: '🏠 Habitação' },
    { value: 'utilities', label: '💡 Serviços' },
    { value: 'transport', label: '🚗 Transporte' },
    { value: 'education', label: '📚 Educação' },
    { value: 'health', label: '🏥 Saúde' },
    { value: 'insurance', label: '🛡️ Seguros' },
    { value: 'subscriptions', label: '📺 Assinaturas' },
    { value: 'food', label: '🍔 Alimentação' },
    { value: 'other', label: '📦 Outros' },
];

const DEBT_TYPES = [
    { value: 'credit_card', label: '💳 Cartão de Crédito' },
    { value: 'loan', label: '🏦 Empréstimo' },
    { value: 'financing', label: '🚗 Financiamento' },
    { value: 'overdraft', label: '📊 Cheque Especial' },
    { value: 'store', label: '🛒 Crediário' },
    { value: 'personal', label: '👥 Dívida Pessoal' },
    { value: 'other', label: '📦 Outros' },
];

const Day2FinancialMapper: React.FC<Day2FinancialMapperProps> = ({ onComplete }) => {
    const [activeTab, setActiveTab] = useState<ItemType>('income');
    const [editingItem, setEditingItem] = useState<EditingItem>(null);
    const [saving, setSaving] = useState(false);

    // Local state for items
    const [incomeItems, setIncomeItems] = useState<IncomeItem[]>([]);
    const [expenseItems, setExpenseItems] = useState<FixedExpense[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const incomeHook = useIncomeItems();
    const expenseHook = useFixedExpenses();
    const debtHook = useDebts();

    // Fetch data on mount
    useEffect(() => {
        const loadData = async () => {
            setIsLoadingData(true);
            try {
                const [income, expenses] = await Promise.all([
                    incomeHook.fetchAll(),
                    expenseHook.fetchAll(),
                ]);
                setIncomeItems(income);
                setExpenseItems(expenses);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setIsLoadingData(false);
            }
        };
        loadData();
    }, []);

    // Calculations
    const totals = useMemo(() => {
        const income = incomeItems.reduce((sum, item) => sum + (item.amount || 0), 0);
        const expenses = expenseItems.reduce((sum, item) => sum + (item.amount || 0), 0);
        const debtsMin = debtHook.debts.reduce((sum, debt) => sum + (debt.installment_value || 0), 0);
        const debtsTotal = debtHook.debts.reduce((sum, debt) => sum + (debt.total_balance || 0), 0);
        return {
            income,
            expenses,
            debtsMin,
            debtsTotal,
            balance: income - expenses - debtsMin,
            itemsCount: incomeItems.length + expenseItems.length + debtHook.debts.length,
        };
    }, [incomeItems, expenseItems, debtHook.debts]);

    // Open modal for new item
    const handleAddNew = () => {
        if (activeTab === 'income') {
            setEditingItem({
                type: 'income',
                data: { source: '', amount: 0, received_on: 5, recurrence: 'monthly' },
                isNew: true,
            });
        } else if (activeTab === 'expense') {
            setEditingItem({
                type: 'expense',
                data: { name: '', amount: 0, category: 'other', due_date: 10 },
                isNew: true,
            });
        } else {
            setEditingItem({
                type: 'debt',
                data: { creditor: '', total_balance: 0, installment_value: 0, installments_remaining: 1, due_day: 10, is_critical: false, type: 'other' },
                isNew: true,
            });
        }
    };

    // Open modal for editing
    const handleEditIncome = (item: IncomeItem) => {
        setEditingItem({ type: 'income', data: { ...item }, isNew: false });
    };

    const handleEditExpense = (item: FixedExpense) => {
        setEditingItem({ type: 'expense', data: { ...item }, isNew: false });
    };

    const handleEditDebt = (item: Debt) => {
        setEditingItem({ type: 'debt', data: { ...item }, isNew: false });
    };

    // Reload data
    const reloadData = async () => {
        const [income, expenses] = await Promise.all([
            incomeHook.fetchAll(),
            expenseHook.fetchAll(),
        ]);
        setIncomeItems(income);
        setExpenseItems(expenses);
    };

    // Save item
    const handleSave = async () => {
        if (!editingItem) return;
        setSaving(true);
        try {
            if (editingItem.type === 'income') {
                const data = editingItem.data;
                if (editingItem.isNew) {
                    await incomeHook.create({
                        source: data.source || '',
                        amount: data.amount || 0,
                        received_on: data.received_on,
                        recurrence: data.recurrence as 'monthly' | 'weekly' | 'biweekly' | 'one_time',
                    });
                } else {
                    await incomeHook.update(data.id!, {
                        source: data.source,
                        amount: data.amount,
                        received_on: data.received_on,
                        recurrence: data.recurrence as 'monthly' | 'weekly' | 'biweekly' | 'one_time',
                    });
                }
                await reloadData();
            } else if (editingItem.type === 'expense') {
                const data = editingItem.data;
                if (editingItem.isNew) {
                    await expenseHook.create({
                        name: data.name || '',
                        amount: data.amount || 0,
                        category: data.category,
                        due_date: data.due_date,
                    });
                } else {
                    await expenseHook.update(data.id!, {
                        name: data.name,
                        amount: data.amount,
                        category: data.category,
                        due_date: data.due_date,
                    });
                }
                await reloadData();
            } else if (editingItem.type === 'debt') {
                const data = editingItem.data;
                const debtPayload: DebtInput = {
                    creditor: data.creditor || '',
                    total_balance: data.total_balance || 0,
                    installment_value: data.installment_value || 0,
                    due_day: data.due_day || 10,
                    is_critical: data.is_critical || false,
                    type: data.type || 'other',
                };
                if (editingItem.isNew) {
                    await debtHook.addDebt.mutateAsync(debtPayload);
                } else {
                    await debtHook.updateDebt.mutateAsync({ id: data.id!, payload: debtPayload });
                }
            }
            toast({ title: editingItem.isNew ? 'Item adicionado!' : 'Item atualizado!' });
            setEditingItem(null);
        } catch (err) {
            console.error('Save error:', err);
            toast({ title: 'Erro ao salvar', variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };

    // Delete item
    const handleDelete = async () => {
        if (!editingItem || editingItem.isNew) return;
        setSaving(true);
        try {
            const id = editingItem.data.id;
            if (!id) return;

            if (editingItem.type === 'income') {
                await incomeHook.remove(id);
                await reloadData();
            } else if (editingItem.type === 'expense') {
                await expenseHook.remove(id);
                await reloadData();
            } else if (editingItem.type === 'debt') {
                await debtHook.deleteDebt.mutateAsync(id);
            }
            toast({ title: 'Item removido!' });
            setEditingItem(null);
        } catch {
            toast({ title: 'Erro ao remover', variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };

    // Update editing item field
    const updateField = (field: string, value: unknown) => {
        if (!editingItem) return;
        setEditingItem({
            ...editingItem,
            data: { ...editingItem.data, [field]: value },
        } as EditingItem);
    };

    // Complete day
    const handleComplete = () => {
        onComplete({
            totalIncome: totals.income,
            totalExpenses: totals.expenses,
            totalDebtsMin: totals.debtsMin,
            totalDebtsBalance: totals.debtsTotal,
            balance: totals.balance,
            incomeCount: incomeItems.length,
            expenseCount: expenseItems.length,
            debtCount: debtHook.debts.length,
        });
    };

    // Check if can complete
    const canComplete = totals.itemsCount > 0;

    if (isLoadingData || debtHook.isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ItemType)}>
                <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="income" className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span className="hidden sm:inline">Receitas</span>
                        <span className="text-xs opacity-70">({incomeItems.length})</span>
                    </TabsTrigger>
                    <TabsTrigger value="expense" className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        <span className="hidden sm:inline">Despesas</span>
                        <span className="text-xs opacity-70">({expenseItems.length})</span>
                    </TabsTrigger>
                    <TabsTrigger value="debt" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span className="hidden sm:inline">Dívidas</span>
                        <span className="text-xs opacity-70">({debtHook.debts.length})</span>
                    </TabsTrigger>
                </TabsList>

                {/* Income Tab */}
                <TabsContent value="income" className="mt-4">
                    <div className="space-y-2">
                        {incomeItems.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                <p>Nenhuma receita cadastrada</p>
                                <p className="text-sm">Clique em + para adicionar</p>
                            </div>
                        ) : (
                            incomeItems.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleEditIncome(item)}
                                    className="flex items-center justify-between p-4 rounded-xl glass-card border border-border/50 cursor-pointer hover:border-primary/30 transition-all"
                                >
                                    <div>
                                        <p className="font-medium">{item.source}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Dia {item.received_on} • {item.recurrence === 'monthly' ? 'Mensal' : item.recurrence}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-500">{formatCurrency(item.amount)}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </TabsContent>

                {/* Expenses Tab */}
                <TabsContent value="expense" className="mt-4">
                    <div className="space-y-2">
                        {expenseItems.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Wallet className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                <p>Nenhuma despesa cadastrada</p>
                                <p className="text-sm">Clique em + para adicionar</p>
                            </div>
                        ) : (
                            expenseItems.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleEditExpense(item)}
                                    className="flex items-center justify-between p-4 rounded-xl glass-card border border-border/50 cursor-pointer hover:border-primary/30 transition-all"
                                >
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {EXPENSE_CATEGORIES.find(c => c.value === item.category)?.label || item.category} • Vence dia {item.due_date}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-red-500">{formatCurrency(item.amount)}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </TabsContent>

                {/* Debts Tab */}
                <TabsContent value="debt" className="mt-4">
                    <div className="space-y-2">
                        {debtHook.debts.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                <p>Nenhuma dívida cadastrada</p>
                                <p className="text-sm">Clique em + para adicionar</p>
                            </div>
                        ) : (
                            debtHook.debts.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleEditDebt(item)}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-xl glass-card border cursor-pointer hover:border-primary/30 transition-all",
                                        item.is_critical ? "border-red-500/50 bg-red-500/5" : "border-border/50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {item.is_critical && <AlertTriangle className="h-4 w-4 text-red-500" />}
                                        <div>
                                            <p className="font-medium">{item.creditor}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatCurrency(item.installment_value || 0)}/mês • Dia {item.due_day}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-orange-500">{formatCurrency(item.total_balance || 0)}</p>
                                        <p className="text-xs text-muted-foreground">total</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Add Button */}
            <Button onClick={handleAddNew} className="w-full" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar {activeTab === 'income' ? 'Receita' : activeTab === 'expense' ? 'Despesa' : 'Dívida'}
            </Button>

            {/* Summary */}
            <div className="glass-card p-4 space-y-3">
                <h4 className="font-bold text-center mb-4">📊 Resumo Financeiro</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <p className="text-muted-foreground text-xs">Receitas</p>
                        <p className="font-bold text-green-500 text-lg">{formatCurrency(totals.income)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <p className="text-muted-foreground text-xs">Despesas</p>
                        <p className="font-bold text-red-500 text-lg">{formatCurrency(totals.expenses)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                        <p className="text-muted-foreground text-xs">Dívidas</p>
                        <p className="font-bold text-orange-500 text-lg">{formatCurrency(totals.debtsMin)}</p>
                    </div>
                    <div className={cn(
                        "p-3 rounded-lg border",
                        totals.balance >= 0
                            ? "bg-green-500/10 border-green-500/20"
                            : "bg-red-500/10 border-red-500/20"
                    )}>
                        <p className="text-muted-foreground text-xs">Saldo</p>
                        <p className={cn(
                            "font-bold text-lg",
                            totals.balance >= 0 ? "text-green-500" : "text-red-500"
                        )}>
                            {formatCurrency(totals.balance)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Complete Button */}
            <Button
                onClick={handleComplete}
                disabled={!canComplete}
                className="w-full btn-fire"
            >
                <Check className="mr-2 h-4 w-4" />
                Concluir Dia 2
            </Button>

            {/* Edit Modal */}
            <Dialog open={editingItem !== null} onOpenChange={(open) => !open && setEditingItem(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingItem?.isNew ? 'Adicionar' : 'Editar'}{' '}
                            {editingItem?.type === 'income' ? 'Receita' : editingItem?.type === 'expense' ? 'Despesa' : 'Dívida'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Income Form */}
                        {editingItem?.type === 'income' && (
                            <>
                                <div>
                                    <Label>Fonte da receita</Label>
                                    <Input
                                        placeholder="Ex: Salário, Freelance..."
                                        value={editingItem.data.source || ''}
                                        onChange={(e) => updateField('source', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Valor</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            className="pl-9"
                                            placeholder="0,00"
                                            value={editingItem.data.amount || ''}
                                            onChange={(e) => updateField('amount', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Dia de recebimento</Label>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={31}
                                            value={editingItem.data.received_on || 5}
                                            onChange={(e) => updateField('received_on', parseInt(e.target.value) || 5)}
                                        />
                                    </div>
                                    <div>
                                        <Label>Frequência</Label>
                                        <Select
                                            value={editingItem.data.recurrence || 'monthly'}
                                            onValueChange={(v) => updateField('recurrence', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="monthly">Mensal</SelectItem>
                                                <SelectItem value="weekly">Semanal</SelectItem>
                                                <SelectItem value="biweekly">Quinzenal</SelectItem>
                                                <SelectItem value="one_time">Única</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Expense Form */}
                        {editingItem?.type === 'expense' && (
                            <>
                                <div>
                                    <Label>Nome da despesa</Label>
                                    <Input
                                        placeholder="Ex: Aluguel, Internet..."
                                        value={editingItem.data.name || ''}
                                        onChange={(e) => updateField('name', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Categoria</Label>
                                    <Select
                                        value={editingItem.data.category || 'other'}
                                        onValueChange={(v) => updateField('category', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {EXPENSE_CATEGORIES.map((cat) => (
                                                <SelectItem key={cat.value} value={cat.value}>
                                                    {cat.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Valor</Label>
                                        <Input
                                            type="number"
                                            placeholder="0,00"
                                            value={editingItem.data.amount || ''}
                                            onChange={(e) => updateField('amount', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    <div>
                                        <Label>Dia vencimento</Label>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={31}
                                            value={editingItem.data.due_date || 10}
                                            onChange={(e) => updateField('due_date', parseInt(e.target.value) || 10)}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Debt Form */}
                        {editingItem?.type === 'debt' && (
                            <>
                                <div>
                                    <Label>Credor</Label>
                                    <Input
                                        placeholder="Ex: Nubank, Santander..."
                                        value={editingItem.data.creditor || ''}
                                        onChange={(e) => updateField('creditor', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Tipo</Label>
                                    <Select
                                        value={editingItem.data.type || 'other'}
                                        onValueChange={(v) => updateField('type', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DEBT_TYPES.map((t) => (
                                                <SelectItem key={t.value} value={t.value}>
                                                    {t.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Saldo total</Label>
                                        <Input
                                            type="number"
                                            placeholder="0,00"
                                            value={editingItem.data.total_balance || ''}
                                            onChange={(e) => updateField('total_balance', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    <div>
                                        <Label>Valor parcela</Label>
                                        <Input
                                            type="number"
                                            placeholder="0,00"
                                            value={editingItem.data.installment_value || ''}
                                            onChange={(e) => updateField('installment_value', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label>Dia vencimento</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={31}
                                        value={editingItem.data.due_day || 10}
                                        onChange={(e) => updateField('due_day', parseInt(e.target.value) || 10)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="is_critical"
                                        checked={editingItem.data.is_critical || false}
                                        onCheckedChange={(checked) => updateField('is_critical', checked)}
                                    />
                                    <Label htmlFor="is_critical" className="flex items-center gap-2 cursor-pointer">
                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                        Dívida crítica (juros altos ou risco de nome sujo)
                                    </Label>
                                </div>
                            </>
                        )}
                    </div>

                    <DialogFooter className="flex gap-2">
                        {!editingItem?.isNew && (
                            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                            </Button>
                        )}
                        <div className="flex-1" />
                        <Button variant="outline" onClick={() => setEditingItem(null)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Day2FinancialMapper;
