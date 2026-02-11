-- Step 1: Check if accounts exist and get their IDs
SELECT id, name, account_number FROM accounts ORDER BY created_at;

-- Step 2: Insert transactions using account IDs
-- Replace the UUIDs below with actual account IDs from Step 1

-- Example: If you have account IDs, use them like this:
-- INSERT INTO transactions (account_id, date, description, category, amount, type, merchant, status)
-- VALUES 
--     ('actual-uuid-from-step-1', '2025-02-01T10:00:00', 'Зарплата за январь', 'salary', 185000.00, 'income', 'ООО "Компания"', 'completed');

-- OR use this query to insert with dynamic lookup:
INSERT INTO transactions (account_id, date, description, category, amount, type, merchant, status)
VALUES
    -- Transactions for main card (40817810500000123456)
    (
        (SELECT id FROM accounts WHERE account_number = '40817810500000123456' LIMIT 1),
        '2025-02-01T10:00:00',
        'Зарплата за январь',
        'salary',
        185000.00,
        'income',
        'ООО "Компания"',
        'completed'
    ),
    (
        (SELECT id FROM accounts WHERE account_number = '40817810500000123456' LIMIT 1),
        '2025-02-03T15:30:00',
        'Покупка продуктов',
        'groceries',
        3450.50,
        'expense',
        'Перекрёсток',
        'completed'
    ),
    (
        (SELECT id FROM accounts WHERE account_number = '40817810500000123456' LIMIT 1),
        '2025-02-02T12:15:00',
        'Оплата за интернет',
        'utilities',
        890.00,
        'expense',
        'Ростелеком',
        'completed'
    ),
    (
        (SELECT id FROM accounts WHERE account_number = '40817810500000123456' LIMIT 1),
        '2025-02-04T18:45:00',
        'Ужин в ресторане',
        'restaurants',
        4500.00,
        'expense',
        'Ресторан "Белуга"',
        'completed'
    ),
    (
        (SELECT id FROM accounts WHERE account_number = '40817810500000123456' LIMIT 1),
        '2025-01-25T14:30:00',
        'Поездка на такси',
        'transport',
        650.00,
        'expense',
        'Яндекс.Такси',
        'completed'
    ),
    -- Transaction for shopping card (40817810500000111222)
    (
        (SELECT id FROM accounts WHERE account_number = '40817810500000111222' LIMIT 1),
        '2025-01-28T09:20:00',
        'Покупка одежды',
        'shopping',
        12500.00,
        'expense',
        'ZARA',
        'completed'
    );

-- Step 3: Verify transactions were inserted
SELECT COUNT(*) as total_transactions FROM transactions;
SELECT id, date, description, amount, type FROM transactions ORDER BY date DESC;
