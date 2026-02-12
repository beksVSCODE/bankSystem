import { supabase } from '@/lib/supabase';
import type { User, Account, Transaction, Notification } from '@/mock/types';

// User Service
export const userService = {
    async getCurrentUser(): Promise<User | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error fetching user:', error);
            return null;
        }

        return {
            id: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            middleName: data.middle_name,
            email: data.email,
            phone: data.phone,
            avatar: data.avatar,
            userType: data.user_type,
            createdAt: data.created_at,
            lastLogin: data.last_login,
        };
    },

    async updateUser(userId: string, updates: Partial<User>): Promise<void> {
        const { error } = await supabase
            .from('users')
            .update({
                first_name: updates.firstName,
                last_name: updates.lastName,
                middle_name: updates.middleName,
                phone: updates.phone,
                avatar: updates.avatar,
            })
            .eq('id', userId);

        if (error) throw error;
    },
};

// Account Service
export const accountService = {
    async getAccounts(userId: string): Promise<Account[]> {
        const { data, error } = await supabase
            .from('accounts')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching accounts:', error);
            return [];
        }

        return data.map(acc => ({
            id: acc.id,
            name: acc.name,
            accountType: acc.account_type,
            currency: acc.currency,
            balance: parseFloat(acc.balance),
            accountNumber: acc.account_number,
            isActive: acc.is_active,
            interestRate: acc.interest_rate,
            termMonths: acc.term_months,
            maturityDate: acc.maturity_date,
            overdraftLimit: acc.overdraft_limit,
        }));
    },

    async createAccount(userId: string, account: Omit<Account, 'id'>): Promise<Account> {
        const { data, error } = await supabase
            .from('accounts')
            .insert({
                user_id: userId,
                name: account.name,
                account_type: account.accountType,
                currency: account.currency,
                balance: account.balance,
                account_number: account.accountNumber,
                is_active: account.isActive,
                interest_rate: account.interestRate,
                term_months: account.termMonths,
                maturity_date: account.maturityDate,
                overdraft_limit: account.overdraftLimit,
            })
            .select()
            .single();

        if (error) throw error;
        return this.mapAccount(data);
    },

    async updateAccount(accountId: string, updates: Partial<Account>): Promise<void> {
        const { error } = await supabase
            .from('accounts')
            .update({
                name: updates.name,
                balance: updates.balance,
                is_active: updates.isActive,
                color: updates.color,
            })
            .eq('id', accountId);

        if (error) throw error;
    },

    async deleteAccount(accountId: string): Promise<void> {
        const { error } = await supabase
            .from('accounts')
            .delete()
            .eq('id', accountId);

        if (error) throw error;
    },

    mapAccount(data: Record<string, unknown>): Account {
        return {
            id: data.id as string,
            name: data.name as string,
            accountType: data.account_type as Account['accountType'],
            currency: data.currency as string,
            balance: parseFloat(data.balance as string),
            accountNumber: data.account_number as string,
            isActive: data.is_active as boolean,
            interestRate: data.interest_rate as number | undefined,
            termMonths: data.term_months as number | undefined,
            maturityDate: data.maturity_date as string | undefined,
            overdraftLimit: data.overdraft_limit as number | undefined,
        };
    },
};

// Transaction Service
export const transactionService = {
    async getTransactions(accountId?: string): Promise<Transaction[]> {
        let query = supabase
            .from('transactions')
            .select('*')
            .order('date', { ascending: false });

        if (accountId) {
            query = query.eq('account_id', accountId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching transactions:', error);
            return [];
        }

        return data.map(tx => ({
            id: tx.id,
            date: tx.date,
            description: tx.description,
            category: tx.category,
            amount: parseFloat(tx.amount),
            type: tx.type,
            accountId: tx.account_id,
            merchant: tx.merchant,
            status: tx.status,
        }));
    },

    async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
        const { data, error } = await supabase
            .from('transactions')
            .insert({
                account_id: transaction.accountId,
                date: transaction.date,
                description: transaction.description,
                category: transaction.category,
                amount: transaction.amount,
                type: transaction.type,
                merchant: transaction.merchant,
                status: transaction.status,
            })
            .select()
            .single();

        if (error) throw error;

        // Update account balance
        const { data: account } = await supabase
            .from('accounts')
            .select('balance')
            .eq('id', transaction.accountId)
            .single();

        if (account) {
            const newBalance = transaction.type === 'income'
                ? parseFloat(account.balance) + transaction.amount
                : parseFloat(account.balance) - transaction.amount;

            await supabase
                .from('accounts')
                .update({ balance: newBalance })
                .eq('id', transaction.accountId);
        }

        return this.mapTransaction(data);
    },

    async updateTransaction(transactionId: string, updates: Partial<Transaction>): Promise<void> {
        const { error } = await supabase
            .from('transactions')
            .update({
                description: updates.description,
                category: updates.category,
                status: updates.status,
            })
            .eq('id', transactionId);

        if (error) throw error;
    },

    async deleteTransaction(transactionId: string): Promise<void> {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', transactionId);

        if (error) throw error;
    },

    mapTransaction(data: Record<string, unknown>): Transaction {
        return {
            id: data.id as string,
            date: data.date as string,
            description: data.description as string,
            category: data.category as Transaction['category'],
            amount: parseFloat(data.amount as string),
            type: data.type as 'income' | 'expense',
            accountId: data.account_id as string,
            cardId: data.card_id as string | undefined,
            merchant: data.merchant as string | undefined,
            status: data.status as 'pending' | 'completed' | 'failed',
            isPinned: data.is_pinned as boolean | undefined,
        };
    },
};

// Notification Service
export const notificationService = {
    async getNotifications(userId: string): Promise<Notification[]> {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }

        return data.map(notif => ({
            id: notif.id,
            title: notif.title,
            message: notif.message,
            type: notif.type,
            read: notif.read,
            createdAt: notif.created_at,
        }));
    },

    async markAsRead(notificationId: string): Promise<void> {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', notificationId);

        if (error) throw error;
    },

    async markAllAsRead(userId: string): Promise<void> {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', userId)
            .eq('read', false);

        if (error) throw error;
    },

    async deleteNotification(notificationId: string): Promise<void> {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', notificationId);

        if (error) throw error;
    },
};
