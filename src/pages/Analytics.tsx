import { useState, useMemo } from 'react';
import { Card, Segmented, Progress } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { MainLayout } from '@/components/MainLayout';
import { AIReportGenerator } from '@/components/AIReportGenerator';
import {
  getCategoryBreakdown,
  formatCurrency,
  getMonthlyIncome,
  getMonthlyExpense,
} from '@/mock/data';
import { useSupabaseFinancialStore as useFinancialStore } from '@/mock/supabaseFinancialStore';
import type { Transaction } from '@/mock/types';
import dayjs from 'dayjs';

type Period = 'day' | 'month' | 'year';

// Генерация аналитических данных из транзакций Supabase
const generateAnalyticsData = (transactions: Transaction[], period: Period) => {
  const now = dayjs();
  const data: { name: string; income: number; expense: number }[] = [];

  if (period === 'day') {
    // Последние 7 дней
    for (let i = 6; i >= 0; i--) {
      const date = now.subtract(i, 'day');
      const dayTransactions = transactions.filter(tx => 
        dayjs(tx.date).isSame(date, 'day')
      );
      data.push({
        name: date.format('DD.MM'),
        income: dayTransactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0),
        expense: dayTransactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0),
      });
    }
  } else if (period === 'month') {
    // Последние 6 месяцев
    for (let i = 5; i >= 0; i--) {
      const date = now.subtract(i, 'month');
      const monthTransactions = transactions.filter(tx => 
        dayjs(tx.date).isSame(date, 'month') && dayjs(tx.date).isSame(date, 'year')
      );
      data.push({
        name: date.format('MMM'),
        income: monthTransactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0),
        expense: monthTransactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0),
      });
    }
  } else {
    // Последние 5 лет
    for (let i = 4; i >= 0; i--) {
      const date = now.subtract(i, 'year');
      const yearTransactions = transactions.filter(tx => 
        dayjs(tx.date).isSame(date, 'year')
      );
      data.push({
        name: date.format('YYYY'),
        income: yearTransactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0),
        expense: yearTransactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0),
      });
    }
  }

  return data;
};

const Analytics = () => {
  const transactions = useFinancialStore(state => state.transactions);
  const [period, setPeriod] = useState<Period>('month');

  const monthlyIncome = getMonthlyIncome(transactions);
  const monthlyExpense = getMonthlyExpense(transactions);
  const categoryBreakdown = getCategoryBreakdown(transactions);

  // Генерация данных для графиков на основе Supabase транзакций
  const analyticsData = useMemo(() => 
    generateAnalyticsData(transactions, period),
    [transactions, period]
  );

  const totalIncome = analyticsData.reduce((sum, d) => sum + d.income, 0);
  const totalExpense = analyticsData.reduce((sum, d) => sum + d.expense, 0);
  const savings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;

  const periodLabels = {
    day: 'За неделю',
    month: 'За 6 месяцев',
    year: 'За 5 лет',
  };

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Аналитика</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Анализ ваших финансов</p>
          </div>
          <Segmented
            options={[
              { label: 'День', value: 'day' },
              { label: 'Месяц', value: 'month' },
              { label: 'Год', value: 'year' },
            ]}
            value={period}
            onChange={value => setPeriod(value as Period)}
            size="middle"
            className="w-full sm:w-auto"
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="stats-card" bordered={false}>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <ArrowDownOutlined className="text-success text-sm sm:text-base" />
              <span className="text-xs sm:text-sm text-muted-foreground">Доходы</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-foreground">{formatCurrency(totalIncome)}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{periodLabels[period]}</p>
          </Card>

          <Card className="stats-card" bordered={false}>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <ArrowUpOutlined className="text-destructive text-sm sm:text-base" />
              <span className="text-xs sm:text-sm text-muted-foreground">Расходы</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-foreground">{formatCurrency(totalExpense)}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{periodLabels[period]}</p>
          </Card>

          <Card className="stats-card" bordered={false}>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <LineChartOutlined className="text-primary text-sm sm:text-base" />
              <span className="text-xs sm:text-sm text-muted-foreground">Накоплено</span>
            </div>
            <p className={`text-lg sm:text-2xl font-bold ${savings >= 0 ? 'amount-positive' : 'amount-negative'}`}>
              {formatCurrency(savings)}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{periodLabels[period]}</p>
          </Card>

          <Card className="stats-card" bordered={false}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">Норма сбережений</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{savingsRate}%</p>
            <Progress 
              percent={savingsRate} 
              showInfo={false} 
              strokeColor="hsl(var(--primary))"
              trailColor="hsl(var(--muted))"
              size="small"
              className="mt-2"
            />
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income vs Expense Chart */}
          <Card className="border-0 shadow-card" bordered={false}>
            <h3 className="text-lg font-semibold text-foreground mb-4">Доходы и расходы</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
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
                  <Legend />
                  <Bar dataKey="income" name="Доходы" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Расходы" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Trend Chart */}
          <Card className="border-0 shadow-card" bordered={false}>
            <h3 className="text-lg font-semibold text-foreground mb-4">Тренд баланса</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0050B3" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0050B3" stopOpacity={0} />
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
                    formatter={(value: number, name: string) => [
                      formatCurrency(value),
                      name === 'balance' ? 'Баланс' : name
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    name="Баланс"
                    stroke="#0050B3"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorBalance)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <Card className="border-0 shadow-card" bordered={false}>
            <h3 className="text-lg font-semibold text-foreground mb-4">Расходы по категориям</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="amount"
                    nameKey="category"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.info.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Category List */}
          <Card className="border-0 shadow-card" bordered={false}>
            <h3 className="text-lg font-semibold text-foreground mb-4">Детализация расходов</h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {categoryBreakdown.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${item.info.color}15` }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.info.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground">{item.info.nameRu}</span>
                      <span className="font-bold text-foreground">{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        percent={item.percentage}
                        showInfo={false}
                        strokeColor={item.info.color}
                        trailColor="hsl(var(--muted))"
                        size="small"
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* AI Report Section */}
        <AIReportGenerator />
      </div>
    </MainLayout>
  );
};

export default Analytics;
