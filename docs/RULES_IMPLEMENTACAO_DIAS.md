# RULES: Guia de Implementação dos Dias do Desafio FIRE 15D

Este documento é o guia definitivo para implementar qualquer dia do desafio FIRE 15 Dias. Siga estas regras rigorosamente.

---

## 📚 DOCUMENTOS OBRIGATÓRIOS DE CONTEXTO

Antes de implementar qualquer dia, você DEVE ler e entender:

| Documento | Caminho | O que buscar |
|-----------|---------|--------------|
| **Especificação do Dia** | `docs/app_fire_reescrito.md` | Procure por `## **DIA {N}` para encontrar a especificação completa |
| **Template de Relatório** | `docs/REPORT_TEMPLATE.md` | Estrutura padrão para criar `Day{N}Report.tsx` |
| **Configuração de Dias** | `src/config/dayEngine.ts` | Ver `outputMetrics` e `inputs` do dia |
| **Análise do Dia** | `src/lib/dayAnalysis.ts` | Ver função `generateDay{N}Analysis()` |
| **Componente de Tarefa** | `src/components/day/Day{N}*.tsx` | Componente de entrada de dados |

---

## 🔧 FERRAMENTAS E MCPs

### MCPs Disponíveis

| MCP | Quando usar |
|-----|-------------|
| `@supabase` | Criar migrations, consultar schema, gerar types |
| `@context7` | Buscar documentação de bibliotecas (React, Recharts, etc) |
| `@shadcn` | Adicionar componentes UI (se necessário) |

### Comandos Essenciais

```bash
# Verificar build
npm run build

# Gerar types do Supabase
npx supabase gen types typescript --project-id PROJECT_ID > src/integrations/supabase/types.ts

# Rodar dev
npm run dev
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO POR DIA

### Fase 1: Análise (OBRIGATÓRIO)

- [ ] Ler a especificação do dia em `docs/app_fire_reescrito.md`
- [ ] Identificar as seções:
  - **Mensagem Matinal**: Texto motivacional
  - **Conceito FIRE do Dia**: Explicação teórica
  - **Tarefa Prática**: O que o usuário vai fazer
  - **Outputs do App**: O que deve aparecer no relatório
  - **Infraestrutura**: Tabelas, regras de negócio, endpoints
- [ ] Verificar se há tabelas novas a criar
- [ ] Verificar se há integração com dados de dias anteriores

### Fase 2: Database (se necessário)

- [ ] Criar migration em `supabase/migrations/YYYYMMDDHHMMSS_day{N}_tables.sql`
- [ ] Incluir:
  - CREATE TABLE com constraints
  - RLS policies (Row Level Security)
  - Triggers de `updated_at`
  - Indexes para performance
- [ ] Aplicar migration via MCP Supabase
- [ ] Regenerar types do Supabase

### Fase 3: Componente de Tarefa

- [ ] Verificar se o dia usa componente customizado ou formulário genérico
- [ ] Se customizado, criar/editar `src/components/day/Day{N}*.tsx`
- [ ] Estrutura recomendada:
  ```
  1. Intro/Welcome step
  2. Steps de entrada de dados
  3. Step de resumo/confirmação
  4. Animação de celebração
  ```
- [ ] Integrar com `DayTaskTab.tsx` (adicionar case no switch)

### Fase 4: Backend

- [ ] Atualizar `src/services/dayEngine.ts`:
  - Adicionar case no `calculateOutputMetrics()`
  - Adicionar lógica de salvamento no `completeDay()`
- [ ] Atualizar `src/lib/dayAnalysis.ts`:
  - Criar função `generateDay{N}Analysis()`
  - Adicionar case no switch principal

### Fase 5: Relatório de Conclusão

- [ ] Criar `src/components/day/reports/Day{N}Report.tsx`
- [ ] Seguir estrutura do template em `docs/REPORT_TEMPLATE.md`
- [ ] Incluir todas as seções definidas em "Outputs do App"
- [ ] Registrar no `ReportRenderer.tsx`

### Fase 6: PDF (opcional)

- [ ] Atualizar `src/lib/printReport.tsx` se necessário
- [ ] Criar layout específico para o dia

### Fase 7: Verificação

- [ ] Rodar `npm run build` - deve passar sem erros
- [ ] Testar o fluxo completo no navegador
- [ ] Verificar se o relatório exibe todos os dados
- [ ] Verificar se o botão de imprimir funciona

---

## 🏗️ ESTRUTURA DE ARQUIVOS

```
src/
├── components/day/
│   ├── Day{N}*.tsx           # Componente de tarefa customizado
│   ├── DayTaskTab.tsx        # Switch que renderiza o componente certo
│   ├── DayCompletedTab.tsx   # Renderiza relatório de conclusão
│   └── reports/
│       ├── Day{N}Report.tsx  # Relatório visual customizado
│       ├── ReportRenderer.tsx # Orquestrador de relatórios
│       └── index.ts
├── config/
│   └── dayEngine.ts          # Configuração de inputs/outputs por dia
├── services/
│   └── dayEngine.ts          # Lógica de cálculo e salvamento
├── lib/
│   ├── dayAnalysis.ts        # Geração de análise textual
│   └── printReport.tsx       # Geração de PDF
└── hooks/
    └── use{Feature}.ts       # Hooks customizados se necessário

