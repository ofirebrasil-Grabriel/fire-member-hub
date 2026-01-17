# Desafio FIRE Brasil 15D — Conteúdo Reescrevido (v2)

Este documento apresenta o conteúdo reescrito do desafio de 15 dias, seguindo a estrutura obrigatória solicitada, com foco na experiência de fluxo de usuário em um aplicativo e na infraestrutura de backend integrada.

---

## Dia 1 — Boas-vindas e Despertar

**🌅 Mensagem matinal**
Se você está aqui, é porque decidiu que é hora de **assumir o controle** da sua vida financeira. Talvez o medo ou a ansiedade tenham te paralisado, mas hoje, com gentileza, você dará o primeiro passo para a transformação. **A promessa do dia é: você vai identificar suas crenças e emoções sobre dinheiro para iniciar sua jornada com clareza.**

**📚 Conceito FIRE do dia**
O pilar inicial do FIRE (Financial Independence, Retire Early) é a **Consciência Financeira**. Não existe liberdade sem saber onde você está. O movimento propõe que, ao invés de apenas focar em "ganhar mais", você deve focar em "gastar com propósito", eliminando o consumo inconsciente. Isso leva à **Autonomia sobre o Tempo**, pois cada real economizado e investido reduz o tempo que você precisa trabalhar por necessidade. O desafio começa com a introspecção, pois suas emoções e crenças são o motor (ou o freio) dos seus hábitos financeiros.

**✅ Seu desafio hoje**
Seu objetivo é fazer um **diagnóstico emocional e prático** inicial, estabelecendo seu ponto de partida no desafio. Ao final, você terá seu perfil emocional inicial e um compromisso de tempo diário para a transformação.

**🎯 SUA TAREFA PRÁTICA — Passo a passo detalhado (guiado no app)**

O app se abre na **Aba "Tema do dia"**, com uma breve introdução e o conceito FIRE. Ao clicar em "Iniciar Tarefa", você é levado para a **Aba "Tarefa do dia"**, que funciona como um **Wizard de 12 passos** (uma pergunta por tela), para evitar a fadiga de preenchimento.

1.  **Wizard de 12 Passos: Seu Retrato Financeiro e Emocional**
    *   **Preparação automática:** O app exibe uma **Barra de Progresso** (0/12) no topo e um botão **"Voltar"** (habilitado a partir do 2º passo).
    *   **Passos 1 a 11 (Análise de Crenças e Situação):** O usuário responde a uma pergunta por tela.
        *   **Passo 1 (Sentimento):** *Select (dropdown)* com opções (leve / pesado / dá vontade de fugir). **Validação:** Campo obrigatório.
        *   **Passo 2 (Lembranças):** *Input de Texto (obrigatório)*. **Validação:** Mínimo de 50 caracteres para garantir reflexão.
        *   **Passo 3 (Crenças):** *Input de Texto (obrigatório)*. **Validação:** Mínimo de 50 caracteres.
        *   **Passo 4 (Emoções):** *Multi-select (checkboxes)*.
        *   **Passo 5 (Vida Ideal):** *Input de Texto (obrigatório)*. **Validação:** Mínimo de 100 caracteres (foco no propósito).
        *   **Passo 6 (Situação Crítica):** *Multi-select (checkboxes)*.
        *   **Passo 7 (Renda):** *Input de Valor (obrigatório)*. **Validação:** Apenas números, formato monetário (R$ X.XXX,XX).
        *   **Passo 8 (Maiores Pesos):** *Multi-select (checkboxes)*.
        *   **Passo 9 (Parceiro):** *Select (dropdown)*.
        *   **Passo 10 (Trava):** *Multi-select (checkboxes)*.
        *   **Passo 11 (Meta):** *Select (dropdown)*.
        *   *Ação:* **"Próximo"** (CTA principal) ou **"Voltar"** (CTA secundário).

2.  **Passo 12: O Compromisso Mínimo e o Respirar**
    *   **Preparação automática:** O app exibe um *card* de resumo com a **Meta** (Q11) e a **Renda** (Q7).
    *   **Escolhas do usuário (Compromisso):**
        *   *Select (dropdown):* Período do dia (Manhã, Tarde, Noite).
        *   *Input de Horário:* Horário específico (ex.: 20:30).
        *   *Input de Texto (obrigatório):* Meu "passo mínimo" (ex.: "Só abrir o app", "Ler a mensagem matinal").
    *   **Escolhas do usuário (Respirar):**
        *   *Slider (0 a 10):* Marque seu estado emocional ao pensar em dinheiro (0 = Pânico, 10 = Totalmente no controle).
        *   *Input de Texto (obrigatório):* Justifique sua nota em uma frase.
    *   **Processamento/automação:** A nota é registrada no `daily_log`.
    *   **Ações e Resultados:**
        *   *CTA:* **"Concluir Dia 1 e Agendar Lembretes"**.
        *   Ao clicar, o app exibe uma **mensagem de sucesso** ("Seu ponto de partida foi registrado!") e agenda automaticamente as notificações diárias no horário escolhido. O usuário é redirecionado para a Aba "Desafio Concluído".

**Infra estrutura (backend + outputs no app)**

| Entidade | Campos Essenciais | Regras/Cálculos do Backend | Consumo/Preparo de Dados |
| :--- | :--- | :--- | :--- |
| `users` | `id`, `email`, `name`, `fire_status` (iniciante) | - | - |
| `initial_assessment` | `user_id`, `sentimento_hoje`, `primeiras_lembrancas`, `crencas_rico_pobre`, `emocoes_atuais` (JSON), `vida_ideal`, `situacao_critica` (JSON), `renda_mensal`, `maiores_pesos` (JSON), `parceiro_financeiro`, `maior_trava` (JSON), `meta_15dias` | - | Prepara dados para o **Dia 2** (`renda_mensal`, `maiores_pesos`) e **Dia 15** (`meta_15dias`). |
| `daily_log` | `user_id`, `day_number`, `respirar_score`, `respirar_justificativa`, `horario_diario`, `passo_minimo` | Gera notificações diárias no horário escolhido. | Consumido pelo **Dia 15** para o painel de progresso. |

### 📊 Front-end do Relatório Final (Output no App)

Após a conclusão, o usuário é direcionado para a **Aba "Desafio Concluído"** com o relatório final:
*   **Card "Análise de Crenças Limitantes":** Exibe uma análise textual gerada pelo app, cruzando as respostas sobre **Lembranças** (Q2), **Ricos/Pobres** (Q3) e **Trava** (Q10). O app identifica a principal crença (ex.: "Dinheiro é sujo" ou "Riqueza é sorte").
*   **Guia "Reprogramação de Crenças (3 Passos)":** Um *stepper* visual com o passo a passo para iniciar a mudança de mentalidade, baseado na **Vida Ideal** (Q5).
*   **Card "Seu Ponto de Partida":** Exibe a **Situação Crítica** (Q6) em *badges* de alerta e a **Renda Mensal** (Q7).
*   **Gráfico de Linha "Evolução do Respirar":** Mostra o ponto inicial (Dia 1) da nota do Termômetro "Respirar" (0-10).
*   **Card "Compromisso Diário":** Exibe o horário agendado e o "Passo Mínimo" definido.

---

## Dia 2 — Raio-X do Caos

**🌅 Mensagem matinal**
Organizar as finanças não exige mágica, mas sim **sinceridade**. Hoje, você vai encarar os números sem julgamentos, mapeando exatamente para onde seu dinheiro está indo. Lembre-se: números são amigos, e **a promessa do dia é: você terá um diagnóstico claro de quanto entra e quanto sai do seu bolso.**

**📚 Conceito FIRE do dia**
O **Raio-X Financeiro** é a base do FIRE. A metodologia exige **consciência absoluta** da sua realidade. Isso significa listar todas as fontes de renda e categorizar cada despesa em **Fixa**, **Variável** e **Dívida**. O objetivo é encontrar o seu *Net Worth* (Patrimônio Líquido) atual, mesmo que negativo. Este diagnóstico é o mapa que permitirá cortes cirúrgicos e renegociações inteligentes nos próximos dias.

**✅ Seu desafio hoje**
Seu objetivo é **inventariar todas as suas receitas e despesas** dos últimos meses para calcular sua sobra ou falta mensal. Ao final, você terá uma visão gráfica do seu fluxo de caixa.

**🎯 SUA TAREFA PRÁTICA — Passo a passo detalhado (guiado no app)**

Na **Aba "Tarefa do dia"**, você encontra um **Stepper** de 4 etapas para preenchimento, com a **Barra de Progresso** no topo. O foco é na **qualidade e granularidade** dos dados.

1.  **Passo 1: Entradas (Receitas)**
    *   **Preparação automática:** O app puxa a `renda_mensal` (Q7 do Dia 1) e a exibe em um *card* de sugestão.
    *   **Escolhas do usuário:** Você preenche um **Formulário de Lista** interativo para cada fonte de renda.
        *   *Input de Texto (obrigatório):* Nome da fonte (ex.: Salário CLT, Freela X).
        *   *Input de Valor (obrigatório):* Valor **Líquido** médio mensal. **Validação:** Formato monetário (R$ X.XXX,XX).
        *   *Select (dropdown):* Frequência (Mensal, Quinzenal, Variável).
        *   *Select (dropdown):* Dia de pagamento (ex.: 5º dia útil, Dia 15).
    *   **Processamento/automação:** O app calcula o **Total de Entradas** em tempo real, exibido em um *badge* flutuante.
    *   **Ações:** *CTA:* **"Adicionar Receita"** (adiciona à lista) e **"Próximo Passo"**.

