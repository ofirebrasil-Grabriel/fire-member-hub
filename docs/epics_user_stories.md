# Epic & User Stories - FIRE Brasil 15D

> Documento de planejamento ágil para implementação completa do Desafio FIRE 15 Dias.

## 📊 Resumo de Implementação (Atualizado: 15/01/2026)

| Epic | Status | User Stories | Implementadas | Parciais | Pendentes |
|------|--------|--------------|---------------|----------|-----------|
| **1. Infraestrutura Base** | ✅ Completo | 6 | 6 | 0 | 0 |
| **2. Sistema de Progresso** | 🟡 Em Progresso | 4 | 1 | 3 | 0 |
| **3. Fase Dossiê (Dias 1-4)** | 🟡 Em Progresso | 14 | 3 | 3 | 8 |
| **4. Fase Contenção (Dias 5-9)** | ⚪ Não Iniciado | 15 | 0 | 0 | 15 |
| **5. Fase Acordos (Dias 10-12)** | ⚪ Não Iniciado | 10 | 0 | 0 | 10 |
| **6. Fase Motor (Dias 13-15)** | ⚪ Não Iniciado | 10 | 0 | 0 | 10 |
| **7. Geração de PDFs** | ⚪ Não Iniciado | 4 | 0 | 0 | 4 |
| **8. Notificações** | ⚪ Não Iniciado | 3 | 0 | 0 | 3 |

**Progresso Geral**: ~16% concluído (10 de 66 US implementadas)

