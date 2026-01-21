-- Add default AI budget setting (global)
INSERT INTO public.settings (key, value, description)
SELECT 'ai_budget_brl', to_jsonb(0), 'Limite global de gasto com IA (R$)'
WHERE NOT EXISTS (
  SELECT 1 FROM public.settings WHERE key = 'ai_budget_brl'
);
