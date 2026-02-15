import { Card, Table, Tag, Button, Empty, Tooltip, Space } from 'antd';
import { DownloadOutlined, CheckOutlined, LockOutlined } from '@ant-design/icons';
import { mockScheduledPayments, formatCurrency, getStatusColor, getStatusLabel } from '@/mock/paymentsAndReports';
import type { ColumnsType } from 'antd/es/table';
import type { ScheduledPayment } from '@/mock/types';

const PaymentsByCalendar = () => {
  const columns: ColumnsType<ScheduledPayment> = [
    {
      title: 'Дата платежа',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString('ru-RU'),
    },
    {
      title: 'Назначение',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Получатель',
      dataIndex: 'recipient',
      key: 'recipient',
    },
    {
      title: 'Сумма',
      dataIndex: 'sum',
      key: 'sum',
      render: (sum, record) => formatCurrency(sum, record.currency),
    },
    {
      title: 'Частота',
      dataIndex: 'frequency',
      key: 'frequency',
      render: (freq) => {
        const labels: Record<string, string> = {
          once: 'Один раз',
          daily: 'Ежедневно',
          weekly: 'Еженедельно',
          monthly: 'Ежемесячно',
          yearly: 'Ежегодно',
        };
        return labels[freq] || freq;
      },
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>,
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'pending' && (
            <Tooltip title="Подтвердить">
              <Button type="text" size="small" icon={<CheckOutlined />} />
            </Tooltip>
          )}
          <Tooltip title="Отложить">
            <Button type="text" size="small" icon={<LockOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card className="border border-border shadow-sm rounded-lg">
      <h3 className="text-lg font-semibold text-foreground mb-4">Платежи по календарю</h3>
      {mockScheduledPayments.length === 0 ? (
        <Empty description="Нет запланированных платежей" />
      ) : (
        <Table
          columns={columns}
          dataSource={mockScheduledPayments}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </Card>
  );
};

export default PaymentsByCalendar;
