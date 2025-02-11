-- Enable Storage
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('patient-statements', 'patient-statements', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'patient-statements' 
  AND storage.extension(name) = 'pdf'
);

CREATE POLICY "Allow authenticated downloads"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'patient-statements');