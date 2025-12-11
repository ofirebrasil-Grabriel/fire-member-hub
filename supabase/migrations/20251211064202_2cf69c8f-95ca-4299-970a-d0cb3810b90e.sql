-- Create days table for challenge content management
CREATE TABLE public.days (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  emoji TEXT DEFAULT '📅',
  morning_message TEXT,
  morning_audio_url TEXT,
  concept TEXT,
  concept_title TEXT,
  concept_audio_url TEXT,
  task_title TEXT,
  task_steps JSONB DEFAULT '[]'::jsonb,
  tools TEXT[] DEFAULT '{}',
  reflection_questions TEXT[] DEFAULT '{}',
  commitment TEXT,
  next_day_preview TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.days ENABLE ROW LEVEL SECURITY;

-- Everyone can read days (for challenge access)
CREATE POLICY "Anyone can read days" ON public.days
  FOR SELECT USING (true);

-- Only admins can manage days
CREATE POLICY "Admins can manage days" ON public.days
  FOR ALL USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_days_updated_at
  BEFORE UPDATE ON public.days
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add RLS policies for webhook_logs (admins only)
CREATE POLICY "Admins can view webhook_logs" ON public.webhook_logs
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage webhook_logs" ON public.webhook_logs
  FOR ALL USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Seed initial days data (15 days)
INSERT INTO public.days (id, title, subtitle, emoji, morning_message, concept, concept_title, task_title, task_steps, tools, reflection_questions, commitment, next_day_preview)
VALUES 
(1, 'O Despertar', 'Encarando a Realidade Financeira Sem Culpa', '🌅', 
 'Se você chegou até aqui, é porque sente que alguma coisa precisa mudar na sua relação com o dinheiro.',
 'O princípio central de hoje é a consciência financeira.',
 'Consciência financeira e autonomia sobre o tempo',
 'Encarando a realidade e reprogramando crenças',
 '[{"id": "1-1", "text": "Preencha o Checklist de Crenças Limitantes"}, {"id": "1-2", "text": "Responda ao Exercício de Autoconhecimento"}, {"id": "1-3", "text": "Inicie seu Diário de Sentimentos"}]'::jsonb,
 ARRAY['Checklist de Crenças Limitantes', 'Exercício de Autoconhecimento', 'Diário de Sentimentos'],
 ARRAY['Qual crença limitante mais te surpreendeu hoje?', 'Como as experiências da sua infância influenciam sua maneira atual de lidar com o dinheiro?'],
 'Preencha todas as planilhas e exercícios até o fim do dia.',
 'Amanhã faremos um Raio‑X completo das suas finanças.'
),
(2, 'Raio-X Completo', 'Mapeamento Detalhado das Finanças', '🔍',
 'Hoje vamos colocar essa consciência em ação.',
 'O Raio‑X Financeiro é o ato de mapear todas as entradas e saídas de dinheiro.',
 'Raio‑X Financeiro',
 'Mapeamento completo das finanças',
 '[{"id": "2-1", "text": "Reúna extratos bancários e faturas"}, {"id": "2-2", "text": "Preencha a planilha de Receitas"}]'::jsonb,
 ARRAY['Planilha Raio‑X Receitas', 'Planilha Raio‑X Despesas'],
 ARRAY['Foi fácil ou difícil identificar todas as suas despesas?'],
 'Não omita nenhuma fonte de renda.',
 'Amanhã entraremos na Arqueologia Financeira.'
);

-- Reset sequence
SELECT setval('days_id_seq', (SELECT MAX(id) FROM days));

-- Add admin RLS for profiles (to allow admin to view all users)
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete profiles" ON public.profiles
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Add admin RLS for subscriptions
CREATE POLICY "Admins can manage subscriptions" ON public.subscriptions
  FOR ALL USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));