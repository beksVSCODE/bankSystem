-- Comprehensive seed data for FinSim Dashboard
-- This script loads sample data for testing the application

-- ========================
-- 1. INSERT TEST USER
-- ========================
INSERT INTO users (id, first_name, last_name, middle_name, email, phone, user_type, created_at, last_login)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Александр', 'Петров', 'Сергеевич', 'a.petrov@mail.ru', '+7 (999) 123-45-67', 'individual', '2022-03-15T00:00:00', '2025-02-04T10:30:00')
ON CONFLICT (id) DO NOTHING;

-- ========================
-- 2. INSERT ACCOUNTS (Personal, Business, Investment)
-- ========================

-- Personal Category (Счета физ.лица) - 4 accounts
INSERT INTO accounts (id, user_id, name, account_type, account_category, currency, balance, account_number, is_active, interest_rate, color, created_at, updated_at)
VALUES
    -- acc-1: Основной счёт (Personal)
    ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Основной счёт', 'current', 'personal', 'RUB', 245890.50, '40817810500000123456', true, NULL, '#0050B3', '2022-03-15T10:00:00', '2025-02-04T10:30:00'),
    
    -- acc-2: Накопительный счёт (Personal)
    ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'Накопительный счёт', 'savings', 'personal', 'RUB', 1250000.00, '40817810500000654321', true, 8.5, '#10B981', '2023-01-10T14:20:00', '2025-02-04T10:30:00'),
    
    -- acc-3: Долларовый счёт (Personal)
    ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'Долларовый счёт', 'current', 'personal', 'USD', 5420.75, '40817840500000789012', true, NULL, '#8B5CF6', '2023-06-20T09:15:00', '2025-02-04T10:30:00'),
    
    -- acc-4: Счёт для покупок (Personal)
    ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000001', 'Счёт для покупок', 'current', 'personal', 'RUB', 34500.00, '40817810500000111222', true, NULL, '#F59E0B', '2023-09-05T11:30:00', '2025-02-04T10:30:00'),
    
    -- acc-5: Евро счёт (Business)
    ('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000001', 'Евро счёт', 'current', 'business', 'EUR', 3250.00, '40817978500000555666', true, NULL, '#14B8A6', '2024-02-14T16:45:00', '2025-02-04T10:30:00'),
    
    -- acc-6: Вклад "Выгодный" (Investment)
    ('66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000001', 'Вклад "Выгодный"', 'deposit', 'investment', 'RUB', 500000.00, '42305810500000333444', true, 12.0, '#EC4899', '2024-06-01T10:00:00', '2025-02-04T10:30:00')
ON CONFLICT (account_number) DO NOTHING;

-- ========================
-- 3. INSERT CARDS
-- ========================

