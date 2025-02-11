/*
  # Update phone number field

  1. Changes
    - Drop the phone_last_four column
    - Add new phone_number column for full phone numbers
    - Add constraint to ensure valid 10-digit phone numbers
    - Update index for better query performance

  2. Security
    - Maintains existing RLS policies
*/

-- Drop the old column and its constraint
ALTER TABLE statements 
DROP CONSTRAINT IF EXISTS valid_phone_check,
DROP COLUMN IF EXISTS phone_last_four;

-- Add new phone_number column with constraint
ALTER TABLE statements 
ADD COLUMN phone_number varchar(10);

-- Add constraint for 10-digit phone numbers
ALTER TABLE statements
ADD CONSTRAINT valid_phone_number_check 
CHECK (phone_number ~ '^[0-9]{10}$');

-- Update index for new column
DROP INDEX IF EXISTS idx_statements_search;
CREATE INDEX idx_statements_search 
ON statements(lastname, dob, phone_number);