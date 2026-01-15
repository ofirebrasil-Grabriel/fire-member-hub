Especificação Técnica Adaptada — Desafio FIRE Brasil 15D (Backend Supabase)

Este documento adapta a especificação técnica original do backend do Desafio 15 FIRE às particularidades do repositório atual (fire‑member‑hub) e ao uso do Supabase como backend. Ele descreve a modelagem de dados, funções e fluxos necessários para que o sistema suporte as funcionalidades do curso, incluindo as novas regras de frase motivadora, recompensa e geração de PDF por dia.

1. Visão Geral da Arquitetura
1.1. Front‑end (repositório fire‑member‑hub)

O front‑end é uma aplicação React/TypeScript gerada com Vite e a biblioteca de UI shadcn. Ele consome dados via hooks (useDays, useDay) que consultam diretamente a tabela days no Supabase e armazena o progresso do usuário localmente através de um UserProgressContext. Há páginas de administração (Admin, AdminChallenges, AdminUsers etc.) que manipulam diretamente as tabelas e storage através do Supabase.

1.2. Backend Supabase

O Supabase fornece:

PostgreSQL para armazenamento de dados. As tabelas relevantes incluem days, day_progress, profiles, subscriptions, settings e webhook_logs. Outras tabelas como debts, monthly_budget, cuts, negotiations etc. suportam módulos financeiros futuros.

Storage buckets (ex.: challenge-assets) para hospedar áudios e documentos. O editor de dias (ChallengeEditor) já utiliza esse bucket.

Edge Functions para executar código server‑side em resposta a chamadas HTTP. Elas podem gerar PDFs, enviar e-mails e realizar processos assíncronos.

Auth para autenticação via e‑mail/senha e gerenciamento de perfis.

1.3. Adequação às Novas Regras

Frase motivadora e recompensa: cada dia deve ter uma frase motivadora e um elemento de recompensa. Necessário adicionar campos ou tabelas que armazenem esses textos e elementos, além de ajustar as páginas de edição (AdminChallenges/ChallengeEditor) para permitir o cadastro.

Geração de PDF: deve ser possível gerar um relatório em PDF ao concluir cada dia, contendo o resumo das atividades, a frase motivadora e a recompensa. Esta funcionalidade será provida por uma Edge Function que consome dados do Supabase e produz o arquivo, armazenando-o no bucket de storage.

Persistência de progresso: para controlar acesso e geração de relatórios, é recomendável migrar o progresso do usuário do localStorage para a tabela day_progress no Supabase.

2. Modelagem de Dados Adaptada

A seguir, descrevem‑se as tabelas existentes no Supabase e as alterações necessárias para cumprir as novas regras.

2.1. Tabelas Existentes

days — tabela que define o conteúdo de cada dia do desafio. Campos relevantes:

id: número inteiro identificador (1 a 15).

title, subtitle, emoji: textos apresentados na lista de dias.

morning_message, morning_audio_url: mensagem matinal e áudio opcional.

concept, concept_title, concept_audio_url: explicação do conceito FIRE do dia.

task_title, task_steps: título e lista de tarefas práticas (JSON).

tools: array de objetos contendo nome, URL e tipo do material extra.

reflection_questions: perguntas de reflexão (array de strings).

commitment: texto de compromisso do dia.

next_day_preview: preview do próximo dia.

day_progress — registra o progresso de cada usuário em cada dia.

id: UUID.

day_id: chave estrangeira para days.

user_id: referência a profiles.

completed: booleano que indica se o dia foi concluído.

completed_at: timestamp de conclusão.

completed_tasks: array de strings (IDs dos passos concluídos).

mood: string representando o humor selecionado.

diary_entry: texto livre inserido pelo usuário.

payload: JSON para armazenar dados adicionais (futuro).

updated_at, created_at.

profiles — dados pessoais do usuário (nome, e-mail, avatar etc.).

subscriptions — status da assinatura e do produto “fire‑challenge”. Usada para controlar acesso.

settings — tabela de configurações e integrações (ex.: URLs de webhooks).

2.2. Novas Colunas e Tabelas
2.2.1. Campos em days

Para cada dia do desafio, adicionam‑se:

motivation_phrase (text, não nulo): frase motivadora do dia. Será exibida após o usuário concluir as tarefas.

reward_label (text, não nulo): nome ou descrição da recompensa (ex.: “Medalha de Iniciativa”, “Ponto de Foco”).

reward_icon (text, opcional): caminho ou URL do ícone associado à recompensa. Pode ser salvo no storage.

Esses campos permitem que a equipe de conteúdo edite a motivação e recompensa no editor de dias.

2.2.2. Alterações em day_progress

Para suportar geração de PDF e rastreamento de recompensas:

pdf_url (text, opcional): URL do PDF gerado para aquele dia (armazenado no bucket de storage).