2.  **Passo 2: Saídas Fixas (Obrigações Recorrentes)**
    *   **Escolhas do usuário:** Você preenche uma **Lista Pré-Categorizada** (Habitação, Serviços Essenciais, Educação, Saúde).
        *   *Input de Texto (obrigatório):* Descrição (ex.: Aluguel, Conta de Luz).
        *   *Input de Valor (obrigatório):* Valor exato. **Validação:** Formato monetário.
        *   *Input de Data:* Dia de vencimento (ex.: Dia 10).
        *   *Toggle:* **Essencial** (ON/OFF). **Regra:** O app sugere ON para categorias como Aluguel.
    *   **Processamento/automação:** O app calcula o **Total de Saídas Fixas** e o exibe em um *card* de resumo.
    *   **Ações:** *CTA:* **"Adicionar Despesa Fixa"** e **"Próximo Passo"**.

3.  **Passo 3: Saídas Variáveis e Dívidas (Onde o dinheiro 'some')**
    *   **Escolhas do usuário:** Você preenche uma **Lista Editável** para gastos variáveis e dívidas.
        *   *Input de Valor (obrigatório):* Valor médio mensal (ex.: R$ 800,00 para Mercado).
        *   *Select (dropdown):* Categoria (Alimentação, Lazer, Transporte, Assinaturas, etc.).
        *   *Select (dropdown):* **Período Esperado** (Início do Mês - Dias 1 a 10, Meio do Mês - Dias 11 a 20, Fim do Mês - Dias 21 a 30). **Validação:** Campo obrigatório.
        *   *Checkbox:* Marcar se é uma **Dívida** (ativa um **Formulário Modal** para detalhamento).
    *   **Formulário Modal (Dívida):**
        *   *Input de Texto (obrigatório):* Credor (ex.: Banco X, Cartão Y).
        *   *Input de Valor (obrigatório):* **Valor Total da Dívida** (Principal).
        *   *Input de Valor (obrigatório):* **Taxa de Juros Mensal** (%).
        *   *Input de Número (obrigatório):* Parcelas restantes.
        *   *Input de Valor (obrigatório):* Valor da Parcela Mensal.
    *   **Processamento/automação:** O app separa automaticamente os itens marcados como **Dívida** para a entidade `debts` e calcula a **Proporção Juros/Principal** na parcela.
    *   **Ações:** *CTA:* **"Adicionar Item"** e **"Próximo Passo"**.

4.  **Passo 4: Resumo e Sentimento (Validação Final)**
    *   **Processamento/automação:** O app exibe um **Resumo Automático** em um *card* grande, puxando os totais dos passos anteriores:
        *   Total de Entradas: R$ X.XXX,XX
        *   Total de Saídas Fixas: R$ Y.YYY,YY
        *   Total de Saídas Variáveis: R$ Z.ZZZ,ZZ
        *   **Total de Dívidas (Parcelas):** R$ W.WWW,WW
        *   **Sobra/Falta Mensal (Net Flow):** R$ S.SSS,SS (destacado em verde se positivo, vermelho se negativo).
    *   **Alerta de Validação:** Se o **Net Flow** for muito diferente da `renda_mensal` (Dia 1), o app exibe um **Alerta de Inconsistência** e sugere revisar os passos.
    *   **Escolhas do usuário:** *Input de Texto (obrigatório):* Meu sentimento ao ver os números (ex.: Alívio, Medo, Surpresa).
    *   **Ações:** *CTA:* **"Concluir Dia 2 e Gerar Gráfico"**. O app salva todos os dados nas entidades correspondentes.

**Infra estrutura (backend + outputs no app)**

| Entidade | Campos Essenciais | Regras/Cálculos do Backend | Consumo/Preparo de Dados |
| :--- | :--- | :--- | :--- |
| `income_items` | `user_id`, `name`, `value` (líquido), `frequency`, `payment_day` | Soma o total de entradas (`net_income`). | Prepara `net_income` para o **Dia 9**. |
| `expenses` | `user_id`, `name`, `value`, `category`, `type` (fixa/variável), `due_day`, `expected_period` (início/meio/fim), `is_essential` (boolean), `is_debt` (boolean) | Calcula o **Net Flow** (`net_income` - `total_expenses`). Projeta o fluxo de caixa semanal com base em `due_day` e `expected_period`. | Prepara `total_expenses` para o **Dia 3** (variáveis) e **Dia 7** (calendário). |
| `debts` | `user_id`, `creditor`, `total_principal`, `interest_rate`, `remaining_installments`, `monthly_installment`, `installment_interest_portion`, `installment_principal_portion` | Calcula a proporção Juros/Principal em cada parcela. | Prepara dados para o **Dia 10** (Mapa de Negociação) e **Dia 5** (se for cartão). |
| `daily_log` | `user_id`, `day_number`, `net_flow_result`, `feeling_text` | - | Consumido pelo **Dia 15** para o painel de progresso. |

### 📊 Front-end do Relatório Final (Output no App)

O relatório final do Raio-X é um dashboard de fluxo de caixa:
*   **Card de Resumo Financeiro (Topo):** Exibe 3 métricas principais: **Total de Entradas**, **Total de Saídas** e **Sobra/Falta Mensal** (destacado em verde ou vermelho grande).
*   **Gráfico de Pizza "Distribuição de Saídas":** Mostra a proporção de Saídas Fixas, Saídas Variáveis e Dívidas em relação ao total de saídas.
*   **Tabela "Inventário de Dívidas":** Lista as dívidas com colunas para **Credor**, **Valor Total** e **Juros %** (preparando o terreno para o Dia 10).
*   **Card "Sentimento Registrado":** Exibe o texto inserido pelo usuário sobre como se sente ao ver os números.

---

## Dia 3 — Arqueologia Financeira

**🌅 Mensagem matinal**
Hoje, você fará uma **arqueologia financeira**, vasculhando seu passado recente para entender seus padrões de consumo. O objetivo não é se culpar, mas aprender com a história. **A promessa do dia é: você vai identificar os 20% dos gastos que causam 80% dos seus problemas financeiros.**

**📚 Conceito FIRE do dia**
O **Princípio de Pareto** (80/20) aplicado ao FIRE diz que uma pequena parcela dos seus gastos é responsável pela maior parte do seu descontrole. Ao analisar os últimos 90 dias, você identifica esses **"drenos"** e os **gastos sazonais** que precisam ser provisionados. O histórico é seu professor: ele mostra os comportamentos que precisam ser mudados para que o futuro seja diferente.

**✅ Seu desafio hoje**
Seu objetivo é **categorizar suas transações recentes**, identificar os gastos "sombra" (pequenos vazamentos) e definir os hábitos que você precisa reduzir ou manter.

**🎯 SUA TAREFA PRÁTICA — Passo a passo detalhado (guiado no app)**

Na **Aba "Tarefa do dia"**, você encontra uma tela de **Arqueologia Financeira** com foco em categorização e insights.

1.  **Preparação automática:** O app exibe um *card* com a **Média Mensal de Gastos Variáveis** (filtrado da entidade `expenses` com `type='variável'` do Dia 2). Abaixo, uma **Tabela Interativa de Transações** é carregada. O app oferece um **Botão "Importar Extrato"** (CSV/OFX) ou a opção de **"Inserir Manualmente"** as 10 maiores transações variáveis dos últimos 90 dias. O app também exibe um **Card de Alerta** se a maioria dos gastos variáveis estiver concentrada no mesmo `expected_period`.

2.  **Escolhas do usuário:** Você interage com a Tabela de Transações.
    *   *Coluna "Categoria" (Select):* Para cada transação, você seleciona a categoria (Alimentação, Transporte, Lazer, Serviços, Outros). **Regra:** O app sugere a categoria com base em palavras-chave (ex.: "Uber" -> Transporte).
    *   *Coluna "Status" (Toggle):* Você marca cada transação como **Essencial** ou **Supérfluo**.
    *   *Checkbox:* Você marca as transações que são **"Sombra"** (pequenos gastos recorrentes ou assinaturas esquecidas).

3.  **Processamento/automação:**
    *   O app gera um **Resumo Analítico** em tempo real em um painel lateral:
        *   *Gráfico de Pizza:* Distribuição percentual dos gastos por categoria.
        *   *Card:* Seu **Top 5** de despesas variáveis em valor total.
        *   *Lista:* Total de gastos **"Sombra"** identificados (separados para o Dia 6).

4.  **Escolhas do usuário (Insights Comportamentais):**
    *   *Input de Texto (obrigatório):* Três hábitos que você pretende reduzir ou eliminar.
    *   *Input de Texto (obrigatório):* Duas despesas que valem cada centavo (para manter com consciência).

5.  **Ações e Resultados:**
    *   *CTA:* **"Concluir Dia 3 e Salvar Insights"**.
    *   O app exibe uma **mensagem de alerta** se o usuário não tiver marcado pelo menos 3 itens como "Sombra", sugerindo uma revisão. Ao concluir, o app salva os dados e prepara a lista de `shadow_expenses` para o Dia 6.

**Infra estrutura (backend + outputs no app)**

