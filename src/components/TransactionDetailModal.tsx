import { Modal, Tag, Divider, Button } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { formatCurrency, formatDate, categoryInfo, mockAccounts } from '@/mock/data';
import type { Transaction } from '@/mock/types';
import { message } from 'antd';

interface TransactionDetailModalProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export const TransactionDetailModal = ({ open, onClose, transaction }: TransactionDetailModalProps) => {
  if (!transaction) return null;

  const catInfo = categoryInfo[transaction.category];
  const account = mockAccounts.find(acc => acc.id === transaction.accountId);

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'completed':
        return <CheckCircleOutlined className="text-success" />;
      case 'pending':
        return <ClockCircleOutlined className="text-warning" />;
      case 'failed':
        return <CloseCircleOutlined className="text-destructive" />;
    }
  };

  const getStatusLabel = () => {
    switch (transaction.status) {
      case 'completed':
        return 'Выполнено';
      case 'pending':
        return 'В обработке';
      case 'failed':
        return 'Ошибка';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Скопировано');
  };

  return (
    <Modal
      title="Детали операции"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Закрыть
        </Button>,
        <Button key="repeat" type="primary" disabled={transaction.type === 'income'}>
          Повторить операцию
        </Button>,
      ]}
      width={480}
    >
      <div className="py-4">
        {/* Amount and Status */}
        <div className="text-center mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${catInfo.color}15` }}
          >
            {transaction.type === 'income' ? (
              <ArrowDownOutlined style={{ color: catInfo.color, fontSize: 28 }} />
            ) : (
              <ArrowUpOutlined style={{ color: catInfo.color, fontSize: 28 }} />
            )}
          </div>
          <p className={`text-3xl font-bold ${transaction.amount > 0 ? 'amount-positive' : 'amount-negative'}`}>
            {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
          </p>
          <p className="text-muted-foreground mt-1">{transaction.description}</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            {getStatusIcon()}
            <span className="text-sm">{getStatusLabel()}</span>
          </div>
        </div>

        <Divider />

        {/* Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Дата</span>
            <span className="font-medium">{formatDate(transaction.date)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Категория</span>
            <Tag style={{ backgroundColor: `${catInfo.color}15`, color: catInfo.color, border: 'none' }}>
              {catInfo.nameRu}
            </Tag>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Тип операции</span>
            <span className="font-medium">
              {transaction.type === 'income' ? 'Поступление' : 'Списание'}
            </span>
          </div>

          {transaction.merchant && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Получатель</span>
              <span className="font-medium">{transaction.merchant}</span>
            </div>
          )}

          {account && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Счёт</span>
              <span className="font-medium">{account.name}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">ID операции</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{transaction.id}</span>
              <Button
                type="text"
                size="small"
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(transaction.id)}
              />
            </div>
          </div>
        </div>

        {transaction.status === 'pending' && (
          <div className="mt-6 p-4 bg-warning/10 rounded-lg">
            <p className="text-sm text-warning">
              <ClockCircleOutlined className="mr-2" />
              Операция находится в обработке и будет выполнена в ближайшее время
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
