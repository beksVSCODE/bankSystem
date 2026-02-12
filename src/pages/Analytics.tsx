import { useState, useMemo } from 'react';
import { Card, Segmented, Progress, Statistic, Table, Space } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  LineChartOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  PercentageOutlined,
  CalendarOutlined,
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

  // Дополнительные метрики
  const avgIncome = analyticsData.length > 0 ? totalIncome / analyticsData.length : 0;
  const avgExpense = analyticsData.length > 0 ? totalExpense / analyticsData.length : 0;
  
  // Топ категория расходов
  const topCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null;
  
  // Данные для таблицы расходов по периодам
  const tableData = analyticsData.map((item, idx) => ({
    key: idx,
    period: item.name,
    income: item.income,
    expense: item.expense,
    balance: item.income - item.expense,
  }));

  const periodLabels = {
    day: 'За неделю',
    month: 'За 6 месяцев',
    year: 'За 5 лет',
  };

  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
              <LineChartOutlined /> Финансовая аналитика
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">Подробный анализ ваших доходов и расходов</p>
          </div>
          <Segmented
            options={[
              { label: 'День', value: 'day' },
              { label: 'Месяц', value: 'month' },
              { label: 'Год', value: 'year' },
            ]}
            value={period}
            onChange={value => setPeriod(value as Period)}
            size="large"
            className="w-full sm:w-auto"
          />
        </div>

        {/* Key Metrics - Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Доходы */}
          <Card 
            className="border-0 shadow-card hover:shadow-lg transition-shadow duration-300"
            bordered={false}
            style={{ borderLeft: '4px solid #10B981' }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                  <ArrowDownOutlined className="text-success" />
                  Общие доходы
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  {formatCurrency(totalIncome)}
                </p>
                <p className="text-xs sm:text-sm text-success">
                  Среднее: {formatCurrency(avgIncome)}
                </p>
              </div>
              <div className="text-4xl text-success/20">
                <RiseOutlined />
              </div>
            </div>
          </Card>

          {/* Расходы */}
          <Card 
            className="border-0 shadow-card hover:shadow-lg transition-shadow duration-300"
            bordered={false}
            style={{ borderLeft: '4px solid #EF4444' }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                  <ArrowUpOutlined className="text-destructive" />
                  Общие расходы
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  {formatCurrency(totalExpense)}
                </p>
                <p className="text-xs sm:text-sm text-destructive">
                  Среднее: {formatCurrency(avgExpense)}
                </p>
              </div>
              <div className="text-4xl text-destructive/20">
                <FallOutlined />
              </div>
            </div>
          </Card>

          {/* Баланс */}
          <Card 
            className="border-0 shadow-card hover:shadow-lg transition-shadow duration-300"
            bordered={false}
            style={{ borderLeft: `4px solid ${savings >= 0 ? '#0050B3' : '#EF4444'}` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                  <DollarOutlined className="text-primary" />
                  Накоплено
                </p>
                <p className={`text-2xl sm:text-3xl font-bold mb-2 ${savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(Math.abs(savings))}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {savings >= 0 ? 'Профицит' : 'Дефицит'}
                </p>
              </div>
              <div className="text-4xl text-primary/20">
                <DollarOutlined />
              </div>
            </div>
          </Card>

          {/* Норма сбережений */}
          <Card 
            className="border-0 shadow-card hover:shadow-lg transition-shadow duration-300"
            bordered={false}
            style={{ borderLeft: '4px solid #F59E0B' }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                  <PercentageOutlined className="text-warning" />
                  Коэффициент сбережений
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                  {savingsRate}%
                </p>
                <Progress 
                  percent={savingsRate} 
                  showInfo={false} 
                  strokeColor={savingsRate > 30 ? '#10B981' : savingsRate > 10 ? '#F59E0B' : '#EF4444'}
                  trailColor="hsl(var(--muted))"
                  size="small"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income vs Expense Chart */}
          <Card className="border-0 shadow-card hover:shadow-lg transition-shadow" bordered={false}>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <PercentageOutlined /> Доходы и расходы
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="period" stroke="#9CA3AF" fontSize={13} />
                  <YAxis stroke="#9CA3AF" fontSize={13} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '14px',
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend wrapperStyle={{ fontSize: '14px' }} />
                  <Bar dataKey="income" name="Доходы" fill="#10B981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expense" name="Расходы" fill="#EF4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Trend Chart */}
          <Card className="border-0 shadow-card hover:shadow-lg transition-shadow" bordered={false}>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <LineChartOutlined /> Тренд баланса
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0050B3" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0050B3" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="period" stroke="#9CA3AF" fontSize={13} />
                  <YAxis stroke="#9CA3AF" fontSize={13} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '14px',
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    name="Доход"
                    stroke="#0050B3"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorBalance)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart */}
          <Card className="border-0 shadow-card hover:shadow-lg transition-shadow lg:col-span-1" bordered={false}>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              📊 Расходы по категориям
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
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
                      fontSize: '14px',
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Category List */}
          <Card className="border-0 shadow-card hover:shadow-lg transition-shadow lg:col-span-2" bordered={false}>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              💳 Детализация расходов по категориям
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {categoryBreakdown.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-semibold text-white"
                    style={{ backgroundColor: item.info.color }}
                  >
                    {item.info.nameRu.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground text-base">{item.info.nameRu}</span>
                      <span className="font-bold text-lg text-foreground">{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress
                        percent={item.percentage}
                        showInfo={false}
                        strokeColor={item.info.color}
                        trailColor="hsl(var(--muted))"
                        size="small"
                        className="flex-1"
                      />
                      <span className="text-sm font-medium text-muted-foreground w-12 text-right">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Detailed Statistics Table */}
        <Card className="border-0 shadow-card hover:shadow-lg transition-shadow" bordered={false}>
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <CalendarOutlined /> Статистика по периодам
          </h3>
          <div className="overflow-x-auto">
            <Table
              columns={[
                {
                  title: 'Период',
                  dataIndex: 'period',
                  key: 'period',
                  render: (text) => <span className="font-semibold text-base">{text}</span>,
                },
                {
                  title: 'Доходы',
                  dataIndex: 'income',
                  key: 'income',
                  align: 'right' as const,
                  render: (amount) => <span className="text-green-600 font-bold">{formatCurrency(amount)}</span>,
                },
                {
                  title: 'Расходы',
                  dataIndex: 'expense',
                  key: 'expense',
                  align: 'right' as const,
                  render: (amount) => <span className="text-red-600 font-bold">{formatCurrency(amount)}</span>,
                },
                {
                  title: 'Баланс',
                  dataIndex: 'balance',
                  key: 'balance',
                  align: 'right' as const,
                  render: (amount) => (
                    <span className={`font-bold text-base ${amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(amount)}
                    </span>
                  ),
                },
              ]}
              dataSource={tableData}
              pagination={false}
              size="large"
              bordered={false}
            />
          </div>
        </Card>

        {/* AI Report Section */}
        <AIReportGenerator />
      </div>
    </MainLayout>
  );
};

export default Analytics;
