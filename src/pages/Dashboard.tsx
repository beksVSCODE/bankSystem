import { useState } from 'react';
import { Card, Button } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  SendOutlined,
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
import { DataManagement } from '@/components/DataManagement';
import {
  mockMonthlyAnalytics,
  formatCurrency,
  formatShortDate,
  getTotalBalance,
  getMonthlyIncome,
  getMonthlyExpense,
  categoryInfo,
} from '@/mock/data';
import { useSupabaseFinancialStore as useFinancialStore } from '@/mock/supabaseFinancialStore';
import { Account } from '@/mock/types';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const accounts = useFinancialStore(state => state.accounts);
  const transactions = useFinancialStore(state => state.transactions);
  
  const totalBalance = getTotalBalance(accounts);
  const monthlyIncome = getMonthlyIncome(transactions);
  const monthlyExpense = getMonthlyExpense(transactions);

  const getAccountTypeColor = (type: Account['accountType']) => {
    switch(type) {
      case 'deposit': return '#EC4899';
      case 'savings': return '#10B981';
      case 'credit': return '#F59E0B';
      default: return '#0050B3';
    }
  };

  // Modal states
  const [transferOpen, setTransferOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [cardManageOpen, setCardManageOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);

  const recentTransactions = transactions.slice(0, 5);

  const quickActions = [
    { icon: SendOutlined, label: 'Перевести', action: () => setTransferOpen(true) },
    { icon: QrcodeOutlined, label: 'Оплатить', action: () => setPaymentOpen(true) },
    { icon: SwapOutlined, label: 'Обмен', action: () => setExchangeOpen(true) },
    { icon: SafetyOutlined, label: 'Вклад', action: () => setDepositOpen(true) },
  ];

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Добро пожаловать!</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Обзор ваших финансов</p>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bank-card text-white relative overflow-hidden group">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 transition-transform duration-500 group-hover:scale-105"></div>
          
          {/* Floating circles decoration */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col gap-6">
            <div>
              <p className="text-white/70 text-xs sm:text-sm mb-1 flex items-center gap-2">
                Общий баланс
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 tracking-tight">
                {formatCurrency(totalBalance)}
              </h2>
              <div className="flex flex-col xs:flex-row gap-4 xs:gap-6">
                <div className="flex items-center gap-2 sm:gap-3 group/income">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 transition-all group-hover/income:bg-white/30 group-hover/income:scale-110">
                    <ArrowDownOutlined className="text-success-foreground text-sm sm:text-base" />
                  </div>
                  <div>
                    <p className="text-white/70 text-xs">Доходы</p>
                    <p className="font-semibold text-sm sm:text-base">{formatCurrency(monthlyIncome)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 group/expense">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 transition-all group-hover/expense:bg-white/30 group-hover/expense:scale-110">
                    <ArrowUpOutlined className="text-destructive-foreground text-sm sm:text-base" />
                  </div>
                  <div>
                    <p className="text-white/70 text-xs">Расходы</p>
                    <p className="font-semibold text-sm sm:text-base">{formatCurrency(monthlyExpense)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-2 sm:flex sm:gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 active:scale-95 transition-all duration-200 border border-white/10 hover:border-white/20"
                >
                  <action.icon className="text-base sm:text-xl transition-transform group-hover:scale-110" />
                  <span className="text-[10px] sm:text-xs leading-tight text-center font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Accounts Grid */}
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Мои счета</h3>
            <Button type="link" onClick={() => navigate('/accounts')} className="p-0 text-xs sm:text-sm">
              Все счета →
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {accounts.slice(0, 3).map((account, index) => (
              <Card
                key={account.id}
                className="stats-card cursor-pointer hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-98 overflow-hidden group"
                onClick={() => navigate('/accounts')}
                bordered={false}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                      style={{ backgroundColor: `${getAccountTypeColor(account.accountType)}15` }}
                    >
                      {account.accountType === 'deposit' ? (
                        <SafetyOutlined style={{ color: getAccountTypeColor(account.accountType), fontSize: window.innerWidth < 640 ? 16 : 20 }} />
                      ) : account.accountType === 'savings' ? (
                        <SafetyOutlined style={{ color: getAccountTypeColor(account.accountType), fontSize: window.innerWidth < 640 ? 16 : 20 }} />
                      ) : (
                        <WalletOutlined style={{ color: getAccountTypeColor(account.accountType), fontSize: window.innerWidth < 640 ? 16 : 20 }} />
                      )}
                    </div>
                    <span className="text-[10px] sm:text-xs text-muted-foreground uppercase font-semibold tracking-wider">{account.currency}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">{account.name}</p>
                  <p className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                    {formatCurrency(account.balance, account.currency)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Chart and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Chart */}
          <Card className="lg:col-span-2 border-0 shadow-card" bordered={false}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Статистика</h3>
              <Button type="link" onClick={() => navigate('/analytics')} className="p-0 text-xs sm:text-sm">
                Подробнее →
              </Button>
            </div>
            <div className="h-48 sm:h-64">
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
          <Card className="border-0 shadow-card hover:shadow-lg transition-shadow duration-300" bordered={false}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Последние операции</h3>
              <Button type="link" onClick={() => navigate('/transactions')} className="p-0 text-xs sm:text-sm">
                Все →
              </Button>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {recentTransactions.map((tx, index) => {
                const catInfo = categoryInfo[tx.category] || categoryInfo.other;
                return (
                  <div
                    key={tx.id}
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl hover:bg-muted/50 active:bg-muted transition-all duration-200 cursor-pointer group"
                    onClick={() => navigate('/transactions')}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${catInfo.color}15` }}
                    >
                      <span style={{ color: catInfo.color }} className="text-sm sm:text-base transition-transform duration-300 group-hover:rotate-12">
                        {tx.type === 'income' ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {tx.description}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        {formatShortDate(tx.date)}
                      </p>
                    </div>
                    <p className={`text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${tx.amount > 0 ? 'amount-positive' : 'amount-negative'}`}>
                      {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Data Management Section */}
        <DataManagement />
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
