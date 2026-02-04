import { useState } from 'react';
import { Modal, Form, Input, Select, Button, Steps, message, InputNumber, Result, Tabs, Card } from 'antd';
import {
  MobileOutlined,
  HomeOutlined,
  ThunderboltOutlined,
  WifiOutlined,
  CarOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { formatCurrency } from '@/mock/data';
import { useFinancialStore } from '@/mock/financialStore';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
}

type PaymentCategory = 'mobile' | 'utilities' | 'internet' | 'transport' | 'other';

interface PaymentTemplate {
  id: string;
  name: string;
  category: PaymentCategory;
  provider: string;
  accountNumber: string;
  amount?: number;
}

const mockTemplates: PaymentTemplate[] = [
  { id: '1', name: 'МТС мобильный', category: 'mobile', provider: 'МТС', accountNumber: '+79991234567' },
  { id: '2', name: 'ЖКХ квартира', category: 'utilities', provider: 'МосЭнергоСбыт', accountNumber: '1234567890' },
  { id: '3', name: 'Домашний интернет', category: 'internet', provider: 'Ростелеком', accountNumber: '9876543210' },
];

const paymentCategories = [
  { key: 'mobile', label: 'Мобильная связь', icon: <MobileOutlined /> },
  { key: 'utilities', label: 'ЖКХ', icon: <HomeOutlined /> },
  { key: 'internet', label: 'Интернет и ТВ', icon: <WifiOutlined /> },
  { key: 'transport', label: 'Транспорт', icon: <CarOutlined /> },
  { key: 'other', label: 'Другое', icon: <CreditCardOutlined /> },
];

const providers: Record<PaymentCategory, string[]> = {
  mobile: ['МТС', 'Билайн', 'Мегафон', 'Теле2', 'Yota'],
  utilities: ['МосЭнергоСбыт', 'Мосводоканал', 'МОЭК', 'Мосгаз'],
  internet: ['Ростелеком', 'МГТС', 'Билайн', 'МТС Домашний'],
  transport: ['Тройка', 'Стрелка', 'РЖД', 'Аэрофлот'],
  other: ['Штрафы ГИБДД', 'Налоги', 'Госпошлины'],
};

