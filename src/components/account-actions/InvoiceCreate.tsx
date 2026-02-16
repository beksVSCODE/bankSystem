import { useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Select, DatePicker, message } from 'antd';
import { FileTextOutlined, SendOutlined } from '@ant-design/icons';

export const InvoiceCreate = ({ accountId }: { accountId: string }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values: Record<string, unknown>) => {
    setLoading(true);
    setTimeout(() => {
      message.success('Счет успешно создан и отправлен');
      setLoading(false);
      form.resetFields();
    }, 1500);
  };

  return (
    <Card title={<><FileTextOutlined /> Создание счета на оплату</>} className="shadow-sm">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Номер счета"
            name="invoiceNumber"
            rules={[{ required: true, message: 'Укажите номер' }]}
          >
            <Input placeholder="№ 123" />
          </Form.Item>

          <Form.Item
            label="Дата выставления"
            name="invoiceDate"
            rules={[{ required: true, message: 'Выберите дату' }]}
          >
            <DatePicker className="w-full" format="DD.MM.YYYY" />
          </Form.Item>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-3">Информация о плательщике</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Наименование организации"
              name="payerName"
              rules={[{ required: true }]}
            >
              <Input placeholder="ООО 'Компания'" />
            </Form.Item>

            <Form.Item
              label="ИНН"
              name="payerInn"
              rules={[{ required: true }]}
            >
              <Input placeholder="1234567890" maxLength={12} />
            </Form.Item>

            <Form.Item label="Email" name="payerEmail">
              <Input type="email" placeholder="company@example.com" />
            </Form.Item>

            <Form.Item label="Телефон" name="payerPhone">
              <Input placeholder="+7 (999) 123-45-67" />
            </Form.Item>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-3">Товары и услуги</h3>
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.length === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                    <Form.Item label="Наименование" required>
                      <Input placeholder="Услуга/товар" />
                    </Form.Item>
                    <Form.Item label="Количество" required>
                      <InputNumber className="w-full" min={1} defaultValue={1} />
                    </Form.Item>
                    <Form.Item label="Цена" required>
                      <InputNumber className="w-full" min={0} precision={2} />
                    </Form.Item>
                    <Form.Item label="Сумма">
                      <InputNumber className="w-full" disabled />
                    </Form.Item>
                  </div>
                )}
                <Button type="dashed" onClick={() => add()} block>
                  + Добавить позицию
                </Button>
              </>
            )}
          </Form.List>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item label="Сумма без НДС" name="subtotal">
            <InputNumber className="w-full" precision={2} addonAfter="₽" />
          </Form.Item>

          <Form.Item label="НДС %" name="vatRate" initialValue={20}>
            <Select>
              <Select.Option value={0}>Без НДС</Select.Option>
              <Select.Option value={10}>10%</Select.Option>
              <Select.Option value={20}>20%</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Итого к оплате" name="total">
            <InputNumber className="w-full" precision={2} addonAfter="₽" />
          </Form.Item>
        </div>

        <Form.Item label="Комментарий" name="comment">
          <Input.TextArea rows={2} placeholder="Дополнительная информация" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} icon={<SendOutlined />} size="large">
            Сформировать и отправить счет
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
