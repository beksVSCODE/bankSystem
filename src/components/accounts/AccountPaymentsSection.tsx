import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Upload,
  message,
} from 'antd';
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import type {
  AccountRecord,
  PaymentOrderRecord,
  PaymentTemplate,
  TransferRecord,
} from '@/mock/accountsFeature';
import {
  accountPaymentsMenu,
  formatAccountCurrency,
  mockCardsByAccount,
  mockClientBankUsers,
  mockFavoriteRecipients,
  mockFxRequests,
  mockInvoices,
} from '@/mock/accountsFeature';

interface AccountPaymentsSectionProps {
  account: AccountRecord;
  accounts: AccountRecord[];
  templates: PaymentTemplate[];
  paymentOrders: PaymentOrderRecord[];
  activeSubItem?: string;
  onSubItemChange?: (value: string) => void;
  allowedSubItems?: string[];
  mode?: 'payments' | 'products';
  onTemplatesChange: (items: PaymentTemplate[]) => void;
  onTemplateDelete: (id: string) => void;
  onAddPaymentOrder: (item: PaymentOrderRecord) => void;
  onAddTransfer: (item: TransferRecord) => void;
  onAddHistoryTransaction: (description: string, amount: number, type: 'income' | 'expense') => void;
}

interface FormRendererProps {
  onSaveTemplate: (values: Record<string, string | number>) => void;
  initialValues?: Record<string, string | number>;
}

const SimpleTransferBlock = ({
  title,
  onSaveTemplate,
  initialValues,
  onSubmit,
}: FormRendererProps & { title: string; onSubmit?: (values: Record<string, string | number>) => void }) => {
  const [form] = Form.useForm();
  return (
    <Card title={title} className="border-0 shadow-card" bordered={false}>
      <Form
        layout="vertical"
        form={form}
        initialValues={initialValues}
        onFinish={(values) => {
          onSubmit?.(values);
          message.success('Операция создана');
        }}
      >
        <Form.Item label="Отправитель / источник" name="from"><Input /></Form.Item>
        <Form.Item label="Получатель" name="to"><Input /></Form.Item>
        <Form.Item label="Сумма" name="amount"><InputNumber className="w-full" /></Form.Item>
        <Form.Item label="Комментарий/назначение" name="purpose"><Input.TextArea rows={2} /></Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">Отправить</Button>
          <Button icon={<SaveOutlined />} onClick={() => onSaveTemplate(form.getFieldsValue())}>Сохранить шаблон</Button>
        </Space>
      </Form>
    </Card>
  );
};

