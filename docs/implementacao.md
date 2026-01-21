# Plano de Implementacao Detalhado - FIRE 15D

Este documento consolida o plano tecnico e de experiencia para tornar o app funcional e eficaz para o usuario final.
Bases analisadas:
- `docs/Guia de Orientacao de Experiencia Humana para a IA.md`
- `docs/Manual de Alma do App FIRE_ Jornada Emocional e Tom de Voz (15 Dias).md`
- `docs/app_fire_reescrito.md`
- Estado atual do repositorio

---

## 1. Principios humanos obrigatorios (Guia + Manual)

- Persona central: sobrevivente financeiro (ansiedade, vergonha, medo do julgamento).
- Tom de voz: acolhedor, validacao explicita, zero bronca, mentor empatico.
- Regra de ouro: se o usuario estivesse chorando, esta tela acalma ou sobrecarrega?
- Dias 1 e 2 sao criticos para reduzir vergonha/medo e gerar compromisso emocional.
- Progresso medido em paz mental e clareza (Termometro Respirar + Insight Cards).

---

## 2. Diagnostico do repositorio atual

### 2.1 UI/Fluxo
- Fluxo principal hoje: `ChallengePath` -> `DayModal` -> `DayTaskTab`.
- Ha fluxo paralelo em `DayPage` que duplica experiencia e logica.
- Componentes customizados existem apenas para dias 1-6 e 8.
- Conteudo textual vem da tabela `days` (Supabase) via `useDays`/`useDay`.

### 2.2 Dados e persistencia
- Progresso geral: `day_progress` (Supabase).
- Estrutura do desafio: `src/config/dayEngine.ts` (DAY_ENGINE).
- Persistencia auxiliar: `src/services/dayEngine.ts` (salva alguns dias).
- Migrations mostram duplicidade de tabelas e schemas (ex: `debts`, `negotiations`, `variable_expenses`).
- Dias 1 e 2 possuem tabelas novas (`initial_assessment`, `daily_log`, `user_commitment`, `financial_snapshot`), mas o fluxo atual nao grava nelas.

### 2.3 Relatorios e analises
- Relatorios customizados so para Dia 1 e 2.
- `dayAnalysis` cobre Dias 1-8; Dias 9-15 estao sem analise dedicada.
- `ReportRenderer` so mapeia dias 1-2.

### 2.4 IA
- Nao existe camada de IA (sem Edge Functions ou servicos dedicados).

---

## 3. Gaps e riscos (comparado ao app_fire_reescrito)

- Divergencia de conteudo e sequencia entre `app_fire_reescrito` e `dayEngine` (ex: Dia 9).
- Duplicidade de schemas: `debts` vs `financial_snapshot` vs `monthly_budget`.
- Variaveis e fixas com campos divergentes das especificacoes.
- Termometro Respirar nao e registrado diariamente (tabela `daily_log` nao usada).
- Notificacoes do compromisso (Dia 1) nao existem.
- Importacao de extratos (Dia 2/3) nao implementada.
- IA nao implementada para gatilhos, categorizacao e scripts.
- Conteudo de `days` incompleto ou nao alinhado ao tom de voz.

---

## 4. Decisoes de alinhamento (recomendado)

1) Fluxo unico: manter `ChallengePath + DayModal` e aposentar `DayPage`.
2) Fonte de verdade por camada:
   - Conteudo: tabela `days`.
   - Estrutura/inputs/outputs: `dayEngine`.
   - Dados do usuario: tabelas dedicadas + copia em `day_progress.form_data`.
3) Unificar schema financeiro seguindo `app_fire_reescrito` e migrations do Dia 1/2.
4) Unificar `user_id` em `auth.users` (ou garantir `profiles` sempre criado).
5) Criar componente padrao de Insight Cards e check-in emocional diario.

---

## 5. Plano macro por fases

### Fase 0 - Alinhamento de base (concluida)
- Decisoes fechadas (Dia 9, schema negociacoes, limite IA global).
- `dayEngine` alinhado ao `app_fire_reescrito`.

