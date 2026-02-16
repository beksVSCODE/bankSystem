import { useState } from 'react';
import { Card, Form, Input, Switch, Select, Button, message, Divider, InputNumber } from 'antd';
import { SaveOutlined, LockOutlined, BellOutlined } from '@ant-design/icons';

export const AccountSettings = ({ accountId }: { accountId: string }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = (values: Record<string, unknown>) => {
    setLoading(true);
    setTimeout(() => {
      message.success('Настройки успешно сохранены');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{
          accountName: 'Основной счёт',
          dailyLimit: 500000,
          monthlyLimit: 10000000,
          smsNotifications: true,
          emailNotifications: true,
          pushNotifications: false,
          twoFactorAuth: true,
        }}
      >
        {/* Общие настройки */}
        <Card title="Общие настройки" className="shadow-sm">
          <Form.Item
            label="Название счета"
            name="accountName"
            rules={[{ required: true, message: 'Укажите название' }]}
          >
            <Input placeholder="Мой основной счет" />
          </Form.Item>

          <Form.Item
            label="Описание счета"
            name="accountDescription"
          >
            <Input.TextArea rows={2} placeholder="Для ежедневных операций" />
          </Form.Item>
        </Card>

        {/* Лимиты и ограничения */}
        <Card title="Лимиты и ограничения" className="shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Дневной лимит операций"
              name="dailyLimit"
            >
              <InputNumber
                className="w-full"
                min={0}
                precision={2}
                addonAfter="RUB"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
              />
            </Form.Item>

            <Form.Item
              label="Месячный лимит операций"
              name="monthlyLimit"
            >
              <InputNumber
                className="w-full"
                min={0}
                precision={2}
                addonAfter="RUB"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Ограничение на снятие наличных"
            name="cashWithdrawalLimit"
          >
            <Select>
              <Select.Option value="100000">100 000 RUB в день</Select.Option>
              <Select.Option value="300000">300 000 RUB в день</Select.Option>
              <Select.Option value="500000">500 000 RUB в день</Select.Option>
              <Select.Option value="unlimited">Без ограничений</Select.Option>
            </Select>
          </Form.Item>
        </Card>

        {/* Безопасность */}
        <Card title={<><LockOutlined /> Безопасность</>} className="shadow-sm">
          <Form.Item
            label="Двухфакторная аутентификация"
            name="twoFactorAuth"
            valuePropName="checked"
          >
            <Switch checkedChildren="Включено" unCheckedChildren="Выключено" />
          </Form.Item>

          <Form.Item
            label="Требовать подтверждение для операций свыше"
            name="confirmationThreshold"
          >
            <Select>
              <Select.Option value="10000">10 000 RUB</Select.Option>
              <Select.Option value="50000">50 000 RUB</Select.Option>
              <Select.Option value="100000">100 000 RUB</Select.Option>
              <Select.Option value="500000">500 000 RUB</Select.Option>
            </Select>
          </Form.Item>

          <Divider />

          <div className="bg-yellow-50 p-4 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Рекомендация:</strong> Включите двухфакторную аутентификацию для повышения безопасности операций
            </p>
          </div>
        </Card>

        {/* Уведомления */}
        <Card title={<><BellOutlined /> Уведомления</>} className="shadow-sm">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">SMS-уведомления</p>
                <p className="text-sm text-gray-500">Получать SMS о всех операциях</p>
              </div>
              <Form.Item name="smsNotifications" valuePropName="checked" className="m-0">
                <Switch />
              </Form.Item>
            </div>

            <Divider className="my-3" />

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Email-уведомления</p>
                <p className="text-sm text-gray-500">Получать отчеты на почту</p>
              </div>
              <Form.Item name="emailNotifications" valuePropName="checked" className="m-0">
                <Switch />
              </Form.Item>
            </div>

            <Divider className="my-3" />

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Push-уведомления</p>
                <p className="text-sm text-gray-500">Уведомления в мобильном приложении</p>
              </div>
              <Form.Item name="pushNotifications" valuePropName="checked" className="m-0">
                <Switch />
              </Form.Item>
            </div>
          </div>
        </Card>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
            size="large"
          >
            Сохранить настройки
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
