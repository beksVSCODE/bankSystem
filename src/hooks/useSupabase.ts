import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// TOGGLE: Change between '@/services/supabaseService' and '@/services/mockService'
import { accountService, transactionService, notificationService, userService } from '@/services/mockService';
import type { Account, Transaction, Notification } from '@/mock/types';

// User Hooks
export const useCurrentUser = () => {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: () => userService.getCurrentUser(),
    });
};

// Account Hooks
export const useAccounts = (userId: string | undefined) => {
    return useQuery({
        queryKey: ['accounts', userId],
        queryFn: () => accountService.getAccounts(userId!),
        enabled: !!userId,
    });
};

export const useCreateAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, account }: { userId: string; account: Omit<Account, 'id'> }) =>
            accountService.createAccount(userId, account),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['accounts', variables.userId] });
        },
    });
};

export const useUpdateAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ accountId, updates }: { accountId: string; updates: Partial<Account> }) =>
            accountService.updateAccount(accountId, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });
};

export const useDeleteAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (accountId: string) => accountService.deleteAccount(accountId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });
};

// Transaction Hooks
export const useTransactions = (accountId?: string) => {
    return useQuery({
        queryKey: ['transactions', accountId],
        queryFn: () => transactionService.getTransactions(accountId),
    });
};

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (transaction: Omit<Transaction, 'id'>) =>
            transactionService.createTransaction(transaction),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });
};

export const useUpdateTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ transactionId, updates }: { transactionId: string; updates: Partial<Transaction> }) =>
            transactionService.updateTransaction(transactionId, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });
};

export const useDeleteTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (transactionId: string) => transactionService.deleteTransaction(transactionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });
};

// Notification Hooks
export const useNotifications = (userId: string | undefined) => {
    return useQuery({
        queryKey: ['notifications', userId],
        queryFn: () => notificationService.getNotifications(userId!),
        enabled: !!userId,
    });
};

export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notificationId: string) =>
            notificationService.markAsRead(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};

export const useMarkAllNotificationsAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => notificationService.markAllAsRead(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};

export const useDeleteNotification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notificationId: string) =>
            notificationService.deleteNotification(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};