### Fase 1 - Conteudo e fluxo principal (2-4 dias)
- Popular `days` com conteudo completo (mensagens, conceitos, tarefas, reflexoes).
- Garantir colunas `motivation_phrase`, `reward_label`, `reward_icon`.
- Remover ou desativar `DayPage` para fluxo unico (ChallengePath + DayModal).
- Consolidar `DayCompletedTab` + relatorios por dia.

### Fase 2 - Dias 1 e 2 (3-5 dias)
- Persistencia completa nas tabelas novas.
- Validacoes obrigatorias e Insight Cards.
- Relatorio Dia 1 e 2 alinhados ao tom emocional.

### Fase 3 - Dias 3 a 6 (5-8 dias)
- Dia 3 (extratos, transacoes e gatilhos).
- Dia 4 (regra da pausa e contrato).
- Dia 5 (politica do cartao).
- Dia 6 (cortes rapidos + economia).

### Fase 4 - Dias 7 a 9 (4-6 dias)
- Dia 7 (calendario de vencimentos).
- Dia 8 (fila de pagamento).
- Dia 9 (orcamento minimo).

### Fase 5 - Dias 10 a 12 (5-7 dias)
- Mapa de negociacao.
- Treino (quiz) e fechamento de acordo.
- Integracao com `negotiation_plans/sessions/agreements`.

### Fase 6 - Dias 13 a 15 (4-6 dias)
- Dia 13 (novas regras de vida).
- Dia 14 (plano 30/90).
- Dia 15 (formatura + ritual semanal).

### Fase 7 - IA (paralela)
- Edge Functions, prompts e logs (`ai_insights`).
- Integrar IA em dias 3, 8, 10, 14 e 15.

---

## 6. Plano detalhado por dia

### DIA 1 - Boas-vindas e Despertar

Objetivo humano: acolher, reduzir ansiedade, gerar compromisso.

O que implementar:
- Fluxo em 4 passos conforme `app_fire_reescrito`.
- Termometro Respirar com justificativa obrigatoria.
- Insight Cards de validacao emocional (inicio e fim).

O que ajustar:
- `Day1Onboarding.tsx`: obrigar `breathe_reason`, validar 8 perguntas, manter tom acolhedor.
- `dayEngine.ts`: salvar em `initial_assessment`, `daily_log`, `user_commitment`.
- `UserProgressContext`: atualizar `current_day` apos conclusao.

Como deve ficar:
- Dados salvos em 3 tabelas + `day_progress.form_data`.
- Mensagem final celebratoria e preview do Dia 2.
- Preparar notificacoes (push/whatsapp/email) via tabela `notifications`.

IA:
- (Opcional) gerar micro-mensagem personalizada de acolhimento ao final.

---

### DIA 2 - Raio-X do Caos

Objetivo humano: transformar medo em clareza.

O que implementar:
- Stepper 4 passos: entradas, fixas, variaveis, dividas + resumo.
- Alertas condicionais (sobra/falta, juros altos).
- Atualizar Termometro (opcional no final).

O que ajustar:
- `Day2FinancialMapper.tsx`: refatorar para schema completo e multiplas fontes.
- Reusar hooks (`useIncomeItems`, `useFixedExpenses`, `useVariableExpenses`, `useDebts`).
- `dayEngine.ts`: calcular e salvar `financial_snapshot`.

Como deve ficar:
- `income_items`, `fixed_expenses`, `variable_expenses`, `debts`, `financial_snapshot` atualizados.
- Resumo visual com graficos (pizza + barras).

IA:
- Categorizacao automatica e sugestao de juros se o usuario nao souber.

---

### DIA 3 - Arqueologia Financeira

Objetivo humano: curiosidade e auto-reflexao.

O que implementar:
- Importacao de extratos (CSV/OFX/Open Banking).
- Lista de transacoes com categorizacao e marcacao de gastos sombra.
- Insight de gatilhos emocionais.

O que ajustar:
- `Day3TriggerAnalysis.tsx`: integrar com `transactions` e `shadow_expenses`.
- `dayEngine.ts`: salvar analises e gerar output metrics.

