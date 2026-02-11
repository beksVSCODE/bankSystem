-- Full database seed with realistic data
-- Execute this in Supabase SQL Editor

-- Step 1: Clear existing data (optional)
DELETE FROM notifications WHERE user_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM transactions WHERE account_id IN (SELECT id FROM accounts WHERE user_id = '00000000-0000-0000-0000-000000000001');
DELETE FROM accounts WHERE user_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM users WHERE id = '00000000-0000-0000-0000-000000000001';

-- Step 2: Insert user
INSERT INTO users (id, first_name, last_name, middle_name, email, phone, user_type, created_at, last_login)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Александр', 'Петров', 'Сергеевич', 'a.petrov@mail.ru', '+7 (999) 123-45-67', 'individual', '2022-03-15', '2026-02-11T10:30:00');

-- Step 3: Insert accounts
INSERT INTO accounts (user_id, name, type, currency, balance, account_number, card_number, expiry_date, is_active, color)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'Основная карта', 'card', 'RUB', 245890.50, '40817810500000123456', '4276 **** **** 1234', '12/27', TRUE, '#0050B3'),
    ('00000000-0000-0000-0000-000000000001', 'Накопительный счёт', 'savings', 'RUB', 1250000.00, '40817810500000654321', NULL, NULL, TRUE, '#10B981'),
    ('00000000-0000-0000-0000-000000000001', 'Долларовый счёт', 'checking', 'USD', 5420.75, '40817840500000789012', NULL, NULL, TRUE, '#8B5CF6'),
    ('00000000-0000-0000-0000-000000000001', 'Карта для покупок', 'card', 'RUB', 34500.00, '40817810500000111222', '5536 **** **** 5678', '08/26', TRUE, '#F59E0B'),
    ('00000000-0000-0000-0000-000000000001', 'Евро счёт', 'checking', 'EUR', 3250.00, '40817978500000555666', NULL, NULL, TRUE, '#14B8A6'),
    ('00000000-0000-0000-0000-000000000001', 'Вклад "Выгодный"', 'deposit', 'RUB', 500000.00, '42305810500000333444', NULL, NULL, TRUE, '#EC4899');

