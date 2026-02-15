import { useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Select, message, Modal, Alert } from 'antd';
import { SendOutlined } from '@ant-design/icons';

const Transfers = ({ selectedId }: { selectedId: string }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [transferData, setTransferData] = useState<any>(null);

  const handleTransfer = async (values: any) => {
    setTransferData(values);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    message.success('Перевод отправлен');
    setIsLoading(false);
    setShowConfirm(false);
    form.resetFields();
  };

  const getTitle = () => {
    switch (selectedId) {
      case 'card_to_card':
        return 'Перевод с карты на карту';
      case 'sberbank_transfer':
        return 'Перевод клиенту СберБанка';
      default:
        return 'Переводы между счетами';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border border-border shadow-sm rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">{getTitle()}</h3>
        <Form form={form} layout="vertical" onFinish={handleTransfer}>
          <Form.Item label="От кого" name="fromAccount" rules={[{ required: true }]}>
            <Select
              placeholder="Выберите исходящий счет"
              options={[
                { label: 'Основной счёт (245,890 ₽)', value: 'acc-1' },
                { label: 'Накопительный счёт (500,000 ₽)', value: 'acc-2' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Кому" name="toAccount" rules={[{ required: true }]}>
            <Input placeholder="Номер счета получателя" />
          </Form.Item>
          <Form.Item label="Сумма" name="amount" rules={[{ required: true, message: 'Укажите сумму' }]}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Комментарий" name="comment">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} icon={<SendOutlined />} block>
            Отправить
          </Button>
        </Form>
      </Card>

      <Modal
        title="Подтверждение перевода"
        open={showConfirm}
        onOk={handleConfirm}
        onCancel={() => setShowConfirm(false)}
        confirmLoading={isLoading}
      >
        <Alert
          message="Проверьте данные перед отправкой"
          type="info"
          className="mb-4"
        />
        {transferData && (
          <div className="space-y-2">
            <p><strong>Со счета:</strong> {transferData.fromAccount}</p>
            <p><strong>На счет:</strong> {transferData.toAccount}</p>
            <p><strong>Сумма:</strong> {transferData.amount.toLocaleString('ru-RU')} ₽</p>
            {transferData.comment && <p><strong>Комментарий:</strong> {transferData.comment}</p>}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Transfers;
