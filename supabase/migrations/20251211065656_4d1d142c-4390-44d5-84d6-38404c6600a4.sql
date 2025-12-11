-- Create storage bucket for challenge assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('challenge-assets', 'challenge-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for challenge assets
CREATE POLICY "Anyone can view challenge assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'challenge-assets');

CREATE POLICY "Admins can upload challenge assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'challenge-assets' AND
    has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update challenge assets" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'challenge-assets' AND
    has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete challenge assets" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'challenge-assets' AND
    has_role(auth.uid(), 'admin')
  );

-- Add missing columns to days table for full editor support
ALTER TABLE public.days
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS challenge_details TEXT,
  ADD COLUMN IF NOT EXISTS expected_result TEXT,
  ADD COLUMN IF NOT EXISTS reflection_prompt TEXT;