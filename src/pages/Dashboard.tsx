import { useState } from 'react';
import { Card, Button } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  SendOutlined,
  PlusOutlined,
  QrcodeOutlined,
  WalletOutlined,
  CreditCardOutlined,
  SwapOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MainLayout } from '@/components/MainLayout';
import { TransferModal } from '@/components/TransferModal';
import { PaymentModal } from '@/components/PaymentModal';
import { ExchangeModal } from '@/components/ExchangeModal';
import { CardManagementModal } from '@/components/CardManagementModal';
import { DepositModal } from '@/components/DepositModal';
import {
  mockAccounts,
  mockTransactions,
  mockMonthlyAnalytics,
  formatCurrency,
  formatShortDate,
  getTotalBalance,
  getMonthlyIncome,
  getMonthlyExpense,
  categoryInfo,
} from '@/mock/data';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const totalBalance = getTotalBalance();
  const monthlyIncome = getMonthlyIncome();
  const monthlyExpense = getMonthlyExpense();

  // Modal states
  const [transferOpen, setTransferOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [cardManageOpen, setCardManageOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);

  const recentTransactions = mockTransactions.slice(0, 5);

  const quickActions = [
    { icon: SendOutlined, label: 'Перевести', action: () => setTransferOpen(true) },
    { icon: QrcodeOutlined, label: 'Оплатить', action: () => setPaymentOpen(true) },
    { icon: SwapOutlined, label: 'Обмен', action: () => setExchangeOpen(true) },
    { icon: SafetyOutlined, label: 'Вклад', action: () => setDepositOpen(true) },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Добро пожаловать!</h1>
            <p className="text-muted-foreground">Обзор ваших финансов</p>
          </div>
          <div className="flex gap-2">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCardManageOpen(true)}>
              Новая карта
            </Button>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bank-card text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-white/70 text-sm mb-1">Общий баланс</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {formatCurrency(totalBalance)}
              </h2>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <ArrowDownOutlined className="text-success-foreground" />
                  </div>
                  <div>
                    <p className="text-white/70 text-xs">Доходы</p>
                    <p className="font-semibold">{formatCurrency(monthlyIncome)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <ArrowUpOutlined className="text-destructive-foreground" />
                  </div>
                  <div>
                    <p className="text-white/70 text-xs">Расходы</p>
                    <p className="font-semibold">{formatCurrency(monthlyExpense)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors min-w-[70px]"
                >
                  <action.icon className="text-xl" />
                  <span className="text-xs">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Accounts Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Мои счета</h3>
            <Button type="link" onClick={() => navigate('/accounts')} className="p-0">
              Все счета →
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockAccounts.slice(0, 3).map(account => (
              <Card
                key={account.id}
                className="stats-card cursor-pointer hover:border-primary/30"
                onClick={() => navigate('/accounts')}
                bordered={false}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${account.color}15` }}
                  >
                    {account.type === 'card' ? (
                      <CreditCardOutlined style={{ color: account.color, fontSize: 20 }} />
                    ) : (
                      <WalletOutlined style={{ color: account.color, fontSize: 20 }} />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground uppercase">{account.currency}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{account.name}</p>
                <p className="text-xl font-bold text-foreground">
                  {formatCurrency(account.balance, account.currency)}
                </p>
                {account.cardNumber && (
                  <p className="text-xs text-muted-foreground mt-2">{account.cardNumber}</p>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Chart and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <Card className="lg:col-span-2 border-0 shadow-card" bordered={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Статистика</h3>
              <Button type="link" onClick={() => navigate('/analytics')} className="p-0">
                Подробнее →
              </Button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockMonthlyAnalytics}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="period" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    name="Доходы"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    name="Расходы"
                    stroke="#EF4444"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorExpense)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Recent Transactions */}
          <Card className="border-0 shadow-card" bordered={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Последние операции</h3>
              <Button type="link" onClick={() => navigate('/transactions')} className="p-0">
                Все →
              </Button>
            </div>
            <div className="space-y-3">
              {recentTransactions.map(tx => {
                const catInfo = categoryInfo[tx.category];
                return (
                  <div
                    key={tx.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate('/transactions')}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${catInfo.color}15` }}
                    >
                      <span style={{ color: catInfo.color }}>
                        {tx.type === 'income' ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {tx.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatShortDate(tx.date)}
                      </p>
                    </div>
                    <p className={`text-sm font-semibold ${tx.amount > 0 ? 'amount-positive' : 'amount-negative'}`}>
                      {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <TransferModal open={transferOpen} onClose={() => setTransferOpen(false)} />
      <PaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} />
      <ExchangeModal open={exchangeOpen} onClose={() => setExchangeOpen(false)} />
      <CardManagementModal 
        open={cardManageOpen} 
        onClose={() => setCardManageOpen(false)} 
        account={null}
      />
      <DepositModal open={depositOpen} onClose={() => setDepositOpen(false)} />
    </MainLayout>
  );
};

export default Dashboard;
