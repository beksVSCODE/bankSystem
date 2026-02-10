import type {
    User,
    Account,
    Transaction,
    CategoryInfo,
    AnalyticsData,
    Notification,
    TransactionCategory
} from './types';

// Note: For reactive data, import from financialStore instead
// These are initial/mock data only

// Current User
export const mockUser: User = {
    id: '1',
    firstName: 'Александр',
    lastName: 'Петров',
    middleName: 'Сергеевич',
    email: 'a.petrov@mail.ru',
    phone: '+7 (999) 123-45-67',
    userType: 'individual',
    createdAt: '2022-03-15',
    lastLogin: '2025-02-04T10:30:00',
};

// Accounts
export const mockAccounts: Account[] = [
    {
        id: 'acc-1',
        name: 'Основная карта',
        type: 'card',
        currency: 'RUB',
        balance: 245890.50,
        accountNumber: '40817810500000123456',
        cardNumber: '4276 **** **** 1234',
        expiryDate: '12/27',
        isActive: true,
        color: '#0050B3',
    },
    {
        id: 'acc-2',
        name: 'Накопительный счёт',
        type: 'savings',
        currency: 'RUB',
        balance: 1250000.00,
        accountNumber: '40817810500000654321',
        isActive: true,
        color: '#10B981',
    },
    {
        id: 'acc-3',
        name: 'Долларовый счёт',
        type: 'checking',
        currency: 'USD',
        balance: 5420.75,
        accountNumber: '40817840500000789012',
        isActive: true,
        color: '#8B5CF6',
    },
    {
        id: 'acc-4',
        name: 'Карта для покупок',
        type: 'card',
        currency: 'RUB',
        balance: 34500.00,
        accountNumber: '40817810500000111222',
        cardNumber: '5536 **** **** 5678',
        expiryDate: '08/26',
        isActive: true,
        color: '#F59E0B',
    },
    {
        id: 'acc-5',
        name: 'Евро счёт',
        type: 'checking',
        currency: 'EUR',
        balance: 3250.00,
        accountNumber: '40817978500000555666',
        isActive: true,
        color: '#14B8A6',
    },
    {
        id: 'acc-6',
        name: 'Вклад "Выгодный"',
        type: 'deposit',
        currency: 'RUB',
        balance: 500000.00,
        accountNumber: '42305810500000333444',
        isActive: true,
        color: '#EC4899',
    },
];

// Category mapping
export const categoryInfo: Record<TransactionCategory, CategoryInfo> = {
    salary: { name: 'salary', nameRu: 'Зарплата', icon: 'BankOutlined', color: '#10B981' },
    transfer: { name: 'transfer', nameRu: 'Переводы', icon: 'SwapOutlined', color: '#6366F1' },
    shopping: { name: 'shopping', nameRu: 'Покупки', icon: 'ShoppingOutlined', color: '#F59E0B' },
    groceries: { name: 'groceries', nameRu: 'Продукты', icon: 'ShoppingCartOutlined', color: '#84CC16' },
    transport: { name: 'transport', nameRu: 'Транспорт', icon: 'CarOutlined', color: '#3B82F6' },
    entertainment: { name: 'entertainment', nameRu: 'Развлечения', icon: 'SmileOutlined', color: '#EC4899' },
    utilities: { name: 'utilities', nameRu: 'Коммунальные услуги', icon: 'HomeOutlined', color: '#8B5CF6' },
    healthcare: { name: 'healthcare', nameRu: 'Здоровье', icon: 'MedicineBoxOutlined', color: '#EF4444' },
    restaurants: { name: 'restaurants', nameRu: 'Рестораны', icon: 'CoffeeOutlined', color: '#F97316' },
    education: { name: 'education', nameRu: 'Образование', icon: 'BookOutlined', color: '#0EA5E9' },
    investments: { name: 'investments', nameRu: 'Инвестиции', icon: 'RiseOutlined', color: '#14B8A6' },
    other: { name: 'other', nameRu: 'Прочее', icon: 'EllipsisOutlined', color: '#6B7280' },
};

