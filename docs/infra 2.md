Especificação Técnica do Backend — Desafio FIRE Brasil 15D

Este documento traduz a estrutura do curso FIRE Brasil 15D em requisitos técnicos para o backend da área de membros. O objetivo é apoiar os desenvolvedores na implementação de um sistema robusto, seguro e escalável, capaz de suportar o desafio de 15 dias, acompanhar a jornada dos usuários, oferecer feedback em tempo real e gerar relatórios completos.

1. Visão Geral do Sistema

O sistema é uma plataforma de aprendizado e acompanhamento financeiro composta por:

API REST para manipulação de dados dos usuários, desafios, formulários e relatórios.

Banco de dados relacional (PostgreSQL ou similar) para armazenar usuários, jornadas, transações e configurações.

Serviços de notificação (e‑mail, push, SMS/WhatsApp) para lembretes diários e semanais.

Módulo de geração de PDF para que o usuário baixe relatórios e certificados em cada dia.

Fila de tarefas (opcional) para processar importação de extratos, geração de relatórios e PDFs sem bloquear a API.

Regra global do desafio

Para todos os dias do desafio, o backend deve garantir que:

Haja um campo de frase motivadora relacionada ao conteúdo daquele dia, estimulando o usuário a continuar. Essa frase deve vir junto aos outputs e poderá ser cadastrada/configurada pelo time de conteúdo.

Haja um componente de recompensa: algum elemento lúdico ou marcador de progresso (por exemplo, medalhas, pontos, badges) entregue no output ao completar o dia, reforçando a sensação de progresso.

A interface mostre um botão para gerar PDF com o resumo do dia, incluindo a frase motivadora e a recompensa. O backend deve expor um endpoint que gera esse PDF com base nos dados do usuário e envia para download ou por e‑mail.

2. Modelagem de Dados (Entidades principais)

Segue uma proposta de modelagem relacional, abstraindo detalhes de implementação.

2.1 Usuários e Autenticação

users (id, name, email, password_hash, time_zone, created_at, updated_at)

user_sessions (id, user_id, token, expires_at)

user_profiles (user_id, preferred_schedule_time, language, onboarding_completed)

2.2 Jornadas e Progresso

courses (id, name, description, total_days)

course_days (id, course_id, day_number, title, objective, concept_text, motivation_phrase, reward_type)

user_course_progress (id, user_id, course_id, current_day, progress_percentage, started_at, completed_at)

daily_logs (id, user_id, course_day_id, temperature_score, temperature_note, schedule_time, minimum_step, status (draft/completed), created_at)

daily_outputs (id, daily_log_id, output_type, content_json, pdf_path, motivation_phrase, reward_given, created_at)

2.3 Finanças e Orçamentos

income_items (id, user_id, source, amount, received_on, recurrence, created_at)

fixed_expenses (id, user_id, name, amount, due_date, payment_method, recurrence, priority, created_at)

variable_expenses (id, user_id, name, amount, category, spent_on, is_shadow, created_at)

debts (id, user_id, creditor, principal_amount, interest_rate, installments, status, next_due_date, negotiable, created_at)

transactions (id, user_id, date, description, amount, category, is_shadow, created_at)

shadow_expenses (id, user_id, name, estimated_amount, status (cut/pause/keep), comment, created_at)

budget_minimum (id, user_id, month, total_amount, caps_json, commitment_phrase, created_at)

weekly_caps (id, budget_id, category, weekly_cap)

2.4 Negociação de Dívidas

negotiation_plan (id, user_id, debt_id, objective, max_monthly_payment, priority, created_at)

negotiation_sessions (id, negotiation_plan_id, scheduled_at, status (pending/completed), script_version, notes)

agreements (id, user_id, debt_id, total_amount, monthly_payment, interest_rate, installments, start_date, end_date, contract_path, created_at)

2.5 Plano 30/90 e Protocolos

plans (id, user_id, cycle_type (30/90), mode (emergency/balance/traction), start_date, end_date, status)

plan_essentials (id, plan_id, obligation_id, name, due_date, minimum_amount, alert_config)

plan_debt_priorities (id, plan_id, debt_id, action_type (negotiate/pay_min/protect), action_value, action_due_date, contact_channel)

plan_levers (id, plan_id, type, goal_text, weekly_action, success_criteria)

plan_checkpoints (id, plan_id, checkpoint_date, checkpoint_type (weekly/milestone), checklist_json, completed_at)

progress_dashboard_config (id, user_id, indicator_key, indicator_name, measurement_method, target_value, created_at)

2.6 Protocolos e Regras de Vida

