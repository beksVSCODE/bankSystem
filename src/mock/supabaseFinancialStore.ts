import { create } from 'zustand';
import type { Account, Transaction } from './types';
import { supabase } from '@/lib/supabase';

interface SupabaseFinancialState {
    accounts: Account[];
    transactions: Transaction[];
    isLoading: boolean;
    error: string | null;

    // Data loading
    loadAccounts: () => Promise<void>;
    loadTransactions: () => Promise<void>;
    loadAll: () => Promise<void>;

    // Account operations
    getAccount: (id: string) => Account | undefined;
    updateAccountBalance: (accountId: string, newBalance: number) => void;
    addAccount: (account: Account) => void;

    // Transaction operations
    addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<Transaction | null>;
    getTransactionsByAccount: (accountId: string) => Transaction[];

    // Financial operations
    transferBetweenAccounts: (fromAccountId: string, toAccountId: string, amount: number, description: string) => Promise<boolean>;
    makePayment: (accountId: string, amount: number, description: string, category: Transaction['category'], merchant?: string) => Promise<boolean>;
    exchangeCurrency: (fromAccountId: string, toAccountId: string, fromAmount: number, toAmount: number) => Promise<boolean>;
    openDeposit: (sourceAccountId: string, amount: number, depositName: string, rate: number) => Promise<boolean>;
}

// Hardcoded user ID for testing (should come from auth later)
const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';

