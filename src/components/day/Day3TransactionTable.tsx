import { useEffect, useState, useMemo } from 'react';
import { useTransactions, Transaction } from '@/hooks/useTransactions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Trash2, TrendingDown, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

interface Day3TransactionTableProps {
    onComplete: (values: Record<string, unknown>) => void;
    defaultValues?: Record<string, unknown>;
    submitLabel?: string;
}

const CATEGORIES = [
    'Alimentacao',
    'Transporte',
    'Moradia',
    'Saude',
    'Lazer',
    'Educacao',
    'Compras',
    'Servicos',
    'Outros',
];

export default function Day3TransactionTable({
    onComplete,
    defaultValues,
    submitLabel,
}: Day3TransactionTableProps) {
    const { fetchAll, create, bulkCreate, update, remove, markAsShadow, getTop5ByAmount } = useTransactions();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [importing, setImporting] = useState(false);
    const [importOnlyExpenses, setImportOnlyExpenses] = useState(true);

    // New transaction state
    const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
    const [newDesc, setNewDesc] = useState('');
    const [newValue, setNewValue] = useState('');
    const [newCat, setNewCat] = useState('Outros');

    const [topExpenses, setTopExpenses] = useState<Transaction[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchAll();
            setTransactions(data);
            const top5 = await getTop5ByAmount();
            setTopExpenses(top5);
        } catch (error) {
            console.error('Failed to load transactions', error);
            toast({ title: 'Erro ao carregar transacoes', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newDesc || !newValue) {
            toast({ title: 'Preencha descricao e valor', variant: 'destructive' });
            return;
        }

        setAdding(true);
        try {
            const amount = parseFloat(newValue.replace(',', '.'));
            const newItem = await create({
                date: newDate,
                description: newDesc,
                amount: amount,
                category: newCat,
                is_shadow: false,
                status: 'essential' // Default
            });

            if (newItem) {
                setTransactions([newItem, ...transactions]);
                setNewDesc('');
                setNewValue('');
                toast({ title: 'Transacao adicionada!' });

                // Update top 5 if needed
                if (transactions.length < 5 || amount > (topExpenses[4]?.amount || 0)) {
                    const top5 = await getTop5ByAmount();
                    setTopExpenses(top5);
                }
            }
        } catch (error) {
            console.error('Error adding transaction', error);
            toast({ title: 'Erro ao adicionar', variant: 'destructive' });
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const success = await remove(id);
            if (success) {
                setTransactions(transactions.filter(t => t.id !== id));
                setTopExpenses(topExpenses.filter(t => t.id !== id));
            }
        } catch (error) {
            toast({ title: 'Erro ao remover', variant: 'destructive' });
        }
    };

    const handleToggleShadow = async (id: string, currentStatus: boolean) => {
        try {
            const success = await markAsShadow(id, !currentStatus);
            if (success) {
                setTransactions(transactions.map(t =>
                    t.id === id ? { ...t, is_shadow: !currentStatus } : t
                ));
            }
        } catch (error) {
            toast({ title: 'Erro ao atualizar', variant: 'destructive' });
        }
    };

    const parseCsvAmount = (value: string) => {
        const cleaned = value.replace(/[^0-9,.-]/g, '');
        const normalized = cleaned.includes(',')
            ? cleaned.replace(/\./g, '').replace(',', '.')
            : cleaned;
        const parsed = Number(normalized);
        return Number.isFinite(parsed) ? parsed : 0;
    };

    const parseCsvDate = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return '';
        if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
            const [day, month, year] = trimmed.split('/');
            return `${year}-${month}-${day}`;
        }
        if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
            const [day, month, year] = trimmed.split('-');
            return `${year}-${month}-${day}`;
        }
        return '';
    };

    const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setImporting(true);

        try {
            const text = await file.text();
            const lines = text
                .split(/\r?\n/)
                .map((line) => line.trim())
                .filter(Boolean);

            if (lines.length === 0) {
                toast({ title: 'Arquivo vazio', variant: 'destructive' });
                return;
            }

            const firstLine = lines[0];
            const delimiter =
                firstLine.includes(';') && firstLine.split(';').length >= firstLine.split(',').length
                    ? ';'
                    : ',';
            let startIndex = 0;
            const header = firstLine.toLowerCase();
            if (header.includes('data') || header.includes('date')) {
                startIndex = 1;
            }

            const rows = [];
            for (let i = startIndex; i < lines.length; i += 1) {
                const columns = lines[i]
                    .split(delimiter)
                    .map((value) => value.replace(/^"|"$/g, '').trim());
                if (columns.length < 3) continue;

                const date = parseCsvDate(columns[0]);
                const description = columns[1] || '';
                const amountRaw = parseCsvAmount(columns[2]);
                const category = columns[3] || undefined;

                if (!date || !description || !amountRaw) continue;
                if (importOnlyExpenses && amountRaw > 0) continue;

                rows.push({
                    date,
                    description,
                    amount: Math.abs(amountRaw),
                    category,
                    is_shadow: false,
                    status: 'uncategorized',
                    source: 'import',
                });
            }

            if (rows.length === 0) {
                toast({ title: 'Nenhuma transacao valida encontrada', variant: 'destructive' });
                return;
            }

            const created = await bulkCreate(rows);
            if (created.length === 0) {
                toast({ title: 'Nao foi possivel importar', variant: 'destructive' });
                return;
            }

            toast({ title: 'Transacoes importadas!' });
            await loadData();
        } catch (error) {
            console.error('Erro ao importar CSV', error);
            toast({ title: 'Erro ao importar CSV', variant: 'destructive' });
        } finally {
            setImporting(false);
            event.target.value = '';
        }
    };

    const stats = useMemo(() => {
        const total = transactions.reduce((acc, t) => acc + Number(t.amount), 0);
        const shadowCount = transactions.filter(t => t.is_shadow).length;
        const shadowTotal = transactions.filter(t => t.is_shadow).reduce((acc, t) => acc + Number(t.amount), 0);
        return { total, shadowCount, shadowTotal };
    }, [transactions]);

    const handleComplete = () => {
        // Save summary stats to completion payload
        onComplete({
            total_transactions: transactions.length,
            total_value: stats.total,
            shadow_expenses_count: stats.shadowCount,
            shadow_expenses_value: stats.shadowTotal,
            top_expense: topExpenses[0]?.description || ''
        });
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="glass-card p-4 space-y-3">
                <div>
                    <h3 className="font-semibold">Importar extrato (CSV simples)</h3>
                    <p className="text-xs text-muted-foreground">
                        Colunas esperadas: data, descricao, valor, categoria (opcional).
                    </p>
                </div>
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <Input
                        type="file"
                        accept=".csv,text/csv"
                        onChange={handleImportFile}
                        className="md:max-w-xs"
                    />
                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Switch
                            checked={importOnlyExpenses}
                            onCheckedChange={(value) => setImportOnlyExpenses(Boolean(value))}
                        />
                        Importar apenas saidas
                    </label>
                </div>
                {importing && (
                    <p className="text-xs text-muted-foreground">Importando...</p>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-card/50 border-primary/10">
                    <CardContent className="pt-6">
                        <div className="text-sm font-medium text-muted-foreground">Total Mapeado</div>
                        <div className="text-2xl font-bold text-primary">{formatCurrency(stats.total)}</div>
                        <p className="text-xs text-muted-foreground">{transactions.length} transacoes</p>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 border-warning/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <AlertTriangle className="h-4 w-4 text-warning" />
                            Gastos Sombra
                        </div>
                        <div className="text-2xl font-bold text-warning">{formatCurrency(stats.shadowTotal)}</div>
                        <p className="text-xs text-muted-foreground">{stats.shadowCount} itens identificados</p>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 border-primary/10">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <TrendingDown className="h-4 w-4 text-green-500" />
                            Maior Ofensor
                        </div>
                        <div className="text-lg font-bold truncate" title={topExpenses[0]?.description}>
                            {topExpenses[0] ? topExpenses[0].description : '-'}
                        </div>
                        <div className="text-sm font-medium text-muted-foreground">
                            {topExpenses[0] ? formatCurrency(topExpenses[0].amount) : 'R$ 0,00'}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="glass-card p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Arqueologia Financeira</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Ultimos 90 dias
                    </span>
                </div>

                <div className="flex flex-col md:flex-row gap-3 items-end bg-surface/50 p-3 rounded-lg border border-border/50">
                    <div className="w-full md:w-32">
                        <span className="text-xs text-muted-foreground mb-1 block">Data</span>
                        <Input
                            type="date"
                            value={newDate}
                            onChange={e => setNewDate(e.target.value)}
                            className="h-9 bg-background"
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <span className="text-xs text-muted-foreground mb-1 block">Descricao do gasto</span>
                        <Input
                            placeholder="Ex: Uber, Ifood, Tarifa"
                            value={newDesc}
                            onChange={e => setNewDesc(e.target.value)}
                            className="h-9 bg-background"
                        />
                    </div>
                    <div className="w-full md:w-32">
                        <span className="text-xs text-muted-foreground mb-1 block">Valor (R$)</span>
                        <Input
                            placeholder="0,00"
                            value={newValue}
                            type="number"
                            step="0.01"
                            onChange={e => setNewValue(e.target.value)}
                            className="h-9 bg-background"
                        />
                    </div>
                    <div className="w-full md:w-40">
                        <span className="text-xs text-muted-foreground mb-1 block">Categoria</span>
                        <Select value={newCat} onValueChange={setNewCat}>
                            <SelectTrigger className="h-9 bg-background">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        onClick={handleAdd}
                        disabled={adding}
                        size="sm"
                        className="w-full md:w-auto h-9"
                    >
                        {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        <span className="ml-2 md:hidden">Adicionar</span>
                    </Button>
                </div>

                <div className="rounded-md border border-border/50 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-surface/50">
                            <TableRow>
                                <TableHead className="w-[100px]">Data</TableHead>
                                <TableHead>Descricao</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead className="text-right">Valor</TableHead>
                                <TableHead className="text-center w-[100px]">Sombra?</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        Nenhuma transacao registrada. Comece adicionando acima.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((t) => (
                                    <TableRow key={t.id} className={cn(t.is_shadow && "bg-warning/5")}>
                                        <TableCell className="text-xs">
                                            {new Date(t.date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="font-medium">{t.description}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{t.category}</TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatCurrency(Number(t.amount))}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Switch
                                                checked={t.is_shadow || false}
                                                onCheckedChange={() => handleToggleShadow(t.id, t.is_shadow || false)}
                                                className="data-[state=checked]:bg-warning"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                onClick={() => handleDelete(t.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="sticky bottom-0 bg-background/80 backdrop-blur pb-4 pt-2 border-t border-border/50">
                <Button onClick={handleComplete} className="w-full btn-fire" size="lg">
                    {submitLabel || 'Concluir Analise da Arqueologia'}
                </Button>
            </div>
        </div>
    );
}
