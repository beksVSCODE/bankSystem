export interface AccountMenuItem {
    key: string;
    label: string;
}

export interface AccountMenuGroup extends AccountMenuItem {
    items: AccountMenuItem[];
}

export const accountPrimaryTabs: AccountMenuItem[] = [
    { key: 'overview', label: 'Обзор' },
    { key: 'statement', label: 'Выписка и операции' },
    { key: 'payments', label: 'Платежи и переводы' },
    { key: 'products', label: 'Продукты по счету' },
    { key: 'reports', label: 'Отчеты и аналитика' },
    { key: 'documents', label: 'Документы по счету' },
    { key: 'settings', label: 'Настройки счета' },
];

export const accountPaymentsMenu: AccountMenuGroup[] = [
    {
        key: 'base_payments',
        label: 'Платежи и переводы',
        items: [
            { key: 'payment_orders', label: 'Платежные поручения' },
            { key: 'card_to_card', label: 'Перевод с карты на карту' },
            { key: 'arbitration', label: 'Кабинет арбитражного управляющего' },
            { key: 'mass_payments', label: 'Массовые платежи' },
            { key: 'to_person', label: 'Перевод в адрес физического лица' },
            { key: 'inside_bank', label: 'Перевод внутри банка' },
            { key: 'between_own_accounts', label: 'Перевод между своими счетами' },
            { key: 'qr_payment', label: 'Платеж по QR коду' },
            { key: 'calendar_payments', label: 'Платежи по календарю' },
        ],
    },
    {
        key: 'invoices',
        label: 'Выставление счетов',
        items: [{ key: 'invoice_service', label: 'Сервис выставления счетов' }],
    },
    {
        key: 'templates',
        label: 'Шаблоны',
        items: [
            { key: 'templates', label: 'Шаблоны платежей' },
            { key: 'favorites', label: 'Избранные платежи' },
            { key: 'autopay', label: 'Автоплатежи' },
        ],
    },
    {
        key: 'cards',
        label: 'Банковские карты',
        items: [{ key: 'bank_cards', label: 'Карты и лимиты' }],
    },
    {
        key: 'bank_accounts',
        label: 'Банковские счета',
        items: [
            { key: 'bank_account_settings', label: 'Настройка счета' },
            { key: 'contract_params', label: 'Параметры договора' },
        ],
    },
    {
        key: 'deposits_people',
        label: 'Вклад физ лиц',
        items: [
            { key: 'open_deposit', label: 'Открыть вклад' },
            { key: 'open_savings', label: 'Открыть накопительный счет' },
        ],
    },
    {
        key: 'deposits_business',
        label: 'Депозиты и размещения',
        items: [
            { key: 'business_deposits', label: 'Депозиты бизнесу' },
            { key: 'placements', label: 'Размещения' },
        ],
    },
    {
        key: 'business_credits',
        label: 'Кредиты для бизнеса',
        items: [
            { key: 'guarantees', label: 'Гарантии' },
            { key: 'credit_request', label: 'Заявка на кредитный продукт' },
            { key: 'credits', label: 'Кредиты' },
        ],
    },
    {
        key: 'fx',
        label: 'Валютные операции',
        items: [
            { key: 'alternative_settlements', label: 'Альтернативные расчеты' },
            { key: 'ved_notifications', label: 'Информирование ВЭД' },
            { key: 'conversion_ops', label: 'Конверсионные операции' },
            { key: 'special_rate', label: 'Обмен валют по спец курсу' },
            { key: 'ved_notice', label: 'Уведомление ВЭД' },
        ],
    },
];

export const accountReportsMenu: AccountMenuGroup[] = [
    {
        key: 'reports_group',
        label: 'Отчеты',
        items: [
            { key: 'r_statement', label: 'Выписка по счету' },
            { key: 'r_movement', label: 'График движения средств' },
            { key: 'r_debtors', label: 'Дебиторы и кредиторы' },
            { key: 'r_history', label: 'История запросов выписок и приложений' },
            { key: 'r_calendar', label: 'Календарь транзакций' },
            { key: 'r_timeline', label: 'Лента операций' },
            { key: 'r_business', label: 'Мой бизнес' },
            { key: 'r_spending', label: 'На что я трачу' },
            { key: 'r_tags', label: 'Отчет по тегам' },
            { key: 'r_structure', label: 'Структура остатков' },
        ],
    },
    {
        key: 'docs_group',
        label: 'Документы',
        items: [
            { key: 'd_checks', label: 'История проверки контрагентов' },
            { key: 'd_tariffs', label: 'Мои тарифы' },
            { key: 'd_requisites', label: 'Реквизиты счета' },
            { key: 'd_agreement', label: 'Условия договора счета' },
            { key: 'd_archive', label: 'Архив заявлений' },
        ],
    },
    {
        key: 'consultant_group',
        label: 'Персональный консультант',
        items: [
            { key: 'c_requests', label: 'История запросов услуг' },
            { key: 'c_reports', label: 'Сформированные отчеты' },
            { key: 'c_chat', label: 'Чат с менеджером' },
        ],
    },
];