export const useSupabaseFinancialStore = create<SupabaseFinancialState>((set, get) => ({
    accounts: [],
    transactions: [],
    isLoading: false,
    error: null,

    // Load accounts from Supabase
    loadAccounts: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('accounts')
                .select('*')
                .eq('user_id', TEST_USER_ID)
                .order('created_at', { ascending: true });

            if (error) throw error;

            const accounts: Account[] = (data || []).map(acc => ({
                id: acc.id,
                name: acc.name,
                type: acc.type,
                currency: acc.currency,
                balance: parseFloat(acc.balance),
                accountNumber: acc.account_number,
                cardNumber: acc.card_number,
                expiryDate: acc.expiry_date,
                isActive: acc.is_active,
                color: acc.color,
            }));

            console.log('✅ Loaded accounts from Supabase:', accounts);
            set({ accounts, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            console.error('Error loading accounts:', error);
        }
    },

    // Load transactions from Supabase
    loadTransactions: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;

            const transactions: Transaction[] = (data || []).map(tx => ({
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

            console.log('✅ Loaded transactions from Supabase:', transactions);
            set({ transactions, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            console.error('Error loading transactions:', error);
        }
    },

    // Load all data
    loadAll: async () => {
        await Promise.all([
            get().loadAccounts(),
            get().loadTransactions(),
        ]);
    },

    // Get account by ID
    getAccount: (id: string) => {
        return get().accounts.find(acc => acc.id === id);
    },

    // Update account balance (local + Supabase)
    updateAccountBalance: async (accountId: string, newBalance: number) => {
        // Update locally
        set(state => ({
            accounts: state.accounts.map(acc =>
                acc.id === accountId ? { ...acc, balance: newBalance } : acc
            ),
        }));

        // Update in Supabase
        await supabase
            .from('accounts')
            .update({ balance: newBalance })
            .eq('id', accountId);
    },

    // Add new account
    addAccount: async (account: Account) => {
        const { data, error } = await supabase
            .from('accounts')
            .insert({
                user_id: TEST_USER_ID,
                name: account.name,
                type: account.type,
                currency: account.currency,
                balance: account.balance,
                account_number: account.accountNumber,
                card_number: account.cardNumber,
                expiry_date: account.expiryDate,
                is_active: account.isActive,
                color: account.color,
            })
            .select()
            .single();

        if (!error && data) {
            await get().loadAccounts();
        }
    },

    // Add new transaction
    addTransaction: async (transaction: Omit<Transaction, 'id'>) => {
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

        if (error) {
            console.error('Error adding transaction:', error);
            return null;
        }

        // Reload transactions
        await get().loadTransactions();

        return {
            id: data.id,
            date: data.date,
            description: data.description,
            category: data.category,
            amount: parseFloat(data.amount),
            type: data.type,
            accountId: data.account_id,
            merchant: data.merchant,
            status: data.status,
        };
    },

    // Get transactions by account
    getTransactionsByAccount: (accountId: string) => {
        return get().transactions.filter(tx => tx.accountId === accountId);
    },

    // Transfer between accounts
    transferBetweenAccounts: async (fromAccountId: string, toAccountId: string, amount: number, description: string) => {
        const { accounts, updateAccountBalance, addTransaction } = get();

        const fromAccount = accounts.find(acc => acc.id === fromAccountId);
        const toAccount = accounts.find(acc => acc.id === toAccountId);

        if (!fromAccount || !toAccount) {
            console.error('Account not found');
            return false;
        }

        if (fromAccount.balance < amount) {
            console.error('Insufficient funds');
            return false;
        }

        // Update balances
        await updateAccountBalance(fromAccountId, fromAccount.balance - amount);
        await updateAccountBalance(toAccountId, toAccount.balance + amount);

        // Add transactions
        await addTransaction({
            accountId: fromAccountId,
            date: new Date().toISOString(),
            description: `${description} → ${toAccount.name}`,
            category: 'transfer',
            amount: amount,
            type: 'expense',
            status: 'completed',
        });

        await addTransaction({
            accountId: toAccountId,
            date: new Date().toISOString(),
            description: `${description} ← ${fromAccount.name}`,
            category: 'transfer',
            amount: amount,
            type: 'income',
            status: 'completed',
        });

        return true;
    },

    // Make payment
    makePayment: async (accountId: string, amount: number, description: string, category: Transaction['category'], merchant?: string) => {
        const { accounts, updateAccountBalance, addTransaction } = get();
        const account = accounts.find(acc => acc.id === accountId);

        if (!account) {
            console.error('Account not found');
            return false;
        }

        if (account.balance < amount) {
            console.error('Insufficient funds');
            return false;
        }

        await updateAccountBalance(accountId, account.balance - amount);

        await addTransaction({
            accountId,
            date: new Date().toISOString(),
            description,
            category,
            amount,
            type: 'expense',
            merchant,
            status: 'completed',
        });

        return true;
    },

    // Exchange currency
    exchangeCurrency: async (fromAccountId: string, toAccountId: string, fromAmount: number, toAmount: number) => {
        const { accounts, updateAccountBalance, addTransaction } = get();

        const fromAccount = accounts.find(acc => acc.id === fromAccountId);
        const toAccount = accounts.find(acc => acc.id === toAccountId);

        if (!fromAccount || !toAccount) {
            console.error('Account not found');
            return false;
        }

        if (fromAccount.balance < fromAmount) {
            console.error('Insufficient funds');
            return false;
        }

        await updateAccountBalance(fromAccountId, fromAccount.balance - fromAmount);
        await updateAccountBalance(toAccountId, toAccount.balance + toAmount);

        await addTransaction({
            accountId: fromAccountId,
            date: new Date().toISOString(),
            description: `Обмен ${fromAccount.currency} → ${toAccount.currency}`,
            category: 'transfer',
            amount: fromAmount,
            type: 'expense',
            status: 'completed',
        });

        await addTransaction({
            accountId: toAccountId,
            date: new Date().toISOString(),
            description: `Обмен ${fromAccount.currency} ← ${toAccount.currency}`,
            category: 'transfer',
            amount: toAmount,
            type: 'income',
            status: 'completed',
        });

        return true;
    },

    // Open deposit
    openDeposit: async (sourceAccountId: string, amount: number, depositName: string, rate: number) => {
        const { accounts, updateAccountBalance, addAccount, addTransaction } = get();
        const sourceAccount = accounts.find(acc => acc.id === sourceAccountId);

        if (!sourceAccount) {
            console.error('Source account not found');
            return false;
        }

        if (sourceAccount.balance < amount) {
            console.error('Insufficient funds');
            return false;
        }

        const newDeposit: Account = {
            id: `dep-${Date.now()}`,
            name: depositName,
            type: 'deposit',
            currency: sourceAccount.currency,
            balance: amount,
            accountNumber: `42305${sourceAccount.currency === 'RUB' ? '810' : '840'}${Date.now().toString().slice(-12)}`,
            isActive: true,
            color: '#EC4899',
        };

        await updateAccountBalance(sourceAccountId, sourceAccount.balance - amount);
        await addAccount(newDeposit);

        await addTransaction({
            accountId: sourceAccountId,
            date: new Date().toISOString(),
            description: `Открытие вклада "${depositName}"`,
            category: 'investments',
            amount,
            type: 'expense',
            status: 'completed',
        });

        return true;
    },
}));
