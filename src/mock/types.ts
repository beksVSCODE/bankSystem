// Banking Data Types

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    phone: string;
    avatar?: string;
    userType: 'individual' | 'business';
    createdAt: string;
    lastLogin: string;
}

// ГЛАВНАЯ СУЩНОСТЬ - Счёт (финансовый контейнер)
export interface Account {
    id: string;
    userId: string;

    // Финансовые данные (БАЛАНС ТОЛЬКО У СЧЁТА!)
    balance: number;
    currency: 'RUB' | 'USD' | 'EUR';

    // Классификация
    accountType: 'current' | 'savings' | 'deposit' | 'credit';
    accountCategory: 'personal' | 'business' | 'investment';
    accountNumber: string;

    // Описание
    name: string;
    isActive: boolean;

    // Условия (для накопительных/вкладов)
    interestRate?: number;      // процентная ставка
    overdraftLimit?: number;    // лимит овердрафта

    // UI
    color: string;

    // Временные метки
    createdAt: string;
    updatedAt: string;
    closedAt?: string;
}

// Карта - инструмент доступа к счёту (НЕ имеет собственного баланса)
export interface Card {
    id: string;
    accountId: string;          // ПРИВЯЗКА К СЧЁТУ!

    // Данные карты
    cardNumber: string;
    cardType: 'debit' | 'credit' | 'virtual' | 'prepaid';
    paymentSystem: 'MIR' | 'Visa' | 'Mastercard' | 'UnionPay';

    // Статус
    status: 'active' | 'blocked' | 'expired' | 'ordered' | 'closed';
    isPrimary: boolean;         // основная карта счёта

    // Безопасность
    expiryDate: string;         // MM/YY
    cvvHash?: string;
    pinHash?: string;

    // Лимиты на уровне карты
    dailyLimit?: number;
    monthlyLimit?: number;
    onlinePaymentsEnabled: boolean;
    contactlessEnabled: boolean;
    foreignPaymentsEnabled: boolean;

    // Временные метки
    issuedAt: string;
    activatedAt?: string;
    blockedAt?: string;
    blockedReason?: string;
    createdAt: string;
    updatedAt: string;
}

// Транзакция - привязана к счёту (опционально через карту)
export interface Transaction {
    id: string;
    accountId: string;          // К СЧЁТУ, а не к карте!
    cardId?: string;            // через какую карту (если применимо)

    // Финансовые данные
    amount: number;
    currency: 'RUB' | 'USD' | 'EUR';
    type: 'income' | 'expense';
    category: TransactionCategory;

    // Описание
    description: string;
    merchant?: string;
    mccCode?: string;           // код категории торговца
    location?: string;

    // Статус
    status: 'pending' | 'completed' | 'declined' | 'reversed';

    // Временные метки
    date: string;
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
}

export type TransactionCategory =
    | 'salary'
    | 'transfer'
    | 'shopping'
    | 'groceries'
    | 'transport'
    | 'entertainment'
    | 'utilities'
    | 'healthcare'
    | 'restaurants'
    | 'education'
    | 'investments'
    | 'other';

export interface CategoryInfo {
    name: string;
    nameRu: string;
    icon: string;
    color: string;
}

export interface AnalyticsData {
    period: string;
    income: number;
    expense: number;
}

export interface CategoryBreakdown {
    category: TransactionCategory;
    amount: number;
    percentage: number;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    createdAt: string;
}
