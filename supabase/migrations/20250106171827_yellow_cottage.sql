/*
  # Update storage policies for patient statements

  1. Changes
    - Drop existing policies
    - Create new policies for upload and download
    - Make bucket private
  
  2. Security
    - Allow authenticated users to upload PDFs
    - Allow authenticated users to download PDFs
    - Ensure bucket is private
*/

-- Make bucket private if not already
UPDATE storage.buckets 
SET public = false 
WHERE id = 'patient-statements';

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated downloads" ON storage.objects;

-- Create new policies
CREATE POLICY "Enable upload access for authenticated users"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'patient-statements' 
  AND (storage.extension(name) = 'pdf')
);

CREATE POLICY "Enable download access for authenticated users"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'patient-statements');

CREATE POLICY "Enable update access for authenticated users"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'patient-statements')
WITH CHECK (bucket_id = 'patient-statements');

CREATE POLICY "Enable delete access for authenticated users"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'patient-statements');