-- card-1: Основная карта для acc-1 (Основной счёт)
INSERT INTO cards (id, account_id, card_number, card_type, payment_system, status, is_primary, expiry_date, daily_limit, monthly_limit, online_payments_enabled, contactless_enabled, foreign_payments_enabled, issued_at, activated_at, created_at, updated_at)
VALUES
    ('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '2200 **** **** 1234', 'debit', 'MIR', 'active', true, '12/27', 300000.00, 500000.00, true, true, false, '2022-03-15T10:00:00', '2022-03-20T14:30:00', '2022-03-15T10:00:00', '2025-02-04T10:30:00'),
    
    -- card-2: Виртуальная карта для acc-1 (Основной счёт)
    ('c2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '5536 **** **** 9012', 'virtual', 'Mastercard', 'active', false, '12/27', 50000.00, 100000.00, true, false, true, '2024-01-10T12:00:00', '2024-01-10T12:05:00', '2024-01-10T12:00:00', '2025-02-04T10:30:00'),
    
    -- card-3: Карта для acc-4 (Счёт для покупок)
    ('c3333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', '4276 **** **** 5678', 'debit', 'Visa', 'active', true, '08/26', 100000.00, 300000.00, true, true, true, '2023-09-05T11:30:00', '2023-09-10T09:15:00', '2023-09-05T11:30:00', '2025-02-04T10:30:00')
ON CONFLICT (card_number) DO NOTHING;

-- ========================
-- 4. INSERT TRANSACTIONS
-- ========================

-- Transactions for acc-1 (Основной счёт)
INSERT INTO transactions (account_id, card_id, date, description, category, amount, currency, type, merchant, mcc_code, status, created_at, updated_at, completed_at)
VALUES
    -- Income transaction
    ('11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', '2025-02-04T10:00:00', 'Зарплата за январь', 'salary', 185000.00, 'RUB', 'income', 'ООО "Компания"', NULL, 'completed', '2025-02-04T10:00:00', '2025-02-04T10:00:00', '2025-02-04T10:00:00'),
    
    -- Expense transactions
    ('11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', '2025-02-03T15:30:00', 'Перекрёсток', 'groceries', -3450.50, 'RUB', 'expense', 'Перекрёсток', '5411', 'completed', '2025-02-03T15:30:00', '2025-02-03T15:30:00', '2025-02-03T15:30:00'),
    
    ('11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', '2025-02-03T18:45:00', 'Яндекс.Такси', 'transport', -520.00, 'RUB', 'expense', 'Яндекс.Такси', '4121', 'completed', '2025-02-03T18:45:00', '2025-02-03T18:45:00', '2025-02-03T18:45:00'),
    
    ('11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', '2025-02-02T20:15:00', 'Ресторан "Белуга"', 'restaurants', -4500.00, 'RUB', 'expense', 'Ресторан "Белуга"', '5812', 'completed', '2025-02-02T20:15:00', '2025-02-02T20:15:00', '2025-02-02T20:15:00'),
    
    ('11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', '2025-02-01T14:20:00', 'Яндекс.Плюс', 'entertainment', -199.00, 'RUB', 'expense', 'Яндекс', '5816', 'completed', '2025-02-01T14:20:00', '2025-02-01T14:20:00', '2025-02-01T14:20:00');

-- Transactions for acc-4 (Счёт для покупок)
INSERT INTO transactions (account_id, card_id, date, description, category, amount, currency, type, merchant, mcc_code, status, created_at, updated_at, completed_at)
VALUES
    ('44444444-4444-4444-4444-444444444444', 'c3333333-3333-3333-3333-333333333333', '2025-02-04T12:00:00', 'ZARA - покупка одежды', 'shopping', -12500.00, 'RUB', 'expense', 'ZARA', '5651', 'completed', '2025-02-04T12:00:00', '2025-02-04T12:00:00', '2025-02-04T12:00:00'),
    
    ('44444444-4444-4444-4444-444444444444', 'c3333333-3333-3333-3333-333333333333', '2025-02-03T10:30:00', 'Евросеть - телефон', 'shopping', -25000.00, 'RUB', 'expense', 'Евросеть', '7273', 'completed', '2025-02-03T10:30:00', '2025-02-03T10:30:00', '2025-02-03T10:30:00');

-- Transactions for acc-2 (Накопительный счёт)
INSERT INTO transactions (account_id, card_id, date, description, category, amount, currency, type, merchant, mcc_code, status, created_at, updated_at, completed_at)
VALUES
    ('22222222-2222-2222-2222-222222222222', NULL, '2025-02-01T00:00:00', 'Процент на накопления - январь', 'investments', 10416.67, 'RUB', 'income', 'Система', NULL, 'completed', '2025-02-01T00:00:00', '2025-02-01T00:00:00', '2025-02-01T00:00:00');

-- Transactions for acc-3 (Долларовый счёт)
INSERT INTO transactions (account_id, card_id, date, description, category, amount, currency, type, merchant, mcc_code, status, created_at, updated_at, completed_at)
VALUES
    ('33333333-3333-3333-3333-333333333333', NULL, '2025-02-02T08:00:00', 'Трансфер USD из основного счёта', 'transfer', 5000.00, 'USD', 'income', 'Система', NULL, 'completed', '2025-02-02T08:00:00', '2025-02-02T08:00:00', '2025-02-02T08:00:00');

-- Transactions for acc-5 (Евро счёт - Business)
INSERT INTO transactions (account_id, card_id, date, description, category, amount, currency, type, merchant, mcc_code, status, created_at, updated_at, completed_at)
VALUES
    ('55555555-5555-5555-5555-555555555555', NULL, '2025-02-03T11:00:00', 'Платёж поставщику - материалы', 'shopping', -1500.00, 'EUR', 'expense', 'Supplier GmbH', '4214', 'completed', '2025-02-03T11:00:00', '2025-02-03T11:00:00', '2025-02-03T11:00:00');

-- Transactions for acc-6 (Вклад "Выгодный" - Investment)
INSERT INTO transactions (account_id, card_id, date, description, category, amount, currency, type, merchant, mcc_code, status, created_at, updated_at, completed_at)
VALUES
    ('66666666-6666-6666-6666-666666666666', NULL, '2025-02-01T00:00:00', 'Процент на вклад - январь', 'investments', 5000.00, 'RUB', 'income', 'Система', NULL, 'completed', '2025-02-01T00:00:00', '2025-02-01T00:00:00', '2025-02-01T00:00:00'),
    
    ('66666666-6666-6666-6666-666666666666', NULL, '2025-06-01T00:00:00', 'Открытие вклада', 'investments', -500000.00, 'RUB', 'expense', 'Система', NULL, 'completed', '2024-06-01T10:00:00', '2024-06-01T10:00:00', '2024-06-01T10:00:00');

-- ========================
-- 5. VERIFY DATA
-- ========================
-- Run these queries to verify the data:
-- SELECT COUNT(*) as account_count, COUNT(DISTINCT account_category) as categories FROM accounts WHERE user_id = '00000000-0000-0000-0000-000000000001';
-- SELECT COUNT(*) as card_count FROM cards WHERE account_id IN (SELECT id FROM accounts WHERE user_id = '00000000-0000-0000-0000-000000000001');
-- SELECT COUNT(*) as transaction_count FROM transactions WHERE account_id IN (SELECT id FROM accounts WHERE user_id = '00000000-0000-0000-0000-000000000001');
