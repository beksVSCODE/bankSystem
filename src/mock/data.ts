import type {
    User,
    Account,
    Card,
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

// СЧЕТА (главная сущность - финансовый контейнер)
export const mockAccounts: Account[] = [
    {
        id: 'acc-1',
        userId: '1',
        name: 'Основной счёт',
        accountType: 'current',
        accountCategory: 'personal',
        currency: 'RUB',
        balance: 245890.50,
        accountNumber: '40817810500000123456',
        isActive: true,
        color: '#0050B3',
        createdAt: '2022-03-15T10:00:00',
        updatedAt: '2025-02-04T10:30:00',
    },
    {
        id: 'acc-2',
        userId: '1',
        name: 'Накопительный счёт',
        accountType: 'savings',
        accountCategory: 'personal',
        currency: 'RUB',
        balance: 1250000.00,
        accountNumber: '40817810500000654321',
        isActive: true,
        interestRate: 8.5, // 8.5% годовых
        color: '#10B981',
        createdAt: '2023-01-10T14:20:00',
        updatedAt: '2025-02-04T10:30:00',
    },
    {
        id: 'acc-3',
        userId: '1',
        name: 'Долларовый счёт',
        accountType: 'current',
        accountCategory: 'personal',
        currency: 'USD',
        balance: 5420.75,
        accountNumber: '40817840500000789012',
        isActive: true,
        color: '#8B5CF6',
        createdAt: '2023-06-20T09:15:00',
        updatedAt: '2025-02-04T10:30:00',
    },
    {
        id: 'acc-4',
        userId: '1',
        name: 'Счёт для покупок',
        accountType: 'current',
        accountCategory: 'personal',
        currency: 'RUB',
        balance: 34500.00,
        accountNumber: '40817810500000111222',
        isActive: true,
        color: '#F59E0B',
        createdAt: '2023-09-05T11:30:00',
        updatedAt: '2025-02-04T10:30:00',
    },
    {
        id: 'acc-5',
        userId: '1',
        name: 'Евро счёт',
        accountType: 'current',
        accountCategory: 'business',
        currency: 'EUR',
        balance: 3250.00,
        accountNumber: '40817978500000555666',
        isActive: true,
        color: '#14B8A6',
        createdAt: '2024-02-14T16:45:00',
        updatedAt: '2025-02-04T10:30:00',
    },
    {
        id: 'acc-6',
        userId: '1',
        name: 'Вклад "Выгодный"',
        accountType: 'deposit',
        accountCategory: 'investment',
        currency: 'RUB',
        balance: 500000.00,
        accountNumber: '42305810500000333444',
        isActive: true,
        interestRate: 12.0, // 12% годовых
        color: '#EC4899',
        createdAt: '2024-06-01T10:00:00',
        updatedAt: '2025-02-04T10:30:00',
    },
];

// КАРТЫ (инструменты доступа к счетам, БЕЗ собственного баланса)
export const mockCards: Card[] = [
    // Карты для счёта acc-1 (Основной счёт)
    {
        id: 'card-1',
        accountId: 'acc-1',
        cardNumber: '2200 **** **** 1234',
        cardType: 'debit',
        paymentSystem: 'MIR',
        status: 'active',
        isPrimary: true,
        expiryDate: '12/27',
        dailyLimit: 300000,
        monthlyLimit: 500000,
        onlinePaymentsEnabled: true,
        contactlessEnabled: true,
        foreignPaymentsEnabled: false,
        issuedAt: '2022-03-15T10:00:00',
        activatedAt: '2022-03-20T14:30:00',
        createdAt: '2022-03-15T10:00:00',
        updatedAt: '2025-02-04T10:30:00',
    },
    {
        id: 'card-2',
        accountId: 'acc-1',
        cardNumber: '5536 **** **** 9012',
        cardType: 'virtual',
        paymentSystem: 'Mastercard',
        status: 'active',
        isPrimary: false,
        expiryDate: '12/27',
        dailyLimit: 50000,
        monthlyLimit: 100000,
        onlinePaymentsEnabled: true,
        contactlessEnabled: false,
        foreignPaymentsEnabled: true,
        issuedAt: '2024-01-10T12:00:00',
        activatedAt: '2024-01-10T12:05:00',
        createdAt: '2024-01-10T12:00:00',
        updatedAt: '2025-02-04T10:30:00',
    },
    // Карта для счёта acc-4 (Счёт для покупок)
    {
        id: 'card-3',
        accountId: 'acc-4',
        cardNumber: '4276 **** **** 5678',
        cardType: 'debit',
        paymentSystem: 'Visa',
        status: 'active',
        isPrimary: true,
        expiryDate: '08/26',
        dailyLimit: 100000,
        monthlyLimit: 300000,
        onlinePaymentsEnabled: true,
        contactlessEnabled: true,
        foreignPaymentsEnabled: true,
        issuedAt: '2023-09-05T11:30:00',
        activatedAt: '2023-09-10T09:15:00',
        createdAt: '2023-09-05T11:30:00',
        updatedAt: '2025-02-04T10:30:00',
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

// ТРАНЗАКЦИИ (привязаны к счёту, опционально через карту)
export const mockTransactions: Transaction[] = [
    {
        id: 'tx-1',
        accountId: 'acc-1',
        cardId: 'card-1',  // через основную карту
        date: '2025-02-04T10:00:00',
        description: 'Зарплата за январь',
        category: 'salary',
        amount: 185000,
        currency: 'RUB',
        type: 'income',
        status: 'completed',
        createdAt: '2025-02-04T10:00:00',
        updatedAt: '2025-02-04T10:00:00',
        completedAt: '2025-02-04T10:00:00',
    },
    {
        id: 'tx-2',
        accountId: 'acc-1',
        cardId: 'card-1',
        date: '2025-02-03T15:30:00',
        description: 'Перекрёсток',
        category: 'groceries',
        amount: -3450.50,
        currency: 'RUB',
        type: 'expense',
        merchant: 'Перекрёсток',
        mccCode: '5411',
        status: 'completed',
        createdAt: '2025-02-03T15:30:00',
        updatedAt: '2025-02-03T15:30:00',
        completedAt: '2025-02-03T15:30:00',
    },
    {
        id: 'tx-3',
        accountId: 'acc-1',
        cardId: 'card-1',
        date: '2025-02-03T18:45:00',
        description: 'Яндекс.Такси',
        category: 'transport',
        amount: -520,
        currency: 'RUB',
        type: 'expense',
        merchant: 'Яндекс.Такси',
        mccCode: '4121',
        status: 'completed',
        createdAt: '2025-02-03T18:45:00',
        updatedAt: '2025-02-03T18:45:00',
        completedAt: '2025-02-03T18:45:00',
    },
    {
        id: 'tx-4',
        accountId: 'acc-4',
        cardId: 'card-3',  // оплата через другую карту
        date: '2025-02-02T14:20:00',
        description: 'Wildberries',
        category: 'shopping',
        amount: -8900,
        currency: 'RUB',
        type: 'expense',
        merchant: 'Wildberries',
        mccCode: '5311',
        status: 'completed',
        createdAt: '2025-02-02T14:20:00',
        updatedAt: '2025-02-02T14:20:00',
        completedAt: '2025-02-02T14:20:00',
    },
    {
        id: 'tx-5',
        accountId: 'acc-1',
        cardId: 'card-2',  // оплата виртуальной картой
        date: '2025-02-02T12:10:00',
        description: 'Кофемания',
        category: 'restaurants',
        amount: -890,
        currency: 'RUB',
        type: 'expense',
        merchant: 'Кофемания',
        mccCode: '5812',
        status: 'completed',
        createdAt: '2025-02-02T12:10:00',
        updatedAt: '2025-02-02T12:10:00',
        completedAt: '2025-02-02T12:10:00',
    },
    {
        id: 'tx-6',
        accountId: 'acc-1',
        // без cardId - прямое списание со счёта (автоплатёж)
        date: '2025-02-01T08:00:00',
        description: 'ЖКХ за январь',
        category: 'utilities',
        amount: -7850,
        currency: 'RUB',
        type: 'expense',
        status: 'completed',
        createdAt: '2025-02-01T08:00:00',
        updatedAt: '2025-02-01T08:00:00',
        completedAt: '2025-02-01T08:00:00',
    },
    {
        id: 'tx-7',
        accountId: 'acc-1',
        date: '2025-02-01T16:30:00',
        description: 'Перевод от Иванова А.',
        category: 'transfer',
        amount: 15000,
        currency: 'RUB',
        type: 'income',
        status: 'completed',
        createdAt: '2025-02-01T16:30:00',
        updatedAt: '2025-02-01T16:30:00',
        completedAt: '2025-02-01T16:30:00',
    },
    {
        id: 'tx-8',
        accountId: 'acc-1',
        cardId: 'card-2',  // виртуальная карта для подписок
        date: '2025-01-31T20:00:00',
        description: 'Netflix подписка',
        category: 'entertainment',
        amount: -799,
        currency: 'RUB',
        type: 'expense',
        merchant: 'Netflix',
        mccCode: '5815',
        status: 'completed',
        createdAt: '2025-01-31T20:00:00',
        updatedAt: '2025-01-31T20:00:00',
        completedAt: '2025-01-31T20:00:00',
    },
    {
        id: 'tx-9',
        accountId: 'acc-4',
        cardId: 'card-3',
        date: '2025-01-30T11:25:00',
        description: 'OZON',
        category: 'shopping',
        amount: -4560,
        currency: 'RUB',
        type: 'expense',
        merchant: 'OZON',
        mccCode: '5311',
        status: 'completed',
        createdAt: '2025-01-30T11:25:00',
        updatedAt: '2025-01-30T11:25:00',
        completedAt: '2025-01-30T11:25:00',
    },
    {
        id: 'tx-10',
        accountId: 'acc-1',
        date: '2025-01-29T14:00:00',
        description: 'Пополнение вклада',
        category: 'investments',
        amount: -50000,
        currency: 'RUB',
        type: 'expense',
        status: 'completed',
        createdAt: '2025-01-29T14:00:00',
        updatedAt: '2025-01-29T14:00:00',
        completedAt: '2025-01-29T14:00:00',
    },
    {
        id: 'tx-11',
        accountId: 'acc-1',
        cardId: 'card-1',
        date: '2025-01-28T17:40:00',
        description: 'Аптека "Горздрав"',
        category: 'healthcare',
        amount: -1250,
        currency: 'RUB',
        type: 'expense',
        merchant: 'Горздрав',
        mccCode: '5912',
        status: 'completed',
        createdAt: '2025-01-28T17:40:00',
        updatedAt: '2025-01-28T17:40:00',
        completedAt: '2025-01-28T17:40:00',
    },
    {
        id: 'tx-12',
        accountId: 'acc-1',
        cardId: 'card-2',
        date: '2025-01-27T10:15:00',
        description: 'Skillbox курс',
        category: 'education',
        amount: -12900,
        currency: 'RUB',
        type: 'expense',
        merchant: 'Skillbox',
        mccCode: '8299',
        status: 'completed',
        createdAt: '2025-01-27T10:15:00',
        updatedAt: '2025-01-27T10:15:00',
        completedAt: '2025-01-27T10:15:00',
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
            info: categoryInfo[category as TransactionCategory] || categoryInfo.other,
        }))
        .sort((a, b) => b.amount - a.amount);
};

// ============================================
// НОВЫЕ ФУНКЦИИ ДЛЯ РАБОТЫ С КАРТАМИ
// ============================================

// Получить все карты для конкретного счёта
export const getCardsByAccount = (accountId: string, cards: Card[]): Card[] => {
    return cards.filter(card => card.accountId === accountId);
};

// Получить основную карту счёта
export const getPrimaryCard = (accountId: string, cards: Card[]): Card | undefined => {
    return cards.find(card => card.accountId === accountId && card.isPrimary);
};

// Получить счёт по ID карты
export const getAccountByCard = (cardId: string, accounts: Account[], cards: Card[]): Account | undefined => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return undefined;
    return accounts.find(acc => acc.id === card.accountId);
};

