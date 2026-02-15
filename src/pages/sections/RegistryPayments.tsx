import { Card, Table, Button, Collapse, Empty } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { mockRegistries } from '@/mock/paymentsAndReports';
import type { ColumnsType } from 'antd/es/table';
import type { Registry } from '@/mock/types';

const RegistryPerecisления = () => {
  const registryPayments: Record<string, any[]> = {
    'reg-001': [
      { id: 1, recipient: 'Сотрудник 1', account: '40817810500000001', sum: 50000, purpose: 'Зарплата' },
      { id: 2, recipient: 'Сотрудник 2', account: '40817810500000002', sum: 55000, purpose: 'Зарплата' },
      { id: 3, recipient: 'Сотрудник 3', account: '40817810500000003', sum: 60000, purpose: 'Зарплата' },
    ],
    'reg-002': [
      { id: 1, recipient: 'ФНС', account: '40101810400000010001', sum: 200000, purpose: 'Налог на прибыль' },
      { id: 2, recipient: 'ПФР', account: '40101810400000010002', sum: 150000, purpose: 'Взносы ПФР' },
      { id: 3, recipient: 'ФСС', account: '40101810400000010003', sum: 100000, purpose: 'Взносы ФСС' },
    ],
  };

  const paymentColumns: ColumnsType<any> = [
    { title: '№', dataIndex: 'id', key: 'id', width: 50 },
    { title: 'Получатель', dataIndex: 'recipient', key: 'recipient' },
    { title: 'Счет', dataIndex: 'account', key: 'account' },
    { title: 'Сумма', dataIndex: 'sum', key: 'sum', render: (sum) => `${sum.toLocaleString('ru-RU')} ₽` },
    { title: 'Назначение', dataIndex: 'purpose', key: 'purpose' },
  ];

  const columns: ColumnsType<Registry> = [
    { title: 'Дата', dataIndex: 'date', key: 'date', render: (date) => new Date(date).toLocaleDateString('ru-RU') },
    { title: 'Реестр', dataIndex: 'name', key: 'name' },
    { title: 'Платежей', dataIndex: 'paymentsCount', key: 'paymentsCount' },
    { title: 'Сумма', dataIndex: 'totalSum', key: 'totalSum', render: (sum) => `${sum.toLocaleString('ru-RU')} ₽` },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Button type="text" size="small" icon={<DownloadOutlined />} onClick={() => {}} />
      ),
    },
  ];

  return (
    <Card className="border border-border shadow-sm rounded-lg">
      <h3 className="text-lg font-semibold text-foreground mb-4">Реестровые перечисления</h3>
      {mockRegistries.length === 0 ? (
        <Empty description="Реестров нет" />
      ) : (
        <Collapse
          items={mockRegistries.map((registry) => ({
            key: registry.id,
            label: (
              <div className="flex justify-between items-center">
                <span>{registry.name}</span>
                <span className="text-sm text-muted-foreground">{registry.paymentsCount} платежей • {registry.totalSum.toLocaleString('ru-RU')} ₽</span>
              </div>
            ),
            children: (
              <Table
                columns={paymentColumns}
                dataSource={registryPayments[registry.id] || []}
                pagination={false}
                size="small"
              />
            ),
          }))}
        />
      )}
    </Card>
  );
};

export default RegistryPerecisления;
