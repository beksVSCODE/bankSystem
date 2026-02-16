import type { ConsultantTicket, StatementRequestHistoryItem } from './types';

export const mockStatementRequests: StatementRequestHistoryItem[] = [
    { id: 'sr-1', accountId: 'acc-1', period: '01.02.2026 - 14.02.2026', createdAt: '2026-02-14T09:20:00', status: 'done' },
    { id: 'sr-2', accountId: 'acc-1', period: '01.01.2026 - 31.01.2026', createdAt: '2026-02-01T08:10:00', status: 'done' },
    { id: 'sr-3', accountId: 'acc-2', period: '01.02.2026 - 14.02.2026', createdAt: '2026-02-14T12:05:00', status: 'processing' },
];

export const mockConsultantTickets: ConsultantTicket[] = [
    { id: 'ct-1', accountId: 'acc-1', topic: 'Изменение лимита по счету', status: 'in_progress', createdAt: '2026-02-13T11:00:00' },
    { id: 'ct-2', accountId: 'acc-1', topic: 'Запрос на индивидуальный тариф', status: 'done', createdAt: '2026-02-09T15:42:00' },
    { id: 'ct-3', accountId: 'acc-2', topic: 'Проверка входящего платежа', status: 'open', createdAt: '2026-02-14T16:20:00' },
];

export const mockGeneratedReportFiles = [
    { id: 'gr-1', accountId: 'acc-1', name: 'Выписка_Февраль_2026.pdf', generatedAt: '2026-02-14T14:00:00' },
    { id: 'gr-2', accountId: 'acc-1', name: 'Структура_остатков_2026-02-14.xlsx', generatedAt: '2026-02-14T14:02:00' },
];
