/*
  # Create storage bucket for patient statements
  
  1. Storage Setup
    - Create bucket 'patient-statements' for storing PDF files
  
  2. Security
    - Enable RLS
    - Add policy for authenticated users to upload PDFs
*/

-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('patient-statements', 'patient-statements')
ON CONFLICT (id) DO NOTHING;

-- Set up security policies
CREATE POLICY "Allow authenticated users to upload PDFs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'patient-statements' 
  AND storage.extension(name) = 'pdf'
);