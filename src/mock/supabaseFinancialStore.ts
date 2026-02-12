import { create } from 'zustand';
import type { Account, Card, Transaction } from './types';
import { supabase } from '@/lib/supabase';

interface SupabaseFinancialState {
    accounts: Account[];
    cards: Card[];
    transactions: Transaction[];
    isLoading: boolean;
    error: string | null;

    // Data loading
    loadAccounts: () => Promise<void>;
    loadCards: () => Promise<void>;
    loadTransactions: () => Promise<void>;
    loadAll: () => Promise<void>;

    // Account operations
    getAccount: (id: string) => Account | undefined;
    updateAccountBalance: (accountId: string, newBalance: number) => void;
    addAccount: (account: Account) => void;

    // Card operations (НОВОЕ!)
    getCard: (id: string) => Card | undefined;
    getCardsByAccount: (accountId: string) => Card[];
    getPrimaryCard: (accountId: string) => Card | undefined;
    addCard: (card: Card) => void;
    updateCard: (cardId: string, updates: Partial<Card>) => void;
    blockCard: (cardId: string, reason?: string) => void;
    unblockCard: (cardId: string) => void;

    // Transaction operations
    addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Transaction | null>;
    getTransactionsByAccount: (accountId: string) => Transaction[];
    getTransactionsByCard: (cardId: string) => Transaction[];

    // Financial operations (обновлены для работы с картами)
    transferBetweenAccounts: (fromAccountId: string, toAccountId: string, amount: number, description: string) => Promise<boolean>;
    makePayment: (cardId: string, amount: number, description: string, category: Transaction['category'], merchant?: string) => Promise<boolean>;
    exchangeCurrency: (fromAccountId: string, toAccountId: string, fromAmount: number, toAmount: number) => Promise<boolean>;
    openDeposit: (sourceAccountId: string, amount: number, depositName: string, rate: number) => Promise<boolean>;
}

// Hardcoded user ID for testing (should come from auth later)
const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';

