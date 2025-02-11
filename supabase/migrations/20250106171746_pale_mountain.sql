/*
  # Add file storage columns to statements table

  1. Changes
    - Add `file_path` column to store the storage path
    - Add `file_url` column to store the public URL
    - Remove `content` column since files are now stored in storage bucket
  
  2. Security
    - No changes to RLS policies needed
*/

-- Remove the content column since we're moving to storage
ALTER TABLE statements DROP COLUMN IF EXISTS content;

-- Add new columns for file storage
ALTER TABLE statements
ADD COLUMN IF NOT EXISTS file_path text,
ADD COLUMN IF NOT EXISTS file_url text;

-- Create index for file path lookups
CREATE INDEX IF NOT EXISTS idx_statements_file_path
ON statements(file_path);