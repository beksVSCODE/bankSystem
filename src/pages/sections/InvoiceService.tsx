import { Card, Form, Input, InputNumber, Button, Select, Table, message, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';

interface Invoice {
  id: string;
  number: string;
  date: string;
  counterparty: string;
  sum: number;
  status: 'draft' | 'sent' | 'paid';
}

const InvoiceService = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: '1', number: 'СЧ-001', date: '2025-02-14', counterparty: 'ООО Компания', sum: 150000, status: 'sent' },
  ]);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateInvoice = async (values: any) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const newInvoice: Invoice = {
      id: `${invoices.length + 1}`,
      number: `СЧ-${String(invoices.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: 'draft',
      ...values,
    };
    
    setInvoices([newInvoice, ...invoices]);
    message.success('Счет создан');
    setIsLoading(false);
    form.resetFields();
  };

  const columns: ColumnsType<Invoice> = [
    { title: 'Номер', dataIndex: 'number', key: 'number' },
    { title: 'Дата', dataIndex: 'date', key: 'date' },
    { title: 'Контрагент', dataIndex: 'counterparty', key: 'counterparty' },
    { title: 'Сумма', dataIndex: 'sum', key: 'sum', render: (sum) => `${sum.toLocaleString('ru-RU')} ₽` },
  ];

  return (
    <div className="space-y-4">
      <Card className="border border-border shadow-sm rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Выставить счет</h3>
        <Form form={form} layout="vertical" onFinish={handleCreateInvoice}>
          <Form.Item label="Контрагент" name="counterparty" rules={[{ required: true }]}>
            <Input placeholder="Название компании" />
          </Form.Item>
          <Form.Item label="Сумма" name="sum" rules={[{ required: true }]}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Назначение" name="purpose" rules={[{ required: true }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="Срок оплаты" name="dueDate" rules={[{ required: true }]}>
            <Input type="date" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} icon={<PlusOutlined />} block>
            Выставить счет
          </Button>
        </Form>
      </Card>

      <Card className="border border-border shadow-sm rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Мои счета</h3>
        {invoices.length === 0 ? (
          <Empty description="Счетов нет" />
        ) : (
          <Table columns={columns} dataSource={invoices} rowKey="id" pagination={{ pageSize: 10 }} />
        )}
      </Card>
    </div>
  );
};

export default InvoiceService;