Como deve ficar:
- Base de transacoes categorizadas + mapa de gatilhos.

IA:
- Classificar transacoes e sugerir gatilhos padroes.

---

### DIA 4 - Regra da Pausa

Objetivo humano: criar protecao com regras realistas.

O que implementar:
- Contrato visual de regras e limites.
- Validacao de regras (nao banir tudo).

O que ajustar:
- Criar tabela `spending_rules` (ou reaproveitar `decision_rules`).
- `dayEngine.ts`: salvar contrato e gerar resumo.

Como deve ficar:
- Regras salvas com limites e excecoes.

IA:
- Validar regras e sugerir ajustes realistas.

---

### DIA 5 - Politica do Cartao

Objetivo humano: controle e disciplina sem culpa.

O que implementar:
- Escolha do cartao principal, bloqueio visual e limite semanal.
- Excecoes com limites por categoria.

O que ajustar:
- `Day5CardPolicy.tsx`: mapear campos para tabela `card_policy`.
- `dayEngine.ts`: salvar politica e permitir edicao.

Como deve ficar:
- Card principal definido, outros bloqueados e limite semanal visivel.

IA:
- (Opcional) sugerir limite semanal baseado na renda e gastos.

---

### DIA 6 - Cortes Rapidos

Objetivo humano: folego rapido e foco.

O que implementar:
- Cortes por categoria + acao (pausa/reducao/troca).
- Estimativa de economia e reforco emocional.

O que ajustar:
- `Day6QuickCuts.tsx`: persistir em `cuts`.
- `dayEngine.ts`: atualizar output metrics.

Como deve ficar:
- Lista de cortes ativa e revisavel.

IA:
- Sugerir cortes com base em `variable_expenses` e `shadow_expenses`.

---

### DIA 7 - Calendario de Vencimentos

Objetivo humano: ordem e previsibilidade.

O que implementar:
- Calendario interativo com vencimentos (fixas + dividas).
- Cores por prioridade (critico/negociar).

O que ajustar:
- Gerar `calendar_items` a partir de `fixed_expenses` e `debts`.
- Criar componente customizado do Dia 7.

Como deve ficar:
- Agenda clara com vencimentos e prioridades.

IA:
- (Opcional) sugerir renegociacao de itens criticos.

Plano de ajuste (refatoracao Dia 7):
- Diagnostico do atual vs. spec (`docs/app_fire_reescrito.md`): hoje ha 3 passos, sem categorias, prioridade, recorrencia, meios de pagamento, nem alinhamento com renda; lembretes estao globais e pouco claros.
- Fluxo alvo (4 passos simples):
  1) Pre-carregar e revisar obrigacoes (fixas + dividas + cartoes + vazamentos mantidos).
  2) Adicionar faltantes (com campos completos).
  3) Alinhar com datas de renda (alerta de deficit por dia).
  4) Lembretes + resumo + concluir dia.
- Modelo de dados minimo:
  - Expandir `calendar_items` com `category`, `payment_method`, `priority`, `recurrence`, `notes`, `source_type`.
  - Adicionar `calendar_reminders` (ou `reminders` JSON no item) para guardar lembretes.
- Pre-carregamento:
  - Dia 2: `fixed_expenses`.
  - Dia 5: `card_invoices` e `card_installments` (se existir tabela).
  - Dia 6: itens mantidos em `leakage_items`/`cuts`.
  - Dividas/parcelas: `debts` e acordos (se houver).
- UI limpa e consistente:
  - Tabela com colunas fixas (Dia, Conta, Valor, Categoria, Pagamento, Prioridade, Acoes).
  - Rodape unico por passo: Voltar + Continuar; no ultimo passo, Concluir.
- Validacao:
  - Nome/valor/data obrigatorios para continuar.
  - Concluir so com lista valida.
- Saida do dia:
  - Resumo do mes (total, criticas, proximos vencimentos).
  - Salvar em `calendar_items` e refletir no Dia 8 e Dia 9.

---

### DIA 8 - Fila de Pagamento

Objetivo humano: lider de crise e decisao rapida.