// Получить баланс счёта по карте (карта не имеет баланса!)
export const getBalanceByCard = (cardId: string, accounts: Account[], cards: Card[]): number => {
    const account = getAccountByCard(cardId, accounts, cards);
    return account?.balance || 0;
};

// Получить транзакции по конкретной карте
export const getTransactionsByCard = (cardId: string, transactions: Transaction[]): Transaction[] => {
    return transactions.filter(tx => tx.cardId === cardId);
};

// Получить все транзакции счёта (через все карты + прямые списания)
export const getTransactionsByAccount = (accountId: string, transactions: Transaction[]): Transaction[] => {
    return transactions.filter(tx => tx.accountId === accountId);
};

// Подсчёт трат по карте за период
export const getCardSpending = (
    cardId: string,
    transactions: Transaction[],
    period: 'day' | 'month' = 'month'
): number => {
    const now = new Date();
    const cardTransactions = getTransactionsByCard(cardId, transactions);

    return cardTransactions
        .filter(tx => {
            const txDate = new Date(tx.date);
            if (period === 'day') {
                return txDate.toDateString() === now.toDateString() &&
                    tx.type === 'expense' &&
                    tx.status === 'completed';
            } else {
                return txDate.getMonth() === now.getMonth() &&
                    txDate.getFullYear() === now.getFullYear() &&
                    tx.type === 'expense' &&
                    tx.status === 'completed';
            }
        })
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
};

// Проверка лимита карты
export const checkCardLimit = (
    card: Card,
    amount: number,
    transactions: Transaction[]
): { allowed: boolean; reason?: string } => {
    const dailySpending = getCardSpending(card.id, transactions, 'day');
    const monthlySpending = getCardSpending(card.id, transactions, 'month');

    if (card.dailyLimit && dailySpending + amount > card.dailyLimit) {
        return { allowed: false, reason: 'Превышен дневной лимит карты' };
    }

    if (card.monthlyLimit && monthlySpending + amount > card.monthlyLimit) {
        return { allowed: false, reason: 'Превышен месячный лимит карты' };
    }

    return { allowed: true };
};
