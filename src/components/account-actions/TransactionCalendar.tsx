import { Card, Table, Tag, DatePicker, Button, Space } from 'antd';
import { CalendarOutlined, FilterOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

interface Transaction {
  id: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export const TransactionCalendar = ({ accountId }: { accountId: string }) => {
  const transactions: Transaction[] = [
    {
      id: '1',
      date: '2026-02-15 14:30',
      description: 'Поступление от ООО "Рога и Копыта"',
      type: 'income',
      amount: 450000,
      category: 'Оплата услуг',
      status: 'completed',
    },
    {
      id: '2',
      date: '2026-02-15 11:20',
      description: 'Перевод на счет 40702...',
      type: 'expense',
      amount: 125000,
      category: 'Перевод',
      status: 'completed',
    },
    {
      id: '3',
      date: '2026-02-14 16:45',
      description: 'Оплата поставщику',
      type: 'expense',
      amount: 78000,
      category: 'Закупка',
      status: 'completed',
    },
    {
      id: '4',
      date: '2026-02-14 09:15',
      description: 'Возврат НДС',
      type: 'income',
      amount: 125000,
      category: 'Налоги',
      status: 'completed',
    },
    {
      id: '5',
      date: '2026-02-13 13:00',
      description: 'Платеж в обработке',
      type: 'expense',
      amount: 89000,
      category: 'Платежи',
      status: 'pending',
    },
  ];

  const columns = [
    {
      title: 'Дата и время',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => (
        <Space>
          <CalendarOutlined />
          <span>{date}</span>
        </Space>
      ),
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
      render: (cat: string) => <Tag>{cat}</Tag>,
    },
    {
      title: 'Сумма',
      key: 'amount',
      render: (_: unknown, record: Transaction) => (
        <span className={record.type === 'income' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
          {record.type === 'income' ? '+' : '-'}
          {record.amount.toLocaleString('ru-RU')} ₽
        </span>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          completed: 'success',
          pending: 'processing',
          cancelled: 'error',
        };
        const labels = {
          completed: 'Выполнен',
          pending: 'В обработке',
          cancelled: 'Отменен',
        };
        return <Tag color={colors[status as keyof typeof colors]}>{labels[status as keyof typeof labels]}</Tag>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Фильтры */}
      <Card className="shadow-sm">
        <Space wrap>
          <RangePicker format="DD.MM.YYYY" />
          <Button icon={<FilterOutlined />}>Фильтры</Button>
          <Button>Экспорт</Button>
        </Space>
      </Card>

      {/* Календарь транзакций */}
      <Card title="Календарь транзакций" className="shadow-sm">
        <Table
          columns={columns}
          dataSource={transactions}
          rowKey="id"
          pagination={{ pageSize: 20 }}
        />
      </Card>
    </div>
  );
};
