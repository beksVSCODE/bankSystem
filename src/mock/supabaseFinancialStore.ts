import { create } from 'zustand';
import type { Account, Card, Transaction } from './types';
// Removed Supabase dependency - using mock data only

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

    // Load accounts from mock data
    loadAccounts: async () => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
            const { mockAccounts } = await import('./data');
            set({ accounts: mockAccounts, isLoading: false });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Error loading accounts:', error);
            set({ error: errorMessage, isLoading: false });
        }
    },

    // Load cards from mock data
    loadCards: async () => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
            const { mockCards } = await import('./data');
            set({ cards: mockCards, isLoading: false });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Error loading cards:', error);
            set({ error: errorMessage, isLoading: false });
        }
    },

    // Load transactions from mock data
    loadTransactions: async () => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
            const { mockTransactions } = await import('./data');
            set({ transactions: mockTransactions, isLoading: false });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Error loading transactions:', error);
            set({ error: errorMessage, isLoading: false });
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

    // Update account balance (local only)
    updateAccountBalance: (accountId: string, newBalance: number) => {
        set(state => ({
            accounts: state.accounts.map(acc =>
                acc.id === accountId ? { ...acc, balance: newBalance, updatedAt: new Date().toISOString() } : acc
            ),
        }));
    },

    // Add new account (local only)
    addAccount: (account: Account) => {
        set(state => ({
            accounts: [...state.accounts, account],
        }));
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

    addCard: (card: Card) => {
        set(state => ({
            cards: [...state.cards, card],
        }));
    },

    updateCard: (cardId: string, updates: Partial<Card>) => {
        set(state => ({
            cards: state.cards.map(card =>
                card.id === cardId ? { ...card, ...updates, updatedAt: new Date().toISOString() } : card
            ),
        }));
    },

    blockCard: (cardId: string, reason?: string) => {
        get().updateCard(cardId, {
            status: 'blocked',
            blockReason: reason
        });
    },

    unblockCard: (cardId: string) => {
        get().updateCard(cardId, {
            status: 'active',
            blockReason: undefined
        });
    },

    // Add new transaction
    addTransaction: async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newTransaction: Transaction = {
            ...transaction,
            id: `tx-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        
        set(state => ({
            transactions: [newTransaction, ...state.transactions],
        }));

        return newTransaction;
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
        updateAccountBalance(fromAccountId, fromAccount.balance - amount);
        updateAccountBalance(toAccountId, toAccount.balance + amount);

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

        updateAccountBalance(fromAccountId, fromAccount.balance - fromAmount);
        updateAccountBalance(toAccountId, toAccount.balance + toAmount);

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
            userId: sourceAccount.userId,
            name: depositName,
            accountType: 'deposit',
            accountCategory: 'personal',
            accountNumber: `42305${sourceAccount.currency === 'RUB' ? '810' : '840'}${Date.now().toString().slice(-12)}`,
            currency: sourceAccount.currency,
            balance: amount,
            isActive: true,
            color: '#FFA500',
            interestRate: rate,
            termMonths: 12,
            maturityDate: maturityDate.toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        updateAccountBalance(sourceAccountId, sourceAccount.balance - amount);
        addAccount(newDeposit);

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
