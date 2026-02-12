-- ============================================
-- БЕЗОПАСНАЯ МИГРАЦИЯ НА НОВУЮ АРХИТЕКТУРУ
-- ============================================
-- Этот скрипт можно запускать на существующей базе
-- Он НЕ удаляет таблицу users, а только добавляет новые таблицы

-- Enable UUID extension (если не включено)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 0. УДАЛЕНИЕ СТАРЫХ ТАБЛИЦ (если существуют)
-- ============================================
-- ВНИМАНИЕ: Это удалит все данные в старых таблицах!
-- Если нужно сохранить данные, сначала сделайте резервную копию

DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;

-- ============================================
-- 1. СОЗДАНИЕ НОВЫХ ТАБЛИЦ
-- ============================================

-- ============================================
-- 1. СОЗДАНИЕ НОВЫХ ТАБЛИЦ
-- ============================================

-- Accounts Table (Главная сущность - финансовый контейнер)
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Финансовые данные (БАЛАНС ТОЛЬКО У СЧЁТА!)
    balance DECIMAL(15, 2) DEFAULT 0 NOT NULL,
    currency VARCHAR(3) DEFAULT 'RUB' NOT NULL,
    
    -- Классификация счёта
    account_type VARCHAR(20) NOT NULL,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    
    -- Описание
    name VARCHAR(200) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Условия (для накопительных/вкладов)
    interest_rate DECIMAL(5, 2),            -- процентная ставка (например, 5.5%)
    term_months INTEGER,                    -- срок вклада в месяцах
    maturity_date DATE,                     -- дата окончания вклада
    overdraft_limit DECIMAL(15, 2),         -- лимит овердрафта для кредитных счетов
    
    -- Временные метки
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE,
    
    -- Ограничения (table-level constraints)
    CONSTRAINT check_accounts_currency CHECK (currency IN ('RUB', 'USD', 'EUR')),
    CONSTRAINT check_accounts_account_type CHECK (account_type IN ('current', 'savings', 'deposit', 'credit'))
);

-- Cards Table (Инструменты доступа к счетам - БЕЗ баланса!)
CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    
    -- Данные карты
    card_number VARCHAR(19) NOT NULL,
    card_type VARCHAR(20) NOT NULL,
    payment_system VARCHAR(20) NOT NULL,
    
    -- Безопасность
    expiry_date VARCHAR(7) NOT NULL,        -- MM/YYYY
    cvv VARCHAR(4) NOT NULL,
    pin VARCHAR(4),
    
    -- Статус и лимиты
    status VARCHAR(20) DEFAULT 'active',
    is_primary BOOLEAN DEFAULT FALSE,       -- основная карта счета
    
    -- Лимиты (опционально)
    daily_limit DECIMAL(15, 2),
    monthly_limit DECIMAL(15, 2),
    
    -- Настройки использования
    contactless BOOLEAN DEFAULT TRUE,
    online_payments BOOLEAN DEFAULT TRUE,
    abroad_payments BOOLEAN DEFAULT FALSE,
    
    -- История
    block_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ограничения (table-level constraints)
    CONSTRAINT check_cards_card_type CHECK (card_type IN ('debit', 'credit', 'virtual')),
    CONSTRAINT check_cards_payment_system CHECK (payment_system IN ('MIR', 'Visa', 'Mastercard')),
    CONSTRAINT check_cards_status CHECK (status IN ('active', 'blocked', 'expired'))
);

-- Transactions Table (Операции по счетам с привязкой к картам)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    card_id UUID REFERENCES cards(id) ON DELETE SET NULL,  -- опционально
    
    -- Финансовые данные
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'RUB' NOT NULL,
    
    -- Классификация
    type VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'completed',
    
    -- Описание
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    description TEXT NOT NULL,
    merchant TEXT,
    mcc_code VARCHAR(4),                    -- Merchant Category Code
    
    -- Геолокация (опционально)
    location TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Метаданные
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ограничения (table-level constraints)
    CONSTRAINT check_transactions_type CHECK (type IN ('income', 'expense', 'transfer')),
    CONSTRAINT check_transactions_status CHECK (status IN ('pending', 'completed', 'failed', 'cancelled'))
);

-- ============================================
-- 2. СОЗДАНИЕ ИНДЕКСОВ (IF NOT EXISTS)
-- ============================================

-- Индексы для accounts
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_account_type ON accounts(account_type);
CREATE INDEX IF NOT EXISTS idx_accounts_currency ON accounts(currency);
CREATE INDEX IF NOT EXISTS idx_accounts_is_active ON accounts(is_active);