supabase/
└── migrations/
    └── YYYYMMDDHHMMSS_day{N}_*.sql
```

---

## 🎨 PADRÕES DE UI/UX

### Classes CSS Obrigatórias

```tsx
// Cards
<Card className="glass-card border-primary/10">

// Botões principais
<Button className="btn-fire">

// Containers com animação
<div className="animate-in fade-in duration-500">

// Backgrounds de seção
className="bg-surface/50 border border-border/30"
```

### Cores Semânticas

```
🟢 Sucesso: text-green-500, bg-green-500/20
🔴 Erro/Crítico: text-red-500, bg-red-500/20
🟡 Atenção: text-yellow-500, bg-yellow-500/20
🔵 Primário: text-primary, bg-primary/20
```

### Ícones

- Usar emojis para ícones em cards (mais compatível com PDF)
- Usar Lucide icons para botões e elementos interativos

---

## ⚠️ REGRAS CRÍTICAS

1. **NUNCA hardcode valores** - sempre extraia do `formData`
2. **SEMPRE verifique undefined** - use fallbacks (`|| '-'`, `|| 0`)
3. **SEMPRE formate valores monetários** - use `formatCurrency()`
4. **SEMPRE teste o build** antes de declarar conclusão
5. **SEMPRE documente** as alterações no `task.md`

---

## 🔄 FLUXO DE DADOS ENTRE DIAS

```
Dia 1 → monthly_income → Dia 2 (pré-preenche renda)
Dia 2 → financial_snapshot → Dia 9 (orçamento mínimo)
Dia 5 → card_policy → Dia 13 (regras de cartão)
Dia 10/11/12 → debts + agreements → Dia 14 (plano 30/90)
Todos → progress.daysProgress → Dia 15 (formatura)
```

Sempre verifique em `docs/app_fire_reescrito.md` a seção "Fluxo de Integração com Dias Futuros" do dia que está implementando.

---

## 📊 EXEMPLO: IMPLEMENTAR DIA N

```
1. Ler `docs/app_fire_reescrito.md` seção "DIA N"
2. Identificar tabelas necessárias
3. Criar migration se necessário
4. Criar/editar componente de tarefa
5. Atualizar dayEngine.ts e dayAnalysis.ts
6. Criar Day{N}Report.tsx
7. Registrar no ReportRenderer.tsx
8. Testar e verificar build
```

---

## 🆘 TROUBLESHOOTING

| Problema | Solução |
|----------|---------|
| Métricas não aparecem | Verificar `calculateOutputMetrics()` em `dayEngine.ts` |
| Relatório não customizado | Verificar se `ReportRenderer.tsx` tem o case do dia |
| Erro de tipo Supabase | Regenerar types com `npx supabase gen types` |
| Build falha | Verificar imports e exports em `index.ts` |
| formData vazio | Verificar se `DayModal.tsx` está passando `defaultValues` |

---

**Última atualização:** Janeiro 2026
