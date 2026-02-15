import { Card, Form, Input, InputNumber, Button, Select, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';

const CardReplenishment = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleReplenish = async (values: any) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    message.success('Счет пополнен');
    setIsLoading(false);
    form.resetFields();
  };

  return (
    <Card className="border border-border shadow-sm rounded-lg">
      <h3 className="text-lg font-semibold text-foreground mb-4">Пополнить расчетный счет</h3>
      <Form form={form} layout="vertical" onFinish={handleReplenish}>
        <Form.Item label="Исходящая карта" name="cardId" rules={[{ required: true }]}>
          <Select
            placeholder="Выберите карту"
            options={[
              { label: 'МастерКард **** 1234', value: 'card-1' },
              { label: 'Виза **** 5678', value: 'card-2' },
            ]}
          />
        </Form.Item>
        <Form.Item label="Счет получателя" name="toAccount" rules={[{ required: true }]}>
          <Select
            placeholder="Выберите счет"
            options={[
              { label: 'Основной счёт (245,890 ₽)', value: 'acc-1' },
              { label: 'Накопительный счёт (500,000 ₽)', value: 'acc-2' },
            ]}
          />
        </Form.Item>
        <Form.Item label="Сумма" name="amount" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading} icon={<UploadOutlined />} block>
          Пополнить
        </Button>
      </Form>
    </Card>
  );
};

export default CardReplenishment;