O que implementar:
- Classificacao impacto x consequencia.
- Plano A/B/C se houver gap.
- 3 acoes praticas para hoje.

O que ajustar:
- `Day8PaymentQueue.tsx`: integrar com dados reais de `calendar_items`.
- Salvar fila e plano em tabela dedicada (ou `day_progress.form_data`).

Como deve ficar:
- Plano de acao objetivo e registrado.

IA:
- Sugerir ordem de pagamento com base no impacto e juros.

---

### DIA 9 - Orcamento Minimo de 30 Dias

Objetivo humano: clareza do minimo necessario.

O que implementar:
- Consolidar essenciais, variaveis e limites.
- Teto por categoria e saldo disponivel.

O que ajustar:
- Definir se Dia 9 e orcamento (app_fire_reescrito) ou ordem de ataque (Manual).
- Se orcamento: criar componente e tabela `monthly_budget` alinhada ao spec.

Como deve ficar:
- Orcamento minimo calculado e salvo, base para negociacoes.

IA:
- Ajustar teto de categorias com base nos dados do Dia 2.

---

### DIA 10 - Mapa de Negociacao

Objetivo humano: preparar propostas com seguranca.

O que implementar:
- Consolidar dividas prioritarias.
- Definir objetivos, limites e script.
- Simulador de proposta.

O que ajustar:
- Escolher tabela unica (`negotiation_plans` + `sessions` ou `negotiations`).
- Criar componente customizado do Dia 10.

Como deve ficar:
- Mapa completo de negociacao por divida.

IA:
- Gerar script e validar se proposta cabe no orcamento.

---

### DIA 11 - Estudar Negociacao

Objetivo humano: aprendizado e confianca.

O que implementar:
- Quiz de cenarios + feedback.
- Registro de simulacoes (opcional).

O que ajustar:
- Se usar `negotiation_sessions`, registrar resultados aqui.

Como deve ficar:
- Usuario pronto para falar com credor.

IA:
- Gerar perguntas/feedbacks personalizados.

---

### DIA 12 - Fechar Acordo

Objetivo humano: celebracao e clareza contratual.

O que implementar:
- Formulario de acordo (valor final, parcelas, data).
- Atualizar `debts` com novos valores.
- Insight de economia.

O que ajustar:
- Persistir em `agreements`.
- Atualizar `dayEngine` e relatorio.

Como deve ficar:
- Acordo registrado com prova e celebracao.

IA:
- Validar se o acordo e sustentavel.

---

### DIA 13 - Novas Regras de Vida

Objetivo humano: autonomia e proposito.

O que implementar:
- Criar 3 regras pessoais.
- Transformar em mantra visual.

O que ajustar:
- Persistir regras (tabela `decision_rules` ou `life_rules`).
- Relatorio do Dia 13.

Como deve ficar:
- Regras claras e revisitaveis.

IA:
- Reescrever regras em formato de mantra.

---

### DIA 14 - Plano 30/90

Objetivo humano: mapa de futuro e modo de operacao.

O que implementar:
- Metas 30/90 com base no saldo e dividas.
- Modo (Emergencia, Equilibrar, Tracao).

O que ajustar:
- Persistir em `plan_306090` (ou tabela unica definida).
- Integrar com `financial_snapshot`.

Como deve ficar:
- Plano acionavel para 30 e 90 dias.

IA:
- Sugerir modo e metas realistas.

---

### DIA 15 - Formatura

Objetivo humano: orgulho, gratidao e continuidade.

O que implementar:
- Retrospectiva visual (Termometro Dia 1 vs Dia 15).
- Certificado e protocolo semanal.

O que ajustar:
- Gerar grafico com `daily_log`.
- Mostrar `main_goal` do Dia 1.

Como deve ficar:
- Encerramento com reforco emocional e proximo passo.

IA:
- Mensagem final personalizada (sem julgamento).

---

## 7. IA no projeto

### 7.1 Arquitetura
- Edge Functions (Supabase) para evitar expor chave no front.
- Funcoes sugeridas: `ai-insights`, `ai-categorize`, `ai-negotiation`, `ai-plan`.
- Log em tabela `ai_insights` (user_id, day_id, input, output, model, created_at).

