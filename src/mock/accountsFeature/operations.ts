import type {
    AccountSettingsRecord,
    FxRequestRecord,
    InvoiceRecord,
    PaymentOrderRecord,
    StatementExportHistoryItem,
    TransferRecord,
} from './types';

export const mockPaymentOrders: PaymentOrderRecord[] = [
    { id: 'po-1', accountId: 'acc-1', recipient: 'ООО ТехПартнер', amount: 125000, status: 'draft', date: '2026-02-14' },
    { id: 'po-2', accountId: 'acc-1', recipient: 'ООО Поставщик+', amount: 420000, status: 'executed', date: '2026-02-13' },
    { id: 'po-3', accountId: 'acc-2', recipient: 'ИП Новиков', amount: 87000, status: 'sent', date: '2026-02-12' },
];

export const mockTransfers: TransferRecord[] = [
    {
        id: 'tr-1',
        accountId: 'acc-1',
        kind: 'card_to_card',
        from: '2200 **** **** 4821',
        to: '2200 **** **** 7623',
        amount: 15000,
        status: 'done',
        createdAt: '2026-02-12T10:20:00',
    },
    {
        id: 'tr-2',
        accountId: 'acc-1',
        kind: 'inside_bank',
        from: 'Текущий / Основной',
        to: 'ООО Альфа Трейд',
        amount: 215000,
        status: 'processing',
        createdAt: '2026-02-14T12:00:00',
    },
];

export const mockInvoices: InvoiceRecord[] = [
    {
        id: 'inv-1',
        accountId: 'acc-1',
        counterparty: 'ООО Контрагент',
        amount: 88000,
        purpose: 'Оплата услуг',
        dueDate: '2026-02-20',
        status: 'sent',
    },
    {
        id: 'inv-2',
        accountId: 'acc-1',
        counterparty: 'ИП Иванов',
        amount: 32000,
        purpose: 'Поставка материалов',
        dueDate: '2026-02-22',
        status: 'paid',
    },
];

export const mockFxRequests: FxRequestRecord[] = [
    {
        id: 'fx-1',
        accountId: 'acc-1',
        operation: 'conversion_ops',
        currency: 'USD',
        amount: 2400,
        status: 'done',
        createdAt: '2026-02-14T11:10:00',
    },
    {
        id: 'fx-2',
        accountId: 'acc-5',
        operation: 'special_rate',
        currency: 'EUR',
        amount: 1200,
        status: 'processing',
        createdAt: '2026-02-14T15:45:00',
    },
];

export const mockAccountSettings: AccountSettingsRecord[] = [
    {
        accountId: 'acc-1',
        visible: true,
        notificationsEmail: true,
        notificationsSms: true,
        notificationsPush: false,
        dayLimit: 1000000,
        monthLimit: 8000000,
        confirmationMethod: 'sms',
    },
    {
        accountId: 'acc-2',
        visible: true,
        notificationsEmail: true,
        notificationsSms: false,
        notificationsPush: true,
        dayLimit: 3000000,
        monthLimit: 15000000,
        confirmationMethod: '2fa',
    },
    {
        accountId: 'acc-6',
        visible: true,
        notificationsEmail: false,
        notificationsSms: true,
        notificationsPush: false,
        dayLimit: 500000,
        monthLimit: 3000000,
        confirmationMethod: 'sms',
    },
];

export const mockStatementExports: StatementExportHistoryItem[] = [
    { id: 'se-1', accountId: 'acc-1', createdAt: '2026-02-14T14:11:00', format: 'pdf', status: 'done' },
    { id: 'se-2', accountId: 'acc-1', createdAt: '2026-02-12T09:02:00', format: 'xlsx', status: 'done' },
    { id: 'se-3', accountId: 'acc-2', createdAt: '2026-02-13T16:20:00', format: 'csv', status: 'processing' },
];
