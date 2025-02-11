/*
  # Enable public access to statements and storage

  1. Changes
    - Drop existing RLS policies
    - Create new public access policies for statements
    - Update storage policies for public access
    - Add public URL access to storage bucket
  
  2. Security
    - Maintains upload restrictions to authenticated users
    - Allows public read access to statements and files
*/

-- Make statements publicly readable
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON statements;

CREATE POLICY "Enable insert for authenticated users"
ON statements
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable read access for all users"
ON statements
FOR SELECT
TO anon, authenticated
USING (true);

-- Update storage bucket for public access
UPDATE storage.buckets 
SET public = true 
WHERE id = 'patient-statements';

-- Update storage policies
DROP POLICY IF EXISTS "Enable storage access for authenticated users" ON storage.objects;

CREATE POLICY "Enable upload for authenticated users"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'patient-statements');

CREATE POLICY "Enable public downloads"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'patient-statements');