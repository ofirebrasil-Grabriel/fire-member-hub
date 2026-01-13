CREATE TABLE IF NOT EXISTS public.library_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('scripts', 'anti', 'cuts')),
  group_label text,
  label text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read library items" ON public.library_items;
DROP POLICY IF EXISTS "Admins can manage library items" ON public.library_items;

CREATE POLICY "Anyone can read library items"
ON public.library_items
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage library items"
ON public.library_items
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS library_items_category_sort_idx
ON public.library_items (category, group_label, sort_order);

DROP TRIGGER IF EXISTS update_library_items_updated_at ON public.library_items;
CREATE TRIGGER update_library_items_updated_at
BEFORE UPDATE ON public.library_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.library_items (category, group_label, label, description, sort_order)
SELECT 'scripts', 'WhatsApp', 'Abertura de negociacao', 'Ola, gostaria de negociar minha divida com [CREDOR]. Qual a melhor proposta disponivel?', 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.library_items WHERE category = 'scripts' AND group_label = 'WhatsApp' AND label = 'Abertura de negociacao'
);

INSERT INTO public.library_items (category, group_label, label, description, sort_order)
SELECT 'scripts', 'WhatsApp', 'Pedido de desconto', 'Existe algum desconto a vista ou condicao especial para quitar esta divida?', 2
WHERE NOT EXISTS (
  SELECT 1 FROM public.library_items WHERE category = 'scripts' AND group_label = 'WhatsApp' AND label = 'Pedido de desconto'
);

INSERT INTO public.library_items (category, group_label, label, description, sort_order)
SELECT 'scripts', 'Telefone', 'Introducao por telefone', 'Bom dia, meu nome e [NOME]. Quero negociar a divida com a empresa. Pode me ajudar?', 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.library_items WHERE category = 'scripts' AND group_label = 'Telefone' AND label = 'Introducao por telefone'
);

INSERT INTO public.library_items (category, group_label, label, description, sort_order)
SELECT 'scripts', 'Telefone', 'Limites de pagamento', 'Consigo pagar no maximo R$ [VALOR] de entrada e parcelas de R$ [VALOR].', 2
WHERE NOT EXISTS (
  SELECT 1 FROM public.library_items WHERE category = 'scripts' AND group_label = 'Telefone' AND label = 'Limites de pagamento'
);

INSERT INTO public.library_items (category, group_label, label, description, sort_order)
SELECT 'anti', NULL, 'Nunca pague boletos recebidos por email ou WhatsApp sem validar.', NULL, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.library_items WHERE category = 'anti' AND group_label IS NULL AND label = 'Nunca pague boletos recebidos por email ou WhatsApp sem validar.'
);

INSERT INTO public.library_items (category, group_label, label, description, sort_order)
SELECT 'anti', NULL, 'Confirme o valor e a conta bancaria no app oficial do credor.', NULL, 2
WHERE NOT EXISTS (
  SELECT 1 FROM public.library_items WHERE category = 'anti' AND group_label IS NULL AND label = 'Confirme o valor e a conta bancaria no app oficial do credor.'
);

INSERT INTO public.library_items (category, group_label, label, description, sort_order)
SELECT 'anti', NULL, 'Desconfie de descontos muito acima da media.', NULL, 3
WHERE NOT EXISTS (
  SELECT 1 FROM public.library_items WHERE category = 'anti' AND group_label IS NULL AND label = 'Desconfie de descontos muito acima da media.'
);

INSERT INTO public.library_items (category, group_label, label, description, sort_order)
SELECT 'anti', NULL, 'Evite enviar dados pessoais em canais nao oficiais.', NULL, 4
WHERE NOT EXISTS (
  SELECT 1 FROM public.library_items WHERE category = 'anti' AND group_label IS NULL AND label = 'Evite enviar dados pessoais em canais nao oficiais.'
);

INSERT INTO public.library_items (category, group_label, label, description, sort_order)
SELECT 'cuts', 'Assinaturas', 'Streaming', NULL, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.library_items WHERE category = 'cuts' AND group_label = 'Assinaturas' AND label = 'Streaming'
);

INSERT INTO public.library_items (category, group_label, label, description, sort_order)
SELECT 'cuts', 'Assinaturas', 'Apps pagos', NULL, 2
WHERE NOT EXISTS (
  SELECT 1 FROM public.library_items WHERE category = 'cuts' AND group_label = 'Assinaturas' AND label = 'Apps pagos'
);

INSERT INTO public.library_items (category, group_label, label, description, sort_order)
SELECT 'cuts', 'Assinaturas', 'Academias', NULL, 3
WHERE NOT EXISTS (
  SELECT 1 FROM public.library_items WHERE category = 'cuts' AND group_label = 'Assinaturas' AND label = 'Academias'
);

INSERT INTO public.library_items (category, group_label, label, description, sort_order)
SELECT 'cuts', 'Alimentacao', 'Delivery', NULL, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.library_items WHERE category = 'cuts' AND group_label = 'Alimentacao' AND label = 'Delivery'
);

INSERT INTO public.library_items (category, group_label, label, description, sort_order)
SELECT 'cuts', 'Alimentacao', 'Almocos fora', NULL, 2
WHERE NOT EXISTS (
  SELECT 1 FROM public.library_items WHERE category = 'cuts' AND group_label = 'Alimentacao' AND label = 'Almocos fora'
);

INSERT INTO public.library_items (category, group_label, label, description, sort_order)
SELECT 'cuts', 'Alimentacao', 'Cafe diario', NULL, 3
WHERE NOT EXISTS (
  SELECT 1 FROM public.library_items WHERE category = 'cuts' AND group_label = 'Alimentacao' AND label = 'Cafe diario'
);

INSERT INTO public.library_items (category, group_label, label, description, sort_order)
SELECT 'cuts', 'Lazer', 'Eventos pagos', NULL, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.library_items WHERE category = 'cuts' AND group_label = 'Lazer' AND label = 'Eventos pagos'
);

INSERT INTO public.library_items (category, group_label, label, description, sort_order)
SELECT 'cuts', 'Lazer', 'Compras por impulso', NULL, 2
WHERE NOT EXISTS (
  SELECT 1 FROM public.library_items WHERE category = 'cuts' AND group_label = 'Lazer' AND label = 'Compras por impulso'
);

INSERT INTO public.library_items (category, group_label, label, description, sort_order)
SELECT 'cuts', 'Transporte', 'Apps de mobilidade', NULL, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.library_items WHERE category = 'cuts' AND group_label = 'Transporte' AND label = 'Apps de mobilidade'
);

INSERT INTO public.library_items (category, group_label, label, description, sort_order)
SELECT 'cuts', 'Transporte', 'Estacionamento', NULL, 2
WHERE NOT EXISTS (
  SELECT 1 FROM public.library_items WHERE category = 'cuts' AND group_label = 'Transporte' AND label = 'Estacionamento'
);
