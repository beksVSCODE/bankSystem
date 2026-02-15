import { Card, List, Button, Form, Input, InputNumber, Select, message, Empty, Tag, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';

const Credits = () => {
  const [credits, setCredits] = useState([
    { id: '1', type: 'credit', name: 'Кредит на развитие', sum: 1000000, rate: 12, status: 'active' },
    { id: '2', type: 'guarantee', name: 'Гарантия подрядчика', sum: 500000, rate: 2, status: 'pending' },
  ]);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateCredit = async (values: { type: string; name: string; sum: number; rate: number }) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    setCredits([
      {
        id: String(credits.length + 1),
        status: 'pending',
        ...values,
      },
      ...credits,
    ]);
    
    message.success('Заявка создана');
    setIsLoading(false);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    setCredits(credits.filter((c) => c.id !== id));
    message.success('Удалено');
  };

  return (
    <div className="space-y-4">
      <Card className="border border-border shadow-sm rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Новая заявка</h3>
        <Form form={form} layout="vertical" onFinish={handleCreateCredit}>
          <Form.Item label="Тип продукта" name="type" rules={[{ required: true }]}>
            <Select
              options={[
                { label: 'Кредит', value: 'credit' },
                { label: 'Гарантия', value: 'guarantee' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Название" name="name" rules={[{ required: true }]}>
            <Input placeholder="Описание кредита" />
          </Form.Item>
          <Form.Item label="Сумма" name="sum" rules={[{ required: true }]}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Ставка %" name="rate" rules={[{ required: true }]}>
            <InputNumber min={0} max={100} precision={2} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} icon={<PlusOutlined />} block>
            Подать заявку
          </Button>
        </Form>
      </Card>

      <Card className="border border-border shadow-sm rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Заявки</h3>
        {credits.length === 0 ? (
          <Empty description="Заявок нет" />
        ) : (
          <List
            dataSource={credits}
            renderItem={(credit) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Space>
                      {credit.name}
                      <Tag color={credit.status === 'active' ? 'green' : 'orange'}>
                        {credit.status === 'active' ? 'Активно' : 'На рассмотрении'}
                      </Tag>
                    </Space>
                  }
                  description={`${credit.sum.toLocaleString('ru-RU')} ₽ • Ставка: ${credit.rate}%`}
                />
                <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(credit.id)} />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default Credits;
