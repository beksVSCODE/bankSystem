import { useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  DatePicker,
  List,
  Progress,
  Select,
  Space,
  Table,
  Tag,
  message,
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import {
  accountReportsMenu,
  formatDate,
  mockConsultantTickets,
  mockGeneratedReportFiles,
  mockStatementRequests,
  type AccountRecord,
  type AccountTransaction,
} from '@/mock/accountsFeature';

interface AccountReportsSectionProps {
  account: AccountRecord;
  transactions: AccountTransaction[];
  activeItem: string;
  onActiveItemChange: (value: string) => void;
}

const movementWidget = (
  <Card title="График движения средств" className="border-0 shadow-card" bordered={false}>
    <div className="h-44 rounded-xl bg-gradient-to-r from-emerald-100 to-cyan-100 flex items-end gap-2 p-4">
      {[24, 55, 31, 74, 38, 62, 49].map((h, i) => (
        <div key={i} className="flex-1 rounded-md bg-emerald-500/60" style={{ height: `${h}%` }} />
      ))}
    </div>
  </Card>
);

export const AccountReportsSection = ({ account, transactions, activeItem, onActiveItemChange }: AccountReportsSectionProps) => {
  const [stateMode, setStateMode] = useState<'loading' | 'ready' | 'empty' | 'error'>('ready');
  const rows = useMemo(
    () =>
      transactions.map((item) => ({
        ...item,
        amountLabel: item.amount.toLocaleString('ru-RU'),
        dateLabel: formatDate(item.date),
      })),
    [transactions],
  );

  const commonTop = (
    <Card className="border-0 shadow-card" bordered={false}>
      <Space wrap>
        <DatePicker.RangePicker />
        <Button type="primary" onClick={() => message.success('Отчет сформирован')}>Сформировать</Button>
        <Button icon={<DownloadOutlined />} onClick={() => message.success('Экспорт mock готов')}>Экспорт</Button>
        <Button onClick={() => setStateMode((prev) => (prev === 'loading' ? 'ready' : 'loading'))}>Loading</Button>
        <Button onClick={() => setStateMode('empty')}>Empty</Button>
        <Button danger onClick={() => setStateMode('error')}>Error</Button>
      </Space>
    </Card>
  );

  const content = () => {
    if (stateMode === 'loading') {
      return <Alert type="info" showIcon message="Загрузка отчетов..." />;
    }
    if (stateMode === 'error') {
      return <Alert type="error" showIcon message="Ошибка загрузки отчета." />;
    }
    if (stateMode === 'empty') {
      return <Alert type="warning" showIcon message="Нет данных за выбранный период." />;
    }

    switch (activeItem) {
      case 'r_statement':
        return (
          <Table
            rowKey="id"
            dataSource={rows}
            columns={[
              { title: 'Дата', dataIndex: 'dateLabel' },
              { title: 'Описание', dataIndex: 'description' },
              { title: 'Сумма', dataIndex: 'amountLabel' },
            ]}
          />
        );
      case 'r_movement':
        return movementWidget;
      case 'r_debtors':
        return (
          <Table
            rowKey="name"
            dataSource={[
              { name: 'ООО Ритм', amount: '450 000', due: '19.02.2026', status: 'Просрочка' },
              { name: 'ИП Лебедев', amount: '210 000', due: '22.02.2026', status: 'В срок' },
            ]}
            columns={[
              { title: 'Контрагент', dataIndex: 'name' },
              { title: 'Сумма', dataIndex: 'amount' },
              { title: 'Срок', dataIndex: 'due' },
              { title: 'Статус', dataIndex: 'status' },
            ]}
          />
        );
      case 'r_history':
        return (
          <Table
            rowKey="id"
            dataSource={mockStatementRequests.filter((item) => item.accountId === account.id)}
            columns={[
              { title: 'Период', dataIndex: 'period' },
              { title: 'Создан', dataIndex: 'createdAt', render: (v: string) => formatDate(v, true) },
              { title: 'Статус', dataIndex: 'status' },
            ]}
          />
        );
      case 'r_calendar':
        return <List dataSource={rows} renderItem={(item) => <List.Item>{item.dateLabel} — {item.description} ({item.amountLabel})</List.Item>} />;
      case 'r_timeline':
        return <List dataSource={rows.slice(0, 8)} renderItem={(item) => <List.Item><Tag color={item.amount < 0 ? 'red' : 'green'}>{item.dateLabel}</Tag> {item.description}</List.Item>} />;
      case 'r_business':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-card" bordered={false}><div className="text-sm text-muted-foreground">Доход</div><div className="text-2xl font-semibold text-emerald-600">4 980 000</div></Card>
            <Card className="border-0 shadow-card" bordered={false}><div className="text-sm text-muted-foreground">Расход</div><div className="text-2xl font-semibold text-red-500">3 720 000</div></Card>
            <Card className="border-0 shadow-card" bordered={false}><div className="text-sm text-muted-foreground">Чистая прибыль</div><div className="text-2xl font-semibold">1 260 000</div></Card>
          </div>
        );
      case 'r_spending':
        return <List dataSource={[{ c: 'Зарплата', p: 44 }, { c: 'Логистика', p: 24 }, { c: 'Поставщики', p: 18 }, { c: 'Комиссии', p: 14 }]} renderItem={(item) => <List.Item>{item.c} <Progress percent={item.p} className="w-64" /></List.Item>} />;
      case 'r_tags':
        return <Table rowKey="tag" dataSource={[{ tag: 'операционка', amount: '820 000' }, { tag: 'налоги', amount: '240 000' }, { tag: 'премии', amount: '390 000' }]} columns={[{ title: 'Тег', dataIndex: 'tag' }, { title: 'Сумма', dataIndex: 'amount' }]} />;
      case 'r_structure':
        return <Table rowKey="segment" dataSource={[{ segment: 'Расчетный RUB', share: '68%' }, { segment: 'Текущий RUB', share: '29%' }, { segment: 'USD вклад', share: '3%' }]} columns={[{ title: 'Сегмент', dataIndex: 'segment' }, { title: 'Доля', dataIndex: 'share' }]} />;
      case 'd_checks':
        return <Table rowKey="id" dataSource={[{ id: 'cc-1', name: 'ООО Север', date: '12.02.2026', result: 'Низкий риск' }, { id: 'cc-2', name: 'ИП Романов', date: '11.02.2026', result: 'Средний риск' }]} columns={[{ title: 'Контрагент', dataIndex: 'name' }, { title: 'Дата', dataIndex: 'date' }, { title: 'Результат', dataIndex: 'result' }]} />;
      case 'd_tariffs':
        return <Card title="Мои тарифы" className="border-0 shadow-card" bordered={false}><p>Тариф: {account.tariff}</p><p>Комиссии: {account.commission}</p></Card>;
      case 'd_requisites':
        return (
          <Card title="Реквизиты счета" className="border-0 shadow-card" bordered={false}>
            <p>Счет: {account.accountNumber}</p>
            <p>ИНН: {account.inn || '—'}</p>
            <p>КПП: {account.kpp || '—'}</p>
            <Button onClick={async () => {
              await navigator.clipboard.writeText(account.accountNumber);
              message.success('Реквизиты скопированы');
            }}>
              Скопировать
            </Button>
          </Card>
        );
      case 'd_agreement':
        return <Card title="Условия договора счета" className="border-0 shadow-card" bordered={false}><p>Документ только для чтения (mock).</p><Button icon={<DownloadOutlined />}>Скачать</Button></Card>;
      case 'd_archive':
        return (
          <List
            dataSource={['Архив заявлений 2024', 'Архив заявлений 2025', 'Заявления на сервисы']}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        );
      case 'c_requests':
        return <Table rowKey="id" dataSource={mockConsultantTickets.filter((item) => item.accountId === account.id)} columns={[{ title: 'Тема', dataIndex: 'topic' }, { title: 'Статус', dataIndex: 'status' }, { title: 'Дата', dataIndex: 'createdAt', render: (v: string) => formatDate(v, true) }]} />;
      case 'c_reports':
        return <List dataSource={mockGeneratedReportFiles.filter((item) => item.accountId === account.id)} renderItem={(item) => <List.Item actions={[<Button key={item.id} icon={<DownloadOutlined />}>Скачать</Button>]}>{item.name}</List.Item>} />;
      case 'c_chat':
        return <Card className="border-0 shadow-card" bordered={false}><p>Чат с менеджером (mock): доступен в рабочие часы.</p><Button type="primary">Открыть чат</Button></Card>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {commonTop}
      <Card className="border-0 shadow-card" bordered={false}>
        <Space direction="vertical" className="w-full">
          <Select
            className="w-full"
            value={activeItem}
            onChange={onActiveItemChange}
            options={accountReportsMenu.flatMap((group) => group.items.map((item) => ({ label: `${group.label} / ${item.label}`, value: item.key })))}
          />
          {content()}
        </Space>
      </Card>
    </div>
  );
};
