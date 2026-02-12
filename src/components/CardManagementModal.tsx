import { useState } from 'react';
import { Button, message, Tag, Divider } from 'antd';
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
} from '@ant-design/icons';
import { formatCurrency, getCardsByAccount, getPrimaryCard } from '@/mock/data';
import { useSupabaseFinancialStore as useFinancialStore } from '@/mock/supabaseFinancialStore';
import type { Account, Card } from '@/mock/types';

interface CardManagementModalProps {
  open: boolean;
  onClose: () => void;
  account: Account | null;
}

const getAccountTypeColor = (type: Account['accountType']) => {
  switch(type) {
    case 'deposit': return '#EC4899';
    case 'savings': return '#10B981';
    case 'credit': return '#F59E0B';
    default: return '#0050B3';
  }
};

export const CardManagementModal = ({ open, onClose, account }: CardManagementModalProps) => {
  const cards = useFinancialStore(state => state.cards);
  const blockCard = useFinancialStore(state => state.blockCard);
  const unblockCard = useFinancialStore(state => state.unblockCard);
  
  const [showPIN, setShowPIN] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock PIN - in real app this would be fetched securely
  const mockPIN = '1234';

  const handleClose = () => {
    setShowPIN(null);
    onClose();
  };

  const handleBlockCard = async (cardId: string, isBlocked: boolean) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (isBlocked) {
      unblockCard(cardId);
      message.success('Карта разблокирована');
    } else {
      blockCard(cardId, 'Заблокировано пользователем');
      message.success('Карта заблокирована');
    }
    
    setLoading(false);
  };

  const getPaymentSystemColor = (system: Card['paymentSystem']) => {
    switch (system) {
      case 'MIR': return '#4BA72C';
      case 'Visa': return '#1A1F71';
      case 'Mastercard': return '#EB001B';
      case 'UnionPay': return '#E21836';
      default: return '#666';
    }
  };

  const getCardTypeLabel = (type: Card['cardType']) => {
    switch (type) {
      case 'debit': return 'Дебетовая';
      case 'credit': return 'Кредитная';
      case 'virtual': return 'Виртуальная';
      case 'prepaid': return 'Предоплаченная';
      default: return type;
    }
  };

  if (!account) {
    return null;
  }

  const accountCards = getCardsByAccount(account.id, cards);
  const primaryCard = getPrimaryCard(account.id, cards);

  return (
    <Modal
      title={`Управление картами: ${account.name}`}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={600}
    >
      {/* Account Info */}
      <div
        className="p-6 rounded-xl text-white mb-6"
        style={{ background: `linear-gradient(135deg, ${getAccountTypeColor(account.accountType)} 0%, ${getAccountTypeColor(account.accountType)}CC 100%)` }}
      >
        <p className="text-white/70 text-sm mb-1">Баланс счёта</p>
        <p className="text-3xl font-bold mb-2">
          {formatCurrency(account.balance, account.currency)}
        </p>
        <p className="text-sm text-white/80">Счёт: {account.accountNumber}</p>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-foreground">Карты счёта ({accountCards.length})</h4>
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => message.info('Функция выпуска новой карты скоро будет доступна')}
          >
            Выпустить карту
          </Button>
        </div>

        {accountCards.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CreditCardOutlined className="text-4xl mb-2" />
            <p>У этого счёта пока нет карт</p>
            <Button
              type="link"
              icon={<PlusOutlined />}
              onClick={() => message.info('Функция выпуска новой карты скоро будет доступна')}
            >
              Выпустить первую карту
            </Button>
          </div>
        ) : (
          accountCards.map((card) => (
            <div
              key={card.id}
              className="border border-border rounded-lg p-4 space-y-3"
              style={{ borderColor: card.isPrimary ? getAccountTypeColor(account.accountType) : undefined }}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-8 rounded flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: getPaymentSystemColor(card.paymentSystem) }}
                  >
                    {card.paymentSystem}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold">{card.cardNumber}</span>
                      {card.isPrimary && (
                        <Tag color="blue" className="text-xs">Основная</Tag>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Tag className="text-xs">{getCardTypeLabel(card.cardType)}</Tag>
                      <span className="text-xs text-muted-foreground">до {card.expiryDate}</span>
                    </div>
                  </div>
                </div>
                <Tag color={card.status === 'active' ? 'green' : 'red'}>
                  {card.status === 'active' ? 'Активна' : 'Заблокирована'}
                </Tag>
              </div>

              <Divider className="my-3" />

              {/* Card Actions */}
              <div className="space-y-3">
                {/* Block/Unblock */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {card.status === 'blocked' ? (
                      <LockOutlined className="text-destructive" />
                    ) : (
                      <UnlockOutlined className="text-success" />
                    )}
                    <span className="text-sm">Статус</span>
                  </div>
                  <Button
                    onClick={() => handleBlockCard(card.id, card.status === 'blocked')}
                    loading={loading}
                    type={card.status === 'active' ? 'primary' : 'default'}
                    danger={card.status === 'blocked'}
                    size="middle"
                  >
                    {card.status === 'active' ? 'Разблокировать' : 'Заблокировать'}
                  </Button>
                </div>

                {/* Show PIN */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {showPIN === card.id ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    <span className="text-sm">PIN-код</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">
                      {showPIN === card.id ? mockPIN : '••••'}
                    </span>
                    <Button
                      type="text"
                      size="small"
                      icon={showPIN === card.id ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                      onClick={() => setShowPIN(showPIN === card.id ? null : card.id)}
                    />
                  </div>
                </div>

                {/* Limits */}
                {card.dailyLimit && (
                  <div className="p-3 bg-muted/30 rounded-lg mt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <SettingOutlined className="text-xs" />
                      <span className="text-xs font-medium">Лимиты карты</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Дневной лимит</span>
                        <span className="font-medium">
                          {formatCurrency(card.dailyLimit, account.currency)}
                        </span>
                      </div>
                      {card.monthlyLimit && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Месячный лимит</span>
                          <span className="font-medium">
                            {formatCurrency(card.monthlyLimit, account.currency)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Account Details */}
      <Divider />
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <CreditCardOutlined />
          <span className="font-medium">Реквизиты счёта</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Номер счёта</span>
            <span className="font-mono">{account.accountNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">БИК</span>
            <span className="font-mono">044525225</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Тип счёта</span>
            <span className="font-medium">
              {account.accountType === 'current' ? 'Текущий' :
               account.accountType === 'savings' ? 'Накопительный' :
               account.accountType === 'deposit' ? 'Вклад' : 'Кредитный'}
            </span>
          </div>
          {account.interestRate && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Процентная ставка</span>
              <span className="font-medium">{account.interestRate}% годовых</span>
            </div>
          )}
        </div>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 p-4 bg-warning/10 rounded-lg text-warning mt-4">
        <WarningOutlined />
        <p className="text-sm">
          Никогда не сообщайте PIN-код и CVV посторонним лицам
        </p>
      </div>

      <Button onClick={handleClose} block className="mt-4">
        Закрыть
      </Button>
    </Modal>
  );
};
