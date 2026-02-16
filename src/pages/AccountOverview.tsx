import { useEffect, useMemo, useState } from 'react';
import { Breadcrumb, Button, Card, Empty, Input, List, Select, Space, Tag, Typography } from 'antd';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '@/components/MainLayout';
import { AccountHeader } from '@/components/accounts/AccountHeader';
import { AccountStatementSection } from '@/components/accounts/AccountStatementSection';
import { AccountPaymentsSection } from '@/components/accounts/AccountPaymentsSection';
import { AccountReportsSection } from '@/components/accounts/AccountReportsSection';
import { AccountDocumentsSection } from '@/components/accounts/AccountDocumentsSection';
import { AccountSettingsSection } from '@/components/accounts/AccountSettingsSection';
import {
  accountPaymentsMenu,
  accountPrimaryTabs,
  accountReportsMenu,
  formatAccountCurrency,
  mockCardsByAccount,
} from '@/mock/accountsFeature';
import { useAccountFeatureStore } from '@/hooks/useAccountFeatureStore';

const sectionToTab: Record<string, string> = {
  overview: 'overview',
  statement: 'statement',
  payments: 'payments',
  products: 'products',
  reports: 'reports',
  documents: 'documents',
  settings: 'settings',
};

const tabToSection: Record<string, string> = {
  overview: 'overview',
  statement: 'statement',
  payments: 'payments',
  products: 'products',
  reports: 'reports',
  documents: 'documents',
  settings: 'settings',
};

const sectionDescription: Record<string, string> = {
  overview: 'Краткий обзор баланса, операций и активных продуктов по счету.',
  statement: 'Выписка и лента операций по выбранному счету.',
  payments: 'Платежи, переводы, шаблоны и выставление счетов.',
  products: 'Карты, вклады, депозиты, кредиты и валютные операции.',
  reports: 'Отчеты, документы и сервисы консультанта.',
  documents: 'Документы по счету, загрузка и фильтры.',
  settings: 'Управление параметрами, доступами и безопасностью счета.',
};

