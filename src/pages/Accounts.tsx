import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Table, Tag, message, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import {
  CreditCardOutlined,
  WalletOutlined,
  BankOutlined,
  SafetyOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CopyOutlined,
  MoreOutlined,
  SendOutlined,
  SwapOutlined,
  LockOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { MainLayout } from '@/components/MainLayout';
import { TransferModal } from '@/components/TransferModal';
import { ExchangeModal } from '@/components/ExchangeModal';
import { CardManagementModal } from '@/components/CardManagementModal';
import { formatCurrency, getCardsByAccount, getPrimaryCard } from '@/mock/data';
import { useSupabaseFinancialStore as useFinancialStore } from '@/mock/supabaseFinancialStore';
import type { Account, Card } from '@/mock/types';

const Accounts = () => {
  const navigate = useNavigate();
  const accounts = useFinancialStore(state => state.accounts);
  const cards = useFinancialStore(state => state.cards);
  const [showBalances, setShowBalances] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [transferOpen, setTransferOpen] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [cardManageOpen, setCardManageOpen] = useState(false);

  const getAccountIcon = (type: Account['accountType']) => {
    switch (type) {
      case 'current':
        return <WalletOutlined className="text-2xl" />;
      case 'savings':
        return <SafetyOutlined className="text-2xl" />;
      case 'deposit':
        return <BankOutlined className="text-2xl" />;
      case 'credit':
        return <CreditCardOutlined className="text-2xl" />;
      default:
        return <WalletOutlined className="text-2xl" />;
    }
  };

  const getAccountTypeLabel = (type: Account['accountType']) => {
    switch (type) {
      case 'current':
        return 'Текущий';
      case 'savings':
        return 'Накопительный';
      case 'deposit':
        return 'Вклад';
      case 'credit':
        return 'Кредитный';
      default:
        return type;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Скопировано в буфер обмена');
  };

  const getDropdownItems = (record: Account): MenuProps['items'] => [
    {
      key: 'transfer',
      icon: <SendOutlined />,
      label: 'Перевести',
      onClick: () => {
        setSelectedAccount(record);
        setTransferOpen(true);
      },
    },
    {
      key: 'exchange',
      icon: <SwapOutlined />,
      label: 'Обмен валюты',
      onClick: () => setExchangeOpen(true),
    },
    {
      key: 'copy',
      icon: <CopyOutlined />,
      label: 'Копировать номер',
      onClick: () => copyToClipboard(record.accountNumber),
    },
    { type: 'divider' },
    {
      key: 'manage',
      icon: <SettingOutlined />,
      label: 'Управление картами',
      onClick: () => {
        setSelectedAccount(record);
        setCardManageOpen(true);
      },
    },
    {
      key: 'block',
      icon: <LockOutlined />,
      label: record.isActive ? 'Заблокировать' : 'Разблокировать',
      danger: record.isActive,
      onClick: () => {
        setSelectedAccount(record);
        setCardManageOpen(true);
      },
    },
  ];

  const columns = [
    {
      title: 'Счёт',
      key: 'account',
      render: (_: unknown, record: Account) => (
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${record.color}15` }}
          >
            <span style={{ color: record.color }}>{getAccountIcon(record.accountType)}</span>
          </div>
          <div>
            <p className="font-medium text-foreground">{record.name}</p>
            <p className="text-sm text-muted-foreground">
              {(() => {
                const primaryCard = getPrimaryCard(record.id, cards);
                return primaryCard?.cardNumber || `Счёт ••${record.accountNumber.slice(-4)}`;
              })()}
            </p>
          </div>
        </div>
      ),
      onCell: (record: Account) => ({
        onClick: () => navigate(`/accounts/${record.id}`),
      }),
    },
    {
      title: 'Тип',
      key: 'type',
      render: (_: unknown, record: Account) => (
        <Tag color="blue">{getAccountTypeLabel(record.accountType)}</Tag>
      ),
      onCell: (record: Account) => ({
        onClick: () => navigate(`/accounts/${record.id}`),
      }),
    },
    {
      title: 'Валюта',
      dataIndex: 'currency',
      key: 'currency',
      render: (currency: string) => (
        <Tag>{currency}</Tag>
      ),
      onCell: (record: Account) => ({
        onClick: () => navigate(`/accounts/${record.id}`),
      }),
    },
    {
      title: 'Баланс',
      key: 'balance',
      align: 'right' as const,
      render: (_: unknown, record: Account) => (
        <span className="font-bold text-foreground text-lg">
          {showBalances ? formatCurrency(record.balance, record.currency) : '••••••'}
        </span>
      ),
      onCell: (record: Account) => ({
        onClick: () => navigate(`/accounts/${record.id}`),
      }),
    },
    {
      title: 'Статус',
      key: 'status',
      render: (_: unknown, record: Account) => (
        <Tag color={record.isActive ? 'green' : 'red'}>
          {record.isActive ? 'Активен' : 'Заблокирован'}
        </Tag>
      ),
      onCell: (record: Account) => ({
        onClick: () => navigate(`/accounts/${record.id}`),
      }),
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_: unknown, record: Account) => (
        <div className="flex gap-1">
          <Button
            type="primary"
            size="small"
            icon={<SendOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAccount(record);
              setTransferOpen(true);
            }}
          >
            Перевод
          </Button>
          <Dropdown menu={{ items: getDropdownItems(record) }} trigger={['click']}>
            <Button
              type="text"
              icon={<MoreOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        </div>
      ),
    },
  ];

  const totalRub = accounts
    .filter(acc => acc.currency === 'RUB')
    .reduce((sum, acc) => sum + acc.balance, 0);

  const totalUsd = accounts
    .filter(acc => acc.currency === 'USD')
    .reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Мои счета</h1>
            <p className="text-muted-foreground">Управление счетами и картами</p>
          </div>
          <div className="flex gap-2">
            <Button
              icon={showBalances ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => setShowBalances(!showBalances)}
            >
              {showBalances ? 'Скрыть' : 'Показать'}
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="stats-card hover:shadow-xl transition-all duration-300 group" bordered={false}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <WalletOutlined className="text-2xl text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Всего в рублях</p>
                <p className="text-2xl font-bold text-foreground">
                  {showBalances ? formatCurrency(totalRub) : '••••••'}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="stats-card hover:shadow-xl transition-all duration-300 group" bordered={false}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BankOutlined className="text-2xl text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Всего в долларах</p>
                <p className="text-2xl font-bold text-foreground">
                  {showBalances ? formatCurrency(totalUsd, 'USD') : '••••••'}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="stats-card hover:shadow-xl transition-all duration-300 group" bordered={false}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CreditCardOutlined className="text-2xl text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Всего счетов</p>
                <p className="text-2xl font-bold text-foreground">{accounts.length}</p>
              </div>
            </div>
          </Card>

          <Card 
            className="stats-card cursor-pointer hover:border-purple-400/50 hover:shadow-xl transition-all duration-300 group" 
            bordered={false}
            onClick={() => setExchangeOpen(true)}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <SwapOutlined className="text-2xl text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Обмен валюты</p>
                <p className="text-sm font-medium text-purple-600 group-hover:text-purple-700">Курсы ЦБ РФ →</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Accounts Table */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 card-modern" bordered={false}>
          <Table
            columns={columns}
            dataSource={accounts}
            rowKey="id"
            pagination={false}
            className="bank-table"
          />
        </Card>
      </div>

      {/* Modals */}
      <TransferModal 
        open={transferOpen} 
        onClose={() => setTransferOpen(false)} 
        preselectedAccount={selectedAccount || undefined}
      />
      <ExchangeModal open={exchangeOpen} onClose={() => setExchangeOpen(false)} />
      <CardManagementModal 
        open={cardManageOpen} 
        onClose={() => setCardManageOpen(false)} 
        account={selectedAccount}
      />
    </MainLayout>
  );
};

export default Accounts;