export const useSupabaseFinancialStore = create<SupabaseFinancialState>((set, get) => ({
    accounts: [],
    cards: [],
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
                userId: acc.user_id,
                name: acc.name,
                accountType: acc.account_type,
                accountCategory: acc.account_category || 'personal',
                accountNumber: acc.account_number,
                currency: acc.currency,
                balance: parseFloat(acc.balance),
                isActive: acc.is_active,
                color: acc.color || '#0050B3',
                createdAt: acc.created_at,
                updatedAt: acc.updated_at,
                // Опциональные поля для вкладов и кредитов
                ...(acc.interest_rate && { interestRate: parseFloat(acc.interest_rate) }),
                ...(acc.term_months && { termMonths: acc.term_months }),
                ...(acc.maturity_date && { maturityDate: acc.maturity_date }),
                ...(acc.overdraft_limit && { overdraftLimit: parseFloat(acc.overdraft_limit) }),
            }));

            console.log('✅ Loaded accounts from Supabase:', accounts);
            set({ accounts, isLoading: false });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Error loading accounts from Supabase:', error);
            // Fallback to mock data
            console.log('📦 Using mock accounts as fallback...');
            const { mockAccounts } = await import('./data');
            set({ accounts: mockAccounts, error: null, isLoading: false });
        }
    },

    // Load cards from Supabase (НОВОЕ!)
    loadCards: async () => {
        set({ isLoading: true, error: null });
        try {
            // Загружаем все карты для всех счетов пользователя
            const { data: accountsData } = await supabase
                .from('accounts')
                .select('id')
                .eq('user_id', TEST_USER_ID);

            if (!accountsData || accountsData.length === 0) {
                set({ cards: [], isLoading: false });
                return;
            }

            const accountIds = accountsData.map(acc => acc.id);

            const { data, error } = await supabase
                .from('cards')
                .select('*')
                .in('account_id', accountIds)
                .order('is_primary', { ascending: false });

            if (error) throw error;

            const cards: Card[] = (data || []).map(card => ({
                id: card.id,
                accountId: card.account_id,
                cardNumber: card.card_number,
                cardType: card.card_type,
                paymentSystem: card.payment_system,
                expiryDate: card.expiry_date,
                cvv: card.cvv,
                pin: card.pin,
                status: card.status,
                isPrimary: card.is_primary,
                dailyLimit: card.daily_limit ? parseFloat(card.daily_limit) : undefined,
                monthlyLimit: card.monthly_limit ? parseFloat(card.monthly_limit) : undefined,
                contactless: card.contactless,
                onlinePayments: card.online_payments,
                abroadPayments: card.abroad_payments,
                blockReason: card.block_reason,
                createdAt: card.created_at,
                updatedAt: card.updated_at,
            }));

            console.log('✅ Loaded cards from Supabase:', cards);
            set({ cards, isLoading: false });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Error loading cards from Supabase:', error);
            // Fallback to mock data
            console.log('📦 Using mock cards as fallback...');
            const { mockCards } = await import('./data');
            set({ cards: mockCards, error: null, isLoading: false });
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
                accountId: tx.account_id,
                cardId: tx.card_id,
                date: tx.date,
                description: tx.description,
                category: tx.category,
                amount: parseFloat(tx.amount),
                currency: tx.currency,
                type: tx.type,
                status: tx.status,
                merchant: tx.merchant,
                mccCode: tx.mcc_code,
                location: tx.location,
                latitude: tx.latitude,
                longitude: tx.longitude,
                notes: tx.notes,
                createdAt: tx.created_at,
                updatedAt: tx.updated_at,
            }));

            console.log('✅ Loaded transactions from Supabase:', transactions);
            set({ transactions, isLoading: false });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Error loading transactions from Supabase:', error);
            // Fallback to mock data
            console.log('📦 Using mock transactions as fallback...');
            const { mockTransactions } = await import('./data');
            set({ transactions: mockTransactions, error: null, isLoading: false });
        }
    },

    // Load all data
    loadAll: async () => {
        await Promise.all([
            get().loadAccounts(),
            get().loadCards(),
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
                account_type: account.accountType,
                account_number: account.accountNumber,
                currency: account.currency,
                balance: account.balance,
                is_active: account.isActive,
                interest_rate: account.interestRate,
                term_months: account.termMonths,
                maturity_date: account.maturityDate,
                overdraft_limit: account.overdraftLimit,
            })
            .select()
            .single();

        if (!error && data) {
            await get().loadAccounts();
        }
    },

    // Card operations (НОВОЕ!)
    getCard: (id: string) => {
        return get().cards.find(card => card.id === id);
    },

    getCardsByAccount: (accountId: string) => {
        return get().cards.filter(card => card.accountId === accountId);
    },

    getPrimaryCard: (accountId: string) => {
        const accountCards = get().cards.filter(card => card.accountId === accountId);
        return accountCards.find(card => card.isPrimary) || accountCards[0];
    },

    addCard: async (card: Card) => {
        const { data, error } = await supabase
            .from('cards')
            .insert({
                account_id: card.accountId,
                card_number: card.cardNumber,
                card_type: card.cardType,
                payment_system: card.paymentSystem,
                expiry_date: card.expiryDate,
                cvv: card.cvv,
                pin: card.pin,
                status: card.status,
                is_primary: card.isPrimary,
                daily_limit: card.dailyLimit,
                monthly_limit: card.monthlyLimit,
                contactless: card.contactless,
                online_payments: card.onlinePayments,
                abroad_payments: card.abroadPayments,
            })
            .select()
            .single();

        if (!error && data) {
            await get().loadCards();
        }
    },

    updateCard: async (cardId: string, updates: Partial<Card>) => {
        // Update locally
        set(state => ({
            cards: state.cards.map(card =>
                card.id === cardId ? { ...card, ...updates } : card
            ),
        }));

        // Prepare Supabase update object
        const supabaseUpdates: Record<string, unknown> = {};
        if (updates.status !== undefined) supabaseUpdates.status = updates.status;
        if (updates.dailyLimit !== undefined) supabaseUpdates.daily_limit = updates.dailyLimit;
        if (updates.monthlyLimit !== undefined) supabaseUpdates.monthly_limit = updates.monthlyLimit;
        if (updates.contactless !== undefined) supabaseUpdates.contactless = updates.contactless;
        if (updates.onlinePayments !== undefined) supabaseUpdates.online_payments = updates.onlinePayments;
        if (updates.abroadPayments !== undefined) supabaseUpdates.abroad_payments = updates.abroadPayments;
        if (updates.blockReason !== undefined) supabaseUpdates.block_reason = updates.blockReason;
        if (updates.isPrimary !== undefined) supabaseUpdates.is_primary = updates.isPrimary;

        // Update in Supabase
        await supabase
            .from('cards')
            .update(supabaseUpdates)
            .eq('id', cardId);
    },

    blockCard: async (cardId: string, reason?: string) => {
        await get().updateCard(cardId, {
            status: 'blocked',
            blockReason: reason
        });
    },

    unblockCard: async (cardId: string) => {
        await get().updateCard(cardId, {
            status: 'active',
            blockReason: undefined
        });
    },

    // Add new transaction
    addTransaction: async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
        const { data, error } = await supabase
            .from('transactions')
            .insert({
                account_id: transaction.accountId,
                card_id: transaction.cardId,
                date: transaction.date,
                description: transaction.description,
                category: transaction.category,
                amount: transaction.amount,
                currency: transaction.currency,
                type: transaction.type,
                status: transaction.status,
                merchant: transaction.merchant,
                mcc_code: transaction.mccCode,
                location: transaction.location,
                latitude: transaction.latitude,
                longitude: transaction.longitude,
                notes: transaction.notes,
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
            accountId: data.account_id,
            cardId: data.card_id,
            date: data.date,
            description: data.description,
            category: data.category,
            amount: parseFloat(data.amount),
            currency: data.currency,
            type: data.type,
            status: data.status,
            merchant: data.merchant,
            mccCode: data.mcc_code,
            location: data.location,
            latitude: data.latitude,
            longitude: data.longitude,
            notes: data.notes,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        };
    },

    // Get transactions by account
    getTransactionsByAccount: (accountId: string) => {
        return get().transactions.filter(tx => tx.accountId === accountId);
    },

    // Get transactions by card (НОВОЕ!)
    getTransactionsByCard: (cardId: string) => {
        return get().transactions.filter(tx => tx.cardId === cardId);
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
            currency: fromAccount.currency,
            category: 'transfer',
            amount: amount,
            type: 'expense',
            status: 'completed',
        });

        await addTransaction({
            accountId: toAccountId,
            date: new Date().toISOString(),
            description: `${description} ← ${fromAccount.name}`,
            currency: toAccount.currency,
            category: 'transfer',
            amount: amount,
            type: 'income',
            status: 'completed',
        });

        return true;
    },

    // Make payment (ОБНОВЛЕНО: теперь принимает cardId вместо accountId)
    makePayment: async (cardId: string, amount: number, description: string, category: Transaction['category'], merchant?: string) => {
        const { cards, accounts, updateAccountBalance, addTransaction } = get();

        // Находим карту
        const card = cards.find(c => c.id === cardId);
        if (!card) {
            console.error('Card not found');
            return false;
        }

        // Находим счет по карте
        const account = accounts.find(acc => acc.id === card.accountId);
        if (!account) {
            console.error('Account not found');
            return false;
        }

        // Проверяем баланс СЧЕТА (не карты!)
        if (account.balance < amount) {
            console.error('Insufficient funds on account');
            return false;
        }

        // Проверяем лимиты карты
        if (card.dailyLimit && amount > card.dailyLimit) {
            console.error('Daily limit exceeded');
            return false;
        }

        // Списываем с баланса СЧЕТА
        await updateAccountBalance(account.id, account.balance - amount);

        // Создаем транзакцию с привязкой к счету И карте
        await addTransaction({
            accountId: account.id,
            cardId: card.id,
            date: new Date().toISOString(),
            description,
            currency: account.currency,
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
            currency: fromAccount.currency,
            category: 'transfer',
            amount: fromAmount,
            type: 'expense',
            status: 'completed',
        });

        await addTransaction({
            accountId: toAccountId,
            date: new Date().toISOString(),
            description: `Обмен ${fromAccount.currency} ← ${toAccount.currency}`,
            currency: toAccount.currency,
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

        const maturityDate = new Date();
        maturityDate.setMonth(maturityDate.getMonth() + 12); // 12 месяцев вклад

        const newDeposit: Account = {
            id: `dep-${Date.now()}`,
            userId: TEST_USER_ID,
            name: depositName,
            accountType: 'deposit',
            accountNumber: `42305${sourceAccount.currency === 'RUB' ? '810' : '840'}${Date.now().toString().slice(-12)}`,
            currency: sourceAccount.currency,
            balance: amount,
            isActive: true,
            interestRate: rate,
            termMonths: 12,
            maturityDate: maturityDate.toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await updateAccountBalance(sourceAccountId, sourceAccount.balance - amount);
        await addAccount(newDeposit);

        await addTransaction({
            accountId: sourceAccountId,
            date: new Date().toISOString(),
            description: `Открытие вклада "${depositName}"`,
            currency: sourceAccount.currency,
            category: 'investments',
            amount,
            type: 'expense',
            status: 'completed',
        });

        return true;
    },
}));
