import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Account, Transaction } from './types';
import { mockAccounts, mockTransactions } from './data';

interface FinancialState {
    accounts: Account[];
    transactions: Transaction[];

    // Account operations
    getAccount: (id: string) => Account | undefined;
    updateAccountBalance: (accountId: string, newBalance: number) => void;
    addAccount: (account: Account) => void;

    // Transaction operations
    addTransaction: (transaction: Omit<Transaction, 'id'>) => Transaction;
    getTransactionsByAccount: (accountId: string) => Transaction[];

    // Financial operations
    transferBetweenAccounts: (fromAccountId: string, toAccountId: string, amount: number, description: string) => boolean;
    makePayment: (accountId: string, amount: number, description: string, category: Transaction['category'], merchant?: string) => boolean;
    exchangeCurrency: (fromAccountId: string, toAccountId: string, fromAmount: number, toAmount: number) => boolean;
    openDeposit: (sourceAccountId: string, amount: number, depositName: string, rate: number) => boolean;

    // Reset to initial state
    resetData: () => void;
}

const getInitialState = () => {
    return {
        accounts: [...mockAccounts],
        transactions: [...mockTransactions],
    };
};

export const useFinancialStore = create<FinancialState>()(
    persist(
        (set, get) => ({
            ...getInitialState(),

            // Get account by ID
            getAccount: (id: string) => {
                return get().accounts.find(acc => acc.id === id);
            },

            // Update account balance
            updateAccountBalance: (accountId: string, newBalance: number) => {
                set(state => ({
                    accounts: state.accounts.map(acc =>
                        acc.id === accountId ? { ...acc, balance: newBalance } : acc
                    ),
                }));
            },

            // Add new account
            addAccount: (account: Account) => {
                set(state => ({
                    accounts: [...state.accounts, account],
                }));
            },

            // Add new transaction
            addTransaction: (transaction: Omit<Transaction, 'id'>) => {
                const newTransaction: Transaction = {
                    ...transaction,
                    id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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

            // Transfer between accounts
            transferBetweenAccounts: (fromAccountId: string, toAccountId: string, amount: number, description: string) => {
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
                addTransaction({
                    date: new Date().toISOString().split('T')[0],
                    description: description || `Перевод на ${toAccount.name}`,
                    category: 'transfer',
                    amount: -amount,
                    type: 'expense',
                    accountId: fromAccountId,
                    status: 'completed',
                });

                addTransaction({
                    date: new Date().toISOString().split('T')[0],
                    description: description || `Перевод с ${fromAccount.name}`,
                    category: 'transfer',
                    amount: amount,
                    type: 'income',
                    accountId: toAccountId,
                    status: 'completed',
                });

                return true;
            },

            // Make payment
            makePayment: (accountId: string, amount: number, description: string, category: Transaction['category'], merchant?: string) => {
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

                // Update balance
                updateAccountBalance(accountId, account.balance - amount);

                // Add transaction
                addTransaction({
                    date: new Date().toISOString().split('T')[0],
                    description,
                    category,
                    amount: -amount,
                    type: 'expense',
                    accountId,
                    merchant,
                    status: 'completed',
                });

                return true;
            },

            // Exchange currency
            exchangeCurrency: (fromAccountId: string, toAccountId: string, fromAmount: number, toAmount: number) => {
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

                // Update balances
                updateAccountBalance(fromAccountId, fromAccount.balance - fromAmount);
                updateAccountBalance(toAccountId, toAccount.balance + toAmount);

                // Add transactions
                addTransaction({
                    date: new Date().toISOString().split('T')[0],
                    description: `Обмен ${fromAccount.currency} → ${toAccount.currency}`,
                    category: 'transfer',
                    amount: -fromAmount,
                    type: 'expense',
                    accountId: fromAccountId,
                    status: 'completed',
                });

                addTransaction({
                    date: new Date().toISOString().split('T')[0],
                    description: `Обмен ${fromAccount.currency} → ${toAccount.currency}`,
                    category: 'transfer',
                    amount: toAmount,
                    type: 'income',
                    accountId: toAccountId,
                    status: 'completed',
                });

                return true;
            },

            // Open deposit
            openDeposit: (sourceAccountId: string, amount: number, depositName: string, rate: number) => {
                const { accounts, updateAccountBalance, addTransaction, addAccount } = get();

                const sourceAccount = accounts.find(acc => acc.id === sourceAccountId);

                if (!sourceAccount) {
                    console.error('Account not found');
                    return false;
                }

                if (sourceAccount.balance < amount) {
                    console.error('Insufficient funds');
                    return false;
                }

                // Create new deposit account
                const newDeposit: Account = {
                    id: `acc-deposit-${Date.now()}`,
                    name: depositName,
                    type: 'deposit',
                    currency: sourceAccount.currency,
                    balance: amount,
                    accountNumber: `423${Math.random().toString().slice(2, 17)}`,
                    isActive: true,
                    color: '#EC4899',
                };

                // Update source account balance
                updateAccountBalance(sourceAccountId, sourceAccount.balance - amount);

                // Add new deposit account
                addAccount(newDeposit);

                // Add transaction to source account
                addTransaction({
                    date: new Date().toISOString().split('T')[0],
                    description: `Открытие вклада "${depositName}"`,
                    category: 'investments',
                    amount: -amount,
                    type: 'expense',
                    accountId: sourceAccountId,
                    status: 'completed',
                });

                // Add transaction to deposit account
                addTransaction({
                    date: new Date().toISOString().split('T')[0],
                    description: `Открытие вклада (ставка ${rate}%)`,
                    category: 'investments',
                    amount: amount,
                    type: 'income',
                    accountId: newDeposit.id,
                    status: 'completed',
                });

                return true;
            },

            // Reset to initial mock data
            resetData: () => {
                set(getInitialState());
            },
        }),
        {
            name: 'financial-storage',
            version: 1,
        }
    )
);
