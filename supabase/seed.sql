-- Seed data for FinSim Dashboard
-- Note: Replace 'YOUR_USER_UUID' with actual user UUID after authentication

-- Clear existing test data (optional - uncomment if you want to reset)
-- DELETE FROM notifications WHERE user_id = '00000000-0000-0000-0000-000000000001';
-- DELETE FROM transactions WHERE account_id IN (SELECT id FROM accounts WHERE user_id = '00000000-0000-0000-0000-000000000001');
-- DELETE FROM accounts WHERE user_id = '00000000-0000-0000-0000-000000000001';
-- DELETE FROM users WHERE id = '00000000-0000-0000-0000-000000000001';

-- Insert sample user (this would normally come from Supabase Auth)
-- For testing, you can use a specific UUID
INSERT INTO users (id, first_name, last_name, middle_name, email, phone, user_type, created_at, last_login)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Александр', 'Петров', 'Сергеевич', 'a.petrov@mail.ru', '+7 (999) 123-45-67', 'individual', '2022-03-15', '2025-02-04T10:30:00')
ON CONFLICT (id) DO NOTHING;

-- Insert accounts
INSERT INTO accounts (user_id, name, type, currency, balance, account_number, card_number, expiry_date, is_active, color)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'Осн   овная карта', 'card', 'RUB', 245890.50, '40817810500000123456', '4276 **** **** 1234', '12/27', TRUE, '#0050B3'),
    ('00000000-0000-0000-0000-000000000001', 'Накопительный счёт', 'savings', 'RUB', 1250000.00, '40817810500000654321', NULL, NULL, TRUE, '#10B981'),
    ('00000000-0000-0000-0000-000000000001', 'Долларовый счёт', 'checking', 'USD', 5420.75, '40817840500000789012', NULL, NULL, TRUE, '#8B5CF6'),
    ('00000000-0000-0000-0000-000000000001', 'Карта для покупок', 'card', 'RUB', 34500.00, '40817810500000111222', '5536 **** **** 5678', '08/26', TRUE, '#F59E0B'),
    ('00000000-0000-0000-0000-000000000001', 'Евро счёт', 'checking', 'EUR', 3250.00, '40817978500000555666', NULL, NULL, TRUE, '#14B8A6'),
    ('00000000-0000-0000-0000-000000000001', 'Вклад "Выгодный"', 'deposit', 'RUB', 500000.00, '42305810500000333444', NULL, NULL, TRUE, '#EC4899')
ON CONFLICT (account_number) DO NOTHING;

-- Get account IDs for transactions (you'll need to update these after accounts are created)
-- For now, we'll use placeholder logic

-- Insert sample transactions for the main card account
INSERT INTO transactions (account_id, date, description, category, amount, type, merchant, status)
SELECT 
    a.id,
    '2025-02-01T10:00:00',
    'Зарплата за январь',
    'salary',
    185000.00,
    'income',
    'ООО "Компания"',
    'completed'
FROM accounts a
WHERE a.account_number = '40817810500000123456'
LIMIT 1;

INSERT INTO transactions (account_id, date, description, category, amount, type, merchant, status)
SELECT 
    a.id,
    '2025-02-03T15:30:00',
    'Покупка продуктов',
    'groceries',
    3450.50,
    'expense',
    'Перекрёсток',
    'completed'
FROM accounts a
WHERE a.account_number = '40817810500000123456'
LIMIT 1;

INSERT INTO transactions (account_id, date, description, category, amount, type, merchant, status)
SELECT 
    a.id,
    '2025-02-02T12:15:00',
    'Оплата за интернет',
    'utilities',
    890.00,
    'expense',
    'Ростелеком',
    'completed'
FROM accounts a
WHERE a.account_number = '40817810500000123456'
LIMIT 1;

INSERT INTO transactions (account_id, date, description, category, amount, type, merchant, status)
SELECT 
    a.id,
    '2025-02-04T18:45:00',
    'Ужин в ресторане',
    'restaurants',
    4500.00,
    'expense',
    'Ресторан "Белуга"',
    'completed'
FROM accounts a
WHERE a.account_number = '40817810500000123456'
LIMIT 1;

INSERT INTO transactions (account_id, date, description, category, amount, type, merchant, status)
SELECT 
    a.id,
    '2025-01-28T09:20:00',
    'Покупка одежды',
    'shopping',
    12500.00,
    'expense',
    'ZARA',
    'completed'
FROM accounts a
WHERE a.account_number = '40817810500000111222'
LIMIT 1;

INSERT INTO transactions (account_id, date, description, category, amount, type, merchant, status)
SELECT 
    a.id,
    '2025-01-25T14:30:00',
    'Поездка на такси',
    'transport',
    650.00,
    'expense',
    'Яндекс.Такси',
    'completed'
FROM accounts a
WHERE a.account_number = '40817810500000123456'
LIMIT 1;

-- Insert notifications
INSERT INTO notifications (user_id, title, message, type, read, created_at)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'Зачисление средств', 'На ваш счёт поступило 185 000 ₽', 'success', FALSE, '2025-02-04T10:00:00'),
    ('00000000-0000-0000-0000-000000000001', 'Успешная оплата', 'Покупка в Перекрёсток на сумму 3 450,50 ₽', 'info', FALSE, '2025-02-03T15:30:00'),
    ('00000000-0000-0000-0000-000000000001', 'Безопасность', 'Обнаружен вход с нового устройства', 'warning', TRUE, '2025-02-01T09:15:00');