reward_claimed (boolean, default false): indica se o usuário recebeu a recompensa.

reward_timestamp (timestamp, opcional): quando a recompensa foi concedida.

Esses campos serão atualizados pela Edge Function responsável pela geração de PDF e entrega de recompensas.

2.2.3. Tabela motivation_phrases (opcional)

Se preferir centralizar frases e recompensas para reuso, pode‑se criar uma tabela:

coluna	tipo	descrição
id	serial	identificador da frase
day_id	integer	referência ao day
language	varchar(5)	código de idioma (ex.: pt-BR)
text	text	frase motivadora
reward_label	text	nome da recompensa
reward_icon	text	URL ou nome do arquivo do ícone
created_at	timestamp	criação

O editor de dias buscaria a frase e recompensa conforme idioma e dia.

3. Funções e APIs Supabase (Edge Functions)

Embora o Supabase exponha a tabela via client, algumas operações exigem lógica de negócio e geração de arquivos; para isso, recomenda‑se usar Edge Functions. A seguir estão as principais funções que devem ser implementadas.

3.1. complete_day

Objetivo: marcar um dia como concluído para o usuário, calcular recompensa, salvar progresso e agendar a geração de PDF.

Entrada (JSON):

{
  "day_id": 5,
  "completed_tasks": ["task-1", "task-2", "task-3"],
  "mood": "motivated",
  "diary_entry": "Hoje foi um dia produtivo..."
}


Processo:

Verificar se o usuário tem permissão (assinatura ativa e acesso ao dia). Caso contrário, retornar erro.

Inserir ou atualizar a linha em day_progress com completed = true, completed_at = now(), completed_tasks, mood e diary_entry.

Consultar a tabela days para obter motivation_phrase e reward_label do dia.

Marcar reward_claimed = false (a recompensa será concedida após geração do PDF).

Adicionar um job em uma fila (p.ex. generate_day_pdf) com user_id e day_id.

Retornar resposta com a mensagem motivadora e a descrição da recompensa para exibição imediata.

Resposta (JSON):

{
  "message": "Parabéns! Você concluiu o Dia 5.",
  "motivation_phrase": "Cada passo conta para a liberdade financeira!",
  "reward": {
    "label": "Medalha de Persistência",
    "icon": "https://.../medal_persistencia.png"
  }
}

3.2. generate_day_pdf

Objetivo: gerar um PDF personalizado com o resumo do dia para um usuário e armazenar o arquivo no bucket.

Acionamento: via fila de tarefas ou chamada manual (ex.: botão “Gerar PDF” no front‑end). A fila deve receber user_id e day_id.

Processo:

Recuperar os dados do dia (days) e do progresso (day_progress).

Montar um template HTML contendo:

Cabeçalho com título e data;

Resumo das tarefas completas e respostas do usuário;

Conceito do dia e mensagem matinal resumidos;

Perguntas de reflexão e respostas (se houver);

Frase motivadora e descrição da recompensa;

Informações adicionais (ex.: assinatura, instruções para o próximo dia).

Usar uma biblioteca de geração de PDF (p.ex.: Puppeteer
 ou PDFKit
) para converter o HTML em PDF.

Salvar o PDF no bucket challenge-assets, em um caminho como user-{user_id}/day-{day_id}-{timestamp}.pdf.

Atualizar a linha de day_progress com pdf_url apontando para o arquivo e reward_claimed = true, reward_timestamp = now().

Retornar a URL do PDF ou enviar via e‑mail se o usuário preferir.

3.3. get_day_content

Objetivo: retornar o conteúdo do dia e o progresso do usuário em uma única chamada. Essa função permite consolidar dados para o front‑end, incluindo as novas colunas.

Entrada: day_id (parâmetro), o user_id é obtido via token.

Processo:

Buscar a linha em days para o dia solicitado.

Buscar a linha em day_progress para o par (user_id, day_id) se existir.

Combinar os dados em um objeto que inclui campos de progresso, motivação e recompensa. Por exemplo:

{
  "day": {
    "id": 5,
    "title": "Cortar gastos supérfluos",
    "subtitle": "Onde posso economizar sem comprometer a qualidade de vida?",
    "morning_message": "...",
    "motivation_phrase": "Cada economia é um investimento em você.",
    "reward_label": "Selo de Economia",
    ...
  },
  "progress": {
    "completed": true,
    "completed_tasks": ["task-1", "task-2"],
    "mood": "animado",
    "diary_entry": "...",
    "pdf_url": "https://...",
    "reward_claimed": true
  }
}


Essa função pode ser consumida pelas páginas DayPage e Challenge para exibir informações unificadas e determinar se o botão de “Gerar PDF” deve aparecer.

3.4. update_task_progress

Objetivo: registrar a conclusão de uma tarefa individual sem finalizar o dia. Permite que o front‑end sincronize as tarefas concluídas antes de encerrar a sessão.

