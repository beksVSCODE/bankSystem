import { Card, Table, Button, Input, Tag, Space, Tooltip, Empty } from 'antd';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  status: string;
}

const AccountStatement = () => {
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchValue, setSearchValue] = useState('');
  const [transactions] = useState<Transaction[]>([
    { id: '1', date: '2025-02-14', description: 'Платеж клиенту', amount: 150000, type: 'expense', status: 'completed' },
    { id: '2', date: '2025-02-13', description: 'Поступление от подрядчика', amount: 200000, type: 'income', status: 'completed' },
    { id: '3', date: '2025-02-12', description: 'Оплата счета', amount: 75000, type: 'expense', status: 'completed' },
  ]);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch = tx.description.toLowerCase().includes(searchValue.toLowerCase());
      const matchesStatus = !filterStatus || tx.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchValue, filterStatus]);

  const columns: ColumnsType<Transaction> = [
    { title: 'Дата', dataIndex: 'date', key: 'date', render: (date) => new Date(date).toLocaleDateString('ru-RU') },
    { title: 'Описание', dataIndex: 'description', key: 'description' },
    { title: 'Сумма', dataIndex: 'amount', key: 'amount', render: (amount, record) => (
      <span style={{ color: record.type === 'income' ? 'green' : 'red' }}>
        {record.type === 'income' ? '+' : '-'}{amount.toLocaleString('ru-RU')} ₽
      </span>
    )},
    { title: 'Статус', dataIndex: 'status', key: 'status', render: (status) => <Tag color="green">Завершено</Tag> },
  ];

  return (
    <div className="space-y-4">
      <Card className="border border-border shadow-sm rounded-lg">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Поиск..."
            className="flex-1"
            value={searchValue}
          />
          <Tooltip title="Скачать">
            <Button icon={<DownloadOutlined />}>Скачать PDF</Button>
          </Tooltip>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Empty description="Транзакций не найдено" />
      ) : (
        <Card className="border border-border shadow-sm rounded-lg overflow-hidden">
          <Table columns={columns} dataSource={filtered} rowKey="id" pagination={{ pageSize: 15 }} />
        </Card>
      )}
    </div>
  );
};

export default AccountStatement;