### ✅ Componentes/Tabelas Verificados:
- **18 tabelas** no Supabase (incluindo plan_essentials, plan_debt_priorities, plan_levers, plan_checkpoints)
- **23 hooks React** em `src/hooks/`
- **8 componentes Day*** em `src/components/`

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Epic 1: Infraestrutura Base](#epic-1-infraestrutura-base)
3. [Epic 2: Sistema de Progresso](#epic-2-sistema-de-progresso)
4. [Epic 3: Fase Dossiê (Dias 1-4)](#epic-3-fase-dossiê-dias-1-4)
5. [Epic 4: Fase Contenção (Dias 5-9)](#epic-4-fase-contenção-dias-5-9)
6. [Epic 5: Fase Acordos (Dias 10-12)](#epic-5-fase-acordos-dias-10-12)
7. [Epic 6: Fase Motor (Dias 13-15)](#epic-6-fase-motor-dias-13-15)
8. [Epic 7: Geração de Relatórios e PDFs](#epic-7-geração-de-relatórios-e-pdfs)
9. [Epic 8: Notificações e Lembretes](#epic-8-notificações-e-lembretes)
10. [Critérios de Aceitação Globais](#critérios-de-aceitação-globais)
11. [Definição de Pronto (DoD)](#definição-de-pronto-dod)

---

## Visão Geral

### Objetivo do Produto
Plataforma de educação financeira gamificada que guia usuários através de 15 dias de transformação financeira, com tarefas práticas, formulários interativos, geração de relatórios e acompanhamento de progresso.

### Personas

**Participante (Usuário)**
- Pessoa em situação de desorganização financeira
- Busca clareza sobre suas finanças
- Quer sair do ciclo de dívidas
- Precisa de guia passo a passo

**Administrador**
- Equipe FIRE Brasil
- Gerencia conteúdo dos dias
- Monitora progresso dos participantes
- Ajusta materiais e recursos

### Regras Globais

1. **Cada dia deve conter**:
   - Mensagem matinal motivacional
   - Conceito FIRE do dia
   - Tarefas práticas com checklist
   - Frase motivadora ao concluir
   - Elemento de recompensa (badge/medalha)
   - Botão para gerar PDF do resumo

2. **Progressão linear**: Usuário só acessa Dia N+1 após concluir Dia N

3. **Termômetro "Respirar"**: Presente em todos os dias (0-10 + justificativa)

4. **Sincronização**: Todo progresso salvo no Supabase em tempo real

---

## Epic 1: Infraestrutura Base

### Descrição
Preparar a base de dados, autenticação e estrutura de arquivos para suportar todas as funcionalidades do desafio.

### User Stories

---

#### US-1.1: Criar tabela de progresso por dia

**Como** desenvolvedor  
**Quero** uma tabela `day_progress` no banco de dados  
**Para que** o progresso de cada usuário em cada dia seja armazenado de forma persistente

**Critérios de Aceitação**:
- [x] Tabela criada com campos: `id`, `user_id`, `day_id`, `completed`, `completed_at`, `completed_tasks`, `form_data`, `mood`, `diary_entry`, `pdf_url`, `reward_claimed`
- [x] RLS habilitado: usuário só vê/edita seu próprio progresso
- [x] Constraint UNIQUE em (user_id, day_id)
- [x] Índice em user_id para performance

**Status**: ✅ IMPLEMENTADO

---

#### US-1.2: Adicionar campos de motivação à tabela days

**Como** administrador  
**Quero** campos `motivation_phrase`, `reward_label` e `reward_icon` na tabela `days`  
**Para que** cada dia tenha frase motivadora e recompensa configuráveis

**Critérios de Aceitação**:
- [x] Migração SQL executada sem erros
- [ ] Campos editáveis no Admin Editor
- [ ] Validação: campos não podem ser vazios

**Status**: ⏳ PARCIALMENTE IMPLEMENTADO (colunas existem, falta Admin Editor)

---

#### US-1.3: Criar tabelas financeiras base

**Como** desenvolvedor  
**Quero** tabelas para entradas, saídas fixas, saídas variáveis e transações  
**Para que** os dados financeiros do usuário sejam armazenados de forma estruturada

**Critérios de Aceitação**:
- [x] Tabela `income_items`: source, amount, received_on, recurrence
- [x] Tabela `fixed_expenses`: name, category, amount, due_date, payment_method, priority
- [x] Tabela `variable_expenses`: name, category, amount, spent_on, is_essential
- [x] Tabela `transactions`: date, description, amount, category, is_shadow, status
- [x] RLS em todas as tabelas
- [x] Índices em user_id

**Status**: ✅ IMPLEMENTADO

---

#### US-1.4: Criar tabelas de negociação

**Como** desenvolvedor  
**Quero** tabelas para planos de negociação, sessões e acordos  
**Para que** o fluxo de renegociação de dívidas seja rastreado

**Critérios de Aceitação**:
- [x] Tabela `negotiation_plans`: debt_id, objective, max_monthly_payment, priority, contact_info, scripts, scheduled_at
- [x] Tabela `negotiation_sessions`: negotiation_plan_id, scheduled_at, status, notes, proposed_value
- [x] Tabela `agreements`: debt_id, total_amount, monthly_payment, interest_rate, installments, start_date, contract_path
- [x] Relacionamentos corretos com `debts`

**Status**: ✅ IMPLEMENTADO

---

#### US-1.5: Criar tabelas de planejamento e regras

**Como** desenvolvedor  
**Quero** tabelas para planos 30/90, caixinha de emergência, protocolo semanal e regras de decisão  
**Para que** as funcionalidades dos Dias 13-15 sejam suportadas

**Critérios de Aceitação**:
- [x] Tabela `plans`: cycle_type, mode, start_date, status
- [x] Tabela `plan_essentials`: plan_id, name, due_date, minimum_amount
- [x] Tabela `plan_debt_priorities`: plan_id, debt_id, action_type
- [x] Tabela `plan_levers`: plan_id, type, goal_text, weekly_action, success_criteria
- [x] Tabela `emergency_fund`: account_info, monthly_contribution, goal_amount, current_balance
- [x] Tabela `weekly_protocol`: day_of_week, time, checklist, active
- [x] Tabela `decision_rules`: primary_trigger, default_action, levels (JSON)
- [x] Tabela `progress_dashboard`: indicators (JSON), commitment_phrase

**Status**: ✅ IMPLEMENTADO (todas as tabelas criadas com RLS)

---

#### US-1.6: Criar hooks CRUD para todas as tabelas

**Como** desenvolvedor frontend  
**Quero** hooks React para cada tabela do banco  
**Para que** eu possa fazer operações CRUD de forma padronizada

**Critérios de Aceitação**:
- [x] Hook para cada tabela com funções: fetchAll, create, update, remove
- [x] Tratamento de erros com console.error
- [ ] Loading states (pendente)
- [x] Tipagem TypeScript completa

**Hooks necessários**:
- [x] `useIncomeItems`
- [x] `useFixedExpenses`
- [x] `useVariableExpenses`
- [x] `useTransactions`
- [x] `useShadowExpenses`
- [x] `useNegotiationPlans`
- [ ] `useNegotiationSessions` (pendente)
- [x] `useAgreements`
- [x] `usePlans`
- [x] `useEmergencyFund`
- [x] `useWeeklyProtocol`
- [x] `useDecisionRules`
- [x] `useProgressDashboard`
- [x] `useDayProgress`

**Status**: ✅ IMPLEMENTADO (13 de 14 hooks criados)

---

## Epic 2: Sistema de Progresso

### Descrição
Implementar sistema de rastreamento de progresso com persistência no Supabase, substituindo o localStorage.

### User Stories

---

#### US-2.1: Migrar UserProgressContext para Supabase

**Como** usuário  
**Quero** que meu progresso seja salvo na nuvem  
**Para que** eu possa acessar de qualquer dispositivo e não perder dados

**Critérios de Aceitação**:
- [x] Contexto refatorado para ler/escrever em `day_progress`
- [ ] Sincronização em tempo real (subscriptions)
- [ ] Fallback para localStorage se offline
- [ ] Migração de dados existentes no localStorage para Supabase ao fazer login

**Status**: ⏳ PARCIALMENTE IMPLEMENTADO (contexto integrado com Supabase, falta real-time)

---

#### US-2.2: Implementar bloqueio de progressão

**Como** sistema  
**Quero** impedir que usuário acesse Dia N+1 sem concluir Dia N  
**Para que** a metodologia seja seguida corretamente

**Critérios de Aceitação**:
- [x] Função `canAccessDay(dayId)` verifica se dia anterior está completo
- [ ] Modal de aviso se tentar acessar dia bloqueado
- [x] Visual de cadeado nos cards bloqueados
- [ ] Administrador pode desbloquear qualquer dia

**Status**: ⏳ PARCIALMENTE IMPLEMENTADO (função e visual existem)

---

#### US-2.3: Exibir progresso visual na trilha

**Como** usuário  
**Quero** ver claramente quais dias completei, qual é o atual e quais estão bloqueados  
**Para que** eu tenha noção do meu avanço

**Critérios de Aceitação**:
- [ ] Cards com estados visuais distintos: completed (verde), current (laranja), available (neutro), locked (cinza)
- [ ] Barra de progresso geral (X de 15 dias)
- [ ] Porcentagem de conclusão no header
- [ ] Animação ao completar dia

**Estimativa**: 3 pontos

---

#### US-2.5: Sistema de recompensas

**Como** usuário  
**Quero** receber uma recompensa visual ao concluir cada dia  
**Para que** eu me sinta motivado a continuar

**Critérios de Aceitação**:
- [x] Modal de celebração ao completar dia
- [x] Exibe frase motivadora do dia
- [x] Exibe badge/medalha conquistada
- [x] Animação de confete ou similar
- [x] Badge salvo em `day_progress.reward_claimed`

**Status**: ✅ IMPLEMENTADO (DayCelebrationModal.tsx criado)

---

## Epic 3: Fase Dossiê (Dias 1-4)

### Descrição
Implementar os primeiros 4 dias do desafio, focados em autoconhecimento financeiro e mapeamento da situação atual.

---

### DIA 1: Boas-vindas e Despertar

#### US-3.1.1: Formulário inicial do Dia 1

**Como** usuário  
**Quero** responder o questionário inicial de 12 perguntas  
**Para que** eu crie meu perfil emocional e financeiro inicial

**Critérios de Aceitação**:
- [x] Formulário com 12 campos conforme estrutura_curso.md
- [ ] Campos obrigatórios validados
- [ ] Salvamento automático de rascunho
- [ ] Botão "Concluir Dia 1" só ativo quando tudo preenchido

**Campos do formulário**:
1. Como você se sente hoje quando pensa em dinheiro? (select: leve/pesado/dá vontade de fugir)
2. Quais são as primeiras lembranças envolvendo dinheiro? (textarea)
3. Quando pensa em pessoas ricas, quais características vêm à mente? (textarea)
4. Quando pensa em pessoas pobres, quais características vêm à mente? (textarea)
5. Quais emoções surgem ao pensar nas suas finanças? (checkbox group)
6. Se dinheiro não fosse problema, como gostaria de viver? (textarea)
7. Situação atual (checkbox group: boleto atrasado, fatura crescendo, etc.)
8. Quanto você ganha por mês? (currency)
9. O que mais pesa no mês? (text)
10. Tem alguém para dividir a vida financeira? (select: sim/não/às vezes)
11. O que mais te trava ao lidar com dinheiro? (checkbox group)
12. O que você mais quer nesses 15 dias? (checkbox group)

**Status**: ⏳ PARCIALMENTE IMPLEMENTADO (Day1Form.tsx criado, falta integrar com DayModal)

---

#### US-3.1.2: Agendamento de horário diário

**Como** usuário  
**Quero** definir meu horário fixo diário para o desafio  
**Para que** eu receba lembretes e crie rotina

**Critérios de Aceitação**:
- [ ] Seletor de período (manhã/tarde/noite) + horário específico
- [ ] Salvo em `user_profile.preferred_schedule_time`
- [ ] Notificação agendada para esse horário

**Estimativa**: 2 pontos

---

#### US-3.1.3: Output do Dia 1

**Como** usuário  
**Quero** ver um relatório resumo das minhas respostas  
**Para que** eu tenha clareza do meu ponto de partida

**Critérios de Aceitação**:
- [ ] Relatório gerado automaticamente ao concluir
- [ ] Inclui texto inspirador personalizado
- [ ] Lista de "frases que não devemos mais falar"
- [ ] Frase motivadora do dia
- [ ] Opção de baixar PDF

**Estimativa**: 3 pontos

---

### DIA 2: Raio-X do Caos

#### US-3.2.1: Stepper de mapeamento financeiro

**Como** usuário  
**Quero** mapear todas as minhas entradas e saídas em um fluxo guiado  
**Para que** eu tenha visão completa da minha situação

**Critérios de Aceitação**:
- [x] Stepper de 3 passos: Entradas → Saídas Fixas → Saídas Variáveis/Dívidas
- [x] Navegação entre passos com botões Anterior/Próximo
- [x] Progresso do stepper visível
- [x] Dados salvos a cada passo

**Status**: ✅ IMPLEMENTADO (Day2Stepper.tsx criado)

---

#### US-3.2.2: CRUD de entradas (Passo 1)

**Como** usuário  
**Quero** cadastrar todas as minhas fontes de renda  
**Para que** eu saiba exatamente quanto entra por mês

**Critérios de Aceitação**:
- [x] Lista de entradas com: fonte, valor, dia de recebimento, recorrência
- [x] Botão adicionar nova entrada
- [x] Edição inline
- [x] Exclusão com confirmação
- [x] Total calculado automaticamente

**Status**: ✅ IMPLEMENTADO (integrado em Day2Stepper.tsx)

---

#### US-3.2.3: CRUD de saídas fixas (Passo 2)

**Como** usuário  
**Quero** cadastrar todas as minhas despesas fixas  
**Para que** eu saiba meus compromissos mensais

**Critérios de Aceitação**:
- [x] Lista pré-categorizada: Habitação, Serviços Públicos, Transporte, Educação, Saúde
- [x] Campos: nome, valor, vencimento, forma de pagamento
- [x] Total calculado automaticamente
- [ ] Classificação como essencial/importante/negociável

**Status**: ⏳ PARCIALMENTE IMPLEMENTADO (integrado em Day2Stepper.tsx, falta classificação)

---

#### US-3.2.4: CRUD de saídas variáveis e dívidas (Passo 3)

**Como** usuário  
**Quero** cadastrar gastos variáveis e listar dívidas  
**Para que** o mapeamento fique completo

**Critérios de Aceitação**:
- [ ] Lista de gastos variáveis: mercado, lazer, assinaturas, tarifas
- [ ] Classificação: essencial/supérfluo
- [ ] Seção separada para dívidas se houver
- [ ] Total de variáveis calculado

**Estimativa**: 3 pontos

---

#### US-3.2.5: Resumo automático do Raio-X

**Como** usuário  
**Quero** ver um resumo visual do meu raio-x financeiro  
**Para que** eu entenda minha situação de forma clara

**Critérios de Aceitação**:
- [ ] Cards com: Total Entradas, Total Saídas Fixas, Total Variáveis, Sobra/Falta
- [ ] Gráfico de pizza com distribuição
- [ ] Cor verde se sobra, vermelho se falta
- [ ] Campo emocional: "Como você se sente ao ver esses números?"

**Estimativa**: 3 pontos

---

### DIA 3: Arqueologia Financeira

#### US-3.3.1: Importador de extratos

**Como** usuário  
**Quero** importar extratos bancários (CSV/OFX)  
**Para que** minhas transações sejam carregadas automaticamente

**Critérios de Aceitação**:
- [ ] Upload de arquivo CSV ou OFX
- [ ] Parser que extrai: data, descrição, valor
- [ ] Preview antes de confirmar importação
- [ ] Transações salvas em `transactions`

**Estimativa**: 5 pontos

---

#### US-3.3.2: Tabela interativa de transações

**Como** usuário  
**Quero** ver e categorizar todas as transações dos últimos 90 dias  
**Para que** eu identifique padrões de gasto

**Critérios de Aceitação**:
- [ ] Tabela com colunas: Data, Descrição, Valor, Categoria, Status
- [ ] Dropdown para categorizar (alimentação, transporte, lazer, etc.)
- [ ] Dropdown para status (essencial/supérfluo/sombra)
- [ ] Filtros por categoria e período
- [ ] Ordenação por coluna

**Estimativa**: 5 pontos

---

#### US-3.3.3: Identificação de despesas sombra

**Como** usuário  
**Quero** marcar transações como "despesas sombra"  
**Para que** eu saiba quais gastos recorrentes preciso eliminar

**Critérios de Aceitação**:
- [ ] Toggle para marcar como sombra
- [ ] Lista filtrada de despesas sombra
- [ ] Total de despesas sombra calculado
- [ ] Exportar lista para uso no Dia 6

**Estimativa**: 2 pontos

---

#### US-3.3.4: Top 5 despesas e insights

**Como** usuário  
**Quero** ver minhas 5 maiores despesas variáveis  
**Para que** eu foque nos maiores drenos

**Critérios de Aceitação**:
- [ ] Ranking automático por valor total
- [ ] Ranking por frequência
- [ ] Campo de texto para registrar 3 hábitos a reduzir
- [ ] Campo de texto para 2 despesas que valem manter

**Estimativa**: 2 pontos

---

### DIA 4: Regra da Pausa

#### US-3.4.1: Lista de meios de pagamento

**Como** usuário  
**Quero** listar todos os meus cartões e meios de pagamento  
**Para que** eu saiba o que preciso controlar

**Critérios de Aceitação**:
- [ ] Lista com: nome do cartão, limite, taxa de juros, vencimento
- [ ] Toggle para débito automático
- [ ] Botões de ação: Reduzir limite, Congelar, Definir como emergencial

**Estimativa**: 3 pontos

---

#### US-3.4.2: Congelamento de cartões

**Como** usuário  
**Quero** marcar cartões como congelados  
**Para que** eu não os use por impulso

**Critérios de Aceitação**:
- [ ] Visual distinto para cartões congelados
- [ ] Campo para definir 1 cartão emergencial
- [ ] Limite máximo definido para o emergencial
- [ ] Salvo em `card_policy`

**Estimativa**: 2 pontos

---

#### US-3.4.3: Regra das 24 horas

**Como** usuário  
**Quero** ativar a regra de esperar 24h antes de comprar  
**Para que** eu evite compras por impulso

**Critérios de Aceitação**:
- [ ] Toggle para ativar regra
- [ ] Botão "Quero comprar" que abre formulário
- [ ] Campos: item desejado, valor aproximado
- [ ] Lembrete agendado para 24h depois
- [ ] Lista de itens "na espera"

**Estimativa**: 3 pontos

---

#### US-3.4.4: Gatilhos e substituições

**Como** usuário  
**Quero** identificar meus gatilhos emocionais de consumo  
**Para que** eu tenha ações alternativas

**Critérios de Aceitação**:
- [ ] Seleção de gatilhos: ansiedade, tédio, pressão social, cansaço
- [ ] Seleção de ações substitutas: pausa 24h, caminhar, beber água, ligar para alguém
- [ ] Salvo em `day_progress.form_data`

**Estimativa**: 2 pontos

---

## Epic 4: Fase Contenção (Dias 5-9)

### Descrição
Implementar dias 5-9 focados em estancar a sangria financeira e criar orçamento mínimo.

---

### DIA 5: Cartão - Parar a Fatura de Crescer

#### US-4.5.1: Lista de faturas em aberto

**Como** usuário  
**Quero** ver todas as minhas faturas de cartão  
**Para que** eu saiba o que devo

**Critérios de Aceitação**:
- [ ] Lista de cartões com: valor total fatura, valor no rotativo, parcelas restantes
- [ ] Campos editáveis
- [ ] Cálculo de juros do rotativo

**Estimativa**: 3 pontos

---

#### US-4.5.2: Negociação com banco

**Como** usuário  
**Quero** registrar minhas tentativas de negociação com o banco  
**Para que** eu tenha histórico e acompanhamento

**Critérios de Aceitação**:
- [ ] Botão "Negociar com o banco" para cada cartão
- [ ] Formulário: reduzir limite, alterar vencimento, parcelar fatura
- [ ] Status da negociação: pendente/em andamento/concluído
- [ ] Resultado registrado

**Estimativa**: 3 pontos

---

#### US-4.5.3: Regras de uso do cartão

**Como** usuário  
**Quero** definir regras para uso futuro do cartão  
**Para que** eu mantenha controle

**Critérios de Aceitação**:
- [ ] Toggle: limite por compra
- [ ] Toggle: bloquear compras não essenciais
- [ ] Toggle: exigir justificativa
- [ ] Toggle: máximo de parcelas
- [ ] Salvo em `card_policy`

**Estimativa**: 2 pontos

---

### DIA 6: Vazamentos Invisíveis

#### US-4.6.1: Lista de despesas sombra para ação

**Como** usuário  
**Quero** revisar minhas despesas sombra identificadas no Dia 3  
**Para que** eu decida o que fazer com cada uma

**Critérios de Aceitação**:
- [ ] Lista puxada de `shadow_expenses` do Dia 3
- [ ] Para cada item: botões Cortar / Pausar / Manter
- [ ] Se manter: campo para definir limite mensal
- [ ] Link direto para cancelar serviços (quando possível)

**Estimativa**: 3 pontos

---

#### US-4.6.2: Limites para pequenos prazeres

**Como** usuário  
**Quero** definir tetos mensais para categorias específicas  
**Para que** eu controle gastos sem eliminar totalmente

**Critérios de Aceitação**:
- [ ] Campos de limite para: delivery, streaming, fast-food, lazer
- [ ] Valor salvo em `monthly_budget.variable_caps`
- [ ] Exibir economia total prevista ao cortar/pausar

**Estimativa**: 2 pontos

---

#### US-4.6.3: Revisão de tarifas bancárias

**Como** usuário  
**Quero** mapear e eliminar tarifas bancárias desnecessárias  
**Para que** eu economize em custos ocultos

**Critérios de Aceitação**:
- [ ] Lista de tarifas: tipo, valor, frequência
- [ ] Botão: solicitar isenção
- [ ] Botão: migrar para conta digital
- [ ] Checklist de ações realizadas

**Estimativa**: 2 pontos

---

### DIA 7: Vencimentos

#### US-4.7.1: Calendário de obrigações

**Como** usuário  
**Quero** ver todas as minhas contas em um calendário mensal  
**Para que** eu saiba o que vence e quando

**Critérios de Aceitação**:
- [ ] Visualização de calendário mensal
- [ ] Itens agrupados por data
- [ ] Cores por tipo: fixo, dívida, acordo
- [ ] Clique para ver detalhes

**Estimativa**: 5 pontos

---

#### US-4.7.2: Sincronização com datas de recebimento

**Como** usuário  
**Quero** ver minhas datas de renda junto com vencimentos  
**Para que** eu identifique folgas e apertos

**Critérios de Aceitação**:
- [ ] Datas de recebimento visíveis no calendário (cor diferente)
- [ ] Alerta visual quando vencimentos acumulam antes do recebimento
- [ ] Sugestão de alterar vencimento

**Estimativa**: 2 pontos

---

#### US-4.7.3: Alterar data de vencimento

**Como** usuário  
**Quero** solicitar alteração de vencimento para contas  
**Para que** elas caiam em datas melhores

**Critérios de Aceitação**:
- [ ] Botão "Alterar vencimento" em cada item
- [ ] Instruções de como solicitar ao fornecedor
- [ ] Campo para registrar nova data após aprovação

**Estimativa**: 2 pontos

---

#### US-4.7.4: Lembretes de vencimento

**Como** usuário  
**Quero** receber lembretes antes de cada vencimento  
**Para que** eu não esqueça de pagar

**Critérios de Aceitação**:
- [ ] Configuração: lembrar 3 dias antes, 1 dia antes, no dia
- [ ] Notificação push/e-mail/WhatsApp
- [ ] Marcar como pago no lembrete

**Estimativa**: 3 pontos

---

### DIA 8: Prioridades

#### US-4.8.1: Classificação de prioridades

**Como** usuário  
**Quero** classificar minhas obrigações por prioridade  
**Para que** eu saiba o que pagar primeiro quando faltar dinheiro

**Critérios de Aceitação**:
- [ ] Lista de todas as obrigações (fixed_expenses + debts)
- [ ] Dropdown de prioridade: Essencial / Importante / Negociável / Pausável
- [ ] Campo: consequência do atraso
- [ ] Ordenação automática por prioridade

**Estimativa**: 3 pontos

---

#### US-4.8.2: Plano emergencial de pagamento

**Como** usuário  
**Quero** criar um plano de quais contas pagar com meu dinheiro disponível  
**Para que** eu não entre em pânico quando faltar

**Critérios de Aceitação**:
- [ ] Input: quanto tenho disponível este mês
- [ ] Sistema sugere ordem de pagamento baseado em prioridades
- [ ] Usuário pode ajustar manualmente
- [ ] Lista final: Pagar / Negociar / Pausar

**Estimativa**: 3 pontos

---

#### US-4.8.3: Scripts de negociação para contas

**Como** usuário  
**Quero** ter mensagens prontas para negociar contas menos prioritárias  
**Para que** eu saiba o que dizer

**Critérios de Aceitação**:
- [ ] Templates de mensagem por tipo de conta
- [ ] Botão "Copiar mensagem"
- [ ] Botão "Enviar por WhatsApp" (deep link)

**Estimativa**: 2 pontos

---

### DIA 9: Orçamento Mínimo 30 Dias

#### US-4.9.1: Construtor de orçamento mínimo

**Como** usuário  
**Quero** montar meu orçamento mínimo para os próximos 30 dias  
**Para que** eu saiba quanto preciso para viver

**Critérios de Aceitação**:
- [ ] Pré-carrega dados dos dias anteriores
- [ ] Campos editáveis para cada categoria
- [ ] Total de essenciais calculado
- [ ] Comparação com renda

**Estimativa**: 3 pontos

---

#### US-4.9.2: Tetos para variáveis

**Como** usuário  
**Quero** definir limites semanais/mensais para categorias variáveis  
**Para que** eu não extrapole

**Critérios de Aceitação**:
- [ ] Campos de teto: mercado, transporte, lazer, pequenos prazeres
- [ ] Opção de dividir semanalmente
- [ ] Alerta quando teto é ultrapassado
- [ ] Gráfico de pizza com distribuição

**Estimativa**: 3 pontos

---

#### US-4.9.3: Frase de compromisso

**Como** usuário  
**Quero** escrever uma frase de compromisso com meu orçamento  
**Para que** eu me lembre do meu objetivo

**Critérios de Aceitação**:
- [ ] Campo de texto para frase
- [ ] Sugestões de frases
- [ ] Salvo em `monthly_budget.commitment_phrase`
- [ ] Exibida no dashboard

**Estimativa**: 1 ponto

---

## Epic 5: Fase Acordos (Dias 10-12)

### Descrição
Implementar dias focados em negociação e fechamento de acordos com credores.

---

### DIA 10: Mapa de Negociação

#### US-5.10.1: Lista de dívidas para negociar

**Como** usuário  
**Quero** ver todas as minhas dívidas organizadas para negociação  
**Para que** eu tenha clareza do que atacar

**Critérios de Aceitação**:
- [ ] Lista de dívidas com: credor, valor, juros, status, urgência
- [ ] Classificação por urgência: alta/média/baixa
- [ ] Botão "Criar plano de negociação"

**Estimativa**: 2 pontos

---

#### US-5.10.2: Limite máximo de pagamento

**Como** usuário  
**Quero** definir quanto posso pagar de dívidas por mês  
**Para que** eu não aceite acordos que não posso honrar

**Critérios de Aceitação**:
- [ ] Cálculo automático baseado no orçamento mínimo
- [ ] Campo editável para ajustar
- [ ] Alerta se limite for muito alto/baixo
- [ ] Divisão entre dívidas sugerida

**Estimativa**: 2 pontos

---

#### US-5.10.3: Plano de negociação por dívida

**Como** usuário  
**Quero** criar um plano de negociação para cada dívida  
**Para que** eu esteja preparado antes de ligar

**Critérios de Aceitação**:
- [ ] Objetivo: reduzir juros / alongar prazo / desconto à vista / pausar
- [ ] Valor máximo aceitável
- [ ] Valor ideal desejado
- [ ] Contatos: telefone, e-mail, horários
- [ ] Campo de script/roteiro

**Estimativa**: 3 pontos

---

#### US-5.10.4: Agenda de negociações

**Como** usuário  
**Quero** agendar quando vou ligar para cada credor  
**Para que** eu me organize

**Critérios de Aceitação**:
- [ ] Calendário de agendamento
- [ ] Lembrete antes da ligação
- [ ] Status: agendado / realizado / reagendar

**Estimativa**: 2 pontos

---

### DIA 11: Estudar Negociação

#### US-5.11.1: Materiais de estudo

**Como** usuário  
**Quero** acessar conteúdo sobre como negociar  
**Para que** eu me prepare adequadamente

**Critérios de Aceitação**:
- [ ] Lista de vídeos curtos (embed)
- [ ] Textos sobre direitos do consumidor
- [ ] Checklist de direitos (CDC)
- [ ] Links externos relevantes

**Estimativa**: 2 pontos

---

#### US-5.11.2: Editor de scripts

**Como** usuário  
**Quero** revisar e ajustar meus scripts de negociação  
**Para que** minha comunicação seja clara

**Critérios de Aceitação**:
- [ ] Editor de texto rico
- [ ] Templates sugeridos
- [ ] Destaque para palavras-chave importantes
- [ ] Salvar múltiplas versões

**Estimativa**: 2 pontos

---

#### US-5.11.3: Simulador de conversa (opcional)

**Como** usuário  
**Quero** praticar a negociação em um chat fictício  
**Para que** eu ganhe confiança

**Critérios de Aceitação**:
- [ ] Chat que simula perguntas de credores
- [ ] Usuário responde com seus argumentos
- [ ] Feedback sobre respostas
- [ ] (Pode usar IA simples ou respostas pré-definidas)

**Estimativa**: 5 pontos (opcional)

---

#### US-5.11.4: Perguntas a fazer ao credor

**Como** usuário  
**Quero** ter uma lista de perguntas para fazer ao credor  
**Para que** eu não esqueça pontos importantes

**Critérios de Aceitação**:
- [ ] Lista pré-definida de perguntas
- [ ] Checkbox para marcar as feitas
- [ ] Campo para anotar respostas
- [ ] Exportar para PDF

**Estimativa**: 2 pontos

---

### DIA 12: Fechar Acordo

#### US-5.12.1: Realizar contatos agendados

**Como** usuário  
**Quero** ver minha agenda de contatos do dia  
**Para que** eu saiba quem ligar

**Critérios de Aceitação**:
- [ ] Lista de negociações agendadas para hoje
- [ ] Botão "Fazer contato" com telefone/e-mail
- [ ] Status: pendente / em negociação / contraproposta / fechado

**Estimativa**: 2 pontos

---

#### US-5.12.2: Registrar proposta do credor

**Como** usuário  
**Quero** anotar a proposta recebida do credor  
**Para que** eu possa comparar e decidir

**Critérios de Aceitação**:
- [ ] Campos: valor ofertado, número de parcelas, juros propostos
- [ ] Comparação com meu limite
- [ ] Cálculo de economia vs dívida original
- [ ] Alerta se comprometer mais que X% do orçamento

**Estimativa**: 3 pontos

---

#### US-5.12.3: Fechar e registrar acordo

**Como** usuário  
**Quero** registrar os detalhes do acordo fechado  
**Para que** eu tenha controle dos compromissos

**Critérios de Aceitação**:
- [ ] Formulário: valor total, parcelas, valor de cada parcela, data início
- [ ] Upload de contrato/boleto
- [ ] Marca dívida como "em acordo"
- [ ] Cria lembretes de pagamento
- [ ] Calcula economia gerada

**Estimativa**: 3 pontos

---

#### US-5.12.4: Lista de negociações pendentes

**Como** usuário  
**Quero** ver quais negociações não foram concluídas  
**Para que** eu retome depois

**Critérios de Aceitação**:
- [ ] Lista filtrada de negociações pendentes
- [ ] Botão para reagendar
- [ ] Notas sobre última tentativa

**Estimativa**: 1 ponto

---

## Epic 6: Fase Motor (Dias 13-15)

### Descrição
Implementar dias finais focados em criar hábitos, plano de longo prazo e formatura.

---

### DIA 13: Novas Regras de Vida

#### US-6.13.1: Definir regras do cartão

**Como** usuário  
**Quero** estabelecer regras permanentes para uso do cartão  
**Para que** eu mantenha controle no futuro

**Critérios de Aceitação**:
- [ ] Regras configuráveis: limite por compra, nunca parcelar > 3x, uso apenas emergências
- [ ] Alertas quando regra for violada
- [ ] Justificativa obrigatória para exceções

**Estimativa**: 2 pontos

---

#### US-6.13.2: Criar caixinha de emergência

**Como** usuário  
**Quero** configurar minha reserva de emergência  
**Para que** eu tenha colchão para imprevistos

**Critérios de Aceitação**:
- [ ] Campo: conta/poupança para guardar
- [ ] Valor mensal a depositar
- [ ] Meta de saldo
- [ ] Automatização de transferência (se possível)
- [ ] Salvo em `emergency_fund`

**Estimativa**: 2 pontos

---

#### US-6.13.3: Rotina semanal de 10 minutos

**Como** usuário  
**Quero** definir minha rotina semanal de revisão  
**Para que** eu mantenha o controle

**Critérios de Aceitação**:
- [ ] Seletor de dia e horário
- [ ] Checklist padrão: ver contas, revisar orçamento, verificar fatura, acompanhar acordos
- [ ] Itens personalizáveis
- [ ] Lembrete automático

**Estimativa**: 2 pontos

---

#### US-6.13.4: Combinar regras com parceiro

**Como** usuário  
**Quero** registrar combinados feitos com quem divide a vida comigo  
**Para que** ambos sigam as mesmas regras

**Critérios de Aceitação**:
- [ ] Campo: nome do parceiro/familiar
- [ ] Regras combinadas (texto livre ou seleção)
- [ ] Data da conversa
- [ ] Assinatura simbólica (nome digitado)

**Estimativa**: 1 ponto

---

### DIA 14: Plano 30/90

#### US-6.14.1: Retrato financeiro atual

**Como** usuário  
**Quero** ver um resumo da minha situação antes de criar o plano  
**Para que** eu tenha contexto

**Critérios de Aceitação**:
- [ ] Card: orçamento mínimo (total)
- [ ] Card: próximos vencimentos (7 dias)
- [ ] Card: dívidas críticas (número e valor)
- [ ] Dados puxados automaticamente de dias anteriores

**Estimativa**: 2 pontos

---

#### US-6.14.2: Escolher modo de 30 dias

**Como** usuário  
**Quero** selecionar a intensidade do meu plano de 30 dias  
**Para que** as metas sejam realistas para minha situação

**Critérios de Aceitação**:
- [ ] Opções: Emergência total / Equilibrar / Tração leve
- [ ] Descrição de cada modo
- [ ] Afeta sugestões de metas e alertas

**Estimativa**: 1 ponto

---

#### US-6.14.3: Plano 30 dias - Essenciais

**Como** usuário  
**Quero** confirmar minhas obrigações essenciais para os próximos 30 dias  
**Para que** eu priorize o básico

**Critérios de Aceitação**:
- [ ] Lista editável de essenciais com: nome, vencimento, valor mínimo, forma de pagamento
- [ ] Pré-carregado de `fixed_expenses` onde priority = 'essential'
- [ ] Adicionar novos itens
- [ ] Total calculado

**Estimativa**: 2 pontos

---

#### US-6.14.4: Plano 30 dias - Dívidas prioritárias

**Como** usuário  
**Quero** selecionar até 3 dívidas para focar no próximo mês  
**Para que** eu não me perca tentando pagar tudo

**Critérios de Aceitação**:
- [ ] Lista de dívidas com seleção (máximo 3)
- [ ] Para cada selecionada: ação (Negociar / Pagar mínimo / Proteger básico)
- [ ] Data e valor da ação
- [ ] Validação: máximo 3 selecionadas

**Estimativa**: 2 pontos

---

#### US-6.14.5: Plano 90 dias - Alavancas

**Como** usuário  
**Quero** definir até 3 ações que aumentem minha renda ou reduzam despesas  
**Para que** eu ganhe tração a médio prazo

**Critérios de Aceitação**:
- [ ] Cards de sugestões: vender itens, renegociar serviços, renda extra, cancelar serviços caros
- [ ] Seleção (máximo 3)
- [ ] Para cada: meta específica, ação semanal, critério de sucesso
- [ ] Validação: máximo 3 selecionadas

**Estimativa**: 3 pontos

---

#### US-6.14.6: Checkpoints 30/60/90

**Como** usuário  
**Quero** ter marcos claros para revisar meu progresso  
**Para que** eu saiba se estou no caminho

**Critérios de Aceitação**:
- [ ] Marcos gerados automaticamente: 30, 60, 90 dias
- [ ] Metas para cada marco: Estável / Menos pressão / Começou a sobrar
- [ ] Lembrete agendado para cada checkpoint
- [ ] Checklist de revisão em cada marco

**Estimativa**: 2 pontos

---

### DIA 15: Formatura

#### US-6.15.1: Bloco "O que você construiu"

**Como** usuário  
**Quero** ver um resumo de tudo que construí durante o desafio  
**Para que** eu valorize meu progresso

**Critérios de Aceitação**:
- [ ] Card: Vencimentos organizados (número)
- [ ] Card: Orçamento mínimo (valor)
- [ ] Card: Acordos ativos (número e valor)
- [ ] Card: Regras de vida definidas
- [ ] Botão "Ver detalhes" para cada

**Estimativa**: 2 pontos

---

#### US-6.15.2: Protocolo semanal de 10 minutos

**Como** usuário  
**Quero** finalizar meu protocolo semanal de manutenção  
**Para que** eu saiba o que fazer toda semana

**Critérios de Aceitação**:
- [ ] Dia e horário fixo
- [ ] Checklist de 6 itens (editável)
- [ ] Toggle para lembrete
- [ ] Salvo em `weekly_protocol`

**Estimativa**: 2 pontos

---

#### US-6.15.3: Regra de decisão para emergências

**Como** usuário  
**Quero** definir como agir em momentos de crise  
**Para que** eu tenha um protocolo claro

**Critérios de Aceitação**:
- [ ] 3 níveis de ação: Não piorar / Estabilizar / Ganhar tração
- [ ] Gatilho mais perigoso (seleção)
- [ ] Ação padrão quando gatilho aparecer
- [ ] Salvo em `decision_rules`

**Estimativa**: 2 pontos

---

#### US-6.15.4: Compromissos para 90 dias

**Como** usuário  
**Quero** confirmar meus compromissos para os próximos 90 dias  
**Para que** eu tenha metas claras

**Critérios de Aceitação**:
- [ ] Selecionar até 3 compromissos das alavancas do Dia 14
- [ ] Para cada: meta simples, ação semanal, forma de medir
- [ ] Marcos de 30/60/90 dias gerados
- [ ] Salvo em `plans`

**Estimativa**: 2 pontos

---

#### US-6.15.5: Painel de progresso

**Como** usuário  
**Quero** ter um painel com meus indicadores principais  
**Para que** eu acompanhe minha evolução

**Critérios de Aceitação**:
- [ ] 4 indicadores fixos: Essenciais em dia, Sobra do orçamento, Cartão sob controle, Caixinha
- [ ] Status visual: OK / Atenção / Crítico
- [ ] Campo para frase final de compromisso
- [ ] Salvo em `progress_dashboard`

**Estimativa**: 3 pontos

---

#### US-6.15.6: Certificado de conclusão

**Como** usuário  
**Quero** receber um certificado digital de conclusão  
**Para que** eu celebre minha conquista

**Critérios de Aceitação**:
- [ ] PDF gerado com: nome, data, frase-chave
- [ ] Visual bonito e compartilhável
- [ ] Download disponível
- [ ] Opção de compartilhar em redes sociais

**Estimativa**: 3 pontos

---

## Epic 7: Geração de Relatórios e PDFs

### Descrição
Implementar sistema de geração de PDFs para cada dia e relatórios consolidados.

---

#### US-7.1: Edge Function generate-day-pdf

**Como** usuário  
**Quero** gerar um PDF com o resumo de cada dia  
**Para que** eu tenha registro físico do meu progresso

**Critérios de Aceitação**:
- [ ] Edge Function que recebe user_id e day_id
- [ ] Template HTML com dados do dia
- [ ] Inclui: tarefas concluídas, respostas do formulário, frase motivadora, recompensa
- [ ] Converte para PDF
- [ ] Salva no storage e retorna URL
- [ ] Atualiza `day_progress.pdf_url`

**Estimativa**: 5 pontos

---

#### US-7.2: Botão de gerar PDF em cada dia

**Como** usuário  
**Quero** um botão para baixar o PDF do dia  
**Para que** eu tenha fácil acesso

**Critérios de Aceitação**:
- [ ] Botão visível após concluir o dia
- [ ] Loading enquanto gera
- [ ] Abre PDF em nova aba ou faz download
- [ ] Se já gerado, apenas baixa

**Estimativa**: 2 pontos

---

#### US-7.3: Relatório consolidado final

**Como** usuário  
**Quero** um PDF com todo meu progresso no desafio  
**Para que** eu tenha um documento completo

**Critérios de Aceitação**:
- [ ] Disponível após completar Dia 15
- [ ] Inclui resumo de cada dia
- [ ] Gráficos de evolução
- [ ] Plano 30/90 final
- [ ] Certificado anexo

**Estimativa**: 5 pontos

---

## Epic 8: Notificações e Lembretes

### Descrição
Implementar sistema de notificações para lembretes e engajamento.

---

#### US-8.1: Lembrete diário no horário escolhido

**Como** usuário  
**Quero** receber lembrete no meu horário definido  
**Para que** eu não esqueça de fazer o desafio

**Critérios de Aceitação**:
- [ ] Push notification no horário
- [ ] E-mail opcional
- [ ] WhatsApp opcional (integração)
- [ ] Conteúdo: "Hora do seu desafio! Dia X te espera"

**Estimativa**: 3 pontos

---

#### US-8.2: Lembrete de vencimentos

**Como** usuário  
**Quero** receber alertas antes de contas vencerem  
**Para que** eu não atrase

**Critérios de Aceitação**:
- [ ] 3 dias antes, 1 dia antes, no dia
- [ ] Configurável por conta
- [ ] Botão "Marcar como pago" no lembrete

**Estimativa**: 3 pontos

---

#### US-8.3: Lembrete do protocolo semanal

**Como** usuário  
**Quero** ser lembrado do meu check semanal  
**Para que** eu mantenha a rotina

**Critérios de Aceitação**:
- [ ] No dia e horário definido
- [ ] Checklist resumido na notificação
- [ ] Link direto para tela de revisão

**Estimativa**: 2 pontos

---

#### US-8.4: Notificação de checkpoint 30/60/90

**Como** usuário  
**Quero** ser avisado quando atingir um marco  
**Para que** eu revise meu progresso

**Critérios de Aceitação**:
- [ ] Notificação no dia do marco
- [ ] Mensagem motivadora
- [ ] Link para tela de revisão

**Estimativa**: 2 pontos

---

## Critérios de Aceitação Globais

1. **Responsividade**: Todas as telas funcionam em mobile e desktop
2. **Acessibilidade**: Cores com contraste adequado, navegação por teclado
3. **Performance**: Carregamento < 3s, sem travamentos
4. **Persistência**: Dados salvos mesmo se fechar o app
5. **Feedback visual**: Loading states, toasts de sucesso/erro
6. **Consistência visual**: Segue design system do projeto

---

## Definição de Pronto (DoD)

Uma User Story está pronta quando:

- [ ] Código implementado e funcionando
- [ ] Código revisado (PR aprovado)
- [ ] Testes manuais realizados
- [ ] Funciona em mobile e desktop
- [ ] Não quebra funcionalidades existentes
- [ ] Documentação atualizada se necessário
- [ ] Deploy em staging realizado
- [ ] PO/stakeholder validou

---

## Estimativa Total

| Epic | Pontos |
|------|--------|
| Epic 1: Infraestrutura Base | 22 |
| Epic 2: Sistema de Progresso | 16 |
| Epic 3: Fase Dossiê (Dias 1-4) | 49 |
| Epic 4: Fase Contenção (Dias 5-9) | 43 |
| Epic 5: Fase Acordos (Dias 10-12) | 30 |
| Epic 6: Fase Motor (Dias 13-15) | 27 |
| Epic 7: Relatórios e PDFs | 12 |
| Epic 8: Notificações | 10 |
| **TOTAL** | **209 pontos** |

**Considerando velocidade de ~20 pontos/sprint (2 semanas)**:
- Estimativa: **10-11 sprints** (~5 meses de desenvolvimento)

---

## Priorização Sugerida (MoSCoW)

### Must Have (MVP)
- Epic 1 completo
- Epic 2 completo
- Epic 3 (Dias 1-4)
- Epic 4 (Dias 5-9)
- Epic 5 (Dias 10-12)
- Epic 6 (Dias 13-15)

### Should Have
- Epic 7 (PDFs)
- US-8.1 (Lembrete diário)

### Could Have
- US-5.11.3 (Simulador de conversa)
- US-8.2, US-8.3, US-8.4 (Notificações avançadas)

### Won't Have (futuro)
- Integração Open Banking
- Chat com IA
- Comunidade/Fórum
