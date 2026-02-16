import { useState } from 'react';
import { Card, Form, DatePicker, Select, Button, Table, Tag, Space, message } from 'antd';
import { DownloadOutlined, FileTextOutlined, FilePdfOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface HistoryRecord {
  id: string;
  date: string;
  period: string;
  format: string;
  size: string;
  status: 'ready' | 'processing';
}

export const StatementDownload = ({ accountId }: { accountId: string }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const historyData: HistoryRecord[] = [
    {
      id: '1',
      date: '2026-02-15 14:30',
      period: '01.01.2026 - 31.01.2026',
      format: 'PDF',
      size: '2.3 MB',
      status: 'ready',
    },
    {
      id: '2',
      date: '2026-02-01 09:15',
      period: '01.12.2025 - 31.12.2025',
      format: 'Excel',
      size: '1.8 MB',
      status: 'ready',
    },
    {
      id: '3',
      date: '2026-01-15 16:45',
      period: '01.11.2025 - 30.11.2025',
      format: 'PDF',
      size: '2.1 MB',
      status: 'ready',
    },
  ];

  const handleDownload = (values: { period: unknown; format: string }) => {
    setLoading(true);
    setTimeout(() => {
      message.success('Выписка сформирована и скачана');
      setLoading(false);
      form.resetFields();
    }, 1500);
  };

  const columns = [
    {
      title: 'Дата запроса',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Период',
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: 'Формат',
      key: 'format',
      render: (_: unknown, record: HistoryRecord) => (
        <Tag color={record.format === 'PDF' ? 'red' : 'green'}>
          {record.format}
        </Tag>
      ),
    },
    {
      title: 'Размер',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Статус',
      key: 'status',
      render: (_: unknown, record: HistoryRecord) => (
        <Tag color={record.status === 'ready' ? 'success' : 'processing'}>
          {record.status === 'ready' ? 'Готов' : 'Обработка'}
        </Tag>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: unknown, record: HistoryRecord) => (
        <Button
          type="link"
          icon={<DownloadOutlined />}
          disabled={record.status !== 'ready'}
          onClick={() => message.info('Скачивание выписки...')}
        >
          Скачать
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Форма скачивания */}
      <Card title="Сформировать выписку" className="shadow-sm">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleDownload}
          initialValues={{
            period: [dayjs().subtract(1, 'month'), dayjs()],
            format: 'pdf',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Период"
              name="period"
              rules={[{ required: true, message: 'Выберите период' }]}
            >
              <RangePicker className="w-full" format="DD.MM.YYYY" />
            </Form.Item>

            <Form.Item
              label="Формат файла"
              name="format"
              rules={[{ required: true, message: 'Выберите формат' }]}
            >
              <Select>
                <Select.Option value="pdf">
                  <Space>
                    <FilePdfOutlined style={{ color: '#ef4444' }} />
                    PDF документ
                  </Space>
                </Select.Option>
                <Select.Option value="excel">
                  <Space>
                    <FileTextOutlined style={{ color: '#10b981' }} />
                    Excel таблица
                  </Space>
                </Select.Option>
                <Select.Option value="csv">
                  <Space>
                    <FileTextOutlined />
                    CSV файл
                  </Space>
                </Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<DownloadOutlined />}
              size="large"
            >
              Сформировать и скачать
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* История выгрузок */}
      <Card title="История выгрузок" className="shadow-sm">
        <Table
          columns={columns}
          dataSource={historyData}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};
