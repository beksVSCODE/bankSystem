import { Card, Table, Form, Input, Button, Upload, message, Empty, Tag, Select } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';

interface UploadRecord {
  id: string;
  name: string;
  date: string;
  type: string;
  status: 'completed' | 'processing';
}

const Uploads = () => {
  const [uploads, setUploads] = useState<UploadRecord[]>([
    { id: '1', name: 'Документы из 1С', date: '2025-02-14', type: 'from_1c', status: 'completed' },
    { id: '2', name: 'Контрагенты', date: '2025-02-13', type: 'counterparties', status: 'completed' },
  ]);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (values: { type: string }) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    const typeLabels: Record<string, string> = {
      from_1c: 'Документы из 1С',
      counterparties: 'Контрагенты',
    };
    
    const newUpload: UploadRecord = {
      id: String(uploads.length + 1),
      name: typeLabels[values.type],
      date: new Date().toISOString().split('T')[0],
      type: values.type,
      status: 'completed',
    };
    
    setUploads([newUpload, ...uploads]);
    message.success('Файл загружен');
    setIsLoading(false);
    form.resetFields();
  };

  const columns: ColumnsType<UploadRecord> = [
    { title: 'Название', dataIndex: 'name', key: 'name' },
    { title: 'Дата', dataIndex: 'date', key: 'date' },
    { title: 'Тип', dataIndex: 'type', key: 'type', render: (type) => {
      const labels: Record<string, string> = { from_1c: '1С', counterparties: 'Контрагенты' };
      return labels[type] || type;
    }},
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'completed' ? 'green' : 'orange'}>{status === 'completed' ? 'Завершено' : 'Обработка'}</Tag>,
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => setUploads(uploads.filter((u) => u.id !== record.id))} />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card className="border border-border shadow-sm rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Загрузить файл</h3>
        <Form form={form} layout="vertical" onFinish={handleUpload}>
          <Form.Item label="Тип файла" name="type" rules={[{ required: true }]}>
            <Select options={[
              { label: 'Документы из 1С', value: 'from_1c' },
              { label: 'Контрагенты', value: 'counterparties' },
            ]} placeholder="Выберите тип" />
          </Form.Item>
          <Form.Item label="Файл" name="file">
            <Upload.Dragger beforeUpload={() => false}>
              <UploadOutlined className="text-2xl" />
              <p>Загрузите файл</p>
            </Upload.Dragger>
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            Загрузить
          </Button>
        </Form>
      </Card>

      <Card className="border border-border shadow-sm rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">История загрузок</h3>
        {uploads.length === 0 ? (
          <Empty description="История пуста" />
        ) : (
          <Table columns={columns} dataSource={uploads} rowKey="id" pagination={{ pageSize: 10 }} />
        )}
      </Card>
    </div>
  );
};

export default Uploads;
