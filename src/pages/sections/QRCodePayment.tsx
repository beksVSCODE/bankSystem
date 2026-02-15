import { Card, Form, Input, Button, message, Alert } from 'antd';
import { QrcodeOutlined, UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';

const QRCodePayment = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [qrData, setQrData] = useState<any>(null);

  const handleUploadQR = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Имитация распознавания QR
    setQrData({
      recipient: 'ООО Компания',
      account: '40817810500000123456',
      sum: 5000,
      purpose: 'Оплата за товары',
    });
    
    setIsLoading(false);
  };

  const handlePayment = async (values: any) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    message.success('Платеж отправлен');
    setIsLoading(false);
    setQrData(null);
    form.resetFields();
  };

  return (
    <Card className="border border-border shadow-sm rounded-lg">
      <h3 className="text-lg font-semibold text-foreground mb-4">Платеж по QR коду</h3>
      
      {!qrData ? (
        <div className="space-y-4">
          <Alert
            message="Загрузите QR код или отсканируйте его"
            type="info"
            showIcon
          />
          <Button
            type="primary"
            icon={<QrcodeOutlined />}
            size="large"
            block
            onClick={handleUploadQR}
            loading={isLoading}
          >
            Загрузить QR код
          </Button>
        </div>
      ) : (
        <Form form={form} layout="vertical" onFinish={handlePayment}>
          <Alert
            message="QR код распознан"
            type="success"
            className="mb-4"
            showIcon
          />
          <Form.Item label="Получатель" initialValue={qrData.recipient}>
            <Input disabled />
          </Form.Item>
          <Form.Item label="Счет получателя" initialValue={qrData.account}>
            <Input disabled />
          </Form.Item>
          <Form.Item label="Сумма" initialValue={qrData.sum} name="sum">
            <Input />
          </Form.Item>
          <Form.Item label="Назначение" initialValue={qrData.purpose} name="purpose">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            Подтвердить платеж
          </Button>
          <Button onClick={() => setQrData(null)} className="mt-2" block>
            Загрузить другой QR
          </Button>
        </Form>
      )}
    </Card>
  );
};

export default QRCodePayment;
