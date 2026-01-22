import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Edit, CheckCircle2, TrendingUp, TrendingDown, AlertTriangle, Wallet, CreditCard, BarChart3 } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import AiAnalysisCard from '@/components/day/AiAnalysisCard';
import { AiDayReportPayload } from '@/lib/aiDayReport';
import {
    PieChart, Pie, Cell, BarChart, Bar,
    XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface Day2ReportProps {
    formData: Record<string, unknown>;
    completedAt: string;
    onPrint: () => void;
    onEdit: () => void;
    aiReport: AiDayReportPayload | null;
}

const COLORS = {
    income: '#10b981',
    fixed: '#3b82f6',
    variable: '#f97316',
    debts: '#ef4444',
    positive: '#10b981',
    negative: '#ef4444',
    warning: '#f59e0b',
};

export default function Day2Report({
    formData,
    completedAt,
    onPrint,
    onEdit,
    aiReport,
}: Day2ReportProps) {
    // Extrair dados do formData
    const totalIncome = Number(formData.totalIncome) || 0;
    const totalFixed = Number(formData.totalFixed) || 0;
    const totalVariable = Number(formData.totalVariable) || 0;
    const totalDebtsMin = Number(formData.totalDebtsMin) || 0;
    const totalExpenses = totalFixed + totalVariable + totalDebtsMin;
    const balance = Number(formData.balance) || (totalIncome - totalExpenses);
    const incomeCount = Number(formData.incomeCount) || 0;
    const expenseCount = Number(formData.expenseCount) || 0;
    const debtCount = Number(formData.debtCount) || 0;
    const emotionalNote = String(formData.emotionalNote || '');
    const totalDebtAmount = Number(formData.totalDebtAmount) || 0;

    // Dados para gráfico de pizza
    const pieData = useMemo(() => [
        { name: 'Fixos', value: totalFixed, color: COLORS.fixed },
        { name: 'Variáveis', value: totalVariable, color: COLORS.variable },
        { name: 'Dívidas', value: totalDebtsMin, color: COLORS.debts },
    ].filter(d => d.value > 0), [totalFixed, totalVariable, totalDebtsMin]);

    // Dados para gráfico de barras
    const barData = useMemo(() => [
        { name: 'Entradas', value: totalIncome, fill: COLORS.income },
        { name: 'Saídas', value: totalExpenses, fill: COLORS.debts },
    ], [totalIncome, totalExpenses]);

    // Status do balanço
    const balanceStatus = useMemo(() => {
        if (balance > 0) {
            const percentage = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;
            if (percentage >= 20) return { type: 'positive', label: 'Saudável', icon: '✅' };
            return { type: 'warning', label: 'Margem', icon: '⚠️' };
        }
        return { type: 'negative', label: 'Déficit', icon: '🚨' };
    }, [balance, totalIncome]);

    // Alertas inteligentes
    const alerts = useMemo(() => {
        const list: { type: 'warning' | 'success' | 'error'; message: string }[] = [];

        if (balance < 0) {
            list.push({
                type: 'error',
                message: `Suas saídas são maiores que suas entradas em ${formatCurrency(Math.abs(balance))}. Nos próximos dias, vamos trabalhar para reverter isso.`
            });
        }

        if (totalDebtAmount > 0) {
            list.push({
                type: 'warning',
                message: `Você tem ${formatCurrency(totalDebtAmount)} em dívidas. Priorize renegociar no Dia 10.`
            });
        }

        if (balance > 0 && totalIncome > 0 && (balance / totalIncome) >= 0.2) {
            list.push({
                type: 'success',
                message: `Você tem sobra de ${formatCurrency(balance)}! Vamos proteger e fazer esse dinheiro trabalhar para você.`
            });
        }

        return list;
    }, [balance, totalDebtAmount, totalIncome]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header de Sucesso */}
            <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-3">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-green-500">Raio-X Concluído!</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Mapeado em {new Date(completedAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                    })}
                </p>
            </div>

            <Card className="glass-card border-amber-400/50 bg-amber-500/15 shadow-lg shadow-amber-500/10">
                <CardContent className="pt-5 text-sm text-amber-50 leading-relaxed">
                    <p className="text-base font-semibold text-amber-100 mb-2">
                        Antes de olhar os números, respire. Isso aqui é sobre coragem.
                    </p>
                    <p>
                        Você deu um passo extremamente importante e foi corajoso em fazer isso. Fique tranquilo:
                        sua situação atual é reversível e vamos construir um plano claro para mudar nos próximos dias.
                    </p>
                </CardContent>
            </Card>

            {aiReport && (
                <AiAnalysisCard report={aiReport} title="Analise do Dia" />
            )}

            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Visão geral
            </p>

            {/* Card de Visão Geral */}
            <Card className="glass-card border-primary/10 overflow-hidden">
                <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-transparent">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-primary" />
                        Visão Geral do Mês
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    {/* Entradas */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-500" />
                            <span className="text-sm">Entradas Mensais</span>
                        </div>
                        <span className="font-bold text-lg text-green-500">
                            {formatCurrency(totalIncome)}
                        </span>
                    </div>

                    {/* Saídas Fixas */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <div className="flex items-center gap-2">
                            <span className="text-blue-500">📤</span>
                            <span className="text-sm">Saídas Fixas</span>
                        </div>
                        <span className="font-bold text-lg text-blue-500">
                            -{formatCurrency(totalFixed)}
                        </span>
                    </div>

                    {/* Saídas Variáveis */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                        <div className="flex items-center gap-2">
                            <span className="text-orange-500">📊</span>
                            <span className="text-sm">Saídas Variáveis</span>
                        </div>
                        <span className="font-bold text-lg text-orange-500">
                            -{formatCurrency(totalVariable)}
                        </span>
                    </div>

                    {/* Parcelas de Dívidas */}
                    {totalDebtsMin > 0 && (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-red-500" />
                                <span className="text-sm">Parcelas de Dívidas</span>
                            </div>
                            <span className="font-bold text-lg text-red-500">
                                -{formatCurrency(totalDebtsMin)}
                            </span>
                        </div>
                    )}

                    {/* Linha divisória */}
                    <div className="border-t border-border/50 my-2" />

                    {/* Balanço */}
                    <div className={cn(
                        "flex items-center justify-between p-4 rounded-lg",
                        balance >= 0 ? "bg-green-500/20 border border-green-500/30" : "bg-red-500/20 border border-red-500/30"
                    )}>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{balanceStatus.icon}</span>
                            <div>
                                <span className="text-sm font-medium">Sobra/Falta</span>
                                <p className="text-xs text-muted-foreground">{balanceStatus.label}</p>
                            </div>
                        </div>
                        <span className={cn(
                            "font-bold text-2xl",
                            balance >= 0 ? "text-green-500" : "text-red-500"
                        )}>
                            {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Gráfico de Pizza */}
                {pieData.length > 0 && (
                    <Card className="glass-card border-primary/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                📊 Distribuição de Gastos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={70}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: number) => formatCurrency(value)}
                                        />
                                        <Legend
                                            verticalAlign="bottom"
                                            height={36}
                                            formatter={(value) => <span className="text-xs">{value}</span>}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Gráfico de Barras */}
                <Card className="glass-card border-primary/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Entradas vs Saídas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} layout="vertical">
                                    <XAxis type="number" hide />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        width={60}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => formatCurrency(value)}
                                        cursor={{ fill: 'transparent' }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        radius={[0, 4, 4, 0]}
                                        barSize={30}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Resumo de Contagens */}
            <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-surface/50 border border-border/30 text-center">
                    <p className="text-2xl font-bold text-primary">{incomeCount}</p>
                    <p className="text-xs text-muted-foreground">Fontes de Renda</p>
                </div>
                <div className="p-3 rounded-lg bg-surface/50 border border-border/30 text-center">
                    <p className="text-2xl font-bold text-blue-500">{expenseCount}</p>
                    <p className="text-xs text-muted-foreground">Despesas Fixas</p>
                </div>
                <div className="p-3 rounded-lg bg-surface/50 border border-border/30 text-center">
                    <p className="text-2xl font-bold text-red-500">{debtCount}</p>
                    <p className="text-xs text-muted-foreground">Dívidas</p>
                </div>
            </div>

            {/* Alertas Inteligentes */}
            {alerts.length > 0 && (
                <Card className="glass-card border-primary/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            Alertas e Insights
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {alerts.map((alert, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "p-3 rounded-lg text-sm",
                                    alert.type === 'error' && "bg-red-500/10 border border-red-500/20 text-red-400",
                                    alert.type === 'warning' && "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400",
                                    alert.type === 'success' && "bg-green-500/10 border border-green-500/20 text-green-400"
                                )}
                            >
                                {alert.message}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Reflexão Emocional */}
            {emotionalNote && (
                <Card className="glass-card border-primary/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            💭 Sua Reflexão
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground italic">"{emotionalNote}"</p>
                    </CardContent>
                </Card>
            )}

            {/* Dívida Total */}
            {totalDebtAmount > 0 && (
                <Card className="glass-card border-red-500/20 bg-red-500/5">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-red-500" />
                                <span className="text-sm">Total de Dívidas Acumuladas</span>
                            </div>
                            <span className="font-bold text-lg text-red-500">
                                {formatCurrency(totalDebtAmount)}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={onPrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Baixar Relatório PDF
                </Button>
                <Button variant="secondary" className="flex-1" onClick={onEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar Dados
                </Button>
            </div>
        </div>
    );
}
