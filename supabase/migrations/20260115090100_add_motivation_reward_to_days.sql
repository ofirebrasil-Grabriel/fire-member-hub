-- Migration: add_motivation_reward_to_days
-- Description: Adicionar campos de motivação e recompensa à tabela days

-- Adicionar campos de motivação e recompensa
ALTER TABLE public.days 
ADD COLUMN IF NOT EXISTS motivation_phrase text,
ADD COLUMN IF NOT EXISTS reward_label text,
ADD COLUMN IF NOT EXISTS reward_icon text;

-- Atualizar dias existentes com frases padrão
UPDATE public.days SET
  motivation_phrase = CASE id
    WHEN 1 THEN 'Você deu o primeiro passo. A jornada de mil quilômetros começa com um único passo.'
    WHEN 2 THEN 'Clareza é liberdade. Saber onde você está é o primeiro passo para mudar.'
    WHEN 3 THEN 'Seu passado não define seu futuro. Hoje você começa a reescrever sua história.'
    WHEN 4 THEN 'Dizer não para o impulso é dizer sim para sua liberdade.'
    WHEN 5 THEN 'Cada fatura controlada é um passo mais perto da paz financeira.'
    WHEN 6 THEN 'Pequenos vazamentos afundam grandes navios. Você está tapando os buracos.'
    WHEN 7 THEN 'Organização é o primeiro passo para o controle. Você está assumindo o leme.'
    WHEN 8 THEN 'Priorizar não é escolher o fácil, é escolher o essencial.'
    WHEN 9 THEN 'Um orçamento é contar para seu dinheiro onde ele deve ir, não perguntar onde ele foi.'
    WHEN 10 THEN 'Negociar é um ato de coragem. Você está enfrentando suas dívidas de frente.'
    WHEN 11 THEN 'Conhecimento é poder. Você está se armando para vencer.'
    WHEN 12 THEN 'Fechar um acordo é uma vitória. Cada passo conta.'
    WHEN 13 THEN 'Novas regras criam novos resultados. Você está construindo o futuro.'
    WHEN 14 THEN 'Quem tem um plano, tem um caminho. Você não está mais perdido.'
    WHEN 15 THEN 'Você não apenas terminou. Você se transformou. Isso muda tudo.'
    ELSE 'Você está no caminho certo!'
  END,
  reward_label = CASE id
    WHEN 1 THEN 'Pioneiro'
    WHEN 2 THEN 'Detetive Financeiro'
    WHEN 3 THEN 'Arqueólogo'
    WHEN 4 THEN 'Guardião'
    WHEN 5 THEN 'Controlador'
    WHEN 6 THEN 'Caçador de Vazamentos'
    WHEN 7 THEN 'Organizador'
    WHEN 8 THEN 'Estrategista'
    WHEN 9 THEN 'Arquiteto'
    WHEN 10 THEN 'Negociador'
    WHEN 11 THEN 'Estudante'
    WHEN 12 THEN 'Fechador de Acordos'
    WHEN 13 THEN 'Criador de Regras'
    WHEN 14 THEN 'Planejador'
    WHEN 15 THEN 'Graduado FIRE'
    ELSE 'Conquistador'
  END,
  reward_icon = CASE id
    WHEN 1 THEN 'rocket'
    WHEN 2 THEN 'search'
    WHEN 3 THEN 'shovel'
    WHEN 4 THEN 'shield'
    WHEN 5 THEN 'credit-card'
    WHEN 6 THEN 'droplet-off'
    WHEN 7 THEN 'calendar'
    WHEN 8 THEN 'target'
    WHEN 9 THEN 'calculator'
    WHEN 10 THEN 'map'
    WHEN 11 THEN 'book-open'
    WHEN 12 THEN 'handshake'
    WHEN 13 THEN 'scroll'
    WHEN 14 THEN 'compass'
    WHEN 15 THEN 'award'
    ELSE 'star'
  END
WHERE motivation_phrase IS NULL;
