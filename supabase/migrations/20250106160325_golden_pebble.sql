/*
  # Add patient identification fields

  1. Changes
    - Add lastname column to statements table
    - Add dob (date of birth) column to statements table
    - Add index on lastname and dob for faster searches
  
  2. Security
    - Maintain existing RLS policies
*/

ALTER TABLE statements 
ADD COLUMN IF NOT EXISTS lastname text,
ADD COLUMN IF NOT EXISTS dob date;

CREATE INDEX IF NOT EXISTS idx_statements_search 
ON statements(lastname, dob);