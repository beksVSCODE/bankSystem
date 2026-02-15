import { Card, Empty, Statistic, Row, Col, LineChart, BarChart, PieChart, Tabs, List, Table, Progress, Button, Input, Form, Select, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { mockExpenseCategories, mockTransactionTags, mockCounterparties, mockDocuments, mockConsultantRequests, mockReports } from '@/mock/paymentsAndReports';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

// BalanceMovement
export const BalanceMovement = () => (
  <Card className="border border-border shadow-sm rounded-lg">
    <h3 className="text-lg font-semibold text-foreground mb-4">График движения средств</h3>
    <div className="bg-muted p-8 rounded-lg text-center h-96 flex items-center justify-center">
      <p className="text-muted-foreground">График показывает изменение баланса за выбранный период</p>
    </div>
  </Card>
);

// Counterparties
export const Counterparties = () => {
  interface CounterpartyData {
    id: string;
    name: string;
    inn: string;
    balance: number;
    transactions: number;
  }
  
  const columns: ColumnsType<CounterpartyData> = [
    { title: 'Контрагент', dataIndex: 'name', key: 'name' },
    { title: 'ИНН', dataIndex: 'inn', key: 'inn' },
    { title: 'Баланс', dataIndex: 'balance', key: 'balance', render: (balance) => <span style={{ color: balance > 0 ? 'green' : 'red' }}>{balance.toLocaleString('ru-RU')} ₽</span> },
    { title: 'Операций', dataIndex: 'transactions', key: 'transactions' },
  ];

  return (
    <Card className="border border-border shadow-sm rounded-lg">
      <h3 className="text-lg font-semibold text-foreground mb-4">Дебиторы и кредиторы</h3>
      <Table columns={columns} dataSource={mockCounterparties} rowKey="id" pagination={{ pageSize: 10 }} />
    </Card>
  );
};

// TransactionCalendar
export const TransactionCalendar = () => (
  <Card className="border border-border shadow-sm rounded-lg">
    <h3 className="text-lg font-semibold text-foreground mb-4">Календарь транзакций</h3>
    <div className="bg-muted p-6 rounded-lg">
      <p className="text-muted-foreground text-center">Календарный вид транзакций по дням</p>
    </div>
  </Card>
);

// SpendingAnalysis
export const SpendingAnalysis = () => (
  <Card className="border border-border shadow-sm rounded-lg">
    <h3 className="text-lg font-semibold text-foreground mb-4">На что я трачу</h3>
    <div className="space-y-4">
      {mockExpenseCategories.map((cat) => (
        <div key={cat.id}>
          <div className="flex justify-between mb-2">
            <span className="font-medium">{cat.name}</span>
            <span className="text-muted-foreground">{cat.percentage}%</span>
          </div>
          <Progress percent={cat.percentage} strokeColor={cat.color} />
          <p className="text-xs text-muted-foreground mt-1">{cat.sum.toLocaleString('ru-RU')} ₽</p>
        </div>
      ))}
    </div>
  </Card>
);

// TagReport
export const TagReport = () => (
  <Card className="border border-border shadow-sm rounded-lg">
    <h3 className="text-lg font-semibold text-foreground mb-4">Отчет по тегам</h3>
    <div className="space-y-3">
      {mockTransactionTags.map((tag) => (
        <div key={tag.id} className="flex justify-between items-center p-3 bg-muted rounded">
          <div>
            <p className="font-medium">{tag.name}</p>
            <p className="text-xs text-muted-foreground">{tag.count} операций</p>
          </div>
          <span className="text-lg font-semibold">{tag.sum.toLocaleString('ru-RU')} ₽</span>
        </div>
      ))}
    </div>
  </Card>
);

// BalanceStructure
export const BalanceStructure = () => (
  <Card className="border border-border shadow-sm rounded-lg">
    <h3 className="text-lg font-semibold text-foreground mb-4">Структура остатков</h3>
    <Row gutter={16}>
      <Col xs={24} sm={12}>
        <Statistic title="Основной счет" value="245,890" suffix="₽" />
      </Col>
      <Col xs={24} sm={12}>
        <Statistic title="Накопительный" value="500,000" suffix="₽" />
      </Col>
      <Col xs={24} sm={12}>
        <Statistic title="USD счет" value="5,000" suffix="$" />
      </Col>
      <Col xs={24} sm={12}>
        <Statistic title="EUR счет" value="3,000" suffix="€" />
      </Col>
    </Row>
  </Card>
);

// CounterpartyCheck
export const CounterpartyCheckComponent = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  
  interface CheckResult {
    name: string;
    inn: string;
    status: string;
    registrationDate: string;
    legalAddress: string;
  }
  
  const [result, setResult] = useState<CheckResult | null>(null);

  const handleCheck = async (values: { name: string; inn?: string }) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setResult({
      name: values.name,
      inn: values.inn,
      status: 'active',
      registrationDate: '2020-05-15',
      legalAddress: 'г. Москва, ул. Пушкина, д. 10',
    });
    setIsLoading(false);
  };

  return (
    <Card className="border border-border shadow-sm rounded-lg">
      <h3 className="text-lg font-semibold text-foreground mb-4">Проверка контрагентов</h3>
      <Form form={form} layout="vertical" onFinish={handleCheck}>
        <Form.Item label="Название или ИНН" name="name" rules={[{ required: true }]}>
          <Input placeholder="Введите название или ИНН" />
        </Form.Item>
        <Form.Item name="inn" hidden>
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading} block>
          Проверить
        </Button>
      </Form>

      {result && (
        <div className="mt-6 p-4 bg-muted rounded">
          <p><strong>Название:</strong> {result.name}</p>
          <p><strong>Статус:</strong> {result.status}</p>
          <p><strong>Дата регистрации:</strong> {result.registrationDate}</p>
          <p><strong>Адрес:</strong> {result.legalAddress}</p>
        </div>
      )}
    </Card>
  );
};

