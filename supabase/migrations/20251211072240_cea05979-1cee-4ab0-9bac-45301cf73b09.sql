-- Add unique constraint on subscriptions(user_id, product_id) for upsert operations
ALTER TABLE public.subscriptions 
ADD CONSTRAINT subscriptions_user_id_product_id_key UNIQUE (user_id, product_id);