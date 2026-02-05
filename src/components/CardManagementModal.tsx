import { useState } from 'react';
import { Button, message, Divider, Tag, Switch, Card, Form, Input, Steps, Result } from 'antd';
import { Modal } from '@/components/ui/modal';
import {
  LockOutlined,
  UnlockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CreditCardOutlined,
  SettingOutlined,
  WarningOutlined,
  PlusOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { formatCurrency } from '@/mock/data';
import type { Account } from '@/mock/types';

interface CardManagementModalProps {
  open: boolean;
  onClose: () => void;
  account: Account | null;
}

type CardAction = 'details' | 'block' | 'limits' | 'pin' | 'order';

export const CardManagementModal = ({ open, onClose, account }: CardManagementModalProps) => {
  const [showPIN, setShowPIN] = useState(false);
  const [action, setAction] = useState<CardAction | null>(null);
  const [loading, setLoading] = useState(false);
  const [cardBlocked, setCardBlocked] = useState(false);
  const [orderStep, setOrderStep] = useState(0);
  const [form] = Form.useForm();

  // Mock PIN - in real app this would be fetched securely
  const mockPIN = '1234';

  const handleClose = () => {
    setAction(null);
    setShowPIN(false);
    setOrderStep(0);
    form.resetFields();
    onClose();
  };

  const handleBlockCard = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCardBlocked(!cardBlocked);
    setLoading(false);
    message.success(cardBlocked ? 'Карта разблокирована' : 'Карта заблокирована');
    setAction(null);
  };

  const handleOrderCard = async () => {
    try {
      await form.validateFields();
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoading(false);
      setOrderStep(2);
    } catch {
      // Validation failed
    }
  };

  const actions = [
    { key: 'details', label: 'Реквизиты карты', icon: <CreditCardOutlined /> },
    { key: 'block', label: cardBlocked ? 'Разблокировать' : 'Заблокировать', icon: cardBlocked ? <UnlockOutlined /> : <LockOutlined /> },
    { key: 'limits', label: 'Лимиты', icon: <SettingOutlined /> },
    { key: 'pin', label: 'Показать PIN', icon: <EyeOutlined /> },
    { key: 'order', label: 'Заказать карту', icon: <PlusOutlined /> },
  ];

  if (!account && action !== 'order') {
    return (
      <Modal
        title="Управление картами"
        open={open}
        onCancel={handleClose}
        footer={null}
        width={480}
      >
        <div className="grid grid-cols-2 gap-3">
          {actions.map(a => (
            <button
              key={a.key}
              onClick={() => setAction(a.key as CardAction)}
              className="flex flex-col items-center gap-3 p-5 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl">
                {a.icon}
              </div>
              <span className="font-medium text-foreground text-sm text-center">{a.label}</span>
            </button>
          ))}
        </div>
      </Modal>
    );
  }

  // Order new card flow
  if (action === 'order') {
    return (
      <Modal
        title="Заказать новую карту"
        open={open}
        onCancel={handleClose}
        footer={null}
        width={520}
      >
        <Steps
          current={orderStep}
          size="small"
          className="mb-6"
          items={[
            { title: 'Тип карты' },
            { title: 'Доставка' },
            { title: 'Готово' },
          ]}
        />

        {orderStep === 0 && (
          <div className="space-y-3">
            {[
              { type: 'debit', name: 'Дебетовая карта', desc: 'Для повседневных расходов', color: 'blue' },
              { type: 'credit', name: 'Кредитная карта', desc: 'Кредитный лимит до 500 000 ₽', color: 'purple' },
              { type: 'premium', name: 'Премиум карта', desc: 'Повышенный кэшбэк и привилегии', color: 'gold' },
            ].map(card => (
              <Card
                key={card.type}
                size="small"
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setOrderStep(1)}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ 
                      background: card.color === 'blue' ? 'linear-gradient(135deg, #0050B3, #003A82)' :
                                 card.color === 'purple' ? 'linear-gradient(135deg, #7C3AED, #5B21B6)' :
                                 'linear-gradient(135deg, #F59E0B, #D97706)'
                    }}
                  >
                    <CreditCardOutlined />
                  </div>
                  <div>
                    <p className="font-medium">{card.name}</p>
                    <p className="text-sm text-muted-foreground">{card.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
            <Button onClick={() => setAction(null)} block className="mt-4">
              Назад
            </Button>
          </div>
        )}

        {orderStep === 1 && (
          <Form form={form} layout="vertical">
            <Form.Item
              name="address"
              label="Адрес доставки"
              rules={[{ required: true, message: 'Введите адрес' }]}
            >
              <Input.TextArea placeholder="г. Москва, ул. Примерная, д. 1, кв. 1" rows={2} />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Контактный телефон"
              rules={[{ required: true, message: 'Введите телефон' }]}
              initialValue="+7 (999) 123-45-67"
            >
              <Input placeholder="+7 (999) 123-45-67" />
            </Form.Item>

            <div className="p-4 bg-muted/50 rounded-lg mb-4">
              <p className="text-sm text-muted-foreground">Срок доставки: 3-5 рабочих дней</p>
              <p className="text-sm text-muted-foreground">Стоимость: бесплатно</p>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setOrderStep(0)} className="flex-1">
                Назад
              </Button>
              <Button type="primary" onClick={handleOrderCard} loading={loading} className="flex-1">
                Заказать
              </Button>
            </div>
          </Form>
        )}

        {orderStep === 2 && (
          <Result
            status="success"
            icon={<CheckCircleOutlined className="text-success" />}
            title="Заявка принята!"
            subTitle="Карта будет доставлена в течение 3-5 рабочих дней"
            extra={[
              <Button type="primary" key="close" onClick={handleClose}>
                Готово
              </Button>,
            ]}
          />
        )}
      </Modal>
    );
  }

  return (
    <Modal
      title={`Управление картой: ${account?.name}`}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={480}
    >
      {/* Card Preview */}
      <div
        className="p-6 rounded-xl text-white mb-6"
        style={{ background: `linear-gradient(135deg, ${account?.color} 0%, ${account?.color}CC 100%)` }}
      >
        <p className="text-white/70 text-sm mb-1">{account?.name}</p>
        <p className="text-2xl font-bold mb-4">
          {formatCurrency(account?.balance || 0, account?.currency)}
        </p>
        <p className="text-lg tracking-wider">{account?.cardNumber}</p>
        {account?.expiryDate && (
          <p className="text-sm text-white/70 mt-2">Действует до: {account.expiryDate}</p>
        )}
        {cardBlocked && (
          <Tag color="red" className="mt-2">Заблокирована</Tag>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {/* Block/Unblock */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            {cardBlocked ? <LockOutlined className="text-destructive" /> : <UnlockOutlined className="text-success" />}
            <span>Статус карты</span>
          </div>
          <Switch
            checked={!cardBlocked}
            onChange={() => handleBlockCard()}
            loading={loading}
            checkedChildren="Активна"
            unCheckedChildren="Заблокирована"
          />
        </div>

        {/* Show PIN */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            {showPIN ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            <span>PIN-код</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg">
              {showPIN ? mockPIN : '••••'}
            </span>
            <Button
              type="text"
              size="small"
              icon={showPIN ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => setShowPIN(!showPIN)}
            />
          </div>
        </div>

        {/* Limits */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <SettingOutlined />
            <span className="font-medium">Лимиты</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Снятие наличных в день</span>
              <span className="font-medium">300 000 ₽</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Переводы в день</span>
              <span className="font-medium">500 000 ₽</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Покупки в день</span>
              <span className="font-medium">Без ограничений</span>
            </div>
          </div>
          <Button type="link" className="p-0 mt-2">
            Изменить лимиты
          </Button>
        </div>

        {/* Card Details */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <CreditCardOutlined />
            <span className="font-medium">Реквизиты</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Номер счёта</span>
              <span className="font-mono">{account?.accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">БИК</span>
              <span className="font-mono">044525225</span>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-3 p-4 bg-warning/10 rounded-lg text-warning">
          <WarningOutlined />
          <p className="text-sm">
            Никогда не сообщайте PIN-код и CVV посторонним лицам
          </p>
        </div>
      </div>

      <Button onClick={handleClose} block className="mt-4">
        Закрыть
      </Button>
    </Modal>
  );
};
