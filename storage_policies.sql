-- 1. Insert bucket if it doesn't exist (just in case)
INSERT INTO storage.buckets (id, name, public)
VALUES ('ai_uploads', 'ai_uploads', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Authenticated users can upload to ai_uploads
DROP POLICY IF EXISTS "Authenticated users can upload to ai_uploads" ON storage.objects;
CREATE POLICY "Authenticated users can upload to ai_uploads" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'ai_uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 4. Policy: Users can read only their own files
DROP POLICY IF EXISTS "Users can read own files in ai_uploads" ON storage.objects;
CREATE POLICY "Users can read own files in ai_uploads" 
ON storage.objects FOR SELECT TO authenticated 
USING (bucket_id = 'ai_uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 5. Policy: Users can delete only their own files
DROP POLICY IF EXISTS "Users can delete own files in ai_uploads" ON storage.objects;
CREATE POLICY "Users can delete own files in ai_uploads" 
ON storage.objects FOR DELETE TO authenticated 
USING (bucket_id = 'ai_uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 6. Policy: Users can update only their own files
DROP POLICY IF EXISTS "Users can update own files in ai_uploads" ON storage.objects;
CREATE POLICY "Users can update own files in ai_uploads" 
ON storage.objects FOR UPDATE TO authenticated 
USING (bucket_id = 'ai_uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
