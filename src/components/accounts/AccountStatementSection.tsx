import { useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Input,
  InputNumber,
  List,
  Radio,
  Select,
  Space,
  Table,
  Tag,
  message,
} from 'antd';
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import type {
  AccountRecord,
  AccountTransaction,
  ExportFormat,
  StatementExportHistoryItem,
} from '@/mock/accountsFeature';
import { formatDate, formatMoney } from '@/mock/accountsFeature';

interface AccountStatementSectionProps {
  account: AccountRecord;
  transactions: AccountTransaction[];
  exportHistory: StatementExportHistoryItem[];
  onExport: (format: ExportFormat) => void;
}

const periodOptions = [
  { label: '7 дней', value: 7 },
  { label: '30 дней', value: 30 },
  { label: '90 дней', value: 90 },
];

export const AccountStatementSection = ({
  account,
  transactions,
  exportHistory,
  onExport,
}: AccountStatementSectionProps) => {
  const [periodDays, setPeriodDays] = useState(30);
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [query, setQuery] = useState('');
  const [minAmount, setMinAmount] = useState<number | null>(null);
  const [maxAmount, setMaxAmount] = useState<number | null>(null);
  const [stateMode, setStateMode] = useState<'loading' | 'ready' | 'empty' | 'error'>('ready');

  const filtered = useMemo(() => {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - periodDays);
    return transactions
      .filter((tx) => new Date(tx.date) >= fromDate)
      .filter((tx) => (typeFilter === 'all' ? true : tx.type === typeFilter))
      .filter((tx) => (minAmount == null ? true : Math.abs(tx.amount) >= minAmount))
      .filter((tx) => (maxAmount == null ? true : Math.abs(tx.amount) <= maxAmount))
      .filter((tx) => {
        const q = query.toLowerCase();
        return (
          tx.description.toLowerCase().includes(q) ||
          (tx.counterparty || '').toLowerCase().includes(q) ||
          (tx.tag || '').toLowerCase().includes(q)
        );
      });
  }, [transactions, periodDays, typeFilter, minAmount, maxAmount, query]);

  const exportStatement = (format: ExportFormat) => {
    onExport(format);
    message.success(`${format.toUpperCase()} сформирован`);
  };

  const columns = [
    { title: 'Дата', dataIndex: 'date', key: 'date', render: (value: string) => formatDate(value, true) },
    { title: 'Описание', dataIndex: 'description', key: 'description' },
    { title: 'Контрагент', dataIndex: 'counterparty', key: 'counterparty', render: (value?: string) => value || '—' },
    { title: 'Тег', dataIndex: 'tag', key: 'tag', render: (value?: string) => (value ? <Tag>{value}</Tag> : '—') },
    {
      title: 'Сумма',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      render: (value: number) => (
        <span className={value < 0 ? 'text-red-500' : 'text-emerald-600'}>
          {formatMoney(value, account.currency)}
        </span>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-card" bordered={false}>
        <div className="flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
          <Space wrap>
            <Radio.Group
              options={periodOptions}
              value={periodDays}
              onChange={(e) => setPeriodDays(e.target.value)}
              optionType="button"
            />
            <Select
              style={{ width: 180 }}
              value={typeFilter}
              onChange={(value) => setTypeFilter(value)}
              options={[
                { label: 'Все типы', value: 'all' },
                { label: 'Приход', value: 'income' },
                { label: 'Расход', value: 'expense' },
              ]}
            />
            <InputNumber placeholder="Сумма от" value={minAmount} onChange={setMinAmount} />
            <InputNumber placeholder="Сумма до" value={maxAmount} onChange={setMaxAmount} />
            <Input.Search
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по операции"
              style={{ width: 260 }}
            />
          </Space>
          <Space wrap>
            <Button icon={<ReloadOutlined />} onClick={() => setStateMode((prev) => (prev === 'loading' ? 'ready' : 'loading'))}>
              Loading
            </Button>
            <Button onClick={() => setStateMode('empty')}>Empty</Button>
            <Button danger onClick={() => setStateMode('error')}>Error</Button>
            <Button type="primary" icon={<DownloadOutlined />} onClick={() => exportStatement('pdf')}>Скачать PDF</Button>
            <Button onClick={() => exportStatement('csv')}>Выгрузить CSV</Button>
            <Button onClick={() => exportStatement('xlsx')}>Выгрузить XLSX</Button>
          </Space>
        </div>
      </Card>

      {stateMode === 'loading' && <Alert type="info" message="Загрузка выписки..." showIcon />}
      {stateMode === 'error' && <Alert type="error" message="Не удалось загрузить выписку, повторите позже." showIcon />}
      {stateMode === 'empty' && <Alert type="warning" message="Нет операций по выбранным фильтрам." showIcon />}

      {stateMode === 'ready' && (
        <Card className="border-0 shadow-card" bordered={false}>
          <Table columns={columns} dataSource={filtered} rowKey="id" pagination={{ pageSize: 8 }} />
        </Card>
      )}

      <Card title="История выгрузок" className="border-0 shadow-card" bordered={false}>
        <List
          dataSource={exportHistory.slice(0, 5)}
          locale={{ emptyText: 'Выгрузок пока нет' }}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={`${item.format.toUpperCase()} • ${formatDate(item.createdAt, true)}`}
                description={`Счет: ${account.name}`}
              />
              <Tag color={item.status === 'done' ? 'green' : item.status === 'processing' ? 'orange' : 'red'}>{item.status}</Tag>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};
