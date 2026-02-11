# Supabase Integration Guide

## Шаги по интеграции

### 1. Создание проекта в Supabase

1. Перейдите на [https://app.supabase.com](https://app.supabase.com)
2. Создайте новый проект
3. Дождитесь завершения инициализации

### 2. Настройка базы данных

1. В Supabase Dashboard откройте **SQL Editor**
2. Создайте новый запрос
3. Скопируйте содержимое файла `supabase/schema.sql`
4. Выполните SQL скрипт для создания таблиц и политик безопасности

### 3. Заполнение тестовыми данными

1. В SQL Editor создайте новый запрос
2. Скопируйте содержимое файла `supabase/seed.sql`
3. **ВАЖНО:** Замените UUID пользователя на реальный после настройки аутентификации
4. Выполните SQL скрипт

### 4. Настройка переменных окружения

1. Скопируйте `.env.example` в `.env`:
   ```bash
   cp .env.example .env
   ```

2. В Supabase Dashboard откройте **Settings → API**
3. Скопируйте:
   - Project URL → `VITE_SUPABASE_URL`
   - anon public key → `VITE_SUPABASE_ANON_KEY`

4. Заполните `.env`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### 5. Настройка Row Level Security (RLS)

Политики безопасности уже включены в `schema.sql`. Они обеспечивают:
- Пользователи видят только свои данные
- Невозможно получить доступ к данным других пользователей
- Автоматическая привязка к аутентифицированному пользователю

### 6. Использование в коде

#### Получение счетов:
```typescript
import { accountService } from '@/services/supabaseService';

const accounts = await accountService.getAccounts(userId);
```

#### Получение транзакций:
```typescript
import { transactionService } from '@/services/supabaseService';

// Все транзакции
const allTransactions = await transactionService.getTransactions();

// Транзакции конкретного счета
const accountTransactions = await transactionService.getTransactions(accountId);
```

#### Создание транзакции:
```typescript
const newTransaction = await transactionService.createTransaction({
  accountId: 'account-id',
  date: new Date().toISOString(),
  description: 'Покупка',
  category: 'shopping',
  amount: 1000,
  type: 'expense',
  merchant: 'Магазин',
  status: 'completed',
});
```

#### Получение уведомлений:
```typescript
import { notificationService } from '@/services/supabaseService';

const notifications = await notificationService.getNotifications(userId);
```

### 7. Настройка аутентификации (опционально)

Если хотите использовать Supabase Auth:

```typescript
import { supabase } from '@/lib/supabase';

// Регистрация
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
});

// Вход
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

// Выход
await supabase.auth.signOut();

// Получение текущего пользователя
const { data: { user } } = await supabase.auth.getUser();
```

### 8. Подписка на изменения в реальном времени

```typescript
// Подписка на новые транзакции
supabase
  .channel('transactions')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'transactions'
  }, (payload) => {
    console.log('Новая транзакция:', payload.new);
  })
  .subscribe();
```

## Структура таблиц

### users
- id (UUID, Primary Key)
- first_name, last_name, middle_name
- email (unique)
- phone
- avatar
- user_type (individual/business)
- created_at, last_login, updated_at

### accounts
- id (UUID, Primary Key)
- user_id (Foreign Key → users)
- name, type, currency
- balance
- account_number (unique)
- card_number, expiry_date
- is_active, color
- created_at, updated_at

### transactions
- id (UUID, Primary Key)
- account_id (Foreign Key → accounts)
- date, description, category
- amount, type (income/expense)
- merchant, status
- created_at, updated_at

### notifications
- id (UUID, Primary Key)
- user_id (Foreign Key → users)
- title, message, type
- read (boolean)
- created_at, updated_at

## Миграция с mock данных

Для постепенной миграции можно:

1. Создать хук `useSupabaseData`:
```typescript
import { useQuery } from '@tanstack/react-query';
import { accountService } from '@/services/supabaseService';

export const useAccounts = (userId: string) => {
  return useQuery({
    queryKey: ['accounts', userId],
    queryFn: () => accountService.getAccounts(userId),
  });
};
```

2. Заменить mock данные постепенно:
```typescript
// Старый способ
import { mockAccounts } from '@/mock/data';

// Новый способ
const { data: accounts } = useAccounts(userId);
```

## Безопасность

- ✅ Row Level Security включен
- ✅ Пользователи видят только свои данные
- ✅ API ключ защищен (anon key безопасен для клиента)
- ✅ Политики на уровне БД

## Дополнительные возможности

- **Storage**: Загрузка аватаров и документов
- **Edge Functions**: Серверная логика
- **Realtime**: Обновления в реальном времени
- **Auth**: Полная система аутентификации
