import { Card, List, Button, Form, Input, InputNumber, Select, message, Empty, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

const Deposits = () => {
  const [deposits, setDeposits] = useState([
    { id: '1', name: 'Депозит на 12 месяцев', sum: 500000, rate: 8.5, currency: 'RUB' },
  ]);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateDeposit = async (values: { name: string; sum: number; rate: number; currency: string }) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    setDeposits([
      {
        id: String(deposits.length + 1),
        ...values,
      },
      ...deposits,
    ]);
    
    message.success('Депозит открыт');
    setIsLoading(false);
    form.resetFields();
  };

  return (
    <div className="space-y-4">
      <Card className="border border-border shadow-sm rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Открыть депозит</h3>
        <Form form={form} layout="vertical" onFinish={handleCreateDeposit}>
          <Form.Item label="Название депозита" name="name" rules={[{ required: true }]}>
            <Input placeholder="Например: Депозит на год" />
          </Form.Item>
          <Form.Item label="Сумма" name="sum" rules={[{ required: true }]}>
            <InputNumber min={1000} />
          </Form.Item>
          <Form.Item label="Процентная ставка" name="rate" rules={[{ required: true }]}>
            <InputNumber min={0} max={100} precision={2} />
          </Form.Item>
          <Form.Item label="Валюта" name="currency" initialValue="RUB">
            <Select options={[{ label: 'RUB', value: 'RUB' }]} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} icon={<PlusOutlined />} block>
            Открыть депозит
          </Button>
        </Form>
      </Card>

      <Card className="border border-border shadow-sm rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Активные депозиты</h3>
        {deposits.length === 0 ? (
          <Empty description="Депозитов нет" />
        ) : (
          <List
            dataSource={deposits}
            renderItem={(deposit) => (
              <List.Item>
                <List.Item.Meta
                  title={deposit.name}
                  description={`${deposit.sum.toLocaleString('ru-RU')} ${deposit.currency} • Ставка: ${deposit.rate}% годовых`}
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default Deposits;