export default function AccountOverview() {
  const { accountId = '', section = 'overview' } = useParams();
  const navigate = useNavigate();
  const store = useAccountFeatureStore();
  const { Title, Text } = Typography;

  const [activePrimaryTab, setActivePrimaryTab] = useState(sectionToTab[section] || 'overview');
  const [activeStatementTab, setActiveStatementTab] = useState<'statement' | 'operations'>('statement');
  const [activePaymentsItem, setActivePaymentsItem] = useState(accountPaymentsMenu[0].items[0].key);
  const [activeProductsItem, setActiveProductsItem] = useState('bank_cards');
  const [activeReportsItem, setActiveReportsItem] = useState(accountReportsMenu[0].items[0].key);
  const [opsQuery, setOpsQuery] = useState('');
  const [opsCategory, setOpsCategory] = useState('all');

  const account = store.accounts.find((item) => item.id === accountId);
  const accountTransactions = useMemo(
    () => store.byAccountId.transactions(accountId),
    [store.byAccountId, accountId],
  );

  const operationCategories = useMemo(() => {
    const unique = Array.from(new Set(accountTransactions.map((item) => item.category)));
    return unique.filter(Boolean);
  }, [accountTransactions]);

  const filteredOperations = useMemo(
    () =>
      accountTransactions.filter((item) => {
        const matchesQuery = opsQuery
          ? item.description.toLowerCase().includes(opsQuery.toLowerCase()) ||
            (item.counterparty || '').toLowerCase().includes(opsQuery.toLowerCase()) ||
            (item.tag || '').toLowerCase().includes(opsQuery.toLowerCase())
          : true;
        const matchesCategory = opsCategory === 'all' ? true : item.category === opsCategory;
        return matchesQuery && matchesCategory;
      }),
    [accountTransactions, opsCategory, opsQuery],
  );

  const cardsCount = (mockCardsByAccount[account.id] || []).length;

  useEffect(() => {
    const mappedTab = sectionToTab[section];
    if (!mappedTab) {
      navigate(`/accounts/${accountId}/overview`, { replace: true });
      return;
    }
    setActivePrimaryTab(mappedTab);
  }, [accountId, section, navigate]);

  const handlePrimaryChange = (tab: string) => {
    const targetSection = tabToSection[tab];
    if (!targetSection) {
      return;
    }
    setActivePrimaryTab(tab);
    navigate(`/accounts/${accountId}/${targetSection}`);
  };

  const openPaymentsItem = (key: string) => {
    setActivePaymentsItem(key);
    handlePrimaryChange('payments');
  };

  const openProductsItem = (key: string) => {
    setActiveProductsItem(key);
    handlePrimaryChange('products');
  };

  const openReportsItem = (key: string) => {
    setActiveReportsItem(key);
    handlePrimaryChange('reports');
  };

  const paymentGroupKeys = new Set(['base_payments', 'invoices', 'templates']);
  const productGroupKeys = new Set(['cards', 'bank_accounts', 'deposits_people', 'deposits_business', 'business_credits', 'fx']);

  const paymentGroups = accountPaymentsMenu.filter((group) => paymentGroupKeys.has(group.key));
  const productGroups = accountPaymentsMenu.filter((group) => productGroupKeys.has(group.key));

  const paymentSubItems = paymentGroups.flatMap((group) => group.items.map((item) => item.key));
  const productSubItems = productGroups.flatMap((group) => group.items.map((item) => item.key));

  if (!account) {
    return <Navigate to="/accounts" replace />;
  }

  const activeTabMeta = accountPrimaryTabs.find((tab) => tab.key === activePrimaryTab);

  return (
    <MainLayout>
      <div className="space-y-5">
        <Card className="border-0 shadow-card" bordered={false}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <Breadcrumb
                items={[
                  { title: <button onClick={() => navigate('/accounts')} className="text-primary">Счета</button> },
                  { title: account.name },
                  { title: activeTabMeta?.label || 'Раздел' },
                ]}
              />
              <Title level={4} className="!m-0">{activeTabMeta?.label || 'Раздел счета'}</Title>
              <Text type="secondary">
                {sectionDescription[activePrimaryTab] || 'Работа с данными счета'}{' '}
                • контекст: {account.currency} • ••••{account.accountNumber.slice(-4)}
              </Text>
            </div>
            <Space>
              <Text type="secondary">Переключить счет</Text>
              <Select
                style={{ width: 320 }}
                value={account.id}
                onChange={(nextId) => navigate(`/accounts/${nextId}/${section}`)}
                options={store.accounts.map((item) => ({
                  value: item.id,
                  label: `${item.name} (${item.currency})`,
                }))}
              />
            </Space>
          </div>
        </Card>

        <AccountHeader account={account} onQuickAction={handlePrimaryChange} />

        <Card className="border-0 shadow-card" bordered={false}>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold">Разделы счета</div>
              <Space wrap className="mt-2">
                {accountPrimaryTabs.map((tab) => (
                  <Button
                    key={tab.key}
                    type={activePrimaryTab === tab.key ? 'primary' : 'default'}
                    onClick={() => handlePrimaryChange(tab.key)}
                  >
                    {tab.label}
                  </Button>
                ))}
              </Space>
            </div>

            {activePrimaryTab === 'statement' && (
              <div>
                <div className="text-sm font-semibold">Выписка и операции</div>
                <Space wrap className="mt-2">
                  <Button type={activeStatementTab === 'statement' ? 'primary' : 'default'} onClick={() => setActiveStatementTab('statement')}>Выписка</Button>
                  <Button type={activeStatementTab === 'operations' ? 'primary' : 'default'} onClick={() => setActiveStatementTab('operations')}>Лента операций</Button>
                </Space>
              </div>
            )}

            {activePrimaryTab === 'payments' && (
              <div>
                <div className="text-sm font-semibold">Платежи и переводы</div>
                <div className="space-y-3 mt-2">
                  {paymentGroups.map((group) => (
                    <div key={group.key} className="space-y-2">
                      <div className="text-xs text-muted-foreground">{group.label}</div>
                      <Space wrap>
                        {group.items.map((item) => (
                          <Button
                            key={item.key}
                            size="small"
                            type={activePaymentsItem === item.key ? 'primary' : 'default'}
                            onClick={() => openPaymentsItem(item.key)}
                          >
                            {item.label}
                          </Button>
                        ))}
                      </Space>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activePrimaryTab === 'products' && (
              <div>
                <div className="text-sm font-semibold">Продукты по счету</div>
                <div className="space-y-3 mt-2">
                  {productGroups.map((group) => (
                    <div key={group.key} className="space-y-2">
                      <div className="text-xs text-muted-foreground">{group.label}</div>
                      <Space wrap>
                        {group.items.map((item) => (
                          <Button
                            key={item.key}
                            size="small"
                            type={activeProductsItem === item.key ? 'primary' : 'default'}
                            onClick={() => openProductsItem(item.key)}
                          >
                            {item.label}
                          </Button>
                        ))}
                      </Space>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activePrimaryTab === 'reports' && (
              <div>
                <div className="text-sm font-semibold">Отчеты и аналитика</div>
                <div className="space-y-3 mt-2">
                  {accountReportsMenu.map((group) => (
                    <div key={group.key} className="space-y-2">
                      <div className="text-xs text-muted-foreground">{group.label}</div>
                      <Space wrap>
                        {group.items.map((item) => (
                          <Button
                            key={item.key}
                            size="small"
                            type={activeReportsItem === item.key ? 'primary' : 'default'}
                            onClick={() => openReportsItem(item.key)}
                          >
                            {item.label}
                          </Button>
                        ))}
                      </Space>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        <div>
            {activePrimaryTab === 'statement' && activeStatementTab === 'statement' && (
              <AccountStatementSection
                account={account}
                transactions={accountTransactions}
                exportHistory={store.byAccountId.statementExports(account.id)}
                onExport={(format) => store.addStatementExport(account.id, format)}
              />
            )}

            {activePrimaryTab === 'statement' && activeStatementTab === 'operations' && (
              <Card className="border-0 shadow-card" bordered={false}>
                <Space direction="vertical" className="w-full" size={16}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <Input.Search
                      placeholder="Поиск по операциям"
                      value={opsQuery}
                      onChange={(e) => setOpsQuery(e.target.value)}
                      style={{ maxWidth: 320 }}
                    />
                    <Select
                      value={opsCategory}
                      onChange={setOpsCategory}
                      style={{ width: 240 }}
                      options={[
                        { label: 'Все категории', value: 'all' },
                        ...operationCategories.map((cat) => ({ label: cat, value: cat })),
                      ]}
                    />
                  </div>
                  {filteredOperations.length === 0 ? (
                    <Empty description="Операции не найдены" />
                  ) : (
                    <List
                      dataSource={filteredOperations}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            title={item.description}
                            description={`${new Date(item.date).toLocaleString('ru-RU')} • ${item.category}`}
                          />
                          <div className="flex items-center gap-2">
                            {item.tag && <Tag>{item.tag}</Tag>}
                            <span className={item.amount < 0 ? 'text-red-500' : 'text-emerald-600'}>
                              {item.amount.toLocaleString('ru-RU')}
                            </span>
                          </div>
                        </List.Item>
                      )}
                    />
                  )}
                </Space>
              </Card>
            )}

            {activePrimaryTab === 'payments' && (
              <AccountPaymentsSection
                account={account}
                accounts={store.accounts}
                templates={store.byAccountId.templates(account.id)}
                paymentOrders={store.byAccountId.paymentOrders(account.id)}
                activeSubItem={activePaymentsItem}
                onSubItemChange={setActivePaymentsItem}
                allowedSubItems={paymentSubItems}
                mode="payments"
                onTemplatesChange={(items) => {
                  items.forEach((item) => store.upsertTemplate(item));
                }}
                onTemplateDelete={store.deleteTemplate}
                onAddPaymentOrder={store.addPaymentOrder}
                onAddTransfer={store.addTransfer}
                onAddHistoryTransaction={(description, amount, type) =>
                  store.addTransaction({
                    id: `tx-${Date.now()}`,
                    accountId: account.id,
                    date: new Date().toISOString(),
                    description,
                    category: 'Переводы',
                    amount,
                    type,
                    status: 'completed',
                  })
                }
              />
            )}

            {activePrimaryTab === 'products' && (
              <AccountPaymentsSection
                account={account}
                accounts={store.accounts}
                templates={store.byAccountId.templates(account.id)}
                paymentOrders={store.byAccountId.paymentOrders(account.id)}
                activeSubItem={activeProductsItem}
                onSubItemChange={setActiveProductsItem}
                allowedSubItems={productSubItems}
                mode="products"
                onTemplatesChange={(items) => {
                  items.forEach((item) => store.upsertTemplate(item));
                }}
                onTemplateDelete={store.deleteTemplate}
                onAddPaymentOrder={store.addPaymentOrder}
                onAddTransfer={store.addTransfer}
                onAddHistoryTransaction={(description, amount, type) =>
                  store.addTransaction({
                    id: `tx-${Date.now()}`,
                    accountId: account.id,
                    date: new Date().toISOString(),
                    description,
                    category: 'Продукты',
                    amount,
                    type,
                    status: 'completed',
                  })
                }
              />
            )}

            {activePrimaryTab === 'reports' && (
              <AccountReportsSection
                account={account}
                transactions={accountTransactions}
                activeItem={activeReportsItem}
                onActiveItemChange={setActiveReportsItem}
              />
            )}

            {activePrimaryTab === 'documents' && (
              <AccountDocumentsSection
                account={account}
                documents={store.byAccountId.documents(account.id)}
                onUpload={(doc) => store.addDocument(doc)}
              />
            )}

            {activePrimaryTab === 'settings' && (
              <AccountSettingsSection
                account={account}
                settings={store.byAccountId.settings(account.id)}
                onRename={(name) => store.renameAccount(account.id, name)}
                onSettingsUpdate={(patch) => store.updateSettings(account.id, patch)}
              />
            )}

            {activePrimaryTab === 'overview' && (
              <div className="space-y-4">
                <Card className="border-0 shadow-card" bordered={false}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Баланс</div>
                      <div className="text-2xl font-semibold">{formatAccountCurrency(account.balance, account.currency)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Тип счета</div>
                      <div className="text-lg">{account.type}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Статус</div>
                      <Tag color={account.status === 'active' ? 'green' : 'orange'}>{account.status}</Tag>
                    </div>
                  </div>
                </Card>
                <Card className="border-0 shadow-card" bordered={false}>
                  <div className="text-sm text-muted-foreground">Быстрые действия</div>
                  <Space wrap className="mt-2">
                    <Button onClick={() => openPaymentsItem('payment_orders')}>Создать платеж</Button>
                    <Button onClick={() => openPaymentsItem('between_own_accounts')}>Перевод между своими счетами</Button>
                    <Button onClick={() => openPaymentsItem('invoice_service')}>Выставить счет</Button>
                    <Button onClick={() => {
                      setActiveStatementTab('statement');
                      handlePrimaryChange('statement');
                    }}>
                      Скачать выписку
                    </Button>
                  </Space>
                </Card>
                <Card title="Активные продукты" className="border-0 shadow-card" bordered={false}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Карты</div>
                      <div className="text-lg font-semibold">{cardsCount}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Вклады / накопительные</div>
                      <div className="text-lg font-semibold">{account.type === 'deposit' || account.type === 'savings' ? '1' : '0'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Кредиты</div>
                      <div className="text-lg font-semibold">0</div>
                    </div>
                  </div>
                </Card>
                <Card title="Последние операции" className="border-0 shadow-card" bordered={false}>
                  {accountTransactions.length === 0 ? (
                    <Empty description="Операций пока нет" />
                  ) : (
                    <List
                      dataSource={accountTransactions.slice(0, 6)}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            title={item.description}
                            description={`${new Date(item.date).toLocaleString('ru-RU')} • ${item.category}`}
                          />
                          <span className={item.amount < 0 ? 'text-red-500' : 'text-emerald-600'}>
                            {item.amount.toLocaleString('ru-RU')}
                          </span>
                        </List.Item>
                      )}
                    />
                  )}
                </Card>
              </div>
            )}
        </div>
      </div>
    </MainLayout>
  );
}
