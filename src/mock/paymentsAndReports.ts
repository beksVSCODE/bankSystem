import type {
    PaymentOrder,
    PaymentTemplate,
    ScheduledPayment,
    BankMessage,
    Receipt,
    Registry,
    ReportType,
    Report,
    CounterpartyInfo
} from './types';

// ============= PAYMENTS AND TRANSFERS =============

export const mockPaymentOrders: PaymentOrder[] = [
    {
        id: 'po-001',
        number: '12345/001',
        date: '2025-02-14',
        sum: 150000,
        currency: 'RUB',
        status: 'draft',
        paymentType: 'payment_order',
        payer: 'ООО Компания',
        payerAccount: '40817810500000123456',
        recipient: 'ООО Поставщик',
        recipientAccount: '40817810500000654321',
        purpose: 'Оплата счета №123 за товары',
        dueDate: '2025-02-20',
        createdAt: '2025-02-14T10:30:00',
        executedAt: null,
    },
    {
        id: 'po-002',
        number: '12345/002',
        date: '2025-02-13',
        sum: 50000,
        currency: 'RUB',
        status: 'sent',
        paymentType: 'payment_order',
        payer: 'ООО Компания',
        payerAccount: '40817810500000123456',
        recipient: 'ООО Клиент',
        recipientAccount: '40817810500000111111',
        purpose: 'Оплата счета за услуги',
        dueDate: '2025-02-19',
        createdAt: '2025-02-13T14:45:00',
        executedAt: null,
    },
    {
        id: 'po-003',
        number: '12345/003',
        date: '2025-02-10',
        sum: 200000,
        currency: 'RUB',
        status: 'executed',
        paymentType: 'payment_order',
        payer: 'ООО Компания',
        payerAccount: '40817810500000123456',
        recipient: 'ООО Подрядчик',
        recipientAccount: '40817810500000222222',
        purpose: 'Оплата счета №456',
        dueDate: '2025-02-15',
        createdAt: '2025-02-10T09:15:00',
        executedAt: '2025-02-12T16:30:00',
    },
];

export const mockPaymentTemplates: PaymentTemplate[] = [
    {
        id: 'tpl-001',
        name: 'Зарплата',
        paymentType: 'payment_order',
        recipient: 'ООО Компания',
        recipientAccount: '40817810500000654321',
        sum: 500000,
        currency: 'RUB',
        purpose: 'Заработная плата за месяц',
    },
    {
        id: 'tpl-002',
        name: 'Налоговые платежи',
        paymentType: 'payment_order',
        recipient: 'ФНС России',
        recipientAccount: '40101810400000010001',
        sum: 100000,
        currency: 'RUB',
        purpose: 'Платеж налога',
    },
];

export const mockScheduledPayments: ScheduledPayment[] = [
    {
        id: 'sp-001',
        name: 'Зарплата',
        date: '2025-02-15',
        sum: 500000,
        currency: 'RUB',
        recipient: 'ООО Компания',
        status: 'pending',
        frequency: 'monthly',
    },
    {
        id: 'sp-002',
        name: 'Аренда офиса',
        date: '2025-02-20',
        sum: 250000,
        currency: 'RUB',
        recipient: 'ООО Недвижимость',
        status: 'pending',
        frequency: 'monthly',
    },
    {
        id: 'sp-003',
        name: 'Коммунальные платежи',
        date: '2025-03-05',
        sum: 50000,
        currency: 'RUB',
        recipient: 'МУП Коммунальная служба',
        status: 'pending',
        frequency: 'monthly',
    },
];

export const mockBankMessages: BankMessage[] = [
    {
        id: 'msg-001',
        date: '2025-02-14T15:30:00',
        sender: 'Сотрудник Банка',
        senderRole: 'manager',
        subject: 'По вашей заявке на кредит',
        message: 'Здравствуйте! Ваша заявка на кредит одобрена. Размер лимита: 500,000 ₽. Процентная ставка: 14% годовых. Пожалуйста, приложите необходимые документы.',
        attachments: ['contract.pdf', 'requirements.pdf'],
        isRead: false,
    },
    {
        id: 'msg-002',
        date: '2025-02-10T10:15:00',
        sender: 'Сотрудник Банка',
        senderRole: 'support',
        subject: 'Уведомление о максимальном лимите по карте',
        message: 'Вы достигли максимального лимита по переводам за сутки. Лимит восстановится завтра в 00:00.',
        attachments: [],
        isRead: true,
    },
];

export const mockReceipts: Receipt[] = [
    {
        id: 'rcpt-001',
        date: '2025-02-14',
        paymentNumber: '12345/001',
        sum: 150000,
        currency: 'RUB',
        status: 'completed',
        recipient: 'ООО Поставщик',
        purpose: 'Оплата счета №123',
    },
    {
        id: 'rcpt-002',
        date: '2025-02-13',
        paymentNumber: '12345/002',
        sum: 50000,
        currency: 'RUB',
        status: 'completed',
        recipient: 'ООО Клиент',
        purpose: 'Оплата счета за услуги',
    },
];

export const mockRegistries: Registry[] = [
    {
        id: 'reg-001',
        date: '2025-02-14',
        name: 'Реестр платежей на зарплату',
        paymentsCount: 45,
        totalSum: 2250000,
        currency: 'RUB',
        status: 'processed',
        processedAt: '2025-02-14T16:30:00',
    },
    {
        id: 'reg-002',
        date: '2025-02-13',
        name: 'Реестр налоговых платежей',
        paymentsCount: 12,
        totalSum: 450000,
        currency: 'RUB',
        status: 'processed',
        processedAt: '2025-02-13T15:00:00',
    },
];

