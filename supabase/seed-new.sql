-- ============================================
-- SEED DATA ДЛЯ НОВОЙ АРХИТЕКТУРЫ
-- ============================================
-- Тестовые данные для FinSim Dashboard
-- User ID: 00000000-0000-0000-0000-000000000001

-- Clear existing test data (optional - uncomment if you want to reset)
-- DELETE FROM transactions WHERE account_id IN (SELECT id FROM accounts WHERE user_id = '00000000-0000-0000-0000-000000000001');
-- DELETE FROM cards WHERE account_id IN (SELECT id FROM accounts WHERE user_id = '00000000-0000-0000-0000-000000000001');
-- DELETE FROM accounts WHERE user_id = '00000000-0000-0000-0000-000000000001';

-- ============================================
-- 1. СОЗДАНИЕ СЧЕТОВ (Accounts)
-- ============================================
-- ВАЖНО: Баланс хранится ТОЛЬКО у счета!

INSERT INTO accounts (id, user_id, name, account_type, account_number, currency, balance, is_active, interest_rate, term_months, maturity_date, overdraft_limit)
VALUES
    -- Текущий счёт (основной)
    ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 
     'Основной счёт', 'current', '40817810500000123456', 'RUB', 245890.50, TRUE, NULL, NULL, NULL, NULL),
    
    -- Накопительный счёт
    ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 
     'Накопительный счёт', 'savings', '40817810500000654321', 'RUB', 1250000.00, TRUE, 5.5, NULL, NULL, NULL),
    
    -- Долларовый счёт
    ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 
     'Долларовый счёт', 'current', '40817840500000789012', 'USD', 5420.75, TRUE, NULL, NULL, NULL, NULL),
    
    -- Счёт для покупок
    ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 
     'Счёт для покупок', 'current', '40817810500000111222', 'RUB', 34500.00, TRUE, NULL, NULL, NULL, NULL),
    
    -- Евро счёт
    ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 
     'Евро счёт', 'current', '40817978500000555666', 'EUR', 3250.00, TRUE, NULL, NULL, NULL, NULL),
    
    -- Вклад
    ('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 
     'Вклад "Выгодный"', 'deposit', '42305810500000333444', 'RUB', 500000.00, TRUE, 7.5, 12, '2027-02-12', NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. СОЗДАНИЕ КАРТ (Cards)
-- ============================================
-- ВАЖНО: Карты НЕ имеют баланса, только привязаны к счетам!

INSERT INTO cards (id, account_id, card_number, card_type, payment_system, expiry_date, cvv, pin, status, is_primary, daily_limit, monthly_limit, contactless, online_payments, abroad_payments)
VALUES
    -- Карта для основного счёта (MIR, дебетовая, основная)
    ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
     '2200 1234 5678 9012', 'debit', 'MIR', '12/2027', '123', '1234', 'active', TRUE, 100000.00, 300000.00, TRUE, TRUE, FALSE),
    
    -- Дополнительная виртуальная карта для основного счёта
    ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001',
     '2200 9876 5432 1098', 'virtual', 'MIR', '12/2027', '456', NULL, 'active', FALSE, 50000.00, 150000.00, TRUE, TRUE, FALSE),
    
    -- Карта для счёта покупок (Visa)
    ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000004',
     '4276 1234 5678 9012', 'debit', 'Visa', '08/2026', '789', '5678', 'active', TRUE, 75000.00, 200000.00, TRUE, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. СОЗДАНИЕ ТРАНЗАКЦИЙ (Transactions)
-- ============================================
-- Транзакции привязаны к СЧЁТУ (обязательно) и КАРТЕ (опционально)

-- Зарплата (без карты - прямое зачисление на счёт)
INSERT INTO transactions (account_id, card_id, date, description, category, amount, currency, type, merchant, status)
VALUES
    ('10000000-0000-0000-0000-000000000001', NULL, '2026-02-01T10:00:00', 'Зарплата за январь', 'salary', 185000.00, 'RUB', 'income', 'ООО "Компания"', 'completed');

-- Покупки через карту (списание со счёта через основную карту)
INSERT INTO transactions (account_id, card_id, date, description, category, amount, currency, type, merchant, status, mcc_code, location)
VALUES
    ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '2026-02-03T15:30:00', 'Покупка продуктов', 'groceries', 3450.50, 'RUB', 'expense', 'Перекрёсток', 'completed', '5411', 'Москва, ул. Ленина 10'),
    ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '2026-02-04T18:45:00', 'Ужин в ресторане', 'restaurants', 4500.00, 'RUB', 'expense', 'Ресторан "Белуга"', 'completed', '5812', 'Москва, Тверская 15'),
    ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '2026-01-25T14:30:00', 'Поездка на такси', 'transport', 650.00, 'RUB', 'expense', 'Яндекс.Такси', 'completed', '4121', NULL);

