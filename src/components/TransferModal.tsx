import { useState } from 'react';
import { Form, Input, Select, Button, Steps, message, InputNumber, Result } from 'antd';
import { Modal } from '@/components/ui/modal';
import { SwapOutlined, UserOutlined, BankOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { formatCurrency } from '@/mock/data';
import { useSupabaseFinancialStore as useFinancialStore } from '@/mock/supabaseFinancialStore';
import type { Account } from '@/mock/types';

interface TransferModalProps {
  open: boolean;
  onClose: () => void;
  preselectedAccount?: Account;
}

type TransferType = 'between' | 'other' | 'phone';

export const TransferModal = ({ open, onClose, preselectedAccount }: TransferModalProps) => {
  const accounts = useFinancialStore(state => state.accounts);
  const transferBetweenAccounts = useFinancialStore(state => state.transferBetweenAccounts);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [transferType, setTransferType] = useState<TransferType>('between');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleClose = () => {
    setCurrentStep(0);
    form.resetFields();
    onClose();
  };

  const handleNext = async () => {
    try {
      await form.validateFields();
      if (currentStep === 1) {
        setLoading(true);
        
        // Perform actual transfer for "between" type
        if (transferType === 'between') {
          const values = form.getFieldsValue();
          const success = transferBetweenAccounts(
            values.fromAccount,
            values.toAccount,
            values.amount,
            values.description || 'Перевод между счетами'
          );
          
          if (!success) {
            message.error('Недостаточно средств для перевода');
            setLoading(false);
            return;
          }
          
          message.success('Перевод выполнен успешно!');
        } else {
          // Simulate transfer for other types (not implemented with real accounts)
          await new Promise(resolve => setTimeout(resolve, 1500));
          message.success('Перевод выполнен успешно!');
        }
        
        setLoading(false);
        setCurrentStep(2);
      } else {
        setCurrentStep(currentStep + 1);
      }
    } catch {
      // Validation failed
    }
  };

  const transferTypes = [
    { value: 'between', label: 'Между своими счетами', icon: <SwapOutlined /> },
    { value: 'other', label: 'Другому клиенту', icon: <UserOutlined /> },
    { value: 'phone', label: 'По номеру телефона', icon: <BankOutlined /> },
  ];

  const accountOptions = accounts.map(acc => ({
    value: acc.id,
    label: (
      <div className="flex justify-between items-center">
        <span>{acc.name}</span>
        <span className="text-muted-foreground">{formatCurrency(acc.balance, acc.currency)}</span>
      </div>
    ),
  }));

  return (
    <Modal
      title="Перевод средств"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={520}
      destroyOnClose
    >
      <Steps
        current={currentStep}
        size="small"
        className="mb-6"
        items={[
          { title: 'Тип перевода' },
          { title: 'Детали' },
          { title: 'Готово' },
        ]}
      />

      {currentStep === 0 && (
        <div className="space-y-3">
          {transferTypes.map(type => (
            <button
              key={type.value}
              onClick={() => {
                setTransferType(type.value as TransferType);
                setCurrentStep(1);
              }}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all
                ${transferType === type.value 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl">
                {type.icon}
              </div>
              <span className="font-medium text-foreground">{type.label}</span>
            </button>
          ))}
        </div>
      )}

      {currentStep === 1 && (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            fromAccount: preselectedAccount?.id || accounts[0]?.id,
          }}
        >
          <Form.Item
            name="fromAccount"
            label="Счёт списания"
            rules={[{ required: true, message: 'Выберите счёт' }]}
          >
            <Select options={accountOptions} size="large" />
          </Form.Item>

          {transferType === 'between' && (
            <Form.Item
              name="toAccount"
              label="Счёт зачисления"
              rules={[{ required: true, message: 'Выберите счёт' }]}
            >
              <Select options={accountOptions} size="large" />
            </Form.Item>
          )}

          {transferType === 'other' && (
            <>
              <Form.Item
                name="cardNumber"
                label="Номер карты получателя"
                rules={[
                  { required: true, message: 'Введите номер карты' },
                  { pattern: /^\d{16}$/, message: 'Номер карты должен содержать 16 цифр' },
                ]}
              >
                <Input 
                  placeholder="0000 0000 0000 0000" 
                  size="large"
                  maxLength={16}
                />
              </Form.Item>
              <Form.Item
                name="recipientName"
                label="ФИО получателя"
                rules={[{ required: true, message: 'Введите ФИО получателя' }]}
              >
                <Input placeholder="Иванов Иван Иванович" size="large" />
              </Form.Item>
            </>
          )}

          {transferType === 'phone' && (
            <Form.Item
              name="phone"
              label="Номер телефона"
              rules={[
                { required: true, message: 'Введите номер телефона' },
              ]}
            >
              <Input 
                placeholder="+7 (999) 123-45-67" 
                size="large"
                prefix="+7"
              />
            </Form.Item>
          )}

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
            name="message"
            label="Сообщение получателю (необязательно)"
          >
            <Input.TextArea placeholder="Комментарий к переводу" rows={2} />
          </Form.Item>

          <div className="flex gap-3 mt-6">
            <Button onClick={() => setCurrentStep(0)} className="flex-1">
              Назад
            </Button>
            <Button type="primary" onClick={handleNext} loading={loading} className="flex-1">
              Перевести
            </Button>
          </div>
        </Form>
      )}

      {currentStep === 2 && (
        <Result
          status="success"
          icon={<CheckCircleOutlined className="text-success" />}
          title="Перевод выполнен!"
          subTitle={`Сумма ${formatCurrency(form.getFieldValue('amount') || 0)} успешно переведена`}
          extra={[
            <Button type="primary" key="close" onClick={handleClose}>
              Готово
            </Button>,
            <Button key="another" onClick={() => {
              setCurrentStep(0);
              form.resetFields();
            }}>
              Новый перевод
            </Button>,
          ]}
        />
      )}
    </Modal>
  );
};
