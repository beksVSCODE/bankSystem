import { useState, useEffect } from 'react';
import { Form, InputNumber, Select, Button, Card, Spin, message } from 'antd';
import { Modal } from '@/components/ui/modal';
import { SwapOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { formatCurrency } from '@/mock/data';
import { useFinancialStore } from '@/mock/financialStore';

interface ExchangeModalProps {
  open: boolean;
  onClose: () => void;
}

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  change: number;
}

const mockRates: ExchangeRate[] = [
  { from: 'USD', to: 'RUB', rate: 92.45, change: 0.35 },
  { from: 'EUR', to: 'RUB', rate: 100.82, change: -0.18 },
  { from: 'USD', to: 'EUR', rate: 0.92, change: 0.01 },
  { from: 'RUB', to: 'USD', rate: 0.0108, change: -0.0001 },
  { from: 'RUB', to: 'EUR', rate: 0.0099, change: 0.0001 },
  { from: 'EUR', to: 'USD', rate: 1.09, change: -0.01 },
];

export const ExchangeModal = ({ open, onClose }: ExchangeModalProps) => {
  const accounts = useFinancialStore(state => state.accounts);
  const exchangeCurrency = useFinancialStore(state => state.exchangeCurrency);
  
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [fromCurrency, setFromCurrency] = useState<'RUB' | 'USD' | 'EUR'>('RUB');
  const [toCurrency, setToCurrency] = useState<'RUB' | 'USD' | 'EUR'>('USD');
  const [fromAmount, setFromAmount] = useState<number>(0);
  const [toAmount, setToAmount] = useState<number>(0);
  const [success, setSuccess] = useState(false);
  const [form] = Form.useForm();

  const getRate = (from: string, to: string): number => {
    if (from === to) return 1;
    const rate = mockRates.find(r => r.from === from && r.to === to);
    return rate?.rate || 1;
  };

  const currentRate = getRate(fromCurrency, toCurrency);

  useEffect(() => {
    if (fromAmount > 0) {
      setCalculating(true);
      const timer = setTimeout(() => {
        setToAmount(parseFloat((fromAmount * currentRate).toFixed(2)));
        setCalculating(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setToAmount(0);
    }
  }, [fromAmount, currentRate]);

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setFromAmount(toAmount);
  };

  const handleExchange = async () => {
    try {
      await form.validateFields();
      
      const values = form.getFieldsValue();
      if (!values.fromAccount || !values.toAccount || !fromAmount || !toAmount) {
        return;
      }
      
      setLoading(true);
      
      const exchangeSuccess = exchangeCurrency(
        values.fromAccount,
        values.toAccount,
        fromAmount,
        toAmount
      );
      
      if (!exchangeSuccess) {
        message.error('Недостаточно средств для обмена');
        setLoading(false);
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
      setSuccess(true);
    } catch {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFromAmount(0);
    setToAmount(0);
    setSuccess(false);
    form.resetFields();
    onClose();
  };

  const fromAccounts = accounts.filter(acc => acc.currency === fromCurrency);
  const toAccounts = accounts.filter(acc => acc.currency === toCurrency);

  const currencySymbols: Record<string, string> = {
    RUB: '₽',
    USD: '$',
    EUR: '€',
  };

  if (success) {
    return (
      <Modal
        title="Обмен валюты"
        open={open}
        onCancel={handleClose}
        footer={[
          <Button key="close" type="primary" onClick={handleClose}>
            Готово
          </Button>
        ]}
        width={480}
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-success">✓</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Обмен выполнен!</h3>
          <p className="text-muted-foreground">
            {formatCurrency(fromAmount, fromCurrency)} → {formatCurrency(toAmount, toCurrency)}
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="Обмен валюты"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={480}
    >
      {/* Current Rates */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Курсы обмена</h4>
        <div className="flex gap-3">
          {mockRates.slice(0, 3).map((rate, idx) => (
            <Card key={idx} size="small" className="flex-1 text-center">
              <p className="text-xs text-muted-foreground">{rate.from}/{rate.to}</p>
              <p className="font-bold">{rate.rate.toFixed(2)}</p>
              <p className={`text-xs ${rate.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                {rate.change >= 0 ? '+' : ''}{rate.change.toFixed(2)}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Exchange Form */}
      <div className="space-y-4">
        {/* From */}
        <div className="p-4 bg-muted/50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Отдаёте</span>
            <Select
              value={fromCurrency}
              onChange={setFromCurrency}
              options={[
                { value: 'RUB', label: '🇷🇺 RUB' },
                { value: 'USD', label: '🇺🇸 USD' },
                { value: 'EUR', label: '🇪🇺 EUR' },
              ]}
              bordered={false}
              className="w-24"
            />
          </div>
          <InputNumber
            value={fromAmount}
            onChange={v => setFromAmount(v || 0)}
            className="w-full text-2xl"
            size="large"
            placeholder="0"
            controls={false}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            parser={value => value?.replace(/\s/g, '') as unknown as number}
          />
          {fromAccounts.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Доступно: {formatCurrency(fromAccounts[0].balance, fromCurrency)}
            </p>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex items-center justify-center">
          <Button
            shape="circle"
            icon={<SwapOutlined className="rotate-90" />}
            onClick={handleSwapCurrencies}
            className="shadow-md"
          />
          <div className="ml-4 text-sm text-muted-foreground">
            1 {fromCurrency} = {currentRate.toFixed(4)} {toCurrency}
          </div>
        </div>

        {/* To */}
        <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Получаете</span>
            <Select
              value={toCurrency}
              onChange={setToCurrency}
              options={[
                { value: 'RUB', label: '🇷🇺 RUB' },
                { value: 'USD', label: '🇺🇸 USD' },
                { value: 'EUR', label: '🇪🇺 EUR' },
              ]}
              bordered={false}
              className="w-24"
            />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {calculating ? (
              <Spin size="small" />
            ) : (
              `${toAmount.toLocaleString('ru-RU')} ${currencySymbols[toCurrency]}`
            )}
          </div>
        </div>
      </div>

      <Button
        type="primary"
        block
        size="large"
        className="mt-6"
        onClick={handleExchange}
        loading={loading}
        disabled={fromAmount <= 0}
      >
        Обменять
      </Button>

      <p className="text-xs text-center text-muted-foreground mt-4">
        Курс зафиксирован на 30 секунд
      </p>
    </Modal>
  );
};