| Entidade | Campos Essenciais | Regras/Cálculos do Backend | Consumo/Preparo de Dados |
| :--- | :--- | :--- | :--- |
| `transactions` | `user_id`, `date`, `description`, `value`, `category`, `status` (essencial/supérfluo), `is_shadow` (boolean) | Calcula o Top 5 de gastos e o total de gastos por categoria. | Consome `variable_expenses` do **Dia 2** para categorização inicial. Prepara dados para o **Dia 6** (`is_shadow = true`). |
| `shadow_expenses` | `user_id`, `transaction_id`, `status` (a_cortar/a_pausar/a_manter) | - | Consumido pelo **Dia 6**. |
| `insights` | `user_id`, `habitos_reduzir` (JSON), `despesas_manter` (JSON) | - | - |

### 📊 Front-end do Relatório Final (Output no App)

O relatório foca na análise comportamental dos gastos:
*   **Gráfico de Barras "Top 5 Despesas Variáveis":** Exibe as 5 categorias de maior gasto nos últimos 90 dias.
*   **Card "Vazamentos Identificados":** *Badge* com o **Número de Transações "Sombra"** e o **Valor Total** dessas transações.
*   **Lista "Hábitos e Foco":** Exibe os 3 hábitos a reduzir e as 2 despesas a manter, com um ícone de "Foco" ao lado.
*   **Gráfico de Linha "Evolução do Respirar":** Atualizado com a nota do Dia 3, permitindo a comparação com o Dia 1.

---

## Dia 4 — Regra da Pausa

**🌅 Mensagem matinal**
Se você está escorregando, a primeira coisa a fazer é parar de cair. Hoje, você vai implementar seu **freio de emergência** financeiro. **A promessa do dia é: você vai estancar a sangria de novos endividamentos e ganhar tempo para pensar antes de comprar.**

**📚 Conceito FIRE do dia**
**Parar de piorar é o primeiro passo para melhorar.** O FIRE ensina que não adianta negociar dívidas se você continua criando novas. A **Regra da Pausa** é um mecanismo de defesa que combina duas ações: **congelar** meios de pagamento de alto risco (como cartões de crédito) e aplicar a **Regra das 24 Horas** para compras não essenciais. Isso cria um espaço de reflexão entre o desejo e a ação, fortalecendo seu músculo da disciplina.

**✅ Seu desafio hoje**
Seu objetivo é **desativar o piloto automático do consumo** e definir um protocolo de uso para seus meios de pagamento, garantindo que o cartão de crédito seja uma ferramenta, e não uma armadilha.

**🎯 SUA TAREFA PRÁTICA — Passo a passo detalhado (guiado no app)**

Na **Aba "Tarefa do dia"**, você encontra uma tela de **Controle de Impulso** dividida em duas seções: "Meios de Pagamento" e "Regra das 24h".

1.  **Seção 1: Meios de Pagamento e Congelamento**
    *   **Preparação automática:** O app lista todos os cartões e meios de pagamento identificados no **Dia 2** em **Cards de Ação** individuais.
    *   **Escolhas do usuário:** Para cada item na lista:
        *   *Input de Valor:* Limite atual (apenas para visualização).
        *   *Toggle:* **"Congelar Função Crédito"** (ON/OFF).
        *   *Toggle:* **"Definir como Emergencial"** (ON/OFF). **Regra:** Apenas um cartão pode ter este toggle ativo.
    *   **Processamento/automação:** Se "Emergencial" for ON, o app solicita:
        *   *Input de Valor (obrigatório):* **Limite Emergencial**. **Validação:** O app exibe um **Alerta de Regra** se o limite for maior que 20% da sua renda mensal (Dia 1).
    *   **Ações:** *CTA:* **"Solicitar Redução de Limite"** (abre um pop-up com o link/telefone do banco).

2.  **Seção 2: Regra das 24 Horas e Gatilhos**
    *   **Escolhas do usuário:**
        *   *Multi-select (checkboxes):* Selecione seus **Gatilhos Emocionais** (Ansiedade, Tédio, Pressão Social, Outro).
        *   *Select (dropdown):* Escolha sua **Ação Substituta** (Caminhar 10 min, Ligar para amigo, Beber água, Meditar).
    *   **Ações (Simulação e Ativação):**
        *   *Botão Flutuante:* **"Quero Comprar (Ativar Pausa)"**. Ao clicar, abre um **Formulário Modal** para: *Input de Texto* (Item desejado), *Input de Valor* (Preço aproximado).
        *   *CTA:* **"Agendar Lembrete para 24h"**. O app registra a `purchase_request` e agenda uma notificação.

3.  **Ações Finais:**
    *   *CTA:* **"Concluir Dia 4 e Ativar Regras"**.
    *   O app salva o status de congelamento dos cartões e ativa o sistema de lembretes de 24h. O usuário é redirecionado para a Aba "Desafio Concluído".

**Infra estrutura (backend + outputs no app)**

| Entidade | Campos Essenciais | Regras/Cálculos do Backend | Consumo/Preparo de Dados |
| :--- | :--- | :--- | :--- |
| `payment_methods` | `user_id`, `name`, `limit`, `status` (ativo/congelado/emergencial), `emergency_limit` | Trava o uso do cartão emergencial acima do limite definido. | Consome `debts` do **Dia 2**. Prepara dados para o **Dia 13** (`card_rules`). |
| `purchase_requests` | `user_id`, `item`, `value`, `request_date`, `release_date`, `status` (pendente/comprado/cancelado) | Gera notificação 24 horas após o registro. | Consumido pelo **Dia 6** (para análise de compras por impulso). |
| `triggers` | `user_id`, `emotional_triggers` (JSON), `substitute_action` | - | - |

### 📊 Front-end do Relatório Final (Output no App)

O relatório confirma a ativação das travas de segurança:
*   **Card "Status dos Cartões":** Exibe o número de cartões **Congelados** e o nome do **Cartão Emergencial** com seu **Limite Definido** (R$ X.XX).
*   **Lista "Regra das 24h Ativa":** Exibe o **Gatilho Emocional** e a **Ação Substituta** definidos.
*   **Tabela "Histórico de Pausas":** Lista as `purchase_requests` (Item, Valor, Data de Liberação) com *badges* de status (Pendente/Comprado/Cancelado).
*   **Card "Seu Freio de Mão":** Mensagem de confirmação: "Regra da Pausa ativada. Você ganhou tempo para pensar."

---

## Dia 5 — Cartão: Parar a Fatura de Crescer

**🌅 Mensagem matinal**
O cartão de crédito é uma ferramenta poderosa, mas seus juros rotativos são um dos maiores inimigos da sua liberdade. Hoje, você vai domar essa ferramenta, transformando-a em aliada. **A promessa do dia é: você terá um plano concreto para eliminar o rotativo e controlar o crescimento da sua fatura.**

**📚 Conceito FIRE do dia**
**Cartão como ferramenta, não como armadilha.** O FIRE prega o uso estratégico do crédito: pagar a fatura integralmente e usar o cartão apenas para ganhar milhas ou *cashback*. O conceito de **"Juros Compostos Inversos"** é crucial: o dinheiro que você paga em juros é dinheiro que nunca trabalhará para você. O plano de hoje visa estancar essa perda e garantir que o cartão não seja mais um dreno.

**✅ Seu desafio hoje**
Seu objetivo é **estruturar um plano de pagamento** para qualquer saldo devedor do cartão e **definir regras de uso** para evitar novos endividamentos.

**🎯 SUA TAREFA PRÁTICA — Passo a passo detalhado (guiado no app)**

Na **Aba "Tarefa do dia"**, você encontra um **Stepper** de 3 passos focado no controle do cartão.

1.  **Passo 1: Diagnóstico do Rotativo**
    *   **Preparação automática:** O app puxa os dados do cartão (limite, taxa de juros, saldo devedor) do **Dia 2** e **Dia 4** e exibe em um **Card de Status**.
    *   **Escolhas do usuário:**
        *   *Input de Valor (obrigatório):* Saldo atual da fatura (se houver). **Validação:** Formato monetário.
        *   *Select (dropdown):* Opção de pagamento (Integral, Mínimo, Parcelamento da Fatura).
    *   **Processamento/automação:** O app calcula a **Projeção de Juros** e exibe um **Alerta de Risco** em vermelho se o pagamento for menor que o total.

2.  **Passo 2: Plano de Quitação Sustentável**
    *   **Preparação automática:** O app exibe a **Sobra/Falta Mensal** (Dia 2) como limite para o Slider.
    *   **Escolhas do usuário:** Você define sua estratégia de ataque ao rotativo.
        *   *Slider:* **Valor Extra Mensal** que você pode destinar ao cartão (de R$ 0 até o valor da sua sobra/falta).
        *   *Select (dropdown):* Estratégia (Acelerar, Manter o Mínimo, Renegociar).
    *   **Processamento/automação:** O app gera um **Cronograma de Quitação** em um *card* de resultado em tempo real:
        *   *Resultado:* **Tempo Estimado para Quitação** (em meses).
        *   *Resultado:* **Economia Total de Juros** (em R$).
    *   **Ações:** *CTA:* **"Simular e Próximo Passo"**.

3.  **Passo 3: Regras de Uso Futuro**
    *   **Escolhas do usuário:** Você define as travas de segurança.
        *   *Toggle:* **"Notificação de Compra Acima de R$ X"** (Input de Valor obrigatório).
        *   *Toggle:* **"Bloquear Compras em Categoria X"** (Multi-select de categorias: Jogos, Apostas, Lazer).
        *   *Input de Texto (obrigatório):* Minha regra de ouro para o cartão (ex.: "Só usar para compras com retorno").
    *   **Ações:** *CTA:* **"Concluir Dia 5 e Ativar Plano"**. O app salva o `revolving_plan` e as `card_rules`.