-- Покупки через виртуальную карту
INSERT INTO transactions (account_id, card_id, date, description, category, amount, currency, type, merchant, status, mcc_code)
VALUES
    ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', '2026-02-05T11:20:00', 'Подписка Netflix', 'entertainment', 999.00, 'RUB', 'expense', 'Netflix', 'completed', '7832');

-- Покупки через карту Visa (счёт для покупок)
INSERT INTO transactions (account_id, card_id, date, description, category, amount, currency, type, merchant, status, mcc_code, location)
VALUES
    ('10000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000003', '2026-01-28T09:20:00', 'Покупка одежды', 'shopping', 12500.00, 'RUB', 'expense', 'ZARA', 'completed', '5651', 'Москва, ТЦ Европейский');

-- Коммунальные платежи (без карты)
INSERT INTO transactions (account_id, card_id, date, description, category, amount, currency, type, merchant, status)
VALUES
    ('10000000-0000-0000-0000-000000000001', NULL, '2026-02-02T12:15:00', 'Оплата за интернет', 'utilities', 890.00, 'RUB', 'expense', 'Ростелеком', 'completed');

-- Перевод между счетами (expense со счёта-отправителя)
INSERT INTO transactions (account_id, card_id, date, description, category, amount, currency, type, status, notes)
VALUES
    ('10000000-0000-0000-0000-000000000001', NULL, '2026-02-06T16:00:00', 'Пополнение накопительного счёта', 'transfer', 50000.00, 'RUB', 'expense', 'completed', 'Перевод на накопительный счёт');

-- Перевод между счетами (income на счёт-получатель)
INSERT INTO transactions (account_id, card_id, date, description, category, amount, currency, type, status, notes)
VALUES
    ('10000000-0000-0000-0000-000000000002', NULL, '2026-02-06T16:00:00', 'Пополнение со основного счёта', 'transfer', 50000.00, 'RUB', 'income', 'completed', 'Перевод с основного счёта');

-- Начисление процентов по накопительному счёту
INSERT INTO transactions (account_id, card_id, date, description, category, amount, currency, type, status, notes)
VALUES
    ('10000000-0000-0000-0000-000000000002', NULL, '2026-02-01T00:00:00', 'Начисление процентов', 'interest', 5729.17, 'RUB', 'income', 'completed', 'Проценты по ставке 5.5% годовых');

-- Начисление процентов по вкладу
INSERT INTO transactions (account_id, card_id, date, description, category, amount, currency, type, status, notes)
VALUES
    ('10000000-0000-0000-0000-000000000006', NULL, '2026-02-01T00:00:00', 'Начисление процентов', 'interest', 3125.00, 'RUB', 'income', 'completed', 'Проценты по ставке 7.5% годовых');

-- Операция в долларах
INSERT INTO transactions (account_id, card_id, date, description, category, amount, currency, type, merchant, status, mcc_code)
VALUES
    ('10000000-0000-0000-0000-000000000003', NULL, '2026-02-07T14:25:00', 'Покупка на Amazon', 'shopping', 89.99, 'USD', 'expense', 'Amazon.com', 'completed', '5942');

-- Операция в евро
INSERT INTO transactions (account_id, card_id, date, description, category, amount, currency, type, merchant, status)
VALUES
    ('10000000-0000-0000-0000-000000000005', NULL, '2026-02-08T10:15:00', 'Оплата отеля', 'travel', 250.00, 'EUR', 'expense', 'Booking.com', 'completed');

-- ============================================
-- ИТОГИ МИГРАЦИИ
-- ============================================
-- ✅ Создано 6 счетов (accounts)
-- ✅ Создано 3 карты (cards) - привязаны к счетам 1 и 4
-- ✅ Создано 14 транзакций (transactions) - часть с картами, часть без
-- 
-- АРХИТЕКТУРА:
-- - Баланс ТОЛЬКО у счетов (accounts.balance)
-- - Карты НЕ имеют баланса, только лимиты
-- - Транзакции привязаны к счёту (обязательно) + карте (опционально)
-- - У одного счёта может быть несколько карт
-- - Транзакции без card_id: зарплаты, переводы, начисление процентов
-- - Транзакции с card_id: покупки через карту
