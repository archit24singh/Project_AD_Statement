/*
  # Fix statements table schema

  1. Changes
    - Drop existing dob column and recreate as integer
    - Recreate index for optimized searches
*/

-- Recreate dob column as integer
ALTER TABLE statements DROP COLUMN IF EXISTS dob;
ALTER TABLE statements ADD COLUMN dob integer;

-- Add constraint for valid years
ALTER TABLE statements
ADD CONSTRAINT valid_year_check 
CHECK (dob >= 1900 AND dob <= EXTRACT(YEAR FROM CURRENT_DATE));

-- Recreate optimized index
DROP INDEX IF EXISTS idx_statements_search;
CREATE INDEX idx_statements_search 
ON statements(lastname, dob);