**Infra estrutura (backend + outputs no app)**

| Entidade | Campos Essenciais | Regras/Cálculos do Backend | Consumo/Preparo de Dados |
| :--- | :--- | :--- | :--- |
| `credit_cards` | `user_id`, `limit`, `due_date`, `current_balance`, `revolving_plan` (JSON) | Calcula a projeção de juros e o cronograma de quitação com base no valor extra. | Consome `payment_methods` do **Dia 4**. Prepara dados para o **Dia 13** (regras de cartão). |
| `card_rules` | `user_id`, `max_purchase_value`, `blocked_categories` (JSON), `golden_rule` | Gera alertas de uso em tempo real. | Consumido pelo **Dia 15** (Painel de Progresso). |
| `negotiation_requests` | `user_id`, `creditor`, `type` (rotativo), `status` | - | Prepara dados para o **Dia 10**. |

### 📊 Front-end do Relatório Final (Output no App)

O relatório é um resumo do plano de ataque ao cartão:
*   **Card "Plano de Quitação Ativo":** Exibe o **Valor Extra Mensal** destinado e o **Tempo Estimado para Quitação** (em meses).
*   **Gráfico de Linha "Projeção de Dívida":** Mostra a curva de redução do saldo devedor ao longo dos meses, destacando a **Economia Total de Juros** em um *badge*.
*   **Lista "Regras de Uso Ativas":** Exibe a **Regra de Ouro** e as travas de segurança (ex.: "Notificação acima de R$ 200,00").
*   **Notificação de Sucesso:** "Parabéns! Você transformou seu cartão de vilão em ferramenta."

---

## Dia 6 — Vazamentos Invisíveis

**🌅 Mensagem matinal**
Não são os grandes erros que nos afundam, mas os **pequenos furos** que ignoramos. Assinaturas esquecidas, tarifas bancárias e pedidos de delivery automáticos somam fortunas. **A promessa do dia é: você vai eliminar os gastos invisíveis e liberar recursos imediatos para suas prioridades.**

**📚 Conceito FIRE do dia**
**Goteira mata sede?** No FIRE, um gasto de R$ 30 repetido 10 vezes é mais caro do que um gasto de R$ 300 uma vez. O foco é na **atenção consciente**. Cortar esses vazamentos não é sacrifício, mas **lucidez**. Cada real economizado aqui vai direto para a quitação de dívidas ou para a sua caixinha de emergência, acelerando sua liberdade.

**✅ Seu desafio hoje**
Seu objetivo é **revisar e tomar uma decisão** sobre cada gasto "sombra" identificado, transformando-o em economia real.

**🎯 SUA TAREFA PRÁTICA — Passo a passo detalhado (guiado no app)**

Na **Aba "Tarefa do dia"**, você encontra uma **Lista de Decisão Interativa** para eliminar vazamentos.

1.  **Preparação automática:** O app carrega a lista de transações marcadas como **"Sombra"** no **Dia 3** em **Cards de Vazamento** individuais.
    *   *Card de Resumo:* Exibe a **Sobra/Falta Mensal** atual (Dia 2) para motivar a economia.

2.  **Escolhas do usuário:** Para cada Card de Vazamento:
    *   *Select (dropdown):* **Decisão** (Cortar Já, Pausar Temporariamente, Manter sob Controle). **Validação:** Se escolher "Manter sob Controle", o app exige um **Input de Valor** para o **Novo Limite Mensal**.
    *   *Input de Valor:* **Economia Mensal Estimada** (preenchido automaticamente com o valor do gasto).
    *   *CTA:* **"Link para Cancelamento"** (abre um pop-up com o site/telefone do serviço).

3.  **Seção de Tarifas Bancárias (Formulário Rápido):**
    *   **Escolhas do usuário:** *Input de Texto* (Tipo de Tarifa), *Input de Valor* (Valor mensal).
    *   **Ações:** *CTA:* **"Gerar Script de Renegociação"** (o app gera um texto pronto para enviar ao banco).

4.  **Processamento/automação:** O app atualiza em tempo real o **Resumo de Economia** em um *card* fixo no topo:
    *   *Resultado:* **Total de Vazamentos Cortados/Pausados:** X itens.
    *   *Resultado:* **Economia Mensal Total Prevista:** R$ X.XXX,XX (destacado em verde).

5.  **Ações Finais:**
    *   *CTA:* **"Concluir Dia 6 e Ajustar Orçamento"**.
    *   O app salva as decisões, atualiza a `sobra/falta` e registra os novos `variable_caps` (limites) para o Dia 9. O usuário é redirecionado para a Aba "Desafio Concluído".

**Infra estrutura (backend + outputs no app)**

| Entidade | Campos Essenciais | Regras/Cálculos do Backend | Consumo/Preparo de Dados |
| :--- | :--- | :--- | :--- |
| `shadow_expenses` | `user_id`, `transaction_id`, `decision` (cortar/pausar/manter), `estimated_savings` | Soma a economia total e atualiza o orçamento. | Consome `transactions` do **Dia 3**. Prepara dados para o **Dia 9** (ajuste do orçamento). |
| `bank_fees` | `user_id`, `type`, `value`, `negotiation_script` | - | - |
| `variable_caps` | `user_id`, `category`, `monthly_limit` | - | Consumido pelo **Dia 9**. |

### 📊 Front-end do Relatório Final (Output no App)

O relatório celebra a folga financeira criada:
*   **Card "Economia Gerada":** Exibe a **Economia Mensal Total Prevista** em destaque, com um ícone de "Moeda".
*   **Gráfico de Rosca "Status dos Vazamentos":** Mostra a proporção de itens que foram **Cortados**, **Pausados** e **Mantidos sob Controle**.
*   **Lista "Itens Cortados":** Exibe a lista de serviços e assinaturas eliminados.
*   **Card "Orçamento Ajustado":** Confirma o novo **Net Flow** (do Dia 2 + Economia do Dia 6).

---

## Dia 7 — Vencimentos: O Que Vence e Quando

**🌅 Mensagem matinal**
Chega de pagar juros por esquecimento! Colocar todos os seus compromissos em um **calendário único** é o antídoto contra o caos. **A promessa do dia é: você terá um calendário financeiro completo, sincronizado com sua renda, para nunca mais atrasar uma conta.**

**📚 Conceito FIRE do dia**
O **Calendário Financeiro** é a sua defesa contra os juros por atraso. No FIRE, evitar multas é tão importante quanto investir bem. A organização dos vencimentos permite que você **sincronize** as datas de pagamento com as datas de recebimento da sua renda, garantindo que o dinheiro esteja disponível no momento certo e reduzindo a necessidade de crédito.

**✅ Seu desafio hoje**
Seu objetivo é **mapear todas as suas obrigações** (fixas, variáveis, dívidas, sazonais) e **organizar o fluxo de caixa** dos próximos 30 dias.

**🎯 SUA TAREFA PRÁTICA — Passo a passo detalhado (guiado no app)**

Na **Aba "Tarefa do dia"**, você encontra uma tela de **Calendário Interativo** e gestão de obrigações.

1.  **Preparação automática:** O app carrega todas as `fixed_expenses` e as parcelas de `debts` (dos **Dias 2 e 5**) em uma **Lista de Obrigações** no formato de **Cards de Detalhe**.
    *   *Card de Resumo:* Exibe o **Total de Vencimentos** para o mês atual.

2.  **Escolhas do usuário:** Você revisa e complementa a lista.
    *   *Input de Texto:* Adicionar obrigações sazonais (ex.: IPVA, Matrícula Escolar).
    *   *Select (dropdown):* Para cada obrigação, defina a **Prioridade** (Essencial, Importante, Negociável). **Validação:** Campo obrigatório.
    *   *Toggle:* **"Lembrete Ativo"** (ON/OFF).
    *   *CTA:* **"Solicitar Alteração de Vencimento"** (abre um pop-up com o roteiro de contato).

3.  **Seção de Receitas:**
    *   **Preparação automática:** O app puxa as datas de entrada de renda (do **Dia 2**).
    *   **Escolhas do usuário:** Você confirma ou adiciona outras datas de recebimento.

4.  **Processamento/automação:** O app gera o **Calendário Mensal** em um *widget* grande.
    *   **Visualização:** Layout de calendário com os dias marcados em cores: Verde (Entrada de Renda), Vermelho (Vencimento de Conta Fixa/Dívida), **Azul Claro (Pico de Gasto Variável - baseado no `expected_period`)**, Amarelo (Lembrete Ativo).
    *   *Filtro:* **"Visualizar por Prioridade"** (permite filtrar o calendário para ver apenas contas Essenciais).

5.  **Ações Finais:**
    *   *CTA:* **"Concluir Dia 7 e Agendar Notificações"**.
    *   O app salva as prioridades e agenda notificações *push* 3 dias antes de cada vencimento. O usuário é redirecionado para a Aba "Desafio Concluído".

**Infra estrutura (backend + outputs no app)**

| Entidade | Campos Essenciais | Regras/Cálculos do Backend | Consumo/Preparo de Dados |
| :--- | :--- | :--- | :--- |
| `obligations` | `user_id`, `name`, `value`, `due_date`, `recurrence`, `priority` (essencial/importante/negociável), `is_paid` | Ordena as contas por data de vencimento. Gera lembretes com 3 dias de antecedência. | Consome `fixed_expenses` e `debts` (parcelas) dos dias anteriores. Prepara dados para o **Dia 8** (Prioridades) e **Dia 9** (Orçamento). |
| `income_dates` | `user_id`, `date`, `value` | - | - |
| `calendar_items` | `user_id`, `date`, `type` (vencimento/receita/lembrete) | - | - |

