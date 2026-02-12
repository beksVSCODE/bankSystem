-- ============================================
-- ВРЕМЕННОЕ ОТКЛЮЧЕНИЕ RLS ДЛЯ ТЕСТИРОВАНИЯ
-- ============================================
-- ВНИМАНИЕ: Это для разработки! В production включите обратно!

-- Отключаем RLS на всех таблицах
ALTER TABLE accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE cards DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;

-- После тестирования ОБЯЗАТЕЛЬНО включите обратно:
-- ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Проверяем данные
SELECT 'accounts' as table_name, COUNT(*) as count FROM accounts
UNION ALL
SELECT 'cards', COUNT(*) FROM cards
UNION ALL
SELECT 'transactions', COUNT(*) FROM transactions;
