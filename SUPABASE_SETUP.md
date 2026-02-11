# ✅ Чеклист интеграции Supabase

## Что уже сделано:

### ✅ Установка
- [x] Установлен пакет `@supabase/supabase-js`
- [x] Добавлен `.env` в `.gitignore`

### ✅ Файлы созданы
- [x] `supabase/schema.sql` - SQL схема базы данных
- [x] `supabase/seed.sql` - тестовые данные
- [x] `supabase/README.md` - полная документация
- [x] `supabase/QUICKSTART.md` - быстрый старт
- [x] `src/lib/supabase.ts` - клиент Supabase
- [x] `src/services/supabaseService.ts` - API сервисы
- [x] `src/hooks/useSupabase.ts` - React Query хуки
- [x] `src/examples/SupabaseExamples.tsx` - примеры использования
- [x] `.env.template` - шаблон переменных окружения

## Что нужно сделать вручную:

### 🔲 1. Создать проект в Supabase (5 минут)
1. Откройте https://app.supabase.com
2. Нажмите "New Project"
3. Заполните:
   - Name: finsim-dashboard
   - Database Password: придумайте и сохраните
   - Region: Europe West
4. Нажмите "Create new project"
5. Подождите 2-3 минуты

### 🔲 2. Выполнить SQL скрипты (2 минуты)
1. В Supabase: SQL Editor → New query
2. Скопируйте содержимое `supabase/schema.sql`
3. Вставьте и нажмите Run
4. Создайте новый запрос
5. Скопируйте содержимое `supabase/seed.sql`
6. Вставьте и нажмите Run

### 🔲 3. Настроить переменные окружения (1 минута)
1. В Supabase: Settings → API
2. Скопируйте:
   - Project URL
   - anon public ключ
3. Создайте файл `.env` в корне проекта:
   ```
   VITE_SUPABASE_URL=ваш-url
   VITE_SUPABASE_ANON_KEY=ваш-ключ
   ```
4. Перезапустите: `npm run dev`

### 🔲 4. Протестировать подключение (1 минута)
Откройте приложение в браузере и в консоли (F12) выполните:
```javascript
// Используйте динамический import для консоли браузера
const { supabase } = await import('./src/lib/supabase.ts');
const { data, error } = await supabase.from('accounts').select('*').limit(1);
if (error) console.error('Ошибка:', error);
else console.log('✅ Подключение работает!', data);
```

Альтернативно, создайте тестовый компонент или проверьте Network tab (должны появиться запросы к supabase.co)

## Структура БД

```
users
├── id (UUID, PK)
├── first_name
├── last_name
├── email (unique)
└── ...

accounts
├── id (UUID, PK)
├── user_id (FK → users)
├── name
├── balance
└── ...

transactions
├── id (UUID, PK)
├── account_id (FK → accounts)
├── amount
├── type (income/expense)
└── ...

notifications
├── id (UUID, PK)
├── user_id (FK → users)
├── title
└── ...
```

## Как использовать

### Вместо mock данных:
```typescript
// БЫЛО:
import { mockAccounts } from '@/mock/data';
const accounts = mockAccounts;

// СТАЛО:
import { useAccounts } from '@/hooks/useSupabase';
const { data: accounts } = useAccounts(userId);
```

### Примеры хуков:
```typescript
// Счета
const { data: accounts, isLoading } = useAccounts(userId);

// Транзакции
const { data: transactions } = useTransactions(accountId);

// Уведомления
const { data: notifications } = useNotifications(userId);

// Создание транзакции
const createTx = useCreateTransaction();
await createTx.mutateAsync({ ...txData });
```

## Следующие шаги

1. [ ] Выполните шаги 1-4 из списка выше
2. [ ] Откройте `supabase/QUICKSTART.md` для подробностей
3. [ ] Изучите примеры в `src/examples/SupabaseExamples.tsx`
4. [ ] Постепенно мигрируйте компоненты с mock на Supabase
5. [ ] Настройте аутентификацию (опционально)

## Полезные ссылки

- 📖 [Быстрый старт](./supabase/QUICKSTART.md)
- 📚 [Полная документация](./supabase/README.md)
- 🔧 [Примеры кода](./src/examples/SupabaseExamples.tsx)
- 🌐 [Supabase Docs](https://supabase.com/docs)

## Итого времени на настройку: ~10 минут
