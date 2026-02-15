import { useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Select, message, Row, Col, Statistic } from 'antd';
import { SwapOutlined } from '@ant-design/icons';

const CurrencyExchange = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [rate, setRate] = useState(1.1);
  const [result, setResult] = useState<number | null>(null);

  const exchangeRates: Record<string, Record<string, number>> = {
    'RUB': { 'USD': 0.011, 'EUR': 0.010 },
    'USD': { 'RUB': 90, 'EUR': 0.92 },
    'EUR': { 'RUB': 100, 'USD': 1.08 },
  };

  const handleExchange = async (values: any) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const convertedAmount = values.amount * rate;
    setResult(convertedAmount);
    message.success('Заявка на обмен создана');
    setIsLoading(false);
  };

  const handleFromCurrencyChange = (from: string) => {
    const to = form.getFieldValue('toCurrency');
    if (to && from !== to) {
      const newRate = exchangeRates[from]?.[to] || 1;
      setRate(newRate);
    }
  };

  const handleToCurrencyChange = (to: string) => {
    const from = form.getFieldValue('fromCurrency');
    if (from && from !== to) {
      const newRate = exchangeRates[from]?.[to] || 1;
      setRate(newRate);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border border-border shadow-sm rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Валютная операция</h3>
        <Form form={form} layout="vertical" onFinish={handleExchange}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="Валюта отправителя" name="fromCurrency" rules={[{ required: true }]}>
                <Select
                  placeholder="RUB, USD, EUR"
                  onChange={handleFromCurrencyChange}
                  options={[
                    { label: 'RUB', value: 'RUB' },
                    { label: 'USD', value: 'USD' },
                    { label: 'EUR', value: 'EUR' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Валюта получателя" name="toCurrency" rules={[{ required: true }]}>
                <Select
                  placeholder="RUB, USD, EUR"
                  onChange={handleToCurrencyChange}
                  options={[
                    { label: 'RUB', value: 'RUB' },
                    { label: 'USD', value: 'USD' },
                    { label: 'EUR', value: 'EUR' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Сумма" name="amount" rules={[{ required: true }]}>
            <InputNumber min={0} />
          </Form.Item>

          <Card className="bg-muted rounded-lg mb-4">
            <Row gutter={16}>
              <Col xs={12} sm={8}>
                <Statistic
                  title="Курс обмена"
                  value={rate}
                  precision={4}
                  prefix={form.getFieldValue('fromCurrency') && form.getFieldValue('toCurrency') ? '1 ' + form.getFieldValue('fromCurrency') + ' = ' : ''}
                  suffix={form.getFieldValue('toCurrency') ? ' ' + form.getFieldValue('toCurrency') : ''}
                />
              </Col>
              {result && (
                <Col xs={12} sm={8}>
                  <Statistic
                    title="К получению"
                    value={result}
                    precision={2}
                    suffix={form.getFieldValue('toCurrency')}
                  />
                </Col>
              )}
            </Row>
          </Card>

          <Button type="primary" htmlType="submit" loading={isLoading} icon={<SwapOutlined />} block>
            Создать заявку на обмен
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default CurrencyExchange;