### 📊 Front-end do Relatório Final (Output no App)

O relatório é o seu novo centro de controle de pagamentos:
*   **Visualização "Calendário de Vencimentos":** Exibe o calendário mensal com os dias de vencimento e recebimento destacados.
*   **Card "Próximos 7 Dias":** Lista as contas mais urgentes, com *badges* de **Prioridade** (Essencial, Importante) e um *toggle* para marcar como **Paga**.
*   **Gráfico de Barras "Fluxo de Caixa Semanal":** Mostra a entrada de renda versus o total de vencimentos para cada semana do mês, identificando semanas de maior aperto.
*   **Notificação de Sucesso:** "Seu calendário financeiro está ativo. Lembretes agendados."

---

## Dia 8 — Prioridades Quando Não Dá Pra Pagar Tudo

**🌅 Mensagem matinal**
Em momentos de aperto, a ansiedade pode nos fazer pagar a conta "mais barulhenta". Hoje, você vai aprender a **priorizar racionalmente**, protegendo o essencial e evitando consequências graves. **A promessa do dia é: você terá uma Matriz de Prioridade para tomar decisões frias em momentos de crise.**

**📚 Conceito FIRE do dia**
**Prioridade com Propósito.** O FIRE ensina que cada real deve ter uma missão: primeiro, **proteger o básico** (moradia, saúde, alimentação); segundo, **evitar multas e juros altos**. Ao definir uma **Matriz de Prioridade** (Importância x Consequência), você cria um **Modo de Emergência** pré-definido, que reduz o pânico e garante que as decisões tomadas sejam as mais estratégicas para a sua sobrevivência financeira.

**✅ Seu desafio hoje**
Seu objetivo é **classificar suas obrigações** por nível de importância e consequência de atraso, e **simular um plano de pagamento emergencial** para o mês atual.

**🎯 SUA TAREFA PRÁTICA — Passo a passo detalhado (guiado no app)**

Na **Aba "Tarefa do dia"**, você encontra uma tela de **Matriz de Prioridade e Simulação de Crise**.

1.  **Preparação automática:** O app carrega a `obligations` do **Dia 7** em uma **Tabela de Classificação** interativa.
    *   *Card de Resumo:* Exibe a **Sobra/Falta Mensal** (Dia 2/6) para contextualizar a simulação.

2.  **Escolhas do usuário:** Para cada obrigação na tabela:
    *   *Select (dropdown):* **Prioridade** (Essencial, Importante, Negociável, Pausável). **Validação:** O app sugere a prioridade com base na categoria (ex.: Aluguel -> Essencial).
    *   *Select (dropdown):* **Consequência do Atraso** (Grave - corte/negativação, Moderada - multa/juros, Leve - aviso).

3.  **Processamento/automação:** O app gera a **Matriz de Prioridade** em um **Gráfico de Quadrantes** em tempo real.
    *   *Visualização:* O app ordena as contas, destacando o quadrante de **Ataque Imediato** (Essencial + Grave).

4.  **Simulação de Plano Emergencial:**
    *   **Escolhas do usuário:** *Input de Valor (obrigatório):* **Dinheiro Disponível para Pagamento** (simulando um cenário de crise).
    *   **Processamento/automação:** O app preenche automaticamente a **Lista de Decisão** seguindo a Matriz de Prioridade, priorizando o pagamento das contas mais críticas até o limite do dinheiro disponível.
        *   *Coluna "Decisão" (Toggle):* **Pagar** / **Negociar** / **Pausar**.
        *   *Card de Resumo:* Exibe **Contas Pagas** (Total R$), **Contas Negociadas** (Total R$), **Contas Pausadas** (Total R$).

5.  **Ações Finais:**
    *   *CTA:* **"Concluir Dia 8 e Salvar Plano Emergencial"**.
    *   O app salva o `payment_plan` e registra as contas marcadas como "Negociar" para o Dia 10. O usuário é redirecionado para a Aba "Desafio Concluído".

**Infra estrutura (backend + outputs no app)**

| Entidade | Campos Essenciais | Regras/Cálculos do Backend | Consumo/Preparo de Dados |
| :--- | :--- | :--- | :--- |
| `obligations` | `user_id`, `priority`, `consequence` (grave/moderada/leve) | Lógica de ordenação: 1º Essencial/Grave, 2º Importante/Grave, 3º Essencial/Moderada, etc. | Consome `obligations` do **Dia 7**. Prepara dados para o **Dia 10** (dívidas a negociar). |
| `payment_plan` | `user_id`, `month`, `available_cash`, `paid_items` (JSON), `negotiated_items` (JSON) | Simula o pagamento sequencial até o limite do `available_cash`. | Consumido pelo **Dia 14** (Plano 30/90). |
| `negotiation_actions` | `user_id`, `obligation_id`, `action_type` (negociar/pausar), `script_text` | - | - |

### 📊 Front-end do Relatório Final (Output no App)

O relatório é o seu guia de sobrevivência financeira:
*   **Matriz de Prioridade (Visual):** Exibe o gráfico de quadrantes com as contas mapeadas, destacando o quadrante **"Pagar Primeiro"** (Essencial + Grave).
*   **Card "Plano Emergencial Simulado":** Exibe o **Dinheiro Disponível** (R$ X.XX) e o resumo da simulação: **Contas Pagas** (R$ Y.YY), **Contas Negociadas** (R$ Z.ZZ).
*   **Lista "Próximas Ações":** Lista as contas marcadas como "Negociar" com um *CTA* direto para o Dia 10.
*   **Notificação de Sucesso:** "Você tem um plano. A ansiedade diminui quando a decisão é racional."

---

## Dia 9 — Orçamento Mínimo de 30 Dias

**🌅 Mensagem matinal**
Controlar o dinheiro é dar uma missão a cada real. Hoje, você vai construir seu **Orçamento Mínimo**, a soma exata do que você precisa para viver e trabalhar por 30 dias sem criar novas dívidas. **A promessa do dia é: você terá um teto de gastos claro e realista para o próximo mês.**

**📚 Conceito FIRE do dia**
**Liberdade com Disciplina.** O FIRE exige que você gaste menos do que ganha. O Orçamento Mínimo não é um castigo, mas uma **estratégia de sobrevivência** que garante que você foque no essencial. Ao definir **tetos variáveis** (para lazer, alimentação), você evita o consumo impulsivo e cria a folga necessária para atacar dívidas e construir sua reserva.

**✅ Seu desafio hoje**
Seu objetivo é **consolidar todos os seus gastos essenciais** e **definir limites rígidos** para os gastos variáveis, garantindo que o resultado final caiba na sua renda.

**🎯 SUA TAREFA PRÁTICA — Passo a passo detalhado (guiado no app)**

Na **Aba "Tarefa do dia"**, você encontra uma tela de **Orçamento Mínimo** com consolidação e definição de tetos.

1.  **Preparação automática:** O app carrega o **Custo Fixo Essencial** (soma das obrigações "Essencial" do Dia 8) e a **Renda Total** (Dia 2).
    *   *Card de Resumo:* Exibe a **Economia Prevista** (Dia 6) para mostrar o impacto positivo.

2.  **Bloco 1: Consolidação Essencial**
    *   **Processamento/automação:** O app exibe o **Custo Fixo Mínimo** em um *card* fixo.
    *   **Escolhas do usuário:** *Input de Valor (obrigatório):* **Reserva Imediata** (valor mínimo para imprevistos).

3.  **Bloco 2: Definição de Tetos Variáveis**
    *   **Escolhas do usuário:** Você define o limite máximo para categorias de alto risco.
        *   *Input de Valor (obrigatório):* Teto Mensal para **Alimentação/Mercado**.
        *   *Input de Valor (obrigatório):* Teto Mensal para **Transporte/Combustível**.
        *   *Input de Valor (opcional):* Teto Mensal para **Pequenos Prazeres** (Lazer Controlado).
        *   *Toggle:* **"Dividir Teto Semanalmente"** (ON/OFF).

4.  **Processamento/automação:** O app gera o **Resumo Final do Orçamento Mínimo** em um *card* grande em tempo real.
    *   *Resultado:* **Renda Total:** R$ X.XXX,XX.
    *   *Resultado:* **Orçamento Mínimo Total:** R$ Y.YYY,YY.
    *   *Alerta:* Se o Orçamento Mínimo for maior que a Renda Total, o app exibe um **Alerta de Regra Não Atendida** em vermelho, bloqueando o CTA final e sugerindo **"Revisar Vazamentos (Dia 6)"**.

5.  **Ações Finais:**
    *   *Input de Texto (obrigatório):* Minha Frase de Compromisso (ex.: "Vou respeitar meus tetos por 30 dias").
    *   *CTA:* **"Concluir Dia 9 e Ativar Alertas de Teto"**.
    *   O app salva o `budget_minimum` e ativa o monitoramento dos `weekly_caps`. O usuário é redirecionado para a Aba "Desafio Concluído".

**Infra estrutura (backend + outputs no app)**