Entrada: day_id, task_id, status (boolean).

Processo:

Recuperar ou criar linha em day_progress para (user_id, day_id).

Atualizar o array completed_tasks conforme o task_id e o status informado.

Retornar o número de tarefas concluídas.

Esse endpoint pode ser uma Edge Function ou operar diretamente via triggers no PostgREST, mas a função facilita regras adicionais (ex.: se tarefas concluídas atingirem 100%, acionar notificação).

3.5. Funções de Administração

Além das funções acima, o painel administrativo no front‑end utiliza diretamente o supabase client para operações CRUD em days, profiles, subscriptions e settings. No entanto, para manter consistência e validar dados, pode‑se expor funções dedicadas que encapsulem as regras (ex.: verificar unicidade de day_id, validar URLs de recursos, formatar arrays). Exemplos:

admin_create_day

admin_update_day

admin_delete_day

admin_list_users

admin_update_user_status

admin_list_webhook_logs

Cada função deve verificar se o usuário autenticado possui papel admin via claims do JWT (campo role na tabela user_roles).

4. Fluxos de Interface Adaptados

A lógica de interface definida no repositório continua válida, mas alguns pontos devem ser ajustados para interagir com o backend Supabase e as novas funcionalidades:

Carregamento de conteúdos: substituir a lógica de useDay para que utilize a função get_day_content em vez de múltiplas seleções diretas. Isso simplifica o componente DayPage e permite que a frase motivadora e a recompensa sejam exibidas junto com o conteúdo do dia.

Persistência de progresso: refatorar UserProgressContext para gravar/ler o progresso via day_progress no Supabase. Isso garante sincronização entre dispositivos e permite o cálculo de estatísticas globais no painel administrativo.

Exibição da frase motivadora e recompensa: após completar todas as tarefas, complete_day retorna a frase motivadora e a recompensa, que devem ser exibidas em um modal ou cartão de celebração antes de avançar para o próximo dia. O mesmo modal pode incluir um botão “Gerar PDF”.

Botão de PDF: o botão deve chamar a função generate_day_pdf. Enquanto a função executa, exibir um indicador de carregamento. Ao finalizar, mostrar link para baixar ou abrir o PDF.

Admin Editor: o ChallengeEditor deve incluir campos para motivation_phrase, reward_label e reward_icon. A validação deve impedir que esses campos fiquem vazios. Ao salvar, os novos dados serão enviados à tabela days.

5. Considerações de Segurança e Escalabilidade

Autorização: Todas as Edge Functions devem validar o JWT enviado pelo front‑end e restringir o acesso com base no papel (member, admin). Recomenda‑se usar o Supabase Auth Helpers para essa validação.

Limite de taxas: Implementar rate limiting nas funções (via Supabase Edge ou Vercel) para evitar abuso, especialmente na geração de PDFs.

Storage Público x Privado: Os PDFs e arquivos de recompensa podem ser armazenados em pastas privadas no bucket, com URLs assinadas para download temporário. Para recompensas visuais (ícones), usar pastas públicas para permitir cache.

Monitoramento: Registrar logs de geração de PDFs e de entrega de recompensas em webhook_logs ou outra tabela dedicada, facilitando auditoria.

Escalabilidade: Funções de geração de PDF podem ser executadas de forma assíncrona em workers (p. ex., Cloudflare Workers) e utilizar filas (ex.: Supabase Tasks, RabbitMQ, n8n) para evitar sobrecarga.

6. Roadmap de Implementação

Modelagem: adicionar campos motivation_phrase, reward_label, reward_icon, pdf_url, reward_claimed e reward_timestamp nas tabelas existentes. Criar tabela motivation_phrases se optar por centralizar.

Edge Functions: implementar complete_day, generate_day_pdf e get_day_content; configurar fila para geração de PDF.

Refatorar Front‑end: ajustar hooks useDay/useDays e UserProgressContext para consumir as novas funções. Atualizar ChallengeEditor com campos de motivação/recompensa.

Testar PDF: criar templates de relatório, validar com diferentes dados de usuário e incluir a frase motivadora e recompensa.

Lançar Nova Versão: migrar dados antigos (se houver), comunicar usuários sobre a nova funcionalidade e monitorar logs.

7. Conclusão

Esta especificação técnica adapta o backend do Desafio 15 FIRE ao repositório atual, aproveitando o Supabase como base de dados, autenticação e storage. As modificações propostas — novas colunas para motivação e recompensa, persistência de progresso em day_progress, e Edge Functions para conclusão do dia e geração de PDF — alinham a infraestrutura às funcionalidades exigidas pelo curso. Ao implementar essas mudanças, o sistema fornecerá uma experiência mais rica, segura e motivadora aos participantes, ao mesmo tempo que permite melhor administração e escalabilidade.