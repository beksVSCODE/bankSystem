import { useState, useMemo } from 'react';
import { Input, List, Tag, Empty } from 'antd';
import { Modal } from '@/components/ui/modal';
import { SearchOutlined, CreditCardOutlined, SwapOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, categoryInfo, getPrimaryCard } from '@/mock/data';
import { useSupabaseFinancialStore } from '@/mock/supabaseFinancialStore';

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

interface SearchResult {
  type: 'account' | 'transaction' | 'action';
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  path?: string;
  action?: () => void;
}

export const GlobalSearch = ({ open, onClose }: GlobalSearchProps) => {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  
  // Получаем данные из Supabase
  const accounts = useSupabaseFinancialStore(state => state.accounts);
  const cards = useSupabaseFinancialStore(state => state.cards);
  const transactions = useSupabaseFinancialStore(state => state.transactions);

  const quickActions: SearchResult[] = [
    { type: 'action', id: 'transfer', title: 'Перевод средств', subtitle: 'Перевести деньги', icon: <SwapOutlined />, path: '/accounts' },
    { type: 'action', id: 'accounts', title: 'Мои счета', subtitle: 'Просмотр всех счетов', icon: <CreditCardOutlined />, path: '/accounts' },
    { type: 'action', id: 'profile', title: 'Профиль', subtitle: 'Настройки аккаунта', icon: <UserOutlined />, path: '/profile' },
  ];

  const results = useMemo<SearchResult[]>(() => {
    if (!searchText.trim()) {
      return quickActions;
    }

    const query = searchText.toLowerCase();
    const foundResults: SearchResult[] = [];

    // Search accounts
    accounts.forEach(acc => {
      const primaryCard = getPrimaryCard(acc.id, cards);
      if (
        acc.name.toLowerCase().includes(query) ||
        acc.accountNumber.includes(query) ||
        (primaryCard && primaryCard.cardNumber.includes(query))
      ) {
        foundResults.push({
          type: 'account',
          id: acc.id,
          title: acc.name,
          subtitle: formatCurrency(acc.balance, acc.currency),
          icon: <CreditCardOutlined style={{ color: acc.color }} />,
          path: '/accounts',
        });
      }
    });

    // Search transactions
    transactions.forEach(tx => {
      if (
        tx.description.toLowerCase().includes(query) ||
        (tx.merchant && tx.merchant.toLowerCase().includes(query)) ||
        categoryInfo[tx.category].nameRu.toLowerCase().includes(query)
      ) {
        foundResults.push({
          type: 'transaction',
          id: tx.id,
          title: tx.description,
          subtitle: formatCurrency(tx.amount),
          icon: <Tag style={{ backgroundColor: `${categoryInfo[tx.category].color}15`, color: categoryInfo[tx.category].color, border: 'none', margin: 0 }}>
            {categoryInfo[tx.category].nameRu}
          </Tag>,
          path: '/transactions',
        });
      }
    });

    // Filter quick actions
    quickActions.forEach(action => {
      if (action.title.toLowerCase().includes(query) || action.subtitle.toLowerCase().includes(query)) {
        foundResults.push(action);
      }
    });

    return foundResults.slice(0, 10);
  }, [searchText, accounts, cards, transactions, quickActions]);

  const handleSelect = (result: SearchResult) => {
    if (result.action) {
      result.action();
    } else if (result.path) {
      navigate(result.path);
    }
    onClose();
    setSearchText('');
  };

  return (
    <Modal
      title={null}
      open={open}
      onCancel={() => {
        onClose();
        setSearchText('');
      }}
      footer={null}
      width={560}
      closable={false}
      className="search-modal"
      styles={{ body: { padding: 0 } }}
    >
      <div className="p-4 border-b border-border">
        <Input
          size="large"
          placeholder="Поиск счетов, операций, действий..."
          prefix={<SearchOutlined className="text-muted-foreground" />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          autoFocus
          allowClear
        />
      </div>

      <div className="max-h-96 overflow-y-auto">
        {results.length > 0 ? (
          <List
            dataSource={results}
            renderItem={item => (
              <List.Item
                className="px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSelect(item)}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{item.subtitle}</p>
                  </div>
                  <Tag className="capitalize">
                    {item.type === 'account' ? 'Счёт' : item.type === 'transaction' ? 'Операция' : 'Действие'}
                  </Tag>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Empty
            description="Ничего не найдено"
            className="py-12"
          />
        )}
      </div>

      <div className="p-3 border-t border-border bg-muted/30 text-center">
        <p className="text-xs text-muted-foreground">
          Используйте <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs">⌘K</kbd> или <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs">Ctrl+K</kbd> для быстрого поиска
        </p>
      </div>
    </Modal>
  );
};
