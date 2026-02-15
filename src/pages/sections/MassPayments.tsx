import { Card, Upload, Table, Button, message, Empty } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';

interface PaymentRow {
  key: string;
  index: number;
  recipient: string;
  account: string;
  sum: number;
  purpose: string;
}

const MassPayments = () => {
  const [fileLoaded, setFileLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [payments, setPayments] = useState<PaymentRow[]>([]);

  const handleFileUpload = () => {
    setFileLoaded(true);
    setPayments([
      { key: '1', index: 1, recipient: 'ООО Поставщик 1', account: '40817810500000111111', sum: 50000, purpose: 'Оплата счета 1' },
      { key: '2', index: 2, recipient: 'ООО Поставщик 2', account: '40817810500000222222', sum: 75000, purpose: 'Оплата счета 2' },
      { key: '3', index: 3, recipient: 'ООО Поставщик 3', account: '40817810500000333333', sum: 100000, purpose: 'Оплата счета 3' },
    ]);
    message.success('Файл загружен, показан предпросмотр');
  };

  const handleSendPayments = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    message.success(`Отправлено ${payments.length} платежей`);
    setPayments([]);
    setFileLoaded(false);
    setIsLoading(false);
  };

  const columns: ColumnsType<PaymentRow> = [
    { title: '№', dataIndex: 'index', key: 'index', width: 50 },
    { title: 'Получатель', dataIndex: 'recipient', key: 'recipient' },
    { title: 'Счет', dataIndex: 'account', key: 'account' },
    { title: 'Сумма', dataIndex: 'sum', key: 'sum', render: (sum) => `${sum.toLocaleString('ru-RU')} ₽` },
    { title: 'Назначение', dataIndex: 'purpose', key: 'purpose' },
  ];

  return (
    <div className="space-y-4">
      <Card className="border border-border shadow-sm rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Массовые платежи</h3>
        {!fileLoaded ? (
          <Upload.Dragger
            name="file"
            action="#"
            beforeUpload={() => {
              handleFileUpload();
              return false;
            }}
            onDrop={() => handleFileUpload()}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined className="text-4xl" />
            </p>
            <p className="ant-upload-text">Нажмите или перетащите файл</p>
            <p className="ant-upload-hint">Поддерживаемые форматы: Excel, CSV, XML</p>
          </Upload.Dragger>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Предпросмотр первых строк файла:</p>
            <Table
              columns={columns}
              dataSource={payments}
              pagination={false}
              size="small"
            />
            <div className="flex gap-2">
              <Button danger onClick={() => setFileLoaded(false)}>
                Загрузить другой файл
              </Button>
              <Button type="primary" icon={<UploadOutlined />} onClick={handleSendPayments} loading={isLoading}>
                Отправить платежи
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MassPayments;
