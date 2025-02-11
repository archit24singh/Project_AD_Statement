/*
  # Add authentication policies

  1. Security Updates
    - Enable RLS on statements table
    - Add policies for authenticated users to manage their statements
    - Update storage policies for authenticated access
*/

-- Enable RLS on statements table
ALTER TABLE statements ENABLE ROW LEVEL SECURITY;

-- Create policies for statements table
CREATE POLICY "Enable all access for authenticated users"
ON statements
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Ensure storage bucket exists and is private
INSERT INTO storage.buckets (id, name, public)
VALUES ('patient-statements', 'patient-statements', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Update storage policies
CREATE POLICY "Enable storage access for authenticated users"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'patient-statements')
WITH CHECK (bucket_id = 'patient-statements');