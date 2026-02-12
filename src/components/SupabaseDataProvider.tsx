import { useEffect } from 'react';
import { useSupabaseFinancialStore } from '@/mock/supabaseFinancialStore';
import { Spin } from 'antd';

export const SupabaseDataProvider = ({ children }: { children: React.ReactNode }) => {
  const { loadAll, isLoading, error, accounts, transactions } = useSupabaseFinancialStore();

  useEffect(() => {
    console.log('🔄 SupabaseDataProvider: Loading data from Supabase...');
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    console.log('📊 Current state:', { 
      accounts: accounts.length, 
      transactions: transactions.length,
      isLoading,
      error 
    });
  }, [accounts, transactions, isLoading, error]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    console.warn('⚠️ Ошибка загрузки из Supabase:', error);
    // Не блокируем приложение, просто показываем предупреждение
    return (
      <div className="min-h-screen flex flex-col">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Supabase не подключен:</strong> {error}
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Приложение работает с локальными данными. Проверьте подключение к Supabase.
              </p>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return <>{children}</>;
};
