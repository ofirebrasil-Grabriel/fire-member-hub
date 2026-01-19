# App FIRE Brasil - 15 Dias para Independência Financeira
## Especificação Completa de Aplicativo Móvel

---

## **DIA 1 — Boas-Vindas e Despertar**

### 🎯 Título
**Despertar Financeiro: Reconheça Suas Emoções e Prepare-se para a Transformação**

### 🌅 Mensagem Matinal
Se você chegou até aqui, é porque sente que algo precisa mudar na sua relação com o dinheiro. Talvez seu salário nunca dure até o fim do mês, as contas tirem seu sono ou haja o medo constante de emergências. Esses sentimentos são comuns e não há motivo para culpa. O movimento FIRE lembra que qualquer pessoa, com disciplina e clareza de propósito, pode conquistar liberdade financeira. Isso começa por olhar para dentro — identificar crenças limitantes como "dinheiro corrompe" ou "riqueza é sorte" e reconhecer emoções que sabotam seus hábitos. Hoje iniciamos esse despertar com compaixão: você não está sozinho, e este desafio é um processo de autoconhecimento e ação.

### 📚 Conceito FIRE do Dia
**Consciência financeira e autonomia sobre o tempo.** Não existe liberdade sem consciência. Muitas pessoas acham que "ganham pouco" quando, na verdade, gastam de forma inconsciente ou impulsiva. Ao tomar consciência de padrões, você descobre que gastar menos não é castigo, mas lucidez: escolher gastar com o que traz valor de verdade. Outro pilar é a autonomia sobre o tempo; o FIRE propõe viver com liberdade primeiro para depois trabalhar com propósito. A independência financeira não é sobre parar de trabalhar, mas escolher como viver.

### ✅ Seu Desafio Hoje
Dar o primeiro passo com gentileza: reconhecer suas emoções e crenças sobre dinheiro, conhecer as regras do desafio e preparar o terreno para a transformação financeira nos próximos 14 dias.

### 🎯 SUA TAREFA PRÁTICA

#### **Experiência do Usuário (UX/UI)**

**Tela de Boas-Vindas**
- **Header fixo:** "Dia 1 — Boas-vindas e Despertar" com barra de progresso visual (0% → 100%)
- **Componente hero:** Ilustração acolhedora + texto de boas-vindas resumido
- **CTA principal:** "Começar Meu Dia 1"

**Tela Principal do Dia 1 (Fluxo em Stepper)**

**PASSO 1: Questionário Inicial de Autoconhecimento**
- **Formato:** 8 perguntas em cards deslizáveis (swipe horizontal)
- **Perguntas:**
  1. "Como você se sente ao pensar em dinheiro?" (Múltipla escolha: Ansioso/Tranquilo/Confuso/Com medo/Indiferente)
  2. "Você tem boletos atrasados neste momento?" (Radio: Sim/Não/Não sei ao certo)
  3. "Qual sua renda mensal aproximada?" (Input numérico com máscara de moeda R$)
  4. "Quais são suas 3 maiores despesas mensais?" (3 campos de texto livre)
  5. "Você divide sua vida financeira com alguém?" (Radio: Sim/Não + campo condicional "Com quem?")
  6. "Qual seu maior travamento financeiro?" (Múltipla escolha: Ganho pouco/Gasto demais/Dívidas/Falta de controle/Não sei por onde começar)
  7. "O que você mais quer conquistar nestes 15 dias?" (Textarea, máx. 200 caracteres)
  8. "Você já tentou organizar as finanças antes?" (Radio: Sim/Não + campo condicional "O que travou?")

- **Validações:**
  - Todos os campos são obrigatórios
  - Renda deve ser > R$ 0
  - Máximo de 200 caracteres em campos abertos
  
- **Navegação:** Botão "Próxima" em cada card, botão "Voltar" oculto no primeiro card
- **Progresso:** Indicador "Pergunta X de 8" abaixo do card

**PASSO 2: Termômetro "Respirar"**
- **Componente:** Slider interativo de 0 a 10
- **Labels:**
  - 0-3: "Não aguento mais" (cor vermelha)
  - 4-6: "Sobrevivendo" (cor amarela)
  - 7-8: "Respirando" (cor verde claro)
  - 9-10: "Tranquilo" (cor verde escuro)
  
- **Input adicional:** Campo de texto "Por que você deu essa nota?" (textarea, máx. 150 caracteres, obrigatório)
- **Feedback visual:** Emoji animado muda conforme o valor do slider
- **Validação:** Não permite avançar sem preencher a justificativa

**PASSO 3: Configuração do Compromisso Diário**
- **Pergunta principal:** "Qual é o melhor horário do dia para você dedicar 10 minutos ao App FIRE?"
- **Seletor de horário:** 
  - Dropdown de período (Manhã 6h-12h / Tarde 12h-18h / Noite 18h-24h)
  - Time picker para horário específico
  
- **Toggle:** "Quero receber lembretes diários" (ativo por padrão)
- **Canais de notificação:** Checkboxes (Push / WhatsApp / E-mail)

- **Passo Mínimo de Emergência:**
  - Texto explicativo: "E se o dia estiver difícil? Defina seu PASSO MÍNIMO - a menor ação que você consegue fazer mesmo nos dias ruins"
  - Radio buttons:
    - "Só abrir o app e ver meu progresso"
    - "Anotar apenas 1 conta que vence hoje"
    - "Ler a mensagem do dia"
    - "Outro" (campo de texto livre)

**PASSO 4: Revisão e Confirmação**
- **Card de resumo:** Mostra em formato de lista:
  - Seu sentimento inicial (emoji + texto)
  - Nota do Termômetro "Respirar"
  - Horário do compromisso
  - Passo mínimo definido
  
- **Botões de ação:**
  - "Salvar Rascunho" (secondary, outline)
  - "Concluir Dia 1" (primary, destaque)

**Tela de Conclusão do Dia 1**
- **Animação de celebração:** Confetti + som opcional
- **Mensagem:** "Você completou o Dia 1! Esse é o começo da sua jornada para a liberdade financeira."
- **Preview do Dia 2:** Card com título "Dia 2 — Raio-X do Caos" e botão "Desbloquear Dia 2"
- **Acesso ao Checklist:** Botão flutuante "Ver Meu Progresso Geral"

---

#### **Componentes Reutilizáveis**

**Header Padrão de Dia**
- Logo do App FIRE (topo esquerdo)
- Título do dia (centro)
- Ícone de ajuda "?" (topo direito, abre FAQ contextual)
- Barra de progresso do dia (abaixo do header)

**Rodapé Fixo**
- Botões "Salvar Rascunho" e "Concluir Dia X"
- Sempre visíveis (sticky bottom)
- "Concluir" desabilitado até todos os campos obrigatórios estarem preenchidos

**Modal de Ajuda**
- Contexto do dia atual
- Dicas de preenchimento
- Link "Preciso de mais ajuda" → Chat de suporte

---

### 🗄️ Infraestrutura (Backend + Fluxo de Dados)

#### **Tabelas do Banco de Dados**

**1. Tabela: `users`**
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | Identificador único do usuário |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | E-mail de cadastro |
| `name` | VARCHAR(100) | NOT NULL | Nome do usuário |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |
| `onboarding_completed` | BOOLEAN | DEFAULT FALSE | Se completou o Dia 1 |
| `current_day` | INTEGER | DEFAULT 1 | Dia atual do desafio (1-15) |
| `timezone` | VARCHAR(50) | DEFAULT 'America/Sao_Paulo' | Fuso horário |

**2. Tabela: `initial_assessment`**
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da avaliação |
| `user_id` | UUID | FOREIGN KEY → users(id), UNIQUE | Usuário (1:1) |
| `money_feeling` | VARCHAR(50) | NOT NULL | Como se sente com dinheiro |
| `has_overdue_bills` | BOOLEAN | NOT NULL | Tem boletos atrasados |
| `monthly_income` | DECIMAL(10,2) | NOT NULL | Renda mensal aproximada |
| `top_expenses` | JSONB | NOT NULL | Array com 3 maiores despesas |
| `shares_finances` | BOOLEAN | NOT NULL | Divide finanças com alguém |
| `shares_with` | VARCHAR(100) | NULLABLE | Com quem divide |
| `biggest_blocker` | VARCHAR(100) | NOT NULL | Maior travamento financeiro |
| `main_goal` | TEXT | NOT NULL | O que quer conquistar (máx. 200 chars) |
| `tried_before` | BOOLEAN | NOT NULL | Já tentou organizar antes |
| `what_blocked` | TEXT | NULLABLE | O que travou nas tentativas anteriores |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data do registro |

**3. Tabela: `daily_log`**
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do log diário |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `day_number` | INTEGER | NOT NULL, CHECK (1-15) | Número do dia (1 a 15) |
| `breathe_score` | INTEGER | NOT NULL, CHECK (0-10) | Nota do Termômetro (0-10) |
| `breathe_reason` | TEXT | NOT NULL | Justificativa da nota |
| `completed_at` | TIMESTAMP | NULLABLE | Quando completou o dia |
| `status` | VARCHAR(20) | DEFAULT 'draft' | draft / completed |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Criação do registro |

**Constraint:** UNIQUE(user_id, day_number) — Garante 1 registro por dia por usuário

**4. Tabela: `user_commitment`**
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do compromisso |
| `user_id` | UUID | FOREIGN KEY → users(id), UNIQUE | Usuário (1:1) |
| `daily_time_period` | VARCHAR(20) | NOT NULL | Período do dia (morning/afternoon/night) |
| `daily_time_exact` | TIME | NOT NULL | Horário específico (HH:MM) |
| `reminder_enabled` | BOOLEAN | DEFAULT TRUE | Se quer lembretes |
| `reminder_channels` | JSONB | NOT NULL | Array ['push', 'whatsapp', 'email'] |
| `minimum_step` | VARCHAR(100) | NOT NULL | Passo mínimo de emergência |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

**5. Tabela: `challenge_checklist`**
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do checklist |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `day_number` | INTEGER | NOT NULL, CHECK (1-15) | Número do dia |
| `completed` | BOOLEAN | DEFAULT FALSE | Se o dia foi concluído |
| `completed_at` | TIMESTAMP | NULLABLE | Data/hora de conclusão |

**Constraint:** UNIQUE(user_id, day_number)

---

#### **Regras de Negócio**

1. **Validação de Campos Obrigatórios:**
   - Todos os 8 campos do questionário inicial devem ser preenchidos
   - Nota do Termômetro (0-10) + justificativa obrigatória
   - Horário de compromisso deve ser selecionado
   - Passo mínimo deve ser escolhido

2. **Progressão de Dias:**
   - Usuário só pode acessar o Dia N+1 após completar o Dia N
   - Botão "Concluir Dia 1" só fica ativo quando todos os campos obrigatórios estão preenchidos
   - Ao concluir Dia 1:
     - `users.onboarding_completed` → TRUE
     - `users.current_day` → 2
     - `daily_log.status` → 'completed'
     - `daily_log.completed_at` → NOW()
     - `challenge_checklist.completed` → TRUE (day_number=1)

3. **Notificações Automáticas:**
   - Após concluir Dia 1, agendar notificação diária no horário escolhido
   - Se `reminder_enabled` = TRUE, criar registros em tabela `notifications` (a ser criada nos próximos dias)
   - Canais de notificação baseados em `reminder_channels` JSONB

4. **Salvamento de Rascunho:**
   - Ao clicar "Salvar Rascunho", persiste os dados preenchidos até o momento
   - `daily_log.status` permanece como 'draft'
   - Usuário pode retornar e continuar de onde parou

5. **Feedback Emocional:**
   - Nota do Termômetro será rastreada ao longo dos 15 dias para gráfico de evolução emocional
   - Comparação: Dia 1 vs Dia 15 (apresentada na formatura)

---

#### **Outputs do App (Documentos Gerados)**

1. **Relatório de Autoconhecimento Inicial** (Visualização no app + PDF exportável)
   - Resumo das respostas do questionário
   - Nota inicial do Termômetro "Respirar"
   - Seu compromisso diário registrado
   - Data de início do desafio

2. **Checklist do Desafio 15 Dias** (Visualização interativa no app)
   - Lista de todos os 15 dias com status (🔒 Bloqueado / 📝 Em progresso / ✅ Concluído)
   - Progresso geral em % (Dias concluídos / 15)
   - Acesso rápido para voltar a dias anteriores (somente visualização)

3. **Lembretes Diários Agendados**
   - Notificação push/WhatsApp/e-mail no horário escolhido
   - Mensagem: "Hora do seu compromisso FIRE! Reserve seus 10 minutos para o [Dia X]"
   - Deep link para abrir direto no dia atual do app

---

#### **Fluxo de Integração com Dias Futuros**

**Dados do Dia 1 que serão reutilizados:**

- **Dia 2 (Raio-X do Caos):**
  - Renda mensal (`initial_assessment.monthly_income`) será pré-preenchida
  - Top 3 despesas (`initial_assessment.top_expenses`) servirão de base para categorização
  
- **Dia 7 (Vencimentos):**
  - Informação de "divide finanças com alguém" (`shares_finances`) influenciará se o app sugere sincronização de calendário compartilhado
  
- **Dia 13 (Novas Regras de Vida):**
  - Se `shares_finances` = TRUE, app sugerirá aba "Combinar Regras com [Nome da Pessoa]"
  
- **Dia 15 (Formatura):**
  - Comparação do Termômetro "Respirar" Dia 1 vs Dia 15
  - Exibição da frase "O que você mais quer conquistar" ao lado do certificado de conclusão

---

#### **Endpoints da API (Backend)**

**POST /api/v1/users/onboarding**
- **Payload:**
```json
{
  "user_id": "uuid",
  "initial_assessment": {
    "money_feeling": "ansioso",
    "has_overdue_bills": true,
    "monthly_income": 3500.00,
    "top_expenses": ["Aluguel", "Mercado", "Transporte"],
    "shares_finances": true,
    "shares_with": "Cônjuge",
    "biggest_blocker": "Dívidas",
    "main_goal": "Sair do vermelho e ter uma reserva de emergência",
    "tried_before": true,
    "what_blocked": "Falta de disciplina"
  },
  "breathe_log": {
    "day_number": 1,
    "breathe_score": 4,
    "breathe_reason": "Estou estressado com as contas atrasadas"
  },
  "commitment": {
    "daily_time_period": "night",
    "daily_time_exact": "21:00",
    "reminder_enabled": true,
    "reminder_channels": ["push", "whatsapp"],
    "minimum_step": "Só abrir o app e ver meu progresso"
  }
}
```

- **Response 201:**
```json
{
  "success": true,
  "message": "Dia 1 concluído com sucesso!",
  "data": {
    "user_id": "uuid",
    "current_day": 2,
    "onboarding_completed": true,
    "next_reminder": "2024-01-02T21:00:00Z"
  }
}
```

**GET /api/v1/users/{user_id}/progress**
- **Response 200:**
```json
{
  "current_day": 2,
  "days_completed": 1,
  "progress_percentage": 6.67,
  "breathe_score_evolution": [
    {"day": 1, "score": 4, "date": "2024-01-01"}
  ],
  "checklist": [
    {"day": 1, "completed": true, "completed_at": "2024-01-01T21:15:00Z"},
    {"day": 2, "completed": false, "completed_at": null},
    ...
  ]
}
```

---

### 📊 Métricas de Sucesso do Dia 1

1. **Taxa de Conclusão:** % de usuários que completam o Dia 1 após iniciar
2. **Tempo Médio de Conclusão:** Tempo gasto no Dia 1 (meta: 10-15 minutos)
3. **Distribuição de Notas do Termômetro:** Histograma das notas iniciais (0-10)
4. **Taxa de Ativação de Lembretes:** % de usuários que habilitam notificações
5. **Horário Preferido:** Distribuição de horários escolhidos (manhã/tarde/noite)

---



---

## **DIA 2 — Raio-X do Caos**

### 🎯 Título
**Raio-X Financeiro: Mapeie Todas as Entradas e Saídas do Seu Dinheiro**

### 🌅 Mensagem Matinal
Organizar as finanças não exige fórmulas mirabolantes. O primeiro passo para sair do caos é a sinceridade: saber exatamente para onde seu dinheiro está indo. Muitas pessoas têm vergonha de encarar extratos, mas o que não se vê não se muda. Hoje vamos fazer um inventário completo das suas receitas e despesas sem julgamentos. Lembre-se de que números são amigos: eles mostram o caminho para tomar decisões melhores.

### 📚 Conceito FIRE do Dia
**Raio-X Financeiro.** A metodologia FIRE destaca que não há liberdade sem consciência absoluta de sua realidade financeira. O Raio-X envolve listar todas as fontes de renda (salários, freelas, pensões, benefícios), todas as despesas fixas (aluguel, condomínio, contas de serviços públicos, transporte) e todas as despesas variáveis (mercado, lazer, assinaturas, compras aleatórias). Também inclui mapear dívidas e financiamentos: valor, taxa de juros, instituição credora e tempo restante. Este diagnóstico servirá de base para cortes, renegociações e planejamento.

### ✅ Seu Desafio Hoje
Mapear todas as entradas e saídas de dinheiro para enxergar onde está o problema: identificar quanto entra, quanto sai e por que sobra (ou não) ao final do mês.

### 🎯 SUA TAREFA PRÁTICA

#### **Experiência do Usuário (UX/UI)**

**Tela de Introdução do Dia 2**
- **Header:** "Dia 2 — Raio-X do Caos"
- **Barra de progresso do dia:** 0% → 100%
- **Card motivacional:** "Hoje você vai enxergar sua realidade financeira com clareza. Não tenha medo dos números — eles são seus aliados."
- **Badges:** Tempo estimado (15-25 min) | Requer (Extratos dos últimos 3 meses)
- **CTA:** "Começar Raio-X"

**Fluxo Principal (Stepper com 4 Passos)**

**PASSO 1: Entradas de Dinheiro**

- **Título:** "Quanto entra por mês?"
- **Componente:** Lista dinâmica de fontes de renda

**Campos por item de renda:**
- Nome da fonte (Input texto, ex: "Salário CLT", "Freela Design")
- Valor mensal médio (Input numérico com máscara R$)
- Data de recebimento (Date picker - dia do mês 1-31)
- Recorrência (Radio: Todo mês / Esporádica)
- Observações (Textarea opcional, máx. 100 chars)

**Ações:**
- Botão "+ Adicionar Nova Fonte de Renda"
- Ícone de lixeira para remover item
- Mínimo: 1 fonte de renda obrigatória

**Pré-preenchimento inteligente:**
- Se `initial_assessment.monthly_income` existe (do Dia 1), sugere automaticamente 1 entrada com:
  - Nome: "Renda Principal"
  - Valor: valor do Dia 1
  - Recorrência: "Todo mês"
  - Mensagem: "Detectamos que você informou R$ X no Dia 1. Confirme ou edite abaixo."

**Rodapé do passo:**
- Total de entradas mensais (soma automática, destaque em verde)
- Botão "Próximo Passo"

---

**PASSO 2: Saídas Fixas**

- **Título:** "Quais são seus gastos fixos todo mês?"
- **Subtítulo:** "Contas que vencem sempre, com valores iguais ou parecidos"

**Categorias pré-definidas (expansíveis):**

1. **Habitação**
   - Aluguel/Financiamento (R$ + data vencimento + forma pagamento)
   - Condomínio
   - IPTU (mensal ou anual convertido para mensal)

2. **Serviços Públicos**
   - Luz
   - Água
   - Gás

3. **Comunicação**
   - Internet
   - Telefone fixo
   - Celular (conta pós-paga)

4. **Transporte**
   - Combustível mensal
   - Transporte público (passe)
   - Seguro do carro
   - IPVA (convertido para mensal)
   - Estacionamento

5. **Educação**
   - Mensalidade escolar/faculdade
   - Cursos
   - Material didático

6. **Saúde**
   - Plano de saúde
   - Medicamentos contínuos
   - Academia/terapia

7. **Outros Fixos**
   - Campo livre para adicionar

**Campos por despesa fixa:**
- Nome (Input texto)
- Valor mensal médio (Input numérico R$)
- Data de vencimento (Date picker 1-31)
- Forma de pagamento (Dropdown: Débito automático / Boleto / Cartão / PIX / Dinheiro)
- Classificação (Auto-sugerida, editável: Essencial / Importante / Negociável)

**Dica contextual:** 
"💡 Não sabe o valor exato? Use a média dos últimos 3 meses. Você pode ajustar depois."

**Ações:**
- Expandir/recolher categorias (accordion)
- "+ Adicionar item" em cada categoria
- Toggle "Não tenho gastos nesta categoria" (esconde a seção)

**Rodapé do passo:**
- Total de saídas fixas (soma automática, destaque em vermelho)
- Diferença parcial: Entradas - Saídas Fixas (verde se positivo, amarelo se < 20% da renda, vermelho se negativo)
- Botão "Próximo Passo"

---

**PASSO 3: Saídas Variáveis**

- **Título:** "E os gastos que mudam todo mês?"
- **Subtítulo:** "Mercado, lazer, restaurantes, compras... tudo que varia"

**Categorias sugeridas (com ícones):**
- 🛒 Mercado / Alimentação
- 🍕 Restaurantes / Delivery
- 🎬 Lazer / Entretenimento
- 👕 Roupas / Vestuário
- 🏥 Farmácia / Saúde eventual
- 🎁 Presentes
- 🛠️ Manutenção / Reparos
- 💳 Assinaturas (streaming, apps, clubes)
- 📱 Recarga de celular pré-pago
- 🏦 Tarifas bancárias
- 🚗 Uber / Táxi / Apps de transporte
- ➕ Outros

**Campos por categoria de variável:**
- Valor médio mensal (Input R$, com helper text: "Média dos últimos 3 meses")
- Classificação (Radio inline: Essencial / Supérfluo / Cortar)
- Observações (Textarea opcional)

**Facilitador de preenchimento:**
- Botão "Importar do Extrato" (conecta com Open Banking via Pluggy/Belvo ou permite upload de CSV/OFX)
  - Se importação ativa: categorização semi-automática com IA (palavras-chave: "ifood" → Delivery, "uber" → Transporte)
  - Usuário revisa e confirma categorias sugeridas

**Rodapé do passo:**
- Total de saídas variáveis (soma automática)
- **Resumo até aqui:**
  - Total de Entradas: R$ X
  - Total de Saídas Fixas: R$ Y
  - Total de Saídas Variáveis: R$ Z
  - **Sobra/Falta: R$ (X - Y - Z)** (verde/vermelho conforme sinal)
- Botão "Próximo Passo"

---

**PASSO 4: Dívidas e Financiamentos**

- **Título:** "Você tem dívidas ou parcelamentos?"
- **Subtítulo:** "Liste tudo que você deve: cartões, empréstimos, financiamentos..."

**Opção inicial:**
- Radio: "Sim, tenho dívidas" / "Não tenho dívidas no momento"
- Se "Não tenho dívidas": pula para resumo final
- Se "Sim, tenho dívidas": exibe formulário abaixo

**Formulário de dívidas (lista dinâmica):**

Campos por dívida:
- Nome do credor (Input texto, ex: "Banco XYZ - Cartão", "Loja ABC - Parcelamento")
- Tipo (Dropdown: Cartão de crédito / Empréstimo pessoal / Financiamento / Cheque especial / Crédito consignado / Outro)
- Valor total da dívida (Input R$)
- Taxa de juros ao mês (Input % - opcional, helper: "Se não sabe, deixe em branco")
- Número de parcelas restantes (Input numérico)
- Valor da parcela mensal (Input R$)
- Status (Radio: Em dia / Atrasada)
- Data de vencimento (Date picker 1-31)

**Ações:**
- "+ Adicionar Nova Dívida"
- Ícone de lixeira para remover
- Ícone de informação "?" ao lado de "Taxa de juros" com tooltip explicativo

**Cálculo automático:**
- Se informar "Valor total" e "Número de parcelas", sugere valor da parcela
- Se informar "Parcela" e "N° de parcelas", calcula valor total aproximado

**Rodapé do passo:**
- Total de dívidas (soma dos valores totais)
- Total de parcelas mensais (soma das parcelas)
- Botão "Ir para Resumo"

---

**TELA FINAL: Resumo do Raio-X**

**Card de Visão Geral (destaque visual):**

```
┌─────────────────────────────────────┐
│  💰 ENTRADAS MENSAIS:  R$ 3.500,00  │
│  📤 SAÍDAS FIXAS:      R$ 2.100,00  │
│  📊 SAÍDAS VARIÁVEIS:  R$ 1.200,00  │
│  💳 PARCELAS DE DÍVIDAS: R$ 450,00  │
│  ─────────────────────────────────  │
│  💵 SOBRA/FALTA:       R$ -250,00   │
│     (Você está gastando mais        │
│      do que ganha)                  │
└─────────────────────────────────────┘
```

**Gráficos visuais:**
1. **Gráfico de Pizza:** Distribuição das despesas (Fixas / Variáveis / Dívidas)
2. **Gráfico de Barras:** Comparativo Entradas vs Saídas Totais

**Seção de Reflexão Emocional:**
- Pergunta: "Como você se sente ao ver esses números?"
- Textarea (máx. 200 chars, opcional)
- Atualizar Termômetro "Respirar" (slider 0-10 + justificativa)

**Alertas inteligentes (aparecem se aplicável):**
- ⚠️ "Suas saídas são maiores que suas entradas. Nos próximos dias, vamos trabalhar para reverter isso."
- ⚠️ "Você tem R$ X em dívidas com juros altos. Priorize renegociar isso no Dia 10."
- ✅ "Você tem sobra de R$ X! Vamos proteger e fazer esse dinheiro trabalhar para você."

**Botões de ação:**
- "Salvar Rascunho"
- "Concluir Dia 2" (gera relatório e desbloqueia Dia 3)

---

### 🗄️ Infraestrutura (Backend + Fluxo de Dados)

#### **Tabelas do Banco de Dados**

**6. Tabela: `income_items`**
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do item de renda |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `name` | VARCHAR(100) | NOT NULL | Nome da fonte (ex: "Salário") |
| `amount` | DECIMAL(10,2) | NOT NULL, CHECK > 0 | Valor mensal médio |
| `payment_day` | INTEGER | CHECK (1-31) | Dia do mês que recebe |
| `recurrence` | VARCHAR(20) | NOT NULL | 'monthly' / 'sporadic' |
| `notes` | TEXT | NULLABLE | Observações |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

**7. Tabela: `fixed_expenses`**
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da despesa fixa |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `category` | VARCHAR(50) | NOT NULL | Categoria (habitacao/servicos/transporte...) |
| `name` | VARCHAR(100) | NOT NULL | Nome do gasto |
| `amount` | DECIMAL(10,2) | NOT NULL, CHECK > 0 | Valor mensal médio |
| `due_day` | INTEGER | CHECK (1-31) | Dia do vencimento |
| `payment_method` | VARCHAR(30) | NOT NULL | Débito automático/Boleto/Cartão/PIX/Dinheiro |
| `classification` | VARCHAR(20) | NOT NULL | 'essential' / 'important' / 'negotiable' |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

**8. Tabela: `variable_expenses`**
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da despesa variável |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `category` | VARCHAR(50) | NOT NULL | mercado/restaurante/lazer/roupas... |
| `monthly_average` | DECIMAL(10,2) | NOT NULL, CHECK >= 0 | Média mensal |
| `classification` | VARCHAR(20) | NOT NULL | 'essential' / 'superfluous' / 'cut' |
| `notes` | TEXT | NULLABLE | Observações |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

**9. Tabela: `debts`**
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da dívida |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `creditor_name` | VARCHAR(100) | NOT NULL | Nome do credor |
| `debt_type` | VARCHAR(50) | NOT NULL | Cartão/Empréstimo/Financiamento/Cheque especial... |
| `total_amount` | DECIMAL(10,2) | NOT NULL, CHECK > 0 | Valor total da dívida |
| `interest_rate` | DECIMAL(5,2) | NULLABLE, CHECK >= 0 | Taxa de juros ao mês (%) |
| `installments_remaining` | INTEGER | NOT NULL, CHECK > 0 | Parcelas restantes |
| `monthly_installment` | DECIMAL(10,2) | NOT NULL, CHECK > 0 | Valor da parcela mensal |
| `status` | VARCHAR(20) | NOT NULL | 'current' / 'overdue' |
| `due_day` | INTEGER | CHECK (1-31) | Dia do vencimento |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

**10. Tabela: `financial_snapshot`** (resumo calculado)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do snapshot |
| `user_id` | UUID | FOREIGN KEY → users(id), UNIQUE | Usuário (1:1 snapshot atual) |
| `total_income` | DECIMAL(10,2) | NOT NULL | Soma de todas as receitas |
| `total_fixed` | DECIMAL(10,2) | NOT NULL | Soma de despesas fixas |
| `total_variable` | DECIMAL(10,2) | NOT NULL | Soma de despesas variáveis |
| `total_debt_payments` | DECIMAL(10,2) | NOT NULL | Soma de parcelas de dívidas |
| `balance` | DECIMAL(10,2) | NOT NULL | Sobra/Falta (income - fixed - variable - debt) |
| `total_debt_amount` | DECIMAL(10,2) | NOT NULL | Soma do valor total das dívidas |
| `emotional_note` | TEXT | NULLABLE | Sentimento ao ver o raio-x |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data do snapshot |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

---

#### **Regras de Negócio**

1. **Pré-preenchimento Inteligente (Dia 1 → Dia 2):**
   - Query: `SELECT monthly_income FROM initial_assessment WHERE user_id = ?`
   - Se existir valor, criar automaticamente 1 item em `income_items`:
     ```sql
     INSERT INTO income_items (user_id, name, amount, recurrence)
     VALUES (?, 'Renda Principal', ?, 'monthly')
     ```

2. **Validações de Entrada:**
   - Mínimo: 1 fonte de renda obrigatória (`income_items` > 0)
   - Valores devem ser > 0
   - Datas de vencimento entre 1-31
   - Taxa de juros entre 0-100% (se informada)

3. **Cálculo Automático do Snapshot:**
   - Ao concluir o Dia 2, executar função SQL que:
     ```sql
     INSERT INTO financial_snapshot (user_id, total_income, total_fixed, total_variable, total_debt_payments, balance, total_debt_amount)
     SELECT 
       user_id,
       (SELECT COALESCE(SUM(amount), 0) FROM income_items WHERE user_id = ?),
       (SELECT COALESCE(SUM(amount), 0) FROM fixed_expenses WHERE user_id = ?),
       (SELECT COALESCE(SUM(monthly_average), 0) FROM variable_expenses WHERE user_id = ?),
       (SELECT COALESCE(SUM(monthly_installment), 0) FROM debts WHERE user_id = ?),
       ( [income] - [fixed] - [variable] - [debt_payments] ),
       (SELECT COALESCE(SUM(total_amount), 0) FROM debts WHERE user_id = ?)
     ```

4. **Alertas Condicionais:**
   - Se `balance` < 0: Mostrar alerta "Gastando mais que ganha"
   - Se `total_debt_amount` > 0 E média `interest_rate` > 5%: Destacar "Dívidas com juros altos"
   - Se `balance` > 0 E > 20% da renda: "Parabéns! Você tem margem para investir ou acelerar dívidas"

5. **Classificação Automática (sugestão editável):**
   - Despesas fixas em categorias `habitacao`, `servicos`: sugerir `classification` = 'essential'
   - Despesas variáveis em categorias `lazer`, `roupas`: sugerir `classification` = 'superfluous'
   - Usuário pode editar manualmente

6. **Importação de Extratos (opcional):**
   - Integração com Open Banking (Pluggy/Belvo) via API
   - Upload de arquivo CSV/OFX com parser que extrai:
     - Data, Descrição, Valor
   - Categorização automática por palavras-chave:
     - "mercado", "supermercado" → Mercado
     - "uber", "99" → Transporte
     - "ifood", "rappi" → Delivery
     - "netflix", "spotify" → Assinaturas
   - Apresentar transações categorizadas para revisão do usuário antes de salvar

---

#### **Outputs do App (Documentos Gerados)**

1. **Relatório de Raio-X Financeiro** (PDF/Visualização no app)
   - Data de criação
   - Resumo de entradas (lista detalhada + total)
   - Resumo de despesas fixas (por categoria + total)
   - Resumo de despesas variáveis (por categoria + total)
   - Lista de dívidas (detalhamento + total)
   - Cálculo de sobra/falta
   - Gráficos: Pizza (distribuição de gastos) + Barras (entradas vs saídas)

2. **Tabela de Despesas Mensais** (Planilha interativa no app)
   - Visualização consolidada de todos os gastos
   - Filtros por categoria, classificação, forma de pagamento
   - Exportável para CSV

3. **Gráficos Visuais:**
   - **Gráfico de Pizza:** % de cada categoria de gasto em relação ao total de saídas
   - **Gráfico de Barras Horizontais:** Entradas vs Saídas (visualização do gap/sobra)
   - **Indicador visual:** Semáforo (Verde: sobra > 20% / Amarelo: sobra 0-20% / Vermelho: falta)

---

#### **Fluxo de Integração com Dias Futuros**

**Dados do Dia 2 que serão reutilizados:**

- **Dia 3 (Arqueologia Financeira):**
  - Lista de `variable_expenses` com classificação 'superfluous' ou 'cut' será destacada para análise detalhada
  - Transações importadas (se houver) serão base para identificar padrões

- **Dia 6 (Vazamentos Invisíveis):**
  - Query: `SELECT * FROM variable_expenses WHERE classification = 'cut'`
  - Query: `SELECT * FROM fixed_expenses WHERE category IN ('assinaturas', 'tarifas')`
  - Essas despesas serão listadas como candidatas a corte/pausa

- **Dia 7 (Vencimentos):**
  - Todas as `fixed_expenses` e `debts` com `due_day` preenchido alimentarão o calendário financeiro
  - Query: `SELECT name, amount, due_day, payment_method FROM fixed_expenses WHERE user_id = ? UNION SELECT creditor_name, monthly_installment, due_day, 'Boleto' FROM debts WHERE user_id = ?`

- **Dia 8 (Prioridades):**
  - Lista de `fixed_expenses` ordenada por `classification`:
    - `essential` → Prioridade altíssima
    - `important` → Prioridade média
    - `negotiable` → Baixa prioridade

- **Dia 9 (Orçamento Mínimo):**
  - Soma de `fixed_expenses WHERE classification = 'essential'` = base do orçamento mínimo
  - `variable_expenses WHERE classification = 'essential'` (ex: mercado básico) também entra

- **Dia 10 (Mapa de Negociação):**
  - Todas as `debts` com `interest_rate` > 5% ou `status` = 'overdue' vão para lista de negociação prioritária
  - Cálculo de quanto pode destinar: `balance` positivo do snapshot

- **Dia 12 (Fechar Acordo):**
  - Atualização da tabela `debts` com novos valores negociados
  - Criação de registros em nova tabela `agreements` (a ser criada no Dia 12)

- **Dia 14 (Plano 30/90):**
  - `financial_snapshot.balance` determina se o modo será "Emergência total" / "Equilibrar" / "Tração leve"
  - Dívidas com `interest_rate` mais altos vão para "Dívidas prioritárias" do plano

---

#### **Endpoints da API (Backend)**

**POST /api/v1/financial-snapshot/day2**
- **Payload:**
```json
{
  "user_id": "uuid",
  "income_items": [
    {
      "name": "Salário CLT",
      "amount": 3500.00,
      "payment_day": 5,
      "recurrence": "monthly",
      "notes": "Banco XYZ"
    }
  ],
  "fixed_expenses": [
    {
      "category": "habitacao",
      "name": "Aluguel",
      "amount": 1200.00,
      "due_day": 10,
      "payment_method": "PIX",
      "classification": "essential"
    },
    {
      "category": "servicos",
      "name": "Internet",
      "amount": 99.90,
      "due_day": 15,
      "payment_method": "Débito automático",
      "classification": "important"
    }
  ],
  "variable_expenses": [
    {
      "category": "mercado",
      "monthly_average": 800.00,
      "classification": "essential",
      "notes": "Média dos últimos 3 meses"
    },
    {
      "category": "lazer",
      "monthly_average": 200.00,
      "classification": "superfluous",
      "notes": "Pode reduzir"
    }
  ],
  "debts": [
    {
      "creditor_name": "Banco ABC - Cartão",
      "debt_type": "credit_card",
      "total_amount": 5000.00,
      "interest_rate": 12.5,
      "installments_remaining": 12,
      "monthly_installment": 450.00,
      "status": "current",
      "due_day": 20
    }
  ],
  "emotional_note": "Assustado com o tanto que gasto sem perceber",
  "breathe_log": {
    "day_number": 2,
    "breathe_score": 5,
    "breathe_reason": "Agora entendo onde está o problema"
  }
}
```

- **Response 201:**
```json
{
  "success": true,
  "message": "Raio-X concluído com sucesso!",
  "data": {
    "snapshot": {
      "total_income": 3500.00,
      "total_fixed": 1299.90,
      "total_variable": 1000.00,
      "total_debt_payments": 450.00,
      "balance": -249.90,
      "total_debt_amount": 5000.00
    },
    "alerts": [
      "Você está gastando R$ 249,90 a mais do que ganha.",
      "Dívida com juros de 12.5% ao mês. Priorize negociar no Dia 10."
    ],
    "next_day_unlocked": 3
  }
}
```

**GET /api/v1/financial-snapshot/{user_id}**
- **Response 200:**
```json
{
  "user_id": "uuid",
  "snapshot": {
    "total_income": 3500.00,
    "total_fixed": 1299.90,
    "total_variable": 1000.00,
    "total_debt_payments": 450.00,
    "balance": -249.90,
    "total_debt_amount": 5000.00,
    "created_at": "2024-01-02T21:30:00Z"
  },
  "breakdown": {
    "income_items": [...],
    "fixed_expenses": [...],
    "variable_expenses": [...],
    "debts": [...]
  }
}
```

**POST /api/v1/import-extract** (Opcional)
- **Payload:** Arquivo CSV/OFX ou token de Open Banking
- **Response:** Transações categorizadas para revisão

---

### 📊 Métricas de Sucesso do Dia 2

1. **Taxa de Conclusão:** % de usuários que completam o Dia 2 após iniciar
2. **Tempo Médio de Conclusão:** 15-25 minutos (meta)
3. **Taxa de Utilização de Importação:** % que usa importação de extratos vs preenchimento manual
4. **Distribuição de Balanço:**
   - % com sobra positiva
   - % com sobra marginal (0-20% da renda)
   - % com déficit (gastando mais que ganha)
5. **Categorias Mais Comuns:** Top 5 despesas fixas e variáveis mais frequentes
6. **Taxa de Endividamento:** % de usuários com dívidas vs sem dívidas

---



---

## **DIA 3 — Arqueologia Financeira**

### 🎯 Título
**Arqueologia Financeira: Investigue Seus Padrões de Gasto e Descubra Vazamentos**

### 🌅 Mensagem Matinal
Muitas vezes reclamamos de contas que "aparecem do nada", mas elas são resultado de escolhas repetidas. Fazer uma arqueologia financeira — vasculhar suas transações dos últimos 90 dias — é como olhar fotos antigas: no começo dá vergonha, mas logo enxergamos histórias, vícios e oportunidades de melhoria. O objetivo não é julgar, e sim aprender. Ao final deste dia você terá clareza sobre os maiores drenos do seu orçamento e os comportamentos que mais impactam suas finanças.

### 📚 Conceito FIRE do Dia
**Histórico é professor.** O movimento FIRE destaca que seus números de hoje refletem escolhas passadas. Olhar os últimos três meses ajuda a identificar 20% das despesas responsáveis por 80% dos problemas (princípio de Pareto). Também ajuda a perceber gastos sazonais ou esporádicos (festas, consertos, presentes) e a ajustar a projeção do orçamento mínimo. Ao compreender os padrões, fica mais fácil fazer cortes conscientes e evitar recaídas.

### ✅ Seu Desafio Hoje
Investigar seu passado financeiro recente para entender padrões e vazamentos invisíveis. Ao conhecer sua história de gastos, você identifica comportamentos que precisam mudar e projeta um teto realista para variáveis.

### 🎯 SUA TAREFA PRÁTICA

#### **Experiência do Usuário (UX/UI)**

**Tela de Introdução do Dia 3**
- **Header:** "Dia 3 — Arqueologia Financeira"
- **Barra de progresso:** 0% → 100%
- **Card motivacional:** "Seus extratos contam histórias. Hoje você vai descobrir padrões ocultos que impactam seu bolso."
- **Badges:** Tempo estimado (20-30 min) | Requer (Extratos dos últimos 90 dias)
- **CTA:** "Iniciar Investigação"

**Fluxo Principal (3 Passos + Insights)**

**PASSO 1: Importação ou Revisão de Extratos**

**Opção A: Importação Automática (Recomendado)**
- **Botão destacado:** "Conectar Minhas Contas" (Open Banking)
  - Integração via Pluggy/Belvo
  - Seleção de instituições financeiras (bancos, carteiras digitais)
  - Período: Últimos 90 dias (fixo)
  - Permissões: Leitura de transações (não permite movimentação)
  
- **Ou Botão secundário:** "Importar Arquivo de Extrato"
  - Upload de CSV, OFX, XLSX
  - Parser automático que detecta formato
  - Campos reconhecidos: Data, Descrição, Valor, Tipo (débito/crédito)

**Opção B: Revisão Manual**
- **Mensagem:** "Se você já importou extratos no Dia 2, vamos usar esses dados automaticamente."
- **Botão:** "Usar Dados do Dia 2" (pré-carrega transações já salvas)
- **Ou:** "Adicionar Mais Transações" (formulário manual)

**Feedback ao importar:**
- Loading spinner com mensagem: "Analisando X transações dos últimos 90 dias..."
- Ao concluir: "✅ Importamos X transações de Y contas. Vamos categorizá-las agora."

---

**PASSO 2: Categorização Inteligente de Transações**

**Tela de Categorização**
- **Componente:** Tabela interativa (paginada, 20 itens por página)
- **Colunas:**
  1. Data (DD/MM/YYYY)
  2. Descrição (ex: "IFOOD *REST JAPONES")
  3. Valor (R$ com cor: verde para créditos, vermelho para débitos)
  4. Categoria Sugerida (chip colorido, editável via dropdown)
  5. Tag "Sombra" (toggle: marcar como "despesa sombra")

**Categorias disponíveis:**
- 🛒 Mercado / Alimentação
- 🍕 Restaurantes / Delivery
- 🚗 Transporte (combustível, Uber, táxi, apps)
- 🏠 Habitação (aluguel, condomínio, IPTU)
- 💡 Contas (luz, água, gás, internet, telefone)
- 👕 Roupas / Vestuário
- 🎬 Lazer / Entretenimento
- 📱 Assinaturas (streaming, apps, clubes)
- 🏥 Saúde / Farmácia
- 🎓 Educação
- 🎁 Presentes
- 🏦 Tarifas Bancárias
- 💳 Pagamento de Dívidas
- 💰 Transferências / Poupança
- ➕ Outros

**Categorização Automática por IA (sugestão):**
- Palavras-chave detectadas:
  - "IFOOD", "RAPPI", "UBER EATS" → Restaurantes / Delivery
  - "UBER", "99", "TAXI" → Transporte
  - "NETFLIX", "SPOTIFY", "AMAZON PRIME" → Assinaturas
  - "MERCADO", "SUPERMERCADO", "CARREFOUR" → Mercado
  - "FARMACIA", "DROGARIA" → Saúde
  - "POSTO", "COMBUSTIVEL", "SHELL", "IPIRANGA" → Transporte (combustível)
  
- Usuário pode:
  - Aceitar sugestão (check verde)
  - Editar categoria (dropdown)
  - Marcar como "despesa sombra" (toggle)

**Filtros rápidos (barra superior):**
- Todas | Não Categorizadas | Despesas Sombra
- Ordenar por: Data | Valor (maior→menor) | Categoria

**Ações em lote:**
- Checkbox para selecionar múltiplas transações
- Botão "Categorizar Selecionadas" (aplica mesma categoria)
- Botão "Marcar como Sombra"

**Rodapé do passo:**
- Contador: "X de Y transações categorizadas"
- Botão "Salvar e Continuar" (ativo quando todas estão categorizadas)

---

**PASSO 3: Análise de Padrões e Top 5**

**Tela de Análise (cards e gráficos)**

**CARD 1: Top 5 Despesas por Valor Total**
- **Formato:** Lista rankeada
- **Exemplo:**
  ```
  1. 🏠 Habitação: R$ 3.600,00 (30 transações)
  2. 🍕 Restaurantes/Delivery: R$ 1.890,00 (47 transações)
  3. 🚗 Transporte: R$ 1.450,00 (82 transações)
  4. 🛒 Mercado: R$ 1.200,00 (12 transações)
  5. 📱 Assinaturas: R$ 380,00 (8 transações)
  ```
- **Interação:** Clique em cada item abre detalhamento (transações dessa categoria)

**CARD 2: Top 5 Despesas por Frequência**
- **Formato:** Lista com badge de frequência
- **Exemplo:**
  ```
  1. 🚗 Uber/Táxi: 82 transações (média 27/mês)
  2. 🍕 Delivery: 47 transações (média 16/mês)
  3. ☕ Cafeteria: 35 transações (média 12/mês)
  4. 🏦 Tarifas bancárias: 9 transações (média 3/mês)
  5. 🎁 Presentes: 6 transações (média 2/mês)
  ```

**CARD 3: Despesas "Sombra" Identificadas**
- **Descrição:** Gastos recorrentes que não trazem valor real
- **Lista:**
  - Assinaturas não usadas (ex: "Netflix - última visualização há 60 dias")
  - Tarifas bancárias evitáveis
  - Compras pequenas e frequentes (ex: lanchonete diária)
  - Delivery excessivo
  
- **Marcação:** Usuário marcou no Passo 2 OU app sugere baseado em:
  - Transações de assinaturas sem uso (dados de consumo se disponível)
  - Tarifas acima da média
  - Micro-gastos frequentes (> 15x/mês em delivery, cafés, etc.)

**CARD 4: Média Mensal por Categoria**
- **Gráfico de Barras Horizontais:**
  - X-axis: Valor médio mensal (últimos 3 meses)
  - Y-axis: Categorias
  - Cor: Verde para essenciais, amarelo para moderados, vermelho para altos

**CARD 5: Gastos Sazonais Detectados**
- **Descrição:** Despesas que não aparecem todo mês
- **Lista:**
  - IPTU (1x no período)
  - Seguro do carro (1x)
  - Presente de aniversário (2x)
  - Conserto de carro (1x)
  
- **Ação sugerida:** "Adicionar esses valores ao seu orçamento anual e dividir por 12 meses"

---

**PASSO 4: Reflexão e Insights Pessoais**

**Formulário de Reflexão:**

1. **"Quais são os 3 hábitos de gasto que você quer reduzir ou eliminar?"**
   - 3 campos de texto livre (máx. 100 chars cada)
   - Exemplos abaixo: "Delivery excessivo", "Compras por impulso em apps", "Cafezinho todo dia"

2. **"Quais são as 2 despesas que valem cada centavo?"**
   - 2 campos de texto (máx. 100 chars cada)
   - Exemplos: "Academia - minha saúde mental", "Internet - trabalho home office"

3. **"Qual foi a maior surpresa ao ver seus gastos?"**
   - Textarea (máx. 200 chars)
   - Campo aberto para insight pessoal

4. **Atualizar Termômetro "Respirar"**
   - Slider 0-10
   - Pergunta: "Após investigar seus gastos, como você se sente agora?"
   - Justificativa (textarea, máx. 150 chars)

**Alertas Inteligentes (aparecem se aplicável):**
- ⚠️ "Você gastou R$ X em delivery nos últimos 3 meses. Reduzir para 4x/mês economizaria R$ Y."
- ⚠️ "Detectamos R$ X em tarifas bancárias. Migrar para conta digital pode eliminar isso."
- ⚠️ "Assinaturas somam R$ X/mês. Revise se todas são essenciais no Dia 6."
- 💡 "Suas despesas com [categoria] aumentaram 30% no último mês. Fique atento!"

**Botões:**
- "Salvar Rascunho"
- "Concluir Dia 3"

---

### 🗄️ Infraestrutura (Backend + Fluxo de Dados)

#### **Tabelas do Banco de Dados**

**11. Tabela: `transactions`**
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da transação |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `transaction_date` | DATE | NOT NULL | Data da transação |
| `description` | VARCHAR(255) | NOT NULL | Descrição do extrato |
| `amount` | DECIMAL(10,2) | NOT NULL | Valor (negativo=débito, positivo=crédito) |
| `category` | VARCHAR(50) | NOT NULL | Categoria (mercado/delivery/transporte...) |
| `is_shadow` | BOOLEAN | DEFAULT FALSE | Marcada como despesa sombra |
| `source` | VARCHAR(50) | NOT NULL | Origem (imported_open_banking / uploaded_file / manual) |
| `account_name` | VARCHAR(100) | NULLABLE | Nome da conta/cartão de origem |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de importação |

**Índices:**
- `(user_id, transaction_date)` para queries temporais eficientes
- `(user_id, category)` para agregações por categoria

**12. Tabela: `spending_patterns`** (análise calculada)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do padrão |
| `user_id` | UUID | FOREIGN KEY → users(id), UNIQUE | Usuário (1:1 análise atual) |
| `analysis_period_start` | DATE | NOT NULL | Início do período (90 dias atrás) |
| `analysis_period_end` | DATE | NOT NULL | Fim do período (hoje) |
| `top_5_by_value` | JSONB | NOT NULL | Array de {category, total, count} |
| `top_5_by_frequency` | JSONB | NOT NULL | Array de {category, count, avg_per_month} |
| `shadow_expenses` | JSONB | NOT NULL | Array de {description, category, total, count} |
| `seasonal_expenses` | JSONB | NOT NULL | Array de {description, amount, date} |
| `monthly_avg_by_category` | JSONB | NOT NULL | Objeto {category: avg_amount} |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data da análise |

**13. Tabela: `insights`** (reflexões do usuário)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do insight |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `day_number` | INTEGER | DEFAULT 3 | Dia do desafio |
| `habits_to_reduce` | JSONB | NOT NULL | Array com 3 hábitos [string, string, string] |
| `valuable_expenses` | JSONB | NOT NULL | Array com 2 despesas valiosas |
| `biggest_surprise` | TEXT | NOT NULL | Maior surpresa ao ver gastos |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data do registro |

---

#### **Regras de Negócio**

1. **Importação de Transações:**
   - Período fixo: Últimos 90 dias a partir da data atual
   - Deduplicação: Verificar se transação já existe (`user_id` + `transaction_date` + `description` + `amount`)
   - Se duplicado: Não inserir novamente
   
2. **Categorização Automática (ML/Regras):**
   - **Regras baseadas em palavras-chave:**
     ```python
     categorization_rules = {
         'mercado': ['mercado', 'supermercado', 'carrefour', 'pão de açúcar'],
         'delivery': ['ifood', 'rappi', 'uber eats'],
         'transporte': ['uber', '99', 'taxi', 'posto', 'shell', 'ipiranga'],
         'assinaturas': ['netflix', 'spotify', 'amazon prime', 'disney+'],
         'farmacia': ['farmacia', 'drogaria', 'droga'],
         'tarifas': ['tarifa', 'anuidade', 'manutencao conta']
     }
     ```
   - Aplicar `LOWER()` na descrição antes de comparar
   - Se nenhuma regra aplicar: categoria = 'outros' (usuário deve revisar)
   
3. **Identificação Automática de Despesas Sombra:**
   - Query para assinaturas:
     ```sql
     SELECT description, COUNT(*), SUM(amount)
     FROM transactions
     WHERE user_id = ? 
       AND category = 'assinaturas'
       AND transaction_date >= CURRENT_DATE - INTERVAL '90 days'
     GROUP BY description
     HAVING COUNT(*) >= 3  -- Cobrado pelo menos 3 vezes
     ```
   - Se valor total > R$ 50 E descrição contém serviço de streaming/clube: sugerir como sombra
   
   - Micro-gastos frequentes:
     ```sql
     SELECT category, COUNT(*)
     FROM transactions
     WHERE user_id = ?
       AND ABS(amount) < 30  -- Gastos menores que R$ 30
       AND transaction_date >= CURRENT_DATE - INTERVAL '90 days'
     GROUP BY category
     HAVING COUNT(*) > 20  -- Mais de 20 transações pequenas
     ```
   - Categorias com > 20 micro-transações: alertar para revisão

4. **Cálculo de Padrões (executado ao concluir Dia 3):**
   
   **Top 5 por Valor:**
   ```sql
   SELECT category, SUM(ABS(amount)) as total, COUNT(*) as count
   FROM transactions
   WHERE user_id = ? 
     AND amount < 0  -- Apenas débitos
     AND transaction_date >= CURRENT_DATE - INTERVAL '90 days'
   GROUP BY category
   ORDER BY total DESC
   LIMIT 5
   ```
   
   **Top 5 por Frequência:**
   ```sql
   SELECT category, COUNT(*) as count, 
          COUNT(*) / 3.0 as avg_per_month  -- 90 dias = 3 meses
   FROM transactions
   WHERE user_id = ? AND amount < 0
     AND transaction_date >= CURRENT_DATE - INTERVAL '90 days'
   GROUP BY category
   ORDER BY count DESC
   LIMIT 5
   ```
   
   **Gastos Sazonais (aparecem 1-2 vezes):**
   ```sql
   SELECT description, ABS(amount) as amount, transaction_date
   FROM transactions
   WHERE user_id = ? AND amount < 0
     AND transaction_date >= CURRENT_DATE - INTERVAL '90 days'
   GROUP BY description, amount, transaction_date
   HAVING COUNT(*) = 1
     AND ABS(amount) > 200  -- Valores significativos
   ORDER BY amount DESC
   ```
   
   **Média Mensal por Categoria:**
   ```sql
   SELECT category, AVG(monthly_total) as avg_monthly
   FROM (
     SELECT category, DATE_TRUNC('month', transaction_date) as month,
            SUM(ABS(amount)) as monthly_total
     FROM transactions
     WHERE user_id = ? AND amount < 0
     GROUP BY category, month
   ) subquery
   GROUP BY category
   ORDER BY avg_monthly DESC
   ```

5. **Alertas Dinâmicos:**
   - Se categoria "delivery" > R$ 500 nos 90 dias: 
     - Calcular média mensal (ex: R$ 167)
     - Sugerir redução para 4x/mês (R$ 40/pedido = R$ 160)
     - Economia anual: (167 - 160) * 12
   
   - Se categoria "tarifas" > R$ 20/mês:
     - Alertar: "Migrar para conta digital pode economizar R$ X/ano"
   
   - Se total de "assinaturas" > R$ 100/mês:
     - Listar todas as assinaturas detectadas
     - Sugerir: "Revise suas assinaturas no Dia 6"

6. **Validações:**
   - Mínimo 10 transações importadas para análise válida
   - Se < 10: mostrar aviso "Dados insuficientes. Adicione mais transações ou use preenchimento manual."
   - Todas as transações devem ter categoria antes de concluir Dia 3

---

#### **Outputs do App (Documentos Gerados)**

1. **Relatório de Arqueologia Financeira** (PDF/Visualização)
   - Período analisado: DD/MM/YYYY - DD/MM/YYYY
   - Total de transações analisadas: X
   - Top 5 despesas por valor (tabela + gráfico de pizza)
   - Top 5 despesas por frequência (tabela)
   - Lista de despesas sombra com valor total
   - Gastos sazonais identificados
   - Média mensal por categoria (gráfico de barras)
   - Insights pessoais registrados

2. **Checklist de Hábitos a Revisar**
   - 3 hábitos para reduzir (do formulário de reflexão)
   - 2 despesas para manter (valiosas)
   - Data de criação

3. **Lista de Despesas Sombra para o Dia 6**
   - Exportada automaticamente para uso no Dia 6 (Vazamentos Invisíveis)
   - Formato: Nome da despesa | Categoria | Valor total (90 dias) | Frequência | Ação sugerida

---

#### **Fluxo de Integração com Dias Futuros**

**Dados do Dia 3 que serão reutilizados:**

- **Dia 6 (Vazamentos Invisíveis):**
  - Query: `SELECT * FROM transactions WHERE user_id = ? AND is_shadow = TRUE`
  - Também: `SELECT * FROM spending_patterns WHERE user_id = ?` → campo `shadow_expenses`
  - App pré-popula lista de vazamentos para decisão (cortar/pausar/manter)

- **Dia 9 (Orçamento Mínimo):**
  - Usa `monthly_avg_by_category` de `spending_patterns` para sugerir tetos realistas
  - Ex: Se média de mercado é R$ 800/mês, sugere teto inicial de R$ 800 (usuário pode ajustar)

- **Dia 13 (Novas Regras de Vida):**
  - Hábitos a reduzir (`insights.habits_to_reduce`) alimentam seção "Gatilhos Emocionais"
  - Ex: Se usuário identificou "Delivery por ansiedade", app sugere regra de pausa 24h

- **Dia 14 (Plano 30/90):**
  - Gastos sazonais (`spending_patterns.seasonal_expenses`) são incluídos no planejamento anual
  - App divide valor total por 12 e inclui no orçamento mensal como reserva

- **Dia 15 (Formatura):**
  - Comparação de padrões:
    - Top 3 categorias de gasto no Dia 3 vs comportamento na semana final
    - Evolução do Termômetro "Respirar" (Dia 3 vs Dia 15)

---

#### **Endpoints da API (Backend)**

**POST /api/v1/transactions/import**
- **Payload (Open Banking):**
```json
{
  "user_id": "uuid",
  "source": "open_banking",
  "provider": "pluggy",
  "access_token": "token_from_pluggy",
  "period_days": 90
}
```

- **Ou Payload (Upload de Arquivo):**
```json
{
  "user_id": "uuid",
  "source": "uploaded_file",
  "file_format": "csv",  // ou "ofx", "xlsx"
  "file_data": "base64_encoded_file"
}
```

- **Response 201:**
```json
{
  "success": true,
  "message": "347 transações importadas com sucesso",
  "data": {
    "total_imported": 347,
    "period_start": "2023-10-01",
    "period_end": "2023-12-31",
    "categorized_auto": 312,
    "needs_review": 35
  }
}
```

**PUT /api/v1/transactions/{transaction_id}/categorize**
- **Payload:**
```json
{
  "category": "delivery",
  "is_shadow": true
}
```

**POST /api/v1/analyze-patterns**
- **Payload:**
```json
{
  "user_id": "uuid"
}
```

- **Response 200:**
```json
{
  "success": true,
  "data": {
    "top_5_by_value": [
      {"category": "habitacao", "total": 3600.00, "count": 30},
      {"category": "delivery", "total": 1890.00, "count": 47}
    ],
    "top_5_by_frequency": [
      {"category": "transporte", "count": 82, "avg_per_month": 27.3}
    ],
    "shadow_expenses": [
      {"description": "NETFLIX", "category": "assinaturas", "total": 119.70, "count": 3},
      {"description": "TAXA MANUTENCAO CONTA", "category": "tarifas", "total": 45.00, "count": 3}
    ],
    "seasonal_expenses": [
      {"description": "IPTU 2023", "amount": 450.00, "date": "2023-11-15"}
    ],
    "monthly_avg_by_category": {
      "mercado": 800.00,
      "delivery": 630.00,
      "transporte": 483.33
    }
  }
}
```

**POST /api/v1/insights/day3**
- **Payload:**
```json
{
  "user_id": "uuid",
  "habits_to_reduce": [
    "Delivery excessivo por ansiedade",
    "Cafezinho todo dia no trabalho",
    "Compras por impulso em apps"
  ],
  "valuable_expenses": [
    "Academia - minha saúde mental",
    "Internet - trabalho remoto"
  ],
  "biggest_surprise": "Não sabia que gastava tanto em transporte por aplicativo",
  "breathe_log": {
    "day_number": 3,
    "breathe_score": 6,
    "breathe_reason": "Agora sei onde cortar. Me sinto mais no controle."
  }
}
```

---

### 📊 Métricas de Sucesso do Dia 3

1. **Taxa de Conclusão:** % que completa Dia 3
2. **Método de Importação:** % Open Banking vs Upload vs Manual
3. **Tempo de Categorização:** Tempo médio para categorizar todas as transações
4. **Transações Importadas:** Média de transações por usuário (meta: > 50 para análise robusta)
5. **Despesas Sombra Identificadas:** Média de despesas sombra por usuário
6. **Evolução do Termômetro:** Comparação Dia 2 vs Dia 3 (espera-se melhora após clareza)

---



---

## **DIA 4 — Regra da Pausa**

### 🎯 Título
**Regra da Pausa: Estanque a Sangria e Crie Barreiras Contra Impulsos**

### 🌅 Mensagem Matinal
Se você escorregar em uma ladeira, a primeira reação é segurar em algo para parar de cair. Na vida financeira é igual: antes de sair correndo para investir ou renegociar, você precisa estancar a sangria. A Regra da Pausa é o seu freio de emergência. Ao criar barreiras simples contra compras impulsivas e novos parcelamentos, você ganha tempo para pensar e evita que dívidas cresçam mais. Esse passo pode gerar desconforto, pois mexe em hábitos automáticos, mas é o que separa quem continua no ciclo de endividamento de quem começa a se reerguer.

### 📚 Conceito FIRE do Dia
**Parar de piorar é o primeiro passo para melhorar.** No caminho do FIRE, não adianta investir ou negociar dívidas se você continua criando novas. A Regra da Pausa combina duas práticas: congelar meios de pagamento de alto risco (como cartões de crédito) e aplicar a "regra das 24 horas" antes de qualquer compra não essencial. Essa pausa cria um espaço para reflexão: "Eu realmente preciso disso? Isso cabe no meu orçamento mínimo? Há alternativa mais barata?". Ao treinar essa habilidade, você reduz compras por impulso e reforça o músculo da disciplina.

### ✅ Seu Desafio Hoje
Implementar a Regra da Pausa para interromper imediatamente o efeito bola-de-neve das dívidas: reduzir impulsos de consumo, congelar cartão de crédito e criar um espaço de 24 horas entre o desejo e a compra.

### 🎯 SUA TAREFA PRÁTICA

#### **Experiência do Usuário (UX/UI)**

**Tela de Introdução do Dia 4**
- **Header:** "Dia 4 — Regra da Pausa"
- **Barra de progresso:** 0% → 100%
- **Card motivacional:** "Hoje você vai apertar o botão de emergência: parar de criar novas dívidas enquanto organiza as antigas."
- **Badges:** Tempo estimado (15-20 min) | Ação crítica (Congelar cartões)
- **CTA:** "Ativar Modo Pausa"

**Fluxo Principal (4 Passos)**

**PASSO 1: Inventário de Meios de Pagamento**

- **Título:** "Quais cartões e meios de pagamento você usa?"
- **Subtítulo:** "Vamos mapear tudo que permite você gastar: cartões, apps, crédito..."

**Componente:** Lista dinâmica de meios de pagamento

**Tipos de meios de pagamento (cards expansíveis):**

1. **💳 Cartões de Crédito**
   - Campos por cartão:
     - Nome/Bandeira (Input texto, ex: "Nubank Mastercard")
     - Limite total (Input R$)
     - Limite usado atualmente (Input R$ - cálculo automático de % usado)
     - Data de vencimento da fatura (Date picker 1-31)
     - Taxa de juros do rotativo (Input %, opcional)
     - Está no débito automático? (Toggle Sim/Não)
   - Ação: "+ Adicionar Cartão de Crédito"

2. **📱 Aplicativos de Pagamento**
   - Carteiras digitais (PicPay, Mercado Pago, PayPal, etc.)
   - Campos:
     - Nome do app
     - Possui limite de crédito? (Radio: Sim/Não)
     - Se sim: Limite total (R$) e usado (R$)
   - Ação: "+ Adicionar App"

3. **📄 Outros Créditos**
   - Cheque especial
   - Carnês de lojas
   - Crediário
   - Campos:
     - Tipo
     - Limite total
     - Valor usado
   - Ação: "+ Adicionar Outro"

**Pré-preenchimento inteligente:**
- Se existem dívidas tipo "Cartão de crédito" no Dia 2 (`debts` table):
  - Pré-carrega automaticamente esses cartões
  - Preenche nome do credor e limite com base nos dados da dívida
  - Mensagem: "Detectamos X cartões nas suas dívidas. Confirme os dados abaixo."

**Card de resumo (atualização dinâmica):**
```
┌────────────────────────────────────────┐
│ Total de limites de crédito: R$ X.XXX │
│ Total usado: R$ X.XXX (Y%)             │
│ Risco de endividamento: ALTO/MÉDIO/BA│
└────────────────────────────────────────┘
```

**Cálculo de risco:**
- < 30% usado: BAIXO (verde)
- 30-70% usado: MÉDIO (amarelo)
- > 70% usado: ALTO (vermelho)

**Rodapé:**
- "Total de meios cadastrados: X"
- Botão "Próximo Passo"

---

**PASSO 2: Congelar Cartões de Alto Risco**

- **Título:** "Hora de apertar o freio de emergência"
- **Subtítulo:** "Vamos congelar ou reduzir o limite dos cartões que representam maior risco"

**Lista de cartões (do Passo 1):**
- Ordenados por % de uso (maior → menor)
- Cada cartão exibe card com:
  - Nome
  - Limite usado/total (barra de progresso visual)
  - Badge de risco (Alto/Médio/Baixo)
  - **Ações disponíveis (checkboxes mutuamente exclusivos):**
    - ❄️ **Congelar:** Impedir novas compras (via app do banco ou guardando fisicamente)
    - 🔒 **Reduzir limite:** Diminuir para um valor seguro
    - 🆘 **Definir como emergencial:** Manter ativo apenas para emergências de saúde
    - ✅ **Manter como está:** Não alterar (só para cartões de baixo risco)

**Recomendações automáticas do app:**
- Cartões com > 80% de uso: sugere "Congelar" (destaque vermelho)
- Cartões com 50-80% de uso: sugere "Reduzir limite"
- Cartões com < 30% de uso: sugere "Definir como emergencial" (manter 1 apenas)

**Para cada ação selecionada:**

1. **Se "Congelar":**
   - Checkbox: "Vou congelar pelo app do banco" (pede confirmação)
   - Ou Checkbox: "Vou guardar o cartão físico em casa" (pede foto do local seguro - opcional)
   - Botão auxiliar: "Como congelar?" (abre tutorial por banco)

2. **Se "Reduzir limite":**
   - Input: "Novo limite seguro" (sugestão: 50% do orçamento mínimo/mês ou R$ 500, o que for menor)
   - Helper text: "Sugerimos R$ X baseado no seu orçamento"
   - Botão auxiliar: "Como reduzir?" (tutorial)

3. **Se "Definir como emergencial":**
   - ⚠️ Aviso: "Você só pode ter 1 cartão emergencial. Esse cartão só poderá ser usado com justificativa."
   - Campos adicionais:
     - Limite máximo por compra (Input R$, padrão: R$ 100)
     - Categorias permitidas (Checkboxes: Saúde/Farmácia | Emergência doméstica | Outro)
   - Confirmação: "Entendo que vou precisar justificar cada uso" (checkbox obrigatório)

**Rodapé:**
- Contador: "X de Y cartões com ação definida"
- Botão "Próximo Passo" (ativo quando todos os cartões de alto risco têm ação selecionada)

---

**PASSO 3: Ativar a Regra das 24 Horas**

- **Título:** "Crie um escudo contra compras por impulso"
- **Subtítulo:** "A partir de agora, você espera 24h antes de qualquer compra não planejada"

**Explicação interativa (expandible accordion):**

**"O que é a Regra das 24 Horas?"**
- Texto: "Antes de comprar algo que NÃO está no seu orçamento mínimo, você espera pelo menos 24 horas. Nesse tempo, o impulso passa e você decide com clareza."

**"Como funciona no app?"**
- Passo 1: Viu algo que quer comprar? Clique no botão "Quero Comprar" no app
- Passo 2: Descreva o item e o valor
- Passo 3: App agenda lembrete para 24 horas depois
- Passo 4: Após 24h, você decide: Comprar / Adiar / Desistir

**Formulário de Ativação:**

1. **"Ativar Regra das 24 Horas?"**
   - Toggle: ON/OFF (recomenda-se ON)
   - Se ON: habilita botão flutuante "Quero Comprar" em todas as telas do app

2. **"Configurar Lembretes"**
   - Horário preferido para lembrete (Time picker)
   - Canal (Radio: Push / WhatsApp / E-mail)

3. **"Valor mínimo para ativar a regra"**
   - Input R$ (padrão: R$ 50)
   - Helper: "Compras abaixo desse valor não precisam de pausa (ex: pão, leite)"

**Simulação da Regra (widget interativo):**
- **Cenário exemplo:** "Você viu um tênis por R$ 250 em promoção"
- Botão "Testar Regra das 24h"
  - Ao clicar: abre modal simulando o fluxo
  - Campos: Descrever o item, valor, por que quer comprar
  - Botão "Agendar para amanhã"
  - Feedback: "✅ Lembrete agendado! Amanhã você decide com calma."

**Rodapé:**
- Checkbox de compromisso: "Eu me comprometo a usar a Regra das 24 Horas nos próximos 30 dias"
- Botão "Próximo Passo"

---

**PASSO 4: Identificar Gatilhos Emocionais**

- **Título:** "Por que você gasta além da conta?"
- **Subtítulo:** "Identificar gatilhos emocionais ajuda a criar barreiras inteligentes"

**Formulário de Reflexão:**

1. **"Qual seu gatilho emocional mais comum?"**
   - Radio buttons (com ícones):
     - 😰 Ansiedade / Estresse
     - 😔 Tédio / Vazio emocional
     - ⏰ Atraso / Pressa (compra sem pesquisar)
     - 👨‍👩‍👧 Pressão social/familiar
     - 🎉 Celebração / Recompensa
     - ❓ Outro (campo de texto)

2. **"O que geralmente acontece antes de uma compra por impulso?"**
   - Checkboxes múltiplos:
     - Discussão / conflito
     - Dia ruim no trabalho
     - Ver promoção ou anúncio
     - Amigos/família comprando algo
     - Querer se sentir melhor
     - Nada específico / é automático

3. **"Qual ação substituta você vai usar quando o gatilho aparecer?"**
   - Radio buttons (com descrição):
     - ⏸️ Pausa de 10 minutos (respirar, caminhar, beber água)
     - 💬 Falar com alguém de confiança antes de comprar
     - 📱 Abrir este app e registrar o impulso (sem comprar)
     - 📝 Escrever por que quer comprar (journaling)
     - 🚶 Caminhar 10 minutos antes de decidir
     - 🎯 Outra ação (campo de texto)

**Card de compromisso (gerado dinamicamente):**
```
┌─────────────────────────────────────────────┐
│ MEU PROTOCOLO ANTI-IMPULSO                  │
│                                             │
│ Gatilho identificado: [Ansiedade]          │
│ Ação substituta: [Pausa de 10 min]         │
│                                             │
│ Quando sentir vontade de gastar sem        │
│ planejar, eu vou: Respirar fundo,          │
│ caminhar 10 minutos e DEPOIS usar          │
│ a Regra das 24 Horas no app.               │
└─────────────────────────────────────────────┘
```

**Atualização do Termômetro "Respirar":**
- Pergunta: "Após congelar cartões e ativar proteções, como você se sente?"
- Slider 0-10 + justificativa (textarea)

**Rodapé:**
- Botões: "Salvar Rascunho" | "Concluir Dia 4"

---

**Tela de Conclusão do Dia 4:**

**Card de Resumo:**
```
✅ Dia 4 Concluído!

Suas proteções ativadas:
• X cartões congelados
• X limites reduzidos
• 1 cartão emergencial configurado
• Regra das 24 Horas ATIVA
• Gatilho identificado: [Nome]
• Ação substituta definida

A partir de agora, você tem barreiras contra
novas dívidas. Continue firme!
```

**Preview do Dia 5:** "Dia 5 — Cartão: Parar a Fatura de Crescer"

---

### 🗄️ Infraestrutura (Backend + Fluxo de Dados)

#### **Tabelas do Banco de Dados**

**14. Tabela: `payment_methods`**
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do meio de pagamento |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `type` | VARCHAR(50) | NOT NULL | 'credit_card' / 'digital_wallet' / 'overdraft' / 'store_credit' |
| `name` | VARCHAR(100) | NOT NULL | Nome/bandeira (ex: "Nubank Mastercard") |
| `credit_limit` | DECIMAL(10,2) | NOT NULL, CHECK >= 0 | Limite total |
| `used_amount` | DECIMAL(10,2) | NOT NULL, CHECK >= 0 | Valor atualmente usado |
| `due_day` | INTEGER | CHECK (1-31), NULLABLE | Dia do vencimento (se cartão) |
| `interest_rate` | DECIMAL(5,2) | NULLABLE | Taxa de juros do rotativo (%) |
| `auto_debit` | BOOLEAN | DEFAULT FALSE | Está no débito automático |
| `status` | VARCHAR(20) | NOT NULL | 'active' / 'frozen' / 'reduced' / 'emergency' |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

**15. Tabela: `emergency_card`** (cartão emergencial)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da config |
| `user_id` | UUID | FOREIGN KEY → users(id), UNIQUE | Usuário (apenas 1 cartão emergencial) |
| `payment_method_id` | UUID | FOREIGN KEY → payment_methods(id) | Cartão definido como emergencial |
| `max_per_purchase` | DECIMAL(10,2) | NOT NULL, CHECK > 0 | Limite máximo por compra |
| `allowed_categories` | JSONB | NOT NULL | Array de categorias permitidas |
| `requires_justification` | BOOLEAN | DEFAULT TRUE | Exige justificativa para uso |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**16. Tabela: `purchase_requests`** (Regra das 24 Horas)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da solicitação |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `item_description` | VARCHAR(255) | NOT NULL | O que quer comprar |
| `amount` | DECIMAL(10,2) | NOT NULL, CHECK > 0 | Valor do item |
| `reason` | TEXT | NULLABLE | Por que quer comprar |
| `request_date` | TIMESTAMP | DEFAULT NOW() | Quando registrou o desejo |
| `release_date` | TIMESTAMP | NOT NULL | Data/hora de liberação (request_date + 24h) |
| `decision` | VARCHAR(20) | NULLABLE | 'purchased' / 'postponed' / 'cancelled' |
| `decision_date` | TIMESTAMP | NULLABLE | Quando tomou a decisão |
| `decision_note` | TEXT | NULLABLE | Nota sobre a decisão |

**17. Tabela: `emotional_triggers`** (gatilhos)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do gatilho |
| `user_id` | UUID | FOREIGN KEY → users(id), UNIQUE | Usuário (1:1) |
| `main_trigger` | VARCHAR(50) | NOT NULL | anxiety / boredom / rush / social_pressure / celebration / other |
| `trigger_context` | JSONB | NOT NULL | Array de contextos (discussão, trabalho, anúncios...) |
| `substitute_action` | VARCHAR(100) | NOT NULL | Ação substituta escolhida |
| `substitute_action_detail` | TEXT | NULLABLE | Detalhamento da ação |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**18. Tabela: `rule_24h_config`** (configuração da regra)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da config |
| `user_id` | UUID | FOREIGN KEY → users(id), UNIQUE | Usuário (1:1) |
| `is_active` | BOOLEAN | DEFAULT TRUE | Se a regra está ativa |
| `reminder_time` | TIME | NOT NULL | Horário preferido para lembretes |
| `reminder_channel` | VARCHAR(20) | NOT NULL | 'push' / 'whatsapp' / 'email' |
| `minimum_amount` | DECIMAL(10,2) | DEFAULT 50.00 | Valor mínimo para ativar regra |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

---

#### **Regras de Negócio**

1. **Pré-preenchimento de Cartões (Dia 2 → Dia 4):**
   - Query: `SELECT * FROM debts WHERE user_id = ? AND debt_type = 'credit_card'`
   - Para cada dívida de cartão:
     - Criar registro em `payment_methods`:
       - `name` = `creditor_name`
       - `credit_limit` = `total_amount` / `installments_remaining` * 10 (estimativa)
       - `used_amount` = `total_amount`
       - `status` = 'active' (usuário vai definir no Passo 2)

2. **Cálculo de Risco de Endividamento:**
   ```sql
   SELECT 
     SUM(credit_limit) as total_limit,
     SUM(used_amount) as total_used,
     (SUM(used_amount) / SUM(credit_limit) * 100) as usage_percentage
   FROM payment_methods
   WHERE user_id = ? AND type = 'credit_card'
   ```
   - Se `usage_percentage` < 30: risco = "BAIXO"
   - Se 30-70: risco = "MÉDIO"
   - Se > 70: risco = "ALTO"

3. **Validação do Cartão Emergencial:**
   - Apenas 1 cartão emergencial permitido por usuário
   - Constraint: `UNIQUE(user_id)` na tabela `emergency_card`
   - Se usuário tentar definir 2º cartão: erro "Você já tem um cartão emergencial. Desative o anterior primeiro."

4. **Regra das 24 Horas - Criação de Solicitação:**
   ```sql
   INSERT INTO purchase_requests (user_id, item_description, amount, reason, release_date)
   VALUES (?, ?, ?, ?, NOW() + INTERVAL '24 hours')
   ```
   - Agendar notificação para `release_date`
   - Notificação: "⏰ Sua pausa de 24h terminou! Você ainda quer comprar [item]? Valor: R$ X"

5. **Fluxo de Decisão (após 24h):**
   - Usuário abre notificação → Modal com 3 botões:
     - "Comprar" → `decision` = 'purchased', pede justificativa
     - "Adiar mais 24h" → `decision` = 'postponed', nova `release_date` = NOW() + 24h
     - "Desistir" → `decision` = 'cancelled', registra economia

6. **Uso do Cartão Emergencial:**
   - Ao tentar usar cartão emergencial (via integração futura ou registro manual):
     - Validar se `amount` <= `max_per_purchase`
     - Verificar se categoria está em `allowed_categories`
     - Se `requires_justification` = TRUE: abrir modal para justificar antes de aprovar
     - Registrar uso em nova tabela `emergency_card_usage` (criar quando necessário)

7. **Congelamento de Cartões:**
   - Quando `status` = 'frozen':
     - App bloqueia novas transações (se integrado com banco via API)
     - Ou apenas registra como congelado e alerta usuário
     - Exibe badge "❄️ CONGELADO" em todas as telas de pagamento

8. **Alertas ao Tentar Usar Cartão Congelado:**
   - Se usuário tenta adicionar compra manual em cartão com `status` = 'frozen':
     - Modal: "⚠️ Este cartão está congelado. Você definiu isso no Dia 4 para proteger suas finanças. Tem certeza que quer descongelar?"
     - Opções: "Manter Congelado" / "Descongelar Temporariamente" (pede justificativa)

---

#### **Outputs do App (Documentos Gerados)**

1. **Relatório de Congelamento**
   - Data: DD/MM/YYYY
   - Cartões congelados: Lista com nomes e limites
   - Limites reduzidos: Lista de cartões com limite anterior → novo limite
   - Cartão emergencial: Nome, limite por compra, categorias permitidas
   - Economia estimada: (Limite total antes - Limite total depois) * 12 meses

2. **Checklist da Regra da Pausa**
   - Regra das 24 Horas: ATIVA ✅
   - Valor mínimo: R$ X
   - Horário de lembretes: HH:MM
   - Gatilho identificado: [Nome]
   - Ação substituta: [Descrição]

3. **Histórico de Solicitações de Compra** (para consulta futura no Dia 6)
   - Tabela: Item | Valor | Data da solicitação | Decisão | Economia (se desistiu)

---

#### **Fluxo de Integração com Dias Futuros**

**Dados do Dia 4 que serão reutilizados:**

- **Dia 5 (Cartão: Parar a Fatura de Crescer):**
  - Lista de `payment_methods` tipo 'credit_card' com `status` != 'frozen'
  - Cartões ativos serão alvo de estratégia de controle de fatura
  - Cartão emergencial (`emergency_card`) terá regras reforçadas

- **Dia 6 (Vazamentos Invisíveis):**
  - Histórico de `purchase_requests` com `decision` = 'cancelled'
  - Mostra "Você evitou gastar R$ X usando a Regra das 24 Horas!" (soma dos valores cancelados)

- **Dia 12 (Fechar Acordo):**
  - Cartões com `status` = 'frozen' podem ser usados como argumento na negociação:
    - "Já congelei meus cartões para não criar novas dívidas. Preciso de condições sustentáveis."

- **Dia 13 (Novas Regras de Vida):**
  - `emotional_triggers.main_trigger` e `substitute_action` alimentam seção "Regras Pessoais"
  - App cria "Protocolo Anti-Impulso" permanente com base nesses dados

- **Dia 15 (Formatura):**
  - Métricas de sucesso:
    - Total de solicitações via Regra 24h: X
    - Taxa de desistência: Y% (quantos cancelaram após 24h)
    - Economia total gerada: R$ Z (soma dos valores cancelados)

---

#### **Endpoints da API (Backend)**

**POST /api/v1/payment-methods**
- **Payload:**
```json
{
  "user_id": "uuid",
  "payment_methods": [
    {
      "type": "credit_card",
      "name": "Nubank Mastercard",
      "credit_limit": 5000.00,
      "used_amount": 4200.00,
      "due_day": 15,
      "interest_rate": 12.5,
      "auto_debit": false,
      "status": "frozen"
    }
  ]
}
```

**PUT /api/v1/payment-methods/{id}/freeze**
- **Payload:**
```json
{
  "status": "frozen",
  "freeze_method": "app"  // ou "physical"
}
```

**POST /api/v1/emergency-card**
- **Payload:**
```json
{
  "user_id": "uuid",
  "payment_method_id": "uuid-do-cartão",
  "max_per_purchase": 100.00,
  "allowed_categories": ["saúde", "farmácia", "emergência"],
  "requires_justification": true
}
```

**POST /api/v1/purchase-request**
- **Payload:**
```json
{
  "user_id": "uuid",
  "item_description": "Tênis Nike em promoção",
  "amount": 250.00,
  "reason": "Vi no Instagram, estava com desconto"
}
```

- **Response 201:**
```json
{
  "success": true,
  "message": "Solicitação agendada! Você decidirá em 24 horas.",
  "data": {
    "request_id": "uuid",
    "release_date": "2024-01-05T21:00:00Z",
    "reminder_scheduled": true
  }
}
```

**PUT /api/v1/purchase-request/{id}/decide**
- **Payload:**
```json
{
  "decision": "cancelled",  // ou "purchased" / "postponed"
  "decision_note": "Percebi que não preciso. Vou usar o dinheiro para pagar dívida."
}
```

**POST /api/v1/emotional-triggers**
- **Payload:**
```json
{
  "user_id": "uuid",
  "main_trigger": "anxiety",
  "trigger_context": ["discussão", "trabalho_ruim", "anúncios"],
  "substitute_action": "pause_10min",
  "substitute_action_detail": "Vou respirar fundo e caminhar 10 minutos antes de decidir",
  "breathe_log": {
    "day_number": 4,
    "breathe_score": 7,
    "breathe_reason": "Me sinto mais protegido com cartões congelados"
  }
}
```

---

### 📊 Métricas de Sucesso do Dia 4

1. **Taxa de Conclusão:** % que completa Dia 4
2. **Taxa de Congelamento:** % de usuários que congelam pelo menos 1 cartão
3. **Redução de Limite Médio:** Média de redução de limites (R$ antes vs depois)
4. **Adoção da Regra 24h:** % que ativa a regra
5. **Solicitações de Compra:** Média de solicitações por usuário na primeira semana
6. **Taxa de Cancelamento:** % de solicitações que resultam em desistência após 24h (meta: > 40%)
7. **Evolução do Termômetro:** Comparação Dia 3 vs Dia 4 (espera-se melhora após medidas de proteção)

---



---

## **DIA 5 — Cartão: Parar a Fatura de Crescer**

### 🎯 Título
**Controle de Cartão: Impedir que a Fatura Cresça e Sair do Rotativo**

### 🌅 Mensagem Matinal
O cartão de crédito pode ser um aliado ou um vilão. Ele oferece praticidade, mas também estimula a gastar sem perceber e cobra juros altos quando atrasamos. Parar a fatura de crescer não é eliminar o cartão, mas usá-lo com inteligência. Hoje vamos estabelecer limites realistas, definir prioridades de pagamento e aprender como sair do rotativo passo a passo. Essa decisão protege você de juros corrosivos e permite que o dinheiro trabalhe a seu favor.

### 📚 Conceito FIRE do Dia
**Cartão consciente.** Na jornada FIRE, o cartão deve ser uma ferramenta de gestão de fluxo de caixa, não uma extensão da renda. As regras básicas são: gastar só o que já existe na conta, pagar a fatura integralmente sempre que possível, evitar parcelamentos longos e ter um teto claro (por categoria) no orçamento. Além disso, se você já está no rotativo, a prioridade número 1 é sair dele: negociar com o banco ou migrar o saldo para uma linha mais barata.

### ✅ Seu Desafio Hoje
Criar um plano concreto para controlar o cartão de crédito: impedir que a fatura cresça, evitar juros do rotativo e usar o cartão apenas como ferramenta (e não armadilha).

### 🎯 SUA TAREFA PRÁTICA

#### **Experiência do Usuário (UX/UI)**

**Tela de Introdução do Dia 5**
- **Header:** "Dia 5 — Cartão: Parar a Fatura de Crescer"
- **Barra de progresso:** 0% → 100%
- **Card motivacional:** "O cartão não é inimigo. O problema é usá-lo sem limites. Hoje você vai criar regras claras."
- **Badges:** Tempo estimado (20-25 min) | Requer (Faturas atuais dos cartões)
- **CTA:** "Criar Plano de Controle"

**Fluxo Principal (4 Passos)**

**PASSO 1: Raio-X das Faturas Atuais**

- **Título:** "Vamos ver a situação real de cada cartão"
- **Subtítulo:** "Faturas em aberto, parcelas futuras e rotativo"

**Pré-carregamento:**
- App lista todos os cartões de crédito cadastrados no Dia 4 (`payment_methods` WHERE `type` = 'credit_card')
- Para cada cartão exibe card expansível

**Card por Cartão (accordion):**

**Header do card:**
- Nome do cartão (ex: "Nubank Mastercard")
- Badge de status (Ativo / Congelado / Emergencial - do Dia 4)
- Limite usado/total com barra de progresso

**Conteúdo expandido:**

1. **Fatura Atual**
   - Valor total da fatura (Input R$)
   - Data de vencimento (Date picker - pré-preenchido se cadastrou no Dia 4)
   - Valor mínimo da fatura (Input R$, geralmente 15% do total)
   - Status de pagamento (Radio: Pago integral / Pago mínimo / Não pago / Atrasado)

2. **Rotativo**
   - Pergunta: "Você está no rotativo?" (Toggle Sim/Não)
   - Se SIM:
     - Valor no rotativo (Input R$)
     - Taxa de juros ao mês (Input %, helper: "Geralmente 10-15%")
     - Há quantos meses (Input numérico)
     - **Alerta vermelho:** "⚠️ Juros do rotativo são os mais caros! Prioridade máxima sair daqui."

3. **Parcelas Futuras**
   - Pergunta: "Tem compras parceladas que continuam aparecendo nas próximas faturas?"
   - Se SIM: Lista dinâmica
     - Campos por parcelamento:
       - Descrição (ex: "TV Samsung 50 polegadas")
       - Valor da parcela (R$)
       - Parcelas restantes (Input numérico)
       - Valor total restante (cálculo automático: parcela × parcelas restantes)
   - Botão "+ Adicionar Parcelamento"

**Cálculo automático no rodapé do card:**
```
Total comprometido nos próximos meses:
• Parcelas fixas: R$ X/mês
• Rotativo (se não pagar): R$ Y/mês de juros
• Projeção em 3 meses: R$ Z
```

**Rodapé do passo:**
- Total de cartões analisados: X
- Total em rotativo (somando todos os cartões): R$ X
- Total de parcelas mensais comprometidas: R$ Y
- Botão "Próximo Passo"

---

**PASSO 2: Negociar com o Banco**

- **Título:** "Ajuste seu cartão para caber no seu orçamento"
- **Subtítulo:** "Reduzir limite, mudar vencimento ou parcelar fatura"

**Para cada cartão (lista):**

**Ações disponíveis (checkboxes):**

1. **🔽 Solicitar redução de limite**
   - Campo: "Novo limite desejado" (R$)
   - Sugestão do app: Baseado em `financial_snapshot.balance` do Dia 2
     - Se sobra positiva: sugestão = 50% da sobra mensal
     - Se déficit: sugestão = R$ 500 (mínimo de segurança)
   - Helper: "Sugerimos R$ X para caber no seu orçamento mínimo"
   - Botão auxiliar: "Como solicitar?" (tutorial por banco - Nubank, Inter, Itaú, etc.)

2. **📅 Alterar data de vencimento**
   - Campo: "Nova data de vencimento" (1-31)
   - Sugestão do app: Baseado em `income_items.payment_day` do Dia 2
     - Ex: Se recebe salário no dia 5, sugere vencimento no dia 10-12
   - Helper: "Alinhe o vencimento com a data que você recebe sua renda"
   - Botão auxiliar: "Como alterar?" (tutorial)

3. **💳 Parcelar fatura atual a juros menores**
   - Disponível apenas se: `fatura_atual` > R$ 500
   - Campo: "Número de parcelas" (Dropdown: 2x, 3x, 6x, 12x)
   - App busca taxas do banco (integração ou input manual):
     - Taxa de parcelamento (Input %, helper: "Geralmente 2-4% ao mês")
   - Simulação:
     - Valor da parcela: R$ X
     - Total a pagar (com juros): R$ Y
     - **Comparação:** "Se continuar no rotativo (12.5% ao mês), pagaria R$ Z. Economia: R$ W"
   - Botão "Simular Parcelamento"

4. **🔄 Migrar saldo do rotativo para linha mais barata**
   - Disponível se: `rotativo` > 0
   - Opções de migração (radio):
     - Empréstimo pessoal (taxa típica: 2-5% ao mês)
     - Crédito consignado (se disponível, taxa: 1-2% ao mês)
     - Outra linha de crédito do banco
   - Campos:
     - Taxa de juros da nova linha (Input %)
     - Prazo (meses)
   - Simulação de economia:
     - Juros atuais no rotativo (3 meses): R$ X
     - Juros na nova linha (3 meses): R$ Y
     - **Economia: R$ (X - Y)**
   - Botão "Comparar Opções"

**Para cada ação selecionada:**
- Checkbox de confirmação: "Vou entrar em contato com o banco para fazer isso"
- Campo de data: "Até quando vou fazer?" (Date picker)
- App agenda lembrete para essa data

**Rodapé do passo:**
- Ações agendadas: X
- Economia potencial total: R$ Y (soma das economias de todas as ações)
- Botão "Próximo Passo"

---

**PASSO 3: Definir Regras de Uso do Cartão**

- **Título:** "Crie seu protocolo de uso consciente"
- **Subtítulo:** "Regras claras evitam que a fatura volte a crescer"

**Configuração por Cartão (ou Geral para todos):**

Toggle no topo: "Aplicar mesmas regras para todos os cartões" / "Configurar individualmente"

**Regras disponíveis (checkboxes múltiplos):**

1. **💰 Limite máximo por compra**
   - Input: R$ (ex: R$ 200)
   - Se compra exceder: App alerta "⚠️ Compra acima do limite! Revise sua regra do Dia 5"

2. **🚫 Bloquear compras em categorias específicas**
   - Checkboxes de categorias:
     - Lazer / Entretenimento
     - Roupas / Vestuário
     - Delivery / Restaurantes
     - Assinaturas
     - Eletrônicos
     - Viagens
     - Outros
   - Se tentar compra nessas categorias: App pede justificativa obrigatória

3. **📦 Limite de parcelamentos**
   - Radio:
     - Sem parcelamento (só à vista)
     - Máximo 2x sem juros
     - Máximo 3x sem juros
     - Outro (especificar)
   - Se tentar parcelar mais: Alerta de confirmação dupla

4. **📊 Teto mensal de uso**
   - Input: R$ (valor máximo a gastar no cartão por mês)
   - Baseado em: % do orçamento mínimo ou valor fixo
   - Helper: "Sugerimos 30% do seu orçamento mínimo = R$ X"
   - App rastreia gasto acumulado no mês
   - Alertas progressivos:
     - 50% do teto: "Você já usou metade do limite mensal"
     - 80%: "⚠️ Atenção! 80% do teto atingido"
     - 100%: "🛑 LIMITE MENSAL ATINGIDO! Evite novas compras"

5. **✅ Exigir justificativa para toda compra**
   - Toggle: Sim/Não
   - Se SIM: Antes de registrar compra no app, modal pede:
     - "Por que você está comprando isso?"
     - "Essa compra está no seu orçamento?"
     - "Você pode esperar 24h?" (lembra da Regra do Dia 4)

**Card de Compromisso (auto-gerado):**
```
┌────────────────────────────────────────┐
│ MINHAS REGRAS DE CARTÃO                │
│                                        │
│ • Limite por compra: R$ 200            │
│ • Categorias bloqueadas: Lazer, Roupas │
│ • Parcela máximo: 3x sem juros         │
│ • Teto mensal: R$ 600                  │
│ • Justificar: Sim                      │
│                                        │
│ Assinado digitalmente em DD/MM/YYYY    │
└────────────────────────────────────────┘
```

**Botão:** "Salvar Regras" → Gera documento e exibe QR code para imprimir/salvar como imagem

---

**PASSO 4: Plano de Pagamento**

- **Título:** "Como você vai pagar as faturas dos próximos 3 meses?"
- **Subtítulo:** "Planeje para sair do rotativo e quitar parcelas"

**Simulador Interativo (Timeline):**

**Mês 1 (Atual):**
- Fatura total: R$ X (puxado do Passo 1)
- Você tem disponível: R$ Y (puxado de `financial_snapshot.balance` do Dia 2 + renda próxima)
- Opções de pagamento (radio):
  - 💰 Pagar integral (R$ X) → Sem juros, melhor opção
  - 📉 Pagar mínimo (R$ Z) → Vai para rotativo, juros de R$ W no próximo mês
  - ✂️ Pagar parcial (Input: R$, entre mínimo e total) → Calcula juros sobre diferença
  
- **Simulação ao selecionar:**
  - Se pagar integral: "✅ Parabéns! Zero juros. Fatura do mês 2 será apenas parcelas fixas (R$ P)"
  - Se pagar mínimo: "⚠️ Rotativo de R$ (X-Z) gerará juros de R$ W no mês 2. Total no mês 2: R$ (X-Z+W+P)"
  - Se pagar parcial: Cálculo dinâmico dos juros

**Mês 2:**
- Projeção automática baseada na decisão do Mês 1
- Parcelas fixas comprometidas: R$ P
- Se entrou rotativo: + Juros acumulados
- Nova fatura projetada: R$ X
- Campo: "Quanto pretende pagar no Mês 2?" (Input R$)

**Mês 3:**
- Projeção acumulada
- Meta: "Sair do rotativo até aqui" (destaque se atingir meta)

**Gráfico Visual:**
- Eixo X: Meses (1, 2, 3)
- Eixo Y: Valores
- Linhas:
  - Linha vermelha: Fatura total (incluindo juros do rotativo)
  - Linha verde: Pagamento planejado
  - Área sombreada: Juros acumulados
  - Linha de meta: Zerar rotativo

**Alertas Inteligentes:**
- Se nunca paga integral: "Você nunca sairá do rotativo pagando só o mínimo. Priorize pagar ao menos 50% da fatura."
- Se paga integral: "🎉 Com pagamento integral, você economiza R$ X em juros nos próximos 3 meses!"
- Se migrar para linha mais barata: "Migração economizará R$ Y em 3 meses"

**Atualização do Termômetro "Respirar":**
- Pergunta: "Após criar seu plano de controle de cartão, como você se sente?"
- Slider 0-10 + justificativa

**Rodapé:**
- Botões: "Salvar Rascunho" | "Concluir Dia 5"

---

**Tela de Conclusão do Dia 5:**

```
✅ Dia 5 Concluído!

Seu Plano de Controle de Cartão:
• X ações negociadas com banco
• Regras de uso definidas
• Plano de pagamento para 3 meses
• Economia projetada: R$ Y em juros evitados

Próximo passo: Dia 6 - Cortar Vazamentos Invisíveis
```

---

### 🗄️ Infraestrutura (Backend + Fluxo de Dados)

#### **Tabelas do Banco de Dados**

**19. Tabela: `card_invoices`** (faturas)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da fatura |
| `payment_method_id` | UUID | FOREIGN KEY → payment_methods(id) | Cartão |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `invoice_month` | DATE | NOT NULL | Mês/ano da fatura (primeiro dia do mês) |
| `total_amount` | DECIMAL(10,2) | NOT NULL | Valor total da fatura |
| `minimum_amount` | DECIMAL(10,2) | NOT NULL | Valor mínimo |
| `due_date` | DATE | NOT NULL | Data de vencimento |
| `amount_paid` | DECIMAL(10,2) | DEFAULT 0 | Quanto foi pago |
| `payment_status` | VARCHAR(20) | NOT NULL | 'paid_full' / 'paid_minimum' / 'paid_partial' / 'unpaid' / 'overdue' |
| `rotativo_amount` | DECIMAL(10,2) | DEFAULT 0 | Valor que foi para rotativo |
| `rotativo_months` | INTEGER | DEFAULT 0 | Há quantos meses no rotativo |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**20. Tabela: `card_installments`** (parcelas futuras)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do parcelamento |
| `payment_method_id` | UUID | FOREIGN KEY → payment_methods(id) | Cartão |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `description` | VARCHAR(255) | NOT NULL | Descrição da compra |
| `installment_value` | DECIMAL(10,2) | NOT NULL | Valor de cada parcela |
| `installments_remaining` | INTEGER | NOT NULL, CHECK > 0 | Parcelas restantes |
| `total_remaining` | DECIMAL(10,2) | NOT NULL | Valor total restante (calculado) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**21. Tabela: `card_rules`** (regras de uso)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da regra |
| `payment_method_id` | UUID | FOREIGN KEY → payment_methods(id), NULLABLE | Cartão específico (NULL = todas) |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `max_per_purchase` | DECIMAL(10,2) | NULLABLE | Limite por compra |
| `blocked_categories` | JSONB | DEFAULT '[]' | Array de categorias bloqueadas |
| `max_installments` | INTEGER | DEFAULT 1 | Máximo de parcelas permitidas |
| `monthly_ceiling` | DECIMAL(10,2) | NULLABLE | Teto mensal de uso |
| `requires_justification` | BOOLEAN | DEFAULT FALSE | Exige justificar toda compra |
| `is_active` | BOOLEAN | DEFAULT TRUE | Regra ativa |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

**22. Tabela: `negotiation_requests`** (ações com banco)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da solicitação |
| `payment_method_id` | UUID | FOREIGN KEY → payment_methods(id) | Cartão |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `action_type` | VARCHAR(50) | NOT NULL | 'reduce_limit' / 'change_due_date' / 'installment_invoice' / 'migrate_rotativo' |
| `current_value` | DECIMAL(10,2) | NULLABLE | Valor atual (ex: limite atual) |
| `desired_value` | DECIMAL(10,2) | NULLABLE | Valor desejado (ex: novo limite) |
| `interest_rate` | DECIMAL(5,2) | NULLABLE | Taxa de juros (se parcelamento/migração) |
| `installments` | INTEGER | NULLABLE | N° de parcelas (se aplicável) |
| `potential_savings` | DECIMAL(10,2) | NULLABLE | Economia potencial |
| `deadline` | DATE | NOT NULL | Prazo para fazer a ação |
| `status` | VARCHAR(20) | DEFAULT 'pending' | 'pending' / 'done' / 'cancelled' |
| `done_at` | TIMESTAMP | NULLABLE | Quando foi feito |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**23. Tabela: `payment_plan`** (plano de 3 meses)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do plano |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `month_number` | INTEGER | CHECK (1-3) | Mês (1, 2 ou 3) |
| `month_date` | DATE | NOT NULL | Data de referência (primeiro dia do mês) |
| `projected_invoice` | DECIMAL(10,2) | NOT NULL | Fatura projetada |
| `planned_payment` | DECIMAL(10,2) | NOT NULL | Quanto planeja pagar |
| `projected_rotativo` | DECIMAL(10,2) | DEFAULT 0 | Rotativo projetado |
| `projected_interest` | DECIMAL(10,2) | DEFAULT 0 | Juros projetados |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**Constraint:** UNIQUE(user_id, month_number)

---

#### **Regras de Negócio**

1. **Pré-carregamento de Cartões (Dia 4 → Dia 5):**
   - Query: `SELECT * FROM payment_methods WHERE user_id = ? AND type = 'credit_card'`
   - Para cada cartão, buscar dados de dívidas do Dia 2 para estimar fatura atual:
     ```sql
     SELECT total_amount, monthly_installment, installments_remaining
     FROM debts
     WHERE user_id = ? AND debt_type = 'credit_card' AND creditor_name LIKE '%cartão_name%'
     ```

2. **Cálculo de Rotativo:**
   - Se `payment_status` = 'paid_minimum' ou 'paid_partial':
     ```
     rotativo_amount = total_amount - amount_paid
     ```
   - Juros do rotativo (mês seguinte):
     ```
     juros = rotativo_amount * (interest_rate / 100)
     fatura_mes_2 = rotativo_amount + juros + parcelas_fixas
     ```

3. **Simulação de Parcelamento de Fatura:**
   - Inputs: `total_fatura`, `n_parcelas`, `taxa_juros`
   - Fórmula (Price - juros compostos):
     ```
     parcela = total_fatura * [(1 + i)^n * i] / [(1 + i)^n - 1]
     onde i = taxa_juros/100
     total_a_pagar = parcela * n_parcelas
     economia_vs_rotativo = (rotativo_juros_3meses) - (parcelamento_juros_total)
     ```

4. **Simulação de Migração de Rotativo:**
   - Rotativo atual: R$ X com taxa Y% ao mês
   - Nova linha: Taxa Z% ao mês por N meses
   - Juros no rotativo (3 meses): `X * (1 + Y/100)^3 - X`
   - Juros na nova linha: `parcela * N - X`
   - Economia: diferença entre os juros

5. **Validação de Regras de Uso:**
   - Ao tentar registrar compra:
     ```sql
     SELECT * FROM card_rules
     WHERE user_id = ?
       AND (payment_method_id = ? OR payment_method_id IS NULL)
       AND is_active = TRUE
     ```
   - Verificar:
     - `purchase_amount` <= `max_per_purchase` ?
     - `category` NOT IN `blocked_categories` ?
     - `n_installments` <= `max_installments` ?
     - Gasto acumulado no mês + `purchase_amount` <= `monthly_ceiling` ?
   
   - Se `requires_justification` = TRUE: abrir modal antes de aprovar

6. **Projeção de Faturas (3 meses):**
   
   **Mês 1:**
   - `projected_invoice` = `current_invoice` (do Passo 1)
   - Usuário escolhe `planned_payment`
   - Se `planned_payment` < `total_amount`:
     - `projected_rotativo` = `total_amount - planned_payment`
   
   **Mês 2:**
   - `projected_invoice` = `projected_rotativo_mes1 * (1 + interest_rate/100) + soma(parcelas_fixas)`
   - Usuário escolhe `planned_payment`
   - Recalcula `projected_rotativo`
   
   **Mês 3:**
   - Idem ao Mês 2
   
   - **Alerta de sucesso:** Se `projected_rotativo_mes3` = 0: "🎉 Você sairá do rotativo no Mês 3!"

7. **Agendamento de Lembretes de Negociação:**
   - Para cada `negotiation_requests` com `status` = 'pending':
     - Agendar notificação 1 dia antes do `deadline`
     - Mensagem: "Você planejou [action_type] do seu cartão até amanhã. Já fez?"
     - Opções: "Sim, concluí" / "Lembrar amanhã" / "Cancelar ação"

---

#### **Outputs do App (Documentos Gerados)**

1. **Plano de Pagamento do Cartão** (PDF/Visualização)
   - Data: DD/MM/YYYY
   - Cartões analisados: X
   - Resumo de faturas: Total, mínimo, status de pagamento
   - Parcelas futuras comprometidas: Lista + total mensal
   - Valor total no rotativo: R$ X
   - Cronograma de quitação (3 meses):
     - Mês 1: Fatura R$ X | Pagamento R$ Y | Rotativo R$ Z
     - Mês 2: Projeção...
     - Mês 3: Meta de sair do rotativo
   - Economia projetada em juros: R$ W

2. **Contrato de Regras do Cartão** (documento assinado digitalmente)
   - Cartão(ões) abrangido(s)
   - Regras definidas:
     - Limite por compra: R$ X
     - Categorias bloqueadas: [lista]
     - Parcelas máximas: Nx
     - Teto mensal: R$ Y
     - Exige justificativa: Sim/Não
   - Assinatura digital: Nome do usuário + Data + Hash do documento
   - QR code para verificação / impressão

3. **Relatório de Negociação com Banco** (registro)
   - Ações solicitadas:
     - Reduzir limite de R$ X para R$ Y (Banco Z - prazo: DD/MM)
     - Alterar vencimento para dia X (Banco W - prazo: DD/MM)
     - Parcelar fatura atual em Nx (economia: R$ Z)
   - Status: Pendente / Concluído
   - Economia potencial total: R$ W

---

#### **Fluxo de Integração com Dias Futuros**

**Dados do Dia 5 que serão reutilizados:**

- **Dia 7 (Vencimentos):**
  - Datas de vencimento de faturas (`card_invoices.due_date`) alimentam calendário financeiro
  - Parcelas fixas (`card_installments`) entram como obrigações recorrentes

- **Dia 8 (Prioridades):**
  - Se rotativo > 0: prioridade ALTA (evitar corte de crédito e juros explosivos)
  - Se apenas parcelas fixas: prioridade MÉDIA

- **Dia 9 (Orçamento Mínimo):**
  - Soma de `card_installments.installment_value` entra como despesa fixa mensal
  - `card_rules.monthly_ceiling` é o teto sugerido para categoria "Cartão de crédito" no orçamento variável

- **Dia 10 (Mapa de Negociação):**
  - Ações pendentes de `negotiation_requests` são revisadas
  - Se não negociou com banco até lá: app relembra e oferece scripts de negociação

- **Dia 12 (Fechar Acordo):**
  - Se rotativo alto: pode ser alvo de negociação de migração para linha mais barata
  - Ações concluídas do Dia 5 são marcadas como `status` = 'done'

- **Dia 13 (Novas Regras de Vida):**
  - `card_rules` se torna parte do "Manual de Regras Financeiras" permanente
  - Regras são reforçadas e ajustadas se necessário

- **Dia 15 (Formatura):**
  - Comparação:
    - Rotativo no Dia 5 vs Rotativo no Dia 15 (meta: redução ou eliminação)
    - Faturas pagas integralmente vs mínimo (evolução do comportamento)
  - Economia total em juros evitados desde o Dia 5

---

#### **Endpoints da API (Backend)**

**POST /api/v1/card-invoices**
- **Payload:**
```json
{
  "user_id": "uuid",
  "invoices": [
    {
      "payment_method_id": "uuid",
      "invoice_month": "2024-01-01",
      "total_amount": 2500.00,
      "minimum_amount": 375.00,
      "due_date": "2024-01-15",
      "amount_paid": 0,
      "payment_status": "unpaid",
      "rotativo_amount": 1200.00,
      "rotativo_months": 2
    }
  ],
  "installments": [
    {
      "payment_method_id": "uuid",
      "description": "TV Samsung 50pol",
      "installment_value": 250.00,
      "installments_remaining": 8
    }
  ]
}
```

**POST /api/v1/card-rules**
- **Payload:**
```json
{
  "user_id": "uuid",
  "payment_method_id": "uuid",  // ou null para todos
  "max_per_purchase": 200.00,
  "blocked_categories": ["lazer", "roupas"],
  "max_installments": 3,
  "monthly_ceiling": 600.00,
  "requires_justification": true
}
```

**POST /api/v1/negotiation-requests**
- **Payload:**
```json
{
  "user_id": "uuid",
  "requests": [
    {
      "payment_method_id": "uuid",
      "action_type": "reduce_limit",
      "current_value": 5000.00,
      "desired_value": 2000.00,
      "deadline": "2024-01-10",
      "potential_savings": 0
    },
    {
      "payment_method_id": "uuid",
      "action_type": "installment_invoice",
      "current_value": 2500.00,
      "installments": 6,
      "interest_rate": 3.5,
      "potential_savings": 450.00  // vs rotativo
    }
  ]
}
```

**POST /api/v1/payment-plan**
- **Payload:**
```json
{
  "user_id": "uuid",
  "plan": [
    {
      "month_number": 1,
      "month_date": "2024-01-01",
      "projected_invoice": 2500.00,
      "planned_payment": 2500.00,
      "projected_rotativo": 0,
      "projected_interest": 0
    },
    {
      "month_number": 2,
      "month_date": "2024-02-01",
      "projected_invoice": 250.00,  // apenas parcelas
      "planned_payment": 250.00,
      "projected_rotativo": 0,
      "projected_interest": 0
    }
  ]
}
```

**GET /api/v1/simulate-payment**
- **Query Params:** `invoice_total`, `payment_amount`, `interest_rate`, `n_months`
- **Response:**
```json
{
  "scenario": "paid_partial",
  "rotativo_amount": 1000.00,
  "interest_next_month": 125.00,
  "next_invoice": 1375.00,
  "total_interest_3months": 425.50
}
```

**GET /api/v1/simulate-installment**
- **Query Params:** `total`, `n_installments`, `interest_rate`
- **Response:**
```json
{
  "installment_value": 450.00,
  "total_to_pay": 2700.00,
  "total_interest": 200.00,
  "savings_vs_rotativo": 550.00
}
```

---

### 📊 Métricas de Sucesso do Dia 5

1. **Taxa de Conclusão:** % que completa Dia 5
2. **% com Rotativo:** Quantos usuários estão no rotativo
3. **Valor Médio de Rotativo:** Média do valor no rotativo
4. **Taxa de Criação de Regras:** % que define regras de uso do cartão
5. **Ações de Negociação Agendadas:** Média de ações por usuário
6. **Economia Projetada Média:** Média de economia em juros nos próximos 3 meses
7. **Taxa de Pagamento Integral Planejado:** % que planeja pagar fatura integral no Mês 1
8. **Evolução do Termômetro:** Dia 4 vs Dia 5

---



---

## **DIA 6 — Vazamentos Invisíveis**

### 🎯 Título
**Corte Vazamentos Invisíveis: Elimine Gastos Pequenos que Drenam Seu Dinheiro**

### 🌅 Mensagem Matinal
Às vezes não é o grande erro que nos endivida, mas os pequenos furos que insistimos em ignorar: assinaturas de streaming nunca usadas, tarifas bancárias, pedidos de delivery toda semana. Esses vazamentos invisíveis somados podem comprometer boa parte do seu orçamento. O Dia 6 é dedicado a identificá-los e cortá-los sem culpa. Cada real economizado aqui é um real que trabalha para você — seja para quitar dívidas, seja para construir sua caixinha de emergência.

### 📚 Conceito FIRE do Dia
**Goteira mata sede? Não.** No FIRE, dizemos que "um gasto de R$ 30 repetido 10 vezes é mais caro que um gasto de R$ 300 uma vez". Pequenos vazamentos são perigosos porque passam despercebidos e criam o hábito do gasto automático. Cortá-los exige atenção consciente e uma regra simples: todo serviço ou compra recorrente deve trazer valor superior ao seu preço. Se não traz, é hora de pausar ou cancelar. Esse corte não precisa ser definitivo; você sempre pode reativar quando a situação melhorar. O foco é ganhar fôlego imediato sem sacrificar qualidade de vida.

### ✅ Seu Desafio Hoje
Eliminar gastos pequenos e recorrentes que drenam seu dinheiro sem você perceber, liberando recursos para prioridades reais.

### 🎯 SUA TAREFA PRÁTICA

#### **Experiência do Usuário (UX/UI)**

**Tela de Introdução do Dia 6**
- **Header:** "Dia 6 — Vazamentos Invisíveis"
- **Barra de progresso:** 0% → 100%
- **Card motivacional:** "Pequenos gastos repetidos são inimigos silenciosos. Hoje você vai tapar os furos do seu orçamento."
- **Badges:** Tempo estimado (15-20 min) | Economia potencial detectada: R$ X/mês
- **CTA:** "Encontrar Vazamentos"

**Fluxo Principal (3 Passos)**

**PASSO 1: Lista de Vazamentos Detectados**

- **Título:** "Esses gastos estão drenando seu dinheiro"
- **Subtítulo:** "Identificamos despesas recorrentes que podem ser cortadas ou pausadas"

**Pré-carregamento Inteligente:**

App consolida dados de dias anteriores:

1. **Do Dia 3 (Arqueologia Financeira):**
   - Query: `SELECT * FROM transactions WHERE user_id = ? AND is_shadow = TRUE`
   - Query: `SELECT shadow_expenses FROM spending_patterns WHERE user_id = ?`

2. **Do Dia 2 (Raio-X):**
   - Query: `SELECT * FROM variable_expenses WHERE classification = 'cut'`
   - Query: `SELECT * FROM fixed_expenses WHERE category IN ('assinaturas', 'tarifas')`

3. **Categorização automática de vazamentos:**
   - **Assinaturas não usadas:** Serviços de streaming, apps, clubes
   - **Tarifas bancárias:** Manutenção de conta, anuidade de cartão
   - **Micro-gastos frequentes:** Delivery, cafeteria, lanchonete (> 15x/mês)
   - **Serviços esquecidos:** Academia não frequentada, seguro desnecessário
   - **Gastos por conveniência:** Estacionamento, água/refrigerante em máquinas

**Componente: Tabela Interativa de Vazamentos**

**Colunas:**
1. Descrição do vazamento
2. Categoria (chip colorido)
3. Frequência (ex: "Todo mês" / "3x semana")
4. Valor mensal (R$)
5. Valor anual projetado (R$ * 12, em destaque)
6. Ação (Dropdown: Cortar / Pausar / Manter sob controle)

**Exemplos de linhas (pré-carregadas):**

| Descrição | Categoria | Freq | Mensal | Anual | Ação |
|-----------|-----------|------|--------|-------|------|
| Netflix | Assinatura | Mensal | R$ 39,90 | R$ 478,80 | [Dropdown] |
| Tarifa de manutenção Banco X | Tarifa | Mensal | R$ 15,00 | R$ 180,00 | [Dropdown] |
| Delivery (média) | Alimentação | 12x/mês | R$ 360,00 | R$ 4.320,00 | [Dropdown] |
| Cafezinho no trabalho | Alimentação | 20x/mês | R$ 100,00 | R$ 1.200,00 | [Dropdown] |
| Academia (não frequentada) | Saúde | Mensal | R$ 89,90 | R$ 1.078,80 | [Dropdown] |

**Detalhamento por ação selecionada:**

1. **Se "Cortar já":**
   - Badge verde: "ECONOMIA IMEDIATA"
   - Botão auxiliar: "Como cancelar?" (links diretos para site/app do serviço)
   - Checkbox: "Cancelei esse serviço" (marca como concluído)

2. **Se "Pausar temporariamente":**
   - Badge amarelo: "PAUSAR POR X MESES"
   - Input: "Pausar por quantos meses?" (dropdown: 1, 2, 3, 6 meses)
   - Data de retorno: calculada automaticamente
   - App agenda lembrete: "Rever se deseja reativar [serviço]"

3. **Se "Manter sob controle":**
   - Badge azul: "MANTER COM LIMITE"
   - Input: "Novo limite mensal" (R$)
   - Exemplo: Delivery R$ 360/mês → Reduzir para R$ 100/mês (máx 2x)
   - App cria alerta quando atingir 80% do limite

**Card de Economia Total (atualização dinâmica):**
```
┌──────────────────────────────────────┐
│ ECONOMIA POTENCIAL                   │
│                                      │
│ Cortar: R$ XXX/mês = R$ X.XXX/ano   │
│ Pausar: R$ YYY/mês = R$ Y.YYY/ano   │
│ Reduzir: R$ ZZZ/mês = R$ Z.ZZZ/ano  │
│ ─────────────────────────────────    │
│ TOTAL: R$ W.WWW/ano                  │
│                                      │
│ ✨ Você pode usar esse dinheiro para:│
│ - Quitar dívidas mais rápido         │
│ - Construir reserva de emergência    │
│ - Investir no seu futuro             │
└──────────────────────────────────────┘
```

**Filtros (barra superior):**
- Todos | Apenas Assinaturas | Apenas Tarifas | Gastos Frequentes
- Ordenar por: Valor Anual (maior→menor) | Categoria

**Rodapé do passo:**
- Total de vazamentos identificados: X
- Economia anual se cortar todos: R$ Y
- Botão "Próximo Passo"

---

**PASSO 2: Ações Práticas de Cancelamento**

- **Título:** "Vamos tapar esses furos agora"
- **Subtítulo:** "Para cada item que você decidiu cortar ou pausar, siga o passo a passo"

**Lista de Tarefas (gerada automaticamente):**

Para cada vazamento marcado como "Cortar" ou "Pausar":

**Card de Ação:**
- **Header:** Nome do serviço/despesa (ex: "Netflix")
- **Ação:** Cortar / Pausar por X meses
- **Economia:** R$ Y/mês

**Passo a passo (accordion expansível):**

1. **Como cancelar [serviço]:**
   - Instruções específicas por serviço (banco de dados de tutoriais):
     - Netflix: "Acesse netflix.com/cancelar → Login → Configurações → Cancelar assinatura"
     - Spotify: "Abra o app → Configurações → Assinatura → Cancelar Premium"
     - Academia: "Ligue para (XX) XXXX-XXXX ou vá presencialmente com carteirinha"
     - Tarifa bancária: "Entre no app do [Banco] → Serviços → Isenção de tarifas OU migre para conta digital gratuita"
   
2. **Botão de ação direta:**
   - "Abrir site do serviço" (deep link para página de cancelamento)
   - Ou "Copiar número de contato" (para ligar)

3. **Checkbox de confirmação:**
   - "✅ Cancelei/Pausei este serviço"
   - Ao marcar: App registra data e pede screenshot de comprovação (opcional)

4. **Se for "Pausar":**
   - Campo de data: "Pausado até DD/MM/YYYY"
   - App agenda lembrete 1 semana antes da data de retorno:
     - "Você pausou [serviço] temporariamente. Deseja reativar ou cancelar definitivamente?"

**Casos especiais:**

**Tarifas Bancárias:**
- **Opção A:** Solicitar isenção (se perfil permitir)
  - Tutorial: "Como pedir isenção de tarifas no [Banco]"
  - Botão: "Abrir chat do banco" / "Ligar para SAC"
  
- **Opção B:** Migrar para conta digital gratuita
  - Lista de bancos digitais sem tarifas: Nubank, Inter, C6, Next, PagBank
  - Botão: "Ver passo a passo para trocar de banco"
  - Checklist de migração:
    - [ ] Abrir conta no novo banco
    - [ ] Transferir débitos automáticos
    - [ ] Transferir salário (se aplicável)
    - [ ] Cancelar conta antiga

**Micro-gastos (ex: delivery, cafeteria):**
- **Estratégia de substituição:**
  - "Em vez de delivery 12x/mês, reduza para 4x/mês"
  - "Leve marmita 3x/semana e economize R$ X"
  - "Faça café em casa em uma garrafa térmica"
  
- **Dicas de substituição (cards sugestivos):**
  - 💡 "Trocar cafezinho diário (R$ 5) por café de casa: Economia de R$ 100/mês"
  - 💡 "Cozinhar aos domingos para a semana: Economize R$ 200/mês em delivery"

**Checklist de Progresso:**
- Mostra quantos itens já foram cancelados/pausados vs pendentes
- Barra de progresso: "X de Y vazamentos tapados"

**Rodapé do passo:**
- Botão "Salvar Progresso"
- Botão "Próximo Passo" (ativo quando pelo menos 1 vazamento foi tratado)

---

**PASSO 3: Novos Limites para "Pequenos Prazeres"**

- **Título:** "Controle os gastos que você decidiu manter"
- **Subtítulo:** "Defina tetos realistas para não voltar aos velhos hábitos"

**Lista de Gastos Marcados como "Manter sob controle":**

Para cada categoria mantida:

**Configuração de Limite:**

- **Categoria:** (ex: Delivery)
- **Gasto anterior:** R$ X/mês (pré-carregado)
- **Novo limite:** Input R$ (usuário define)
  - Sugestão do app: 50% do gasto anterior
  - Helper text: "Sugerimos reduzir para R$ Y (metade do anterior)"

- **Como vai controlar:**
  - Radio buttons:
    - "Definir número máximo de vezes por mês" (ex: 4x/mês)
    - "Definir valor máximo por vez" (ex: R$ 30/pedido)
    - "Ambos" (número de vezes + valor máximo)

- **Alertas:**
  - Checkbox: "Quero receber alerta quando atingir 80% do limite"
  - Checkbox: "Bloquear novas compras quando atingir 100% do limite"

**Exemplos práticos:**

**Delivery:**
- Limite mensal: R$ 120 (4x de R$ 30)
- Controle: Máx 4 pedidos/mês E máx R$ 30/pedido
- Alerta: "Você já fez 3 de 4 pedidos permitidos este mês"

**Roupas:**
- Limite mensal: R$ 200
- Controle: Valor total por mês
- Alerta: "Você gastou R$ 160 dos R$ 200 permitidos em roupas este mês"

**Lazer:**
- Limite mensal: R$ 150
- Controle: Valor total + uso da Regra das 24h (do Dia 4)
- Alerta: "Antes de gastar em lazer, lembre-se do seu limite de R$ 150/mês"

**Revisão Mensal:**
- **Campo:** "Em que dia do mês você quer revisar esses limites?"
  - Date picker (1-31)
  - Sugestão: Mesmo dia da rotina semanal (se já definida em dias anteriores)
  
- **Lembrete agendado:**
  - "No dia X de cada mês, revise seus limites de pequenos prazeres e ajuste se necessário"

**Card de Compromisso Final:**
```
┌─────────────────────────────────────────┐
│ CONTRATO DE PEQUENOS PRAZERES           │
│                                         │
│ Delivery: Máx R$ 120/mês (4x)           │
│ Cafeteria: Máx R$ 50/mês                │
│ Roupas: Máx R$ 200/mês                  │
│ Lazer: Máx R$ 150/mês                   │
│                                         │
│ Total de pequenos prazeres: R$ 520/mês │
│ (Antes era: R$ 960/mês)                 │
│ Economia: R$ 440/mês = R$ 5.280/ano     │
│                                         │
│ Revisão: Dia 25 de cada mês             │
│ Assinado em: DD/MM/YYYY                 │
└─────────────────────────────────────────┘
```

**Atualização do Termômetro "Respirar":**
- Pergunta: "Após cortar vazamentos e definir limites, como você se sente?"
- Slider 0-10 + justificativa

**Rodapé:**
- Botões: "Salvar Rascunho" | "Concluir Dia 6"

---

**Tela de Conclusão do Dia 6:**

```
🎉 Dia 6 Concluído!

Vazamentos tapados:
• X serviços cancelados
• Y assinaturas pausadas
• Z limites definidos

Economia total:
• Mensal: R$ X
• Anual: R$ Y

Esse dinheiro vai trabalhar para você!
Use para quitar dívidas, construir reserva
ou investir no seu futuro.

Próximo: Dia 7 - Organizar Vencimentos
```

---

### 🗄️ Infraestrutura (Backend + Fluxo de Dados)

#### **Tabelas do Banco de Dados**

**24. Tabela: `leakage_items`** (vazamentos identificados)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do vazamento |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `description` | VARCHAR(255) | NOT NULL | Descrição do vazamento |
| `category` | VARCHAR(50) | NOT NULL | assinatura / tarifa / micro_gasto / serviço |
| `frequency` | VARCHAR(50) | NOT NULL | 'monthly' / 'weekly' / 'daily' |
| `monthly_cost` | DECIMAL(10,2) | NOT NULL | Custo mensal |
| `annual_cost` | DECIMAL(10,2) | NOT NULL | Custo anual (mensal * 12) |
| `source_day` | INTEGER | NOT NULL | Dia de origem (2=Raio-X, 3=Arqueologia) |
| `action` | VARCHAR(20) | NOT NULL | 'cut' / 'pause' / 'control' |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de identificação |

**25. Tabela: `cancellation_actions`** (ações de cancelamento)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da ação |
| `leakage_id` | UUID | FOREIGN KEY → leakage_items(id) | Vazamento |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `action_type` | VARCHAR(20) | NOT NULL | 'cancel' / 'pause' |
| `pause_duration_months` | INTEGER | NULLABLE | Se pausar, por quantos meses |
| `pause_until_date` | DATE | NULLABLE | Data de retorno (se pausado) |
| `status` | VARCHAR(20) | DEFAULT 'pending' | 'pending' / 'completed' / 'cancelled' |
| `completed_at` | TIMESTAMP | NULLABLE | Quando foi feito |
| `proof_image_url` | VARCHAR(255) | NULLABLE | URL do comprovante (screenshot) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data da ação |

**26. Tabela: `variable_caps`** (limites de pequenos prazeres)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do limite |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `category` | VARCHAR(50) | NOT NULL | delivery / roupas / lazer / cafeteria / outro |
| `previous_monthly_avg` | DECIMAL(10,2) | NOT NULL | Gasto anterior médio |
| `new_monthly_limit` | DECIMAL(10,2) | NOT NULL | Novo limite definido |
| `control_type` | VARCHAR(20) | NOT NULL | 'total_amount' / 'max_per_transaction' / 'max_frequency' / 'combined' |
| `max_per_transaction` | DECIMAL(10,2) | NULLABLE | Valor máximo por compra (se aplicável) |
| `max_frequency` | INTEGER | NULLABLE | Máx de vezes por mês (se aplicável) |
| `alert_at_80_percent` | BOOLEAN | DEFAULT TRUE | Alertar ao atingir 80% |
| `block_at_100_percent` | BOOLEAN | DEFAULT FALSE | Bloquear ao atingir 100% |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**27. Tabela: `monthly_spending_tracker`** (rastreamento mensal)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do rastreamento |
| `variable_cap_id` | UUID | FOREIGN KEY → variable_caps(id) | Limite relacionado |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `month_date` | DATE | NOT NULL | Mês de referência (primeiro dia) |
| `spent_amount` | DECIMAL(10,2) | DEFAULT 0 | Quanto gastou até agora |
| `transaction_count` | INTEGER | DEFAULT 0 | Quantas transações fez |
| `limit_reached` | BOOLEAN | DEFAULT FALSE | Se atingiu o limite |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

**Constraint:** UNIQUE(variable_cap_id, month_date)

**28. Tabela: `savings_from_leakage`** (economia calculada)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID |
| `user_id` | UUID | FOREIGN KEY → users(id), UNIQUE | Usuário (1:1 resumo) |
| `total_cut_monthly` | DECIMAL(10,2) | DEFAULT 0 | Economia mensal (itens cortados) |
| `total_paused_monthly` | DECIMAL(10,2) | DEFAULT 0 | Economia mensal (itens pausados) |
| `total_reduced_monthly` | DECIMAL(10,2) | DEFAULT 0 | Economia mensal (redução de limites) |
| `total_annual_savings` | DECIMAL(10,2) | DEFAULT 0 | Economia anual total |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data do cálculo |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

---

#### **Regras de Negócio**

1. **Pré-carregamento de Vazamentos (Dias 2, 3 → Dia 6):**
   
   **Do Dia 3:**
   ```sql
   INSERT INTO leakage_items (user_id, description, category, monthly_cost, annual_cost, source_day, action)
   SELECT 
     user_id,
     description,
     'assinatura',
     SUM(ABS(amount)) / 3,  -- Média mensal dos últimos 3 meses
     (SUM(ABS(amount)) / 3) * 12,
     3,
     'cut'  -- Sugestão inicial
   FROM transactions
   WHERE user_id = ? 
     AND is_shadow = TRUE
     AND category = 'assinaturas'
   GROUP BY user_id, description
   ```
   
   **Do Dia 2:**
   ```sql
   INSERT INTO leakage_items (user_id, description, category, monthly_cost, annual_cost, source_day, action)
   SELECT 
     user_id,
     name,
     'tarifa',
     amount,
     amount * 12,
     2,
     'cut'
   FROM fixed_expenses
   WHERE user_id = ?
     AND category = 'tarifas'
   ```
   
   **Micro-gastos (frequência alta):**
   ```sql
   -- Delivery com frequência > 10x/mês
   INSERT INTO leakage_items (...)
   SELECT ...
   FROM transactions
   WHERE category = 'delivery'
     AND COUNT(*) > 10  -- Nos últimos 30 dias
   ```

2. **Cálculo de Economia Total:**
   ```sql
   UPDATE savings_from_leakage SET
     total_cut_monthly = (
       SELECT COALESCE(SUM(monthly_cost), 0)
       FROM leakage_items
       WHERE user_id = ? AND action = 'cut'
     ),
     total_paused_monthly = (
       SELECT COALESCE(SUM(monthly_cost), 0)
       FROM leakage_items
       WHERE user_id = ? AND action = 'pause'
     ),
     total_reduced_monthly = (
       SELECT COALESCE(SUM(previous_monthly_avg - new_monthly_limit), 0)
       FROM variable_caps
       WHERE user_id = ?
     ),
     total_annual_savings = (total_cut_monthly + total_paused_monthly + total_reduced_monthly) * 12
   WHERE user_id = ?
   ```

3. **Validação de Limites de Pequenos Prazeres:**
   - `new_monthly_limit` deve ser <= `previous_monthly_avg`
   - Se `control_type` = 'max_per_transaction': `max_per_transaction` obrigatório
   - Se `control_type` = 'max_frequency': `max_frequency` obrigatório
   - Se `control_type` = 'combined': ambos obrigatórios

4. **Rastreamento de Gastos Mensais:**
   - Ao registrar nova compra na categoria monitorada:
     ```sql
     UPDATE monthly_spending_tracker SET
       spent_amount = spent_amount + ?,
       transaction_count = transaction_count + 1
     WHERE variable_cap_id = ?
       AND month_date = DATE_TRUNC('month', CURRENT_DATE)
     ```
   
   - Verificar se atingiu limite:
     ```sql
     SELECT 
       vc.new_monthly_limit,
       mst.spent_amount,
       (mst.spent_amount / vc.new_monthly_limit * 100) as percentage
     FROM variable_caps vc
     JOIN monthly_spending_tracker mst ON vc.id = mst.variable_cap_id
     WHERE mst.user_id = ?
     ```
   
   - Se `percentage` >= 80: Enviar alerta (se `alert_at_80_percent` = TRUE)
   - Se `percentage` >= 100: Bloquear compra (se `block_at_100_percent` = TRUE)

5. **Agendamento de Lembretes de Reativação (itens pausados):**
   - Para cada `cancellation_actions` com `action_type` = 'pause':
     ```sql
     SELECT pause_until_date, description
     FROM cancellation_actions ca
     JOIN leakage_items li ON ca.leakage_id = li.id
     WHERE ca.status = 'completed'
       AND pause_until_date IS NOT NULL
     ```
   - Agendar notificação 7 dias antes de `pause_until_date`:
     - "Você pausou [serviço] até DD/MM. Deseja reativar ou cancelar definitivamente?"
     - Opções: "Reativar" / "Cancelar de vez" / "Pausar mais tempo"

6. **Banco de Dados de Tutoriais de Cancelamento:**
   - Tabela auxiliar (opcional): `cancellation_tutorials`
     - `service_name` (ex: "Netflix", "Spotify", "Banco Inter")
     - `tutorial_text` (passo a passo)
     - `direct_link` (URL de cancelamento, se disponível)
     - `contact_number` (telefone de SAC, se aplicável)

---

#### **Outputs do App (Documentos Gerados)**

1. **Lista de Vazamentos Eliminados**
   - Data: DD/MM/YYYY
   - Serviços cancelados: [lista com nomes e valores]
   - Serviços pausados: [lista + datas de retorno]
   - Economia mensal total: R$ X
   - Economia anual total: R$ Y

2. **Contrato de Pequenos Prazeres**
   - Categorias mantidas sob controle
   - Limites definidos por categoria
   - Tipo de controle (valor total / frequência / ambos)
   - Total mensal de pequenos prazeres: R$ X
   - Comparação: Antes R$ Y → Depois R$ X (Economia: R$ Z)
   - Data de revisão mensal: Dia X
   - Assinatura digital + data

3. **Guia de Revisão Mensal**
   - Checklist para replicar o processo no futuro:
     - [ ] Revisar extratos do último mês
     - [ ] Identificar novos vazamentos
     - [ ] Verificar se limites de pequenos prazeres estão sendo respeitados
     - [ ] Ajustar limites se necessário
     - [ ] Cancelar serviços não usados

---

#### **Fluxo de Integração com Dias Futuros**

**Dados do Dia 6 que serão reutilizados:**

- **Dia 7 (Vencimentos):**
  - Assinaturas mantidas (`leakage_items` WHERE `action` = 'control') entram no calendário de vencimentos
  - Datas de cobrança mensal são adicionadas automaticamente

- **Dia 9 (Orçamento Mínimo):**
  - `variable_caps.new_monthly_limit` define os tetos para categorias variáveis no orçamento
  - Economia do Dia 6 (`savings_from_leakage.total_cut_monthly`) aumenta a sobra disponível para dívidas/reserva

- **Dia 13 (Novas Regras de Vida):**
  - Limites de pequenos prazeres (`variable_caps`) se integram ao "Manual de Regras Financeiras"
  - Rotina de revisão mensal é incorporada ao protocolo semanal

- **Dia 14 (Plano 30/90):**
  - Economia gerada (`total_annual_savings`) entra como "alavanca" para acelerar quitação de dívidas ou construir reserva

- **Dia 15 (Formatura):**
  - Comparação de vazamentos:
    - Total de gastos em assinaturas/tarifas: Dia 3 vs Dia 15
    - Economia acumulada desde o Dia 6
  - Certificação: "Economizou R$ X em vazamentos e liberou R$ Y para suas prioridades"

---

#### **Endpoints da API (Backend)**

**GET /api/v1/leakages**
- **Response 200:**
```json
{
  "user_id": "uuid",
  "leakages": [
    {
      "id": "uuid",
      "description": "Netflix",
      "category": "assinatura",
      "frequency": "monthly",
      "monthly_cost": 39.90,
      "annual_cost": 478.80,
      "suggested_action": "cut"
    },
    {
      "id": "uuid",
      "description": "Tarifa manutenção conta",
      "category": "tarifa",
      "monthly_cost": 15.00,
      "annual_cost": 180.00,
      "suggested_action": "cut"
    }
  ],
  "total_potential_savings": {
    "monthly": 450.00,
    "annual": 5400.00
  }
}
```

**POST /api/v1/cancellation-actions**
- **Payload:**
```json
{
  "user_id": "uuid",
  "actions": [
    {
      "leakage_id": "uuid",
      "action_type": "cancel",
      "completed_at": "2024-01-06T14:30:00Z",
      "proof_image_url": "https://storage/proof123.jpg"
    },
    {
      "leakage_id": "uuid",
      "action_type": "pause",
      "pause_duration_months": 3,
      "pause_until_date": "2024-04-06"
    }
  ]
}
```

**POST /api/v1/variable-caps**
- **Payload:**
```json
{
  "user_id": "uuid",
  "caps": [
    {
      "category": "delivery",
      "previous_monthly_avg": 360.00,
      "new_monthly_limit": 120.00,
      "control_type": "combined",
      "max_per_transaction": 30.00,
      "max_frequency": 4,
      "alert_at_80_percent": true,
      "block_at_100_percent": false
    },
    {
      "category": "lazer",
      "previous_monthly_avg": 300.00,
      "new_monthly_limit": 150.00,
      "control_type": "total_amount",
      "alert_at_80_percent": true
    }
  ]
}
```

**GET /api/v1/monthly-spending/{category}**
- **Response 200:**
```json
{
  "category": "delivery",
  "month": "2024-01",
  "limit": 120.00,
  "spent": 90.00,
  "percentage": 75.0,
  "transactions_count": 3,
  "remaining": 30.00,
  "alerts": [
    "Você já usou 75% do seu limite de delivery este mês"
  ]
}
```

**POST /api/v1/track-purchase**
- **Payload:**
```json
{
  "user_id": "uuid",
  "category": "delivery",
  "amount": 35.00,
  "description": "Ifood - Pizza"
}
```

- **Response 200 (se dentro do limite):**
```json
{
  "success": true,
  "message": "Compra registrada",
  "limit_status": {
    "spent": 125.00,
    "limit": 120.00,
    "percentage": 104.2,
    "warning": "⚠️ Você ultrapassou seu limite de delivery em R$ 5,00"
  }
}
```

- **Response 400 (se ultrapassar limite E bloqueio ativo):**
```json
{
  "success": false,
  "error": "Limite de delivery atingido (R$ 120/mês). Você definiu bloqueio no Dia 6."
}
```

---

### 📊 Métricas de Sucesso do Dia 6

1. **Taxa de Conclusão:** % que completa Dia 6
2. **Vazamentos Identificados:** Média de vazamentos por usuário
3. **Taxa de Cancelamento:** % de vazamentos que são efetivamente cancelados
4. **Taxa de Pausa:** % de vazamentos pausados (vs cancelados)
5. **Economia Média Gerada:** Média de economia mensal/anual por usuário
6. **Categorias Mais Cortadas:** Top 3 (ex: assinaturas, tarifas, delivery)
7. **Taxa de Criação de Limites:** % que define limites para pequenos prazeres
8. **Evolução do Termômetro:** Dia 5 vs Dia 6 (espera-se melhora após liberação de recursos)

---



---

## **DIA 7 — Vencimentos: O Que Vence e Quando**

### 🎯 Título
**Calendário Financeiro: Organize Todos os Vencimentos e Evite Juros por Atraso**

### 🌅 Mensagem Matinal
Muitos brasileiros pagam tarifas por atraso simplesmente por não terem uma visão clara de suas contas. Colocar todos os vencimentos em um calendário único é libertador: você deixa de ficar "apagando incêndios" e passa a agir de forma preventiva. Hoje vamos criar seu calendário de obrigações, configurar lembretes e estabelecer um fluxo que puxa vencimentos futuros automaticamente.

### 📚 Conceito FIRE do Dia
**Calendário financeiro é antídoto contra juros.** No FIRE, evitar juros por atraso é tão importante quanto investir bem. Organizar vencimentos envolve anotar todas as contas fixas e variáveis, bem como vencimentos sazonais (IPTU, IPVA, seguros, renovações), e programar pagamentos antes do prazo. Se possível, alinhe datas de vencimento com datas de recebimento de renda para reduzir a necessidade de crédito.

### ✅ Seu Desafio Hoje
Organizar todas as suas contas e obrigações por data de vencimento para evitar atrasos, juros e cortes de serviços. Saber com antecedência o que vence quando permite priorizar pagamentos e negociar prazos.

### 🎯 SUA TAREFA PRÁTICA

#### **Experiência do Usuário (UX/UI)**

**Tela de Introdução do Dia 7**
- **Header:** "Dia 7 — Vencimentos: O Que Vence e Quando"
- **Barra de progresso:** 0% → 100%
- **Card motivacional:** "Organize seus vencimentos uma vez e nunca mais esqueça uma conta. Sem atrasos = sem juros desnecessários."
- **Badges:** Tempo estimado (20-30 min) | Requer (Boletos e faturas à mão)
- **CTA:** "Criar Calendário Financeiro"

**Fluxo Principal (4 Passos)**

**PASSO 1: Pré-carregamento de Obrigações**

- **Título:** "Vamos reunir tudo que você precisa pagar"
- **Subtítulo:** "Carregamos automaticamente as contas que você já cadastrou"

**Pré-carregamento Inteligente (de dias anteriores):**

App consolida dados:

1. **Do Dia 2 (Raio-X):**
   - `fixed_expenses`: Aluguel, condomínio, luz, água, internet, etc.
   - Campos carregados: `name`, `amount`, `due_day`, `payment_method`

2. **Do Dia 5 (Cartão):**
   - `card_invoices`: Faturas de cartões
   - Campos carregados: `total_amount`, `due_date`
   - `card_installments`: Parcelas futuras
   
3. **Do Dia 6 (Vazamentos):**
   - Assinaturas mantidas (`leakage_items` WHERE `action` = 'control')
   - Tarifas que não foram cortadas

4. **Dívidas negociadas (se houver de dias futuros 10-12):**
   - Acordos fechados com credores
   - Parcelas de renegociação

**Componente: Lista de Obrigações Pré-carregadas**

**Card resumo:**
```
✅ Carregamos X obrigações automaticamente:
• Y contas fixas (Dia 2)
• Z faturas de cartão (Dia 5)
• W assinaturas mantidas (Dia 6)

Revise abaixo e adicione o que estiver faltando.
```

**Tabela interativa (ordenada por dia do vencimento 1→31):**

**Colunas:**
1. **Dia** (1-31)
2. **Nome da conta**
3. **Valor** (R$)
4. **Categoria** (chip colorido)
5. **Forma de pagamento**
6. **Prioridade** (Auto-sugerida: Essencial/Importante/Negociável)
7. **Ações** (Editar / Excluir)

**Exemplo de dados carregados:**

| Dia | Conta | Valor | Categoria | Pagamento | Prioridade | Ações |
|-----|-------|-------|-----------|-----------|------------|-------|
| 5 | Aluguel | R$ 1.200 | Habitação | PIX | Essencial | [✏️][🗑️] |
| 10 | Luz | R$ 150 | Serviços | Débito auto | Essencial | [✏️][🗑️] |
| 15 | Fatura Nubank | R$ 850 | Cartão | Boleto | Essencial | [✏️][🗑️] |
| 20 | Netflix | R$ 40 | Assinatura | Cartão | Negociável | [✏️][🗑️] |
| 25 | Internet | R$ 100 | Serviços | Débito auto | Importante | [✏️][🗑️] |

**Botão destacado:** "+ Adicionar Nova Obrigação" (abre modal)

**Modal de Nova Obrigação:**

Campos:
- Nome da conta (Input texto)
- Valor (Input R$)
- Dia do vencimento (Date picker 1-31)
- Recorrência (Radio: Mensal / Bimestral / Trimestral / Semestral / Anual / Única)
- Categoria (Dropdown: Habitação / Serviços / Transporte / Saúde / Educação / Cartão / Dívidas / Assinaturas / Impostos / Seguros / Outros)
- Forma de pagamento (Dropdown: Boleto / PIX / Débito automático / Cartão / Dinheiro)
- Prioridade (Radio: Essencial / Importante / Negociável)
- Observações (Textarea opcional)

**Validações:**
- Nome obrigatório
- Valor > 0
- Dia do vencimento entre 1-31
- Categoria obrigatória

**Vencimentos Sazonais/Anuais:**

Toggle no topo: "Incluir vencimentos anuais" (IPTU, IPVA, seguros, matrículas)

Se ativo, exibe seção adicional:

**Card de Vencimentos Sazonais:**
- Pergunta: "Você tem contas que vencem 1-2 vezes por ano?"
- Lista dinâmica com botão "+ Adicionar Vencimento Anual"

Campos extras para sazonais:
- Mês do vencimento (Dropdown: Janeiro-Dezembro)
- Valor total
- Opção: "Dividir em 12x no orçamento mensal" (Toggle)
  - Se SIM: App calcula valor mensal (total/12) e sugere reservar todo mês
  - Mensagem: "Para pagar R$ 1.200 de IPTU em novembro, reserve R$ 100/mês"

**Rodapé do passo:**
- Total de obrigações: X
- Total mensal (fixas + parcelas): R$ Y
- Total anual (incluindo sazonais): R$ Z
- Botão "Próximo Passo"

---

**PASSO 2: Sincronizar com Datas de Renda**

- **Título:** "Quando você recebe dinheiro?"
- **Subtítulo:** "Alinhe os pagamentos com suas entradas"

**Pré-carregamento:**
- Do Dia 2: `income_items.payment_day` (datas de recebimento de renda)

**Lista de Fontes de Renda (pré-carregada):**

| Fonte | Valor | Dia do Recebimento |
|-------|-------|--------------------|
| Salário CLT | R$ 3.500 | Dia 5 |
| Freela Design | R$ 800 | Dia 15 |

**Componente: Análise de Fluxo de Caixa**

**Gráfico de Timeline (30 dias):**

- **Eixo X:** Dias do mês (1-31)
- **Eixo Y:** Valores acumulados
- **Linhas:**
  - Verde: Entradas de dinheiro (quando recebe)
  - Vermelha: Saídas (vencimentos)
  - Azul: Saldo acumulado dia a dia

**Identificação de Gargalos:**

App analisa automaticamente:

```python
for dia in range(1, 32):
    saldo_ate_dia = sum(entradas_ate_dia) - sum(saidas_ate_dia)
    if saldo_ate_dia < 0:
        alerta(f"⚠️ No dia {dia}, você terá déficit de R$ {abs(saldo_ate_dia)}")
```

**Alertas exibidos (se aplicável):**
- ⚠️ "Dia 10: Você terá R$ 500 em contas, mas só receberá o salário no dia 5. Risco: BAIXO"
- ⚠️ "Dia 15: Fatura de R$ 850 vence, mas você só terá R$ 600. Risco: ALTO"
- ⚠️ "Dia 20-30: Período crítico com 5 contas e sem entradas. Considere negociar vencimentos."

**Recomendações Automáticas:**

Para cada vencimento problemático:

**Card de Sugestão:**
- Conta: [Nome]
- Vencimento atual: Dia X
- Problema: "Vence antes de você receber"
- Sugestão: "Alterar vencimento para dia Y (3 dias após seu salário)"
- Botão: "Como alterar vencimento?" (tutorial por fornecedor)

**Ferramenta de Simulação:**

- Input: "Testar novo vencimento" (Date picker 1-31)
- Ao alterar: Gráfico atualiza dinamicamente
- Mostra impacto no fluxo de caixa

**Rodapé:**
- Vencimentos problemáticos identificados: X
- Sugestões de ajuste: Y
- Botão "Próximo Passo"

---

**PASSO 3: Configurar Lembretes e Pagamentos Automáticos**

- **Título:** "Nunca mais esqueça um vencimento"
- **Subtítulo:** "Configure alertas e débitos automáticos"

**Para cada obrigação (lista):**

**Card de Configuração:**

**Header:** Nome da conta | Vence dia X | R$ Y

**Opções de Lembrete:**

1. **Débito Automático** (Toggle)
   - Se ativar:
     - Pergunta: "Já configurou no banco/fornecedor?" (Radio: Sim / Não / Não sei)
     - Se "Não": Botão "Ver tutorial de como configurar"
     - Badge verde: "DÉBITO AUTO ATIVO" (sem risco de esquecer)
   
2. **Lembretes** (se débito NÃO ativo ou como backup)
   - Checkbox: "Lembrete 3 dias antes" (padrão: marcado)
   - Checkbox: "Lembrete 1 dia antes"
   - Checkbox: "Lembrete no dia do vencimento"
   - Canal (Radio: Push / WhatsApp / E-mail / Todos)

**Configuração Global (no topo):**
- Toggle: "Aplicar mesmos lembretes para todas as contas" (facilita)
  - Se ativo: Define padrão (ex: 3 dias antes por Push) para todas

**Pagamento Recorrente via PIX:**

- Disponível se `payment_method` = 'PIX'
- Pergunta: "Seu banco permite agendar PIX recorrente?"
  - Se SIM: Instruções de como configurar
  - Badge: "PIX AGENDADO" (equivalente a débito auto)

**Alertas de Pagamento Crítico (prioritários):**

Para contas `priority` = 'essencial':
- Destaque visual (borda vermelha no card)
- Lembrete EXTRA: "7 dias antes" (além dos padrões)
- Mensagem: "Essencial: Se atrasar, pode ter corte de serviço"

**Card de Resumo de Notificações (preview):**
```
📅 Seus próximos lembretes:
• 02/01: Lembrete - Aluguel vence em 3 dias (R$ 1.200)
• 04/01: Lembrete - Aluguel vence amanhã (R$ 1.200)
• 05/01: VENCIMENTO HOJE - Aluguel (R$ 1.200)
• 07/01: Lembrete - Luz vence em 3 dias (R$ 150)
...
```

**Rodapé:**
- Obrigações com débito automático: X de Y
- Lembretes configurados: Z
- Botão "Próximo Passo"

---

**PASSO 4: Calendário Financeiro Consolidado**

- **Título:** "Seu Calendário Financeiro está pronto!"
- **Subtítulo:** "Visão mensal de todos os vencimentos"

**Componente: Calendário Interativo**

**Visualização Padrão: Lista Ordenada por Dia**

```
DIA 1-5
─────────────────────────────────
Dia 5 - Aluguel: R$ 1.200 (PIX)
Dia 5 - Parcela Empréstimo: R$ 350
─────────────────────────────────
Total da semana: R$ 1.550

DIA 6-10
─────────────────────────────────
Dia 10 - Luz: R$ 150 (Déb. Auto)
Dia 10 - Água: R$ 80 (Boleto)
─────────────────────────────────
Total da semana: R$ 230

DIA 11-15
─────────────────────────────────
Dia 15 - Fatura Nubank: R$ 850
Dia 15 - Internet: R$ 100
─────────────────────────────────
Total da semana: R$ 950
...
```

**Alternativa: Visualização em Calendário Mensal**

- Grid estilo calendário (7 colunas dom-sáb)
- Cada dia exibe:
  - Número do dia
  - ícones de contas (hover mostra nome e valor)
  - Total do dia (se houver vencimentos)
  - Cor de fundo: verde (dia de recebimento) / vermelho (dia com muitas contas)

**Filtros de Visualização:**
- Dropdown: "Ver por" (Todos / Essenciais / Cartões / Dívidas / Assinaturas)
- Toggle: "Mostrar apenas débito manual" (esconde débitos automáticos)

**Card de Resumo do Mês:**
```
┌────────────────────────────────────────┐
│ RESUMO DO MÊS                          │
│                                        │
│ Total de obrigações: 18                │
│ Total a pagar: R$ 4.850,00             │
│ Débitos automáticos: R$ 1.200,00       │
│ Pagamentos manuais: R$ 3.650,00        │
│                                        │
│ Entradas previstas: R$ 4.300,00        │
│ Sobra projetada: R$ -550,00 ⚠️         │
│                                        │
│ ⚠️ ATENÇÃO: Déficit de R$ 550          │
│ Revise prioridades no Dia 8            │
└────────────────────────────────────────┘
```

**Ações Disponíveis:**

1. **Exportar Calendário**
   - Formatos: PDF / iCal (Google Calendar) / CSV
   - Botão "Baixar PDF" → Gera documento com todos os vencimentos
   - Botão "Sincronizar com Google" → Exporta para Google Calendar (via integração)

2. **Imprimir Resumo Mensal**
   - Versão simplificada para colar na geladeira/parede
   - Lista de vencimentos + valores + datas

3. **Compartilhar (se divide finanças com alguém)**
   - Se `initial_assessment.shares_finances` = TRUE (do Dia 1):
     - Botão "Compartilhar com [Nome]"
     - Envia link ou PDF por WhatsApp/E-mail

**Integração com Próximos Dias:**

Badge informativo:
"✅ Este calendário alimenta automaticamente:
• Dia 8: Prioridades quando não dá pra pagar tudo
• Dia 9: Orçamento mínimo de 30 dias
• Dia 14: Plano 30/90"

**Atualização do Termômetro "Respirar":**
- Pergunta: "Após organizar todos os vencimentos, como você se sente?"
- Slider 0-10 + justificativa

**Rodapé:**
- Botões: "Salvar Rascunho" | "Concluir Dia 7"

---

**Tela de Conclusão do Dia 7:**

```
🎉 Dia 7 Concluído!

Seu Calendário Financeiro:
• X obrigações organizadas
• Y lembretes configurados
• Z débitos automáticos ativos

Próximos vencimentos:
• Dia X: [Nome] - R$ Y
• Dia Z: [Nome] - R$ W

Nunca mais pague juros por esquecimento!

Próximo: Dia 8 - Prioridades quando não dá pra pagar tudo
```

---

### 🗄️ Infraestrutura (Backend + Fluxo de Dados)

#### **Tabelas do Banco de Dados**

**29. Tabela: `obligations`** (obrigações consolidadas)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da obrigação |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `name` | VARCHAR(255) | NOT NULL | Nome da conta |
| `amount` | DECIMAL(10,2) | NOT NULL, CHECK > 0 | Valor |
| `due_day` | INTEGER | CHECK (1-31) | Dia do vencimento |
| `recurrence` | VARCHAR(20) | NOT NULL | 'monthly' / 'bimonthly' / 'quarterly' / 'semiannual' / 'annual' / 'one_time' |
| `category` | VARCHAR(50) | NOT NULL | Categoria (habitação, serviços, etc.) |
| `payment_method` | VARCHAR(30) | NOT NULL | Forma de pagamento |
| `priority` | VARCHAR(20) | NOT NULL | 'essential' / 'important' / 'negotiable' |
| `is_auto_debit` | BOOLEAN | DEFAULT FALSE | Se está no débito automático |
| `notes` | TEXT | NULLABLE | Observações |
| `source_day` | INTEGER | NULLABLE | Dia de origem (2, 5, 6, etc.) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

**30. Tabela: `seasonal_obligations`** (vencimentos sazonais)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da obrigação sazonal |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `name` | VARCHAR(255) | NOT NULL | Nome (ex: IPTU, IPVA, Seguro) |
| `total_amount` | DECIMAL(10,2) | NOT NULL | Valor total |
| `due_month` | INTEGER | CHECK (1-12) | Mês do vencimento |
| `due_day` | INTEGER | CHECK (1-31) | Dia do vencimento |
| `divide_monthly` | BOOLEAN | DEFAULT FALSE | Se divide em 12x no orçamento |
| `monthly_reserve` | DECIMAL(10,2) | NULLABLE | Valor a reservar por mês (total/12) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**31. Tabela: `income_dates`** (datas de recebimento - já existe parcialmente no Dia 2)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `income_item_id` | UUID | FOREIGN KEY → income_items(id) | Fonte de renda |
| `payment_day` | INTEGER | CHECK (1-31) | Dia do recebimento |
| `amount` | DECIMAL(10,2) | NOT NULL | Valor recebido |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**32. Tabela: `obligation_reminders`** (configuração de lembretes)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do lembrete |
| `obligation_id` | UUID | FOREIGN KEY → obligations(id) | Obrigação |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `days_before` | INTEGER | NOT NULL | Dias antes do vencimento (1, 3, 7) |
| `channel` | VARCHAR(20) | NOT NULL | 'push' / 'whatsapp' / 'email' |
| `is_active` | BOOLEAN | DEFAULT TRUE | Se está ativo |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**33. Tabela: `cash_flow_analysis`** (análise de fluxo de caixa)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da análise |
| `user_id` | UUID | FOREIGN KEY → users(id), UNIQUE | Usuário (1:1 análise atual) |
| `critical_days` | JSONB | NOT NULL | Array de dias com déficit [{day, deficit, reason}] |
| `total_monthly_obligations` | DECIMAL(10,2) | NOT NULL | Total de obrigações mensais |
| `total_monthly_income` | DECIMAL(10,2) | NOT NULL | Total de receitas mensais |
| `projected_balance` | DECIMAL(10,2) | NOT NULL | Sobra/falta projetada |
| `auto_debit_total` | DECIMAL(10,2) | NOT NULL | Total em débito automático |
| `manual_payment_total` | DECIMAL(10,2) | NOT NULL | Total pagamento manual |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

---

#### **Regras de Negócio**

1. **Pré-carregamento de Obrigações (Dias 2, 5, 6 → Dia 7):**
   
   **Do Dia 2 (fixed_expenses):**
   ```sql
   INSERT INTO obligations (user_id, name, amount, due_day, recurrence, category, payment_method, priority, source_day)
   SELECT 
     user_id,
     name,
     amount,
     due_day,
     'monthly',
     category,
     payment_method,
     classification,
     2
   FROM fixed_expenses
   WHERE user_id = ?
   ```
   
   **Do Dia 5 (card_invoices):**
   ```sql
   INSERT INTO obligations (user_id, name, amount, due_day, recurrence, category, payment_method, priority, source_day)
   SELECT 
     ci.user_id,
     CONCAT('Fatura ', pm.name),
     ci.total_amount,
     EXTRACT(DAY FROM ci.due_date),
     'monthly',
     'cartão',
     'boleto',
     'essential',
     5
   FROM card_invoices ci
   JOIN payment_methods pm ON ci.payment_method_id = pm.id
   WHERE ci.user_id = ?
   ```
   
   **Do Dia 6 (assinaturas mantidas):**
   ```sql
   INSERT INTO obligations (user_id, name, amount, due_day, recurrence, category, payment_method, priority, source_day)
   SELECT 
     user_id,
     description,
     monthly_cost,
     1,  -- Default dia 1 (usuário pode ajustar)
     'monthly',
     'assinaturas',
     'cartão',
     'negotiable',
     6
   FROM leakage_items
   WHERE user_id = ? AND action = 'control'
   ```

2. **Cálculo de Fluxo de Caixa Diário:**
   ```python
   def calcular_fluxo_caixa(user_id, mes_ano):
       dias = range(1, 32)
       fluxo = []
       
       for dia in dias:
           # Entradas até este dia
           entradas_ate_dia = sum(
               income_items.amount 
               WHERE income_items.payment_day <= dia
           )
           
           # Saídas até este dia
           saidas_ate_dia = sum(
               obligations.amount
               WHERE obligations.due_day <= dia
           )
           
           saldo_dia = entradas_ate_dia - saidas_ate_dia
           
           if saldo_dia < 0:
               critical_days.append({
                   "day": dia,
                   "deficit": abs(saldo_dia),
                   "reason": "Contas vencem antes das receitas"
               })
           
           fluxo.append({
               "day": dia,
               "income": entradas_ate_dia,
               "expenses": saidas_ate_dia,
               "balance": saldo_dia
           })
       
       return fluxo, critical_days
   ```

3. **Identificação de Vencimentos Problemáticos:**
   - Problema: Vencimento antes da entrada de renda
   - Query:
     ```sql
     SELECT o.name, o.due_day, o.amount
     FROM obligations o
     WHERE o.user_id = ?
       AND o.due_day < (SELECT MIN(payment_day) FROM income_items WHERE user_id = ?)
     ORDER BY o.due_day
     ```
   - Para cada: Sugerir novo vencimento = `MIN(income_items.payment_day) + 3`

4. **Agendamento de Lembretes:**
   - Para cada obrigação com lembretes ativos:
     ```sql
     SELECT o.name, o.amount, o.due_day, or.days_before, or.channel
     FROM obligations o
     JOIN obligation_reminders or ON o.id = or.obligation_id
     WHERE o.user_id = ? AND or.is_active = TRUE
     ```
   - Agendar notificações:
     - Data: Dia do vencimento - `days_before`
     - Hora: Baseada em `user_commitment.daily_time_exact` (do Dia 1) ou 9h padrão
     - Canal: `or.channel`
     - Mensagem: "⏰ Lembrete: [nome] vence em [X] dias. Valor: R$ [Y]"

5. **Cálculo de Totais Mensais:**
   ```sql
   UPDATE cash_flow_analysis SET
     total_monthly_obligations = (
       SELECT SUM(amount) FROM obligations WHERE user_id = ? AND recurrence = 'monthly'
     ) + (
       SELECT SUM(monthly_reserve) FROM seasonal_obligations WHERE user_id = ? AND divide_monthly = TRUE
     ),
     total_monthly_income = (
       SELECT SUM(amount) FROM income_items WHERE user_id = ?
     ),
     projected_balance = total_monthly_income - total_monthly_obligations,
     auto_debit_total = (
       SELECT SUM(amount) FROM obligations WHERE user_id = ? AND is_auto_debit = TRUE
     ),
     manual_payment_total = (
       SELECT SUM(amount) FROM obligations WHERE user_id = ? AND is_auto_debit = FALSE
     )
   WHERE user_id = ?
   ```

6. **Validações:**
   - `due_day` deve estar entre 1-31
   - Se `recurrence` = 'annual': `seasonal_obligations` deve ter entrada
   - Se `divide_monthly` = TRUE: `monthly_reserve` = `total_amount / 12`

---

#### **Outputs do App (Documentos Gerados)**

1. **Calendário Financeiro Mensal** (PDF/Visualização)
   - Mês/Ano de referência
   - Lista completa de vencimentos ordenados por dia
   - Total por semana
   - Total mensal
   - Entradas previstas (datas de salário/receitas)
   - Gráfico de fluxo de caixa (entradas vs saídas)

2. **Lista de Obrigações Prioritárias** (para uso no Dia 8)
   - Ordenação por prioridade (Essencial → Importante → Negociável)
   - Categorização por consequência de atraso
   - Total: R$ X

3. **Roteiro de Contato para Alterar Vencimentos**
   - Para cada serviço com vencimento problemático:
     - Nome do fornecedor
     - Telefone/e-mail de contato
     - Vencimento atual
     - Vencimento sugerido
     - Tutorial de como solicitar alteração

4. **Resumo de Notificações Agendadas**
   - Próximos 30 dias de lembretes
   - Formato: Data | Hora | Tipo de Lembrete | Conta | Valor

---

#### **Fluxo de Integração com Dias Futuros**

**Dados do Dia 7 que serão reutilizados:**

- **Dia 8 (Prioridades):**
  - Toda a tabela `obligations` alimenta a matriz de prioridade
  - Classificação por `priority` (essential/important/negotiable)
  - Cálculo de consequências de atraso baseado em categoria

- **Dia 9 (Orçamento Mínimo):**
  - `obligations` WHERE `priority` = 'essential' = base do orçamento mínimo
  - `seasonal_obligations.monthly_reserve` entra como despesa fixa mensal
  - `cash_flow_analysis.total_monthly_obligations` = referência para orçamento

- **Dia 10 (Mapa de Negociação):**
  - Dívidas de `obligations` (se houver) com vencimentos próximos são priorizadas
  - Contas com `priority` = 'negotiable' são candidatas a renegociação de prazo

- **Dia 12 (Fechar Acordo):**
  - Novos acordos de dívidas são adicionados como novas `obligations`
  - Datas de vencimento dos acordos alimentam o calendário

- **Dia 13 (Novas Regras de Vida):**
  - Rotina semanal inclui: "Revisar vencimentos dos próximos 7 dias" (puxa de `obligations`)

- **Dia 14 (Plano 30/90):**
  - `cash_flow_analysis` determina se o usuário está em "Emergência total" (déficit) / "Equilibrar" / "Tração leve"
  - Calendário de checkpoints usa datas de `obligations` para criar marcos

- **Dia 15 (Formatura):**
  - Protocolo semanal inclui: "Ver contas dos próximos 7 dias" (query em `obligations`)
  - Painel de progresso: "Essenciais em dia" (status OK/Atenção baseado em `due_day`)

---

#### **Endpoints da API (Backend)**

**GET /api/v1/obligations**
- **Response 200:**
```json
{
  "user_id": "uuid",
  "obligations": [
    {
      "id": "uuid",
      "name": "Aluguel",
      "amount": 1200.00,
      "due_day": 5,
      "recurrence": "monthly",
      "category": "habitação",
      "payment_method": "PIX",
      "priority": "essential",
      "is_auto_debit": false,
      "source_day": 2
    },
    ...
  ],
  "totals": {
    "monthly_obligations": 4850.00,
    "auto_debit": 1200.00,
    "manual_payment": 3650.00
  }
}
```

**POST /api/v1/obligations**
- **Payload:**
```json
{
  "user_id": "uuid",
  "obligations": [
    {
      "name": "IPTU 2024",
      "amount": 1200.00,
      "due_day": 15,
      "recurrence": "annual",
      "category": "impostos",
      "payment_method": "boleto",
      "priority": "essential",
      "notes": "Pode parcelar em 10x"
    }
  ]
}
```

**POST /api/v1/seasonal-obligations**
- **Payload:**
```json
{
  "user_id": "uuid",
  "seasonal": [
    {
      "name": "IPTU",
      "total_amount": 1200.00,
      "due_month": 11,
      "due_day": 15,
      "divide_monthly": true
    }
  ]
}
```

**GET /api/v1/cash-flow-analysis**
- **Response 200:**
```json
{
  "user_id": "uuid",
  "analysis": {
    "total_monthly_income": 4300.00,
    "total_monthly_obligations": 4850.00,
    "projected_balance": -550.00,
    "critical_days": [
      {
        "day": 15,
        "deficit": 250.00,
        "reason": "Fatura de cartão vence antes do freela"
      },
      {
        "day": 25,
        "deficit": 550.00,
        "reason": "Múltiplas contas sem entrada de renda"
      }
    ],
    "auto_debit_total": 1200.00,
    "manual_payment_total": 3650.00
  },
  "recommendations": [
    "Altere o vencimento da fatura do Nubank para o dia 20",
    "Negocie o vencimento da conta de internet para depois do dia 15"
  ]
}
```

**POST /api/v1/obligation-reminders**
- **Payload:**
```json
{
  "user_id": "uuid",
  "reminders": [
    {
      "obligation_id": "uuid",
      "days_before": 3,
      "channel": "push"
    },
    {
      "obligation_id": "uuid",
      "days_before": 1,
      "channel": "whatsapp"
    }
  ]
}
```

**GET /api/v1/calendar-export/{format}**
- **Params:** format = 'pdf' | 'ical' | 'csv'
- **Response:** Arquivo para download

---

### 📊 Métricas de Sucesso do Dia 7

1. **Taxa de Conclusão:** % que completa Dia 7
2. **Obrigações Cadastradas:** Média de obrigações por usuário
3. **Taxa de Débito Automático:** % de obrigações em débito auto
4. **Dias Críticos Identificados:** Média de dias com déficit por usuário
5. **Lembretes Configurados:** Média de lembretes por obrigação
6. **Vencimentos Sazonais:** % que cadastra obrigações anuais
7. **Exportação de Calendário:** % que exporta para PDF ou Google Calendar
8. **Evolução do Termômetro:** Dia 6 vs Dia 7

---



---

## **DIA 8 — Prioridades Quando Não Dá Pra Pagar Tudo**

### 🎯 Título
**Matriz de Prioridade: Decida Racionalmente Quais Contas Pagar Primeiro**

### 🌅 Mensagem Matinal
Nem sempre há dinheiro para pagar tudo. Nessas horas, a ansiedade e o medo podem levar a decisões equivocadas, como pagar a conta mais barulhenta em vez da mais importante. Hoje você vai aprender a priorizar racionalmente: separar o que precisa ser pago de imediato (moradia, luz, água, alimentação) do que pode ser renegociado ou adiado (assinaturas, parcelas de consumo, serviços flexíveis). Com esses critérios, você ganha serenidade para enfrentar momentos de aperto sem entrar em pânico ou piorar a dívida.

### 📚 Conceito FIRE do Dia
**Prioridade com propósito.** No FIRE, cada real tem uma missão: proteger o básico, evitar multas e juros altos e, quando possível, quitar dívidas mais caras. As prioridades devem seguir a lógica "manter a vida e o crédito básico funcionando" antes de qualquer luxo. O conceito de "tempestade financeira" ajuda: quando a receita cai ou uma emergência surge, você aciona um modo de emergência que reordena pagamentos e ativa negociação imediata. Esse modo deve estar pré-definido para reduzir a dor da decisão.

### ✅ Seu Desafio Hoje
Estabelecer critérios claros de prioridade para decidir quais contas pagar primeiro quando o dinheiro não cobre todas, evitando consequências graves e protegendo o essencial.

### 🎯 SUA TAREFA PRÁTICA

#### **Experiência do Usuário (UX/UI)**

**Tela de Introdução do Dia 8**
- **Header:** "Dia 8 — Prioridades quando não dá pra pagar tudo"
- **Barra de progresso:** 0% → 100%
- **Card motivacional:** "Quando o dinheiro está curto, saber o que priorizar salva sua paz mental e evita problemas maiores."
- **Badges:** Tempo estimado (15-25 min) | Requer (Calendário do Dia 7)
- **CTA:** "Criar Matriz de Prioridade"

**Fluxo Principal (3 Passos)**

**PASSO 1: Classificar Obrigações por Importância**

- **Título:** "Vamos classificar cada conta por importância"
- **Subtítulo:** "Nem tudo é urgente. Nem tudo é essencial."

**Pré-carregamento:**
- Todas as obrigações do Dia 7 (`obligations` table)
- Campos carregados: `name`, `amount`, `due_day`, `category`, `priority` (sugestão)

**Componente: Tabela Interativa de Classificação**

**4 Categorias de Prioridade:**

1. **🔴 ESSENCIAL (Altíssima Prioridade)**
   - Descrição: "Se atrasar, você perde o básico ou tem consequências gravíssimas"
   - Exemplos pré-definidos:
     - Moradia (aluguel, prestação da casa)
     - Alimentação básica (mercado)
     - Medicamentos de uso contínuo
     - Energia elétrica (risco de corte)
     - Água (risco de corte)
   - Regra: "Pague SEMPRE, mesmo que atrase outras"

2. **🟡 IMPORTANTE (Prioridade Média)**
   - Descrição: "Necessário para trabalhar ou manter a vida funcionando"
   - Exemplos:
     - Educação (escola dos filhos, mensalidade obrigatória)
     - Transporte (combustível, vale-transporte)
     - Internet (se trabalha home office)
     - Telefone celular
     - Plano de saúde (se essencial)
   - Regra: "Pague se sobrar depois do essencial"

3. **🟢 NEGOCIÁVEL (Baixa Prioridade)**
   - Descrição: "Importante mas pode ser renegociado ou temporariamente pausado"
   - Exemplos:
     - Assinaturas (streaming, apps)
     - Lazer (academia, clubes)
     - Parcelas de bens não essenciais (TV, celular)
     - Consórcios
   - Regra: "Negocie prazo ou pause temporariamente"

4. **⚪ PAUSÁVEL/CORTÁVEL**
   - Descrição: "Serviços supérfluos ou adiáveis sem grande impacto"
   - Exemplos:
     - Delivery regular
     - Assinaturas não usadas
     - Serviços de conveniência
   - Regra: "Corte imediatamente se o dinheiro estiver curto"

**Tabela de Classificação:**

Para cada obrigação (do Dia 7):

| Conta | Valor | Categoria | Prioridade Sugerida | Sua Classificação | Consequência se atrasar |
|-------|-------|-----------|---------------------|-------------------|------------------------|
| Aluguel | R$ 1.200 | Habitação | ESSENCIAL | [Dropdown] | [Dropdown] |
| Luz | R$ 150 | Serviços | ESSENCIAL | [Dropdown] | [Dropdown] |
| Netflix | R$ 40 | Assinatura | PAUSÁVEL | [Dropdown] | [Dropdown] |

**Dropdowns:**

**"Sua Classificação":**
- Essencial
- Importante
- Negociável
- Pausável

**"Consequência se atrasar":**
- Perda de moradia / Despejo
- Corte de serviço essencial (luz/água/gás)
- Negativação no SPC/Serasa
- Multa e juros altos (> 10%)
- Multa e juros moderados (< 10%)
- Perda de benefício não crítico
- Nenhuma consequência grave

**Pré-preenchimento Automático:**
- App sugere classificação baseada em `category`:
  - `habitacao`, `medicamentos` → ESSENCIAL
  - `transporte`, `educacao` → IMPORTANTE
  - `assinaturas`, `lazer` → NEGOCIÁVEL ou PAUSÁVEL
- Usuário pode editar manualmente

**Card de Resumo:**
```
Suas prioridades:
• ESSENCIAL: X contas = R$ Y
• IMPORTANTE: Z contas = R$ W
• NEGOCIÁVEL: A contas = R$ B
• PAUSÁVEL: C contas = R$ D
```

**Rodapé:**
- Total de obrigações classificadas: X de Y
- Botão "Próximo Passo" (ativo quando todas estão classificadas)

---

**PASSO 2: Criar Matriz de Prioridade**

- **Título:** "Sua ordem de pagamento definida"
- **Subtítulo:** "Quando o dinheiro estiver curto, siga esta sequência"

**Componente: Matriz Visual de Prioridade**

**Eixo X:** Importância (Essencial → Pausável)  
**Eixo Y:** Consequência (Gravíssima → Nenhuma)

**Quadrantes do Gráfico:**

```
         GRAVÍSSIMA
            │
ESSENCIAL───┼───IMPORTANTE
            │
         MODERADA
            │
NEGOCIÁVEL──┼───PAUSÁVEL
            │
         NENHUMA
```

**Visualização de Bolhas:**
- Cada obrigação = bolha
- Tamanho da bolha = valor (R$)
- Cor = categoria de prioridade
- Posição = importância vs consequência

**Exemplo de posicionamento:**
- Aluguel: Quadrante superior esquerdo (Essencial + Gravíssima)
- Netflix: Quadrante inferior direito (Pausável + Nenhuma)
- Fatura do Cartão: Centro-esquerda (Importante + Moderada-Alta)

**Lista Ordenada de Pagamentos (gerada automaticamente):**

**Sequência de Prioridade (do 1º ao último a pagar):**

```
🔴 PRIORIDADE MÁXIMA (pague SEMPRE)
1. Aluguel - R$ 1.200 (Despejo)
2. Luz - R$ 150 (Corte de serviço)
3. Água - R$ 80 (Corte de serviço)
4. Medicamentos - R$ 200 (Risco à saúde)
─────────────────────────────────
Subtotal Essencial: R$ 1.630

🟡 PRIORIDADE ALTA (pague se sobrar)
5. Internet - R$ 100 (Trabalho home office)
6. Transporte - R$ 250 (Ir ao trabalho)
7. Escola filho - R$ 400 (Educação)
─────────────────────────────────
Subtotal Importante: R$ 750

🟢 PRIORIDADE MÉDIA (negocie se não couber)
8. Fatura cartão - R$ 850 (Juros altos se atrasar)
9. Parcela empréstimo - R$ 350 (Negativação)
10. Academia - R$ 90 (Pode pausar)
─────────────────────────────────
Subtotal Negociável: R$ 1.290

⚪ BAIXA PRIORIDADE (pause/corte)
11. Netflix - R$ 40 (Nenhuma)
12. Spotify - R$ 20 (Nenhuma)
─────────────────────────────────
Subtotal Pausável: R$ 60

═══════════════════════════════════
TOTAL GERAL: R$ 3.730
```

**Simulador de Cenário:**

**Input:** "Quanto você tem disponível este mês?" (R$)

Exemplo: Usuário digita R$ 2.000

**App calcula automaticamente:**
```
Você tem: R$ 2.000

Seguindo a ordem de prioridade:
✅ Itens 1-4 (Essenciais): R$ 1.630 - PAGO
✅ Item 5 (Internet): R$ 100 - PAGO
✅ Item 6 (Transporte): R$ 250 - PAGO

Sobra: R$ 20

⚠️ FALTAM:
• Item 7 (Escola): R$ 400
• Itens 8-12: R$ 1.310

RECOMENDAÇÃO:
• Pague os essenciais (✅ Feito)
• Negocie escola para parcelar (R$ 400)
• Entre em contato com banco do cartão para parcelar fatura
• Pause Netflix e Spotify imediatamente
```

**Botão:** "Gerar Plano de Ação" → Cria checklist detalhado

---

**PASSO 3: Plano Emergencial de Pagamento**

- **Título:** "O que fazer quando não dá pra pagar tudo"
- **Subtítulo:** "Plano de ação mês a mês"

**Card de Cenário Atual:**
```
MÊS ATUAL (Janeiro/2024)

Dinheiro disponível: R$ 2.000
Total de contas: R$ 3.730
DÉFICIT: R$ 1.730 ⚠️
```

**Plano de Ação Automático (gerado pelo app):**

**✅ AÇÕES IMEDIATAS (Hoje):**

1. **Pagar contas essenciais** (não negocie essas)
   - [ ] Aluguel - R$ 1.200 (PIX/Boleto)
   - [ ] Luz - R$ 150 (Débito automático)
   - [ ] Água - R$ 80 (Boleto)
   - [ ] Medicamentos - R$ 200 (Dinheiro/Cartão débito)
   - **Total a pagar agora: R$ 1.630**

2. **Pagar contas importantes (se couber)**
   - [ ] Internet - R$ 100 ✅ Cabe
   - [ ] Transporte - R$ 250 ✅ Cabe
   - **Total: R$ 350**

**Sobra após essencial + importante: R$ 20**

**⚠️ AÇÕES DE NEGOCIAÇÃO (Esta semana):**

3. **Negociar contas que NÃO CABEM:**
   
   **Escola do filho (R$ 400):**
   - Ação: Ligar para escola
   - Proposta: "Posso parcelar em 2x de R$ 200 ou pagar R$ 200 agora e R$ 200 mês que vem?"
   - Telefone: (XX) XXXX-XXXX
   - Prazo: Até dia X
   - [ ] Marcar quando negociar

   **Fatura do Cartão (R$ 850):**
   - Ação: Ligar para banco
   - Proposta: "Parcelar fatura em 3x ou migrar para linha mais barata"
   - Telefone: 0800-XXX-XXXX
   - Prazo: Antes do vencimento (dia Y)
   - [ ] Marcar quando negociar

   **Parcela Empréstimo (R$ 350):**
   - Ação: Negociar prazo ou pular 1 mês
   - Proposta: "Posso adiar esta parcela para o próximo mês?"
   - [ ] Marcar quando negociar

**🔴 AÇÕES DE CORTE (Imediato):**

4. **Pausar/Cancelar não essenciais:**
   - [ ] Netflix (R$ 40) - Cancelar temporariamente
   - [ ] Spotify (R$ 20) - Cancelar temporariamente
   - [ ] Academia (R$ 90) - Pausar por 2 meses
   - **Economia imediata: R$ 150/mês**

**📊 PROJEÇÃO PARA OS PRÓXIMOS MESES:**

**Mês 2 (Fevereiro):**
- Dinheiro previsto: R$ 2.000 (mesma renda)
- Contas essenciais: R$ 1.630
- Contas importantes: R$ 350
- Escola (parcela 2/2): R$ 200
- Fatura cartão (parcela 1/3): R$ 283
- Empréstimo (se negociar): R$ 0 (pulou 1 mês)
- **Total: R$ 2.463**
- **Déficit ainda existe: R$ 463**

**Recomendação:** "Continue negociando. Busque renda extra ou reduza mais gastos no Dia 6."

**Card de Scripts de Negociação (pré-preenchido):**

Para cada conta a negociar, botão "Ver script sugerido":

**Exemplo - Escola:**
```
📞 SCRIPT DE NEGOCIAÇÃO

Cumprimento:
"Bom dia, falo com o setor financeiro? Meu nome é [Nome],
responsável pelo aluno [Nome do filho], matrícula XXXX."

Contexto:
"Estou passando por uma dificuldade financeira temporária
e não conseguirei pagar a mensalidade integral este mês."

Proposta:
"Posso parcelar o valor de R$ 400 em 2 vezes? Ou pagar
R$ 200 agora e R$ 200 no próximo vencimento?"

Argumentação:
"Sempre paguei em dia. É uma situação pontual. Preciso
manter meu filho estudando."

Fechamento:
"Se puderem me ajudar com essa flexibilidade, garanto
regularizar nos próximos meses."
```

**Botões de ação:**
- "Copiar script"
- "Ligar agora" (deep link para discador com número)
- "Marcar como negociado" (atualiza status)

**Atualização do Termômetro "Respirar":**
- Pergunta: "Após criar sua matriz de prioridade e plano emergencial, como você se sente?"
- Slider 0-10 + justificativa

**Rodapé:**
- Botões: "Salvar Rascunho" | "Concluir Dia 8"

---

**Tela de Conclusão do Dia 8:**

```
✅ Dia 8 Concluído!

Sua Matriz de Prioridade:
• X contas essenciais = R$ Y
• Z contas importantes = R$ W
• A contas negociáveis = R$ B

Plano de Ação:
• ✅ Pagar essenciais: R$ Y
• ⏳ Negociar: X contas
• ✂️ Cortar/Pausar: Z serviços

Você tem um roteiro claro. Não entre em pânico.
Siga a ordem e negocie com calma.

Próximo: Dia 9 - Orçamento Mínimo de 30 Dias
```

---

### 🗄️ Infraestrutura (Backend + Fluxo de Dados)

#### **Tabelas do Banco de Dados**

**34. Tabela: `priority_matrix`** (matriz de prioridade)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da matriz |
| `user_id` | UUID | FOREIGN KEY → users(id), UNIQUE | Usuário (1:1 matriz atual) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

**35. Tabela: `classified_obligations`** (obrigações classificadas)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID |
| `priority_matrix_id` | UUID | FOREIGN KEY → priority_matrix(id) | Matriz |
| `obligation_id` | UUID | FOREIGN KEY → obligations(id) | Obrigação |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `classification` | VARCHAR(20) | NOT NULL | 'essential' / 'important' / 'negotiable' / 'pausable' |
| `consequence` | VARCHAR(50) | NOT NULL | Tipo de consequência se atrasar |
| `priority_order` | INTEGER | NOT NULL | Ordem de prioridade (1=primeiro a pagar) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de classificação |

**36. Tabela: `emergency_payment_plan`** (plano emergencial)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do plano |
| `user_id` | UUID | FOREIGN KEY → users(id), UNIQUE | Usuário (1:1 plano atual) |
| `month_date` | DATE | NOT NULL | Mês de referência |
| `available_amount` | DECIMAL(10,2) | NOT NULL | Dinheiro disponível |
| `total_obligations` | DECIMAL(10,2) | NOT NULL | Total de contas |
| `deficit` | DECIMAL(10,2) | NOT NULL | Déficit (se negativo) |
| `essentials_total` | DECIMAL(10,2) | NOT NULL | Total de essenciais |
| `essentials_covered` | BOOLEAN | DEFAULT FALSE | Se essenciais cabem no disponível |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**37. Tabela: `payment_actions`** (ações do plano)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da ação |
| `emergency_plan_id` | UUID | FOREIGN KEY → emergency_payment_plan(id) | Plano |
| `classified_obligation_id` | UUID | FOREIGN KEY → classified_obligations(id) | Obrigação |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `action_type` | VARCHAR(20) | NOT NULL | 'pay_now' / 'negotiate' / 'pause' / 'cut' |
| `amount_to_pay` | DECIMAL(10,2) | NULLABLE | Quanto vai pagar (se parcial) |
| `negotiation_proposal` | TEXT | NULLABLE | Proposta de negociação |
| `contact_info` | VARCHAR(255) | NULLABLE | Telefone/e-mail para contato |
| `deadline` | DATE | NULLABLE | Prazo para executar ação |
| `status` | VARCHAR(20) | DEFAULT 'pending' | 'pending' / 'completed' / 'failed' |
| `completed_at` | TIMESTAMP | NULLABLE | Quando foi feito |
| `notes` | TEXT | NULLABLE | Anotações sobre a negociação |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**38. Tabela: `negotiation_scripts`** (scripts de negociação)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do script |
| `category` | VARCHAR(50) | NOT NULL | Categoria da conta (educacao, cartao, etc.) |
| `script_text` | TEXT | NOT NULL | Texto do script (template) |
| `placeholders` | JSONB | NOT NULL | Variáveis a substituir {nome, valor, etc.} |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

---

#### **Regras de Negócio**

1. **Pré-carregamento de Obrigações (Dia 7 → Dia 8):**
   - Query: `SELECT * FROM obligations WHERE user_id = ? ORDER BY due_day`
   - Auto-classificação baseada em `category`:
     ```python
     classification_map = {
         'habitacao': 'essential',
         'medicamentos': 'essential',
         'servicos': 'essential',  # luz, água, gás
         'transporte': 'important',
         'educacao': 'important',
         'assinaturas': 'pausable',
         'lazer': 'pausable'
     }
     ```
   - Auto-sugestão de consequência:
     ```python
     consequence_map = {
         'habitacao': 'perda_moradia',
         'servicos': 'corte_servico_essencial',
         'cartao': 'negativacao_juros_altos',
         'assinaturas': 'nenhuma_grave'
     }
     ```

2. **Cálculo de Ordem de Prioridade:**
   ```python
   def calcular_ordem_prioridade(classificacoes):
       # Ordenar por: classificação > consequência > valor
       ordem = sorted(classificacoes, key=lambda x: (
           priority_weight[x.classification],  # essential=1, important=2, etc.
           consequence_weight[x.consequence],  # gravíssima=1, moderada=2, etc.
           -x.amount  # Maior valor primeiro (dentro da mesma prioridade)
       ))
       
       for i, item in enumerate(ordem, start=1):
           item.priority_order = i
       
       return ordem
   ```

3. **Simulação de Pagamento (dado valor disponível):**
   ```python
   def simular_pagamento(user_id, valor_disponivel):
       # Buscar obrigações ordenadas por prioridade
       obrigacoes = get_classified_obligations_ordered(user_id)
       
       saldo = valor_disponivel
       pagamentos = []
       negociacoes = []
       cortes = []
       
       for obr in obrigacoes:
           if saldo >= obr.amount:
               # Paga integral
               pagamentos.append({
                   'obligation': obr,
                   'action': 'pay_now',
                   'amount': obr.amount
               })
               saldo -= obr.amount
           elif obr.classification == 'essential':
               # Essencial mas não cabe: ALERTAR
               negociacoes.append({
                   'obligation': obr,
                   'action': 'negotiate',
                   'reason': 'Essencial mas não há dinheiro suficiente'
               })
           elif obr.classification == 'important':
               negociacoes.append({
                   'obligation': obr,
                   'action': 'negotiate'
               })
           else:
               # Pausável/negociável
               cortes.append({
                   'obligation': obr,
                   'action': 'pause' if obr.classification == 'negotiable' else 'cut'
               })
       
       return {
           'pay_now': pagamentos,
           'negotiate': negociacoes,
           'pause_or_cut': cortes,
           'remaining_balance': saldo
       }
   ```

4. **Geração de Scripts de Negociação:**
   - Query: `SELECT * FROM negotiation_scripts WHERE category = ?`
   - Substituir placeholders:
     ```python
     script_template = negotiation_scripts.script_text
     placeholders = {
         '{nome}': user.name,
         '{valor}': obligation.amount,
         '{nome_conta}': obligation.name,
         '{data_vencimento}': obligation.due_day
     }
     
     script_final = script_template
     for key, value in placeholders.items():
         script_final = script_final.replace(key, str(value))
     
     return script_final
     ```

5. **Validações:**
   - Todas as obrigações devem ter `classification` definida antes de avançar
   - `consequence` obrigatória
   - `available_amount` deve ser > 0
   - Se `deficit` > 0: obrigatório ter pelo menos 1 ação de negociação

6. **Alertas Críticos:**
   - Se essenciais não cabem no disponível:
     - Alerta vermelho: "⚠️ ATENÇÃO! Você não tem dinheiro suficiente nem para as contas essenciais. Negocie URGENTEMENTE."
   - Se apenas essenciais cabem:
     - Alerta amarelo: "Você só consegue pagar o essencial. Todo o resto precisa ser negociado."
   - Se essenciais + importantes cabem:
     - Alerta verde: "Você consegue cobrir as prioridades. Negocie o resto para aliviar o mês que vem."

---

#### **Outputs do App (Documentos Gerados)**

1. **Lista de Prioridades** (PDF/Visualização)
   - Data: DD/MM/YYYY
   - Obrigações ordenadas por prioridade (1→N)
   - Categorias e consequências
   - Total por faixa de prioridade:
     - Essencial: R$ X
     - Importante: R$ Y
     - Negociável: R$ Z
     - Pausável: R$ W

2. **Plano Emergencial de Pagamento** (para o mês corrente)
   - Dinheiro disponível: R$ X
   - Total de contas: R$ Y
   - Déficit/Sobra: R$ Z
   - **Ações:**
     - PAGAR AGORA: Lista + total
     - NEGOCIAR: Lista + scripts de negociação
     - PAUSAR/CORTAR: Lista + economia gerada

3. **Modelo de E-mail/Mensagem para Negociação**
   - Scripts personalizados por categoria de conta
   - Formatados para copiar/colar
   - Incluem:
     - Cumprimento
     - Contextualização
     - Proposta clara
     - Argumentação
     - Fechamento educado

---

#### **Fluxo de Integração com Dias Futuros**

**Dados do Dia 8 que serão reutilizados:**

- **Dia 9 (Orçamento Mínimo):**
  - `classified_obligations` WHERE `classification` = 'essential' = base do orçamento mínimo
  - Soma dos essenciais = piso mínimo de despesas mensais

- **Dia 10 (Mapa de Negociação):**
  - `payment_actions` WHERE `action_type` = 'negotiate' alimentam lista de negociações
  - Scripts de negociação (`negotiation_scripts`) são reutilizados
  - Telefones de contato (`contact_info`) pré-carregados

- **Dia 12 (Fechar Acordo):**
  - Ações de negociação pendentes são revisadas
  - Status atualizado para 'completed' após negociação bem-sucedida

- **Dia 13 (Novas Regras de Vida):**
  - Matriz de prioridade vira parte do "protocolo de emergência"
  - Se modo emergência ativo: app reordena automaticamente pagamentos

- **Dia 14 (Plano 30/90):**
  - Se `deficit` > 0: modo do plano = "Emergência total"
  - Essenciais do Dia 8 são protegidos no Plano 30
  - Negociações planejadas entram como ações do Plano 90

- **Dia 15 (Formatura):**
  - Regra de decisão para emergências (Nível 1-2-3) usa matriz de prioridade do Dia 8
  - Protocolo semanal inclui: "Ver contas dos próximos 7 dias e priorizar se necessário"

---

#### **Endpoints da API (Backend)**

**POST /api/v1/classify-obligations**
- **Payload:**
```json
{
  "user_id": "uuid",
  "classifications": [
    {
      "obligation_id": "uuid",
      "classification": "essential",
      "consequence": "perda_moradia"
    },
    {
      "obligation_id": "uuid",
      "classification": "negotiable",
      "consequence": "negativacao_moderada"
    }
  ]
}
```

**POST /api/v1/priority-matrix**
- **Payload:**
```json
{
  "user_id": "uuid"
}
```

- **Response 201:**
```json
{
  "success": true,
  "matrix": {
    "essentials": [
      {
        "priority_order": 1,
        "name": "Aluguel",
        "amount": 1200.00,
        "consequence": "perda_moradia"
      }
    ],
    "important": [...],
    "negotiable": [...],
    "pausable": [...]
  },
  "totals": {
    "essentials": 1630.00,
    "important": 750.00,
    "negotiable": 1290.00,
    "pausable": 60.00
  }
}
```

**POST /api/v1/simulate-payment**
- **Payload:**
```json
{
  "user_id": "uuid",
  "available_amount": 2000.00,
  "month_date": "2024-01-01"
}
```

- **Response 200:**
```json
{
  "success": true,
  "simulation": {
    "available": 2000.00,
    "total_obligations": 3730.00,
    "deficit": 1730.00,
    "pay_now": [
      {"name": "Aluguel", "amount": 1200.00},
      {"name": "Luz", "amount": 150.00}
    ],
    "pay_now_total": 1630.00,
    "negotiate": [
      {"name": "Escola", "amount": 400.00, "proposal": "Parcelar em 2x"},
      {"name": "Fatura cartão", "amount": 850.00, "proposal": "Parcelar fatura"}
    ],
    "pause_or_cut": [
      {"name": "Netflix", "amount": 40.00, "action": "cut"},
      {"name": "Academia", "amount": 90.00, "action": "pause"}
    ],
    "remaining_balance": 370.00,
    "savings_from_cuts": 130.00
  },
  "alerts": [
    "Você consegue pagar todos os essenciais ✅",
    "Negocie as contas importantes para evitar juros"
  ]
}
```

**GET /api/v1/negotiation-script/{category}**
- **Response 200:**
```json
{
  "category": "educacao",
  "script": "Bom dia, falo com o setor financeiro? Meu nome é {nome}, responsável pelo aluno {nome_aluno}...",
  "contact_info": {
    "phone": "(XX) XXXX-XXXX",
    "email": "financeiro@escola.com",
    "business_hours": "8h-18h"
  }
}
```

**PUT /api/v1/payment-action/{id}/complete**
- **Payload:**
```json
{
  "status": "completed",
  "completed_at": "2024-01-08T15:30:00Z",
  "notes": "Escola aceitou parcelar em 2x de R$ 200. Próxima parcela vence dia 15/02."
}
```

---

### 📊 Métricas de Sucesso do Dia 8

1. **Taxa de Conclusão:** % que completa Dia 8
2. **Distribuição de Classificação:** % de obrigações em cada categoria (Essencial/Importante/Negociável/Pausável)
3. **Taxa de Déficit:** % de usuários com déficit (total contas > dinheiro disponível)
4. **Déficit Médio:** Média de déficit entre usuários com déficit
5. **Taxa de Cobertura de Essenciais:** % que consegue pagar todas as contas essenciais
6. **Ações de Negociação Geradas:** Média de obrigações marcadas para negociar
7. **Uso de Scripts:** % que copia/utiliza scripts de negociação
8. **Evolução do Termômetro:** Dia 7 vs Dia 8 (pode cair se déficit alto, mas melhora após plano claro)

---



---

## **DIA 9 — Orçamento Mínimo de 30 Dias**

### 🎯 Título
**Orçamento Mínimo Realista: Defina Quanto Custa Seu Mês Básico**

### 🌅 Mensagem Matinal
Controlar o dinheiro é direcionar cada real para uma missão. O orçamento mínimo é a soma de tudo o que você precisa para viver e trabalhar durante 30 dias sem piorar suas dívidas. Não se trata de viver com migalhas, mas de focar no que realmente importa até reorganizar sua vida financeira. Hoje você vai definir quanto custa seu mês básico, estabelecer tetos para gastos variáveis (alimentação, transporte, lazer) e ver quanto sobra para dívidas e imprevistos.

### 📚 Conceito FIRE do Dia
**Liberdade com disciplina.** No FIRE, gastar menos que se ganha é regra inegociável. Construir um orçamento mínimo não é um castigo, mas uma estratégia para ganhar tempo e paz mental. Ao saber seu custo fixo e seus limites variáveis, você evita descarrilar nas tentações do dia a dia. Além disso, o orçamento mínimo serve de base para sua reserva de emergência e para calcular o valor necessário para investir no futuro.

### ✅ Seu Desafio Hoje
Construir um orçamento mínimo realista para os próximos 30 dias, priorizando o essencial, ajustando variáveis e determinando um teto por categoria para evitar rombos.

### 🎯 SUA TAREFA PRÁTICA

#### **Experiência do Usuário (UX/UI)**

**Tela de Introdução do Dia 9**
- **Header:** "Dia 9 — Orçamento Mínimo de 30 Dias"
- **Barra de progresso:** 0% → 100%
- **Card motivacional:** "Saber exatamente quanto custa seu mês básico é o primeiro passo para ter sobra e construir seu futuro."
- **Badges:** Tempo estimado (20-30 min) | Requer (Dados dos Dias 2-8)
- **CTA:** "Construir Orçamento Mínimo"

**Fluxo Principal (4 Passos)**

**PASSO 1: Despesas Essenciais (Fixas)**

- **Título:** "Quanto você precisa para viver os próximos 30 dias?"
- **Subtítulo:** "Some todas as despesas essenciais e importantes"

**Pré-carregamento Inteligente:**

App consolida automaticamente:

1. **Do Dia 8 (Prioridades):**
   - Query: `SELECT * FROM classified_obligations WHERE classification IN ('essential', 'important')`
   
2. **Do Dia 7 (Vencimentos):**
   - `seasonal_obligations.monthly_reserve` (se divide anualmente)

3. **Do Dia 6 (Vazamentos):**
   - Assinaturas mantidas sob controle (não cortadas)

**Componente: Lista de Despesas Essenciais**

**Categorias Pré-carregadas:**

**1. HABITAÇÃO**
| Item | Valor | Vencimento | Status |
|------|-------|------------|--------|
| Aluguel | R$ 1.200 | Dia 5 | ✅ Pré-carregado |
| Condomínio | R$ 200 | Dia 10 | ✅ Pré-carregado |
| IPTU (mensal) | R$ 100 | - | ✅ Pré-carregado |

**Subtotal Habitação: R$ 1.500**

**2. SERVIÇOS PÚBLICOS**
| Item | Valor | Vencimento |
|------|-------|------------|
| Luz | R$ 150 | Dia 10 |
| Água | R$ 80 | Dia 15 |
| Gás | R$ 70 | Dia 20 |

**Subtotal Serviços: R$ 300**

**3. COMUNICAÇÃO**
| Item | Valor | Vencimento |
|------|-------|------------|
| Internet | R$ 100 | Dia 25 |
| Telefone | R$ 50 | Dia 30 |

**Subtotal Comunicação: R$ 150**

**4. TRANSPORTE**
| Item | Valor | Vencimento |
|------|-------|------------|
| Combustível | R$ 250 | - |
| Ou Vale-transporte | R$ 200 | - |

**Subtotal Transporte: R$ 250**

**5. SAÚDE**
| Item | Valor | Vencimento |
|------|-------|------------|
| Plano de saúde | R$ 300 | Dia 15 |
| Medicamentos | R$ 150 | - |

**Subtotal Saúde: R$ 450**

**6. EDUCAÇÃO**
| Item | Valor | Vencimento |
|------|-------|------------|
| Escola filho | R$ 400 | Dia 20 |

**Subtotal Educação: R$ 400**

**7. DÍVIDAS/PARCELAS FIXAS**
| Item | Valor | Vencimento |
|------|-------|------------|
| Fatura Cartão (parcelas) | R$ 250 | Dia 15 |
| Empréstimo | R$ 350 | Dia 25 |

**Subtotal Dívidas: R$ 600**

**Ações disponíveis:**
- Botão "+ Adicionar Despesa Essencial" (se faltou algo)
- Ícone "✏️" para editar valores
- Toggle "Incluir no orçamento mínimo?" (para itens negociáveis)

**Card de Total Parcial:**
```
┌────────────────────────────────────┐
│ TOTAL DE DESPESAS ESSENCIAIS       │
│                                    │
│ Habitação:      R$ 1.500           │
│ Serviços:       R$   300           │
│ Comunicação:    R$   150           │
│ Transporte:     R$   250           │
│ Saúde:          R$   450           │
│ Educação:       R$   400           │
│ Dívidas:        R$   600           │
│ ────────────────────────────       │
│ SUBTOTAL FIXO:  R$ 3.650           │
└────────────────────────────────────┘
```

**Rodapé:**
- Botão "Próximo Passo"

---

**PASSO 2: Tetos para Despesas Variáveis**

- **Título:** "Defina limites realistas para gastos que variam todo mês"
- **Subtítulo:** "Baseado no seu histórico, sugerimos tetos para cada categoria"

**Pré-carregamento:**

1. **Do Dia 3 (Arqueologia):**
   - `spending_patterns.monthly_avg_by_category` (médias dos últimos 3 meses)

2. **Do Dia 6 (Vazamentos):**
   - `variable_caps.new_monthly_limit` (limites já definidos)

**Componente: Configuração de Tetos Variáveis**

Para cada categoria variável:

**1. ALIMENTAÇÃO (Mercado)**
- Gasto médio (últimos 3 meses): R$ 800
- Sugestão do app: Manter em R$ 800 (ou reduzir 10-20% se quiser economizar)
- **Seu teto:** Input R$ (usuário define)
  - Slider: R$ 500 ← → R$ 1.000
  - Helper: "Mínimo sugerido: R$ 500 (básico) | Confortável: R$ 800"
- **Como controlar:** 
  - Radio: "Comprar 1x/semana (R$ 200/semana)" / "Comprar quinzenalmente" / "Sem divisão semanal"

**2. DELIVERY / RESTAURANTES**
- Gasto médio: R$ 360 (12x/mês)
- Limite definido no Dia 6: R$ 120 (4x/mês)
- **Seu teto:** Input R$ (pré-preenchido com R$ 120)
- **Máximo de vezes:** Input numérico (pré-preenchido: 4)

**3. TRANSPORTE (Apps/Combustível Extra)**
- Gasto médio: R$ 200
- **Seu teto:** Input R$
- Sugestão: R$ 150 (redução de 25%)

**4. LAZER / ENTRETENIMENTO**
- Gasto médio: R$ 200
- Limite definido no Dia 6: R$ 100
- **Seu teto:** Input R$ (pré-preenchido)

**5. ROUPAS / VESTUÁRIO**
- Gasto médio: R$ 150
- **Seu teto:** Input R$
- Sugestão: R$ 100 ou R$ 0 (pausa temporária)
- Checkbox: "Pausar compras de roupas neste mês"

**6. FARMÁCIA (Gastos Eventuais)**
- Gasto médio: R$ 80
- **Seu teto:** Input R$

**7. PEQUENOS PRAZERES (Cafés, Lanches, etc.)**
- Gasto médio: R$ 100
- Limite definido no Dia 6: R$ 50
- **Seu teto:** Input R$ (pré-preenchido)

**8. OUTROS VARIÁVEIS**
- Campo livre para adicionar

**Alertas Inteligentes:**
- Se soma de tetos variáveis > 30% da renda:
  - "⚠️ Seus tetos variáveis estão altos (R$ X = Y% da renda). Considere reduzir para ter sobra."
- Se redução muito agressiva:
  - "💡 Você reduziu delivery de R$ 360 para R$ 0. Isso é sustentável? Pequenas reduções graduais costumam funcionar melhor."

**Card de Total Variáveis:**
```
┌────────────────────────────────────┐
│ TOTAL DE TETOS VARIÁVEIS           │
│                                    │
│ Mercado:        R$   800           │
│ Delivery:       R$   120           │
│ Transporte:     R$   150           │
│ Lazer:          R$   100           │
│ Roupas:         R$     0 (pausado) │
│ Farmácia:       R$    80           │
│ Pequenos        R$    50           │
│ ────────────────────────────       │
│ SUBTOTAL VARIÁVEL: R$ 1.300        │
└────────────────────────────────────┘
```

**Rodapé:**
- Botão "Recalcular" (atualiza totais se usuário alterar valores)
- Botão "Próximo Passo"

---

**PASSO 3: Reserva para Emergências e Dívidas**

- **Título:** "Reserve um mínimo para imprevistos e para acelerar dívidas"
- **Subtítulo:** "Mesmo que seja R$ 50, comece sua caixinha de emergência"

**Cálculo da Sobra Disponível:**

```
Renda Total:                 R$ 3.500
(-) Despesas Fixas:          R$ 3.650
(-) Tetos Variáveis:         R$ 1.300
────────────────────────────────────
= Sobra/Falta:               R$ -450 ⚠️
```

**Cenário 1: SOBRA POSITIVA**

Se `sobra` > 0:

**Card de Alocação de Sobra:**
```
✅ Você tem R$ X de sobra!

Como alocar:
┌────────────────────────────────────┐
│ 1. Caixinha de Emergência          │
│    Valor: R$ ___ (sugestão: 50%)   │
│    Meta: 3-6 meses de despesas     │
│                                    │
│ 2. Pagamento Extra de Dívidas      │
│    Valor: R$ ___ (sugestão: 40%)   │
│    Prioridade: Juros mais altos    │
│                                    │
│ 3. Pequenas Melhorias/Qualidade    │
│    Valor: R$ ___ (sugestão: 10%)   │
│    Ex: Pequeno lazer, auto-cuidado │
└────────────────────────────────────┘
```

**Inputs:**
- Quanto para caixinha de emergência? (R$)
- Quanto para pagar dívidas extras? (R$)
- Quanto para pequenas melhorias? (R$)

**Validação:** Soma deve = sobra disponível

**Cenário 2: DÉFICIT (Falta)**

Se `sobra` < 0:

**Alerta Vermelho:**
```
⚠️ ATENÇÃO: Seu orçamento mínimo (R$ Y) está
R$ Z acima da sua renda (R$ X)!

AÇÕES URGENTES:
1. Revise os tetos variáveis no Passo 2
2. Volte ao Dia 6 e corte mais vazamentos
3. Negocie despesas fixas (Dias 10-12)
4. Busque renda extra (temporária)
```

**Campos obrigatórios:**
- Qual ação você vai tomar? (Checkboxes)
  - [ ] Reduzir tetos variáveis
  - [ ] Cortar mais assinaturas/vazamentos
  - [ ] Negociar despesas fixas
  - [ ] Buscar renda extra (freela, venda de itens, bico)

**Simulador de Ajustes:**

Se déficit, app abre simulador:

"Vamos encontrar R$ Z para equilibrar?"

**Sugestões automáticas:**
- Mercado: Reduzir de R$ 800 → R$ 600 (Economia: R$ 200)
- Delivery: Reduzir de R$ 120 → R$ 80 (Economia: R$ 40)
- Transporte: Reduzir de R$ 150 → R$ 100 (Economia: R$ 50)
- Lazer: Pausar temporariamente (Economia: R$ 100)
- **Total de ajustes possíveis: R$ 390**

Usuário marca quais aceita. App recalcula em tempo real.

**Cenário 3: SOBRA MÍNIMA (< 5% da renda)**

Se sobra entre 0-5% da renda:

**Alerta Amarelo:**
```
⚠️ Sua sobra é muito pequena (R$ X = Y%).
Você está no limite. Qualquer imprevisto pode
causar atraso nas contas.

RECOMENDAÇÃO: Tente aumentar a sobra para
pelo menos 10% da renda (R$ Z).
```

**Rodapé:**
- Botão "Salvar Ajustes" (se fez mudanças no simulador)
- Botão "Próximo Passo"

---

**PASSO 4: Compromisso e Programação de Pagamentos**

- **Título:** "Seu Orçamento Mínimo está pronto!"
- **Subtítulo:** "Revise tudo e assine seu compromisso"

**Resumo Final do Orçamento:**

```
┌─────────────────────────────────────────────┐
│        ORÇAMENTO MÍNIMO - MÊS XX/2024       │
├─────────────────────────────────────────────┤
│ ENTRADAS                                    │
│ Renda Total:                    R$ 3.500,00 │
│                                             │
│ SAÍDAS FIXAS                                │
│ • Habitação:            R$ 1.500,00         │
│ • Serviços:             R$   300,00         │
│ • Comunicação:          R$   150,00         │
│ • Transporte:           R$   250,00         │
│ • Saúde:                R$   450,00         │
│ • Educação:             R$   400,00         │
│ • Dívidas/Parcelas:     R$   600,00         │
│ ───────────────────────────────────         │
│ Subtotal Fixo:                  R$ 3.650,00 │
│                                             │
│ SAÍDAS VARIÁVEIS (Tetos)                    │
│ • Mercado:              R$   800,00         │
│ • Delivery:             R$   120,00         │
│ • Transporte:           R$   150,00         │
│ • Lazer:                R$   100,00         │
│ • Roupas:               R$     0,00         │
│ • Farmácia:             R$    80,00         │
│ • Pequenos prazeres:    R$    50,00         │
│ ───────────────────────────────────         │
│ Subtotal Variável:              R$ 1.300,00 │
│                                             │
│ TOTAL GERAL:                    R$ 4.950,00 │
│                                             │
│ ═══════════════════════════════════════════ │
│                                             │
│ SOBRA/FALTA:                    R$ -1.450,00│
│ STATUS: ⚠️ DÉFICIT - AÇÃO NECESSÁRIA        │
│                                             │
│ (Se sobra positiva, mostra alocação)        │
│ • Caixinha emergência:  R$   XXX            │
│ • Pagar dívidas:        R$   YYY            │
│ • Pequenas melhorias:   R$   ZZZ            │
└─────────────────────────────────────────────┘
```

**Gráfico Visual (Pizza ou Barras):**
- Mostra proporção de cada categoria em relação à renda
- Destaque para categorias que consomem > 20% da renda

**Campo de Compromisso:**

**"Escreva sua frase de compromisso:"**
- Textarea (máx. 200 chars)
- Exemplos sugeridos:
  - "Nos próximos 30 dias, vou respeitar meus tetos e priorizar o essencial"
  - "Eu controlo meu dinheiro. Ele não me controla."
  - "Cada real tem uma missão. Vou seguir o plano."

**Botão:** "Assinar Digitalmente" 
- Gera documento com nome do usuário + data + hash

**Programação de Alertas:**

**Pergunta:** "Como você quer acompanhar seu orçamento?"

- Checkbox: "Alertas quando atingir 80% de um teto variável"
- Checkbox: "Resumo semanal de gastos vs orçamento"
- Checkbox: "Alerta 3 dias antes de estourar orçamento geral"

**Rodapé do passo:**
- **Atualização do Termômetro "Respirar":**
  - "Após criar seu orçamento mínimo, como você se sente?"
  - Slider 0-10 + justificativa

**Botões:**
- "Salvar Rascunho"
- "Concluir Dia 9" (gera orçamento e ativa alertas)

---

**Tela de Conclusão do Dia 9:**

```
🎉 Dia 9 Concluído!

Seu Orçamento Mínimo:
• Despesas Fixas: R$ X
• Tetos Variáveis: R$ Y
• Total Mensal: R$ Z

[Se sobra:]
✅ Sobra de R$ W!
Destino: Caixinha (R$ A) + Dívidas (R$ B)

[Se déficit:]
⚠️ Déficit de R$ W
Ações planejadas: [lista]

O orçamento vai guiar suas decisões nos
próximos 30 dias. Respeite os tetos!

Próximo: Dia 10 - Mapa de Negociação
```

---

### 🗄️ Infraestrutura (Backend + Fluxo de Dados)

#### **Tabelas do Banco de Dados**

**39. Tabela: `minimum_budget`** (orçamento mínimo)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do orçamento |
| `user_id` | UUID | FOREIGN KEY → users(id), UNIQUE | Usuário (1:1 orçamento atual) |
| `month_date` | DATE | NOT NULL | Mês de referência |
| `total_income` | DECIMAL(10,2) | NOT NULL | Renda total |
| `total_fixed` | DECIMAL(10,2) | NOT NULL | Total de despesas fixas |
| `total_variable_caps` | DECIMAL(10,2) | NOT NULL | Total de tetos variáveis |
| `total_monthly_budget` | DECIMAL(10,2) | NOT NULL | Total geral (fixo + variável) |
| `balance` | DECIMAL(10,2) | NOT NULL | Sobra/Falta (renda - total) |
| `emergency_reserve` | DECIMAL(10,2) | DEFAULT 0 | Quanto aloca para caixinha |
| `debt_extra_payment` | DECIMAL(10,2) | DEFAULT 0 | Quanto para pagar dívidas extras |
| `quality_of_life` | DECIMAL(10,2) | DEFAULT 0 | Quanto para pequenas melhorias |
| `commitment_phrase` | TEXT | NULLABLE | Frase de compromisso |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

**40. Tabela: `budget_fixed_items`** (itens fixos do orçamento)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do item |
| `budget_id` | UUID | FOREIGN KEY → minimum_budget(id) | Orçamento |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `category` | VARCHAR(50) | NOT NULL | habitacao / servicos / comunicacao / transporte / saude / educacao / dividas |
| `name` | VARCHAR(255) | NOT NULL | Nome da despesa |
| `amount` | DECIMAL(10,2) | NOT NULL | Valor |
| `source_obligation_id` | UUID | NULLABLE, FOREIGN KEY → obligations(id) | Obrigação de origem (se aplicável) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**41. Tabela: `budget_variable_caps`** (tetos variáveis do orçamento)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do teto |
| `budget_id` | UUID | FOREIGN KEY → minimum_budget(id) | Orçamento |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `category` | VARCHAR(50) | NOT NULL | mercado / delivery / transporte / lazer / roupas / farmacia / pequenos_prazeres / outros |
| `historical_avg` | DECIMAL(10,2) | NOT NULL | Média histórica (últimos 3 meses) |
| `monthly_cap` | DECIMAL(10,2) | NOT NULL | Teto definido pelo usuário |
| `control_method` | VARCHAR(20) | NULLABLE | 'weekly' / 'biweekly' / 'monthly' / 'per_transaction' |
| `weekly_limit` | DECIMAL(10,2) | NULLABLE | Se divisão semanal |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**42. Tabela: `budget_tracking`** (rastreamento do orçamento)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do rastreamento |
| `budget_id` | UUID | FOREIGN KEY → minimum_budget(id) | Orçamento |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `month_date` | DATE | NOT NULL | Mês |
| `total_spent_fixed` | DECIMAL(10,2) | DEFAULT 0 | Gasto real em fixas |
| `total_spent_variable` | DECIMAL(10,2) | DEFAULT 0 | Gasto real em variáveis |
| `variable_by_category` | JSONB | NOT NULL | Objeto {categoria: gasto_atual} |
| `alerts_triggered` | JSONB | DEFAULT '[]' | Array de alertas disparados |
| `last_updated` | TIMESTAMP | DEFAULT NOW() | Última atualização |

**Constraint:** UNIQUE(budget_id, month_date)

**43. Tabela: `deficit_action_plan`** (plano de ação para déficit)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do plano |
| `budget_id` | UUID | FOREIGN KEY → minimum_budget(id) | Orçamento |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `deficit_amount` | DECIMAL(10,2) | NOT NULL | Valor do déficit |
| `planned_actions` | JSONB | NOT NULL | Array de ações planejadas |
| `adjustments_made` | JSONB | NULLABLE | Ajustes feitos (categoria: -valor) |
| `new_balance_after_adj` | DECIMAL(10,2) | NULLABLE | Novo balanço após ajustes |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

---

#### **Regras de Negócio**

1. **Pré-carregamento de Despesas Fixas (Dias 7, 8 → Dia 9):**
   
   **Query:**
   ```sql
   INSERT INTO budget_fixed_items (budget_id, user_id, category, name, amount, source_obligation_id)
   SELECT 
     ?,  -- budget_id
     user_id,
     CASE 
       WHEN o.category IN ('habitacao') THEN 'habitacao'
       WHEN o.category IN ('servicos') THEN 'servicos'
       WHEN o.category IN ('comunicacao') THEN 'comunicacao'
       WHEN o.category IN ('transporte') THEN 'transporte'
       WHEN o.category IN ('saude') THEN 'saude'
       WHEN o.category IN ('educacao') THEN 'educacao'
       ELSE 'dividas'
     END as category,
     o.name,
     o.amount,
     o.id
   FROM obligations o
   JOIN classified_obligations co ON o.id = co.obligation_id
   WHERE o.user_id = ?
     AND co.classification IN ('essential', 'important')
   ```

2. **Pré-carregamento de Tetos Variáveis (Dias 3, 6 → Dia 9):**
   
   **Médias históricas (Dia 3):**
   ```sql
   SELECT category, avg_monthly
   FROM (
     SELECT 
       category,
       SUM(ABS(amount)) / 3.0 as avg_monthly  -- 90 dias = 3 meses
     FROM transactions
     WHERE user_id = ?
       AND amount < 0  -- Débitos
       AND category IN ('mercado', 'delivery', 'transporte', 'lazer', 'roupas', 'farmacia')
       AND transaction_date >= CURRENT_DATE - INTERVAL '90 days'
     GROUP BY category
   ) subquery
   ```
   
   **Limites do Dia 6:**
   ```sql
   SELECT category, new_monthly_limit
   FROM variable_caps
   WHERE user_id = ?
   ```
   
   **Merge:** Se existe limite do Dia 6, usa ele. Senão, usa média histórica.

3. **Cálculo do Balanço:**
   ```sql
   UPDATE minimum_budget SET
     total_fixed = (SELECT COALESCE(SUM(amount), 0) FROM budget_fixed_items WHERE budget_id = ?),
     total_variable_caps = (SELECT COALESCE(SUM(monthly_cap), 0) FROM budget_variable_caps WHERE budget_id = ?),
     total_monthly_budget = total_fixed + total_variable_caps,
     balance = total_income - total_monthly_budget
   WHERE id = ?
   ```

4. **Validação de Alocação de Sobra:**
   - Se `balance` > 0:
     - `emergency_reserve` + `debt_extra_payment` + `quality_of_life` deve = `balance`
     - Se não bate: erro "A soma das alocações deve ser igual à sobra disponível"

5. **Simulador de Ajustes de Déficit:**
   ```python
   def simular_ajustes_deficit(budget_id, deficit):
       sugestoes = []
       
       # Buscar tetos variáveis ordenados por potencial de redução
       caps = get_variable_caps_ordered_by_reduction_potential(budget_id)
       
       ajustes_possiveis = 0
       for cap in caps:
           if cap.category == 'mercado':
               reducao = cap.monthly_cap * 0.20  # Sugestão: reduzir 20%
           elif cap.category == 'delivery':
               reducao = cap.monthly_cap * 0.30  # Sugestão: reduzir 30%
           elif cap.category == 'lazer':
               reducao = cap.monthly_cap * 0.50  # Sugestão: reduzir 50% ou pausar
           elif cap.category == 'roupas':
               reducao = cap.monthly_cap  # Sugestão: pausar totalmente
           else:
               reducao = cap.monthly_cap * 0.15  # Sugestão genérica: 15%
           
           sugestoes.append({
               'category': cap.category,
               'current': cap.monthly_cap,
               'suggested': cap.monthly_cap - reducao,
               'savings': reducao
           })
           
           ajustes_possiveis += reducao
           
           if ajustes_possiveis >= deficit:
               break
       
       return sugestoes, ajustes_possiveis
   ```

6. **Rastreamento em Tempo Real:**
   - Ao registrar nova despesa:
     ```sql
     UPDATE budget_tracking SET
       total_spent_variable = total_spent_variable + ?,
       variable_by_category = jsonb_set(
         variable_by_category,
         '{categoria}',
         to_jsonb((variable_by_category->>'categoria')::numeric + ?)
       )
     WHERE budget_id = ? AND month_date = DATE_TRUNC('month', CURRENT_DATE)
     ```
   
   - Verificar se ultrapassou teto:
     ```sql
     SELECT 
       category,
       monthly_cap,
       (bt.variable_by_category->>category)::numeric as spent,
       ((bt.variable_by_category->>category)::numeric / monthly_cap * 100) as percentage
     FROM budget_variable_caps bvc
     JOIN budget_tracking bt ON bvc.budget_id = bt.budget_id
     WHERE bvc.user_id = ?
       AND (bt.variable_by_category->>category)::numeric >= bvc.monthly_cap * 0.8
     ```
   
   - Se `percentage` >= 80: Disparar alerta
   - Se `percentage` >= 100: Bloquear compra (se configurado)

7. **Alertas Automáticos:**
   - **Alerta 80% do teto:**
     - "⚠️ Você já gastou R$ X dos R$ Y permitidos em [categoria]. Restam R$ Z."
   
   - **Alerta 100% do teto:**
     - "🛑 LIMITE ATINGIDO! Você gastou todo o orçamento de [categoria] (R$ X). Evite novos gastos até o próximo mês."
   
   - **Resumo semanal (domingo 20h, por exemplo):**
     - "📊 Resumo da semana: Você gastou R$ X de R$ Y do orçamento total. Sobra: R$ Z"
     - Detalhamento por categoria

---

#### **Outputs do App (Documentos Gerados)**

1. **Planilha do Orçamento Mínimo** (PDF/Excel/Visualização)
   - Mês/Ano de referência
   - Renda total
   - Despesas fixas (por categoria + subtotais)
   - Tetos variáveis (por categoria + subtotais)
   - Total geral
   - Sobra/Falta
   - Alocação da sobra (se positivo)
   - Gráfico de pizza (distribuição das despesas)
   - Gráfico de barras (renda vs despesas)

2. **Contrato de Compromisso** (documento assinado)
   - Frase de compromisso do usuário
   - Data de assinatura
   - Hash do documento
   - Texto: "Eu, [Nome], me comprometo a respeitar este orçamento mínimo pelos próximos 30 dias."
   - QR code para verificação

3. **Notificações Programadas**
   - Alertas de 80% e 100% dos tetos
   - Resumo semanal de gastos
   - Alerta 3 dias antes de estourar orçamento geral (se configurado)

---

#### **Fluxo de Integração com Dias Futuros**

**Dados do Dia 9 que serão reutilizados:**

- **Dia 10 (Mapa de Negociação):**
  - `minimum_budget.balance` determina quanto o usuário pode destinar às dívidas mensalmente
  - Se déficit: prioridade ALTA em negociar despesas fixas

- **Dia 12 (Fechar Acordo):**
  - Novos acordos de dívidas devem caber no orçamento mínimo
  - App alerta se parcela do acordo > `balance` disponível

- **Dia 13 (Novas Regras de Vida):**
  - `budget_variable_caps.monthly_cap` se torna limite permanente por categoria
  - Rotina semanal inclui: "Ver sobra/falta do orçamento mínimo" (puxa de `budget_tracking`)

- **Dia 14 (Plano 30/90):**
  - Orçamento mínimo (`minimum_budget.total_monthly_budget`) = base do Plano 30
  - Se sobra > 0: modo "Tração leve"
  - Se déficit: modo "Emergência total"

- **Dia 15 (Formatura):**
  - Protocolo semanal inclui: "Ver sobra/falta do orçamento mínimo" (item fixo do checklist)
  - Painel de progresso: "Sobra do orçamento mínimo" (valor disponível em tempo real)

---

#### **Endpoints da API (Backend)**

**POST /api/v1/minimum-budget**
- **Payload:**
```json
{
  "user_id": "uuid",
  "month_date": "2024-01-01",
  "total_income": 3500.00,
  "fixed_items": [
    {"category": "habitacao", "name": "Aluguel", "amount": 1200.00},
    {"category": "servicos", "name": "Luz", "amount": 150.00}
  ],
  "variable_caps": [
    {"category": "mercado", "historical_avg": 800.00, "monthly_cap": 800.00},
    {"category": "delivery", "historical_avg": 360.00, "monthly_cap": 120.00}
  ],
  "emergency_reserve": 0,
  "debt_extra_payment": 0,
  "quality_of_life": 0,
  "commitment_phrase": "Nos próximos 30 dias, vou respeitar meus tetos e priorizar o essencial."
}
```

- **Response 201:**
```json
{
  "success": true,
  "budget": {
    "id": "uuid",
    "total_fixed": 3650.00,
    "total_variable_caps": 1300.00,
    "total_monthly_budget": 4950.00,
    "balance": -1450.00,
    "status": "deficit"
  },
  "alerts": [
    "⚠️ Seu orçamento excede sua renda em R$ 1.450,00",
    "Revise os tetos variáveis ou negocie despesas fixas"
  ]
}
```

**GET /api/v1/minimum-budget/{user_id}**
- **Response 200:**
```json
{
  "user_id": "uuid",
  "budget": {
    "month_date": "2024-01-01",
    "total_income": 3500.00,
    "total_fixed": 3650.00,
    "total_variable_caps": 1300.00,
    "balance": -1450.00,
    "fixed_breakdown": {...},
    "variable_caps_breakdown": {...},
    "commitment_phrase": "..."
  }
}
```

**POST /api/v1/simulate-deficit-adjustments**
- **Payload:**
```json
{
  "budget_id": "uuid",
  "deficit": 1450.00
}
```

- **Response 200:**
```json
{
  "deficit": 1450.00,
  "suggestions": [
    {
      "category": "mercado",
      "current": 800.00,
      "suggested": 640.00,
      "savings": 160.00,
      "explanation": "Redução de 20% no mercado"
    },
    {
      "category": "roupas",
      "current": 150.00,
      "suggested": 0,
      "savings": 150.00,
      "explanation": "Pausar compras de roupas temporariamente"
    }
  ],
  "total_savings_possible": 1500.00,
  "enough_to_cover": true
}
```

**GET /api/v1/budget-tracking/{budget_id}**
- **Response 200:**
```json
{
  "month": "2024-01",
  "total_budget": 4950.00,
  "total_spent": 2345.00,
  "percentage_spent": 47.4,
  "by_category": {
    "mercado": {"cap": 800.00, "spent": 450.00, "percentage": 56.3},
    "delivery": {"cap": 120.00, "spent": 80.00, "percentage": 66.7}
  },
  "alerts": [
    "Você gastou 66.7% do orçamento de delivery"
  ]
}
```

---

### 📊 Métricas de Sucesso do Dia 9

1. **Taxa de Conclusão:** % que completa Dia 9
2. **Distribuição de Balanço:**
   - % com sobra positiva
   - % com sobra marginal (0-10% da renda)
   - % com déficit
3. **Déficit Médio:** Valor médio de déficit entre usuários com déficit
4. **Taxa de Ajuste:** % que usa o simulador de ajustes para equilibrar orçamento
5. **Tetos Variáveis Definidos:** Média de categorias variáveis com teto definido
6. **Alocação de Sobra:** % que aloca sobra para caixinha vs dívidas vs qualidade de vida
7. **Comprometimento:** % que escreve frase de compromisso
8. **Evolução do Termômetro:** Dia 8 vs Dia 9

---


---

## **DIA 10 — Mapa de Negociação**

### 🎯 Título
**Mapa de Negociação: Prepare-se para Renegociar Suas Dívidas com Estratégia**

### 🌅 Mensagem Matinal
Negociar dívidas não é humilhação — é inteligência financeira. As instituições financeiras preferem receber algo a não receber nada, e você tem mais poder do que imagina. Hoje você vai construir seu mapa de negociação: identificar cada dívida, calcular quanto pode pagar, definir objetivos claros e preparar roteiros de contato. Quando você entra numa negociação com estratégia, as chances de fechar um acordo justo aumentam exponencialmente.

### 📚 Conceito FIRE do Dia
**Preparação é metade da vitória.** No FIRE, não se entra em nenhuma batalha financeira sem planejamento. Saber exatamente quanto você deve, para quem, a que taxa de juros e quanto pode pagar mensalmente te coloca em posição de força. Os credores têm interesse em fechar acordos porque dívida em atraso gera custo de cobrança. Use isso a seu favor: proponha valores realistas baseados no seu orçamento mínimo e nunca aceite condições que te façam voltar ao ciclo de endividamento.

### ✅ Seu Desafio Hoje
Criar um mapa completo de todas as suas dívidas, definir objetivos de negociação para cada uma e preparar roteiros de contato para iniciar as conversas com credores.

### 🎯 SUA TAREFA PRÁTICA

#### **Experiência do Usuário (UX/UI)**

**Tela de Introdução do Dia 10**
- **Header:** "Dia 10 — Mapa de Negociação"
- **Barra de progresso:** 0% → 100%
- **Card motivacional:** "Você tem mais poder de negociação do que imagina. Credores preferem receber algo a não receber nada."
- **Badges:** Tempo estimado (25-35 min) | Requer (Dados dos Dias 2, 8, 9)
- **CTA:** "Criar Meu Mapa de Negociação"

**Fluxo Principal (5 Passos)**

**PASSO 1: Consolidar Dívidas**

- **Título:** "Suas dívidas em um só lugar"
- **Subtítulo:** "Vamos organizar tudo que você deve para negociar com clareza"

**Pré-carregamento Automático:**

App puxa automaticamente:
- **Do Dia 2 (Raio-X):** Tabela `debts` com todas as dívidas cadastradas
- **Do Dia 8 (Prioridades):** Classificações e consequências

**Componente: Lista de Dívidas para Negociação**

| Credor | Tipo | Valor Total | Taxa Juros | Parcela Atual | Status | Prioridade |
|--------|------|-------------|------------|---------------|--------|------------|
| Banco ABC | Cartão | R$ 5.000 | 12.5%/mês | R$ 450 | Atrasada | 🔴 Alta |
| Financeira XYZ | Empréstimo | R$ 8.000 | 8%/mês | R$ 600 | Em dia | 🟡 Média |
| Loja 123 | Parcelamento | R$ 1.200 | 3%/mês | R$ 150 | Atrasada | 🟢 Baixa |

**Para cada dívida, exibe:**
- Nome do credor (editável)
- Tipo de dívida (dropdown: Cartão/Empréstimo/Financiamento/Cheque especial/Outro)
- Valor total atualizado (input R$)
- Taxa de juros ao mês (input %)
- Valor da parcela atual (input R$)
- Status (Radio: Em dia / Atrasada / Negativada)
- Tempo de atraso (se atrasada): dropdown (1-3 meses / 3-6 meses / 6-12 meses / +12 meses)
- Prioridade (pré-preenchida do Dia 8, editável)

**Cálculos automáticos:**
- **Custo mensal de juros:** `valor_total * taxa_juros`
- **Projeção em 12 meses sem negociar:** `valor_total * (1 + taxa_juros)^12`

**Card de Alerta:**
```
⚠️ Se você não negociar, suas dívidas podem custar:
• Hoje: R$ 14.200
• Em 12 meses: R$ 42.800 (crescimento de 201%)
```

**Rodapé:**
- Botão "+ Adicionar Nova Dívida" (se esqueceu alguma)
- Botão "Próximo Passo"

---

**PASSO 2: Quanto Posso Pagar?**

- **Título:** "Defina seu limite de pagamento mensal"
- **Subtítulo:** "Baseado no seu orçamento mínimo, quanto você pode destinar às dívidas?"

**Pré-carregamento do Dia 9:**

```
┌────────────────────────────────────────┐
│ SEU ORÇAMENTO MÍNIMO (Dia 9)           │
│                                        │
│ Renda Total:            R$ 3.500,00    │
│ Despesas Essenciais:    R$ 3.650,00    │
│ Tetos Variáveis:        R$ 1.300,00    │
│ ────────────────────────────────       │
│ Sobra/Falta:            R$ -1.450,00   │
└────────────────────────────────────────┘
```

**Cenário A: Sobra Positiva**

Se `balance` > 0:
- **Valor disponível para dívidas extras:** R$ X
- Slider: "Quanto dessa sobra você quer destinar para negociação?"
  - Mínimo: R$ 0
  - Máximo: valor da sobra
  - Sugestão: 50-70% da sobra

**Cenário B: Déficit (mais comum)**

Se `balance` < 0:
```
⚠️ Seu orçamento está no vermelho (R$ -1.450)
Você precisa REDUZIR despesas ou RENEGOCIAR para liberar dinheiro.

Opções:
1. Negociar despesas fixas (reduzir parcelas)
2. Pausar dívidas não essenciais
3. Buscar renda extra temporária
```

**Pergunta:** "Com ajustes, quanto você consegue destinar para dívidas mensalmente?"
- Input R$ (valor que o usuário define)
- Helper: "Seja realista. Prometer mais do que pode leva a novos atrasos."

**Campo:** "Você tem algum valor para entrada/quitação à vista?"
- Toggle: "Tenho dinheiro para entrada"
- Se sim: Input R$ (valor disponível para entrada)
- Helper: "Credores costumam dar descontos de 30-70% para quitação à vista"

**Rodapé:**
- Resumo: "Valor mensal para dívidas: R$ X | Entrada disponível: R$ Y"
- Botão "Próximo Passo"

---

**PASSO 3: Objetivos de Negociação**

- **Título:** "Defina o que você quer conquistar em cada negociação"
- **Subtítulo:** "Objetivos claros aumentam suas chances de sucesso"

**Para cada dívida, definir:**

**Card de Negociação - [Nome do Credor]**

**Objetivo principal:** (Dropdown)
- Desconto para quitação à vista
- Reduzir taxa de juros
- Alongar prazo (diminuir parcela)
- Pausar cobrança temporariamente
- Parcelar dívida com juros menores

**Valor máximo aceitável por mês:** R$ ___
- Validação: Não pode exceder o valor definido no Passo 2 dividido pelo número de dívidas prioritárias
- Alerta se exceder: "⚠️ Este valor compromete mais de X% do seu limite"

**Prazo máximo aceitável:** ___ meses
- Dropdown: 6 / 12 / 18 / 24 / 36 / 48 meses
- Helper: "Quanto mais longo, menor a parcela, mas maior o custo total"

**Desconto mínimo aceitável (se quitação à vista):** ___ %
- Slider: 20% ← → 80%
- Helper: "Dívidas antigas costumam ter descontos de 50-80%"

**Limites inegociáveis:**
- Checkbox: "Não aceito seguro/proteção embutidos"
- Checkbox: "Não aceito taxa de abertura de crédito"
- Checkbox: "Não aceito parcelamento acima de X meses"
- Checkbox: "Não aceito parcela acima de R$ Y"

**Simulação automática:**

```
Se negociar esta dívida:
• Valor atual: R$ 5.000 (12.5% juros/mês)
• Com desconto de 50% à vista: R$ 2.500 ✅
• Parcelado em 12x com juros de 2%: R$ 4.800 (R$ 400/mês)
• Parcelado em 24x com juros de 2%: R$ 5.200 (R$ 217/mês)

💡 Economia potencial: até R$ 2.500
```

**Rodapé:**
- Botão "Próximo Passo"

---

**PASSO 4: Roteiro de Contato**

- **Título:** "Prepare seus scripts de negociação"
- **Subtítulo:** "Ter um roteiro pronto evita nervosismo e aumenta sua confiança"

**Para cada dívida, gerar:**

**Informações de Contato:**
- Telefone do credor: Input (ou "Buscar" se integração disponível)
- E-mail de contato: Input
- Horário de funcionamento: Input (ex: 8h-18h)
- Canal preferido: Radio (Telefone / E-mail / Chat / WhatsApp / Presencial)

**Script Sugerido (editável):**

```
┌─────────────────────────────────────────────────────────────┐
│ ROTEIRO DE NEGOCIAÇÃO - [Banco ABC]                         │
├─────────────────────────────────────────────────────────────┤
│ 1. ABERTURA                                                 │
│ "Bom dia, meu nome é [Seu Nome], CPF [XXX.XXX.XXX-XX].     │
│ Gostaria de falar sobre a renegociação da minha dívida     │
│ de cartão de crédito."                                      │
│                                                             │
│ 2. CONTEXTO                                                 │
│ "Passei por dificuldades financeiras nos últimos meses,    │
│ mas agora reorganizei meu orçamento e quero regularizar    │
│ minha situação."                                            │
│                                                             │
│ 3. PROPOSTA                                                 │
│ "Consigo pagar R$ [VALOR] por mês, ou R$ [ENTRADA] à       │
│ vista para quitação total. Qual a melhor condição que      │
│ vocês podem oferecer?"                                      │
│                                                             │
│ 4. PERGUNTAS ESSENCIAIS                                     │
│ - Qual o valor total com desconto?                         │
│ - Qual a taxa de juros do parcelamento?                    │
│ - Há tarifa de renegociação ou seguro embutido?            │
│ - Posso receber a proposta por escrito?                    │
│                                                             │
│ 5. FECHAMENTO                                               │
│ "Preciso receber a proposta por e-mail para analisar.      │
│ Posso retornar em 24 horas com minha decisão."             │
└─────────────────────────────────────────────────────────────┘
```

**Botões de ação:**
- "Copiar Script"
- "Editar Script"
- "Salvar como PDF"

**Dicas de Negociação:**
- 💡 "Nunca aceite a primeira proposta"
- 💡 "Peça sempre por escrito antes de aceitar"
- 💡 "Se disserem 'não pode reduzir', peça para falar com supervisor"
- 💡 "Mencione que está organizando suas finanças - isso mostra boa-fé"

**Rodapé:**
- Botão "Próximo Passo"

---

**PASSO 5: Agendar Negociações**

- **Título:** "Monte sua agenda de contatos"
- **Subtítulo:** "Defina quando vai fazer cada ligação/contato"

**Componente: Calendário de Negociações**

**Para cada dívida:**
- Data do contato: Date picker
- Horário: Time picker
- Lembrete: Toggle (ativo por padrão)
- Canais de lembrete: Checkboxes (Push / WhatsApp / E-mail)

**Sugestão automática:**
```
💡 Recomendamos:
• Começar pelas dívidas de maior juros
• Fazer 1-2 contatos por dia (evita esgotamento)
• Ligar pela manhã (atendentes menos cansados)
• Evitar segundas e sextas (maior volume de ligações)
```

**Agenda Gerada:**

| Data | Horário | Credor | Objetivo | Status |
|------|---------|--------|----------|--------|
| 15/01 | 10:00 | Banco ABC | Desconto à vista | 📅 Agendado |
| 16/01 | 14:00 | Financeira XYZ | Reduzir juros | 📅 Agendado |
| 17/01 | 09:30 | Loja 123 | Parcelar | 📅 Agendado |

**Rodapé:**
- **Atualização do Termômetro "Respirar":**
  - "Após preparar seu mapa de negociação, como você se sente?"
  - Slider 0-10 + justificativa

**Botões:**
- "Salvar Rascunho"
- "Concluir Dia 10" (gera mapa e agenda de negociações)

---

**Tela de Conclusão do Dia 10:**

```
🎉 Dia 10 Concluído!

Seu Mapa de Negociação está pronto:
• X dívidas mapeadas
• Valor total: R$ Y
• Limite mensal para pagamento: R$ Z
• Próximo contato: [Data] - [Credor]

💪 Você está preparado para negociar!
Amanhã vamos estudar técnicas de negociação.

Próximo: Dia 11 - Estudar Negociação
```

---

### 🗄️ Infraestrutura (Backend + Fluxo de Dados)

#### **Tabelas do Banco de Dados**

**44. Tabela: `negotiation_plan`** (plano de negociação)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do plano |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `debt_id` | UUID | FOREIGN KEY → debts(id) | Dívida relacionada |
| `objective` | VARCHAR(50) | NOT NULL | 'discount_lump_sum' / 'reduce_interest' / 'extend_term' / 'pause' / 'installment' |
| `max_monthly_payment` | DECIMAL(10,2) | NOT NULL | Valor máximo aceitável por mês |
| `max_term_months` | INTEGER | NULLABLE | Prazo máximo aceitável |
| `min_discount_percent` | DECIMAL(5,2) | NULLABLE | Desconto mínimo aceitável (%) |
| `lump_sum_available` | DECIMAL(10,2) | DEFAULT 0 | Valor disponível para entrada/quitação |
| `no_insurance` | BOOLEAN | DEFAULT TRUE | Não aceita seguro embutido |
| `no_fees` | BOOLEAN | DEFAULT TRUE | Não aceita taxas extras |
| `max_term_limit` | INTEGER | NULLABLE | Limite máximo de parcelas |
| `max_payment_limit` | DECIMAL(10,2) | NULLABLE | Limite máximo de parcela |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

**45. Tabela: `contact_scripts`** (roteiros de contato)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do script |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `debt_id` | UUID | FOREIGN KEY → debts(id) | Dívida relacionada |
| `creditor_phone` | VARCHAR(20) | NULLABLE | Telefone do credor |
| `creditor_email` | VARCHAR(100) | NULLABLE | E-mail do credor |
| `business_hours` | VARCHAR(50) | NULLABLE | Horário de funcionamento |
| `preferred_channel` | VARCHAR(20) | NOT NULL | 'phone' / 'email' / 'chat' / 'whatsapp' / 'in_person' |
| `script_text` | TEXT | NOT NULL | Texto do roteiro |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

**46. Tabela: `negotiation_schedule`** (agenda de negociações)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do agendamento |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `debt_id` | UUID | FOREIGN KEY → debts(id) | Dívida relacionada |
| `scheduled_date` | DATE | NOT NULL | Data do contato |
| `scheduled_time` | TIME | NOT NULL | Horário do contato |
| `reminder_enabled` | BOOLEAN | DEFAULT TRUE | Lembrete ativo |
| `reminder_channels` | JSONB | DEFAULT '["push"]' | Canais de lembrete |
| `status` | VARCHAR(20) | DEFAULT 'scheduled' | 'scheduled' / 'completed' / 'rescheduled' / 'cancelled' |
| `notes` | TEXT | NULLABLE | Observações |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

---

#### **Regras de Negócio**

1. **Pré-carregamento de Dívidas (Dias 2, 8 → Dia 10):**
   ```sql
   SELECT 
     d.*,
     co.classification,
     co.consequence
   FROM debts d
   LEFT JOIN classified_obligations co ON d.id = co.obligation_id
   WHERE d.user_id = ?
   ORDER BY d.interest_rate DESC, co.classification ASC
   ```

2. **Cálculo de Projeção de Dívidas:**
   ```python
   def calcular_projecao_divida(valor_atual, taxa_juros_mensal, meses):
       return valor_atual * ((1 + taxa_juros_mensal/100) ** meses)
   
   # Exemplo: R$ 5.000 a 12.5%/mês por 12 meses
   # = 5000 * (1.125)^12 = R$ 21.354,42
   ```

3. **Validação de Limite Mensal:**
   ```python
   def validar_limite_mensal(valor_proposto, limite_total, num_dividas_prioritarias):
       limite_por_divida = limite_total / num_dividas_prioritarias
       
       if valor_proposto > limite_por_divida * 1.2:  # 20% de tolerância
           return {
               'valid': False,
               'message': f'Este valor compromete mais de {(valor_proposto/limite_total)*100:.0f}% do seu limite'
           }
       return {'valid': True}
   ```

4. **Geração Automática de Scripts:**
   ```python
   def gerar_script_negociacao(user, debt, plan):
       template = """
       1. ABERTURA
       "Bom dia, meu nome é {nome}, CPF {cpf}.
       Gostaria de falar sobre a renegociação da minha dívida
       de {tipo_divida}."
       
       2. CONTEXTO
       "Passei por dificuldades financeiras nos últimos meses,
       mas agora reorganizei meu orçamento e quero regularizar
       minha situação."
       
       3. PROPOSTA
       "Consigo pagar R$ {valor_mensal} por mês, ou R$ {entrada} à
       vista para quitação total. Qual a melhor condição que
       vocês podem oferecer?"
       
       4. PERGUNTAS ESSENCIAIS
       - Qual o valor total com desconto?
       - Qual a taxa de juros do parcelamento?
       - Há tarifa de renegociação ou seguro embutido?
       - Posso receber a proposta por escrito?
       
       5. FECHAMENTO
       "Preciso receber a proposta por e-mail para analisar.
       Posso retornar em 24 horas com minha decisão."
       """
       
       return template.format(
           nome=user.name,
           cpf=user.cpf,
           tipo_divida=debt.debt_type,
           valor_mensal=plan.max_monthly_payment,
           entrada=plan.lump_sum_available
       )
   ```

5. **Simulação de Cenários:**
   ```python
   def simular_cenarios_negociacao(debt, plan):
       cenarios = []
       
       # Cenário 1: Quitação à vista com desconto
       if plan.lump_sum_available > 0:
           for desconto in [0.3, 0.5, 0.7]:
               valor_quitacao = debt.total_amount * (1 - desconto)
               if valor_quitacao <= plan.lump_sum_available:
                   cenarios.append({
                       'tipo': 'quitacao_vista',
                       'desconto': desconto * 100,
                       'valor': valor_quitacao,
                       'economia': debt.total_amount - valor_quitacao,
                       'viavel': True
                   })
       
       # Cenário 2: Parcelamento com juros reduzidos
       for juros_novo in [0.02, 0.03, 0.05]:
           for prazo in [12, 24, 36]:
               parcela = debt.total_amount * (juros_novo * (1 + juros_novo)**prazo) / ((1 + juros_novo)**prazo - 1)
               cenarios.append({
                   'tipo': 'parcelamento',
                   'juros': juros_novo * 100,
                   'prazo': prazo,
                   'parcela': parcela,
                   'valor_total': parcela * prazo,
                   'viavel': parcela <= plan.max_monthly_payment
               })
       
       return cenarios
   ```

---

#### **Outputs do App (Documentos Gerados)**

1. **Mapa de Negociação** (PDF/Visualização)
   - Lista de todas as dívidas com prioridades
   - Objetivos de negociação para cada uma
   - Valor limite mensal e entrada disponível
   - Simulações de cenários possíveis

2. **Scripts de Negociação** (PDF/Texto copiável)
   - Roteiro completo para cada credor
   - Perguntas essenciais a fazer
   - Limites inegociáveis destacados

3. **Agenda de Negociações** (Calendário/Lista)
   - Data e horário de cada contato
   - Credor e objetivo
   - Lembretes configurados

---

#### **Fluxo de Integração com Dias Futuros**

**Dados do Dia 10 que serão reutilizados:**

- **Dia 11 (Estudar Negociação):**
  - Scripts do Dia 10 (`contact_scripts.script_text`) serão revisados e aprimorados
  - Perguntas essenciais serão praticadas

- **Dia 12 (Fechar Acordo):**
  - `negotiation_schedule` define a ordem dos contatos
  - `negotiation_plan` com limites serve para validar propostas recebidas
  - Scripts prontos para uso imediato

- **Dia 14 (Plano 30/90):**
  - Dívidas prioritárias do Dia 10 alimentam "Plano 30 - Dívidas foco"
  - Valores máximos de parcela entram no cálculo de viabilidade

- **Dia 15 (Formatura):**
  - Status das negociações (iniciadas, pendentes, concluídas) aparece no painel de progresso

---

#### **Endpoints da API (Backend)**

**POST /api/v1/negotiation-map**
- **Payload:**
```json
{
  "user_id": "uuid",
  "monthly_limit": 500.00,
  "lump_sum_available": 2500.00,
  "plans": [
    {
      "debt_id": "uuid",
      "objective": "discount_lump_sum",
      "max_monthly_payment": 300.00,
      "min_discount_percent": 50,
      "no_insurance": true,
      "no_fees": true
    }
  ],
  "scripts": [
    {
      "debt_id": "uuid",
      "creditor_phone": "(11) 3333-4444",
      "creditor_email": "cobranca@banco.com",
      "preferred_channel": "phone",
      "script_text": "..."
    }
  ],
  "schedule": [
    {
      "debt_id": "uuid",
      "scheduled_date": "2024-01-15",
      "scheduled_time": "10:00",
      "reminder_enabled": true,
      "reminder_channels": ["push", "whatsapp"]
    }
  ]
}
```

- **Response 201:**
```json
{
  "success": true,
  "message": "Mapa de negociação criado com sucesso!",
  "data": {
    "total_debts": 3,
    "total_debt_amount": 14200.00,
    "potential_savings": 7100.00,
    "next_contact": {
      "date": "2024-01-15",
      "time": "10:00",
      "creditor": "Banco ABC"
    }
  }
}
```

**GET /api/v1/simulate-negotiation/{debt_id}**
- **Query params:** `lump_sum`, `max_monthly`, `max_term`
- **Response 200:**
```json
{
  "debt_id": "uuid",
  "current_value": 5000.00,
  "scenarios": [
    {
      "type": "lump_sum",
      "discount": 50,
      "value": 2500.00,
      "savings": 2500.00,
      "viable": true
    },
    {
      "type": "installment",
      "interest": 2,
      "term": 12,
      "monthly_payment": 470.00,
      "total": 5640.00,
      "viable": true
    }
  ]
}
```

---

### 📊 Métricas de Sucesso do Dia 10

1. **Taxa de Conclusão:** % que completa Dia 10
2. **Dívidas Mapeadas:** Média de dívidas por usuário
3. **Valor Total Mapeado:** Média do valor total de dívidas
4. **Objetivos Definidos:** % de dívidas com objetivo de negociação claro
5. **Scripts Gerados:** % que personaliza os scripts vs usa padrão
6. **Agendamentos Criados:** Média de contatos agendados
7. **Economia Potencial:** Média da economia projetada com negociações
8. **Evolução do Termômetro:** Dia 9 vs Dia 10

---

---

## **DIA 11 — Estudar Negociação**

### 🎯 Título
**Estudo de Negociação: Afie Suas Habilidades Antes de Entrar em Ação**

### 🌅 Mensagem Matinal
Negociar é uma habilidade que pode ser aprendida. Você já preparou seu mapa; agora é hora de afiar o discurso. Conhecer seus direitos como consumidor, saber como os credores pensam e treinar como responder a contrapropostas evita armadilhas e aumenta sua confiança. Hoje você vai ler, assistir e praticar. Quanto mais preparado você estiver, menor a chance de aceitar condições ruins ou sair sem nenhuma proposta.

### 📚 Conceito FIRE do Dia
**Preparação é metade do sucesso.** Na filosofia FIRE, não se faz nada no escuro. Estudar negociação significa compreender legislação básica (Código de Defesa do Consumidor, renegociação de dívidas, portabilidade de crédito), entender os incentivos dos credores e treinar a comunicação. Ter um script ajuda a manter a calma e a objetividade. Lembre-se: seu objetivo é chegar a um acordo que caiba no seu orçamento mínimo e elimine juros caros. Se a proposta não atende a esses critérios, é melhor esperar outra oportunidade.

### ✅ Seu Desafio Hoje
Estudar técnicas de negociação, revisar seus scripts, praticar respostas para perguntas comuns e se preparar mentalmente para as conversas com credores.

### 🎯 SUA TAREFA PRÁTICA

#### **Experiência do Usuário (UX/UI)**

**Tela de Introdução do Dia 11**
- **Header:** "Dia 11 — Estudar Negociação"
- **Barra de progresso:** 0% → 100%
- **Card motivacional:** "Conhecimento é poder. Credores treinados tentarão te pressionar. Você precisa estar preparado."
- **Badges:** Tempo estimado (20-30 min) | Requer (Scripts do Dia 10)
- **CTA:** "Começar Meu Treinamento"

**Fluxo Principal (5 Passos)**

**PASSO 1: Materiais de Estudo**

- **Título:** "Aprenda sobre negociação de dívidas"
- **Subtítulo:** "Conteúdos selecionados para você dominar o assunto"

**Componente: Biblioteca de Conteúdo**

**Vídeos (10-15 min cada):**
- 🎬 "Como negociar dívidas: guia completo" (link externo ou embeddado)
- 🎬 "Seus direitos na renegociação de dívidas" (CDC explicado)
- 🎬 "O que os bancos não querem que você saiba sobre negociação"

**Artigos Curtos:**
- 📄 "Taxas de juros médias no Brasil: quanto você está pagando a mais?"
- 📄 "Diferença entre renegociação e refinanciamento"
- 📄 "Portabilidade de crédito: como usar a seu favor"
- 📄 "Feirão Limpa Nome: vale a pena?"

**Checklist de Direitos do Consumidor:**
```
✅ Você tem direito a informações claras sobre valores, juros e prazos
✅ Você pode recusar vendas casadas (seguros, proteções)
✅ Você pode pedir proposta por escrito antes de aceitar
✅ Você pode solicitar prazo de 24-48h para decidir
✅ Você pode questionar cobranças abusivas
✅ Você pode gravar ligações (avisando antes)
✅ Você pode negociar mesmo após negativação
```

**Progresso de estudo:**
- Checkboxes para marcar conteúdos consumidos
- Barra de progresso: "Você estudou X de Y conteúdos"

**Rodapé:**
- Botão "Próximo Passo"

---

**PASSO 2: Revisar e Aprimorar Scripts**

- **Título:** "Revise seus roteiros de negociação"
- **Subtítulo:** "Ajuste a linguagem para ficar clara, assertiva e respeitosa"

**Pré-carregamento do Dia 10:**
- Todos os scripts de `contact_scripts` são carregados

**Editor de Scripts:**

Para cada script:
- **Área de texto editável** com o script completo
- **Destaque de campos-chave:**
  - 🟢 Saudação
  - 🟡 Proposta (valores)
  - 🔴 Limites inegociáveis
  - 🟣 Conclusão

**Sugestões de Melhoria:**
```
💡 Dicas para um script eficaz:
• Use frases que mostram boa-fé:
  - "Quero regularizar minha situação"
  - "Preciso de condições sustentáveis"
  - "Estou reorganizando minhas finanças"
  
• Evite frases que enfraquecem sua posição:
  - "Estou desesperado" ❌
  - "Não tenho dinheiro nenhum" ❌
  - "Aceito qualquer coisa" ❌

• Seja firme mas educado:
  - "Esse valor não cabe no meu orçamento"
  - "Preciso de uma condição melhor para aceitar"
  - "Posso esperar outra oportunidade se necessário"
```

**Botões:**
- "Salvar Alterações"
- "Restaurar Original"
- "Comparar Versões"

**Rodapé:**
- Botão "Próximo Passo"

---

**PASSO 3: Simulador de Conversa**

- **Título:** "Pratique sua negociação"
- **Subtítulo:** "Treine respostas para perguntas comuns de credores"

**Componente: Chat Simulado**

Interface de chat que simula conversa com atendente de cobrança:

**Cenário 1: Perguntas Comuns**

```
🤖 Atendente: "Por que você atrasou os pagamentos?"

Sua resposta: [Campo de texto livre]

💡 Sugestão: "Passei por dificuldades financeiras temporárias,
mas agora reorganizei meu orçamento e quero regularizar
minha situação."
```

```
🤖 Atendente: "Quanto você pode pagar por mês?"

Sua resposta: [Campo de texto livre]

💡 Sugestão: Nunca diga o valor máximo de cara.
Comece oferecendo 60-70% do seu limite real.
Ex: Se pode pagar R$ 500, ofereça R$ 300-350.
```

```
🤖 Atendente: "Você tem alguma garantia para oferecer?"

Sua resposta: [Campo de texto livre]

💡 Sugestão: "Minha garantia é o compromisso de regularizar
a situação. Estou disposto a assinar um acordo formal
com valores que consigo cumprir."
```

**Cenário 2: Contrapropostas**

```
🤖 Atendente: "O melhor que posso fazer é R$ 800/mês em 12x."

[Seu limite é R$ 500/mês]

O que você faz?
○ Aceito a proposta
○ Recuso e proponho R$ 500
○ Peço para falar com supervisor
○ Peço prazo para pensar
```

**Cenário 3: Pressão do Atendente**

```
🤖 Atendente: "Essa proposta é só para hoje. Se não fechar
agora, perde a condição."

O que você faz?
○ Aceito por medo de perder
○ Digo que preciso analisar com calma
○ Peço a proposta por escrito
○ Agradeço e encerro a ligação
```

**Feedback Automático:**
- ✅ "Ótima resposta! Você manteve a calma e foi assertivo."
- ⚠️ "Cuidado! Aceitar pressão pode te levar a um acordo ruim."
- 💡 "Dica: Pedir proposta por escrito te dá tempo para pensar."

**Rodapé:**
- Botão "Próximo Passo"

---

**PASSO 4: Lista de Perguntas Essenciais**

- **Título:** "Prepare suas perguntas para os credores"
- **Subtítulo:** "Ter perguntas prontas evita esquecimentos e armadilhas"

**Componente: Checklist de Perguntas**

**Perguntas Obrigatórias:**
- ☐ Qual o valor total da dívida atualizada?
- ☐ Qual o desconto para quitação à vista?
- ☐ Qual a taxa de juros do parcelamento?
- ☐ Há tarifa de renegociação ou taxa de abertura?
- ☐ Há seguro ou proteção embutidos no acordo?
- ☐ Posso quitar antecipadamente sem multa?
- ☐ Vocês podem enviar a proposta por escrito?

**Perguntas Adicionais (sugeridas):**
- ☐ O acordo limpa meu nome em quanto tempo?
- ☐ Posso pagar via PIX/boleto/débito?
- ☐ Qual a data de vencimento das parcelas?
- ☐ O que acontece se eu atrasar uma parcela?

**Campo para perguntas personalizadas:**
- "+ Adicionar Pergunta"
- Lista editável de perguntas do usuário

**Rodapé:**
- Botão "Próximo Passo"

---

**PASSO 5: Preparação Mental**

- **Título:** "Prepare-se emocionalmente"
- **Subtítulo:** "Negociar dívidas pode ser estressante. Cuide de você."

**Exercício de Visualização:**
```
Feche os olhos por 1 minuto e visualize:
1. Você fazendo a ligação com calma
2. O atendente fazendo perguntas e você respondendo com segurança
3. Você recusando uma proposta ruim sem culpa
4. Você fechando um acordo justo e sentindo alívio
```

**Afirmações Positivas:**
```
Repita mentalmente antes de cada ligação:
• "Eu tenho o direito de negociar"
• "Não vou aceitar condições que me prejudiquem"
• "Estou no controle da minha vida financeira"
• "Cada negociação é uma chance de recomeçar"
```

**Plano de Contingência:**
- **Se eu ficar nervoso:** Peço um momento, respiro fundo, retomo
- **Se a proposta for muito ruim:** Agradeço e encerro a ligação
- **Se me sentirem pressionado:** Peço prazo de 24h para decidir
- **Se perder a paciência:** Encerro educadamente e reagendo outro dia

**Campo de Compromisso:**
- "Como você vai se preparar antes das ligações?"
- Textarea (máx. 200 chars)

---

**Tela Final: Resumo do Dia 11**

**Card de Progresso:**
```
✅ Conteúdos estudados: X de Y
✅ Scripts revisados: X de Y
✅ Simulações praticadas: X cenários
✅ Perguntas preparadas: X itens
```

**Atualização do Termômetro "Respirar":**
- "Após estudar e praticar, como você se sente para negociar?"
- Slider 0-10 + justificativa

**Botões:**
- "Salvar Rascunho"
- "Concluir Dia 11"

---

**Tela de Conclusão do Dia 11:**

```
🎉 Dia 11 Concluído!

Você está preparado para negociar:
✅ Estudou técnicas e direitos
✅ Revisou seus scripts
✅ Praticou respostas para pressões
✅ Preparou perguntas essenciais

Amanhã é dia de ação: você vai fazer
os contatos e fechar acordos!

💪 Lembre-se: você tem mais poder
do que imagina.

Próximo: Dia 12 - Fechar Acordo Sem Se Enrolar
```

---

### 🗄️ Infraestrutura (Backend + Fluxo de Dados)

#### **Tabelas do Banco de Dados**

**47. Tabela: `learning_resources`** (recursos de aprendizado)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do recurso |
| `title` | VARCHAR(255) | NOT NULL | Título do conteúdo |
| `type` | VARCHAR(20) | NOT NULL | 'video' / 'article' / 'checklist' |
| `url` | VARCHAR(500) | NULLABLE | Link externo (se aplicável) |
| `content` | TEXT | NULLABLE | Conteúdo inline (se artigo) |
| `duration_minutes` | INTEGER | NULLABLE | Duração estimada |
| `order_index` | INTEGER | NOT NULL | Ordem de exibição |
| `is_active` | BOOLEAN | DEFAULT TRUE | Se está ativo |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**48. Tabela: `user_learning_progress`** (progresso de estudo)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do progresso |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `resource_id` | UUID | FOREIGN KEY → learning_resources(id) | Recurso |
| `completed` | BOOLEAN | DEFAULT FALSE | Se concluiu |
| `completed_at` | TIMESTAMP | NULLABLE | Data de conclusão |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**Constraint:** UNIQUE(user_id, resource_id)

**49. Tabela: `practice_sessions`** (sessões de prática)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da sessão |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `scenario_type` | VARCHAR(50) | NOT NULL | 'common_questions' / 'counterproposal' / 'pressure' |
| `responses` | JSONB | NOT NULL | Array de respostas do usuário |
| `feedback` | JSONB | NULLABLE | Feedback gerado |
| `score` | INTEGER | NULLABLE | Pontuação (0-100) |
| `completed_at` | TIMESTAMP | DEFAULT NOW() | Data de conclusão |

**50. Tabela: `negotiation_questions`** (perguntas para negociação)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da pergunta |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `question_text` | VARCHAR(255) | NOT NULL | Texto da pergunta |
| `is_mandatory` | BOOLEAN | DEFAULT FALSE | Se é obrigatória |
| `is_custom` | BOOLEAN | DEFAULT FALSE | Se foi criada pelo usuário |
| `checked` | BOOLEAN | DEFAULT FALSE | Se está marcada para usar |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**51. Tabela: `script_versions`** (versões de scripts)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da versão |
| `script_id` | UUID | FOREIGN KEY → contact_scripts(id) | Script original |
| `version_number` | INTEGER | NOT NULL | Número da versão |
| `script_text` | TEXT | NOT NULL | Texto da versão |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

---

#### **Regras de Negócio**

1. **Progresso de Estudo:**
   ```sql
   SELECT 
     COUNT(*) as total,
     SUM(CASE WHEN completed THEN 1 ELSE 0 END) as completed,
     (SUM(CASE WHEN completed THEN 1 ELSE 0 END)::float / COUNT(*)) * 100 as percentage
   FROM user_learning_progress
   WHERE user_id = ?
   ```

2. **Simulador de Conversa (IA simplificada):**
   ```python
   def avaliar_resposta(pergunta, resposta, contexto):
       # Palavras positivas aumentam score
       positivas = ['regularizar', 'sustentável', 'organizado', 'compromisso', 'acordo']
       # Palavras negativas diminuem score
       negativas = ['desesperado', 'aceito qualquer', 'não tenho nada', 'urgente']
       
       score = 50  # Base
       
       for palavra in positivas:
           if palavra.lower() in resposta.lower():
               score += 10
       
       for palavra in negativas:
           if palavra.lower() in resposta.lower():
               score -= 15
       
       if len(resposta) < 20:
           score -= 10  # Resposta muito curta
       
       return min(100, max(0, score))
   ```

3. **Versionamento de Scripts:**
   ```sql
   -- Ao salvar nova versão
   INSERT INTO script_versions (script_id, version_number, script_text)
   SELECT 
     id,
     (SELECT COALESCE(MAX(version_number), 0) + 1 FROM script_versions WHERE script_id = ?),
     ?
   FROM contact_scripts
   WHERE id = ?;
   
   -- Atualizar script atual
   UPDATE contact_scripts
   SET script_text = ?, updated_at = NOW()
   WHERE id = ?;
   ```

---

#### **Outputs do App (Documentos Gerados)**

1. **Script Final de Negociação** (PDF/Texto)
   - Versão revisada e aprimorada
   - Destaques visuais para campos-chave
   - Pronto para uso durante ligações

2. **Lista de Perguntas Essenciais** (PDF/Checklist)
   - Perguntas obrigatórias
   - Perguntas personalizadas
   - Espaço para anotar respostas

3. **Relatório de Prática** (opcional)
   - Cenários praticados
   - Pontuação por cenário
   - Pontos fortes e a melhorar

---

#### **Endpoints da API (Backend)**

**GET /api/v1/learning-resources**
- **Response 200:**
```json
{
  "resources": [
    {
      "id": "uuid",
      "title": "Como negociar dívidas: guia completo",
      "type": "video",
      "url": "https://...",
      "duration_minutes": 12,
      "completed": false
    }
  ],
  "progress": {
    "total": 10,
    "completed": 3,
    "percentage": 30
  }
}
```

**POST /api/v1/practice-session**
- **Payload:**
```json
{
  "user_id": "uuid",
  "scenario_type": "counterproposal",
  "responses": [
    {
      "question": "O melhor que posso fazer é R$ 800/mês",
      "answer": "Agradeço a proposta, mas esse valor não cabe no meu orçamento. Posso pagar R$ 500/mês. Há alguma forma de ajustar?",
      "choice": "negotiate_lower"
    }
  ]
}
```

**PUT /api/v1/contact-scripts/{id}**
- **Payload:**
```json
{
  "script_text": "...",
  "create_version": true
}
```

---

### 📊 Métricas de Sucesso do Dia 11

1. **Taxa de Conclusão:** % que completa Dia 11
2. **Conteúdos Consumidos:** Média de recursos estudados
3. **Scripts Revisados:** % que edita os scripts
4. **Simulações Completadas:** Média de cenários praticados
5. **Pontuação Média nas Simulações:** Score médio das respostas
6. **Perguntas Preparadas:** Média de perguntas na lista
7. **Evolução do Termômetro:** Dia 10 vs Dia 11 (espera-se aumento de confiança)

---

---

## **DIA 12 — Fechar Acordo Sem Se Enrolar**

### 🎯 Título
**Fechando Acordos: Coloque em Prática Sua Negociação e Conquiste Alívio Imediato**

### 🌅 Mensagem Matinal
Hoje é dia de agir. Você já se preparou, mapeou suas dívidas e praticou scripts. Agora vai conversar com os credores. Lembre-se: você é o cliente; eles querem receber. Mantenha a postura firme e educada, não aceite pressões para pagar mais do que pode e exija que qualquer proposta seja enviada por escrito. Um acordo malfeito pode ser pior que dívida nenhuma; um acordo bem-feito é um alívio imediato.

### 📚 Conceito FIRE do Dia
**Acordo sustentável.** No FIRE, não vale a pena fechar um acordo que estoura seu orçamento e o faz voltar ao rotativo em poucos meses. O acordo ideal reduz juros, cabe no seu limite mensal e tem prazo razoável. Jamais aceite seguro, proteção ou serviços adicionais embutidos sem ler. Exija transparência sobre valor total, juros e multa por atraso. Peça segunda via por escrito antes de assinar. Se necessário, solicite prazo de 24 horas para pensar.

### ✅ Seu Desafio Hoje
Entrar em contato com credores, apresentar propostas, avaliar contrapropostas e fechar acordos que cabem no seu orçamento mínimo sem se comprometer além do limite.

### 🎯 SUA TAREFA PRÁTICA

#### **Experiência do Usuário (UX/UI)**

**Tela de Introdução do Dia 12**
- **Header:** "Dia 12 — Fechar Acordo Sem Se Enrolar"
- **Barra de progresso:** 0% → 100%
- **Card motivacional:** "Hoje você age! Cada acordo fechado é um passo de gigante rumo à sua liberdade financeira."
- **Badges:** Tempo estimado (30-60 min) | Requer (Mapa do Dia 10, Scripts do Dia 11)
- **CTA:** "Começar Minhas Negociações"

**Fluxo Principal (5 Passos)**

**PASSO 1: Agenda do Dia**

- **Título:** "Suas negociações agendadas para hoje"
- **Subtítulo:** "Siga a ordem de prioridade — comece pelas dívidas mais urgentes"

**Pré-carregamento Automático:**

App puxa automaticamente:
- **Do Dia 10:** `negotiation_schedule` com contatos agendados para hoje
- **Do Dia 11:** Scripts revisados e perguntas preparadas

**Componente: Lista de Negociações**

| Horário | Credor | Objetivo | Status | Ação |
|---------|--------|----------|--------|------|
| 10:00 | Banco ABC | Desconto 50% à vista | 📅 Agendado | [Iniciar] |
| 14:00 | Financeira XYZ | Reduzir juros | 📅 Agendado | [Iniciar] |
| 16:30 | Loja 123 | Parcelar em 12x | 📅 Agendado | [Iniciar] |

**Para cada negociação:**
- Botão "Ver Script" (abre modal com roteiro do Dia 11)
- Botão "Ver Perguntas" (abre checklist de perguntas)
- Botão "Iniciar Contato" (muda status para "Em andamento")

**Card de Preparação:**
```
💪 Antes de cada ligação:
• Respire fundo 3 vezes
• Tenha seu script em mãos
• Anote tudo que o atendente disser
• Lembre-se: você pode dizer "não"
```

**Rodapé:**
- Botão "Próximo Passo"

---

**PASSO 2: Registrar Contato**

- **Título:** "Registre os detalhes da negociação"
- **Subtítulo:** "Anote tudo para tomar a melhor decisão"

**Formulário de Registro (para cada contato realizado):**

**Informações Básicas:**
- Credor: (pré-preenchido)
- Data/Hora do contato: (automático)
- Canal utilizado: Radio (Telefone / E-mail / Chat / WhatsApp / Presencial)
- Nome do atendente: Input texto
- Protocolo de atendimento: Input texto

**Proposta Recebida:**
- Valor total proposto: Input R$
- Desconto oferecido: Input % (calculado automaticamente se informar valor original)
- Número de parcelas: Input numérico
- Valor de cada parcela: Input R$ (validação: parcelas × valor = total)
- Taxa de juros informada: Input %/mês
- Data de vencimento da 1ª parcela: Date picker
- Condições especiais: Textarea (ex: "Desconto válido até sexta-feira")

**Taxas e Adicionais:**
- Há tarifa de renegociação? Radio (Sim/Não) + valor se sim
- Há seguro ou proteção embutida? Radio (Sim/Não) + valor se sim
- Há multa por atraso nas novas parcelas? Radio (Sim/Não) + % se sim
- Pode quitar antecipadamente sem multa? Radio (Sim/Não)

**Validação contra limites do Dia 10:**
```
⚠️ ATENÇÃO: Esta parcela (R$ 600) excede seu limite
definido no Dia 10 (R$ 500).

Opções:
○ Aceitar mesmo assim (justifique)
○ Fazer contraproposta
○ Recusar e tentar outro dia
```

**Rodapé:**
- Botão "Salvar e Continuar"

---

**PASSO 3: Avaliar Propostas**

- **Título:** "Compare as propostas com seus limites"
- **Subtítulo:** "Tome decisões baseadas em dados, não em pressão"

**Componente: Comparador de Propostas**

**Para cada proposta recebida:**

```
┌─────────────────────────────────────────────────────────────┐
│ BANCO ABC - Cartão de Crédito                                │
├─────────────────────────────────────────────────────────────┤
│ SITUAÇÃO ORIGINAL:                                           │
│ • Dívida atual: R$ 5.000,00                                  │
│ • Juros originais: 12.5%/mês                                 │
│ • Custo em 12 meses (sem negociar): R$ 21.354,42             │
│                                                              │
│ PROPOSTA RECEBIDA:                                           │
│ • Valor negociado: R$ 2.500,00 (desconto de 50%)             │
│ • Forma: À vista                                             │
│ • Prazo para pagamento: 5 dias úteis                         │
│                                                              │
│ ✅ ECONOMIA: R$ 18.854,42 (88% de desconto real!)            │
│                                                              │
│ CABE NO SEU ORÇAMENTO?                                       │
│ • Limite mensal disponível: R$ 500,00                        │
│ • Entrada disponível: R$ 2.500,00                            │
│ • Resultado: ✅ Viável                                        │
└─────────────────────────────────────────────────────────────┘
```

**Indicadores de Decisão:**
- 🟢 **Recomendado:** Proposta cabe no orçamento e reduz juros significativamente
- 🟡 **Atenção:** Proposta perto do limite, analise com cuidado
- 🔴 **Não recomendado:** Proposta excede limite ou tem condições desfavoráveis

**Calculadora de Simulação:**
- "E se eu propor outro valor?" → Simula nova proposta
- "E se alongar o prazo?" → Mostra impacto nos juros

**Rodapé:**
- Botão "Próximo Passo"

---

**PASSO 4: Fechar ou Recusar**

- **Título:** "Hora da decisão"
- **Subtítulo:** "Aceite apenas acordos sustentáveis"

**Para cada proposta:**

**Opção 1: Aceitar Proposta**
- Toggle: "Li e entendo todas as condições"
- Toggle: "Recebi proposta por escrito (e-mail/contrato/boleto)"
- Toggle: "A parcela cabe no meu orçamento mínimo"

**Campos obrigatórios se aceitar:**
- Upload do documento: (contrato, boleto, print do e-mail)
- Confirmação: "Confirmo que este acordo foi fechado em [data]"

**Opção 2: Fazer Contraproposta**
- Input: "Qual valor você propõe?"
- Input: "Em quantas parcelas?"
- Textarea: "Justificativa para o credor"
- Botão: "Agendar novo contato"

**Opção 3: Recusar**
- Dropdown: Motivo (Parcela muito alta / Juros ainda altos / Condições abusivas / Preciso de mais tempo / Outro)
- Campo: "Quando pretende tentar novamente?"
- Checkbox: "Manter na lista de negociações pendentes"

**Alerta de Sustentabilidade:**
```
⚠️ REGRA DE OURO DO FIRE:
Um acordo só vale a pena se:
✅ Cabe no seu orçamento mínimo
✅ Reduz juros ou valor total
✅ Tem condições claras por escrito
✅ Não inclui "extras" que você não pediu

Se qualquer item acima não for atendido, 
é melhor esperar outra oportunidade.
```

**Rodapé:**
- Botão "Próximo Passo"

---

**PASSO 5: Registrar Acordos e Celebrar**

- **Título:** "Seus acordos fechados"
- **Subtítulo:** "Cada vitória merece ser celebrada!"

**Componente: Lista de Acordos Fechados**

| Credor | Valor Original | Valor Negociado | Economia | Parcelas | Status |
|--------|----------------|-----------------|----------|----------|--------|
| Banco ABC | R$ 5.000 | R$ 2.500 | R$ 2.500 | À vista | ✅ Fechado |
| Financeira XYZ | R$ 8.000 | R$ 6.000 | R$ 2.000 | 12x R$ 500 | ✅ Fechado |

**Resumo do Dia:**
```
🎉 PARABÉNS! Você fechou 2 acordos hoje!

📊 Resumo:
• Dívidas originais: R$ 13.000
• Valores negociados: R$ 8.500
• Economia total: R$ 4.500 (35%)
• Compromisso mensal: R$ 500

💰 Você economizou R$ 4.500 que seriam
    perdidos em juros!
```

**Configurar Lembretes:**
- Para cada acordo fechado, criar lembrete de pagamento
- Data do lembrete: 3 dias antes do vencimento
- Canais: Checkboxes (Push / WhatsApp / E-mail)

**Atualização do Termômetro "Respirar":**
- "Como você se sente após fechar acordos?"
- Slider 0-10 + justificativa
- Comparação: "No Dia 11 você estava em X. Hoje está em Y."

**Celebração:**
- Animação de confetti + mensagem personalizada
- Opção de compartilhar vitória (sem valores) em redes sociais
- Frase motivacional: "Cada acordo é um passo rumo à liberdade!"

**Negociações Pendentes:**
- Lista de dívidas que não foram fechadas
- Botão "Reagendar" para cada uma
- Sugestão: "Tente novamente em 7 dias — credores podem ter novas ofertas"

**Rodapé:**
- "Salvar Rascunho"
- "Concluir Dia 12"

---

**Tela de Conclusão do Dia 12:**

```
🎉 Dia 12 Concluído!

Você deu um passo gigante hoje:
✅ Acordos fechados: X
✅ Economia conquistada: R$ Y
✅ Compromisso mensal definido: R$ Z

Seus acordos já estão no calendário
com lembretes configurados.

💪 Amanhã você vai criar novas regras
de vida para manter essa conquista!

Próximo: Dia 13 - Novas Regras de Vida
```

---

### 🗄️ Infraestrutura (Backend + Fluxo de Dados)

#### **Tabelas do Banco de Dados**

**52. Tabela: `negotiation_contacts`** (registro de contatos)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do contato |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `debt_id` | UUID | FOREIGN KEY → debts(id) | Dívida relacionada |
| `schedule_id` | UUID | FOREIGN KEY → negotiation_schedule(id) | Agendamento original |
| `contact_datetime` | TIMESTAMP | NOT NULL | Data/hora do contato |
| `channel` | VARCHAR(20) | NOT NULL | 'phone' / 'email' / 'chat' / 'whatsapp' / 'in_person' |
| `attendant_name` | VARCHAR(100) | NULLABLE | Nome do atendente |
| `protocol_number` | VARCHAR(50) | NULLABLE | Protocolo de atendimento |
| `notes` | TEXT | NULLABLE | Anotações da conversa |
| `status` | VARCHAR(20) | DEFAULT 'completed' | 'completed' / 'no_answer' / 'callback_requested' |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**53. Tabela: `proposals_received`** (propostas recebidas)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da proposta |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `debt_id` | UUID | FOREIGN KEY → debts(id) | Dívida relacionada |
| `contact_id` | UUID | FOREIGN KEY → negotiation_contacts(id) | Contato relacionado |
| `original_amount` | DECIMAL(10,2) | NOT NULL | Valor original da dívida |
| `proposed_amount` | DECIMAL(10,2) | NOT NULL | Valor proposto |
| `discount_percent` | DECIMAL(5,2) | NULLABLE | Desconto em % |
| `installments` | INTEGER | NOT NULL | Número de parcelas |
| `installment_amount` | DECIMAL(10,2) | NOT NULL | Valor de cada parcela |
| `interest_rate` | DECIMAL(5,2) | NULLABLE | Taxa de juros informada |
| `first_due_date` | DATE | NULLABLE | Vencimento da 1ª parcela |
| `special_conditions` | TEXT | NULLABLE | Condições especiais |
| `has_fee` | BOOLEAN | DEFAULT FALSE | Tem tarifa de renegociação |
| `fee_amount` | DECIMAL(10,2) | NULLABLE | Valor da tarifa |
| `has_insurance` | BOOLEAN | DEFAULT FALSE | Tem seguro embutido |
| `insurance_amount` | DECIMAL(10,2) | NULLABLE | Valor do seguro |
| `has_late_penalty` | BOOLEAN | DEFAULT FALSE | Tem multa por atraso |
| `late_penalty_percent` | DECIMAL(5,2) | NULLABLE | % de multa |
| `early_payment_allowed` | BOOLEAN | DEFAULT TRUE | Permite quitação antecipada |
| `valid_until` | DATE | NULLABLE | Validade da proposta |
| `status` | VARCHAR(20) | DEFAULT 'pending' | 'pending' / 'accepted' / 'rejected' / 'countered' |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**54. Tabela: `agreements`** (acordos fechados)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do acordo |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `debt_id` | UUID | FOREIGN KEY → debts(id) | Dívida relacionada |
| `proposal_id` | UUID | FOREIGN KEY → proposals_received(id) | Proposta aceita |
| `original_amount` | DECIMAL(10,2) | NOT NULL | Valor original |
| `negotiated_amount` | DECIMAL(10,2) | NOT NULL | Valor negociado |
| `savings` | DECIMAL(10,2) | NOT NULL | Economia obtida |
| `savings_percent` | DECIMAL(5,2) | NOT NULL | % de economia |
| `installments` | INTEGER | NOT NULL | Número de parcelas |
| `installment_amount` | DECIMAL(10,2) | NOT NULL | Valor de cada parcela |
| `effective_interest_rate` | DECIMAL(5,2) | NULLABLE | Taxa efetiva |
| `first_due_date` | DATE | NOT NULL | Vencimento da 1ª parcela |
| `creditor_name` | VARCHAR(100) | NOT NULL | Nome do credor |
| `document_path` | VARCHAR(500) | NULLABLE | Caminho do documento/contrato |
| `status` | VARCHAR(20) | DEFAULT 'active' | 'active' / 'paid_off' / 'defaulted' |
| `closed_at` | TIMESTAMP | DEFAULT NOW() | Data de fechamento |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**55. Tabela: `agreement_payments`** (parcelas dos acordos)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da parcela |
| `agreement_id` | UUID | FOREIGN KEY → agreements(id) | Acordo relacionado |
| `installment_number` | INTEGER | NOT NULL | Número da parcela |
| `amount` | DECIMAL(10,2) | NOT NULL | Valor da parcela |
| `due_date` | DATE | NOT NULL | Data de vencimento |
| `paid_date` | DATE | NULLABLE | Data de pagamento |
| `status` | VARCHAR(20) | DEFAULT 'pending' | 'pending' / 'paid' / 'overdue' |
| `reminder_sent` | BOOLEAN | DEFAULT FALSE | Se lembrete foi enviado |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

---

#### **Regras de Negócio**

1. **Validação de Proposta vs Limite:**
   ```python
   def validar_proposta_contra_limite(proposta, plano_negociacao):
       limite = plano_negociacao.max_monthly_payment
       parcela = proposta.installment_amount
       
       if parcela > limite * 1.2:  # 20% de tolerância
           return {
               'valid': False,
               'severity': 'high',
               'message': f'Parcela de R$ {parcela:.2f} excede seu limite de R$ {limite:.2f} em {((parcela/limite)-1)*100:.0f}%'
           }
       elif parcela > limite:
           return {
               'valid': True,
               'severity': 'warning',
               'message': f'Parcela ligeiramente acima do limite. Analise com cuidado.'
           }
       return {'valid': True, 'severity': 'ok'}
   ```

2. **Cálculo de Economia:**
   ```python
   def calcular_economia(debt, proposal):
       # Valor que seria pago sem negociar (12 meses de juros)
       valor_sem_negociar = debt.total_amount * ((1 + debt.interest_rate/100) ** 12)
       
       # Valor total com a proposta
       valor_com_proposta = proposal.installment_amount * proposal.installments
       
       # Economia
       economia = valor_sem_negociar - valor_com_proposta
       economia_percent = (economia / valor_sem_negociar) * 100
       
       return {
           'original_cost': valor_sem_negociar,
           'negotiated_cost': valor_com_proposta,
           'savings': economia,
           'savings_percent': economia_percent
       }
   ```

3. **Geração de Parcelas do Acordo:**
   ```python
   def gerar_parcelas_acordo(agreement):
       parcelas = []
       data_atual = agreement.first_due_date
       
       for i in range(1, agreement.installments + 1):
           parcelas.append({
               'agreement_id': agreement.id,
               'installment_number': i,
               'amount': agreement.installment_amount,
               'due_date': data_atual,
               'status': 'pending'
           })
           # Próximo mês
           if data_atual.month == 12:
               data_atual = date(data_atual.year + 1, 1, data_atual.day)
           else:
               data_atual = date(data_atual.year, data_atual.month + 1, data_atual.day)
       
       return parcelas
   ```

4. **Atualização do Status da Dívida Original:**
   ```sql
   -- Quando acordo é fechado, atualizar dívida original
   UPDATE debts
   SET 
     status = 'renegotiated',
     renegotiated_at = NOW(),
     agreement_id = ?
   WHERE id = ?;
   ```

5. **Integração com Calendário (Dia 7):**
   ```sql
   -- Adicionar parcelas ao calendário de vencimentos
   INSERT INTO obligations (user_id, name, amount, due_day, category, source)
   SELECT 
     a.user_id,
     CONCAT('Acordo ', a.creditor_name, ' - Parcela ', ap.installment_number),
     ap.amount,
     EXTRACT(DAY FROM ap.due_date),
     'acordo',
     'agreement'
   FROM agreements a
   JOIN agreement_payments ap ON a.id = ap.agreement_id
   WHERE a.id = ?;
   ```

---

#### **Outputs do App (Documentos Gerados)**

1. **Registro de Acordos Fechados** (PDF/Visualização)
   - Lista de todos os acordos com condições detalhadas
   - Economia obtida por acordo e total
   - Calendário de parcelas
   - Documentos anexados

2. **Comprovante de Negociação** (PDF)
   - Para cada acordo: resumo das condições
   - Economia calculada
   - Próximas parcelas
   - QR Code para acessar no app

3. **Relatório de Negociações Pendentes**
   - Dívidas que não foram negociadas
   - Motivos registrados
   - Datas sugeridas para nova tentativa

---

#### **Fluxo de Integração com Dias Futuros**

**Dados do Dia 12 que serão reutilizados:**

- **Dia 13 (Novas Regras de Vida):**
  - Acordos fechados (`agreements`) entram nas regras de proteção
  - Valor total de parcelas de acordos influencia rotina semanal

- **Dia 14 (Plano 30/90):**
  - Parcelas de acordos (`agreement_payments`) alimentam "Dívidas prioritárias"
  - Economia obtida mostra progresso no checkpoint de 30 dias

- **Dia 15 (Formatura):**
  - "Acordos ativos: próxima parcela" aparece no checklist semanal
  - Total de economia aparece no painel de progresso

---

#### **Endpoints da API (Backend)**

**POST /api/v1/negotiation-contact**
- **Payload:**
```json
{
  "user_id": "uuid",
  "debt_id": "uuid",
  "schedule_id": "uuid",
  "channel": "phone",
  "attendant_name": "Maria Silva",
  "protocol_number": "2024011500123",
  "notes": "Atendente ofereceu desconto de 50%"
}
```

**POST /api/v1/proposal-received**
- **Payload:**
```json
{
  "user_id": "uuid",
  "debt_id": "uuid",
  "contact_id": "uuid",
  "original_amount": 5000.00,
  "proposed_amount": 2500.00,
  "installments": 1,
  "installment_amount": 2500.00,
  "first_due_date": "2024-01-20",
  "has_insurance": false,
  "has_fee": false,
  "valid_until": "2024-01-18"
}
```

**POST /api/v1/close-agreement**
- **Payload:**
```json
{
  "user_id": "uuid",
  "proposal_id": "uuid",
  "document_path": "uploads/contracts/banco_abc_acordo.pdf",
  "reminder_channels": ["push", "whatsapp"]
}
```

- **Response 201:**
```json
{
  "success": true,
  "message": "Acordo fechado com sucesso!",
  "data": {
    "agreement_id": "uuid",
    "savings": 2500.00,
    "savings_percent": 50,
    "next_payment": {
      "date": "2024-01-20",
      "amount": 2500.00
    },
    "reminders_scheduled": 1
  }
}
```

**GET /api/v1/agreements/{user_id}/summary**
- **Response 200:**
```json
{
  "total_agreements": 2,
  "total_original_debt": 13000.00,
  "total_negotiated": 8500.00,
  "total_savings": 4500.00,
  "savings_percent": 34.6,
  "monthly_commitment": 500.00,
  "agreements": [...]
}
```

---

### 📊 Métricas de Sucesso do Dia 12

1. **Taxa de Conclusão:** % que completa Dia 12
2. **Acordos Fechados:** Média de acordos por usuário
3. **Taxa de Sucesso:** % de negociações que resultam em acordo
4. **Economia Média:** Valor médio economizado por acordo
5. **Desconto Médio:** % médio de desconto obtido
6. **Propostas Recusadas:** % de propostas recusadas (indica qualidade da preparação)
7. **Documentação:** % de acordos com documento anexado
8. **Evolução do Termômetro:** Dia 11 vs Dia 12 (espera-se grande aumento)

---

---

## **DIA 13 — Novas Regras de Vida**

### 🎯 Título
**Novas Regras de Vida: Construa Hábitos que Sustentam Sua Liberdade Financeira**

### 🌅 Mensagem Matinal
Mudanças financeiras duradouras dependem de novos hábitos. Depois de organizar números, cortar vazamentos e negociar dívidas, é hora de estabelecer regras que vão impedir recaídas e criar prosperidade. Pense nessas regras como seu manual de sobrevivência: elas protegem você nos momentos de fraqueza e orientam suas ações sem exigir força de vontade contínua. Hoje você vai escrever suas próprias leis financeiras e combiná-las com quem divide a vida com você.

### 📚 Conceito FIRE do Dia
**Disciplina > Motivação.** No FIRE, não confiamos na força de vontade diária. Regras bem definidas e automatizações reduzem o esforço mental e evitam decisões impulsivas. Exemplos: ter um limite fixo para cartão emergencial, depositar automaticamente um valor na caixinha de emergência todo mês, revisar as finanças uma vez por semana, discutir compras acima de determinado valor com um parceiro de confiança. Regras claras libertam porque eliminam dúvidas na hora de agir.

### ✅ Seu Desafio Hoje
Definir regras pessoais para cartão, criar sua caixinha de emergência, estabelecer rotina semanal de revisão e combinar tudo com quem divide a vida com você.

### 🎯 SUA TAREFA PRÁTICA

#### **Experiência do Usuário (UX/UI)**

**Tela de Introdução do Dia 13**
- **Header:** "Dia 13 — Novas Regras de Vida"
- **Barra de progresso:** 0% → 100%
- **Card motivacional:** "Regras claras libertam. Quando você define limites, não precisa pensar — só seguir."
- **Badges:** Tempo estimado (20-30 min) | Requer (Dados dos Dias 4, 5, 9, 12)
- **CTA:** "Criar Minhas Regras de Vida"

**Fluxo Principal (5 Passos)**

**PASSO 1: Regras do Cartão**

- **Título:** "Defina as regras do seu cartão"
- **Subtítulo:** "Cartão sem regras é armadilha. Cartão com regras é ferramenta."

**Pré-carregamento Automático:**
- **Do Dia 5:** Limites definidos, cartões congelados, teto estabelecido

**Componente: Configurador de Regras do Cartão**

**Regra 1: Uso Permitido**
- Múltipla escolha: "Quando posso usar o cartão?"
  - ☐ Emergências de saúde
  - ☐ Alimentação básica (mercado)
  - ☐ Combustível/transporte essencial
  - ☐ Contas que só aceitam cartão
  - ☐ Nunca (cartão permanece congelado)
  - ☐ Outro: [campo livre]

**Regra 2: Limite por Compra**
- Slider: R$ 0 ← → R$ 500
- Valor selecionado: R$ ___
- Toggle: "Exigir justificativa para compras acima deste valor"

**Regra 3: Limite Mensal (Teto)**
- Input R$: Teto máximo da fatura
- Pré-preenchido: valor do Dia 5
- Alerta: "O app vai te avisar quando atingir 80% deste valor"

**Regra 4: Parcelamentos**
- Radio: "Posso parcelar compras?"
  - Nunca parcelar
  - Máximo de 3x sem juros
  - Máximo de 6x sem juros
  - Avaliar caso a caso (não recomendado)

**Regra 5: Ação Pós-Fatura**
- Radio: "O que acontece quando a fatura fecha?"
  - Congelo o cartão até pagar a fatura
  - Continuo usando normalmente
  - Reduzo o limite para metade

**Visualização das Regras:**
```
┌─────────────────────────────────────────────────────────────┐
│ 📋 MINHAS REGRAS DO CARTÃO                                   │
├─────────────────────────────────────────────────────────────┤
│ ✅ Uso permitido: Emergências de saúde, Mercado              │
│ ✅ Limite por compra: R$ 100,00                              │
│ ✅ Teto mensal: R$ 500,00                                    │
│ ✅ Parcelamento: Máximo 3x sem juros                         │
│ ✅ Pós-fatura: Congelo até pagar                             │
│                                                              │
│ 🔔 Alertas ativos:                                           │
│ • Notificar quando atingir 80% do teto                       │
│ • Pedir justificativa para compras > R$ 100                  │
└─────────────────────────────────────────────────────────────┘
```

**Rodapé:**
- Botão "Próximo Passo"

---

**PASSO 2: Caixinha de Emergência**

- **Título:** "Crie sua caixinha de emergência"
- **Subtítulo:** "Um colchão para imprevistos evita novos endividamentos"

**Conceito:**
```
💡 O que é a caixinha de emergência?
É uma reserva separada da sua conta principal,
usada APENAS para imprevistos reais:
• Conserto urgente do carro
• Medicamento não previsto
• Perda de renda temporária

NÃO é para:
❌ Oportunidades de compra
❌ Presentes
❌ Viagens
```

**Configuração da Caixinha:**

**Onde guardar:**
- Radio:
  - Conta poupança no mesmo banco
  - Conta em banco digital separado
  - CDB de liquidez diária
  - Cofre físico em casa
  - Outro: [campo livre]

**Nome da conta/local:** Input texto (ex: "Reserva Nubank")

**Valor mensal para depositar:**
- Slider: R$ 10 ← → R$ 500
- Valor selecionado: R$ ___
- Helper: "Mesmo R$ 20/mês fazem diferença. O importante é começar."

**Meta inicial (3 meses de reserva):**
- Calculado automaticamente: orçamento mínimo × 3
- Exibição: "Sua meta inicial: R$ X (3 meses de despesas essenciais)"
- Timeline: "Com R$ 50/mês, você atinge em Y meses"

**Dia do depósito:**
- Dropdown: Dia 1 ao 28 do mês
- Sugestão: "Escolha o dia seguinte ao recebimento da renda"

**Automatização:**
- Toggle: "Quero programar transferência automática"
- Se sim: campos para configurar (banco, conta, valor)

**Regras de uso:**
- Múltipla escolha: "Quando posso usar a caixinha?"
  - ☐ Emergências de saúde
  - ☐ Consertos urgentes (casa/carro)
  - ☐ Perda de renda
  - ☐ Outro: [campo livre]

**Proteção contra tentação:**
- Toggle: "Quero dificultar o acesso à caixinha"
- Sugestões:
  - Deixar em banco sem app no celular
  - Não ter cartão de débito dessa conta
  - Precisar de 24h para transferir

**Rodapé:**
- Botão "Próximo Passo"

---

**PASSO 3: Rotina Semanal**

- **Título:** "Estabeleça sua rotina semanal de 10 minutos"
- **Subtítulo:** "Pequenas revisões previnem grandes problemas"

**Conceito:**
```
⏱️ O RITUAL DOS 10 MINUTOS
Uma vez por semana, você vai parar para:
1. Ver o que vence nos próximos 7 dias
2. Checar se está dentro do orçamento
3. Verificar a fatura do cartão
4. Acompanhar seus acordos
5. Registrar uma pequena vitória

É pouco tempo, mas muda tudo.
```

**Configuração da Rotina:**

**Dia da semana:**
- Dropdown: Segunda / Terça / Quarta / Quinta / Sexta / Sábado / Domingo
- Sugestão: "Domingo à noite ou segunda de manhã funcionam bem"

**Horário:**
- Time picker
- Sugestão: "Escolha um momento tranquilo, sem distrações"

**Duração estimada:**
- Info: "10 minutos são suficientes"

**Checklist da Rotina:**
- Lista editável com itens pré-preenchidos:
  - ☐ Ver contas dos próximos 7 dias (Dia 7)
  - ☐ Ver sobra/falta do orçamento mínimo (Dia 9)
  - ☐ Ver fatura vs. teto do cartão (Dia 13)
  - ☐ Ver acordos ativos: próxima parcela (Dia 12)
  - ☐ Fazer 1 ajuste da semana (campo texto)
  - ☐ Registrar vitória da semana (campo texto)

**Botão "+ Adicionar item ao checklist"**

**Lembretes:**
- Toggle: "Quero receber lembrete semanal"
- Canais: Checkboxes (Push / WhatsApp / E-mail)
- Antecedência: Dropdown (No horário / 30 min antes / 1h antes)

**Preview do Lembrete:**
```
📱 Lembrete programado:
"Domingo às 19:00 — Hora dos seus 10 minutos financeiros!"
Via: Push, WhatsApp
```

**Rodapé:**
- Botão "Próximo Passo"

---

**PASSO 4: Combinar com Quem Divide a Vida**

- **Título:** "Combine suas regras com quem importa"
- **Subtítulo:** "Finanças compartilhadas funcionam melhor com acordos claros"

**Pré-carregamento:**
- **Do Dia 1:** Se `shares_finances` = TRUE, pré-preencher nome do parceiro

**Cenário A: Divide Finanças com Alguém**

**Pessoa de confiança:**
- Input texto: Nome (pré-preenchido se disponível)
- Dropdown: Relação (Cônjuge / Parceiro(a) / Familiar / Amigo)

**Regras para combinar:**

**Regra 1: Limite de compra sem consulta**
- Input R$: "Compras acima de R$ ___ precisam de conversa antes"
- Sugestão: R$ 100 a R$ 200

**Regra 2: Uso da caixinha**
- Radio:
  - Qualquer um pode usar (avisando depois)
  - Apenas em consenso
  - Um é o "guardião" e decide

**Regra 3: Reunião financeira**
- Toggle: "Vamos fazer revisão juntos"
- Se sim:
  - Frequência: Semanal / Quinzenal / Mensal
  - Dia/horário: Seletores

**Regra 4: Empréstimos para terceiros**
- Radio:
  - Nunca emprestamos dinheiro
  - Limite de R$ ___ sem consulta
  - Sempre discutimos antes

**Data da conversa:**
- Date picker: "Quando você vai conversar sobre essas regras?"
- Botão: "Agendar lembrete para conversa"

**Campo de compromisso:**
- Textarea: "O que vocês combinaram?" (preenchido após a conversa)

---

**Cenário B: Não Divide Finanças (Mora Sozinho)**

**Parceiro de responsabilidade:**
```
💡 Mesmo morando sozinho, ter alguém para
prestar contas aumenta suas chances de sucesso.
Pode ser um amigo, familiar ou mentor.
```

- Input texto: Nome da pessoa
- Dropdown: Relação
- Frequência de contato: Semanal / Quinzenal / Mensal
- Forma de contato: Mensagem / Ligação / Encontro

**O que você vai compartilhar:**
- Checkboxes:
  - ☐ Se estou cumprindo as regras do cartão
  - ☐ Se estou depositando na caixinha
  - ☐ Se estou pagando os acordos em dia
  - ☐ Minhas vitórias da semana
  - ☐ Meus desafios e tentações

**Rodapé:**
- Botão "Próximo Passo"

---

**PASSO 5: Consolidar e Ativar Regras**

- **Título:** "Seu manual de regras financeiras"
- **Subtítulo:** "Revise tudo e ative suas proteções"

**Resumo Visual:**

```
┌─────────────────────────────────────────────────────────────┐
│ 📖 MEU MANUAL DE REGRAS FINANCEIRAS                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ 💳 REGRAS DO CARTÃO                                          │
│ • Uso permitido: Emergências, Mercado                        │
│ • Limite por compra: R$ 100                                  │
│ • Teto mensal: R$ 500                                        │
│ • Parcelamento: Máx. 3x                                      │
│ • Pós-fatura: Congelo até pagar                              │
│                                                              │
│ 🏦 CAIXINHA DE EMERGÊNCIA                                    │
│ • Local: Conta Nubank                                        │
│ • Depósito mensal: R$ 50                                     │
│ • Dia do depósito: 5 de cada mês                             │
│ • Meta: R$ 3.000 (3 meses)                                   │
│ • Uso: Apenas emergências reais                              │
│                                                              │
│ 📅 ROTINA SEMANAL                                            │
│ • Dia: Domingo                                               │
│ • Horário: 19:00                                             │
│ • Checklist: 6 itens                                         │
│                                                              │
│ 👥 COMPROMISSO COMPARTILHADO                                 │
│ • Pessoa: [Nome]                                             │
│ • Limite sem consulta: R$ 150                                │
│ • Reunião financeira: Quinzenal                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Ativação das Proteções:**
- Toggle: "Ativar alertas de regras do cartão" ✅
- Toggle: "Ativar lembrete de depósito na caixinha" ✅
- Toggle: "Ativar lembrete da rotina semanal" ✅
- Toggle: "Ativar lembrete de reunião com parceiro" ✅

**Frase de Compromisso:**
- Textarea: "Escreva uma frase que represente seu compromisso"
- Sugestões:
  - "Eu protejo meu dinheiro com regras claras"
  - "Disciplina hoje, liberdade amanhã"
  - "Cada decisão me aproxima da independência"

**Atualização do Termômetro "Respirar":**
- "Após definir suas regras de vida, como você se sente?"
- Slider 0-10 + justificativa

**Rodapé:**
- "Salvar Rascunho"
- "Concluir Dia 13"

---

**Tela de Conclusão do Dia 13:**

```
🎉 Dia 13 Concluído!

Você criou seu manual de sobrevivência financeira:
✅ Regras do cartão definidas e ativas
✅ Caixinha de emergência configurada
✅ Rotina semanal agendada
✅ Compromissos compartilhados

🛡️ Suas proteções estão ativadas!
O app vai te ajudar a seguir cada regra.

Amanhã você vai criar seu Plano 30/90
para consolidar tudo isso.

Próximo: Dia 14 - Plano 30/90
```

---

### 🗄️ Infraestrutura (Backend + Fluxo de Dados)

#### **Tabelas do Banco de Dados**

**56. Tabela: `card_rules`** (regras do cartão)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID das regras |
| `user_id` | UUID | FOREIGN KEY → users(id), UNIQUE | Usuário (1:1) |
| `allowed_uses` | JSONB | NOT NULL | Array de usos permitidos |
| `limit_per_purchase` | DECIMAL(10,2) | NOT NULL | Limite por compra |
| `require_justification` | BOOLEAN | DEFAULT TRUE | Exigir justificativa acima do limite |
| `monthly_ceiling` | DECIMAL(10,2) | NOT NULL | Teto mensal |
| `alert_threshold` | INTEGER | DEFAULT 80 | % para alerta |
| `installment_policy` | VARCHAR(30) | NOT NULL | 'never' / 'max_3x' / 'max_6x' / 'case_by_case' |
| `post_invoice_action` | VARCHAR(30) | NOT NULL | 'freeze' / 'continue' / 'reduce_half' |
| `is_active` | BOOLEAN | DEFAULT TRUE | Se regras estão ativas |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

**57. Tabela: `emergency_fund`** (caixinha de emergência)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da caixinha |
| `user_id` | UUID | FOREIGN KEY → users(id), UNIQUE | Usuário (1:1) |
| `account_type` | VARCHAR(50) | NOT NULL | Tipo de conta |
| `account_name` | VARCHAR(100) | NOT NULL | Nome/identificação da conta |
| `monthly_deposit` | DECIMAL(10,2) | NOT NULL | Valor mensal a depositar |
| `deposit_day` | INTEGER | NOT NULL, CHECK (1-28) | Dia do depósito |
| `target_amount` | DECIMAL(10,2) | NOT NULL | Meta (3 meses) |
| `current_balance` | DECIMAL(10,2) | DEFAULT 0 | Saldo atual |
| `is_automated` | BOOLEAN | DEFAULT FALSE | Se tem transferência automática |
| `allowed_uses` | JSONB | NOT NULL | Array de usos permitidos |
| `access_difficulty` | VARCHAR(50) | NULLABLE | Dificuldade de acesso escolhida |
| `is_active` | BOOLEAN | DEFAULT TRUE | Se está ativa |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

**58. Tabela: `weekly_routine`** (rotina semanal)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da rotina |
| `user_id` | UUID | FOREIGN KEY → users(id), UNIQUE | Usuário (1:1) |
| `day_of_week` | INTEGER | NOT NULL, CHECK (0-6) | Dia da semana (0=domingo) |
| `time` | TIME | NOT NULL | Horário |
| `checklist_items` | JSONB | NOT NULL | Array de itens do checklist |
| `reminder_enabled` | BOOLEAN | DEFAULT TRUE | Se lembrete está ativo |
| `reminder_channels` | JSONB | DEFAULT '["push"]' | Canais de lembrete |
| `reminder_advance` | INTEGER | DEFAULT 0 | Minutos de antecedência |
| `is_active` | BOOLEAN | DEFAULT TRUE | Se rotina está ativa |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

**59. Tabela: `weekly_routine_logs`** (registros da rotina)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do log |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `routine_id` | UUID | FOREIGN KEY → weekly_routine(id) | Rotina |
| `week_date` | DATE | NOT NULL | Data da semana |
| `completed_items` | JSONB | NOT NULL | Itens completados |
| `weekly_adjustment` | TEXT | NULLABLE | Ajuste da semana |
| `weekly_victory` | TEXT | NULLABLE | Vitória da semana |
| `completed_at` | TIMESTAMP | NULLABLE | Data/hora de conclusão |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**60. Tabela: `shared_commitments`** (compromissos compartilhados)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do compromisso |
| `user_id` | UUID | FOREIGN KEY → users(id), UNIQUE | Usuário (1:1) |
| `partner_name` | VARCHAR(100) | NOT NULL | Nome do parceiro |
| `partner_relationship` | VARCHAR(30) | NOT NULL | Relação |
| `purchase_limit` | DECIMAL(10,2) | NULLABLE | Limite sem consulta |
| `emergency_fund_rule` | VARCHAR(30) | NULLABLE | Regra da caixinha |
| `financial_meeting_frequency` | VARCHAR(20) | NULLABLE | Frequência de reunião |
| `financial_meeting_day` | INTEGER | NULLABLE | Dia da reunião |
| `financial_meeting_time` | TIME | NULLABLE | Horário da reunião |
| `loan_policy` | VARCHAR(50) | NULLABLE | Política de empréstimos |
| `conversation_date` | DATE | NULLABLE | Data da conversa |
| `agreement_notes` | TEXT | NULLABLE | O que combinaram |
| `is_solo` | BOOLEAN | DEFAULT FALSE | Se mora sozinho |
| `accountability_frequency` | VARCHAR(20) | NULLABLE | Frequência de prestação de contas (se solo) |
| `accountability_topics` | JSONB | NULLABLE | Tópicos a compartilhar (se solo) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

**61. Tabela: `life_rules`** (consolidação das regras)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID das regras |
| `user_id` | UUID | FOREIGN KEY → users(id), UNIQUE | Usuário (1:1) |
| `commitment_phrase` | TEXT | NULLABLE | Frase de compromisso |
| `card_rules_active` | BOOLEAN | DEFAULT TRUE | Regras de cartão ativas |
| `emergency_fund_active` | BOOLEAN | DEFAULT TRUE | Caixinha ativa |
| `weekly_routine_active` | BOOLEAN | DEFAULT TRUE | Rotina ativa |
| `shared_commitments_active` | BOOLEAN | DEFAULT TRUE | Compromissos ativos |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

---

#### **Regras de Negócio**

1. **Alertas de Regras do Cartão:**
   ```python
   def verificar_regras_cartao(user_id, compra):
       regras = get_card_rules(user_id)
       alertas = []
       
       # Verifica limite por compra
       if compra.valor > regras.limit_per_purchase:
           if regras.require_justification:
               alertas.append({
                   'type': 'justification_required',
                   'message': f'Compra de R$ {compra.valor:.2f} excede seu limite de R$ {regras.limit_per_purchase:.2f}. Informe a justificativa.'
               })
       
       # Verifica teto mensal
       fatura_atual = get_fatura_atual(user_id)
       if fatura_atual + compra.valor > regras.monthly_ceiling:
           alertas.append({
               'type': 'ceiling_exceeded',
               'message': f'Esta compra fará sua fatura ultrapassar o teto de R$ {regras.monthly_ceiling:.2f}'
           })
       elif (fatura_atual + compra.valor) / regras.monthly_ceiling >= regras.alert_threshold / 100:
           alertas.append({
               'type': 'ceiling_warning',
               'message': f'Você atingiu {regras.alert_threshold}% do seu teto mensal'
           })
       
       # Verifica parcelamento
       if compra.parcelas > 1:
           if regras.installment_policy == 'never':
               alertas.append({
                   'type': 'installment_blocked',
                   'message': 'Sua regra não permite parcelamentos'
               })
           elif regras.installment_policy == 'max_3x' and compra.parcelas > 3:
               alertas.append({
                   'type': 'installment_exceeded',
                   'message': 'Sua regra permite no máximo 3 parcelas'
               })
       
       return alertas
   ```

2. **Lembrete de Depósito na Caixinha:**
   ```python
   def agendar_lembrete_caixinha(emergency_fund):
       # Agendar para todo mês
       for mes in range(1, 13):
           schedule_notification(
               user_id=emergency_fund.user_id,
               tipo='emergency_fund_deposit',
               data=date(ano_atual, mes, emergency_fund.deposit_day),
               mensagem=f'Hora de depositar R$ {emergency_fund.monthly_deposit:.2f} na sua caixinha de emergência!'
           )
   ```

3. **Checklist da Rotina Semanal:**
   ```python
   def gerar_checklist_semanal(user_id):
       # Puxa dados dos dias anteriores
       vencimentos_7_dias = get_vencimentos_proximos_7_dias(user_id)  # Dia 7
       orcamento = get_orcamento_minimo(user_id)  # Dia 9
       fatura = get_fatura_vs_teto(user_id)  # Dia 13
       acordos = get_acordos_ativos(user_id)  # Dia 12
       
       return {
           'vencimentos': {
               'proximos': vencimentos_7_dias,
               'total': sum(v.valor for v in vencimentos_7_dias)
           },
           'orcamento': {
               'sobra_falta': orcamento.balance,
               'status': 'ok' if orcamento.balance >= 0 else 'atencao'
           },
           'cartao': {
               'fatura': fatura.valor_atual,
               'teto': fatura.teto,
               'percentual': (fatura.valor_atual / fatura.teto) * 100
           },
           'acordos': {
               'ativos': len(acordos),
               'proxima_parcela': min(a.proxima_parcela for a in acordos) if acordos else None
           }
       }
   ```

---

#### **Outputs do App (Documentos Gerados)**

1. **Manual de Regras Financeiras** (PDF/Visualização no app)
   - Regras do cartão
   - Configuração da caixinha
   - Rotina semanal
   - Compromissos compartilhados
   - Frase de compromisso

2. **Cronograma de Depósitos** (Calendário)
   - 12 meses de depósitos na caixinha
   - Projeção de crescimento da reserva

3. **Checklist da Rotina Semanal** (PDF para impressão)
   - 6 itens padrão + personalizados
   - Espaço para anotações

---

#### **Fluxo de Integração com Dias Futuros**

**Dados do Dia 13 que serão reutilizados:**

- **Dia 14 (Plano 30/90):**
  - Valor do depósito mensal (`emergency_fund.monthly_deposit`) entra no checkpoint de 30 dias
  - Regras do cartão alimentam "Proteções ativas"

- **Dia 15 (Formatura):**
  - Rotina semanal (`weekly_routine`) é base do "Protocolo Semanal"
  - Regras do cartão aparecem no "Ver fatura vs. teto"
  - Caixinha aparece no "Painel de Progresso"
  - Frase de compromisso aparece no certificado

---

#### **Endpoints da API (Backend)**

**POST /api/v1/card-rules**
- **Payload:**
```json
{
  "user_id": "uuid",
  "allowed_uses": ["emergencia_saude", "mercado"],
  "limit_per_purchase": 100.00,
  "require_justification": true,
  "monthly_ceiling": 500.00,
  "alert_threshold": 80,
  "installment_policy": "max_3x",
  "post_invoice_action": "freeze"
}
```

**POST /api/v1/emergency-fund**
- **Payload:**
```json
{
  "user_id": "uuid",
  "account_type": "conta_digital",
  "account_name": "Reserva Nubank",
  "monthly_deposit": 50.00,
  "deposit_day": 5,
  "target_amount": 3000.00,
  "is_automated": false,
  "allowed_uses": ["emergencia_saude", "consertos_urgentes"],
  "access_difficulty": "banco_sem_app"
}
```

**POST /api/v1/weekly-routine**
- **Payload:**
```json
{
  "user_id": "uuid",
  "day_of_week": 0,
  "time": "19:00",
  "checklist_items": [
    "Ver contas próximos 7 dias",
    "Ver sobra/falta orçamento",
    "Ver fatura vs. teto",
    "Ver acordos ativos",
    "Fazer 1 ajuste",
    "Registrar vitória"
  ],
  "reminder_enabled": true,
  "reminder_channels": ["push", "whatsapp"],
  "reminder_advance": 30
}
```

**GET /api/v1/weekly-checklist/{user_id}**
- **Response 200:**
```json
{
  "week_of": "2024-01-15",
  "vencimentos": {
    "proximos": [...],
    "total": 850.00
  },
  "orcamento": {
    "sobra_falta": 150.00,
    "status": "ok"
  },
  "cartao": {
    "fatura": 320.00,
    "teto": 500.00,
    "percentual": 64
  },
  "acordos": {
    "ativos": 2,
    "proxima_parcela": "2024-01-20"
  }
}
```

---

### 📊 Métricas de Sucesso do Dia 13

1. **Taxa de Conclusão:** % que completa Dia 13
2. **Regras do Cartão Ativas:** % que ativa todas as regras
3. **Caixinha Configurada:** % que configura a caixinha
4. **Valor Médio de Depósito:** Média de R$ mensal para caixinha
5. **Rotina Semanal Ativada:** % que agenda rotina semanal
6. **Compromissos Compartilhados:** % que registra compromisso com parceiro
7. **Frases de Compromisso:** % que escreve frase personalizada
8. **Evolução do Termômetro:** Dia 12 vs Dia 13

---

---

## **DIA 14 — Plano 30/90 (Comprar Tempo no Caos)**

### 🎯 Título
**Plano 30/90: Seu GPS para Estabilidade e Tração Financeira**

### 🌅 Mensagem Matinal
Você já tem clareza das suas contas, cortou vazamentos, negociou dívidas e definiu regras. Agora vamos transformar tudo em um plano estruturado. Pense no Plano 30/90 como seu GPS: ele mostra o caminho até a estabilidade e a tração. Nos próximos 30 dias, o foco é respirar sem atrasos. Nos 90 dias seguintes, o foco é ganhar tração, reduzir juros e começar a sobrar. Este plano é vivo: se a vida mudar, você ajusta; se algo der errado, você recalibra. O importante é ter um roteiro simples e visual para não se perder.

### 📚 Conceito FIRE do Dia
**Planejamento é liberdade.** O FIRE valoriza planos simples, realistas e dinâmicos. O Plano 30/90 reúne três pilares: 1) **Essenciais** — tudo o que precisa ser pago nos próximos 30 dias para manter a vida funcionando; 2) **Dívidas prioritárias** — até três dívidas que você vai atacar primeiro, seja pagando o mínimo ou renegociando; 3) **Alavancas de 90 dias** — ações que aumentam renda ou reduzem gastos no médio prazo. Juntos, esses pilares criam um cronograma com checkpoints a cada 30, 60 e 90 dias para avaliar seu progresso.

### ✅ Seu Desafio Hoje
Construir um plano integrado de 30 e 90 dias que agrupa suas obrigações essenciais, dívidas prioritárias e estratégias de tração.

### 🎯 SUA TAREFA PRÁTICA

#### **Experiência do Usuário (UX/UI)**

**Tela de Introdução do Dia 14**
- **Header:** "Dia 14 — Plano 30/90"
- **Barra de progresso:** 0% → 100%
- **Card motivacional:** "Nos próximos 30 dias: respirar. Nos próximos 90 dias: crescer."
- **Badges:** Tempo estimado (25-35 min) | Requer (Dados de todos os dias anteriores)
- **CTA:** "Criar Meu Plano 30/90"

**Bloco Inicial: Seu Retrato Hoje**

**Card de Visão Geral:**

```
┌─────────────────────────────────────────────────────────────┐
│ 📊 SEU RETRATO FINANCEIRO HOJE                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ 💰 Orçamento Mínimo (30 dias)          R$ 3.650,00          │
│    Fonte: Dia 9                                              │
│                                                              │
│ 📅 Próximos Vencimentos (7 dias)       R$ 1.200,00          │
│    Fonte: Dia 7 | 4 contas                                   │
│                                                              │
│ 💳 Dívidas Críticas                    R$ 8.500,00          │
│    Fonte: Dia 12 | 2 acordos ativos                          │
│                                                              │
│ 🏦 Caixinha de Emergência              R$ 0,00              │
│    Meta: R$ 3.000,00                                         │
│                                                              │
│ 📈 Termômetro "Respirar"               6/10                  │
│    Evolução: Dia 1 (4) → Hoje (6)                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Botão:** "Ver detalhes" (abre gaveta lateral com mais informações)

---

**Fluxo Principal (5 Passos)**

**PASSO 1: Escolher Modo de Operação**

- **Título:** "Qual é a sua situação agora?"
- **Subtítulo:** "O modo define a intensidade das metas e alertas"

**Opções de Modo:**

**🔴 Modo Emergência Total**
```
Escolha se:
• Você está gastando mais do que ganha
• Há contas essenciais atrasadas
• Não consegue pagar o mínimo das dívidas
• Risco de corte de serviços (luz, água)

O que muda:
• Foco 100% em proteger o básico
• Metas mais conservadoras
• Alertas mais frequentes
• Nenhum gasto não-essencial
```

**🟡 Modo Equilibrar**
```
Escolha se:
• Você está no zero a zero (empata)
• Consegue pagar o básico, mas sem folga
• Está negociando dívidas ou pagando acordos
• Precisa de ajustes para sobrar dinheiro

O que muda:
• Foco em manter o básico e reduzir dívidas
• Metas moderadas
• Pequenas economias permitidas
• Alertas semanais
```

**🟢 Modo Tração Leve**
```
Escolha se:
• Você está sobrando um pouco todo mês
• Dívidas estão controladas ou zeradas
• Consegue poupar, mesmo que pouco
• Quer acelerar a construção da reserva

O que muda:
• Foco em crescer a caixinha
• Metas mais ambiciosas
• Pode começar a pensar em investimentos
• Alertas mensais
```

**Seleção:**
- Radio buttons com as 3 opções
- Ao selecionar, descrição completa aparece
- CTA: "Definir Modo"

**Sugestão Automática:**
```
💡 Baseado nos seus dados:
Você está gastando R$ 250 a mais do que ganha.
Sugerimos o Modo EQUILIBRAR.
```

**Rodapé:**
- Botão "Próximo Passo"

---

**PASSO 2: Plano 30 Dias — Essenciais**

- **Título:** "O que precisa ser pago nos próximos 30 dias?"
- **Subtítulo:** "Confirme seus essenciais e ajuste se necessário"

**Pré-carregamento Automático:**
- **Dias 7/9:** Vencimentos e orçamento mínimo

**Componente: Lista de Essenciais**

| Conta | Vencimento | Valor | Prioridade | Alerta | Ação |
|-------|------------|-------|------------|--------|------|
| Aluguel | 10/jan | R$ 1.200 | 🔴 Altíssima | 3 dias antes | [Editar] |
| Luz | 15/jan | R$ 180 | 🔴 Altíssima | 3 dias antes | [Editar] |
| Água | 20/jan | R$ 80 | 🔴 Altíssima | 3 dias antes | [Editar] |
| Mercado | Semanal | R$ 200/sem | 🔴 Altíssima | Domingo | [Editar] |
| Acordo Banco ABC | 20/jan | R$ 500 | 🟡 Alta | 3 dias antes | [Editar] |

**Para cada item:**
- Editar valor (se mudou)
- Alterar prioridade
- Configurar alerta
- Adicionar forma de pagamento

**Botão:** "+ Adicionar conta essencial"

**Resumo:**
```
📋 RESUMO DOS 30 DIAS
• Total de contas: 12
• Valor total: R$ 3.650,00
• Renda prevista: R$ 3.500,00
• Sobra/Falta: -R$ 150,00

⚠️ Atenção: Você precisa ajustar R$ 150,00
para fechar o mês sem vermelho.
```

**Rodapé:**
- Botão "Próximo Passo"

---

**PASSO 3: Plano 30 Dias — Dívidas Prioritárias**

- **Título:** "Quais dívidas você vai focar este mês?"
- **Subtítulo:** "Escolha no máximo 3 para não se sobrecarregar"

**Pré-carregamento:**
- **Dia 10/12:** Lista de dívidas e acordos

**Componente: Seletor de Dívidas**

**Dívidas Disponíveis:**

| Selecionar | Credor | Valor Total | Parcela | Juros | Status |
|------------|--------|-------------|---------|-------|--------|
| ☐ | Banco ABC | R$ 2.500 | R$ 500 | 0% | Acordo ativo |
| ☐ | Financeira XYZ | R$ 6.000 | R$ 500 | 2% | Acordo ativo |
| ☐ | Cartão DEF | R$ 3.000 | R$ 250 | 12% | Em negociação |

**Limite:** Máximo 3 dívidas selecionadas

**Para cada dívida selecionada, definir ação:**

**Card de Ação:**
```
┌─────────────────────────────────────────────────────────────┐
│ BANCO ABC - R$ 2.500                                         │
├─────────────────────────────────────────────────────────────┤
│ Ação para os próximos 30 dias:                               │
│                                                              │
│ ○ Pagar parcela normal (R$ 500)                              │
│ ○ Pagar valor extra (R$ ___)                                 │
│ ○ Negociar melhores condições                                │
│ ○ Proteger básico (pagar mínimo)                             │
│                                                              │
│ Data limite para ação: [Date picker]                         │
│ Canal de contato: [Dropdown]                                 │
│                                                              │
│ 💡 Sugestão: Pagar parcela normal.                           │
│    Acordo já está com boas condições.                        │
└─────────────────────────────────────────────────────────────┘
```

**Alerta de Sobrecarga:**
```
⚠️ Se você tentar pagar mais do que seu orçamento permite,
vai criar novos atrasos. Foque no que é sustentável.
```

**Rodapé:**
- Botão "Próximo Passo"

---

**PASSO 4: Plano 90 Dias — Alavancas**

- **Título:** "Escolha até 3 alavancas para os próximos 90 dias"
- **Subtítulo:** "Ações que aumentam renda ou reduzem gastos de forma significativa"

**Componente: Catálogo de Alavancas**

**Categoria: Aumentar Renda**
- 💼 Trabalho extra (freela, bico, horas extras)
- 🛒 Vender objetos que não usa mais
- 🏠 Alugar um cômodo ou vaga de garagem
- 📱 Serviços por aplicativo (Uber, iFood, etc.)
- 🎓 Monetizar uma habilidade (aulas, consultorias)

**Categoria: Reduzir Gastos**
- 📞 Renegociar contrato de internet/telefone
- 🔌 Trocar plano de energia para mais barato
- 🏦 Migrar para banco sem tarifas
- 🛡️ Renegociar seguro do carro
- 🏋️ Trocar academia cara por treino em casa/ar livre

**Para cada alavanca selecionada:**

**Card de Configuração:**
```
┌─────────────────────────────────────────────────────────────┐
│ 🛒 VENDER OBJETOS QUE NÃO USA MAIS                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Meta específica:                                             │
│ [Vender roupas e eletrônicos para arrecadar R$ 500___]       │
│                                                              │
│ Ação semanal:                                                │
│ [Fotografar e anunciar 5 itens por semana___]                │
│                                                              │
│ Critério de sucesso:                                         │
│ [Arrecadar pelo menos R$ 500 em 90 dias___]                  │
│                                                              │
│ Prazo: [Date picker]                                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Limite:** Máximo 3 alavancas

**Sugestões Baseadas no Perfil:**
```
💡 Baseado no seu orçamento:
• Você gasta R$ 99/mês em internet. Poderia pagar R$ 49.
  Economia potencial: R$ 50/mês = R$ 600/ano
  
• Você tem tarifas bancárias de R$ 30/mês.
  Migrar para banco digital economiza R$ 360/ano
```

**Rodapé:**
- Botão "Próximo Passo"

---

**PASSO 5: Checkpoints e Compromisso**

- **Título:** "Defina seus marcos de sucesso"
- **Subtítulo:** "Checkpoints a cada 30 dias para avaliar progresso"

**Componente: Timeline de Checkpoints**

```
         HOJE                30 DIAS              60 DIAS              90 DIAS
          │                     │                    │                    │
          ●────────────────────●────────────────────●────────────────────●
          │                     │                    │                    │
     Plano criado          ESTÁVEL              MENOS               COMEÇOU
                                                PRESSÃO              A SOBRAR
```

**Checkpoint 30 Dias — "Estável"**
- ☐ Sem novos atrasos em contas essenciais
- ☐ Cartão sob controle (abaixo do teto)
- ☐ Rotina semanal rodando
- ☐ Acordos pagos em dia
- Meta automática baseada nos dados

**Checkpoint 60 Dias — "Menos Pressão"**
- ☐ Juros reduzidos ou eliminados
- ☐ Pelo menos 1 acordo fechado ou quitado
- ☐ Redução de pelo menos R$ ___ em despesas
- ☐ Caixinha com pelo menos R$ ___
- Meta ajustável pelo usuário

**Checkpoint 90 Dias — "Começou a Sobrar"**
- ☐ Folga positiva no orçamento
- ☐ Caixinha crescendo (meta: R$ ___)
- ☐ Todas as alavancas executadas
- ☐ Termômetro "Respirar" acima de 7
- Meta ajustável pelo usuário

**Agendamento:**
- Toggle: "Agendar lembretes de checkpoint"
- Datas automáticas: Hoje + 30, +60, +90 dias
- Canais: Checkboxes (Push / WhatsApp / E-mail)

**Frase de Compromisso:**
- Textarea: "Escreva seu compromisso para os próximos 90 dias"
- Sugestões:
  - "Nos próximos 30 dias vou priorizar o básico, e nos próximos 90 dias vou abrir espaço para crescer"
  - "Cada dia é uma chance de melhorar minha vida financeira"
  - "Eu estou no controle do meu dinheiro"

**Atualização do Termômetro "Respirar":**
- "Após criar seu Plano 30/90, como você se sente?"
- Slider 0-10 + justificativa

**Rodapé:**
- "Salvar Rascunho"
- "Concluir Dia 14 e Gerar Meu Plano 30/90"

---

**Tela de Conclusão do Dia 14:**

```
🎉 Dia 14 Concluído!

Seu Plano 30/90 está pronto:

📋 MODO: Equilibrar

📅 PRÓXIMOS 30 DIAS:
• 12 contas essenciais mapeadas
• 2 dívidas em foco
• Total: R$ 3.650

🚀 PRÓXIMOS 90 DIAS:
• 3 alavancas definidas
• Potencial de economia: R$ 500

📍 CHECKPOINTS:
• 30 dias: 15/fev — Estável
• 60 dias: 15/mar — Menos Pressão
• 90 dias: 15/abr — Começou a Sobrar

Amanhã é sua FORMATURA! 🎓
Você vai consolidar tudo em um protocolo
semanal e receber seu certificado.

Próximo: Dia 15 - Formatura
```

---

### 🗄️ Infraestrutura (Backend + Fluxo de Dados)

#### **Tabelas do Banco de Dados**

**62. Tabela: `plans`** (planos 30/90)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do plano |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `cycle_type` | VARCHAR(10) | NOT NULL | '30' / '90' |
| `mode` | VARCHAR(20) | NOT NULL | 'emergency' / 'balance' / 'traction' |
| `start_date` | DATE | NOT NULL | Data de início |
| `end_date` | DATE | NOT NULL | Data de término |
| `status` | VARCHAR(20) | DEFAULT 'active' | 'active' / 'completed' / 'abandoned' |
| `commitment_phrase` | TEXT | NULLABLE | Frase de compromisso |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

**63. Tabela: `plan_essentials`** (essenciais do plano)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do essencial |
| `plan_id` | UUID | FOREIGN KEY → plans(id) | Plano relacionado |
| `name` | VARCHAR(100) | NOT NULL | Nome da conta |
| `due_date` | DATE | NOT NULL | Vencimento |
| `amount` | DECIMAL(10,2) | NOT NULL | Valor |
| `priority` | VARCHAR(20) | NOT NULL | 'critical' / 'high' / 'medium' |
| `alert_days_before` | INTEGER | DEFAULT 3 | Dias de antecedência do alerta |
| `payment_method` | VARCHAR(30) | NULLABLE | Forma de pagamento |
| `status` | VARCHAR(20) | DEFAULT 'pending' | 'pending' / 'paid' / 'overdue' |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**64. Tabela: `plan_debt_priorities`** (dívidas prioritárias)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da prioridade |
| `plan_id` | UUID | FOREIGN KEY → plans(id) | Plano relacionado |
| `debt_id` | UUID | FOREIGN KEY → debts(id) | Dívida |
| `action_type` | VARCHAR(30) | NOT NULL | 'pay_normal' / 'pay_extra' / 'negotiate' / 'pay_minimum' |
| `action_value` | DECIMAL(10,2) | NULLABLE | Valor da ação (se aplicável) |
| `action_due_date` | DATE | NULLABLE | Data limite para ação |
| `channel` | VARCHAR(50) | NULLABLE | Canal de contato |
| `status` | VARCHAR(20) | DEFAULT 'pending' | 'pending' / 'in_progress' / 'completed' |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**65. Tabela: `plan_levers`** (alavancas)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da alavanca |
| `plan_id` | UUID | FOREIGN KEY → plans(id) | Plano relacionado |
| `lever_type` | VARCHAR(50) | NOT NULL | Tipo de alavanca |
| `category` | VARCHAR(30) | NOT NULL | 'increase_income' / 'reduce_expense' |
| `goal_text` | TEXT | NOT NULL | Meta específica |
| `weekly_action` | TEXT | NOT NULL | Ação semanal |
| `success_criteria` | TEXT | NOT NULL | Critério de sucesso |
| `deadline` | DATE | NULLABLE | Prazo |
| `status` | VARCHAR(20) | DEFAULT 'pending' | 'pending' / 'in_progress' / 'completed' / 'abandoned' |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**66. Tabela: `plan_checkpoints`** (checkpoints)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do checkpoint |
| `plan_id` | UUID | FOREIGN KEY → plans(id) | Plano relacionado |
| `checkpoint_date` | DATE | NOT NULL | Data do checkpoint |
| `checkpoint_type` | VARCHAR(10) | NOT NULL | '30' / '60' / '90' |
| `checklist` | JSONB | NOT NULL | Itens do checklist |
| `notes` | TEXT | NULLABLE | Observações |
| `status` | VARCHAR(20) | DEFAULT 'pending' | 'pending' / 'completed' |
| `completed_at` | TIMESTAMP | NULLABLE | Data de conclusão |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

---

#### **Regras de Negócio**

1. **Limitação de Dívidas e Alavancas:**
   ```python
   def validar_selecoes(user_id, dividas_selecionadas, alavancas_selecionadas):
       if len(dividas_selecionadas) > 3:
           return {'valid': False, 'message': 'Selecione no máximo 3 dívidas'}
       if len(alavancas_selecionadas) > 3:
           return {'valid': False, 'message': 'Selecione no máximo 3 alavancas'}
       return {'valid': True}
   ```

2. **Sugestão Automática de Modo:**
   ```python
   def sugerir_modo(user_id):
       orcamento = get_orcamento_minimo(user_id)
       
       if orcamento.balance < -500:  # Déficit maior que R$ 500
           return 'emergency'
       elif orcamento.balance < 0:  # Déficit menor
           return 'balance'
       elif orcamento.balance < orcamento.total_income * 0.1:  # Menos de 10% de sobra
           return 'balance'
       else:
           return 'traction'
   ```

3. **Geração de Checkpoints:**
   ```python
   def gerar_checkpoints(plan):
       checkpoints = []
       
       # Checkpoint 30 dias
       checkpoints.append({
           'plan_id': plan.id,
           'checkpoint_date': plan.start_date + timedelta(days=30),
           'checkpoint_type': '30',
           'checklist': [
               {'item': 'Sem novos atrasos em contas essenciais', 'completed': False},
               {'item': 'Cartão sob controle (abaixo do teto)', 'completed': False},
               {'item': 'Rotina semanal rodando', 'completed': False},
               {'item': 'Acordos pagos em dia', 'completed': False}
           ]
       })
       
       # Checkpoint 60 dias
       checkpoints.append({
           'plan_id': plan.id,
           'checkpoint_date': plan.start_date + timedelta(days=60),
           'checkpoint_type': '60',
           'checklist': [
               {'item': 'Juros reduzidos ou eliminados', 'completed': False},
               {'item': 'Pelo menos 1 acordo fechado ou quitado', 'completed': False},
               {'item': 'Redução em despesas alcançada', 'completed': False},
               {'item': 'Caixinha com saldo inicial', 'completed': False}
           ]
       })
       
       # Checkpoint 90 dias
       checkpoints.append({
           'plan_id': plan.id,
           'checkpoint_date': plan.start_date + timedelta(days=90),
           'checkpoint_type': '90',
           'checklist': [
               {'item': 'Folga positiva no orçamento', 'completed': False},
               {'item': 'Caixinha crescendo', 'completed': False},
               {'item': 'Todas as alavancas executadas', 'completed': False},
               {'item': 'Termômetro Respirar acima de 7', 'completed': False}
           ]
       })
       
       return checkpoints
   ```

---

#### **Outputs do App (Documentos Gerados)**

1. **Plano 30/90 Completo** (PDF/Visualização)
   - Modo selecionado
   - Lista de essenciais com valores e datas
   - Dívidas prioritárias com ações definidas
   - Alavancas com metas e prazos
   - Calendário de checkpoints

2. **Resumo Visual (Timeline/Gantt)**
   - Marcos de 30, 60 e 90 dias
   - Indicadores visuais de progresso

3. **Frase de Compromisso** (para impressão/wallpaper)

---

#### **Endpoints da API (Backend)**

**POST /api/v1/plan-30-90**
- **Payload:**
```json
{
  "user_id": "uuid",
  "mode": "balance",
  "essentials": [...],
  "debt_priorities": [
    {
      "debt_id": "uuid",
      "action_type": "pay_normal",
      "action_due_date": "2024-01-20"
    }
  ],
  "levers": [
    {
      "lever_type": "sell_items",
      "category": "increase_income",
      "goal_text": "Arrecadar R$ 500",
      "weekly_action": "Anunciar 5 itens",
      "success_criteria": "R$ 500 em 90 dias",
      "deadline": "2024-04-15"
    }
  ],
  "commitment_phrase": "Nos próximos 30 dias vou priorizar o básico..."
}
```

- **Response 201:**
```json
{
  "success": true,
  "message": "Plano 30/90 criado com sucesso!",
  "data": {
    "plan_id": "uuid",
    "mode": "balance",
    "checkpoints": [
      {"date": "2024-02-15", "type": "30"},
      {"date": "2024-03-15", "type": "60"},
      {"date": "2024-04-15", "type": "90"}
    ]
  }
}
```

---

### 📊 Métricas de Sucesso do Dia 14

1. **Taxa de Conclusão:** % que completa Dia 14
2. **Distribuição de Modos:** % em cada modo (Emergência/Equilibrar/Tração)
3. **Essenciais Mapeados:** Média de itens por plano
4. **Dívidas Selecionadas:** Média de dívidas em foco
5. **Alavancas Configuradas:** Média de alavancas por usuário
6. **Potencial de Economia:** Soma das economias projetadas pelas alavancas
7. **Checkpoints Agendados:** % que agenda lembretes
8. **Evolução do Termômetro:** Dia 13 vs Dia 14

---





---

## **DIA 15 — Formatura: Celebrando Sua Transformação e Planejando o Próximo Capítulo**

### 🎯 Título
**Formatura FIRE: Celebrando Sua Nova Vida Financeira e Criando o Protocolo de Manutenção**

### 🌅 Mensagem Matinal
Você chegou ao final de uma jornada de 15 dias que transformou sua relação com o dinheiro. Lá no Dia 1, talvez você estivesse ansioso, confuso ou até assustado com suas finanças. Hoje, você tem clareza do que entra e sai da sua conta, identificou vazamentos, cortou o que não precisa, negociou dívidas e criou regras de proteção. Isso é motivo de celebração! A formatura não é o fim, mas o começo de uma nova fase. Hoje você vai consolidar tudo o que aprendeu, celebrar suas conquistas e criar um protocolo de manutenção para garantir que os próximos 15 dias, 15 meses e 15 anos sigam no caminho certo.

### 📚 Conceito FIRE do Dia
**Celebração e manutenção são parte do processo.** O movimento FIRE não é apenas sobre números e planilhas — é sobre reconhecer progresso e usar essa energia para continuar avançando. Estudos de mudança de comportamento mostram que celebrar conquistas aumenta significativamente a probabilidade de mantê-las. Outro princípio é a criação de sistemas sustentáveis: não basta fazer uma faxina financeira uma vez; é preciso criar rotinas, alertas e checkpoints que mantenham a casa organizada. O protocolo semanal e os lembretes de checkpoint que você vai criar hoje são a infraestrutura da sua liberdade financeira duradoura.

### ✅ Seu Desafio Hoje
Celebrar sua transformação completando todos os 15 dias, gerar seu certificado de conclusão, criar o protocolo de manutenção semanal e planejar os próximos passos da sua jornada FIRE.

### 🎯 SUA TAREFA PRÁTICA

#### **Experiência do Usuário (UX/UI)**

**Tela de Boas-Vindas da Formatura**
- **Header:** "🎓 DIA 15 — SUA FORMATURA"
- **Barra de progresso:** 93% → 100%
- **Animação:** Fogos de artifício + animação de capa de formatura
- **Badge:** "15 Dias Completados"
- **Card motivacional:** "Parabéns! Você investiu tempo, energia e coragem para transformar suas finanças. Hoje celebramos cada passo dessa jornada."
- **CTA:** "Receber Meu Certificado"

---

**TELA PRINCIPAL DA FORMATURA**

**Bloco 1: Retrospectiva da Jornada**

**Timeline Visual:**
```
DIA 1          DIA 5          DIA 10          DIA 15
  │              │              │               │
  ●──────────────●──────────────●───────────────●
  │              │              │               │
Despertar     Cartão &      Negociação      Formatura
Consciência   Vazamentos    Dívidas         Celebração
```

**Card de Evolução do Termômetro "Respirar":**

| Métrica | Dia 1 | Dia 15 | Evolução |
|---------|-------|--------|----------|
| Nota | 4/10 | 7/10 | +3 pontos |
| Sentimento | Ansioso | Confiante | Transformação |

**Evolução Visual:**
```
DIA 1:  😐 Não aguento mais → 😊 Respirando melhor
DIA 15: 😊 Confiante com o futuro
```

**Seção "Suas Conquistas":**

- ✅ Mapeou todas as entradas e saídas de dinheiro
- ✅ Identificou e planejou eliminar vazamentos invisíveis
- ✅ Implementou a Regra da Pausa para compras por impulso
- ✅ Criou controle de cartão com limites e proteções
- ✅ Organizou calendário de vencimentos
- ✅ Definiu orçamento mínimo de sobrevivência
- ✅ Negociou dívidas e criou acordos
- ✅ Estabeleceu regras de vida e proteções
- ✅ Criou plano 30/90 com metas claras

---

**Bloco 2: Painel de Progresso Consolidado**

**Card de Visão Geral:**

```
┌─────────────────────────────────────────────────────────────┐
│ 📊 MEU PAINEL DE PROGRESSO FIRE                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ 💰 RENDA MENSAL                                             │
│    Total de entradas: R$ 3.500,00                           │
│                                                              │
│ 📤 GASTOS MENSAIS                                           │
│    Fixos essenciais: R$ 2.100,00                            │
│    Variáveis (teto): R$ 800,00                              │
│    Total: R$ 2.900,00                                       │
│                                                              │
│ 💵 SOBRA PREVISTA                                           │
│    R$ 600,00 por mês                                        │
│                                                              │
│ 💳 DÍVIDAS                                                   │
│    Total restante: R$ 6.000,00                              │
│    Acordos ativos: 2                                        │
│    Meta de quitação: 12 meses                               │
│                                                              │
│ 🏦 CAIXINHA DE EMERGÊNCIA                                   │
│    Meta: R$ 3.000,00 (3 meses)                              │
│    Depósito mensal: R$ 50,00                                │
│                                                              │
│ 💳 CARTÃO                                                    │
│    Teto mensal: R$ 500,00                                   │
│    Fatura atual: R$ 120,00 (24%)                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

**Bloco 3: Certificado de Conclusão**

**Preview do Certificado:**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    🎓 CERTIFICADO 🎓                        │
│                                                             │
│           APP FIRE BRASIL — 15 DIAS PARA                    │
│          INDEPENDÊNCIA FINANCEIRA                           │
│                                                             │
│                  ─────────────────                          │
│                                                             │
│         Certificamos que [Nome do Usuário]                  │
│                                                             │
│         completou com êxito o desafio de                    │
│         15 dias para transformação financeira,              │
│         demonstrando comprometimento, disciplina            │
│         e coragem para mudar sua relação com                │
│         o dinheiro.                                         │
│                                                             │
│         Data: [Data de hoje]                                │
│                                                             │
│         "Cada decisão me aproxima da                        │
│          independência financeira."                         │
│                                                             │
│                  —────────────────                          │
│                                                             │
│         Frase de Compromisso:                               │
│         "Eu protejo meu dinheiro com regras                 │
│          claras e disciplina diária."                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Ações do Certificado:**
- Botão: "Baixar PDF do Certificado"
- Botão: "Compartilhar nas Redes" (gera imagem otimizada para stories/posts)
- Botão: "Definir como Wallpaper"

---

**Bloco 4: Protocolo Semanal de Manutenção**

**Título:** "Seu Protocolo de Sobrevivência Financeira"
**Subtítulo:** "As rotinas semanais que vão manter você no caminho certo"

**Checklist Semanal Interativo:**

```
┌─────────────────────────────────────────────────────────────┐
│ 📅 PROTOCOLO SEMANAL — Domingo às 19:00                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ✅ VERIFICAR PRÓXIMOS 7 DIAS                                │
│    • Quais contas vencem?                                   │
│    • Quanto preciso separar?                                │
│                                                              │
│ ✅ VERIFICAR FATURA DO CARTÃO                               │
│    • Está abaixo do teto?                                   │
│    • Precisa de ajuste?                                     │
│                                                              │
│ ✅ REVISAR SOBRA/FALTA DO ORÇAMENTO                         │
│    • Quanto sobrou ou faltou?                               │
│    • Precisa de ajuste?                                     │
│                                                              │
│ ✅ ACORDOS E DÍVIDAS                                        │
│    • Todos pagos em dia?                                    │
│    • Próximas parcelas?                                     │
│                                                              │
│ ✅ FAZER 1 AJUSTE PEQUENO                                   │
│    • Cortar um gasto?                                       │
│    • Renegociar uma conta?                                  │
│    • Aumentar renda?                                        │
│                                                              │
│ ✅ REGISTRAR 1 VITÓRIA                                      │
│    • O que você conquistou esta semana?                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Ativação do Protocolo:**
- Toggle: "Ativar lembretes do Protocolo Semanal" ✅
- Dia: Domingo (padrão) | Horário: 19:00 (padrão)
- Canais: Push + WhatsApp

**Visualização do Checklist:**

- **Formato:** Lista interativa com checkboxes
- **Progresso:** Barra de progresso semanal (0% → 100%)
- **Histórico:** Semana atual + 4 semanas anteriores
- **Motivação:** "Você completou 4/6 protocolos este mês!"

---

**Bloco 5: Próximos Passos — Roadmap FIRE**

**Roadmap Visual:**

```
FASE 1: ESTABILIDADE (0-30 dias)
├── Pagar todas as contas em dia
├── Manter cartão abaixo do teto
├── Seguir protocolo semanal
└── Resultado: Zero novos atrasos

FASE 2: REDUÇÃO DE DÍVIDAS (30-90 dias)
├── Pagar acordos em dia
├── Reduzir 50% das dívidas
├── Começar a caixinha de emergência
└── Resultado: Menos pressão, mais controle

FASE 3: TRAÇÃO (90-180 dias)
├── Quitar primeira dívida
├── Caixinha de emergência completa
├── Sobra consistente no orçamento
└── Resultado: Prontidão para investir

FASE 4: INDEPENDÊNCIA (1-3 anos)
├── Estabilidade completa
├── Reserva de emergência robusta
├── Investimentos crescendo
└── Resultado: Liberdade financeira em construção
```

**Próximas Metas SMART:**

```
┌─────────────────────────────────────────────────────────────┐
│ 🎯 MINHAS METAS DOS PRÓXIMOS 90 DIAS                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ 📌 Meta 1: Estável                                          │
│    • Data: 15/fev                                           │
│    • Critério: Zero novos atrasos                           │
│                                                              │
│ 📌 Meta 2: Caixinha Inicial                                 │
│    • Data: 15/mar                                           │
│    • Critério: R$ 500 na reserva                            │
│                                                              │
│ 📌 Meta 3: Primeira Dívida Quitada                          │
│    • Data: 15/abr                                           │
│    • Critério: Acordo ABC quitado                           │
│                                                              │
│ 📌 Meta 4: Evolução do Termômetro                           │
│    • Data: 15/abr                                           │
│    • Critério: Nota 8/10 no "Respirar"                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

**Bloco 6: Convite para Comunidade**

**Título:** "Você não está sozinho nessa jornada"

**Comunidade FIRE Brasil:**
- Grupo no Telegram/WhatsApp
- Encontros mensais (online/offline)
- Mentoria em grupo
- Conteúdos exclusivos

**Botão:** "Entrar para a Comunidade"
**Badge:** "Formado FIRE — Turma [Data]"

---

**Bloco 7: Avaliação da Jornada**

**Pergunta:** "Como você avalia sua experiência nos 15 dias?"

- ⭐⭐⭐⭐⭐ Excelente
- ⭐⭐⭐⭐ Muito Bom
- ⭐⭐⭐⭐ Regular
- ⭐⭐⭐ Ruim
- ⭐⭐ Muito Ruim

**Pergunta aberta:** "O que você mais gostou e o que podemos melhorar?" (Textarea opcional)

---

**Bloco 8: Compromisso Final**

**Frase de Compromisso:**
"Eu, [Nome], me comprometo a manter minha vida financeira organizada, seguir meu protocolo semanal, proteger minha caixinha de emergência e trabalhar continuamente para conquistar minha independência financeira."

**Assinatura Digital:**
- Campo de assinatura (desenho com o dedo)
- Data: [Hoje]

**Botão Principal:** "CONCLUIR MEU DESAFIO FIRE 15 DIAS"

---

**TELA FINAL: CELEBRAÇÃO**

**Animação de Formatura:**
- Fogos de artifício
- Som de aplausos
- Aniversário no app (opcional)

**Card de Parabenização:**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    🎉 PARABÉNS! 🎉                          │
│                                                             │
│      Você completou o desafio FIRE 15 Dias!                 │
│                                                             │
│      Sua transformação começou hoje.                        │
│      Seus números estão claros.                             │
│      Suas proteções estão ativas.                           │
│      Seu plano está definido.                               │
│                                                             │
│      O mais importante:                                     │
│      Você não está mais sozinho nessa jornada.              │
│                                                             │
│      Bem-vindo à comunidade FIRE Brasil!                    │
│                                                             │
│      Vamos continuar juntos?                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Próximos Passos:**
- Botão: "Acessar meu Dashboard"
- Botão: "Ver Protocolo Semanal"
- Botão: "Baixar Certificado"

---

### 🗄️ Infraestrutura (Backend + Fluxo de Dados)

#### **Tabelas do Banco de Dados**

**67. Tabela: `graduation_log`** (registro da formatura)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do registro |
| `user_id` | UUID | FOREIGN KEY → users(id), UNIQUE | Usuário |
| `graduation_date` | TIMESTAMP | NOT NULL | Data da formatura |
| `initial_breathe_score` | INTEGER | NOT NULL | Nota Dia 1 |
| `final_breathe_score` | INTEGER | NOT NULL | Nota Dia 15 |
| `days_completed` | INTEGER | NOT NULL | Dias concluídos (15) |
| `commitment_phrase` | TEXT | NULLABLE | Frase de compromisso final |
| `signature_data` | TEXT | NULLABLE | Assinatura digital (base64) |
| `rating` | INTEGER | CHECK (1-5) | Avaliação da experiência |
| `feedback` | TEXT | NULLABLE | Feedback opcional |
| `certificate_url` | VARCHAR(500) | NULLABLE | URL do PDF do certificado |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**68. Tabela: `weekly_protocol`** (protocolo semanal ativo)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do protocolo |
| `user_id` | UUID | FOREIGN KEY → users(id), UNIQUE | Usuário |
| `day_of_week` | INTEGER | NOT NULL, CHECK (0-6) | Dia da semana |
| `time` | TIME | NOT NULL | Horário |
| `reminder_enabled` | BOOLEAN | DEFAULT TRUE | Se lembrete ativo |
| `reminder_channels` | JSONB | DEFAULT '["push"]' | Canais |
| `is_active` | BOOLEAN | DEFAULT TRUE | Se está ativo |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

**69. Tabela: `weekly_protocol_logs`** (execução do protocolo)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do log |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `protocol_id` | UUID | FOREIGN KEY → weekly_protocol(id) | Protocolo |
| `week_date` | DATE | NOT NULL | Data da semana |
| `checklist_completed` | JSONB | NOT NULL | Checklist completado |
| `victory_note` | TEXT | NULLABLE | Vitória registrada |
| `adjustment_note` | TEXT | NULLABLE | Ajuste realizado |
| `time_spent` | INTEGER | NULLABLE | Tempo gasto (minutos) |
| `completed_at` | TIMESTAMP | NULLABLE | Data de conclusão |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |

**70. Tabela: `smart_goals`** (metas SMART)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID da meta |
| `user_id` | UUID | FOREIGN KEY → users(id) | Usuário |
| `goal_number` | INTEGER | NOT NULL, CHECK (1-4) | Número da meta |
| `title` | VARCHAR(100) | NOT NULL | Título da meta |
| `description` | TEXT | NULLABLE | Descrição |
| `target_date` | DATE | NOT NULL | Data alvo |
| `criteria` | TEXT | NOT NULL | Critério de sucesso |
| `status` | VARCHAR(20) | DEFAULT 'pending' | pending/in_progress/completed |
| `progress` | INTEGER | DEFAULT 0 | Progresso (0-100) |
| `completed_at` | TIMESTAMP | NULLABLE | Data de conclusão |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

**Constraint:** UNIQUE(user_id, goal_number)

**71. Tabela: `roadmap_progress`** (progresso no roadmap)
| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID do registro |
| `user_id` | UUID | FOREIGN KEY → users(id), UNIQUE | Usuário |
| `current_phase` | VARCHAR(30) | NOT NULL | Fase atual |
| `phase_1_complete` | BOOLEAN | DEFAULT FALSE | Estabilidade |
| `phase_1_date` | DATE | NULLABLE | Data de conclusão |
| `phase_2_complete` | BOOLEAN | DEFAULT FALSE | Redução de dívidas |
| `phase_2_date` | DATE | NULLABLE | Data de conclusão |
| `phase_3_complete` | BOOLEAN | DEFAULT FALSE | Tração |
| `phase_3_date` | DATE | NULLABLE | Data de conclusão |
| `phase_4_complete` | BOOLEAN | DEFAULT FALSE | Independência |
| `phase_4_date` | DATE | NULLABLE | Data de conclusão |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última atualização |

---

#### **Regras de Negócio**

1. **Validação de Conclusão do Desafio:**
   ```python
   def validar_formatura(user_id):
       # Verificar se todos os 15 dias foram completados
       dias_concluidos = count_completed_days(user_id)
       if dias_concluidos < 15:
           return {'valid': False, 'message': 'Complete todos os dias primeiro'}
       
       # Verificar se dados essenciais estão preenchidos
       if not has_financial_snapshot(user_id):
           return {'valid': False, 'message': 'Complete o Raio-X financeiro'}
       
       return {'valid': True}
   ```

2. **Geração do Certificado:**
   ```python
   def gerar_certificado(user_id):
       user = get_user(user_id)
       assessment = get_initial_assessment(user_id)
       daily_logs = get_daily_logs(user_id)
       
       breath_evolution = {
           'day1': daily_logs[0].breathe_score,
           'day15': daily_logs[14].breathe_score
       }
       
       # Gerar PDF com biblioteca (ReportLab, WeasyPrint, etc.)
       certificate_data = {
           'name': user.name,
           'date': datetime.now().strftime('%d/%m/%Y'),
           'commitment_phrase': user.commitment_phrase,
           'breath_evolution': breath_evolution
       }
       
       return generate_pdf(certificate_data)
   ```

3. **Checklist do Protocolo Semanal:**
   ```python
   def gerar_checklist_semanal(user_id):
       # Puxa dados de todos os dias anteriores
       vencimentos = get_vencimentos_proximos_7_dias(user_id)
       orcamento = get_orcamento_minimo(user_id)
       fatura = get_fatura_vs_teto(user_id)
       acordos = get_acordos_ativos(user_id)
       
       return {
           'vencimentos': {
               'proximos': vencimentos,
               'total': sum(v.amount for v in vencimentos),
               'urgentes': [v for v in vencimentos if v.days_until <= 3]
           },
           'orcamento': {
               'balance': orcamento.balance,
               'status': 'atencao' if orcamento.balance < 0 else 'ok'
           },
           'cartao': {
               'fatura': fatura.valor_atual,
               'teto': fatura.teto,
               'percentual': (fatura.valor_atual / fatura.teto) * 100,
               'status': 'critico' if fatura.valor_atual > fatura.teto else 'ok'
           },
           'acordos': {
               'ativos': len(acordos),
               'proximas_parcelas': [a for a in acordos if a.days_until <= 7]
           }
       }
   ```

4. **Cálculo de Evolução do Termômetro:**
   ```python
   def calcular_evolucao_respirar(user_id):
       logs = get_daily_logs(user_id, limit=15)
       
       day1_score = logs[0].breathe_score
       day15_score = logs[-1].breathe_score
       improvement = day15_score - day1_score
       
       if improvement >= 3:
           message = "Transformação incrível! Você deu um salto enorme."
       elif improvement >= 1:
           message = "Bons progressos! Continue mantendo o foco."
       else:
           message = "Keep going! A mudança leva tempo."
       
       return {
           'day1': day1_score,
           'day15': day15_score,
           'improvement': improvement,
           'message': message
       }
   ```

5. **Lembretes de Checkpoint:**
   ```python
   def agendar_checkpoints_30_60_90(user_id):
       today = date.today()
       
       checkpoints = [
           {'days': 30, 'date': today + timedelta(days=30)},
           {'days': 60, 'date': today + timedelta(days=60)},
           {'days': 90, 'date': today + timedelta(days=90)}
       ]
       
       for cp in checkpoints:
           create_notification(
               user_id=user_id,
               tipo='checkpoint_30_60_90',
               data=cp['date'],
               mensagem=f'Checkpoint de {cp["days"]} dias! Hora de avaliar seu progresso no Plano 30/90.'
           )
   ```

---

#### **Outputs do App (Documentos Gerados)**

1. **Certificado de Conclusão FIRE** (PDF/Imagem compartilhável)
   - Nome do formando
   - Data da formatura
   - Frase de compromisso
   - Evolução do Termômetro (antes/depois)
   - Badge de formatação
   - Assinatura digital do usuário

2. **Painel de Progresso Consolidado** (Dashboard no app)
   - Visão geral de renda, gastos e dívidas
   - Status da caixinha de emergência
   - Controle do cartão
   - Próximos vencimentos
   - Metas ativas

3. **Protocolo Semanal** (Checklist interativo)
   - Checklist semanal configurável
   - Histórico de 4 semanas
   - Percentual de conclusão
   - Lembretes automáticos

4. **Roadmap FIRE** (Timeline visual)
   - Fases 1-4 com critérios de conclusão
   - Próximas metas SMART
   - Datas alvo

5. **Relatório de Evolução** (PDF)
   - Comparação Dia 1 vs Dia 15
   - Todas as métricas consolidadas
   - Principais conquistas
   - Recomendações para os próximos 90 dias

---

#### **Fluxo de Integração com Dias Futuros**

**O Dia 15 é o ponto de partida para o ciclo contínuo:**

- **Protocolo Semanal → Checkpoints 30/60/90:**
  - O checklist semanal gera dados para os checkpoints
  - Usuário responde avaliação em cada checkpoint
  - Backend compara progresso com metas definidas no Dia 14

- **Dashboard → Próximas Ações:**
  - Próximos 7 dias: Vencimentos
  - Próximas 2 semanas: Acordos
  - Próximos 30 dias: Metas de fase

- **Evolução do Termômetro → Métricas de Bem-estar:**
  - Acompanhamento contínuo
  - Alertas se score cair abaixo de 5 por 2 semanas seguidas
  - Sugestão de revisão de prioridades

- **Comunidade FIRE → Suporte Contínuo:**
  - Grupo de apoio
  - Mentoria em grupo
  - Conteúdos exclusivos
  - Indicadores de progresso comparativos (anonimizados)

---

#### **Endpoints da API (Backend)**

**POST /api/v1/graduation/complete**
- **Payload:**
```json
{
  "user_id": "uuid",
  "commitment_phrase": "Eu me comprometo a proteger...",
  "signature_data": "data:image/png;base64,...",
 5,
  "feedback": "  "rating":Excelente experiência!..."
}
```

- **Response 201:**
```json
{
  "success": true,
  "message": "Parabéns! Você formou no FIRE 15 Dias!",
  "data": {
    "graduation_id": "uuid",
    "certificate_url": "https://cdn.app.com/certificates/uuid.pdf",
    "evolution": {
      "day1_breathe": 4,
      "day15_breathe": 7,
      "improvement": 3
    },
    "next_steps": {
      "protocol_weekly": "ativado",
      "first_checkpoint": "2024-02-15"
    }
  }
}
```

**GET /api/v1/dashboard/{user_id}**
- **Response 200:**
```json
{
  "user_id": "uuid",
  "phase": "estabilidade",
  "financial_summary": {
    "monthly_income": 3500.00,
    "monthly_expenses": 2900.00,
    "monthly_balance": 600.00,
    "total_debt": 6000.00,
    "emergency_fund": 0.00
  },
  "upcoming_bills": [...],
  "active_agreements": [...],
  "card_status": {
    "current_invoice": 120.00,
    "ceiling": 500.00,
    "percent_used": 24
  },
  "weekly_protocol": {
    "active": true,
    "next_reminder": "2024-01-21T19:00:00Z"
  },
  "next_checkpoint": "2024-02-15"
}
```

**GET /api/v1/weekly-checklist/{user_id}**
- **Response 200:**
```json
{
  "week_of": "2024-01-15",
  "protocol": {
    "day_of_week": 0,
    "time": "19:00"
  },
  "checklist": {
    "vencimentos": {
      "proximos": [...],
      "total": 850.00
    },
    "orcamento": {
      "balance": 150.00,
      "status": "ok"
    },
    "cartao": {
      "fatura": 120.00,
      "teto": 500.00,
      "percentual": 24
    },
    "acordos": {
      "ativos": 2,
      "proximas_parcelas": ["2024-01-20"]
    }
  },
  "history": [
    {"week": "2024-01-08", "completed": true},
    {"week": "2024-01-01", "completed": false}
  ]
}
```

**POST /api/v1/weekly-protocol/log**
- **Payload:**
```json
{
  "user_id": "uuid",
  "week_date": "2024-01-15",
  "checklist_completed": {
    "vencimentos": true,
    "orcamento": true,
    "cartao": true,
    "acordos": true,
    "ajuste": true,
    "vitoria": true
  },
  "victory_note": "Consegui manter a fatura abaixo do teto pela primeira vez!",
  "adjustment_note": "Reduzi gastos com delivery esta semana",
  "time_spent": 12
}
```

---

### 📊 Métricas de Sucesso do Dia 15

1. **Taxa de Formatura:** % de usuários que completam todos os 15 dias
2. **Evolução do Termômetro:** Média de melhoria no score (Dia 1 → Dia 15)
3. **Taxa de Download do Certificado:** % que baixa o certificado
4. **Protocolo Semanal Ativado:** % que ativa o protocolo semanal
5. **Avaliação Média:** Nota média da experiência (1-5)
6. **Feedback Positivo:** % de avaliações 4-5 estrelas
7. **Checkpoints Agendados:** % que agenda lembretes de checkpoint
8. **Engajamento na Comunidade:** % que entra para a comunidade

---

### 🎯 RESUMO DO APP FIRE BRASIL — 15 DIAS

**Fases do App:**

| Fase | Dias | Foco | Resultados |
|------|------|------|------------|
| Despertar | 1-3 | Consciência e Diagnóstico | Autoconhecimento, Raio-X, Arqueologia |
| Ação Imediata | 4-6 | Parar a Sangria | Regra da Pausa, Cartão, Vazamentos |
| Organização | 7-9 | Estrutura e Prioridades | Vencimentos, Orçamento, Prioridades |
| Negociação | 10-12 | Resolver Dívidas | Mapa, Acordos, Fechar |
| Consolidação | 13-15 | Regras e Manutenção | Regras, Plano 30/90, Formatura |

**Tabelas Criadas:** 71 tabelas no total
**Dias Completos:** 15
**Complexidade:** Progressiva (do diagnóstico ao plano de manutenção)

---

**FIM DO APP FIRE BRASIL — 15 DIAS PARA INDEPENDÊNCIA FINANCEIRA**