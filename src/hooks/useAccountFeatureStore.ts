import { useMemo, useState } from 'react';
import {
    mockAccountDocuments,
    mockAccountSettings,
    mockAccountsCatalog,
    mockAccountTransactions,
    mockPaymentOrders,
    mockPaymentTemplates,
    mockStatementExports,
    mockStatementRequests,
    mockTransfers,
    type AccountDocumentRecord,
    type AccountRecord,
    type AccountSettingsRecord,
    type AccountTransaction,
    type ExportFormat,
    type PaymentOrderRecord,
    type PaymentTemplate,
    type StatementExportHistoryItem,
    type TransferRecord,
} from '@/mock/accountsFeature';

export const useAccountFeatureStore = () => {
    const [accounts, setAccounts] = useState<AccountRecord[]>(mockAccountsCatalog);
    const [transactions, setTransactions] = useState<AccountTransaction[]>(mockAccountTransactions);
    const [templates, setTemplates] = useState<PaymentTemplate[]>(mockPaymentTemplates);
    const [documents, setDocuments] = useState<AccountDocumentRecord[]>(mockAccountDocuments);
    const [paymentOrders, setPaymentOrders] = useState<PaymentOrderRecord[]>(mockPaymentOrders);
    const [transfers, setTransfers] = useState<TransferRecord[]>(mockTransfers);
    const [statementExports, setStatementExports] = useState<StatementExportHistoryItem[]>(mockStatementExports);
    const [settings, setSettings] = useState<AccountSettingsRecord[]>(mockAccountSettings);

    const byAccountId = useMemo(
        () => ({
            transactions: (accountId: string) => transactions.filter((item) => item.accountId === accountId),
            templates: (accountId: string) => templates.filter((item) => item.accountId === accountId),
            documents: (accountId: string) => documents.filter((item) => item.accountId === accountId),
            paymentOrders: (accountId: string) => paymentOrders.filter((item) => item.accountId === accountId),
            transfers: (accountId: string) => transfers.filter((item) => item.accountId === accountId),
            statementExports: (accountId: string) => statementExports.filter((item) => item.accountId === accountId),
            statementRequests: (accountId: string) => mockStatementRequests.filter((item) => item.accountId === accountId),
            settings: (accountId: string) => settings.find((item) => item.accountId === accountId),
        }),
        [documents, paymentOrders, settings, statementExports, templates, transactions, transfers],
    );

    return {
        accounts,
        setAccounts,
        transactions,
        templates,
        documents,
        paymentOrders,
        transfers,
        statementExports,
        settings,
        byAccountId,
        addTransaction: (payload: AccountTransaction) => setTransactions((prev) => [payload, ...prev]),
        upsertTemplate: (payload: PaymentTemplate) =>
            setTemplates((prev) => [payload, ...prev.filter((item) => item.id !== payload.id)]),
        deleteTemplate: (id: string) => setTemplates((prev) => prev.filter((item) => item.id !== id)),
        addDocument: (payload: AccountDocumentRecord) => setDocuments((prev) => [payload, ...prev]),
        addPaymentOrder: (payload: PaymentOrderRecord) => setPaymentOrders((prev) => [payload, ...prev]),
        addTransfer: (payload: TransferRecord) => setTransfers((prev) => [payload, ...prev]),
        addStatementExport: (accountId: string, format: ExportFormat) =>
            setStatementExports((prev) => [
                { id: `se-${Date.now()}`, accountId, format, status: 'done', createdAt: new Date().toISOString() },
                ...prev,
            ]),
        renameAccount: (accountId: string, name: string) =>
            setAccounts((prev) => prev.map((item) => (item.id === accountId ? { ...item, name } : item))),
        updateSettings: (accountId: string, patch: Partial<AccountSettingsRecord>) =>
            setSettings((prev) =>
                prev.some((item) => item.accountId === accountId)
                    ? prev.map((item) => (item.accountId === accountId ? { ...item, ...patch } : item))
                    : [
                        ...prev,
                        {
                            accountId,
                            visible: true,
                            notificationsEmail: true,
                            notificationsSms: true,
                            notificationsPush: false,
                            dayLimit: 1000000,
                            monthLimit: 8000000,
                            confirmationMethod: 'sms',
                            ...patch,
                        },
                    ],
            ),
    };
};
