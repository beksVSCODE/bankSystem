import type { User, Account, Transaction, Notification } from '@/mock/types';
import {
    mockUser,
    mockAccounts,
    mockTransactions,
    mockCards,
    mockNotifications,
} from '@/mock/data';

// Simulating async operations with delays
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store for mutations
let accounts = JSON.parse(JSON.stringify(mockAccounts));
let transactions = JSON.parse(JSON.stringify(mockTransactions));
let cards = JSON.parse(JSON.stringify(mockCards));
let currentUser = JSON.parse(JSON.stringify(mockUser));
let notifications = JSON.parse(JSON.stringify(mockNotifications));

// User Service
export const userService = {
    async getCurrentUser(): Promise<User | null> {
        await delay();
        return currentUser;
    },

    async updateUser(userId: string, updates: Partial<User>): Promise<void> {
        await delay();
        currentUser = { ...currentUser, ...updates };
    },
};

// Account Service
export const accountService = {
    async getAccounts(userId: string): Promise<Account[]> {
        await delay();
        return accounts.filter((acc: Account) => acc.userId === userId);
    },

    async createAccount(userId: string, account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
        await delay();
        const newAccount: Account = {
            ...account,
            id: `acc-${Date.now()}`,
            userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        accounts.push(newAccount);
        return newAccount;
    },

    async updateAccount(accountId: string, updates: Partial<Account>): Promise<void> {
        await delay();
        const account = accounts.find((acc: Account) => acc.id === accountId);
        if (account) {
            Object.assign(account, {
                ...updates,
                updatedAt: new Date().toISOString(),
            });
        }
    },

    async deleteAccount(accountId: string): Promise<void> {
        await delay();
        accounts = accounts.filter((acc: Account) => acc.id !== accountId);
    },

    mapAccount(data: Record<string, unknown>): Account {
        return data as Account;
    },
};

// Transaction Service
export const transactionService = {
    async getTransactions(accountId?: string): Promise<Transaction[]> {
        await delay();
        if (accountId) {
            return transactions.filter((tx: Transaction) => tx.accountId === accountId);
        }
        return transactions;
    },

    async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
        await delay();
        const newTransaction: Transaction = {
            ...transaction,
            id: `tx-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        transactions.push(newTransaction);

        // Update account balance
        const account = accounts.find((acc: Account) => acc.id === transaction.accountId);
        if (account) {
            if (transaction.type === 'income') {
                account.balance += transaction.amount;
            } else {
                account.balance -= transaction.amount;
            }
            account.updatedAt = new Date().toISOString();
        }

        return newTransaction;
    },

    async updateTransaction(transactionId: string, updates: Partial<Transaction>): Promise<void> {
        await delay();
        const transaction = transactions.find((tx: Transaction) => tx.id === transactionId);
        if (transaction) {
            Object.assign(transaction, {
                ...updates,
                updatedAt: new Date().toISOString(),
            });
        }
    },

    async deleteTransaction(transactionId: string): Promise<void> {
        await delay();
        transactions = transactions.filter((tx: Transaction) => tx.id !== transactionId);
    },

    mapTransaction(data: Record<string, unknown>): Transaction {
        return data as Transaction;
    },
};

// Card Service
export const cardService = {
    async getCards(accountId?: string): Promise<any[]> {
        await delay();
        if (accountId) {
            return cards.filter((card: any) => card.accountId === accountId);
        }
        return cards;
    },

    async createCard(card: Omit<any, 'id' | 'createdAt'>): Promise<any> {
        await delay();
        const newCard = {
            ...card,
            id: `card-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        cards.push(newCard);
        return newCard;
    },

    async updateCard(cardId: string, updates: Partial<any>): Promise<void> {
        await delay();
        const card = cards.find((c: any) => c.id === cardId);
        if (card) {
            Object.assign(card, updates);
        }
    },

    async deleteCard(cardId: string): Promise<void> {
        await delay();
        cards = cards.filter((c: any) => c.id !== cardId);
    },
};

// Notification Service
export const notificationService = {
    async getNotifications(userId: string): Promise<Notification[]> {
        await delay();
        return notifications.filter((notif: Notification) => notif.userId === userId);
    },

    async markAsRead(notificationId: string): Promise<void> {
        await delay();
        const notification = notifications.find((n: Notification) => n.id === notificationId);
        if (notification) {
            notification.read = true;
        }
    },

    async markAllAsRead(userId: string): Promise<void> {
        await delay();
        notifications
            .filter((n: Notification) => n.userId === userId)
            .forEach((n: Notification) => {
                n.read = true;
            });
    },

    async deleteNotification(notificationId: string): Promise<void> {
        await delay();
        notifications = notifications.filter((n: Notification) => n.id !== notificationId);
    },
};

// Reset function (useful for testing)
export const resetMockData = () => {
    accounts = JSON.parse(JSON.stringify(mockAccounts));
    transactions = JSON.parse(JSON.stringify(mockTransactions));
    cards = JSON.parse(JSON.stringify(mockCards));
    currentUser = JSON.parse(JSON.stringify(mockUser));
    notifications = JSON.parse(JSON.stringify(mockNotifications));
};
