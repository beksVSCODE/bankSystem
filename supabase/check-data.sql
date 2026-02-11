-- Check if data exists in Supabase

-- Check users
SELECT 'Users:' as table_name, COUNT(*) as count FROM users;
SELECT * FROM users;

-- Check accounts
SELECT 'Accounts:' as table_name, COUNT(*) as count FROM accounts;
SELECT id, name, type, currency, balance, account_number FROM accounts;

-- Check transactions
SELECT 'Transactions:' as table_name, COUNT(*) as count FROM transactions;
SELECT id, account_id, date, description, category, amount, type FROM transactions ORDER BY date DESC;

-- Check notifications
SELECT 'Notifications:' as table_name, COUNT(*) as count FROM notifications;
SELECT * FROM notifications ORDER BY created_at DESC;
