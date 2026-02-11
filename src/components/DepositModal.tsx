import { useState } from 'react';
import { Form, InputNumber, Select, Button, Card, Steps, Result, Radio, Slider, message } from 'antd';
import { Modal } from '@/components/ui/modal';
import {
  SafetyOutlined,
  PercentageOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { formatCurrency } from '@/mock/data';
import { useSupabaseFinancialStore as useFinancialStore } from '@/mock/supabaseFinancialStore';

interface DepositModalProps {
  open: boolean;
  onClose: () => void;
}

interface DepositProduct {
  id: string;
  name: string;
  rate: number;
  minAmount: number;
  minTerm: number;
  maxTerm: number;
  features: string[];
}

const depositProducts: DepositProduct[] = [
  {
    id: 'standard',
    name: 'Стандартный',
    rate: 12.5,
    minAmount: 10000,
    minTerm: 3,
    maxTerm: 36,
    features: ['Пополнение', 'Капитализация'],
  },
  {
    id: 'premium',
    name: 'Премиум',
    rate: 14.0,
    minAmount: 100000,
    minTerm: 6,
    maxTerm: 24,
    features: ['Повышенная ставка', 'Капитализация'],
  },
  {
    id: 'flexible',
    name: 'Гибкий',
    rate: 10.5,
    minAmount: 5000,
    minTerm: 1,
    maxTerm: 12,
    features: ['Частичное снятие', 'Пополнение', 'Досрочное закрытие'],
  },
];

export const DepositModal = ({ open, onClose }: DepositModalProps) => {
  const accounts = useFinancialStore(state => state.accounts);
  const openDeposit = useFinancialStore(state => state.openDeposit);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<DepositProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [amount, setAmount] = useState(100000);
  const [term, setTerm] = useState(12);

  const handleClose = () => {
    setCurrentStep(0);
    setSelectedProduct(null);
    setAmount(100000);
    setTerm(12);
    form.resetFields();
    onClose();
  };

  const handleOpenDeposit = async () => {
    try {
      await form.validateFields();
      
      if (!selectedProduct) return;
      
      const values = form.getFieldsValue();
      
      setLoading(true);
      
      const success = openDeposit(
        values.fromAccount,
        amount,
        `Вклад "${selectedProduct.name}"`,
        selectedProduct.rate
      );
      
      if (!success) {
        message.error('Недостаточно средств для открытия вклада');
        setLoading(false);
        return;
      }
      
      message.success('Вклад успешно открыт!');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
      setCurrentStep(2);
    } catch {
      // Validation failed
    }
  };

  const calculateIncome = () => {
    if (!selectedProduct) return 0;
    const monthlyRate = selectedProduct.rate / 100 / 12;
    const income = amount * monthlyRate * term;
    return Math.round(income);
  };

  const accountOptions = accounts
    .filter(acc => acc.currency === 'RUB' && acc.type !== 'deposit')
    .map(acc => ({
      value: acc.id,
      label: `${acc.name} • ${formatCurrency(acc.balance)}`,
    }));

  return (
    <Modal
      title="Открыть вклад"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Steps
        current={currentStep}
        size="small"
        className="mb-6"
        items={[
          { title: 'Выбор вклада' },
          { title: 'Условия' },
          { title: 'Готово' },
        ]}
      />

      {currentStep === 0 && (
        <div className="space-y-4">
          {depositProducts.map(product => (
            <Card
              key={product.id}
              size="small"
              className={`cursor-pointer transition-all ${
                selectedProduct?.id === product.id 
                  ? 'border-primary shadow-md' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => {
                setSelectedProduct(product);
                setCurrentStep(1);
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-lg">{product.name}</h4>
                  <div className="flex gap-2 mt-2">
                    {product.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    От {formatCurrency(product.minAmount)} • {product.minTerm}-{product.maxTerm} мес.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{product.rate}%</p>
                  <p className="text-xs text-muted-foreground">годовых</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {currentStep === 1 && selectedProduct && (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            fromAccount: mockAccounts[0]?.id,
          }}
        >
          {/* Selected product info */}
          <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <SafetyOutlined className="text-xl text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">{selectedProduct.name}</h4>
                  <p className="text-sm text-muted-foreground">Вклад</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-primary">{selectedProduct.rate}%</p>
                <p className="text-xs text-muted-foreground">годовых</p>
              </div>
            </div>
          </div>

          {/* Amount slider */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Сумма вклада</span>
              <span className="text-lg font-bold">{formatCurrency(amount)}</span>
            </div>
            <Slider
              min={selectedProduct.minAmount}
              max={5000000}
              step={10000}
              value={amount}
              onChange={setAmount}
              tooltip={{ formatter: (v) => formatCurrency(v || 0) }}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatCurrency(selectedProduct.minAmount)}</span>
              <span>5 000 000 ₽</span>
            </div>
          </div>

          {/* Term slider */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Срок</span>
              <span className="text-lg font-bold">{term} мес.</span>
            </div>
            <Slider
              min={selectedProduct.minTerm}
              max={selectedProduct.maxTerm}
              value={term}
              onChange={setTerm}
              marks={{
                [selectedProduct.minTerm]: `${selectedProduct.minTerm}`,
                [selectedProduct.maxTerm]: `${selectedProduct.maxTerm}`,
              }}
            />
          </div>

          {/* Expected income */}
          <div className="p-4 bg-success/10 rounded-xl mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PercentageOutlined className="text-success" />
                <span className="text-sm">Ожидаемый доход</span>
              </div>
              <span className="text-xl font-bold text-success">
                +{formatCurrency(calculateIncome())}
              </span>
            </div>
          </div>

          <Form.Item
            name="fromAccount"
            label="Списать с счёта"
            rules={[{ required: true, message: 'Выберите счёт' }]}
          >
            <Select options={accountOptions} size="large" />
          </Form.Item>

          <div className="flex gap-3 mt-6">
            <Button onClick={() => setCurrentStep(0)} className="flex-1">
              Назад
            </Button>
            <Button type="primary" onClick={handleOpenDeposit} loading={loading} className="flex-1">
              Открыть вклад
            </Button>
          </div>
        </Form>
      )}

      {currentStep === 2 && (
        <Result
          status="success"
          icon={<CheckCircleOutlined className="text-success" />}
          title="Вклад открыт!"
          subTitle={
            <div className="text-center">
              <p>Сумма: {formatCurrency(amount)}</p>
              <p>Срок: {term} месяцев</p>
              <p className="text-success font-medium mt-2">
                Ожидаемый доход: +{formatCurrency(calculateIncome())}
              </p>
            </div>
          }
          extra={[
            <Button type="primary" key="close" onClick={handleClose}>
              Готово
            </Button>,
            <Button key="another" onClick={() => {
              setCurrentStep(0);
              setSelectedProduct(null);
              form.resetFields();
            }}>
              Открыть ещё
            </Button>,
          ]}
        />
      )}
    </Modal>
  );
};