// Tariffs
export const TariffsComponent = () => (
  <Card className="border border-border shadow-sm rounded-lg">
    <h3 className="text-lg font-semibold text-foreground mb-4">Мои тарифы</h3>
    <List
      dataSource={[
        { name: 'Выписка по счету', fee: 'Бесплатно' },
        { name: 'Платежное поручение', fee: '50 ₽' },
        { name: 'Массовые платежи', fee: '100 ₽' },
      ]}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta title={item.name} description={item.fee} />
        </List.Item>
      )}
    />
  </Card>
);

// AccountDetails
export const AccountDetailsComponent = () => (
  <Card className="border border-border shadow-sm rounded-lg">
    <h3 className="text-lg font-semibold text-foreground mb-4">Реквизиты счета</h3>
    <div className="space-y-3">
      <div className="flex justify-between p-3 bg-muted rounded">
        <span>Номер счета:</span>
        <span className="font-mono">40817810500000123456</span>
      </div>
      <div className="flex justify-between p-3 bg-muted rounded">
        <span>БИК банка:</span>
        <span className="font-mono">044525225</span>
      </div>
      <div className="flex justify-between p-3 bg-muted rounded">
        <span>Корр. счет:</span>
        <span className="font-mono">30101810400000000225</span>
      </div>
    </div>
  </Card>
);

// DepositTerms
export const DepositTermsComponent = () => (
  <Card className="border border-border shadow-sm rounded-lg">
    <h3 className="text-lg font-semibold text-foreground mb-4">Условия вклада</h3>
    <p className="text-muted-foreground mb-4">Условия и параметры вкладов и размещений</p>
  </Card>
);

// AgreementTerms
export const AgreementTermsComponent = () => (
  <Card className="border border-border shadow-sm rounded-lg">
    <h3 className="text-lg font-semibold text-foreground mb-4">Условия договора счета</h3>
    <p className="text-muted-foreground mb-4">Основные условия договора на открытие счета</p>
  </Card>
);

// ConsultantRequests
export const ConsultantRequestsComponent = () => (
  <Card className="border border-border shadow-sm rounded-lg">
    <h3 className="text-lg font-semibold text-foreground mb-4">История запросов услуг</h3>
    <List
      dataSource={mockConsultantRequests}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={item.subject}
            description={`${new Date(item.date).toLocaleDateString('ru-RU')} • ${item.consultant}`}
          />
        </List.Item>
      )}
    />
  </Card>
);

// GeneratedReports
export const GeneratedReportsComponent = () => (
  <Card className="border border-border shadow-sm rounded-lg">
    <h3 className="text-lg font-semibold text-foreground mb-4">Сформированные отчеты</h3>
    <List
      dataSource={mockReports}
      renderItem={(report) => (
        <List.Item>
          <List.Item.Meta
            title={report.name}
            description={`${new Date(report.createdAt).toLocaleDateString('ru-RU')} • ${report.format.toUpperCase()}`}
          />
          <Button type="text" icon={<DownloadOutlined />} />
        </List.Item>
      )}
    />
  </Card>
);
