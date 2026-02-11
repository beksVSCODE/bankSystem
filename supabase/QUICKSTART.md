# Быстрый старт с Supabase

## 1. Установка (✅ Уже выполнено)
```bash
npm install @supabase/supabase-js
```

## 2. Создание проекта в Supabase

### Шаг 1: Регистрация
1. Откройте [https://app.supabase.com](https://app.supabase.com)
2. Войдите через GitHub или создайте аккаунт
3. Нажмите "New Project"

### Шаг 2: Настройка проекта
- **Name**: finsim-dashboard (или любое имя)
- **Database Password**: придумайте надёжный пароль (сохраните!)
- **Region**: выберите ближайший регион (Europe West для РФ)
- Нажмите "Create new project"
- Подождите 2-3 минуты инициализации

## 3. Создание таблиц

### Вариант А: Через SQL Editor (Рекомендуется)
1. В левом меню нажмите **SQL Editor**
2. Нажмите **New query**
3. Скопируйте весь код из файла `supabase/schema.sql`
4. Вставьте в редактор
5. Нажмите **Run** (или Ctrl+Enter)
6. Дождитесь сообщения "Success"

### Вариант Б: Через Table Editor (Визуальный)
1. В левом меню нажмите **Table Editor**
2. Создайте таблицы вручную (долго, не рекомендуется)

## 4. Заполнение тестовыми данными

1. В **SQL Editor** создайте новый запрос
2. Скопируйте код из файла `supabase/seed.sql`
3. Вставьте и нажмите **Run**
4. Проверьте результат в **Table Editor**

## 5. Настройка переменных окружения

### Получение ключей:
1. В Supabase откройте **Settings** (⚙️ внизу слева)
2. Выберите **API**
3. Скопируйте:
   - **Project URL** (например: https://abcdefgh.supabase.co)
   - **anon public** ключ (длинная строка)

### Создание .env файла:
1. Создайте файл `.env` в корне проекта:
   ```bash
   # Windows
   copy .env.template .env
   
   # Linux/Mac
   cp .env.template .env
   ```

2. Откройте `.env` и заполните:
   ```
   VITE_SUPABASE_URL=https://ваш-проект.supabase.co
   VITE_SUPABASE_ANON_KEY=ваш-anon-ключ
   ```

3. **Важно**: Добавьте `.env` в `.gitignore` (уже должно быть)

## 6. Перезапуск проекта

```bash
# Остановите текущий процесс (Ctrl+C)
npm run dev
```

## 7. Проверка подключения

Создайте тестовый файл или используйте консоль браузера:

```typescript
import { supabase } from '@/lib/supabase';

// В консоли браузера или в компоненте:
const testConnection = async () => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error('Ошибка подключения:', error);
  } else {
    console.log('✅ Подключение работает!', data);
  }
};

testConnection();
```

## 8. Использование в компонентах

### Простой пример:
```typescript
import { useAccounts } from '@/hooks/useSupabase';

export const MyComponent = () => {
  const userId = '00000000-0000-0000-0000-000000000001';
  const { data: accounts, isLoading } = useAccounts(userId);

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div>
      {accounts?.map(acc => (
        <div key={acc.id}>{acc.name}: {acc.balance}</div>
      ))}
    </div>
  );
};
```

## 9. Миграция с mock данных

### До:
```typescript
import { mockAccounts } from '@/mock/data';
const accounts = mockAccounts;
```

### После:
```typescript
import { useAccounts } from '@/hooks/useSupabase';
const { data: accounts } = useAccounts(userId);
```

## Что создано

### Файлы:
- ✅ `supabase/schema.sql` - схема БД (таблицы, индексы, RLS)
- ✅ `supabase/seed.sql` - тестовые данные
- ✅ `supabase/README.md` - полная документация
- ✅ `src/lib/supabase.ts` - клиент Supabase
- ✅ `src/services/supabaseService.ts` - сервисы для работы с БД
- ✅ `src/hooks/useSupabase.ts` - React Query хуки
- ✅ `src/examples/SupabaseExamples.tsx` - примеры использования
- ✅ `.env.template` - шаблон переменных окружения

### Таблицы в БД:
- `users` - пользователи
- `accounts` - счета
- `transactions` - транзакции
- `notifications` - уведомления

### Функции:
- Автоматические триггеры для `updated_at`
- Row Level Security (RLS) - защита данных
- Индексы для быстрых запросов

## Частые проблемы

### "Missing Supabase environment variables"
- Проверьте что `.env` файл создан
- Перезапустите `npm run dev`

### "relation does not exist"
- Выполните `schema.sql` в SQL Editor
- Проверьте что таблицы созданы в Table Editor

### "JWT expired" или ошибки авторизации
- Проверьте что RLS политики настроены
- Для тестирования можно временно отключить RLS

### Нет данных
- Выполните `seed.sql`
- Проверьте данные в Table Editor

## Дополнительно

### Realtime подписки:
```typescript
supabase
  .channel('transactions')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, 
    payload => console.log(payload)
  )
  .subscribe();
```

### Storage (загрузка файлов):
```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('user-avatar.png', file);
```

### Auth (полная аутентификация):
```typescript
// Вход
await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Получение пользователя
const { data: { user } } = await supabase.auth.getUser();
```

## Следующие шаги

1. ✅ Настройте .env файл
2. ✅ Запустите schema.sql в Supabase
3. ✅ Запустите seed.sql для тестовых данных
4. ⬜ Замените mock данные в одном компоненте
5. ⬜ Протестируйте работу
6. ⬜ Постепенно мигрируйте остальные компоненты

## Помощь

- [Supabase Docs](https://supabase.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- Подробности в `supabase/README.md`
