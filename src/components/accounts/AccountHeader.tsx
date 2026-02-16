import { Button, Card, Space, Tag, Typography, message } from 'antd';
import {
  CopyOutlined,
  FileTextOutlined,
  SendOutlined,
  BarChartOutlined,
  FolderOpenOutlined,
  SettingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { formatAccountCurrency, maskAccountNumber, type AccountRecord } from '@/mock/accountsFeature';

const { Title, Text } = Typography;

interface AccountHeaderProps {
  account: AccountRecord;
  onQuickAction: (key: 'statement' | 'payments' | 'reports' | 'documents' | 'settings') => void;
}

export const AccountHeader = ({ account, onQuickAction }: AccountHeaderProps) => {
  const requisitesText = account.iban
    ? `IBAN: ${maskAccountNumber(account.iban)}`
    : `р/с: ${maskAccountNumber(account.accountNumber)}`;

  const copyRequisites = async () => {
    await navigator.clipboard.writeText(account.accountNumber);
    message.success('Реквизиты скопированы');
  };

  return (
    <Card className="border-0 shadow-card" bordered={false}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <Title level={3} className="!m-0">{account.name}</Title>
            <Space className="mt-2">
              <Tag color={account.status === 'active' ? 'green' : 'orange'}>
                {account.status === 'active' ? 'Активен' : account.status}
              </Tag>
              <Text type="secondary">Тип: {account.type} • Валюта: {account.currency}</Text>
            </Space>
          </div>
          <div className="text-right">
            <Text type="secondary">Баланс</Text>
            <div className="text-3xl font-semibold">{formatAccountCurrency(account.balance, account.currency)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-4 items-start">
          <Space direction="vertical" size={2}>
            <Text strong>Реквизиты счета</Text>
            <Text type="secondary">{requisitesText}</Text>
            <Button icon={<CopyOutlined />} onClick={copyRequisites} className="w-fit">
              Скопировать реквизиты
            </Button>
          </Space>
          <div className="flex flex-wrap gap-2">
            <Button icon={<PlusOutlined />} onClick={() => message.success('Пополнение запущено (mock)')}>
              Пополнить
            </Button>
            <Button type="primary" icon={<SendOutlined />} onClick={() => onQuickAction('payments')}>
              Перевести
            </Button>
            <Button icon={<SettingOutlined />} onClick={() => onQuickAction('settings')}>
              Настройки
            </Button>
          </div>
        </div>

        <div className="pt-2 border-t border-border/60">
          <Text type="secondary" className="text-xs">Действия по счету</Text>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <Button icon={<FileTextOutlined />} onClick={() => onQuickAction('statement')}>Выписка</Button>
          <Button icon={<SendOutlined />} onClick={() => onQuickAction('payments')}>Платежи и переводы</Button>
          <Button icon={<BarChartOutlined />} onClick={() => onQuickAction('reports')}>Отчеты</Button>
          <Button icon={<FolderOpenOutlined />} onClick={() => onQuickAction('documents')}>Документы</Button>
          <Button icon={<SettingOutlined />} onClick={() => onQuickAction('settings')}>Настройки счета</Button>
        </div>
      </div>
    </Card>
  );
};
