import { useState } from 'react';
import { Card, Table, Button, Tag, Upload, Input, Space, Modal } from 'antd';
import { UploadOutlined, FileTextOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
  status: 'active' | 'archived';
}

export const DocumentsList = ({ accountId }: { accountId: string }) => {
  const [searchText, setSearchText] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const documents: Document[] = [
    {
      id: '1',
      name: 'Договор банковского обслуживания',
      type: 'Договор',
      date: '15.03.2022',
      size: '1.2 MB',
      status: 'active',
    },
    {
      id: '2',
      name: 'Справка о состоянии счета',
      type: 'Справка',
      date: '01.02.2026',
      size: '245 KB',
      status: 'active',
    },
    {
      id: '3',
      name: 'Выписка за январь 2026',
      type: 'Выписка',
      date: '31.01.2026',
      size: '2.8 MB',
      status: 'active',
    },
    {
      id: '4',
      name: 'Тарифный план',
      type: 'Тариф',
      date: '15.03.2022',
      size: '567 KB',
      status: 'active',
    },
    {
      id: '5',
      name: 'Уведомление о смене реквизитов',
      type: 'Уведомление',
      date: '10.12.2025',
      size: '189 KB',
      status: 'archived',
    },
  ];

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload: () => false,
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        // message.success(`${info.file.name} file uploaded successfully.`);
      }
    },
  };

  const columns = [
    {
      title: 'Документ',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, _record: Document) => (
        <Space>
          <FileTextOutlined className="text-blue-500" />
          <span className="font-medium">{text}</span>
        </Space>
      ),
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag>{type}</Tag>,
    },
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Размер',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Статус',
      key: 'status',
      render: (_: unknown, record: Document) => (
        <Tag color={record.status === 'active' ? 'success' : 'default'}>
          {record.status === 'active' ? 'Актуальный' : 'Архивный'}
        </Tag>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: unknown, record: Document) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedDoc(record);
              setPreviewOpen(true);
            }}
          >
            Просмотр
          </Button>
          <Button
            type="link"
            size="small"
            icon={<DownloadOutlined />}
          >
            Скачать
          </Button>
        </Space>
      ),
    },
  ];

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchText.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Загрузка документа */}
      <Card title="Загрузить документ" className="shadow-sm">
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />} size="large">
            Выбрать файл для загрузки
          </Button>
        </Upload>
        <p className="text-sm text-gray-500 mt-2">
          Поддерживаемые форматы: PDF, DOC, DOCX, JPG, PNG. Максимальный размер: 10 MB
        </p>
      </Card>

      {/* Список документов */}
      <Card
        title="Документы по счету"
        className="shadow-sm"
        extra={
          <Input.Search
            placeholder="Поиск документов..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        }
      >
        <Table
          columns={columns}
          dataSource={filteredDocuments}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Модальное окно предпросмотра */}
      <Modal
        title={selectedDoc?.name}
        open={previewOpen}
        onCancel={() => setPreviewOpen(false)}
        footer={[
          <Button key="download" type="primary" icon={<DownloadOutlined />}>
            Скачать
          </Button>,
          <Button key="close" onClick={() => setPreviewOpen(false)}>
            Закрыть
          </Button>,
        ]}
        width={800}
      >
        <div className="bg-gray-100 h-96 flex items-center justify-center">
          <p className="text-gray-500">Предпросмотр документа</p>
        </div>
      </Modal>
    </div>
  );
};
