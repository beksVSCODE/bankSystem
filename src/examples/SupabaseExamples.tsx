import { useAccounts, useTransactions } from '@/hooks/useSupabase';

/**
 * Пример использования Supabase в компонентах
 * 
 * Этот файл демонстрирует как заменить mock данные на реальные из Supabase
 */

// ПРИМЕР 1: Использование счетов из Supabase вместо mock данных
export const AccountsExample = () => {
  // Вместо:
  // import { mockAccounts } from '@/mock/data';
  
  // Используем:
  const userId = '00000000-0000-0000-0000-000000000001'; // Получите из auth
  const { data: accounts, isLoading, error } = useAccounts(userId);

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error.message}</div>;
  if (!accounts) return <div>Нет данных</div>;

  return (
    <div>
      {accounts.map(account => (
        <div key={account.id}>
          <h3>{account.name}</h3>
          <p>Баланс: {account.balance} {account.currency}</p>
        </div>
      ))}
    </div>
  );
};

// ПРИМЕР 2: Использование транзакций
export const TransactionsExample = () => {
  const { data: transactions, isLoading } = useTransactions();

  if (isLoading) return <div>Загрузка транзакций...</div>;

  return (
    <div>
      {transactions?.map(tx => (
        <div key={tx.id}>
          <p>{tx.description} - {tx.amount}</p>
        </div>
      ))}
    </div>
  );
};

// ПРИМЕР 3: Создание новой транзакции
import { useCreateTransaction } from '@/hooks/useSupabase';
import { message } from 'antd';

export const CreateTransactionExample = () => {
  const createTransaction = useCreateTransaction();

  const handleCreateTransaction = async () => {
    try {
      await createTransaction.mutateAsync({
        accountId: 'account-id',
        date: new Date().toISOString(),
        description: 'Новая покупка',
        category: 'shopping',
        amount: 1500,
        type: 'expense',
        status: 'completed',
      });
      message.success('Транзакция создана');
    } catch (error) {
      message.error('Ошибка создания транзакции');
    }
  };

  return (
    <button onClick={handleCreateTransaction}>
      {createTransaction.isPending ? 'Создание...' : 'Создать транзакцию'}
    </button>
  );
};

// ПРИМЕР 4: Миграция существующего компонента
// Файл: src/pages/Accounts.tsx

/*
// БЫЛО (с mock данными):
import { mockAccounts } from '@/mock/data';

export const Accounts = () => {
  const accounts = mockAccounts;
  
  return (
    <div>
      {accounts.map(acc => ...)}
    </div>
  );
};

// СТАЛО (с Supabase):
import { useAccounts } from '@/hooks/useSupabase';
import { useAuthStore } from '@/mock/authStore';

export const Accounts = () => {
  const user = useAuthStore(state => state.user);
  const { data: accounts, isLoading, error } = useAccounts(user?.id);
  
  if (isLoading) return <Spin />;
  if (error) return <Alert type="error" message={error.message} />;
  
  return (
    <div>
      {accounts?.map(acc => ...)}
    </div>
  );
};
*/

// ПРИМЕР 5: Работа с уведомлениями
import { useNotifications, useMarkNotificationAsRead } from '@/hooks/useSupabase';

export const NotificationsExample = () => {
  const userId = '00000000-0000-0000-0000-000000000001';
  const { data: notifications } = useNotifications(userId);
  const markAsRead = useMarkNotificationAsRead();

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead.mutate(notificationId);
  };

  return (
    <div>
      {notifications?.map(notif => (
        <div key={notif.id} onClick={() => handleMarkAsRead(notif.id)}>
          <strong>{notif.title}</strong>
          <p>{notif.message}</p>
          {!notif.read && <span>🔵 Новое</span>}
        </div>
      ))}
    </div>
  );
};

// ПРИМЕР 6: Realtime подписка (опционально)
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

export const RealtimeTransactionsExample = () => {
  const { data: transactions } = useTransactions();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Подписка на новые транзакции
    const channel = supabase
      .channel('transactions')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'transactions'
      }, (payload) => {
        console.log('Новая транзакция:', payload.new);
        // Обновить кеш
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return <div>Транзакции в реальном времени</div>;
};