| Entidade | Campos Essenciais | Regras/Cálculos do Backend | Consumo/Preparo de Dados |
| :--- | :--- | :--- | :--- |
| `budget_minimum` | `user_id`, `month`, `total_value`, `fixed_cost`, `variable_caps` (JSON), `commitment_phrase` | Calcula a folga/gap (Renda - Orçamento Mínimo). Divide os tetos variáveis em limites semanais. | Consome `income_items` (Renda) e `obligations` (Fixos Essenciais). Prepara dados para o **Dia 14** (Plano 30/90). |
| `weekly_caps` | `user_id`, `category`, `weekly_limit`, `current_spent` | Gera alertas quando o `current_spent` atinge 80% do `weekly_limit`. | Consumido pelo **Dia 15** (Painel de Progresso). |

### 📊 Front-end do Relatório Final (Output no App)

O relatório é o seu novo contrato de 30 dias:
*   **Card "Orçamento Mínimo Total":** Exibe o valor final do orçamento (R$ Y.YYY,YY) e a **Folga Mensal** (R$ S.SSS,SS) em destaque.
*   **Gráfico de Rosca "Distribuição do Orçamento":** Mostra a proporção de Custos Fixos Essenciais, Tetos Variáveis e Reserva Imediata.
*   **Lista "Tetos Variáveis Ativos":** Exibe cada categoria (Alimentação, Transporte, etc.) com seu limite mensal e o status de divisão semanal.
*   **Card "Compromisso":** Exibe a **Frase de Compromisso** do usuário.

---

## Dia 10 — Mapa de Negociação

**🌅 Mensagem matinal**
Renegociar dívidas é o passo mais poderoso para retomar o controle. Credores preferem receber pouco do que não receber nada. **A promessa do dia é: você terá um mapa de dívidas priorizadas, com limites de pagamento definidos e scripts prontos para negociar.**

**📚 Conceito FIRE do dia**
**Dívida Cara, Dívida Prioritária.** O FIRE ensina a atacar primeiro as dívidas com os **juros mais altos** (cartão, cheque especial), pois elas consomem sua riqueza mais rapidamente. O **Mapa de Negociação** é um plano de ataque: ele define seu limite de pagamento (baseado no Orçamento Mínimo) e o objetivo (reduzir juros, alongar prazo), garantindo que o acordo seja **sustentável**.

**✅ Seu desafio hoje**
Seu objetivo é **detalhar todas as suas dívidas**, priorizá-las e **preparar o terreno** para o contato com os credores.

**🎯 SUA TAREFA PRÁTICA — Passo a passo detalhado (guiado no app)**

Na **Aba "Tarefa do dia"**, você encontra uma tela de **Mapa de Negociação** com detalhamento e agendamento.

1.  **Preparação automática:** O app carrega a lista de `debts` (do **Dia 2**) e as contas marcadas como "Negociar" no **Dia 8** em **Cards de Dívida** individuais.
    *   *Card de Resumo:* Exibe o **Limite de Pagamento Mensal** (Folga do Orçamento Mínimo do Dia 9) em destaque.

2.  **Escolhas do usuário:** Para cada Card de Dívida:
    *   *Input de Valor (obrigatório):* **Valor Atualizado da Dívida** (com juros).
    *   *Input de Valor (obrigatório):* **Taxa de Juros Mensal**.
    *   *Select (dropdown):* **Prioridade de Negociação** (Alta - juros > 10%, Média, Baixa).
    *   *Select (dropdown):* **Objetivo** (Reduzir Juros, Desconto à Vista, Alongar Prazo).

3.  **Geração de Proposta e Roteiro:**
    *   **Escolhas do usuário:**
        *   *Input de Valor (obrigatório):* **Valor Máximo da Parcela** que você pode pagar (não pode ser maior que o Limite de Pagamento Mensal).
        *   *Input de Texto (obrigatório):* **Argumento Principal** (ex.: "Perdi renda").
    *   **Processamento/automação:** O app gera um **Script de Contato** personalizado e um **Checklist de Perguntas**.
    *   **Escolhas do usuário:** *Input de Data/Hora:* **Agendar Contato** (para cada dívida).

4.  **Ações Finais:**
    *   *CTA:* **"Concluir Dia 10 e Gerar Agenda de Negociação"**.
    *   O app salva o `negotiation_schedule` e agenda as notificações. O usuário é redirecionado para a Aba "Desafio Concluído".

**Infra estrutura (backend + outputs no app)**

| Entidade | Campos Essenciais | Regras/Cálculos do Backend | Consumo/Preparo de Dados |
| :--- | :--- | :--- | :--- |
| `debts` | `user_id`, `current_value`, `interest_rate`, `negotiation_priority`, `negotiation_goal` | Ordena as dívidas por taxa de juros (prioridade). | Consome `debts` do **Dia 2** e `budget_minimum` (limite de parcela) do **Dia 9**. Prepara dados para o **Dia 11** (scripts) e **Dia 14** (dívidas prioritárias). |
| `negotiation_schedule` | `user_id`, `debt_id`, `scheduled_date`, `script_text` | Gera lembretes de contato. | - |

### 📊 Front-end do Relatório Final (Output no App)

O relatório é o seu plano de ataque às dívidas:
*   **Card "Limite de Parcela":** Exibe o **Valor Máximo da Parcela** que cabe no seu Orçamento Mínimo (R$ X.XX).
*   **Lista "Dívidas Prioritárias":** Lista as dívidas com **Prioridade Alta**, exibindo a **Taxa de Juros Mensal** e o **Objetivo de Negociação** (ex.: "Reduzir Juros").
*   **Tabela "Agenda de Contatos":** Lista as datas e horários agendados para as negociações.
*   **Botão Flutuante:** "Ver Scripts de Negociação" (acesso rápido ao roteiro).

---

## Dia 11 — Estudar Negociação

**🌅 Mensagem matinal**
Negociar é uma habilidade que se aprende. Você já tem o mapa; agora, é hora de **afiar o discurso** e ganhar confiança. **A promessa do dia é: você vai dominar os argumentos e as táticas para garantir um acordo justo e sustentável.**

**📚 Conceito FIRE do dia**
**Preparação é Metade do Sucesso.** No FIRE, não se faz nada no escuro. Estudar negociação significa compreender seus **direitos como consumidor** e os **incentivos do credor**. Ao praticar o script e simular cenários, você mantém a calma e a objetividade, evitando aceitar propostas que estouram seu Orçamento Mínimo.

**✅ Seu desafio hoje**
Seu objetivo é **revisar e praticar seus scripts de negociação**, definindo seus limites inegociáveis para o contato real.

**🎯 SUA TAREFA PRÁTICA — Passo a passo detalhado (guiado no app)**

Na **Aba "Tarefa do dia"**, você encontra uma tela de **Estudo e Prática de Negociação** em formato de Stepper.

1.  **Passo 1: Estudo e Revisão**
    *   **Preparação automática:** O app exibe *cards* com links para **"Guia Rápido de Direitos do Consumidor"** e **"Taxas de Juros Médias no Brasil"**.
    *   **Escolhas do usuário:** *Editor de Texto:* Você revisa e ajusta o `script_text` (do Dia 10).

2.  **Passo 2: Simulação de Conversa**
    *   **Ações:** *Botão:* **"Simular Conversa"** (abre um **Chat Modal**). O chat-bot simula um atendente de cobrança, apresentando contrapropostas e perguntas difíceis.
    *   **Processamento/automação:** O app oferece **Feedback Imediato** (ex.: "Seu argumento foi fraco. Tente reforçar o limite do Orçamento Mínimo.").

3.  **Passo 3: Limites Inegociáveis**
    *   **Escolhas do usuário:**
        *   *Input de Valor (obrigatório):* **Valor Máximo da Parcela** (reforçando o limite do Dia 10).
        *   *Input de Texto (obrigatório):* **Condição Inegociável** (ex.: "Não aceito seguro embutido").
    *   **Ações Finais:**
        *   *CTA:* **"Concluir Dia 11 e Salvar Versão Final do Script"**.
        *   O app salva a versão final do script e os limites inegociáveis para o Dia 12. O usuário é redirecionado para a Aba "Desafio Concluído".

**Infra estrutura (backend + outputs no app)**

| Entidade | Campos Essenciais | Regras/Cálculos do Backend | Consumo/Preparo de Dados |
| :--- | :--- | :--- | :--- |
| `negotiation_scripts` | `user_id`, `debt_id`, `final_script`, `max_installment`, `inegotiable_condition` | - | Consome `negotiation_schedule` do **Dia 10**. Prepara dados para o **Dia 12**. |
| `practice_sessions` | `user_id`, `session_date`, `feedback_score` | - | - |

### 📊 Front-end do Relatório Final (Output no App)

O relatório confirma a preparação para o contato:
*   **Card "Script Finalizado":** Exibe a **Condição Inegociável** e o **Valor Máximo da Parcela** definidos.
*   **Badge de Status:** "Pronto para Negociar" (em verde).
*   **Gráfico de Radar "Habilidades de Negociação":** Exibe um score de 0 a 100% para "Assertividade", "Clareza" e "Foco no Limite" (baseado no feedback da simulação).
*   **Lista "Perguntas Essenciais":** Exibe o checklist de perguntas a serem feitas ao credor.

---

## Dia 12 — Fechar Acordo Sem Se Enrolar

**🌅 Mensagem matinal**
Hoje é o dia de colocar a mão na massa e **agir**. Você está preparado para conversar com os credores, apresentar sua proposta e fechar acordos que realmente cabem no seu bolso. **A promessa do dia é: você vai fechar pelo menos um acordo sustentável e registrar a economia gerada.**