export const PaymentModal = ({ open, onClose }: PaymentModalProps) => {
  const accounts = useFinancialStore(state => state.accounts);
  const makePayment = useFinancialStore(state => state.makePayment);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<PaymentCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleClose = () => {
    setCurrentStep(0);
    setSelectedCategory(null);
    form.resetFields();
    onClose();
  };

  const handlePay = async () => {
    try {
      await form.validateFields();
      setLoading(true);
      
      const values = form.getFieldsValue();
      const categoryMap: Record<PaymentCategory, any> = {
        mobile: 'other',
        utilities: 'utilities',
        internet: 'other',
        transport: 'transport',
        other: 'other',
      };
      
      const success = makePayment(
        values.account,
        values.amount,
        `${values.provider} - ${values.accountNumber}`,
        categoryMap[selectedCategory as PaymentCategory],
        values.provider
      );
      
      if (!success) {
        message.error('Недостаточно средств для оплаты');
        setLoading(false);
        return;
      }
      
      message.success('Платёж выполнен успешно!');
      setLoading(false);
      setCurrentStep(2);
    } catch {
      // Validation failed
    }
  };

  const handleTemplateClick = (template: PaymentTemplate) => {
    setSelectedCategory(template.category);
    form.setFieldsValue({
      provider: template.provider,
      accountNumber: template.accountNumber,
      amount: template.amount,
    });
    setCurrentStep(1);
  };

  const accountOptions = accounts
    .filter(acc => acc.currency === 'RUB')
    .map(acc => ({
      value: acc.id,
      label: `${acc.name} • ${formatCurrency(acc.balance)}`,
    }));

  return (
    <Modal
      title="Оплата услуг"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={560}
      destroyOnClose
    >
      {currentStep === 0 && (
        <Tabs
          defaultActiveKey="categories"
          items={[
            {
              key: 'categories',
              label: 'Категории',
              children: (
                <div className="grid grid-cols-2 gap-3">
                  {paymentCategories.map(cat => (
                    <button
                      key={cat.key}
                      onClick={() => {
                        setSelectedCategory(cat.key as PaymentCategory);
                        setCurrentStep(1);
                      }}
                      className="flex flex-col items-center gap-3 p-5 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
                    >
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl">
                        {cat.icon}
                      </div>
                      <span className="font-medium text-foreground text-sm">{cat.label}</span>
                    </button>
                  ))}
                </div>
              ),
            },
            {
              key: 'templates',
              label: (
                <span className="flex items-center gap-2">
                  <HistoryOutlined /> Шаблоны
                </span>
              ),
              children: (
                <div className="space-y-3">
                  {mockTemplates.length > 0 ? (
                    mockTemplates.map(template => (
                      <Card
                        key={template.id}
                        size="small"
                        className="cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => handleTemplateClick(template)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            {paymentCategories.find(c => c.key === template.category)?.icon}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{template.name}</p>
                            <p className="text-sm text-muted-foreground">{template.provider}</p>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      У вас пока нет сохранённых шаблонов
                    </p>
                  )}
                </div>
              ),
            },
          ]}
        />
      )}

      {currentStep === 1 && selectedCategory && (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            fromAccount: mockAccounts[0]?.id,
          }}
        >
          <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {paymentCategories.find(c => c.key === selectedCategory)?.icon}
            </div>
            <span className="font-medium">
              {paymentCategories.find(c => c.key === selectedCategory)?.label}
            </span>
          </div>

          <Form.Item
            name="provider"
            label="Поставщик услуг"
            rules={[{ required: true, message: 'Выберите поставщика' }]}
          >
            <Select
              size="large"
              placeholder="Выберите поставщика"
              options={providers[selectedCategory].map(p => ({ value: p, label: p }))}
            />
          </Form.Item>

          <Form.Item
            name="accountNumber"
            label={selectedCategory === 'mobile' ? 'Номер телефона' : 'Лицевой счёт'}
            rules={[{ required: true, message: 'Введите номер' }]}
          >
            <Input 
              size="large" 
              placeholder={selectedCategory === 'mobile' ? '+7 (999) 123-45-67' : '1234567890'}
            />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Сумма"
            rules={[
              { required: true, message: 'Введите сумму' },
              { type: 'number', min: 1, message: 'Сумма должна быть больше 0' },
            ]}
          >
            <InputNumber
              className="w-full"
              size="large"
              placeholder="0.00"
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
              parser={value => value?.replace(/\s/g, '') as unknown as number}
              suffix="₽"
            />
          </Form.Item>

          <Form.Item
            name="fromAccount"
            label="Счёт списания"
            rules={[{ required: true, message: 'Выберите счёт' }]}
          >
            <Select options={accountOptions} size="large" />
          </Form.Item>

          <Form.Item name="saveTemplate" valuePropName="checked">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4" />
              <span>Сохранить как шаблон</span>
            </label>
          </Form.Item>

          <div className="flex gap-3 mt-6">
            <Button onClick={() => setCurrentStep(0)} className="flex-1">
              Назад
            </Button>
            <Button type="primary" onClick={handlePay} loading={loading} className="flex-1">
              Оплатить
            </Button>
          </div>
        </Form>
      )}

      {currentStep === 2 && (
        <Result
          status="success"
          icon={<CheckCircleOutlined className="text-success" />}
          title="Оплата выполнена!"
          subTitle={`Сумма ${formatCurrency(form.getFieldValue('amount') || 0)} успешно оплачена`}
          extra={[
            <Button type="primary" key="close" onClick={handleClose}>
              Готово
            </Button>,
            <Button key="another" onClick={() => {
              setCurrentStep(0);
              setSelectedCategory(null);
              form.resetFields();
            }}>
              Новый платёж
            </Button>,
          ]}
        />
      )}
    </Modal>
  );
};
