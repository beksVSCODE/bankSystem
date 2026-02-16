import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Breadcrumb, Statistic, Tag, Space, Descriptions, message } from 'antd';
import {
  ArrowLeftOutlined,
  FileTextOutlined,
  SendOutlined,
  BarChartOutlined,
  FolderOutlined,
  SettingOutlined,
  CopyOutlined,
  DollarOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { MainLayout } from '@/components/MainLayout';
import { useSupabaseFinancialStore as useFinancialStore } from '@/mock/supabaseFinancialStore';
import { formatCurrency } from '@/mock/data';
import { accountActions, getSubActionsByParentId, getActionById } from '@/mock/accountActions';
import type { Account } from '@/mock/types';
import {
  StatementDownload,
  PaymentOrder,
  CardToCardTransfer,
  CashFlowReport,
  DocumentsList,
  AccountSettings,
  CardsList,
  InvoiceCreate,
  TransactionCalendar,
} from '@/components/account-actions';

// Компонент для отображения секции с действиями
interface ActionsSectionProps {
  accountId: string;
  category: string;
  onActionClick: (actionId: string) => void;
}

const ActionsSection = ({ accountId, category, onActionClick }: ActionsSectionProps) => {
  // Специальные компоненты для конкретных действий
  const componentMap: Record<string, JSX.Element> = {
    // Выписка
    'statement-download': <StatementDownload accountId={accountId} />,
    'statement-history': <StatementDownload accountId={accountId} />,
    
    // Платежи и переводы
    'transfers-payment-order': <PaymentOrder accountId={accountId} />,
    'transfers-card-to-card': <CardToCardTransfer accountId={accountId} />,
    
    // Выставление счетов
    'invoicing-service': <InvoiceCreate accountId={accountId} />,
    
    // Банковские карты
    'cards-list': <CardsList accountId={accountId} />,
    
    // Отчеты
    'reports-cash-flow': <CashFlowReport accountId={accountId} />,
    'reports-calendar': <TransactionCalendar accountId={accountId} />,
    
    // Документы
    'documents-contracts': <DocumentsList accountId={accountId} />,
    'documents-statements': <DocumentsList accountId={accountId} />,
    
    // Настройки
    'settings-general': <AccountSettings accountId={accountId} />,
    'settings-security': <AccountSettings accountId={accountId} />,
    'settings-limits': <AccountSettings accountId={accountId} />,
    'settings-notifications': <AccountSettings accountId={accountId} />,
  };

  // Если есть готовый компонент для этого действия
  if (componentMap[category]) {
    return componentMap[category];
  }

  // Иначе показываем список подразделов
  const subActions = getSubActionsByParentId(category);

  if (subActions.length === 0) {
    return (
      <Card className="mt-4">
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg mb-2">Раздел в разработке</p>
          <p className="text-sm text-gray-400">
            Функционал "{getActionById(category)?.title}" будет добавлен в ближайшее время
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {subActions.map((action) => (
        <Card
          key={action.id}
          hoverable
          className="cursor-pointer"
          onClick={() => onActionClick(action.id)}
        >
          <h3 className="font-medium text-base mb-2">{action.title}</h3>
          <p className="text-sm text-gray-500">{action.description}</p>
        </Card>
      ))}
    </div>
  );
};

const AccountDetails = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const accounts = useFinancialStore(state => state.accounts);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [breadcrumbPath, setBreadcrumbPath] = useState<string[]>([]);

  const account = useMemo(
    () => accounts.find((acc) => acc.id === accountId),
    [accounts, accountId]
  );

  if (!account) {
    return (
      <MainLayout>
        <div className="p-6">
          <Card>
            <p>Счет не найден</p>
            <Button onClick={() => navigate('/accounts')} className="mt-4">
              Вернуться к счетам
            </Button>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const handleBackClick = () => {
    if (breadcrumbPath.length > 0) {
      // Возврат на предыдущий уровень
      const newPath = [...breadcrumbPath];
      newPath.pop();
      setBreadcrumbPath(newPath);
      
      if (newPath.length === 0) {
        setActiveCategory(null);
      } else {
        setActiveCategory(newPath[newPath.length - 1]);
      }
    } else {
      navigate('/accounts');
    }
  };

  const handleActionClick = (actionId: string) => {
    setActiveCategory(actionId);
    setBreadcrumbPath([...breadcrumbPath, actionId]);
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      // Переход к списку счетов
      navigate('/accounts');
    } else if (index === 0) {
      // Переход к главной странице счета
      setBreadcrumbPath([]);
      setActiveCategory(null);
    } else {
      // Переход к определенному уровню
      const newPath = breadcrumbPath.slice(0, index);
      setBreadcrumbPath(newPath);
      setActiveCategory(newPath[newPath.length - 1]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Скопировано в буфер обмена');
  };

  const getAccountTypeLabel = (type: Account['accountType']) => {
    const labels = {
      current: 'Расчетный счет',
      savings: 'Накопительный счет',
      deposit: 'Депозит',
      credit: 'Кредитный счет',
    };
    return labels[type] || type;
  };

  const getAccountTypeColor = (type: Account['accountType']) => {
    const colors = {
      current: 'blue',
      savings: 'green',
      deposit: 'gold',
      credit: 'red',
    };
    return colors[type] || 'default';
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item>
            <a onClick={() => handleBreadcrumbClick(-1)} className="flex items-center gap-1">
              <HomeOutlined/>
              <span> </span>
              <span> </span>
              <span>Счета</span>
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a onClick={() => handleBreadcrumbClick(0)}>{account.name}</a>
          </Breadcrumb.Item>
          {breadcrumbPath.map((pathItem, index) => {
            const action = accountActions.find(a => a.id === pathItem) || getActionById(pathItem);
            const isLast = index === breadcrumbPath.length - 1;
            
            return action ? (
              <Breadcrumb.Item key={pathItem}>
                {isLast ? (
                  <span>{action.title}</span>
                ) : (
                  <a onClick={() => handleBreadcrumbClick(index + 1)}>{action.title}</a>
                )}
              </Breadcrumb.Item>
            ) : null;
          })}
        </Breadcrumb>

        {/* Кнопка назад */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBackClick}
          className="mb-4"
        >
          Назад
        </Button>

        {/* Основная информация о счете */}
        {!activeCategory && (
          <>
            <Card className="mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <Space direction="vertical" size="small" className="w-full">
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-bold m-0">{account.name}</h1>
                      <Tag color={getAccountTypeColor(account.accountType)}>
                        {getAccountTypeLabel(account.accountType)}
                      </Tag>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Номер счета:</span>
                      <span className="font-mono">{account.accountNumber}</span>
                      <Button
                        type="text"
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() => copyToClipboard(account.accountNumber)}
                      />
                    </div>
                  </Space>
                </div>
                <div>
                  <Statistic
                    title="Баланс"
                    value={account.balance}
                    precision={2}
                    prefix={<DollarOutlined />}
                    suffix={account.currency}
                    valueStyle={{ fontSize: '32px', fontWeight: 'bold' }}
                  />
                </div>
              </div>

              {/* Реквизиты */}
              <Descriptions className="mt-6" column={{ xs: 1, sm: 2, md: 3 }} size="small">
                <Descriptions.Item label="Валюта">{account.currency}</Descriptions.Item>
                <Descriptions.Item label="Категория">
                  {account.accountCategory === 'personal' ? 'Личный' : 'Бизнес'}
                </Descriptions.Item>
                <Descriptions.Item label="Статус">
                  <Tag color={account.isActive ? 'success' : 'default'}>
                    {account.isActive ? 'Активен' : 'Неактивен'}
                  </Tag>
                </Descriptions.Item>
                {account.interestRate && (
                  <Descriptions.Item label="Процентная ставка">
                    {account.interestRate}% годовых
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Дата открытия">
                  {new Date(account.createdAt).toLocaleDateString('ru-RU')}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Действия по счету */}
            <h2 className="text-xl font-semibold mb-4">Действия по счету</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {accountActions.map((action) => {
                const icons = {
                  FileTextOutlined: <FileTextOutlined className="text-3xl" />,
                  SendOutlined: <SendOutlined className="text-3xl" />,
                  BarChartOutlined: <BarChartOutlined className="text-3xl" />,
                  FolderOutlined: <FolderOutlined className="text-3xl" />,
                  SettingOutlined: <SettingOutlined className="text-3xl" />,
                };

                return (
                  <Card
                    key={action.id}
                    hoverable
                    className="cursor-pointer text-center"
                    onClick={() => handleActionClick(action.id)}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-primary">
                        {icons[action.icon as keyof typeof icons]}
                      </div>
                      <h3 className="font-medium text-base m-0">{action.title}</h3>
                      <p className="text-sm text-gray-500 m-0">{action.description}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {/* Отображение выбранной категории */}
        {activeCategory && (
          <>
            <h2 className="text-xl font-semibold mb-2">
              {accountActions.find(a => a.id === activeCategory)?.title}
            </h2>
            <p className="text-gray-500 mb-4">
              {accountActions.find(a => a.id === activeCategory)?.description}
            </p>
            <ActionsSection
              accountId={account.id}
              category={activeCategory}
              onActionClick={handleActionClick}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default AccountDetails;
