import { Card, Button, Table, Tag, Modal, Form, Input, Select, message } from 'antd';
import {
  CreditCardOutlined,
  WalletOutlined,
  BankOutlined,
  SafetyOutlined,
  PlusOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CopyOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { MainLayout } from '@/components/MainLayout';
import { mockAccounts, formatCurrency } from '@/mock/data';
import { useState } from 'react';
import type { Account } from '@/mock/types';

const Accounts = () => {
  const [showBalances, setShowBalances] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAccountIcon = (type: Account['type']) => {
    switch (type) {
      case 'card':
        return <CreditCardOutlined className="text-2xl" />;
      case 'savings':
        return <SafetyOutlined className="text-2xl" />;
      case 'deposit':
        return <BankOutlined className="text-2xl" />;
      default:
        return <WalletOutlined className="text-2xl" />;
    }
  };

  const getAccountTypeLabel = (type: Account['type']) => {
    switch (type) {
      case 'card':
        return 'Карта';
      case 'savings':
        return 'Накопительный';
      case 'deposit':
        return 'Вклад';
      case 'checking':
        return 'Текущий';
      default:
        return type;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Скопировано в буфер обмена');
  };

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
            <span style={{ color: record.color }}>{getAccountIcon(record.type)}</span>
          </div>
          <div>
            <p className="font-medium text-foreground">{record.name}</p>
            <p className="text-sm text-muted-foreground">
              {record.cardNumber || record.accountNumber.slice(-8)}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Тип',
      key: 'type',
      render: (_: unknown, record: Account) => (
        <Tag color="blue">{getAccountTypeLabel(record.type)}</Tag>
      ),
    },
    {
      title: 'Валюта',
      dataIndex: 'currency',
      key: 'currency',
      render: (currency: string) => (
        <Tag>{currency}</Tag>
      ),
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
    },
    {
      title: 'Статус',
      key: 'status',
      render: (_: unknown, record: Account) => (
        <Tag color={record.isActive ? 'green' : 'red'}>
          {record.isActive ? 'Активен' : 'Заблокирован'}
        </Tag>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 50,
      render: (_: unknown, record: Account) => (
        <Button
          type="text"
          icon={<MoreOutlined />}
          onClick={() => {
            setSelectedAccount(record);
            setIsModalOpen(true);
          }}
        />
      ),
    },
  ];

  const totalRub = mockAccounts
    .filter(acc => acc.currency === 'RUB')
    .reduce((sum, acc) => sum + acc.balance, 0);

  const totalUsd = mockAccounts
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
            <Button type="primary" icon={<PlusOutlined />}>
              Открыть счёт
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="stats-card" bordered={false}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <WalletOutlined className="text-2xl text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Всего в рублях</p>
                <p className="text-2xl font-bold text-foreground">
                  {showBalances ? formatCurrency(totalRub) : '••••••'}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="stats-card" bordered={false}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <BankOutlined className="text-2xl text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Всего в долларах</p>
                <p className="text-2xl font-bold text-foreground">
                  {showBalances ? formatCurrency(totalUsd, 'USD') : '••••••'}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="stats-card" bordered={false}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <CreditCardOutlined className="text-2xl text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Всего счетов</p>
                <p className="text-2xl font-bold text-foreground">{mockAccounts.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Accounts Table */}
        <Card className="border-0 shadow-card" bordered={false}>
          <Table
            columns={columns}
            dataSource={mockAccounts}
            rowKey="id"
            pagination={false}
            className="bank-table"
            onRow={(record) => ({
              onClick: () => {
                setSelectedAccount(record);
                setIsModalOpen(true);
              },
              className: 'cursor-pointer',
            })}
          />
        </Card>

        {/* Account Details Modal */}
        <Modal
          title="Детали счёта"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalOpen(false)}>
              Закрыть
            </Button>,
            <Button key="transfer" type="primary">
              Перевести
            </Button>,
          ]}
          width={500}
        >
          {selectedAccount && (
            <div className="space-y-4 py-4">
              <div
                className="p-6 rounded-xl text-white"
                style={{ background: `linear-gradient(135deg, ${selectedAccount.color} 0%, ${selectedAccount.color}CC 100%)` }}
              >
                <p className="text-white/70 text-sm mb-1">{selectedAccount.name}</p>
                <p className="text-3xl font-bold mb-4">
                  {formatCurrency(selectedAccount.balance, selectedAccount.currency)}
                </p>
                {selectedAccount.cardNumber && (
                  <p className="text-lg tracking-wider">{selectedAccount.cardNumber}</p>
                )}
                {selectedAccount.expiryDate && (
                  <p className="text-sm text-white/70 mt-2">Действует до: {selectedAccount.expiryDate}</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Номер счёта</p>
                    <p className="font-mono text-sm">{selectedAccount.accountNumber}</p>
                  </div>
                  <Button
                    type="text"
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(selectedAccount.accountNumber)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Тип счёта</p>
                    <p className="text-sm">{getAccountTypeLabel(selectedAccount.type)}</p>
                  </div>
                  <Tag color={selectedAccount.isActive ? 'green' : 'red'}>
                    {selectedAccount.isActive ? 'Активен' : 'Заблокирован'}
                  </Tag>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
};

export default Accounts;