### 7.2 Guardrails
- Nunca julgar, nunca culpar.
- Sempre validar esforco e oferecer alternativas.
- Fallback deterministico se IA falhar.

### 7.3 Uso por dia
- Dia 3: gatilhos e padroes.
- Dia 8: ordem de pagamento.
- Dia 10: scripts e validacao de proposta.
- Dia 14: modo e metas 30/90.
- Dia 15: mensagem final personalizada.

---

## 8. Conteudo e carga da tabela `days`

- Mapear cada dia do `app_fire_reescrito` para colunas: `morning_message`, `concept`, `task_steps`, `reflection_questions`, `commitment`, `next_day_preview`.
- Validar tom de voz usando Manual de Alma.
- Criar script ou planilha de seed para atualizar `days`.

---

## 9. QA e criterios de aceite

- Dia 1: persistir em 3 tabelas + day_progress, validacoes ok.
- Dia 2: snapshot consistente com graficos.
- Progressao: Dia N+1 apenas apos Dia N.
- Conteudo textual igual ao `app_fire_reescrito`.
- IA: respostas empaticas e sem julgamento.

---

## 10. Decisoes tomadas (Fase 0)

1) Dia 9 segue `app_fire_reescrito`: Orcamento Minimo de 30 Dias.
2) Schema de negociacoes oficial: `negotiation_plans` + `negotiation_sessions` + `agreements`.
3) IA com Google + OpenAI, limite global em R$ definido no painel admin.
4) Integracao Open Banking (Pluggy/Belvo) fica opcional; CSV/OFX como fallback.

---

## 11. Checklist de execucao

- [ ] Popular conteudo dos dias (tabela `days`)
- [x] Desativar `DayPage` e manter fluxo unico (DayRedirect)
- [ ] Refatorar Dia 1 e 2 (persistencia completa)
- [ ] Implementar Dias 3-6
- [ ] Implementar Dias 7-9
- [ ] Implementar Dias 10-12
- [ ] Implementar Dias 13-15
- [ ] Implementar IA e logs
- [ ] QA completo do fluxo

---

## 12. Plano de execucao (ordem e status)

### Bloco 1 - Fluxo e conteudo (prioridade alta)
- [x] Fluxo unico por `ChallengePath` (DayRedirect ativo)
- [ ] Seed/atualizacao de conteudo da tabela `days`
- [ ] Consolidar relatorios por dia em `DayCompletedTab` + `ReportRenderer`

### Bloco 2 - Dias 7-9 (prioridade alta)
- [x] Dia 7 calendario financeiro (pre-carregar + salvar em `calendar_items`)
- [x] Dia 8 integrar `calendar_items` na fila de pagamento
- [x] Dia 9 componente de orcamento minimo com prefill (Dia 2 + Dia 7)

### Bloco 3 - Dias 1-2 (prioridade alta)
- [x] Persistencia em `initial_assessment`, `daily_log`, `user_commitment`
- [ ] Insight cards e validacoes finais alinhadas ao tom
- [ ] Refino de relatorios (Dia 1/2) e metricas completas

### Bloco 4 - Dias 3-6 (prioridade media)
- [ ] Importacao de extratos (CSV/OFX) + `transactions`
- [ ] Gatilhos e gastos sombra (Dia 3)
- [ ] Contrato de regras (Dia 4)
- [ ] Politica do cartao (Dia 5)
- [ ] Cortes rapidos (Dia 6)

### Bloco 5 - Dias 10-15 (prioridade media)
- [x] Dia 10 mapa de negociacao (componente customizado)
- [x] Dia 11 quiz de negociacao
- [x] Dia 12 registro de acordo
- [x] Dia 13 novas regras de vida (mantra + 3 regras)
- [ ] Regras de vida + plano 30/90 + formatura

### Bloco 6 - IA (paralela)
- [x] Limite global de IA no admin (R$)
- [ ] Edge Functions + logs (`ai_insights`)
- [ ] Integracoes por dia (3, 8, 10, 14, 15)