// Transactions
export const mockTransactions: Transaction[] = [
    {
        id: 'tx-1',
        date: '2025-02-04',
        description: 'Зарплата за январь',
        category: 'salary',
        amount: 185000,
        type: 'income',
        accountId: 'acc-1',
        status: 'completed',
    },
    {
        id: 'tx-2',
        date: '2025-02-03',
        description: 'Перекрёсток',
        category: 'groceries',
        amount: -3450.50,
        type: 'expense',
        accountId: 'acc-1',
        merchant: 'Перекрёсток',
        status: 'completed',
    },
    {
        id: 'tx-3',
        date: '2025-02-03',
        description: 'Яндекс.Такси',
        category: 'transport',
        amount: -520,
        type: 'expense',
        accountId: 'acc-1',
        merchant: 'Яндекс.Такси',
        status: 'completed',
    },
    {
        id: 'tx-4',
        date: '2025-02-02',
        description: 'Wildberries',
        category: 'shopping',
        amount: -8900,
        type: 'expense',
        accountId: 'acc-4',
        merchant: 'Wildberries',
        status: 'completed',
    },
    {
        id: 'tx-5',
        date: '2025-02-02',
        description: 'Кофемания',
        category: 'restaurants',
        amount: -890,
        type: 'expense',
        accountId: 'acc-1',
        merchant: 'Кофемания',
        status: 'completed',
    },
    {
        id: 'tx-6',
        date: '2025-02-01',
        description: 'ЖКХ за январь',
        category: 'utilities',
        amount: -7850,
        type: 'expense',
        accountId: 'acc-1',
        status: 'completed',
    },
    {
        id: 'tx-7',
        date: '2025-02-01',
        description: 'Перевод от Иванова А.',
        category: 'transfer',
        amount: 15000,
        type: 'income',
        accountId: 'acc-1',
        status: 'completed',
    },
    {
        id: 'tx-8',
        date: '2025-01-31',
        description: 'Netflix подписка',
        category: 'entertainment',
        amount: -799,
        type: 'expense',
        accountId: 'acc-1',
        merchant: 'Netflix',
        status: 'completed',
    },
    {
        id: 'tx-9',
        date: '2025-01-30',
        description: 'OZON',
        category: 'shopping',
        amount: -4560,
        type: 'expense',
        accountId: 'acc-4',
        merchant: 'OZON',
        status: 'completed',
    },
    {
        id: 'tx-10',
        date: '2025-01-29',
        description: 'Пополнение вклада',
        category: 'investments',
        amount: -50000,
        type: 'expense',
        accountId: 'acc-1',
        status: 'completed',
    },
    {
        id: 'tx-11',
        date: '2025-01-28',
        description: 'Аптека "Горздрав"',
        category: 'healthcare',
        amount: -1250,
        type: 'expense',
        accountId: 'acc-1',
        merchant: 'Горздрав',
        status: 'completed',
    },
    {
        id: 'tx-12',
        date: '2025-01-27',
        description: 'Skillbox курс',
        category: 'education',
        amount: -12900,
        type: 'expense',
        accountId: 'acc-1',
        merchant: 'Skillbox',
        status: 'completed',
    },
    {
        id: 'tx-13',
        date: '2025-01-26',
        description: 'Яндекс.Маркет',
        category: 'shopping',
        amount: -2340,
        type: 'expense',
        accountId: 'acc-4',
        merchant: 'Яндекс.Маркет',
        status: 'completed',
    },
    {
        id: 'tx-14',
        date: '2025-01-25',
        description: 'Перевод Петрову И.',
        category: 'transfer',
        amount: -5000,
        type: 'expense',
        accountId: 'acc-1',
        status: 'completed',
    },
    {
        id: 'tx-15',
        date: '2025-01-24',
        description: 'Кэшбэк за декабрь',
        category: 'other',
        amount: 3450,
        type: 'income',
        accountId: 'acc-1',
        status: 'completed',
    },
    {
        id: 'tx-16',
        date: '2025-01-23',
        description: 'Пятёрочка',
        category: 'groceries',
        amount: -1890,
        type: 'expense',
        accountId: 'acc-1',
        merchant: 'Пятёрочка',
        status: 'completed',
    },
    {
        id: 'tx-17',
        date: '2025-01-22',
        description: 'Московский метрополитен',
        category: 'transport',
        amount: -2400,
        type: 'expense',
        accountId: 'acc-1',
        merchant: 'Метро Москвы',
        status: 'completed',
    },
    {
        id: 'tx-18',
        date: '2025-01-21',
        description: 'Ожидание перевода',
        category: 'transfer',
        amount: 25000,
        type: 'income',
        accountId: 'acc-1',
        status: 'pending',
    },
];

