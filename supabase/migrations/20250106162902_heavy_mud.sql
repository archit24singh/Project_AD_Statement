/*
  # Update DOB field to Year

  1. Changes
    - Modify `dob` column from date to integer
    - Add check constraint to ensure valid years
  
  2. Security
    - Maintains existing RLS policies
*/

-- First safely convert existing dates to years
ALTER TABLE statements 
ALTER COLUMN dob TYPE integer 
USING EXTRACT(YEAR FROM dob::date);

-- Add constraint to ensure valid years
ALTER TABLE statements
ADD CONSTRAINT valid_year_check 
CHECK (dob >= 1900 AND dob <= EXTRACT(YEAR FROM CURRENT_DATE));

-- Update index for new column type
DROP INDEX IF EXISTS idx_statements_search;
CREATE INDEX idx_statements_search 
ON statements(lastname, dob);