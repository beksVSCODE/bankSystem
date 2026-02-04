import { useState, useMemo } from 'react';
import { Card, Table, Tag, DatePicker, Select, Button, Input, Segmented, message } from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { MainLayout } from '@/components/MainLayout';
import { TransactionDetailModal } from '@/components/TransactionDetailModal';
import { categoryInfo, formatCurrency, formatDate } from '@/mock/data';
import { useFinancialStore } from '@/mock/financialStore';
import type { Transaction, TransactionCategory } from '@/mock/types';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

const { RangePicker } = DatePicker;

const Transactions = () => {
  const transactions = useFinancialStore(state => state.transactions);
  const accounts = useFinancialStore(state => state.accounts);
  
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<TransactionCategory | 'all'>('all');
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // Text search
      if (searchText && !tx.description.toLowerCase().includes(searchText.toLowerCase())) {
        return false;
      }
      // Type filter
      if (typeFilter !== 'all' && tx.type !== typeFilter) {
        return false;
      }
      // Category filter
      if (categoryFilter !== 'all' && tx.category !== categoryFilter) {
        return false;
      }
      // Account filter
      if (accountFilter !== 'all' && tx.accountId !== accountFilter) {
        return false;
      }
      // Date range filter
      if (dateRange && dateRange[0] && dateRange[1]) {
        const txDate = dayjs(tx.date);
        if (txDate.isBefore(dateRange[0], 'day') || txDate.isAfter(dateRange[1], 'day')) {
          return false;
        }
      }
      return true;
    });
  }, [searchText, typeFilter, categoryFilter, accountFilter, dateRange]);

  const totalIncome = filteredTransactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = filteredTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const handleExport = () => {
    message.success('Экспорт операций начат. Файл будет скачан автоматически.');
  };

  const columns = [
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date: string) => (
        <span className="text-muted-foreground">{formatDate(date)}</span>
      ),
      sorter: (a: Transaction, b: Transaction) => 
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    },
    {
      title: 'Описание',
      key: 'description',
      render: (_: unknown, record: Transaction) => {
        const catInfo = categoryInfo[record.category];
        return (
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${catInfo.color}15` }}
            >
              {record.type === 'income' ? (
                <ArrowDownOutlined style={{ color: catInfo.color }} />
              ) : (
                <ArrowUpOutlined style={{ color: catInfo.color }} />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground">{record.description}</p>
              {record.merchant && (
                <p className="text-sm text-muted-foreground">{record.merchant}</p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
      width: 180,
      render: (category: TransactionCategory) => {
        const catInfo = categoryInfo[category];
        return (
          <Tag style={{ backgroundColor: `${catInfo.color}15`, color: catInfo.color, border: 'none' }}>
            {catInfo.nameRu}
          </Tag>
        );
      },
    },
    {
      title: 'Счёт',
      dataIndex: 'accountId',
      key: 'accountId',
      width: 160,
      render: (accountId: string) => {
        const account = accounts.find(acc => acc.id === accountId);
        return account ? (
          <span className="text-muted-foreground">{account.name}</span>
        ) : null;
      },
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: Transaction['status']) => {
        const colors = {
          completed: 'green',
          pending: 'orange',
          failed: 'red',
        };
        const labels = {
          completed: 'Выполнено',
          pending: 'В обработке',
          failed: 'Ошибка',
        };
        return <Tag color={colors[status]}>{labels[status]}</Tag>;
      },
    },
    {
      title: 'Сумма',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      align: 'right' as const,
      render: (amount: number) => (
        <span className={`font-bold text-lg ${amount > 0 ? 'amount-positive' : 'amount-negative'}`}>
          {amount > 0 ? '+' : ''}{formatCurrency(amount)}
        </span>
      ),
      sorter: (a: Transaction, b: Transaction) => a.amount - b.amount,
    },
  ];

  const categoryOptions = [
    { value: 'all', label: 'Все категории' },
    ...Object.entries(categoryInfo).map(([key, info]) => ({
      value: key,
      label: info.nameRu,
    })),
  ];

  const accountOptions = [
    { value: 'all', label: 'Все счета' },
    ...accounts.map(acc => ({
      value: acc.id,
      label: acc.name,
    })),
  ];

  const clearFilters = () => {
    setSearchText('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setAccountFilter('all');
    setDateRange(null);
  };

  const hasFilters = searchText || typeFilter !== 'all' || categoryFilter !== 'all' || accountFilter !== 'all' || dateRange;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">История операций</h1>
            <p className="text-muted-foreground">Просмотр и фильтрация транзакций</p>
          </div>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            Экспорт
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="stats-card" bordered={false}>
            <p className="text-sm text-muted-foreground mb-1">Всего операций</p>
            <p className="text-2xl font-bold text-foreground">{filteredTransactions.length}</p>
          </Card>
          <Card className="stats-card" bordered={false}>
            <div className="flex items-center gap-2">
              <ArrowDownOutlined className="text-success" />
              <span className="text-sm text-muted-foreground">Доходы</span>
            </div>
            <p className="text-2xl font-bold amount-positive">{formatCurrency(totalIncome)}</p>
          </Card>
          <Card className="stats-card" bordered={false}>
            <div className="flex items-center gap-2">
              <ArrowUpOutlined className="text-destructive" />
              <span className="text-sm text-muted-foreground">Расходы</span>
            </div>
            <p className="text-2xl font-bold amount-negative">{formatCurrency(totalExpense)}</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-card" bordered={false}>
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <Input
              placeholder="Поиск по описанию..."
              prefix={<SearchOutlined className="text-muted-foreground" />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="lg:w-64"
              allowClear
            />
            
            <Segmented
              options={[
                { label: 'Все', value: 'all' },
                { label: 'Доходы', value: 'income' },
                { label: 'Расходы', value: 'expense' },
              ]}
              value={typeFilter}
              onChange={value => setTypeFilter(value as typeof typeFilter)}
            />

            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categoryOptions}
              className="lg:w-48"
              popupMatchSelectWidth={false}
            />

            <Select
              value={accountFilter}
              onChange={setAccountFilter}
              options={accountOptions}
              className="lg:w-48"
              popupMatchSelectWidth={false}
            />

            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
              placeholder={['С', 'По']}
              format="DD.MM.YYYY"
            />

            {hasFilters && (
              <Button onClick={clearFilters} icon={<FilterOutlined />}>
                Сбросить
              </Button>
            )}
          </div>

          <Table
            columns={columns}
            dataSource={filteredTransactions}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} из ${total}`,
            }}
            className="bank-table"
            scroll={{ x: 900 }}
            onRow={(record) => ({
              onClick: () => {
                setSelectedTransaction(record);
                setDetailOpen(true);
              },
              className: 'cursor-pointer',
            })}
          />
        </Card>
      </div>

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        transaction={selectedTransaction}
      />
    </MainLayout>
  );
};

export default Transactions;