// Analytics data for charts
export const mockMonthlyAnalytics: AnalyticsData[] = [
    { period: 'Авг', income: 195000, expense: 85000 },
    { period: 'Сен', income: 185000, expense: 92000 },
    { period: 'Окт', income: 210000, expense: 78000 },
    { period: 'Ноя', income: 185000, expense: 105000 },
    { period: 'Дек', income: 245000, expense: 145000 },
    { period: 'Янв', income: 200000, expense: 98000 },
];

export const mockDailyAnalytics: AnalyticsData[] = [
    { period: '29 Янв', income: 0, expense: 3500 },
    { period: '30 Янв', income: 0, expense: 4560 },
    { period: '31 Янв', income: 0, expense: 799 },
    { period: '1 Фев', income: 15000, expense: 7850 },
    { period: '2 Фев', income: 0, expense: 9790 },
    { period: '3 Фев', income: 0, expense: 3970 },
    { period: '4 Фев', income: 185000, expense: 0 },
];

export const mockYearlyAnalytics: AnalyticsData[] = [
    { period: '2020', income: 1800000, expense: 1200000 },
    { period: '2021', income: 2100000, expense: 1450000 },
    { period: '2022', income: 2400000, expense: 1680000 },
    { period: '2023', income: 2750000, expense: 1950000 },
    { period: '2024', income: 3100000, expense: 2200000 },
];

// Notifications
export const mockNotifications: Notification[] = [
    {
        id: 'notif-1',
        title: 'Зачисление средств',
        message: 'На ваш счёт поступило 185 000 ₽',
        type: 'success',
        read: false,
        createdAt: '2025-02-04T10:00:00',
    },
    {
        id: 'notif-2',
        title: 'Успешная оплата',
        message: 'Покупка в Перекрёсток на сумму 3 450,50 ₽',
        type: 'info',
        read: false,
        createdAt: '2025-02-03T15:30:00',
    },
    {
        id: 'notif-3',
        title: 'Безопасность',
        message: 'Обнаружен вход с нового устройства',
        type: 'warning',
        read: true,
        createdAt: '2025-02-01T09:15:00',
    },
];

// Helper functions
export const formatCurrency = (amount: number, currency: 'RUB' | 'USD' | 'EUR' = 'RUB'): string => {
    const formatter = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return formatter.format(amount);
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

export const formatShortDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
    });
};

// Helper functions that work with dynamic data
export const getTotalBalance = (accounts: Account[]): number => {
    return accounts
        .filter(acc => acc.currency === 'RUB')
        .reduce((sum, acc) => sum + acc.balance, 0);
};

export const getMonthlyIncome = (transactions: Transaction[]): number => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return transactions
        .filter(tx => {
            const txDate = new Date(tx.date);
            return tx.type === 'income' &&
                tx.status === 'completed' &&
                txDate.getMonth() === currentMonth &&
                txDate.getFullYear() === currentYear;
        })
        .reduce((sum, tx) => sum + tx.amount, 0);
};

export const getMonthlyExpense = (transactions: Transaction[]): number => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return transactions
        .filter(tx => {
            const txDate = new Date(tx.date);
            return tx.type === 'expense' &&
                tx.status === 'completed' &&
                txDate.getMonth() === currentMonth &&
                txDate.getFullYear() === currentYear;
        })
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
};

export const getCategoryBreakdown = (transactions: Transaction[]) => {
    const expenses = transactions.filter(tx => tx.type === 'expense' && tx.status === 'completed');
    const total = expenses.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    if (total === 0) return [];

    const breakdown: Record<string, number> = {};
    expenses.forEach(tx => {
        if (!breakdown[tx.category]) {
            breakdown[tx.category] = 0;
        }
        breakdown[tx.category] += Math.abs(tx.amount);
    });

    return Object.entries(breakdown)
        .map(([category, amount]) => ({
            category: category as TransactionCategory,
            amount,
            percentage: Math.round((amount / total) * 100),
            info: categoryInfo[category as TransactionCategory],
        }))
        .sort((a, b) => b.amount - a.amount);
};
