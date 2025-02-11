/*
  # Patient Statements Upload System

  1. New Tables
    - `uploads`
      - `id` (uuid, primary key)
      - `filename` (text, the generated filename)
      - `original_name` (text, original file name)
      - `size` (bigint, file size in bytes)
      - `status` (text, upload status)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `uploads` table
    - Add policies for insert and select operations
*/

-- Create uploads table
CREATE TABLE IF NOT EXISTS uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_name text NOT NULL,
  size bigint NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can insert uploads"
  ON uploads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view uploads"
  ON uploads
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_uploads_updated_at
  BEFORE UPDATE ON uploads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();