card_rules (id, user_id, max_per_purchase, allowed_categories, frozen, notes)

emergency_fund (id, user_id, account_info, monthly_contribution, goal_amount, created_at)

weekly_routines (id, user_id, day_of_week, time, checklist_json, active)

decision_rules (id, user_id, primary_trigger, default_action, levels_json)

plan_90d_instances (id, user_id, plan_id, commitments_json, metrics_json, created_at)

scheduled_events (id, user_id, event_type, scheduled_at, payload_json, status)

2.7 Notificações e Mensagens

notifications (id, user_id, channel, title, body, scheduled_at, sent_at, status)

motivation_phrases (id, course_day_id, text, language, created_at)

rewards (id, course_day_id, type, value, icon, created_at)

3. Endpoints e Fluxos Principais

O backend deverá expor endpoints REST (ou GraphQL) para as funcionalidades abaixo. A seguir, uma visão geral dos principais fluxos.

3.1 Cadastro e Autenticação

POST /users — Cadastra um novo usuário. Recebe name, email, password e time_zone. Envia e‑mail de confirmação.

POST /login — Gera token de sessão para o usuário autenticado.

POST /logout — Invalida a sessão atual.

3.2 Progresso do Curso

GET /courses — Lista cursos disponíveis (no caso, FIRE 15D).

GET /courses/{courseId}/days — Lista informações básicas de cada dia: título, objetivo, se já foi concluído.

GET /courses/{courseId}/days/{dayId} — Retorna o conteúdo completo do dia (conceito, tarefa prática, estrutura da tela, frase motivadora, recompensa) e os dados do usuário para aquele dia, se existentes.

POST /courses/{courseId}/days/{dayId}/logs — Cria ou atualiza o daily_log com os dados preenchidos pelo usuário (termômetro, notas, formulários, etapas do stepper, dados financeiros etc.). Também gera o daily_output com a frase motivadora e recompensa.

POST /courses/{courseId}/days/{dayId}/complete — Marca o dia como concluído, dispara notificações de parabenização e progride para o próximo dia.

GET /courses/{courseId}/progress — Mostra progresso geral, dia atual, percentuais e checkpoints.

3.3 Importação e Organização de Finanças

POST /transactions/import — Endpoint para upload de extratos (CSV, OFX) que alimenta as tabelas transactions. Pode acionar uma tarefa em background.

GET /transactions — Lista de transações do usuário, filtrada por data, categoria ou status.

POST /income / PUT /income/{id} / DELETE /income/{id} — CRUD de fontes de renda.

POST /fixed-expenses / PUT /fixed-expenses/{id} / DELETE /fixed-expenses/{id} — CRUD de despesas fixas.

POST /variable-expenses — Registro de gastos variáveis à medida que ocorrem.

POST /debts / PUT /debts/{id} / DELETE /debts/{id} — CRUD de dívidas.

3.4 Calendário de Vencimentos

GET /obligations/calendar — Lista obrigações em formato de calendário com datas de vencimento e prioridades.

PUT /obligations/{id}/due-date — Altera a data de vencimento (quando aceito pelo fornecedor).

POST /income-dates — Registra datas de recebimento de renda para alinhar com vencimentos.

3.5 Orçamento e Prioridades

POST /budget-minimum — Cria ou atualiza orçamento mínimo mensal com tetos por categoria e frase de compromisso.

GET /budget-minimum/current — Obtém orçamento atual e status de gastos.

POST /priority-plan — Registra a matriz de prioridades (Dia 8) com consequências e plano emergencial de pagamento.

GET /priority-plan/current — Obtém plano emergencial ativo.

3.6 Negociação de Dívidas

POST /negotiation-plans — Cria planos de negociação a partir das dívidas mapeadas.

GET /negotiation-plans — Lista planos e prioridades.

POST /negotiation-sessions — Agenda sessão de negociação com credor (contato). Guarda data, horário, script e notas.

PUT /negotiation-sessions/{id} — Atualiza status da negociação (ex.: realizado, proposta aceita, contraproposta).

POST /agreements — Salva detalhes dos acordos fechados, anexando contrato/boletos.

GET /agreements — Lista acordos ativos e próximos vencimentos.

3.7 Plano 30/90, Regras e Protocolos

POST /plans — Cria ou atualiza Plano 30/90 (Dia 14), salvando essenciais, dívidas prioritárias e alavancas.

GET /plans/current — Obtém plano ativo com etapas e checkpoints.

POST /weekly-protocol — Define protocolo semanal (Dia 15) com checklist e horário fixo.

POST /decision-rule — Define regra de decisão em três níveis (Dia 15).

