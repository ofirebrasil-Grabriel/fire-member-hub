# Plano de Implementacao - IA para Relatorios do Dia

## O que entendi
- A IA deve analisar o preenchimento da tarefa do dia (dados do formulario e metricas) e gerar o conteudo analitico do relatorio do dia, com orientacoes claras para o usuario.
- Essa analise deve aparecer no relatorio do dia (tela de concluido e PDF), substituindo ou complementando o texto atual baseado em regras.

## O que vamos implementar
- Pipeline de geracao de insights com IA por dia concluido.
- Armazenamento do resultado da IA para reuso (cache) e auditoria.
- Integracao no relatorio do dia (tela e PDF) com fallback para analise atual se IA falhar.
- Controle de custo e configuracao central via tabela `settings`.

## Plano detalhado

### Fase 1 - Estrutura de dados e configuracao
1) Tabela para armazenar saidas da IA por usuario/dia
   - Ex: `ai_day_reports`
   - Colunas: `id`, `user_id`, `day_id`, `analysis_json`, `analysis_text`, `model`, `prompt_version`, `tokens`, `cost_brl`, `created_at`, `updated_at`
   - RLS: usuario so ve seus registros.

2) Settings (chaves em `settings`)
   - `ai_enabled` (bool)
   - `ai_provider` (openai | google)
   - `ai_model` (ex: gpt-4o-mini, gemini-1.5-flash)
   - `ai_budget_brl` (ja existe)
   - `ai_prompt_version`

### Fase 2 - Edge Function da IA
1) Criar Edge Function `generate-day-report`
   - Entrada: `day_id`, `form_data`, `metrics`, `user_id`
   - Busca settings e valida `ai_enabled` e limite de custo.
   - Monta prompt baseado no dia + dados.
   - Gera resposta em JSON padrao:
     - `summary`
     - `highlights` (3 itens)
     - `risks` (opcional)
     - `next_actions` (3 passos)
     - `tone_message` (mensagem de apoio)
   - Salva na tabela `ai_day_reports`.
   - Retorna o JSON gerado.

2) Controle de custo
   - Registrar tokens/custo no `ai_day_reports`.
   - Se atingir `ai_budget_brl`, retorna fallback (analise atual).

### Fase 3 - Integracao no fluxo do app
1) Ao concluir o dia:
   - Disparar chamada para Edge Function de IA.
   - Se a IA responder rapido, usa no relatorio.
   - Se demorar/falhar, exibe analise local e reprocessa em background.

2) UI do relatorio (DayCompletedTab e PDF)
   - Exibir bloco "Analise IA" com summary + orientacoes.
   - Se nao existir IA, usar `generateDayAnalysis` atual.

### Fase 4 - Prompt e qualidade
1) Prompt por dia
   - Estrutura base + instrucoes de tom (Manual de Alma).
   - Contexto do dia + objetivo humano + dados do formulario.
2) Versao do prompt
   - Salvar `ai_prompt_version` no resultado para controle.

### Fase 5 - Observabilidade e seguranca
1) Logs de erro na function.
2) Evitar PII desnecessaria no prompt.
3) Timeouts e retries com backoff.

## Resultado esperado
- Relatorios do dia com orientacoes claras e personalizadas.
- Melhor reducao de ansiedade e mais confianca do usuario.
- Controle de custo e previsibilidade no uso de IA.
