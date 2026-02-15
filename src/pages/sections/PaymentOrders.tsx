import { useState, useMemo } from 'react';
import { Card, Table, Button, Tag, Modal, Form, Input, InputNumber, Select, message, Empty, Space, Tooltip } from 'antd';
import { DownloadOutlined, DeleteOutlined, EditOutlined, PlusOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { mockPaymentOrders, formatCurrency, getStatusColor, getStatusLabel } from '@/mock/paymentsAndReports';
import type { PaymentOrder } from '@/mock/types';
import type { ColumnsType } from 'antd/es/table';

const PaymentOrders = () => {
  const [orders, setOrders] = useState<PaymentOrder[]>(mockPaymentOrders);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [editingOrder, setEditingOrder] = useState<PaymentOrder | null>(null);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchQuery = (searchValue || '').toLowerCase();
      const matchesSearch = !searchQuery ||
        order.number.toLowerCase().includes(searchQuery) ||
        order.recipient.toLowerCase().includes(searchQuery) ||
        order.purpose.toLowerCase().includes(searchQuery);
      const matchesStatus = !filterStatus || order.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchValue, filterStatus]);

  const columns: ColumnsType<PaymentOrder> = [
    {
      title: 'Номер',
      dataIndex: 'number',
      key: 'number',
      width: 120,
      sorter: (a, b) => a.number.localeCompare(b.number),
    },
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
      width: 100,
      render: (text) => new Date(text).toLocaleDateString('ru-RU'),
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Сумма',
      dataIndex: 'sum',
      key: 'sum',
      width: 120,
      render: (sum, record) => formatCurrency(sum, record.currency),
      sorter: (a, b) => a.sum - b.sum,
    },
    {
      title: 'Получатель',
      dataIndex: 'recipient',
      key: 'recipient',
      render: (text) => <div className="max-w-xs truncate">{text}</div>,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Редактировать">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingOrder(record);
                form.setFieldsValue(record);
                setIsModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Скачать PDF">
            <Button
              type="text"
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => message.success('PDF скачан')}
            />
          </Tooltip>
          {record.status === 'draft' && (
            <Tooltip title="Удалить">
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => {
                  setOrders(orders.filter((o) => o.id !== record.id));
                  message.success('Поручение удалено');
                }}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const handleCreateOrder = () => {
    setEditingOrder(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSaveOrder = async (values: { [key: string]: unknown }) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (editingOrder) {
      setOrders(
        orders.map((o) =>
          o.id === editingOrder.id ? { ...o, ...values, updatedAt: new Date().toISOString() } : o
        )
      );
      message.success('Поручение обновлено');
    } else {
      const newOrder: PaymentOrder = {
        id: `po-${Date.now()}`,
        number: `12345/${orders.length + 1}`,
        date: new Date().toISOString().split('T')[0],
        status: 'draft',
        createdAt: new Date().toISOString(),
        executedAt: null,
        ...values,
      };
      setOrders([newOrder, ...orders]);
      message.success('Поручение создано');
    }

    setIsLoading(false);
    setIsModalVisible(false);
  };

  return (
    <div className="space-y-4">
      <Card className="border border-border shadow-sm rounded-lg">
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-foreground">Фильтры</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Поиск по номеру, получателю или назначению..."
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1"
              allowClear
            />
            <Select
              placeholder="Все статусы"
              value={filterStatus}
              onChange={setFilterStatus}
              className="w-full sm:w-64"
              allowClear
              options={[
                { label: 'Черновик', value: 'draft' },
                { label: 'Отправлен', value: 'sent' },
                { label: 'Исполнен', value: 'executed' },
                { label: 'Отклонен', value: 'rejected' },
              ]}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateOrder}>
              Создать
            </Button>
          </div>
        </div>
      </Card>

      {filteredOrders.length === 0 ? (
        <Empty description="Платежные поручения не найдены" />
      ) : (
        <Card className="border border-border shadow-sm rounded-lg overflow-hidden">
          <Table
            columns={columns}
            dataSource={filteredOrders}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Всего: ${total}`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>
      )}

      <Modal
        title={editingOrder ? 'Редактировать поручение' : 'Создать платежное поручение'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={isLoading}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveOrder}>
          <Form.Item
            label="Получатель"
            name="recipient"
            rules={[{ required: true, message: 'Укажите получателя' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Счет получателя"
            name="recipientAccount"
            rules={[{ required: true, message: 'Укажите счет' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Сумма"
            name="sum"
            rules={[{ required: true, message: 'Укажите сумму' }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            label="Валюта"
            name="currency"
            rules={[{ required: true }]}
            initialValue="RUB"
          >
            <Select options={[{ label: 'RUB', value: 'RUB' }]} />
          </Form.Item>
          <Form.Item label="Назначение платежа" name="purpose" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Срок платежа" name="dueDate">
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentOrders;