-- Step 4: Insert transactions (last 6 months)
INSERT INTO transactions (account_id, date, description, category, amount, type, merchant, status)
VALUES
    -- February 2026
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2026-02-10T14:30:00', 'Покупка продуктов', 'groceries', 4200.00, 'expense', 'Пятёрочка', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2026-02-09T19:00:00', 'Ужин в ресторане', 'restaurants', 5600.00, 'expense', 'Ресторан Белуга', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2026-02-08T10:00:00', 'Перевод с карты', 'other', 15000.00, 'income', 'Перевод', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000111222'), '2026-02-07T16:20:00', 'Покупка одежды', 'shopping', 12300.00, 'expense', 'H&M', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2026-02-05T08:15:00', 'Оплата интернета', 'utilities', 890.00, 'expense', 'Ростелеком', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2026-02-01T10:00:00', 'Зарплата', 'salary', 185000.00, 'income', 'ООО "Компания"', 'completed'),
    
    -- January 2026
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2026-01-30T18:45:00', 'Такси', 'transport', 850.00, 'expense', 'Яндекс.Такси', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2026-01-28T12:00:00', 'Продукты', 'groceries', 5200.00, 'expense', 'Перекрёсток', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000111222'), '2026-01-25T14:30:00', 'Покупка техники', 'shopping', 25000.00, 'expense', 'М.Видео', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2026-01-20T09:00:00', 'Оплата ЖКХ', 'utilities', 6500.00, 'expense', 'Управляющая компания', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2026-01-15T16:00:00', 'Заправка', 'transport', 3200.00, 'expense', 'Лукойл', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2026-01-10T11:30:00', 'Кафе', 'restaurants', 1850.00, 'expense', 'Кофемания', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2026-01-05T10:00:00', 'Зарплата', 'salary', 185000.00, 'income', 'ООО "Компания"', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2026-01-03T15:20:00', 'Продукты', 'groceries', 4800.00, 'expense', 'Азбука Вкуса', 'completed'),
    
    -- December 2025
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-12-31T20:00:00', 'Новогодний стол', 'groceries', 15000.00, 'expense', 'Глобус Гурмэ', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000111222'), '2025-12-28T13:00:00', 'Подарки', 'shopping', 18500.00, 'expense', 'Детский мир', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-12-25T17:30:00', 'Кино', 'entertainment', 1200.00, 'expense', 'Каро', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-12-20T12:00:00', 'Фитнес', 'healthcare', 8000.00, 'expense', 'WorldClass', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-12-15T10:00:00', 'Мобильная связь', 'utilities', 650.00, 'expense', 'МТС', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-12-10T14:20:00', 'Продукты', 'groceries', 5600.00, 'expense', 'Пятёрочка', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-12-05T10:00:00', 'Зарплата', 'salary', 185000.00, 'income', 'ООО "Компания"', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-12-01T19:00:00', 'Ресторан', 'restaurants', 6200.00, 'expense', 'Тинькофф Кухня', 'completed'),
    
    -- November 2025
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-11-28T16:00:00', 'Такси', 'transport', 950.00, 'expense', 'Яндекс.Такси', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-11-25T11:00:00', 'Продукты', 'groceries', 4500.00, 'expense', 'Перекрёсток', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000111222'), '2025-11-20T15:30:00', 'Одежда', 'shopping', 14200.00, 'expense', 'ZARA', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-11-15T09:00:00', 'Аптека', 'healthcare', 2300.00, 'expense', 'Ригла', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-11-10T18:00:00', 'Кафе', 'restaurants', 2100.00, 'expense', 'Шоколадница', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-11-05T10:00:00', 'Зарплата', 'salary', 185000.00, 'income', 'ООО "Компания"', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-11-03T12:30:00', 'Заправка', 'transport', 3500.00, 'expense', 'Лукойл', 'completed'),
    
    -- October 2025
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-10-30T14:00:00', 'Продукты', 'groceries', 5100.00, 'expense', 'Пятёрочка', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-10-25T10:00:00', 'Оплата ЖКХ', 'utilities', 6200.00, 'expense', 'Управляющая компания', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000111222'), '2025-10-20T16:45:00', 'Электроника', 'shopping', 32000.00, 'expense', 'DNS', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-10-15T11:20:00', 'Кино', 'entertainment', 1400.00, 'expense', 'Каро', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-10-10T19:00:00', 'Ресторан', 'restaurants', 5800.00, 'expense', 'Ваби Саби', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-10-05T10:00:00', 'Зарплата', 'salary', 185000.00, 'income', 'ООО "Компания"', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-10-02T13:00:00', 'Такси', 'transport', 780.00, 'expense', 'Яндекс.Такси', 'completed'),
    
    -- September 2025
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-09-28T15:30:00', 'Продукты', 'groceries', 4900.00, 'expense', 'Перекрёсток', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-09-25T09:00:00', 'Мобильная связь', 'utilities', 650.00, 'expense', 'МТС', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000111222'), '2025-09-20T14:00:00', 'Обувь', 'shopping', 9800.00, 'expense', 'Respect', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-09-15T18:30:00', 'Кафе', 'restaurants', 1950.00, 'expense', 'Кофемания', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-09-10T12:00:00', 'Заправка', 'transport', 3300.00, 'expense', 'Газпром', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-09-05T10:00:00', 'Зарплата', 'salary', 185000.00, 'income', 'ООО "Компания"', 'completed'),
    ((SELECT id FROM accounts WHERE account_number = '40817810500000123456'), '2025-09-01T16:00:00', 'Аптека', 'healthcare', 1850.00, 'expense', 'Ригла', 'completed');

-- Step 5: Insert notifications
INSERT INTO notifications (user_id, title, message, type, read, created_at)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'Зачисление средств', 'На ваш счёт поступило 185 000 ₽', 'success', FALSE, '2026-02-01T10:00:00'),
    ('00000000-0000-0000-0000-000000000001', 'Успешная оплата', 'Покупка в Пятёрочка на сумму 4 200 ₽', 'info', FALSE, '2026-02-10T14:30:00'),
    ('00000000-0000-0000-0000-000000000001', 'Крупная покупка', 'Покупка на сумму 25 000 ₽ в М.Видео', 'warning', TRUE, '2026-01-25T14:30:00'),
    ('00000000-0000-0000-0000-000000000001', 'Новое устройство', 'Обнаружен вход с нового устройства', 'warning', TRUE, '2026-02-05T09:15:00'),
    ('00000000-0000-0000-0000-000000000001', 'Пополнение счёта', 'Перевод 15 000 ₽ на основную карту', 'success', TRUE, '2026-02-08T10:00:00');

-- Verification
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Accounts', COUNT(*) FROM accounts
UNION ALL
SELECT 'Transactions', COUNT(*) FROM transactions
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications;