**📚 Conceito FIRE do dia**
**Acordo Sustentável.** No FIRE, um acordo só é bom se **não estourar seu Orçamento Mínimo** e se **eliminar juros caros**. Você deve exigir a proposta por escrito e jamais aceitar venda casada. A sustentabilidade do acordo é o que garante que você não voltará ao ciclo de endividamento em poucos meses.

**✅ Seu desafio hoje**
Seu objetivo é **realizar os contatos agendados**, analisar as propostas recebidas e **registrar os acordos fechados** no app.

**🎯 SUA TAREFA PRÁTICA — Passo a passo detalhado (guiado no app)**

Na **Aba "Tarefa do dia"**, você encontra uma tela de **Registro e Análise de Acordos**.

1.  **Preparação automática:** O app lista as dívidas agendadas (do **Dia 10**) em **Cards de Status** (Pendentes).
    *   *Card de Resumo:* Exibe o **Valor Máximo da Parcela** (Dia 11) para referência.

2.  **Registro de Proposta:** Para cada dívida, após o contato, você clica em **"Registrar Proposta"** (abre um **Formulário Modal**).
    *   **Escolhas do usuário:**
        *   *Input de Valor (obrigatório):* **Valor Total Negociado**.
        *   *Input de Valor (obrigatório):* **Valor da Parcela**. **Validação:** O app exibe um **Alerta de Regra** se o valor for maior que o limite do Dia 11.
        *   *Input de Data:* **Data de Vencimento da Parcela**.
        *   *Upload de Arquivo:* Anexar Boleto/Contrato (opcional, mas recomendado).

3.  **Processamento/automação:** O app gera a **Análise de Sustentabilidade** em um *card* de alerta:
    *   *Cálculo:* Compara a nova parcela com o Orçamento Mínimo (Dia 9) e calcula a **Economia de Juros** (comparando com a dívida original).
    *   *Alerta:* Se a parcela comprometer mais de 10% da sua folga, o app exibe um **Alerta de Risco** e sugere renegociar.

4.  **Ações Finais:**
    *   *Toggle:* **"Acordo Fechado e Sustentável"** (ON/OFF).
    *   *CTA:* **"Concluir Dia 12 e Atualizar Calendário"**.
    *   O app salva o `agreement`, adiciona as parcelas como novas `obligations` no calendário (Dia 7) e remove a dívida da lista de pendências. O usuário é redirecionado para a Aba "Desafio Concluído".

**Infra estrutura (backend + outputs no app)**

| Entidade | Campos Essenciais | Regras/Cálculos do Backend | Consumo/Preparo de Dados |
| :--- | :--- | :--- | :--- |
| `negotiation_sessions` | `user_id`, `debt_id`, `session_date`, `proposal_value`, `status` (fechado/rejeitado) | - | - |
| `agreement` | `user_id`, `debt_id`, `negotiated_value`, `installments`, `installment_value`, `due_date`, `document_path` | Adiciona as parcelas à tabela `obligations`. Calcula a economia total de juros. | Consome `debts` e `negotiation_scripts`. Prepara dados para o **Dia 14** (dívidas prioritárias). |
| `documents` | `user_id`, `agreement_id`, `file_path` | - | - |

### 📊 Front-end do Relatório Final (Output no App)

O relatório celebra os acordos fechados e a economia:
*   **Card "Acordos Fechados":** Exibe o **Número de Acordos Fechados** e a **Economia Total de Juros** gerada.
*   **Lista "Acordos Ativos":** Lista cada acordo com o **Credor**, **Valor da Parcela** e **Data de Vencimento**.
*   **Badge de Sustentabilidade:** Para cada acordo, um *badge* indica "Sustentável" (verde) ou "Alto Risco" (amarelo), baseado na análise do Orçamento Mínimo.
*   **Gráfico de Linha "Dívida Remanescente":** Mostra a redução do valor total da dívida após os acordos.

---

## Dia 13 — Novas Regras de Vida

**🌅 Mensagem matinal**
Mudanças duradouras dependem de **novos hábitos**. Hoje, você vai criar seu **Manual de Sobrevivência Financeira**, definindo regras claras que impedem recaídas e automatizam a prosperidade. **A promessa do dia é: você terá regras de uso do cartão, sua caixinha de emergência programada e uma rotina semanal de revisão.**

**📚 Conceito FIRE do dia**
**Disciplina > Motivação.** O FIRE não confia na força de vontade diária. **Regras bem definidas** e **automatizações** reduzem o esforço mental. A **Caixinha de Emergência** é o seu colchão de segurança, evitando que imprevistos o joguem de volta no cartão de crédito. A **Rotina Semanal** garante a revisão contínua, mantendo o sistema leve e funcional.

**✅ Seu desafio hoje**
Seu objetivo é **instituir três pilares de proteção**: regras do cartão, caixinha de emergência e rotina de revisão, e **combiná-los** com quem divide a vida com você.

**🎯 SUA TAREFA PRÁTICA — Passo a passo detalhado (guiado no app)**

Na **Aba "Tarefa do dia"**, você encontra uma tela de **Configuração de Hábitos** com três **Cards de Configuração** principais.

1.  **Card 1: Regras do Cartão (Reforço)**
    *   **Preparação automática:** O app puxa as regras definidas no **Dia 5**.
    *   **Escolhas do usuário:** Você confirma ou ajusta:
        *   *Input de Valor:* **Limite Máximo por Compra**.
        *   *Toggle:* **"Congelar após Fechamento da Fatura"** (ON/OFF).
        *   *Input de Texto (obrigatório):* **Ação Corretiva ao Quebrar a Regra** (ex.: "Justificar no app e transferir o valor para a caixinha").

2.  **Card 2: Caixinha de Emergência**
    *   **Escolhas do usuário:**
        *   *Input de Valor (obrigatório):* **Valor Mensal a Depositar** (mínimo R$ 20,00).
        *   *Select (dropdown):* **Dia do Depósito** (ex.: Dia 5).
        *   *CTA:* **"Programar Transferência Automática"** (abre link para o app do banco).

3.  **Card 3: Rotina Semanal de Revisão**
    *   **Escolhas do usuário:**
        *   *Select (dropdown):* **Dia da Semana** (Segunda a Domingo).
        *   *Input de Horário:* **Horário Fixo** (ex.: 21:00).
        *   *Toggle:* **"Lembrete Ativo"** (ON/OFF).

4.  **Compromisso Compartilhado:**
    *   **Escolhas do usuário:** *Input de Texto (obrigatório):* **Com quem combinei as regras?** (ex.: Cônjuge, Parceiro de Responsabilidade).

5.  **Ações Finais:**
    *   *CTA:* **"Concluir Dia 13 e Ativar Protocolo"**.
    *   O app salva as regras (`card_rules`, `emergency_fund`, `weekly_routines`) e agenda os lembretes semanais. O usuário é redirecionado para a Aba "Desafio Concluído".

**Infra estrutura (backend + outputs no app)**

| Entidade | Campos Essenciais | Regras/Cálculos do Backend | Consumo/Preparo de Dados |
| :--- | :--- | :--- | :--- |
| `card_rules` | `user_id`, `max_purchase_value`, `action_on_break` | Gera alertas e registra a justificativa quando a regra é quebrada. | Consome `payment_methods` (Dia 4) e `card_rules` (Dia 5). Prepara dados para o **Dia 15** (Painel de Progresso). |
| `emergency_fund` | `user_id`, `monthly_deposit`, `deposit_day`, `current_balance` | - | Consumido pelo **Dia 15**. |
| `weekly_routines` | `user_id`, `day`, `time`, `checklist` (JSON) | Gera lembretes semanais. | Prepara dados para o **Dia 15** (Protocolo Semanal). |
| `shared_commitments` | `user_id`, `partner_name`, `commitment_date` | - | - |

### 📊 Front-end do Relatório Final (Output no App)

O relatório é o seu Manual de Conduta Financeira:
*   **Card "Caixinha de Emergência":** Exibe o **Valor Mensal Programado** (R$ X.XX) e a **Data do Próximo Depósito**.
*   **Card "Rotina Semanal":** Exibe o **Dia e Horário Fixo** da revisão (ex.: "Toda segunda-feira às 21:00").
*   **Lista "Regras do Cartão":** Lista as regras ativas (ex.: "Limite por compra: R$ 200,00", "Congelar após fatura").
*   **Card "Compromisso Compartilhado":** Exibe o nome do parceiro e a data da conversa.

---

## Dia 14 — Plano 30/90 (Comprar Tempo no Caos)

**🌅 Mensagem matinal**
Você já tem todas as peças. Hoje, vamos montá-las em um **Plano 30/90** estruturado, seu GPS para a estabilidade. **A promessa do dia é: você terá um roteiro visual de 90 dias, com foco em estabilizar em 30 dias e ganhar tração nos 60 dias seguintes.**

**📚 Conceito FIRE do dia**
**Planejamento é Liberdade.** O FIRE valoriza planos **simples, realistas e dinâmicos**. O Plano 30/90 é baseado em três pilares: **Essenciais** (pagar o básico), **Dívidas Prioritárias** (atacar o que tem juros altos) e **Alavancas** (ações para aumentar renda ou reduzir despesas). Ele cria checkpoints para que você possa recalibrar o curso a cada 30 dias.