export const AccountPaymentsSection = ({
  account,
  accounts,
  templates,
  paymentOrders,
  activeSubItem,
  onSubItemChange,
  allowedSubItems,
  mode = 'payments',
  onTemplatesChange,
  onTemplateDelete,
  onAddPaymentOrder,
  onAddTransfer,
  onAddHistoryTransaction,
}: AccountPaymentsSectionProps) => {
  const [paymentOrderForm] = Form.useForm();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [internalSubItem, setInternalSubItem] = useState(accountPaymentsMenu[0].items[0].key);
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [stateMode, setStateMode] = useState<'loading' | 'ready' | 'empty' | 'error'>('ready');
  const [cards, setCards] = useState(mockCardsByAccount[account.id] || []);
  const [invoices, setInvoices] = useState(mockInvoices.filter((item) => item.accountId === account.id));

  const currentSubItem = activeSubItem ?? internalSubItem;
  const setCurrentSubItem = onSubItemChange ?? setInternalSubItem;

  const allowedSet = useMemo(() => new Set(allowedSubItems || []), [allowedSubItems]);

  const filteredSubItems = useMemo(() => {
    const subItems = accountPaymentsMenu.flatMap((group) => group.items);
    return subItems
      .filter((item) => (allowedSubItems ? allowedSet.has(item.key) : true))
      .filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
  }, [allowedSubItems, allowedSet, search]);

  useEffect(() => {
    if (!allowedSubItems || allowedSubItems.length === 0) {
      return;
    }
    if (!allowedSet.has(currentSubItem)) {
      setCurrentSubItem(allowedSubItems[0]);
    }
  }, [allowedSubItems, allowedSet, currentSubItem, setCurrentSubItem]);

  const filteredOrders = useMemo(
    () =>
      paymentOrders.filter((item) => item.accountId === account.id)
        .filter((item) => (statusFilter === 'all' ? true : item.status === statusFilter)),
    [paymentOrders, account.id, statusFilter],
  );

  const saveTemplate = (values: Record<string, string | number>) => {
    const template: PaymentTemplate = {
      id: `tpl-${Date.now()}`,
      accountId: account.id,
      name: `Шаблон ${new Date().toLocaleTimeString('ru-RU')}`,
      type: currentSubItem,
      values,
      updatedAt: new Date().toISOString(),
    };
    onTemplatesChange([template]);
    message.success('Шаблон сохранен');
  };

  const applyTemplate = (template: PaymentTemplate) => {
    setCurrentSubItem(template.type);
    message.success(`Шаблон "${template.name}" применен`);
    setTemplatesModalOpen(false);
  };

  const selectedTemplate = templates.find((item) => item.type === currentSubItem && item.accountId === account.id);

  const renderContent = () => {
    if (stateMode === 'loading') {
      return <Alert type="info" message="Загрузка раздела..." showIcon />;
    }
    if (stateMode === 'error') {
      return <Alert type="error" message="Ошибка загрузки. Повторите позже." showIcon />;
    }
    if (stateMode === 'empty') {
      return <Alert type="warning" message="Нет данных для отображения." showIcon />;
    }

    switch (currentSubItem) {
      case 'payment_orders':
        return (
          <div className="space-y-4">
            <Card className="border-0 shadow-card" bordered={false}>
              <Table
                rowKey="id"
                pagination={false}
                dataSource={filteredOrders}
                columns={[
                  { title: 'ID', dataIndex: 'id' },
                  { title: 'Получатель', dataIndex: 'recipient' },
                  { title: 'Сумма', dataIndex: 'amount', render: (v: number) => v.toLocaleString('ru-RU') },
                  { title: 'Дата', dataIndex: 'date' },
                  {
                    title: 'Статус',
                    dataIndex: 'status',
                    render: (s: string) => <Tag color={s === 'executed' ? 'green' : s === 'sent' ? 'blue' : s === 'draft' ? 'orange' : 'red'}>{s}</Tag>,
                  },
                ]}
              />
            </Card>
            <Card title="Создать платежное поручение" className="border-0 shadow-card" bordered={false}>
              <Form
                form={paymentOrderForm}
                layout="vertical"
                initialValues={selectedTemplate?.values}
                onFinish={(values) => {
                  const amount = Number(values.amount || 0);
                  onAddPaymentOrder({
                    id: `po-${Date.now()}`,
                    accountId: account.id,
                    recipient: String(values.recipient || 'Новый получатель'),
                    amount,
                    date: new Date().toISOString().slice(0, 10),
                    status: 'draft',
                  });
                  onAddHistoryTransaction('Платежное поручение', -amount, 'expense');
                  message.success('Платежное поручение создано');
                }}
              >
                <Form.Item label="Получатель" name="recipient"><Input /></Form.Item>
                <Form.Item label="Счет получателя" name="recipientAccount"><Input /></Form.Item>
                <Form.Item label="Сумма" name="amount"><InputNumber className="w-full" /></Form.Item>
                <Form.Item label="Назначение" name="purpose"><Input.TextArea rows={2} /></Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">Создать</Button>
                  <Button icon={<SaveOutlined />} onClick={() => saveTemplate(paymentOrderForm.getFieldsValue())}>
                    Сохранить как шаблон
                  </Button>
                </Space>
              </Form>
            </Card>
          </div>
        );
      case 'card_to_card':
        return (
          <SimpleTransferBlock
            title="Перевод с карты на карту"
            onSaveTemplate={saveTemplate}
            initialValues={selectedTemplate?.values}
            onSubmit={(values) => {
              const amount = Number(values.amount || 0);
              onAddTransfer({
                id: `tr-${Date.now()}`,
                accountId: account.id,
                kind: 'card_to_card',
                from: String(values.from || ''),
                to: String(values.to || ''),
                amount,
                status: 'done',
                createdAt: new Date().toISOString(),
              });
              Modal.confirm({
                title: 'Подтвердить перевод?',
                onOk: () => message.success('Перевод подтвержден'),
              });
            }}
          />
        );
      case 'arbitration':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-card" bordered={false}><div className="text-sm text-muted-foreground">Заявки</div><div className="text-2xl font-semibold">12</div></Card>
              <Card className="border-0 shadow-card" bordered={false}><div className="text-sm text-muted-foreground">Поручения</div><div className="text-2xl font-semibold">7</div></Card>
              <Card className="border-0 shadow-card" bordered={false}><div className="text-sm text-muted-foreground">На проверке</div><div className="text-2xl font-semibold">3</div></Card>
            </div>
            <Card title="Обращения" className="border-0 shadow-card" bordered={false}>
              <List
                dataSource={[
                  { id: 'a-1', topic: 'Проверка оплаты #991', status: 'В работе' },
                  { id: 'a-2', topic: 'Возврат ошибочного платежа', status: 'Закрыто' },
                ]}
                renderItem={(item) => <List.Item>{item.topic} <Tag>{item.status}</Tag></List.Item>}
              />
            </Card>
          </div>
        );
      case 'mass_payments':
        return (
          <Card title="Массовые платежи" className="border-0 shadow-card" bordered={false}>
            <Space direction="vertical" className="w-full">
              <Upload beforeUpload={() => { message.success('Файл загружен и разобран'); return false; }}>
                <Button>Загрузить файл</Button>
              </Upload>
              <Table
                rowKey="key"
                pagination={false}
                dataSource={[
                  { key: '1', recipient: 'ООО Север', amount: 20000, result: 'Готово к отправке' },
                  { key: '2', recipient: 'ООО Юг', amount: 30000, result: 'Готово к отправке' },
                ]}
                columns={[
                  { title: 'Получатель', dataIndex: 'recipient' },
                  { title: 'Сумма', dataIndex: 'amount' },
                  { title: 'Результат', dataIndex: 'result' },
                ]}
              />
              <Button type="primary" onClick={() => message.success('Пакет отправлен в обработку')}>Отправить</Button>
            </Space>
          </Card>
        );
      case 'to_person':
        return (
          <SimpleTransferBlock
            title="Перевод в адрес физического лица"
            onSaveTemplate={saveTemplate}
            initialValues={selectedTemplate?.values}
            onSubmit={(values) => {
              const amount = Number(values.amount || 0);
              onAddTransfer({
                id: `tr-${Date.now()}`,
                accountId: account.id,
                kind: 'to_person',
                from: account.name,
                to: String(values.to || ''),
                amount,
                status: 'processing',
                createdAt: new Date().toISOString(),
              });
            }}
          />
        );
      case 'inside_bank':
        return (
          <Card title="Перевод внутри банка" className="border-0 shadow-card" bordered={false}>
            <Form
              layout="vertical"
              initialValues={selectedTemplate?.values}
              onFinish={(values) => {
                const amount = Number(values.amount || 0);
                onAddTransfer({
                  id: `tr-${Date.now()}`,
                  accountId: account.id,
                  kind: 'inside_bank',
                  from: account.name,
                  to: String(values.recipient || ''),
                  amount,
                  status: 'done',
                  createdAt: new Date().toISOString(),
                });
                message.success('Перевод выполнен');
              }}
            >
              <Form.Item label="Получатель" name="recipient">
                <Select options={mockClientBankUsers.map((user) => ({ label: user.name, value: user.name }))} />
              </Form.Item>
              <Form.Item label="Избранные">
                <Select options={mockFavoriteRecipients.map((item) => ({ label: `${item.name} (${item.account.slice(-4)})`, value: item.name }))} />
              </Form.Item>
              <Form.Item label="Сумма" name="amount"><InputNumber className="w-full" /></Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">Перевести</Button>
                <Button icon={<SaveOutlined />} onClick={() => saveTemplate({ recipient: 'favorite', amount: 10000 })}>Сохранить шаблон</Button>
              </Space>
            </Form>
          </Card>
        );
      case 'between_own_accounts':
        return (
          <Card title="Перевод между своими счетами" className="border-0 shadow-card" bordered={false}>
            <Form
              layout="vertical"
              onFinish={(values) => {
                const amount = Number(values.amount || 0);
                onAddHistoryTransaction('Перевод между своими счетами', -amount, 'expense');
                onAddTransfer({
                  id: `tr-${Date.now()}`,
                  accountId: account.id,
                  kind: 'between_own_accounts',
                  from: String(values.from || ''),
                  to: String(values.to || ''),
                  amount,
                  status: 'done',
                  createdAt: new Date().toISOString(),
                });
                message.success('Перевод выполнен. Комиссия 0');
              }}
            >
              <Form.Item label="Счет-источник" name="from" rules={[{ required: true }]}>
                <Select options={accounts.map((item) => ({ label: `${item.name} (${formatAccountCurrency(item.balance, item.currency)})`, value: item.id }))} />
              </Form.Item>
              <Form.Item label="Счет-получатель" name="to" rules={[{ required: true }]}>
                <Select options={accounts.map((item) => ({ label: item.name, value: item.id }))} />
              </Form.Item>
              <Form.Item label="Сумма" name="amount" rules={[{ required: true }]}><InputNumber className="w-full" /></Form.Item>
              <Button type="primary" htmlType="submit">Подтвердить</Button>
            </Form>
          </Card>
        );
      case 'qr_payment':
        return (
          <Card title="Платеж по QR коду" className="border-0 shadow-card" bordered={false}>
            <Form layout="vertical" onFinish={() => message.success('Платеж по QR отправлен')}>
              <Form.Item>
                <Button onClick={() => message.success('QR загружен, реквизиты заполнены mock-данными')}>Загрузить QR</Button>
              </Form.Item>
              <Form.Item label="Получатель"><Input defaultValue="ООО QR Тест" /></Form.Item>
              <Form.Item label="Реквизиты"><Input defaultValue="40702810000000123456" /></Form.Item>
              <Form.Item label="Сумма"><InputNumber className="w-full" defaultValue={1500} /></Form.Item>
              <Button type="primary" htmlType="submit">Оплатить</Button>
            </Form>
          </Card>
        );
      case 'calendar_payments':
        return (
          <Card title="Платежи по календарю" className="border-0 shadow-card" bordered={false}>
            <List
              dataSource={[
                { id: 'cal-1', date: '2026-02-20', name: 'Аренда офиса', amount: 185000 },
                { id: 'cal-2', date: '2026-02-25', name: 'Налоги', amount: 420000 },
              ]}
              renderItem={(item) => (
                <List.Item>
                  {item.date} • {item.name} • {item.amount.toLocaleString('ru-RU')} ₽
                </List.Item>
              )}
            />
            <Button className="mt-3" type="primary">Создать платеж по календарю</Button>
          </Card>
        );
      case 'invoice_service':
        return (
          <Card title="Выставление счетов" className="border-0 shadow-card" bordered={false}>
            <Table
              rowKey="id"
              pagination={false}
              dataSource={invoices}
              columns={[
                { title: 'Контрагент', dataIndex: 'counterparty' },
                { title: 'Сумма', dataIndex: 'amount' },
                { title: 'Назначение', dataIndex: 'purpose' },
                { title: 'Срок', dataIndex: 'dueDate' },
                { title: 'Статус', dataIndex: 'status', render: (v: string) => <Tag>{v}</Tag> },
                {
                  title: 'Действия',
                  render: (_: unknown, row: typeof invoices[number]) => (
                    <Space>
                      <Button size="small" onClick={() => message.success('Ссылка скопирована')}>Скопировать ссылку</Button>
                      <Button size="small" onClick={() => message.success(`Счет ${row.id} отправлен`)}>Отправить</Button>
                    </Space>
                  ),
                },
              ]}
            />
            <Collapse
              className="mt-4"
              items={[{
                key: '1',
                label: 'Создать счет',
                children: (
                  <Form
                    layout="vertical"
                    onFinish={(values) => {
                      setInvoices((prev) => [
                        {
                          id: `inv-${Date.now()}`,
                          accountId: account.id,
                          counterparty: String(values.counterparty || 'Контрагент'),
                          amount: Number(values.amount || 0),
                          purpose: String(values.purpose || ''),
                          dueDate: String(values.dueDate || new Date().toISOString().slice(0, 10)),
                          status: 'draft',
                        },
                        ...prev,
                      ]);
                      message.success('Счет создан');
                    }}
                  >
                    <Form.Item label="Контрагент" name="counterparty"><Input /></Form.Item>
                    <Form.Item label="Сумма" name="amount"><InputNumber className="w-full" /></Form.Item>
                    <Form.Item label="Назначение" name="purpose"><Input /></Form.Item>
                    <Form.Item label="Срок" name="dueDate"><Input type="date" /></Form.Item>
                    <Button type="primary" htmlType="submit">Создать</Button>
                  </Form>
                ),
              }]}
            />
          </Card>
        );
      case 'templates':
        return (
          <Card title="Шаблоны платежей" className="border-0 shadow-card" bordered={false}>
            <List
              dataSource={templates.filter((item) => item.accountId === account.id)}
              locale={{ emptyText: 'Шаблоны не найдены' }}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button key="apply" size="small" onClick={() => applyTemplate(item)}>Применить</Button>,
                    <Button key="delete" size="small" danger icon={<DeleteOutlined />} onClick={() => onTemplateDelete(item.id)} />,
                  ]}
                >
                  <List.Item.Meta title={item.name} description={`${item.type} • ${new Date(item.updatedAt).toLocaleString('ru-RU')}`} />
                </List.Item>
              )}
            />
            <Button className="mt-3" type="primary" onClick={() => setTemplatesModalOpen(true)}>Создать шаблон</Button>
          </Card>
        );
      case 'favorites':
        return (
          <Card title="Избранные платежи" className="border-0 shadow-card" bordered={false}>
            <List
              dataSource={templates.filter((item) => item.accountId === account.id).slice(0, 3)}
              locale={{ emptyText: 'Избранных платежей пока нет' }}
              renderItem={(item) => (
                <List.Item actions={[<Button key="apply" size="small" onClick={() => applyTemplate(item)}>Повторить</Button>]}> 
                  <List.Item.Meta title={item.name} description={`Шаблон • ${new Date(item.updatedAt).toLocaleString('ru-RU')}`} />
                </List.Item>
              )}
            />
          </Card>
        );
      case 'autopay':
        return (
          <Card title="Автоплатежи" className="border-0 shadow-card" bordered={false}>
            <List
              dataSource={[
                { id: 'auto-1', name: 'Аренда офиса', status: true },
                { id: 'auto-2', name: 'Интернет/связь', status: false },
              ]}
              renderItem={(item) => (
                <List.Item actions={[<Switch key={item.id} defaultChecked={item.status} />]}>
                  {item.name}
                </List.Item>
              )}
            />
            <Button className="mt-3" type="primary">Создать автоплатеж</Button>
          </Card>
        );
      case 'bank_cards':
        return (
          <Card title="Банковские карты" className="border-0 shadow-card" bordered={false}>
            <List
              dataSource={cards}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Switch
                      key={item.id}
                      checked={item.status === 'active'}
                      checkedChildren="Активна"
                      unCheckedChildren="Заморожена"
                      onChange={(checked) => setCards((prev) => prev.map((card) => (card.id === item.id ? { ...card, status: checked ? 'active' : 'frozen' } : card)))}
                    />,
                    <Button key={`${item.id}-requisites`} size="small" onClick={() => Modal.info({ title: 'Реквизиты карты', content: item.number })}>Реквизиты</Button>,
                  ]}
                >
                  <List.Item.Meta title={`${item.number} (${item.kind})`} description={`Лимиты: день ${item.dailyLimit.toLocaleString('ru-RU')}, месяц ${item.monthlyLimit.toLocaleString('ru-RU')}`} />
                </List.Item>
              )}
            />
          </Card>
        );
      case 'bank_account_settings':
        return (
          <Card title="Настройка счета" className="border-0 shadow-card" bordered={false}>
            <Space direction="vertical" className="w-full">
              <div className="flex justify-between"><span>Уведомления</span><Switch defaultChecked /></div>
              <div className="flex justify-between"><span>Лимит исходящих в день</span><InputNumber defaultValue={500000} /></div>
              <div className="flex justify-between"><span>API-доступ</span><Switch /></div>
            </Space>
          </Card>
        );
      case 'contract_params':
        return (
          <Card title="Параметры договора" className="border-0 shadow-card" bordered={false}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>Дата открытия: {new Date(account.openedAt).toLocaleDateString('ru-RU')}</div>
              <div>Тариф: {account.tariff}</div>
              <div>Комиссия: {account.commission}</div>
              <div>Реквизиты: {account.accountNumber}</div>
            </div>
          </Card>
        );
      case 'open_deposit':
      case 'open_savings':
        return (
          <SimpleTransferBlock
            title={currentSubItem === 'open_deposit' ? 'Открыть вклад' : 'Открыть накопительный счет'}
            onSaveTemplate={saveTemplate}
            initialValues={selectedTemplate?.values}
            onSubmit={() => message.success('Заявка создана')}
          />
        );
      case 'business_deposits':
      case 'placements':
        return (
          <Card title={currentSubItem === 'business_deposits' ? 'Депозиты бизнесу' : 'Размещения'} className="border-0 shadow-card" bordered={false}>
            <List
              dataSource={[
                { id: 'req-1', amount: 1500000, term: '90 дней', rate: '9.4%', status: 'new' },
                { id: 'req-2', amount: 2000000, term: '180 дней', rate: '9.8%', status: 'approved' },
              ]}
              renderItem={(item) => <List.Item>{item.id} • {item.amount.toLocaleString('ru-RU')} • {item.term} • <Tag>{item.status}</Tag></List.Item>}
            />
          </Card>
        );
      case 'guarantees':
      case 'credit_request':
      case 'credits':
        return (
          <Card title="Кредиты для бизнеса" className="border-0 shadow-card" bordered={false}>
            <Table
              rowKey="id"
              pagination={false}
              dataSource={[
                { id: 'cr-1', name: 'Кредитная линия', debt: 5400000, paymentDate: '2026-03-15', status: 'active' },
                { id: 'cr-2', name: 'Гарантия исполнения', debt: 1100000, paymentDate: '2026-04-20', status: 'pending' },
              ]}
              columns={[
                { title: 'Продукт', dataIndex: 'name' },
                { title: 'Остаток', dataIndex: 'debt' },
                { title: 'Платеж', dataIndex: 'paymentDate' },
                { title: 'Статус', dataIndex: 'status', render: (value: string) => <Tag>{value}</Tag> },
              ]}
            />
          </Card>
        );
      case 'alternative_settlements':
      case 'ved_notifications':
      case 'conversion_ops':
      case 'special_rate':
      case 'ved_notice':
        return (
          <Card title="Валютные операции" className="border-0 shadow-card" bordered={false}>
            <Form
              layout="vertical"
              onFinish={(values) => {
                if (currentSubItem === 'conversion_ops') {
                  const amount = Number(values.amount || 0);
                  const rate = 93.4;
                  message.success(`Итоговая сумма: ${(amount * rate).toLocaleString('ru-RU')} RUB`);
                } else {
                  message.success('Заявка отправлена');
                }
              }}
            >
              <Form.Item label="Номер контракта / заявки"><Input /></Form.Item>
              <Form.Item label="Валюта"><Select options={[{ label: 'USD', value: 'USD' }, { label: 'EUR', value: 'EUR' }]} /></Form.Item>
              <Form.Item label="Сумма" name="amount"><InputNumber className="w-full" /></Form.Item>
              <Form.Item label="Комментарий"><Input.TextArea rows={2} /></Form.Item>
              <Space>
                {currentSubItem === 'special_rate' && <Button onClick={() => message.success('Спецкурс получен: 92.95')}>Получить курс</Button>}
                <Button type="primary" htmlType="submit">Сохранить / отправить</Button>
              </Space>
            </Form>
            <List
              className="mt-4"
              dataSource={mockFxRequests.filter((item) => item.accountId === account.id)}
              renderItem={(item) => <List.Item>{item.id} • {item.createdAt.slice(0, 10)} • <Tag>{item.status}</Tag></List.Item>}
            />
          </Card>
        );
      default:
        return <Alert type="info" message="Раздел в работе" showIcon />;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-card" bordered={false}>
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <Space wrap>
            <Input.Search placeholder="Поиск раздела/операции" allowClear value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 280 }} />
            {mode === 'payments' && (
              <Select
                value={statusFilter}
                style={{ width: 180 }}
                onChange={setStatusFilter}
                options={[
                  { label: 'Все статусы', value: 'all' },
                  { label: 'Черновик', value: 'draft' },
                  { label: 'Отправлен', value: 'sent' },
                  { label: 'Исполнен', value: 'executed' },
                  { label: 'Отклонен', value: 'rejected' },
                ]}
              />
            )}
          </Space>
          <Space>
            <Button onClick={() => setStateMode((prev) => (prev === 'loading' ? 'ready' : 'loading'))}>Loading</Button>
            <Button onClick={() => setStateMode('empty')}>Empty</Button>
            <Button danger onClick={() => setStateMode('error')}>Error</Button>
            {mode === 'payments' && (
              <>
                <Button icon={<PlusOutlined />}>Создать</Button>
                <Button onClick={() => setTemplatesModalOpen(true)}>Шаблоны</Button>
              </>
            )}
          </Space>
        </div>
      </Card>

      <Card className="border-0 shadow-card" bordered={false}>
        <Space direction="vertical" className="w-full">
          <Select
            className="w-full"
            value={currentSubItem}
            onChange={(value) => {
              setStateMode('ready');
              setCurrentSubItem(value);
            }}
            options={accountPaymentsMenu.flatMap((group) =>
              group.items
                .filter((item) => filteredSubItems.some((it) => it.key === item.key))
                .map((item) => ({
                  label: `${group.label} / ${item.label}`,
                  value: item.key,
                })),
            )}
          />
          {renderContent()}
        </Space>
      </Card>

      {mode === 'payments' && (
        <Modal open={templatesModalOpen} title="Шаблоны платежей" footer={null} onCancel={() => setTemplatesModalOpen(false)}>
          <List
            dataSource={templates.filter((item) => item.accountId === account.id)}
            locale={{ emptyText: 'Шаблоны не найдены' }}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button key="apply" size="small" onClick={() => applyTemplate(item)}>Применить</Button>,
                  <Button key="delete" size="small" danger icon={<DeleteOutlined />} onClick={() => onTemplateDelete(item.id)} />,
                ]}
              >
                <List.Item.Meta title={item.name} description={`${item.type} • ${new Date(item.updatedAt).toLocaleString('ru-RU')}`} />
              </List.Item>
            )}
          />
        </Modal>
      )}
    </div>
  );
};