-- Индексы для cards
CREATE INDEX IF NOT EXISTS idx_cards_account_id ON cards(account_id);
CREATE INDEX IF NOT EXISTS idx_cards_card_number ON cards(card_number);
CREATE INDEX IF NOT EXISTS idx_cards_status ON cards(status);
CREATE INDEX IF NOT EXISTS idx_cards_is_primary ON cards(is_primary);

-- Индексы для transactions
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_card_id ON transactions(card_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_merchant ON transactions(merchant);

-- ============================================
-- 3. ТРИГГЕРЫ ДЛЯ UPDATED_AT
-- ============================================

-- Функция обновления timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для accounts
DROP TRIGGER IF EXISTS update_accounts_updated_at ON accounts;
CREATE TRIGGER update_accounts_updated_at
    BEFORE UPDATE ON accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Триггер для cards
DROP TRIGGER IF EXISTS update_cards_updated_at ON cards;
CREATE TRIGGER update_cards_updated_at
    BEFORE UPDATE ON cards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Триггер для transactions
DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Включаем RLS для всех таблиц
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Политики для accounts
DROP POLICY IF EXISTS "Users can view their own accounts" ON accounts;
CREATE POLICY "Users can view their own accounts" ON accounts
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own accounts" ON accounts;
CREATE POLICY "Users can insert their own accounts" ON accounts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own accounts" ON accounts;
CREATE POLICY "Users can update their own accounts" ON accounts
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own accounts" ON accounts;
CREATE POLICY "Users can delete their own accounts" ON accounts
    FOR DELETE USING (auth.uid() = user_id);

-- Политики для cards
DROP POLICY IF EXISTS "Users can view cards for their accounts" ON cards;
CREATE POLICY "Users can view cards for their accounts" ON cards
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM accounts 
            WHERE accounts.id = cards.account_id 
            AND accounts.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert cards for their accounts" ON cards;
CREATE POLICY "Users can insert cards for their accounts" ON cards
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM accounts 
            WHERE accounts.id = cards.account_id 
            AND accounts.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update cards for their accounts" ON cards;
CREATE POLICY "Users can update cards for their accounts" ON cards
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM accounts 
            WHERE accounts.id = cards.account_id 
            AND accounts.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete cards for their accounts" ON cards;
CREATE POLICY "Users can delete cards for their accounts" ON cards
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM accounts 
            WHERE accounts.id = cards.account_id 
            AND accounts.user_id = auth.uid()
        )
    );

-- Политики для transactions
DROP POLICY IF EXISTS "Users can view transactions for their accounts" ON transactions;
CREATE POLICY "Users can view transactions for their accounts" ON transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM accounts 
            WHERE accounts.id = transactions.account_id 
            AND accounts.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert transactions for their accounts" ON transactions;
CREATE POLICY "Users can insert transactions for their accounts" ON transactions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM accounts 
            WHERE accounts.id = transactions.account_id 
            AND accounts.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update transactions for their accounts" ON transactions;
CREATE POLICY "Users can update transactions for their accounts" ON transactions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM accounts 
            WHERE accounts.id = transactions.account_id 
            AND accounts.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete transactions for their accounts" ON transactions;
CREATE POLICY "Users can delete transactions for their accounts" ON transactions
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM accounts 
            WHERE accounts.id = transactions.account_id 
            AND accounts.user_id = auth.uid()
        )
    );

-- ============================================
-- 5. КОММЕНТАРИИ К ТАБЛИЦАМ
-- ============================================

COMMENT ON TABLE accounts IS 'Финансовые счета пользователей - ГЛАВНАЯ сущность системы. ТОЛЬКО здесь хранится баланс!';
COMMENT ON TABLE cards IS 'Карты - инструменты доступа к счетам. НЕ имеют собственного баланса, только лимиты и настройки.';
COMMENT ON TABLE transactions IS 'Транзакции связаны со СЧЕТОМ (обязательно) и КАРТОЙ (опционально). Баланс меняется на уровне счета.';

COMMENT ON COLUMN accounts.balance IS 'ЕДИНСТВЕННОЕ место в системе, где хранится баланс! Карты баланса НЕ имеют.';
COMMENT ON COLUMN cards.account_id IS 'Карта всегда привязана к счету. Несколько карт могут быть у одного счета.';
COMMENT ON COLUMN transactions.card_id IS 'Опциональная привязка к карте. NULL для операций без карты (переводы между счетами, начисление процентов).';

-- Готово! Теперь можно запустить seed.sql для добавления тестовых данных.
