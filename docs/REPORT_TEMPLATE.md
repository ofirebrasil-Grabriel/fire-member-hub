# Template: Implementação de Relatório por Dia

Este documento serve como guia para implementar o relatório de "Desafio Concluído" para cada dia do desafio FIRE 15 Dias.

---

## Estrutura de Arquivos

```
src/components/day/reports/
├── Day{N}Report.tsx       # Componente de relatório do dia N
├── ReportRenderer.tsx     # Orquestrador (renderiza o componente correto)
└── index.ts               # Exports
```

---

## Passos para Implementar um Novo Dia

### 1. Consultar a Especificação

Abra `docs/app_fire_reescrito.md` e localize a seção do dia correspondente:
- Procure por `#### **Outputs do App (Documentos Gerados)**`
- Liste todos os itens que devem aparecer no relatório

### 2. Criar o Componente de Relatório

Crie o arquivo `src/components/day/reports/Day{N}Report.tsx`:

```tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Edit, CheckCircle2 } from 'lucide-react';

interface Day{N}ReportProps {
    formData: Record<string, unknown>;
    completedAt: string;
    onPrint: () => void;
    onEdit: () => void;
}

export default function Day{N}Report({
    formData,
    completedAt,
    onPrint,
    onEdit,
}: Day{N}ReportProps) {
    // Extrair dados do formData
    const exemplo = formData.campo_exemplo as string;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header de Sucesso */}
            <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-3">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-green-500">Desafio Concluído!</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Concluído em {new Date(completedAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                    })}
                </p>
            </div>

            {/* SEÇÃO ESPECÍFICA DO DIA */}
            <Card className="glass-card border-primary/10">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        📋 Título da Seção
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Conteúdo específico aqui */}
                </CardContent>
            </Card>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={onPrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir Relatório
                </Button>
                <Button variant="secondary" className="flex-1" onClick={onEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar Tarefa
                </Button>
            </div>
        </div>
    );
}
```

### 3. Registrar no ReportRenderer

Edite `src/components/day/reports/ReportRenderer.tsx`:

```tsx
import Day{N}Report from './Day{N}Report';

// Dentro do switch:
case {N}:
    return <Day{N}Report {...props} />;
```

### 4. Criar Gerador de PDF (Opcional)

Se o dia precisar de PDF personalizado, adicione em `src/lib/printReport.tsx`:

```tsx
export async function generateDay{N}Report(data: ReportData): Promise<void> {
    // Layout específico do dia
}
```

### 5. Testar

1. Complete o dia normalmente
2. Feche e reabra o modal
3. Verifique se todas as seções aparecem
4. Teste o botão de imprimir

---

## Checklist por Dia

| Dia | Seções Obrigatórias |
|-----|---------------------|
| 1 | Questionário, Termômetro, Compromisso |
| 2 | Balanço Financeiro, Gráficos |
| 3 | Análise de Gatilhos, Percentuais |
| 4 | Regras Definidas, Limites |
| 5 | Controle de Cartão, Teto |
| 6 | Vazamentos Cortados, Economia |
| 7 | Calendário de Vencimentos |
| 8 | Prioridades Definidas |
| 9 | Orçamento Mínimo Calculado |
| 10 | Mapa de Negociação |
| 11 | Scripts Preparados |
| 12 | Acordos Fechados, Economia |
| 13 | Regras de Vida Ativas |
| 14 | Plano 30/90, Checkpoints |
| 15 | Certificado, Evolução Termômetro |

---

## Boas Práticas

1. **Sempre extrair dados do formData** - não hardcode valores
2. **Usar emojis para ícones** - mais compatível com PDF
3. **Manter consistência visual** - use as classes `glass-card`, `border-primary/10`
4. **Formatar valores** - use `formatCurrency()` para dinheiro
5. **Tratar valores undefined** - sempre use fallbacks (`|| '-'`)
