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
        <Spin size="large" tip="Загрузка данных..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Ошибка загрузки данных</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => loadAll()} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Повторить попытку
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