POST /plan-90d — Confirma compromissos para os próximos 90 dias.

POST /progress-dashboard — Instala painel de progresso com indicadores e frase de compromisso.

3.8 Regras de Vida e Rotinas

POST /card-rules — Define ou atualiza regras de uso do cartão.

POST /emergency-fund — Configura caixinha de emergência (conta, valor mensal, meta).

POST /weekly-routines — Agenda rotina semanal de revisão (Dia 13), com lista de itens a revisar.

POST /decision-rules — Configura regra de decisão (Dia 15).

3.9 Notificações e PDF

POST /notifications/schedule — Agenda envio de notificações (diárias, semanais, prazos de vencimento).

GET /notifications — Consulta notificações agendadas ou enviadas.

POST /pdfs/generate — Gera PDF de resumo de um dia, plano ou certificado. Recebe daily_log_id ou plan_id e retorna link para download. Este endpoint deve acionar um serviço de geração de PDF que compila todos os dados, insere a frase motivadora do dia, a recompensa, imagens ou gráficos e formata o documento.

4. Regras de Negócio e Considerações Importantes
4.1 Fluxo Linear do Desafio

O usuário só pode acessar o conteúdo do Dia n+1 após concluir o Dia n ou marcar a versão mínima concluída. Isso é controlado via user_course_progress.

Sempre que um dia é concluído, o sistema deve verificar se existem campos pendentes. Se faltar alguma informação essencial, retorna mensagem de erro.

Ao completar cada dia, gera‑se um daily_output contendo:

Resumo do que foi feito e preenchido pelo usuário.

A frase motivadora associada ao dia.

A recompensa (ícone ou badge), que deve ser calculada conforme número de tarefas concluídas ou qualidade das respostas.

Link para gerar PDF.

4.2 Validação e Segurança

Campos obrigatórios: alguns dados (ex.: valor de renda, lista de dívidas, critérios de orçamento mínimo) são obrigatórios para avançar. O backend deve validar e retornar mensagens claras.

Privacidade: dados financeiros são sensíveis. Use criptografia em repouso e em trânsito (TLS) e proteja chaves de integração bancária. Somente o usuário pode acessar seus próprios dados.

Auditoria: registre logs de quem acessa ou altera dados importantes (ex.: alteração de limites de cartão, fechamento de acordos). Esses logs devem estar disponíveis apenas para administradores.

Multiplataforma: as APIs devem ser seguras para uso em web e mobile, incluindo autenticação via tokens JWT e proteção contra CSRF quando aplicável.

4.3 Geração de PDFs

Use biblioteca server‑side (ex.: WeasyPrint, Puppeteer ou ReportLab) para gerar PDFs a partir de templates HTML e CSS.

O template de cada dia deve incluir cabeçalho com título e data, o resumo das ações, gráficos ou tabelas (quando houver), a frase motivadora e a recompensa. O rodapé deve exibir a marca do curso e número da página.

Armazene os PDFs gerados em bucket ou disco (daily_outputs.pdf_path) e forneça link temporário para download seguro.

4.4 Internacionalização e Personalização

Campos como motivation_phrase e reward devem ser localizáveis (language), permitindo traduções futuras.

O sistema deve permitir personalizar textos de conceitos e tarefas conforme atualizações de conteúdo, sem exigir deploys (armazenar no banco ou CMS).

4.5 Escalabilidade e Performance

Operações pesadas, como importação de extratos e geração de PDF, devem ser processadas em workers assíncronos (fila de tarefas, ex.: RabbitMQ ou Sidekiq).

Use índices em colunas de busca frequentes (ex.: user_id, day_number, due_date).

Limite requisições e uso de APIs de terceiros (bancos) para evitar bloqueios.

4.6 Integrações Futuras

APIs bancárias (OFX, Open Banking) para importar extratos e renegociar faturas automaticamente.

Mensageria externa (Twilio, WhatsApp Business) para envio de notificações e suportes em chat.

Métricas e BI: coleta de métricas de uso para avaliar engajamento e ajustar conteúdo.

5. Conclusão

Esta especificação apresenta uma base sólida para implementar o backend do desafio FIRE Brasil 15D. Ela contempla desde a modelagem de dados até os fluxos de API, regras de negócio, validações e integrações. A implementação deve ser iterativa: comece pelo núcleo (cadastro, progresso e armazenamento dos dados dos dias), avance para módulos financeiros (entradas, despesas, dívidas) e, por fim, implemente negociações, planos 30/90 e protocolos semanais. Lembre‑se de que cada dia deve oferecer uma experiência completa ao usuário, com motivação, recompensa e capacidade de gerar relatórios em PDF.