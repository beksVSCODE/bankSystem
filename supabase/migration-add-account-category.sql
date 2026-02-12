-- Migration: Add account_category field to accounts table

-- Add the account_category column if it doesn't exist
ALTER TABLE accounts
ADD COLUMN IF NOT EXISTS account_category VARCHAR(20) DEFAULT 'personal'
CHECK (account_category IN ('personal', 'business', 'investment'));

-- Create an index on account_category for better query performance
CREATE INDEX IF NOT EXISTS idx_accounts_category ON accounts(account_category);

-- Add comment to explain the field
COMMENT ON COLUMN accounts.account_category IS 'Category of account: personal (Счета физ.лица), business (Расчётные счета), investment (Кабинет АУ)';
