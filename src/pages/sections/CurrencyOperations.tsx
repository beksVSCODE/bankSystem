import { Card, Table, Button, Form, Input, Select, message, Upload, Empty } from 'antd';
import { UploadOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';

interface Document {
  id: string;
  name: string;
  date: string;
  status: 'completed' | 'processing' | 'failed';
}

const CurrencyOperations = () => {
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', name: 'Документ валютного контроля #001', date: '2025-02-14', status: 'completed' },
  ]);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (values: { docName: string }) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const newDoc: Document = {
      id: String(documents.length + 1),
      name: values.docName,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
    };
    
    setDocuments([newDoc, ...documents]);
    message.success('Документ загружен');
    setIsLoading(false);
    form.resetFields();
  };

  const columns: ColumnsType<Document> = [
    { title: 'Название', dataIndex: 'name', key: 'name' },
    { title: 'Дата', dataIndex: 'date', key: 'date' },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors: Record<string, string> = { completed: 'green', processing: 'orange', failed: 'red' };
        return <span style={{ color: colors[status] }}>●</span>;
      },
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="text" size="small" icon={<DownloadOutlined />} />
          <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => setDocuments(documents.filter((d) => d.id !== record.id))} />
        </>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card className="border border-border shadow-sm rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Загрузить документ</h3>
        <Form form={form} layout="vertical" onFinish={handleUpload}>
          <Form.Item label="Название документа" name="docName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Тип документа" name="docType" rules={[{ required: true }]}>
            <Select
              options={[
                { label: 'Документ валютного контроля', value: 'forex' },
                { label: 'Конверсионная операция', value: 'conversion' },
              ]}
            />
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
        <h3 className="text-lg font-semibold text-foreground mb-4">Мои документы</h3>
        {documents.length === 0 ? (
          <Empty description="Документов нет" />
        ) : (
          <Table columns={columns} dataSource={documents} rowKey="id" pagination={{ pageSize: 10 }} />
        )}
      </Card>
    </div>
  );
};

export default CurrencyOperations;
