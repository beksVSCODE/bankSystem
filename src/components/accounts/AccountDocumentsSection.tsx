import { useMemo, useState } from 'react';
import { Button, Card, Input, List, Select, Space, Table, Tag, Upload, message } from 'antd';
import { DownloadOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import { formatDate, type AccountDocumentRecord, type AccountRecord } from '@/mock/accountsFeature';

interface AccountDocumentsSectionProps {
  account: AccountRecord;
  documents: AccountDocumentRecord[];
  onUpload: (doc: AccountDocumentRecord) => void;
}

type DocFilter = 'all' | AccountDocumentRecord['type'];

const docTypeLabels: Record<AccountDocumentRecord['type'], string> = {
  agreement: 'Договоры',
  signed: 'Подписанные',
  certificate: 'Справки',
  archive: 'Архив',
  statement: 'Выписки',
  bank_letter: 'Письма от банка',
  uploaded: 'Загруженные пользователем',
  incoming: 'Архив входящих документов',
  outgoing: 'Архив исходящих документов',
  requisites_change: 'История изменений реквизитов',
  kyc: 'KYC / анкета клиента',
  tax: 'Налоговые документы',
};

export const AccountDocumentsSection = ({ account, documents, onUpload }: AccountDocumentsSectionProps) => {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<DocFilter>('all');
  const [stateMode, setStateMode] = useState<'loading' | 'ready' | 'empty' | 'error'>('ready');

  const rows = useMemo(
    () => documents
      .filter((item) => (typeFilter === 'all' ? true : item.type === typeFilter))
      .filter((item) => item.title.toLowerCase().includes(query.toLowerCase())),
    [documents, query, typeFilter],
  );

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-card" bordered={false}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <Space wrap>
            <Input.Search
              placeholder="Поиск документа"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: 280 }}
            />
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: 260 }}
              options={[
                { label: 'Все категории', value: 'all' },
                ...Object.entries(docTypeLabels).map(([value, label]) => ({ label, value })),
              ]}
            />
            <Button onClick={() => setStateMode((prev) => (prev === 'loading' ? 'ready' : 'loading'))}>Loading</Button>
            <Button onClick={() => setStateMode('empty')}>Empty</Button>
            <Button danger onClick={() => setStateMode('error')}>Error</Button>
          </Space>
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              onUpload({
                id: `doc-${Date.now()}`,
                accountId: account.id,
                title: file.name,
                type: 'uploaded',
                status: 'ready',
                createdAt: new Date().toISOString(),
              });
              message.success('Документ загружен');
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Загрузить документ</Button>
          </Upload>
        </div>
      </Card>

      <Card title="Категории документов" className="border-0 shadow-card" bordered={false}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {Object.entries(docTypeLabels).map(([key, label]) => {
            const count = documents.filter((item) => item.type === key).length;
            return (
              <Button key={key} type={typeFilter === key ? 'primary' : 'default'} onClick={() => setTypeFilter(key as DocFilter)}>
                {label} ({count})
              </Button>
            );
          })}
        </div>
      </Card>

      <Card title="Документы по счету" className="border-0 shadow-card" bordered={false}>
        {stateMode === 'loading' && <Tag color="blue">Загрузка документов...</Tag>}
        {stateMode === 'error' && <Tag color="red">Ошибка загрузки документов</Tag>}
        {stateMode === 'empty' && <Tag color="orange">Документы не найдены</Tag>}
        {stateMode === 'ready' && (
          <Table
            rowKey="id"
            dataSource={rows}
            locale={{ emptyText: 'Документы не найдены' }}
            columns={[
              { title: 'Название', dataIndex: 'title' },
              { title: 'Тип', dataIndex: 'type', render: (value: AccountDocumentRecord['type']) => docTypeLabels[value] || value },
              { title: 'Дата', dataIndex: 'createdAt', render: (value: string) => formatDate(value, true) },
              { title: 'Статус', dataIndex: 'status', render: (value: string) => <Tag color={value === 'ready' || value === 'signed' ? 'green' : 'orange'}>{value}</Tag> },
              {
                title: 'Действия',
                render: (_: unknown, row: AccountDocumentRecord) => (
                  <Space>
                    <Button size="small" icon={<EyeOutlined />} onClick={() => message.info(`Просмотр: ${row.title}`)}>Посмотреть</Button>
                    <Button size="small" icon={<DownloadOutlined />} onClick={() => message.success(`Скачивание: ${row.title}`)}>Скачать</Button>
                  </Space>
                ),
              },
            ]}
          />
        )}
      </Card>

      <Card title="Последние документы" className="border-0 shadow-card" bordered={false}>
        <List
          dataSource={rows.slice(0, 5)}
          locale={{ emptyText: 'Нет записей' }}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={item.title} description={`${docTypeLabels[item.type]} • ${formatDate(item.createdAt, true)}`} />
              <Tag>{item.status}</Tag>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};
