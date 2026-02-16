import { useState } from 'react';
import { Card, Table, Button, Tag, Space, DatePicker, Select, Input } from 'antd';
import { LineChartOutlined, BarChartOutlined, PieChartOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

export const CashFlowReport = ({ accountId }: { accountId: string }) => {
  const [dateRange, setDateRange] = useState<[unknown, unknown] | null>(null);
  const [category, setCategory] = useState<string>('all');

  const reportData = [
    {
      id: '1',
      date: '01.02.2026',
      income: 450000,
      expense: 125000,
      balance: 325000,
      operations: 12,
    },
    {
      id: '2',
      date: '02.02.2026',
      income: 0,
      expense: 45000,
      balance: 280000,
      operations: 3,
    },
    {
      id: '3',
      date: '03.02.2026',
      income: 125000,
      expense: 78000,
      balance: 327000,
      operations: 8,
    },
    {
      id: '4',
      date: '04.02.2026',
      income: 89000,
      expense: 156000,
      balance: 260000,
      operations: 15,
    },
    {
      id: '5',
      date: '05.02.2026',
      income: 234000,
      expense: 67000,
      balance: 427000,
      operations: 6,
    },
  ];

  const columns = [
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Поступления',
      dataIndex: 'income',
      key: 'income',
      render: (val: number) => (
        <span className="text-green-600 font-semibold">
          +{val.toLocaleString('ru-RU')} ₽
        </span>
      ),
    },
    {
      title: 'Списания',
      dataIndex: 'expense',
      key: 'expense',
      render: (val: number) => (
        <span className="text-red-600 font-semibold">
          -{val.toLocaleString('ru-RU')} ₽
        </span>
      ),
    },
    {
      title: 'Остаток',
      dataIndex: 'balance',
      key: 'balance',
      render: (val: number) => (
        <span className="font-bold">
          {val.toLocaleString('ru-RU')} ₽
        </span>
      ),
    },
    {
      title: 'Операций',
      dataIndex: 'operations',
      key: 'operations',
      render: (val: number) => <Tag>{val}</Tag>,
    },
  ];

  const totalIncome = reportData.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = reportData.reduce((sum, item) => sum + item.expense, 0);

  return (
    <div className="space-y-6">
      {/* Фильтры */}
      <Card className="shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Период</label>
            <RangePicker
              className="w-full"
              format="DD.MM.YYYY"
              onChange={setDateRange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Категория</label>
            <Select
              className="w-full"
              value={category}
              onChange={setCategory}
            >
              <Select.Option value="all">Все категории</Select.Option>
              <Select.Option value="income">Только поступления</Select.Option>
              <Select.Option value="expense">Только расходы</Select.Option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Действия</label>
            <Space>
              <Button icon={<LineChartOutlined />}>График</Button>
              <Button icon={<BarChartOutlined />}>Диаграмма</Button>
            </Space>
          </div>
        </div>
      </Card>

      {/* Сводка */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <div className="text-center">
            <PieChartOutlined className="text-4xl text-blue-500 mb-2" />
            <p className="text-gray-500 text-sm">Всего поступлений</p>
            <p className="text-2xl font-bold text-green-600">
              +{totalIncome.toLocaleString('ru-RU')} ₽
            </p>
          </div>
        </Card>
        <Card className="shadow-sm">
          <div className="text-center">
            <BarChartOutlined className="text-4xl text-red-500 mb-2" />
            <p className="text-gray-500 text-sm">Всего списаний</p>
            <p className="text-2xl font-bold text-red-600">
              -{totalExpense.toLocaleString('ru-RU')} ₽
            </p>
          </div>
        </Card>
        <Card className="shadow-sm">
          <div className="text-center">
            <LineChartOutlined className="text-4xl text-purple-500 mb-2" />
            <p className="text-gray-500 text-sm">Разница</p>
            <p className={`text-2xl font-bold ${totalIncome - totalExpense > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalIncome - totalExpense > 0 ? '+' : ''}
              {(totalIncome - totalExpense).toLocaleString('ru-RU')} ₽
            </p>
          </div>
        </Card>
      </div>

      {/* Таблица */}
      <Card title="График движения средств" className="shadow-sm">
        <Table
          columns={columns}
          dataSource={reportData}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};
