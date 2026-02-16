import { useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Select, message, Space } from 'antd';
import { SwapOutlined, CreditCardOutlined } from '@ant-design/icons';

export const CardToCardTransfer = ({ accountId }: { accountId: string }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values: { amount: number; [key: string]: unknown }) => {
    setLoading(true);
    setTimeout(() => {
      message.success(`Перевод ${values.amount} RUB успешно выполнен`);
      setLoading(false);
      form.resetFields();
    }, 1500);
  };

  return (
    <Card title="Перевод с карты на карту" className="shadow-sm">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Номер карты отправителя"
          name="fromCard"
          rules={[{ required: true, message: 'Выберите карту' }]}
        >
          <Select placeholder="Выберите карту списания">
            <Select.Option value="card1">
              <Space>
                <CreditCardOutlined />
                <span>•••• 4532 | 125,450.00 RUB</span>
              </Space>
            </Select.Option>
            <Select.Option value="card2">
              <Space>
                <CreditCardOutlined />
                <span>•••• 8901 | 34,500.00 RUB</span>
              </Space>
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Номер карты получателя"
          name="toCard"
          rules={[
            { required: true, message: 'Укажите номер карты' },
            { pattern: /^\d{16}$/, message: 'Номер карты должен содержать 16 цифр' },
          ]}
        >
          <Input
            placeholder="0000 0000 0000 0000"
            maxLength={16}
            prefix={<CreditCardOutlined />}
          />
        </Form.Item>

        <Form.Item
          label="Сумма перевода"
          name="amount"
          rules={[{ required: true, message: 'Укажите сумму' }]}
        >
          <InputNumber
            className="w-full"
            min={1}
            max={150000}
            precision={2}
            placeholder="0.00"
            addonAfter="RUB"
          />
        </Form.Item>

        <Form.Item
          label="Комментарий (необязательно)"
          name="comment"
        >
          <Input.TextArea rows={2} placeholder="Например: За обед" maxLength={100} />
        </Form.Item>

        <div className="bg-blue-50 p-3 rounded mb-4">
          <p className="text-sm text-gray-700">
            <strong>Комиссия:</strong> 0% при переводе в пределах одного банка
          </p>
          <p className="text-sm text-gray-700">
            <strong>Лимит:</strong> до 150 000 RUB в сутки
          </p>
        </div>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SwapOutlined />}
              size="large"
            >
              Перевести
            </Button>
            <Button onClick={() => form.resetFields()}>
              Отменить
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};
