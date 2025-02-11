/*
  # Add phone number field to statements table

  1. Changes
    - Add phone_last_four column to statements table
    - Add check constraint for valid 4-digit numbers
    - Update search index to include phone number
*/

ALTER TABLE statements 
ADD COLUMN phone_last_four varchar(4);

ALTER TABLE statements
ADD CONSTRAINT valid_phone_check 
CHECK (phone_last_four ~ '^[0-9]{4}$');

DROP INDEX IF EXISTS idx_statements_search;
CREATE INDEX idx_statements_search 
ON statements(lastname, dob, phone_last_four);