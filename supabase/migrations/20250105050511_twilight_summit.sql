/*
  # Store PDF Statements in Database

  1. New Tables
    - `statements`
      - `id` (uuid, primary key)
      - `name` (text, original file name)
      - `content` (bytea, PDF binary content)
      - `size` (bigint, file size in bytes)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on statements table
    - Add policies for insert and select operations
*/

CREATE TABLE IF NOT EXISTS statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  content bytea NOT NULL,
  size bigint NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE statements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can insert statements"
  ON statements
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view statements"
  ON statements
  FOR SELECT
  TO anon, authenticated
  USING (true);