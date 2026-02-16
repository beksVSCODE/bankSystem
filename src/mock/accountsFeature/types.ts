export type AccountStatus = 'active' | 'blocked' | 'closing';

export type AccountOperationStatus = 'draft' | 'sent' | 'executed' | 'rejected';
export type ExportFormat = 'pdf' | 'csv' | 'xlsx';

export interface AccountRecord {
    id: string;
    name: string;
    type: 'current' | 'settlement' | 'deposit' | 'savings';
    status: AccountStatus;
    currency: 'RUB' | 'USD' | 'EUR';
    balance: number;
    accountNumber: string;
    iban?: string;
    inn?: string;
    kpp?: string;
    bik?: string;
    correspondentAccount?: string;
    interestRate?: number;
    termMonths?: number;
    openedAt: string;
    tariff: string;
    commission: string;
}

export interface AccountTransaction {
    id: string;
    accountId: string;
    date: string;
    description: string;
    category: string;
    counterparty?: string;
    tag?: string;
    amount: number;
    type: 'income' | 'expense';
    status: 'pending' | 'completed' | 'declined';
}

export interface PaymentTemplate {
    id: string;
    accountId: string;
    name: string;
    type: string;
    values: Record<string, string | number>;
    updatedAt: string;
}

export interface StatementRequestHistoryItem {
    id: string;
    accountId: string;
    period: string;
    createdAt: string;
    status: 'done' | 'processing' | 'failed';
}

export interface StatementExportHistoryItem {
    id: string;
    accountId: string;
    createdAt: string;
    format: ExportFormat;
    status: 'done' | 'processing' | 'failed';
}

export interface AccountDocumentRecord {
    id: string;
    accountId: string;
    title: string;
    type:
    | 'agreement'
    | 'signed'
    | 'certificate'
    | 'archive'
    | 'statement'
    | 'bank_letter'
    | 'uploaded'
    | 'incoming'
    | 'outgoing'
    | 'requisites_change'
    | 'kyc'
    | 'tax';
    status: 'ready' | 'signed' | 'pending';
    createdAt: string;
}

export interface ConsultantTicket {
    id: string;
    accountId: string;
    topic: string;
    status: 'open' | 'in_progress' | 'done';
    createdAt: string;
}

export interface PaymentOrderRecord {
    id: string;
    accountId: string;
    recipient: string;
    amount: number;
    status: AccountOperationStatus;
    date: string;
}

export interface TransferRecord {
    id: string;
    accountId: string;
    kind:
    | 'card_to_card'
    | 'to_person'
    | 'inside_bank'
    | 'between_own_accounts'
    | 'qr_payment';
    from: string;
    to: string;
    amount: number;
    status: 'new' | 'processing' | 'done' | 'failed';
    createdAt: string;
}

export interface InvoiceRecord {
    id: string;
    accountId: string;
    counterparty: string;
    amount: number;
    purpose: string;
    dueDate: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
}

export interface FxRequestRecord {
    id: string;
    accountId: string;
    operation: 'alternative_settlements' | 'ved_notifications' | 'conversion_ops' | 'special_rate' | 'ved_notice';
    currency: 'USD' | 'EUR' | 'CNY';
    amount: number;
    status: 'new' | 'processing' | 'done' | 'rejected';
    createdAt: string;
}

export interface AccountSettingsRecord {
    accountId: string;
    visible: boolean;
    notificationsEmail: boolean;
    notificationsSms: boolean;
    notificationsPush: boolean;
    dayLimit: number;
    monthLimit: number;
    confirmationMethod: 'sms' | '2fa';
}