// ============= REPORTS =============

export const mockReports: Report[] = [
    {
        id: 'rpt-001',
        name: 'Выписка по счету',
        type: 'account_statement',
        dateFrom: '2025-01-01',
        dateTo: '2025-02-14',
        accountId: 'acc-1',
        status: 'ready',
        createdAt: '2025-02-14T10:00:00',
        format: 'pdf',
    },
    {
        id: 'rpt-002',
        name: 'Отчет по дебиторам и кредиторам',
        type: 'counterparties',
        dateFrom: '2025-01-01',
        dateTo: '2025-02-14',
        accountId: 'acc-1',
        status: 'ready',
        createdAt: '2025-02-13T14:30:00',
        format: 'excel',
    },
    {
        id: 'rpt-003',
        name: 'Отчет о структуре остатков',
        type: 'balance_structure',
        dateFrom: '2025-01-01',
        dateTo: '2025-02-14',
        accountId: 'acc-1',
        status: 'processing',
        createdAt: '2025-02-14T11:15:00',
        format: 'pdf',
    },
];

export const mockCounterparties = [
    {
        id: 'cp-001',
        name: 'ООО Поставщик',
        inn: '7734567890',
        balance: -450000,
        transactions: 23,
        lastTransaction: '2025-02-14',
    },
    {
        id: 'cp-002',
        name: 'ООО Клиент',
        inn: '7723456789',
        balance: 1200000,
        transactions: 15,
        lastTransaction: '2025-02-13',
    },
    {
        id: 'cp-003',
        name: 'ИП Иванов',
        inn: '772234567890',
        balance: -150000,
        transactions: 8,
        lastTransaction: '2025-02-10',
    },
];

export const mockExpenseCategories = [
    { id: 1, name: 'Зарплата', sum: 2500000, percentage: 45, color: '#0050B3' },
    { id: 2, name: 'Аренда', sum: 800000, percentage: 14, color: '#10B981' },
    { id: 3, name: 'Коммунальные услуги', sum: 200000, percentage: 4, color: '#F59E0B' },
    { id: 4, name: 'Закупки', sum: 1200000, percentage: 22, color: '#8B5CF6' },
    { id: 5, name: 'Прочие расходы', sum: 600000, percentage: 11, color: '#EF4444' },
];

export const mockTransactionTags = [
    { id: 1, name: 'Срочные', sum: 500000, count: 15 },
    { id: 2, name: 'Договорные', sum: 2000000, count: 45 },
    { id: 3, name: 'Рекламные', sum: 350000, count: 8 },
    { id: 4, name: 'Операционные', sum: 1800000, count: 52 },
];

export const mockDocuments = [
    {
        id: 'doc-001',
        name: 'Реквизиты счета',
        type: 'account_details',
        uploadedAt: '2025-01-15',
        size: '125 KB',
    },
    {
        id: 'doc-002',
        name: 'Условия договора счета',
        type: 'agreement',
        uploadedAt: '2025-01-20',
        size: '320 KB',
    },
    {
        id: 'doc-003',
        name: 'Условия вклада',
        type: 'deposit_terms',
        uploadedAt: '2025-02-01',
        size: '210 KB',
    },
];

export const mockConsultantRequests = [
    {
        id: 'cr-001',
        date: '2025-02-14',
        subject: 'Консультация по оптимизации платежей',
        status: 'pending',
        consultant: 'Петр Сидоров',
    },
    {
        id: 'cr-002',
        date: '2025-02-10',
        subject: 'Консультация по налогообложению',
        status: 'completed',
        consultant: 'Мария Иванова',
    },
];

// ============= UTILITY FUNCTIONS =============

export const formatCurrency = (value: number, currency: string = 'RUB'): string => {
    const formatter = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
    return formatter.format(value);
};

export const getStatusColor = (status: string): string => {
    switch (status) {
        case 'draft':
            return 'default';
        case 'sent':
            return 'processing';
        case 'executed':
        case 'completed':
        case 'ready':
            return 'success';
        case 'failed':
        case 'rejected':
            return 'error';
        case 'pending':
            return 'warning';
        case 'processing':
            return 'processing';
        default:
            return 'default';
    }
};

export const getStatusLabel = (status: string): string => {
    switch (status) {
        case 'draft':
            return 'Черновик';
        case 'sent':
            return 'Отправлен';
        case 'executed':
            return 'Исполнен';
        case 'completed':
            return 'Завершено';
        case 'ready':
            return 'Готов';
        case 'failed':
            return 'Ошибка';
        case 'rejected':
            return 'Отклонено';
        case 'pending':
            return 'В ожидании';
        case 'processing':
            return 'Обработка';
        default:
            return status;
    }
};

export const getPaymentTypeLabel = (type: string): string => {
    switch (type) {
        case 'payment_order':
            return 'Платежное поручение';
        case 'transfer':
            return 'Перевод';
        case 'currency_exchange':
            return 'Валютная операция';
        case 'deposit':
            return 'Вклад';
        default:
            return type;
    }
};

export const maskCardNumber = (cardNumber: string): string => {
    if (cardNumber.length < 8) return cardNumber;
    return `${cardNumber.slice(0, 4)} **** **** ${cardNumber.slice(-4)}`;
};
