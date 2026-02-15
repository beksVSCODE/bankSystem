import type { PaymentTemplate } from './types';

export const mockPaymentTemplates: PaymentTemplate[] = [
    {
        id: 'tpl-1',
        accountId: 'acc-1',
        name: 'Оплата аренды офиса',
        type: 'payment_orders',
        values: {
            recipient: 'ООО Бизнес Центр',
            amount: 185000,
            purpose: 'Аренда офиса',
            recipientAccount: '40702810100000432123',
        },
        updatedAt: '2026-02-10T10:20:00',
    },
    {
        id: 'tpl-2',
        accountId: 'acc-1',
        name: 'Перевод ИП Смирнова',
        type: 'inside_bank',
        values: {
            recipient: 'ИП Смирнова Е.В.',
            amount: 32000,
            purpose: 'Оплата услуг',
        },
        updatedAt: '2026-02-11T09:10:00',
    },
];