**✅ Seu desafio hoje**
Seu objetivo é **consolidar o Orçamento Mínimo**, **selecionar as dívidas foco** e **definir as alavancas** que trarão folga financeira nos próximos 90 dias.

**🎯 SUA TAREFA PRÁTICA — Passo a passo detalhado (guiado no app)**

Na **Aba "Tarefa do dia"**, você encontra um **Stepper** de 4 passos para a construção do **Plano 30/90**.

1.  **Passo 1: Modo de Sobrevivência (30 Dias)**
    *   **Preparação automática:** O app exibe o **Orçamento Mínimo** (Dia 9) e o **Custo Fixo Essencial** (Dia 8).
    *   **Escolhas do usuário:** *Select (dropdown):* Escolha seu **Modo 30 Dias** (Emergência Total, Equilibrar, Tração Leve). **Regra:** O modo selecionado ajusta a intensidade dos alertas do app.

2.  **Passo 2: Dívidas Prioritárias (Foco)**
    *   **Preparação automática:** O app lista as dívidas com Prioridade Alta (Dia 10) em **Cards de Seleção**.
    *   **Escolhas do usuário:** *Multi-select (máximo 3):* Selecione as **Dívidas Foco** para os próximos 90 dias.
    *   *Select (dropdown):* Para cada dívida selecionada, defina a **Ação** (Negociar, Pagar o Mínimo, Pagar Extra R$ X).

3.  **Passo 3: Alavancas de 90 Dias**
    *   **Escolhas do usuário:** *Lista Editável (máximo 3):* Defina suas **Alavancas** (ex.: Renda Extra, Venda de Itens).
        *   *Input de Texto (obrigatório):* **Meta Específica** (ex.: "Ganhar R$ 500 extras").
        *   *Input de Texto (obrigatório):* **Ação Semanal** (ex.: "Listar 3 itens para venda").

4.  **Passo 4: Checkpoints e Compromisso**
    *   **Processamento/automação:** O app gera os **Marcos de Revisão** (30, 60 e 90 dias) com metas pré-definidas.
    *   **Escolhas do usuário:** *Input de Texto (obrigatório):* **Frase de Compromisso do Plano** (ex.: "Vou priorizar o básico e abrir espaço para crescer").

5.  **Ações Finais:**
    *   *CTA:* **"Concluir Dia 14 e Gerar Painel 30/90"**.
    *   O app salva o `plans` e gera o **Gráfico de Gantt** (ou timeline) para visualização na Aba "Desafio Concluído".

**Infra estrutura (backend + outputs no app)**

| Entidade | Campos Essenciais | Regras/Cálculos do Backend | Consumo/Preparo de Dados |
| :--- | :--- | :--- | :--- |
| `plans` | `user_id`, `cycle_type` (30/90), `mode`, `start_date`, `status` | - | - |
| `plan_debt_priorities` | `plan_id`, `debt_id`, `action_type`, `action_value` | Impede a seleção de mais de 3 dívidas foco. | Consome `debts` (Dia 10) e `agreement` (Dia 12). |
| `plan_levers` | `plan_id`, `goal_text`, `weekly_action`, `success_criteria` | Impede a seleção de mais de 3 alavancas. | - |
| `plan_checkpoints` | `plan_id`, `checkpoint_date`, `checkpoint_type` (30/60/90) | Gera o calendário de revisão. | Consumido pelo **Dia 15**. |

### 📊 Front-end do Relatório Final (Output no App)

O relatório é o seu GPS de longo prazo:
*   **Visualização "Plano 30/90":** Um *timeline* ou **Gráfico de Gantt** simples, mostrando os **Marcos de 30, 60 e 90 dias** e as ações semanais das alavancas.
*   **Card "Foco 30 Dias":** Exibe o **Modo de Sobrevivência** escolhido e o **Custo Fixo Essencial** (R$ X.XX).
*   **Lista "Dívidas de Ataque":** Lista as 3 dívidas prioritárias com a **Ação** definida (ex.: "Negociar").
*   **Lista "Alavancas de Tração":** Lista as 3 alavancas com a **Meta Específica** (ex.: "Renda Extra: R$ 500").

---

## Dia 15 — Formatura: Protocolo Semanal + Próximos 90 Dias

**🌅 Mensagem matinal**
Você chegou à sua formatura! A verdadeira vitória é sair daqui com um **sistema** que funciona no piloto automático. **A promessa do dia é: você vai instalar seu Protocolo Semanal de 10 minutos e definir sua Regra de Decisão para manter o controle e a tração nos próximos 90 dias.**

**📚 Conceito FIRE do dia**
**Simplicidade + Revisão Contínua.** O FIRE ensina que a manutenção deve ser leve. O **Protocolo Semanal** garante que você revise os pontos críticos em 10 minutos, evitando que o caos se instale. A **Regra de Decisão** é o seu plano de contingência, definindo como agir quando o gatilho emocional bater, sem precisar de força de vontade.

**✅ Seu desafio hoje**
Seu objetivo é **transformar todas as ações em uma rotina de manutenção**, **definir sua regra de emergência** e **instalar o Painel de Progresso** para acompanhar seus indicadores de liberdade.

**🎯 SUA TAREFA PRÁTICA — Passo a passo detalhado (guiado no app)**

Na **Aba "Tarefa do dia"**, você encontra um **Stepper** de 4 passos para a **Formatura e Protocolo de Manutenção**.

1.  **Passo 1: Protocolo Semanal (10 Minutos)**
    *   **Preparação automática:** O app puxa o dia/hora da rotina (Dia 13).
    *   **Processamento/automação:** O app exibe o **Checklist Semanal** pré-preenchido (puxando dados dos Dias 7, 9, 12, 13).
    *   **Escolhas do usuário:** *Input de Texto:* **Minha Vitória da Semana** (para registrar o progresso).
    *   *CTA:* **"Ativar Protocolo Semanal"**.

2.  **Passo 2: Regra de Decisão para Emergências**
    *   **Processamento/automação:** O app exibe os **3 Níveis de Ação** (Não Piorar, Estabilizar, Ganhar Tração).
    *   **Escolhas do usuário:**
        *   *Select (dropdown):* **Meu Gatilho Mais Perigoso** (Ansiedade, Impulso, Atraso, Família).
        *   *Select (dropdown):* **Minha Ação Padrão** (Pausa 24h, Abrir Painel, Falar com Alguém).
    *   *CTA:* **"Salvar Regra de Decisão"**.

3.  **Passo 3: Confirmação dos Próximos 90 Dias**
    *   **Preparação automática:** O app lista as **Alavancas** (Dia 14) como sugestões.
    *   **Escolhas do usuário:** *Multi-select (máximo 3):* Confirme seus **Compromissos de 90 Dias** (ex.: Fechar 2 acordos, Construir R$ 500 na caixinha).
    *   *CTA:* **"Ativar Plano 90 Dias"**.

4.  **Passo 4: Painel de Progresso e Certificado**
    *   **Processamento/automação:** O app exibe os **4 Indicadores Fixos** (Essenciais em dia, Sobra do Orçamento, Cartão sob controle, Saldo da Caixinha) com os dados atuais.
    *   **Escolhas do usuário:** *Input de Texto (obrigatório):* **Frase Final de Compromisso** (ex.: "Eu não fujo mais. Eu me protejo 10 minutos por semana").
    *   *CTA Final:* **"Concluir Formatura e Gerar Certificado"**. **Regra:** O CTA só é habilitado após a conclusão dos 4 passos.

**Infra estrutura (backend + outputs no app)**

| Entidade | Campos Essenciais | Regras/Cálculos do Backend | Consumo/Preparo de Dados |
| :--- | :--- | :--- | :--- |
| `weekly_protocol` | `user_id`, `day`, `time`, `checklist` (JSON), `weekly_win` | Agenda o lembrete semanal. | Consome `weekly_routines` (Dia 13). |
| `decision_rule` | `user_id`, `trigger`, `default_action`, `level_1_actions` (JSON) | - | - |
| `plan_90d_instance` | `user_id`, `commitments` (JSON), `status` | - | Consome `plan_levers` (Dia 14). |
| `progress_dashboard_config` | `user_id`, `indicators` (JSON), `final_phrase` | - | Consome dados de `obligations`, `budget_minimum`, `card_rules`, `emergency_fund`. |
| `scheduled_events` | `user_id`, `event_type`, `scheduled_at` | Gera todos os lembretes de manutenção. | - |
| `certificate` | `user_id`, `completion_date`, `final_phrase` | Módulo de geração de PDF/imagem do certificado. | - |

### 📊 Front-end do Relatório Final (Output no App)

O relatório é o seu Painel de Controle e Certificado de Conclusão:
*   **Painel de Progresso (Dashboard):** Exibe os 4 indicadores fixos em *cards* grandes com *badges* de status (ex.: "Essenciais em dia: OK" em verde; "Cartão sob controle: Atenção" em amarelo).
*   **Card "Protocolo Semanal":** Exibe o **Dia e Horário** da revisão e o **Checklist** ativo.
*   **Card "Regra de Decisão":** Exibe o **Gatilho Mais Perigoso** e a **Ação Padrão** (ex.: "Ansiedade -> Abrir Painel").
*   **Card "Compromissos 90 Dias":** Lista os 3 compromissos com *badges* de progresso (0%, 50%, 100%).
*   **Botão Flutuante:** "Gerar Certificado de Conclusão" (PDF/Imagem).
*   **Frase Final:** Exibe a **Frase Final de Compromisso** do usuário em destaque.
