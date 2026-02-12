# Database Migration Guide

## Steps to apply the migration and seed data

### 1. Add account_category field to accounts table

Run the migration SQL script in Supabase dashboard or via CLI:

```bash
# Option A: Using Supabase CLI
supabase migration new add_account_category
# Copy content from migration-add-account-category.sql into the new file
supabase db push

# Option B: Using Supabase Dashboard
# Go to SQL Editor → New Query → Paste the content of migration-add-account-category.sql → Run
```

### 2. Load comprehensive seed data

After migration, run the seed script:

```bash
# Option A: Using Supabase CLI
supabase db push < supabase/seed-comprehensive.sql

# Option B: Using Supabase Dashboard
# Go to SQL Editor → New Query → Paste the content of seed-comprehensive.sql → Run
```

### 3. Verify the data

Run these verification queries:

```sql
-- Check accounts
SELECT 
  id, name, account_type, account_category, balance, currency 
FROM accounts 
WHERE user_id = '00000000-0000-0000-0000-000000000001'
ORDER BY created_at;

-- Check cards
SELECT 
  c.id, c.card_number, c.payment_system, c.status, a.name as account_name
FROM cards c
JOIN accounts a ON c.account_id = a.id
WHERE a.user_id = '00000000-0000-0000-0000-000000000001'
ORDER BY c.created_at;

-- Check transactions
SELECT 
  t.id, t.description, t.category, t.amount, t.type, a.name as account_name
FROM transactions t
JOIN accounts a ON t.account_id = a.id
WHERE a.user_id = '00000000-0000-0000-0000-000000000001'
ORDER BY t.date DESC;
```

## Data Structure

### Accounts (6 total)
- **Personal (4)**: acc-1, acc-2, acc-3, acc-4
  - Основной счёт (Current, RUB, 245,890.50)
  - Накопительный счёт (Savings, RUB, 1,250,000.00, 8.5% interest)
  - Долларовый счёт (Current, USD, 5,420.75)
  - Счёт для покупок (Current, RUB, 34,500.00)

- **Business (1)**: acc-5
  - Евро счёт (Current, EUR, 3,250.00)

- **Investment (1)**: acc-6
  - Вклад "Выгодный" (Deposit, RUB, 500,000.00, 12% interest)

### Cards (3 total)
- **card-1**: MIR Debit (attached to acc-1)
- **card-2**: Mastercard Virtual (attached to acc-1)
- **card-3**: Visa Debit (attached to acc-4)

### Transactions (12 total)
- Various income and expense transactions across accounts
- Categories: salary, groceries, transport, restaurants, entertainment, shopping, investments, transfer, utilities

## Important Notes

1. The test user UUID is: `00000000-0000-0000-0000-000000000001`
2. All seed data uses specific UUIDs that match the store's fallback behavior
3. The app will use mock data if Supabase is not available (fallback mechanism)
4. Make sure RLS policies are properly configured in Supabase
