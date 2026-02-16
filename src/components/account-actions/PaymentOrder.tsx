import { useState } from 'react';
import { Card, Form, Input, Select, InputNumber, Button, DatePicker, message, Space } from 'antd';
import { SendOutlined, BankOutlined } from '@ant-design/icons';

export const PaymentOrder = ({ accountId }: { accountId: string }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values: Record<string, unknown>) => {
    setLoading(true);
    setTimeout(() => {
      message.success('Платежное поручение отправлено на исполнение');
      setLoading(false);
      form.resetFields();
    }, 1500);
  };

  return (
    <Card title="Платежное поручение" className="shadow-sm">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          payerAccount: accountId,
          paymentPurpose: '',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Плательщик */}
          <Form.Item
            label="Счет списания"
            name="payerAccount"
            rules={[{ required: true }]}
          >
            <Select disabled>
              <Select.Option value={accountId}>Текущий счет</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Сумма платежа"
            name="amount"
            rules={[{ required: true, message: 'Укажите сумму' }]}
          >
            <InputNumber
              className="w-full"
              min={0.01}
              precision={2}
              placeholder="0.00"
              addonAfter="RUB"
            />
          </Form.Item>
        </div>

        {/* Получатель */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <BankOutlined />
            Данные получателя
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Наименование получателя"
              name="recipientName"
              rules={[{ required: true, message: 'Укажите получателя' }]}
            >
              <Input placeholder="ООО 'Компания'" />
            </Form.Item>

            <Form.Item
              label="ИНН получателя"
              name="recipientInn"
              rules={[
                { required: true, message: 'Укажите ИНН' },
                { pattern: /^\d{10}$|^\d{12}$/, message: 'ИНН должен быть 10 или 12 цифр' },
              ]}
            >
              <Input placeholder="1234567890" maxLength={12} />
            </Form.Item>

            <Form.Item
              label="Расчетный счет"
              name="recipientAccount"
              rules={[
                { required: true, message: 'Укажите счет' },
                { pattern: /^\d{20}$/, message: 'Счет должен содержать 20 цифр' },
              ]}
            >
              <Input placeholder="40702810100000000000" maxLength={20} />
            </Form.Item>

            <Form.Item
              label="БИК банка получателя"
              name="recipientBik"
              rules={[
                { required: true, message: 'Укажите БИК' },
                { pattern: /^\d{9}$/, message: 'БИК должен содержать 9 цифр' },
              ]}
            >
              <Input placeholder="044525225" maxLength={9} />
            </Form.Item>

            <Form.Item
              label="Наименование банка"
              name="recipientBankName"
              rules={[{ required: true, message: 'Укажите банк' }]}
            >
              <Input placeholder="ПАО СБЕРБАНК" />
            </Form.Item>

            <Form.Item
              label="Корр. счет банка"
              name="recipientCorrAccount"
            >
              <Input placeholder="30101810400000000225" maxLength={20} />
            </Form.Item>
          </div>
        </div>

        {/* Назначение платежа */}
        <Form.Item
          label="Назначение платежа"
          name="paymentPurpose"
          rules={[{ required: true, message: 'Укажите назначение платежа' }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Оплата по договору №... от ... НДС не облагается"
            maxLength={210}
            showCount
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Очередность платежа"
            name="priority"
            initialValue="5"
          >
            <Select>
              <Select.Option value="1">1 - Исполнительные документы</Select.Option>
              <Select.Option value="2">2 - Выплаты по ТК РФ</Select.Option>
              <Select.Option value="3">3 - Налоги и страховые взносы</Select.Option>
              <Select.Option value="4">4 - Исполнительные документы</Select.Option>
              <Select.Option value="5">5 - Прочие платежи</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Дата исполнения"
            name="executionDate"
          >
            <DatePicker className="w-full" format="DD.MM.YYYY" />
          </Form.Item>
        </div>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SendOutlined />}
              size="large"
            >
              Отправить на исполнение
            </Button>
            <Button onClick={() => form.resetFields()}>
              Очистить форму
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};
