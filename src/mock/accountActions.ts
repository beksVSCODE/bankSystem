/**
 * Mock данные для действий по счетам
 */

export interface AccountAction {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: 'statement' | 'payments' | 'reports' | 'documents' | 'settings';
}

export interface AccountSubAction {
    id: string;
    parentId: string;
    title: string;
    description: string;
    path: string;
}

// Основные действия
export const accountActions: AccountAction[] = [
    {
        id: 'statement',
        title: 'Выписка',
        description: 'Скачать выписку и посмотреть историю',
        icon: 'FileTextOutlined',
        category: 'statement',
    },
    {
        id: 'payments',
        title: 'Платежи и переводы',
        description: 'Управление платежами и переводами',
        icon: 'SendOutlined',
        category: 'payments',
    },
    {
        id: 'reports',
        title: 'Отчеты по счету',
        description: 'Аналитика и отчетность',
        icon: 'BarChartOutlined',
        category: 'reports',
    },
    {
        id: 'documents',
        title: 'Документы по счету',
        description: 'Договоры, справки и документы',
        icon: 'FolderOutlined',
        category: 'documents',
    },
    {
        id: 'settings',
        title: 'Настройки счета',
        description: 'Параметры и безопасность',
        icon: 'SettingOutlined',
        category: 'settings',
    },
];

// 1) ВЫПИСКА - подразделы
export const statementActions: AccountSubAction[] = [
    {
        id: 'statement-download',
        parentId: 'statement',
        title: 'Скачать PDF',
        description: 'Выписка за выбранный период',
        path: '/download',
    },
    {
        id: 'statement-history',
        parentId: 'statement',
        title: 'История выгрузок',
        description: 'Просмотр ранее скачанных выписок',
        path: '/history',
    },
];

// 2) ПЛАТЕЖИ И ПЕРЕВОДЫ - главные категории
export const paymentsMainActions: AccountSubAction[] = [
    {
        id: 'payments-transfers',
        parentId: 'payments',
        title: 'Платежи и переводы',
        description: 'Создание платежных документов',
        path: '/transfers',
    },
    {
        id: 'payments-invoicing',
        parentId: 'payments',
        title: 'Выставление счетов',
        description: 'Сервис выставления счетов',
        path: '/invoicing',
    },
    {
        id: 'payments-cards',
        parentId: 'payments',
        title: 'Банковские карты',
        description: 'Управление картами',
        path: '/cards',
    },
    {
        id: 'payments-accounts',
        parentId: 'payments',
        title: 'Банковские счета',
        description: 'Настройка счетов',
        path: '/accounts',
    },
    {
        id: 'payments-deposits-personal',
        parentId: 'payments',
        title: 'Вклад физ лиц',
        description: 'Открыть вклад или накопительный счет',
        path: '/deposits-personal',
    },
    {
        id: 'payments-deposits-business',
        parentId: 'payments',
        title: 'Депозиты и размещения',
        description: 'Для бизнеса',
        path: '/deposits-business',
    },
    {
        id: 'payments-credits',
        parentId: 'payments',
        title: 'Кредиты для бизнеса',
        description: 'Кредитные продукты',
        path: '/credits',
    },
    {
        id: 'payments-fx',
        parentId: 'payments',
        title: 'Валютные операции',
        description: 'Конверсия и ВЭД',
        path: '/fx',
    },
];

// 2а) Платежи и переводы - детальные операции
export const transfersSubActions: AccountSubAction[] = [
    {
        id: 'transfers-payment-order',
        parentId: 'payments-transfers',
        title: 'Платежные поручения',
        description: 'Создать платежное поручение',
        path: '/payment-order',
    },
    {
        id: 'transfers-card-to-card',
        parentId: 'payments-transfers',
        title: 'Перевод с карты на карту',
        description: 'Быстрый перевод между картами',
        path: '/card-to-card',
    },
    {
        id: 'transfers-arbitration',
        parentId: 'payments-transfers',
        title: 'Кабинет арбитражного управляющего',
        description: 'Специальные операции',
        path: '/arbitration',
    },
    {
        id: 'transfers-bulk',
        parentId: 'payments-transfers',
        title: 'Массовые платежи',
        description: 'Загрузка реестра платежей',
        path: '/bulk-payments',
    },
    {
        id: 'transfers-to-individual',
        parentId: 'payments-transfers',
        title: 'Перевод в адрес физического лица',
        description: 'Перевод физлицу',
        path: '/to-individual',
    },
    {
        id: 'transfers-intra-bank',
        parentId: 'payments-transfers',
        title: 'Перевод внутри банка',
        description: 'Между клиентами банка',
        path: '/intra-bank',
    },
    {
        id: 'transfers-own-accounts',
        parentId: 'payments-transfers',
        title: 'Перевод между своими счетами',
        description: 'Внутренний перевод',
        path: '/own-accounts',
    },
    {
        id: 'transfers-qr',
        parentId: 'payments-transfers',
        title: 'Платеж по QR коду',
        description: 'Оплата через QR',
        path: '/qr-payment',
    },
];

// 2б) Выставление счетов
export const invoicingSubActions: AccountSubAction[] = [
    {
        id: 'invoicing-service',
        parentId: 'payments-invoicing',
        title: 'Сервис выставления счетов',
        description: 'Создать и отправить счет',
        path: '/service',
    },
];

// 2в) Банковские карты
export const cardsSubActions: AccountSubAction[] = [
    {
        id: 'cards-list',
        parentId: 'payments-cards',
        title: 'Мои карты',
        description: 'Управление картами',
        path: '/list',
    },
];

// 2г) Банковские счета
export const accountsSubActions: AccountSubAction[] = [
    {
        id: 'accounts-settings',
        parentId: 'payments-accounts',
        title: 'Настройка счета',
        description: 'Параметры счета',
        path: '/settings',
    },
    {
        id: 'accounts-contract',
        parentId: 'payments-accounts',
        title: 'Параметры договора',
        description: 'Условия договора',
        path: '/contract',
    },
];

// 2д) Вклад физ лиц
export const depositsPersonalSubActions: AccountSubAction[] = [
    {
        id: 'deposits-personal-open',
        parentId: 'payments-deposits-personal',
        title: 'Открыть вклад',
        description: 'Срочный вклад',
        path: '/open-deposit',
    },
    {
        id: 'deposits-personal-savings',
        parentId: 'payments-deposits-personal',
        title: 'Открыть накопительный счет',
        description: 'Счет с процентами',
        path: '/open-savings',
    },
];

// 2е) Депозиты и размещения
export const depositsBusinessSubActions: AccountSubAction[] = [
    {
        id: 'deposits-business-deposits',
        parentId: 'payments-deposits-business',
        title: 'Депозиты бизнесу',
        description: 'Корпоративные депозиты',
        path: '/deposits',
    },
    {
        id: 'deposits-business-placements',
        parentId: 'payments-deposits-business',
        title: 'Размещения',
        description: 'Финансовые размещения',
        path: '/placements',
    },
];

// 2ж) Кредиты для бизнеса
export const creditsSubActions: AccountSubAction[] = [
    {
        id: 'credits-guarantees',
        parentId: 'payments-credits',
        title: 'Гарантии',
        description: 'Банковские гарантии',
        path: '/guarantees',
    },
    {
        id: 'credits-application',
        parentId: 'payments-credits',
        title: 'Заявка на кредитный продукт',
        description: 'Подать заявку',
        path: '/application',
    },
    {
        id: 'credits-list',
        parentId: 'payments-credits',
        title: 'Кредиты',
        description: 'Действующие кредиты',
        path: '/list',
    },
];

// 2з) Валютные операции
export const fxSubActions: AccountSubAction[] = [
    {
        id: 'fx-alternative',
        parentId: 'payments-fx',
        title: 'Альтернативные расчеты',
        description: 'Специальные схемы расчетов',
        path: '/alternative',
    },
    {
        id: 'fx-ved-info',
        parentId: 'payments-fx',
        title: 'Информирование ВЭД',
        description: 'Уведомления по ВЭД',
        path: '/ved-info',
    },
    {
        id: 'fx-conversion',
        parentId: 'payments-fx',
        title: 'Конверсионные операции',
        description: 'Обмен валюты',
        path: '/conversion',
    },
    {
        id: 'fx-special-rate',
        parentId: 'payments-fx',
        title: 'Обмен валют по спец курсу',
        description: 'Индивидуальный курс',
        path: '/special-rate',
    },
    {
        id: 'fx-ved-notification',
        parentId: 'payments-fx',
        title: 'Уведомление ВЭД',
        description: 'Подать уведомление',
        path: '/ved-notification',
    },
];

// 3) ОТЧЕТЫ ПО СЧЕТУ - главные категории
export const reportsMainActions: AccountSubAction[] = [
    {
        id: 'reports-reports',
        parentId: 'reports',
        title: 'Отчеты',
        description: 'Аналитические отчеты',
        path: '/reports',
    },
    {
        id: 'reports-documents',
        parentId: 'reports',
        title: 'Документы',
        description: 'Служебные документы',
        path: '/documents',
    },
    {
        id: 'reports-consultant',
        parentId: 'reports',
        title: 'Персональный консультант',
        description: 'Помощь специалиста',
        path: '/consultant',
    },
];

// 3а) Отчеты
export const reportsSubActions: AccountSubAction[] = [
    {
        id: 'reports-statement',
        parentId: 'reports-reports',
        title: 'Выписка по счету',
        description: 'Детальная выписка',
        path: '/statement',
    },
    {
        id: 'reports-cash-flow',
        parentId: 'reports-reports',
        title: 'График движения средств',
        description: 'Визуализация движения',
        path: '/cash-flow',
    },
    {
        id: 'reports-debtors-creditors',
        parentId: 'reports-reports',
        title: 'Дебиторы и кредиторы',
        description: 'Контрагенты',
        path: '/debtors-creditors',
    },
    {
        id: 'reports-history',
        parentId: 'reports-reports',
        title: 'История запросов выписок и приложений',
        description: 'Архив запросов',
        path: '/history',
    },
    {
        id: 'reports-calendar',
        parentId: 'reports-reports',
        title: 'Календарь транзакций',
        description: 'Операции по датам',
        path: '/calendar',
    },
    {
        id: 'reports-feed',
        parentId: 'reports-reports',
        title: 'Лента операций',
        description: 'Все операции',
        path: '/feed',
    },
    {
        id: 'reports-business',
        parentId: 'reports-reports',
        title: 'Мой бизнес',
        description: 'Бизнес-аналитика',
        path: '/business',
    },
    {
        id: 'reports-spending',
        parentId: 'reports-reports',
        title: 'На что я трачу',
        description: 'Анализ расходов',
        path: '/spending',
    },
    {
        id: 'reports-tags',
        parentId: 'reports-reports',
        title: 'Отчет по тегам',
        description: 'Группировка по тегам',
        path: '/tags',
    },
    {
        id: 'reports-balance-structure',
        parentId: 'reports-reports',
        title: 'Структура остатков',
        description: 'Распределение средств',
        path: '/balance-structure',
    },
];

// 3б) Документы
export const reportsDocumentsSubActions: AccountSubAction[] = [
    {
        id: 'reports-docs-counterparty-check',
        parentId: 'reports-documents',
        title: 'История проверки контрагентов',
        description: 'Проверка надежности',
        path: '/counterparty-check',
    },
    {
        id: 'reports-docs-tariffs',
        parentId: 'reports-documents',
        title: 'Мои тарифы',
        description: 'Тарифные планы',
        path: '/tariffs',
    },
    {
        id: 'reports-docs-requisites',
        parentId: 'reports-documents',
        title: 'Реквизиты счета',
        description: 'Банковские реквизиты',
        path: '/requisites',
    },
    {
        id: 'reports-docs-contract-terms',
        parentId: 'reports-documents',
        title: 'Условия договора счета',
        description: 'Договор обслуживания',
        path: '/contract-terms',
    },
];

// 3в) Персональный консультант
export const consultantSubActions: AccountSubAction[] = [
    {
        id: 'consultant-requests',
        parentId: 'reports-consultant',
        title: 'История запросов услуг',
        description: 'Обращения к консультанту',
        path: '/requests',
    },
    {
        id: 'consultant-reports',
        parentId: 'reports-consultant',
        title: 'Сформированные отчеты',
        description: 'Отчеты от консультанта',
        path: '/reports',
    },
];

// 4) ДОКУМЕНТЫ ПО СЧЕТУ
export const documentsActions: AccountSubAction[] = [
    {
        id: 'documents-contracts',
        parentId: 'documents',
        title: 'Договоры',
        description: 'Договоры обслуживания',
        path: '/contracts',
    },
    {
        id: 'documents-statements',
        parentId: 'documents',
        title: 'Выписки',
        description: 'Архив выписок',
        path: '/statements',
    },
    {
        id: 'documents-certificates',
        parentId: 'documents',
        title: 'Справки',
        description: 'Справки о состоянии счета',
        path: '/certificates',
    },
    {
        id: 'documents-notifications',
        parentId: 'documents',
        title: 'Уведомления',
        description: 'Банковские уведомления',
        path: '/notifications',
    },
    {
        id: 'documents-tariffs',
        parentId: 'documents',
        title: 'Тарифы',
        description: 'Тарифные документы',
        path: '/tariffs',
    },
    {
        id: 'documents-tax',
        parentId: 'documents',
        title: 'Налоговые документы',
        description: 'Документы для налоговой',
        path: '/tax',
    },
];

// 5) НАСТРОЙКИ СЧЕТА
export const settingsActions: AccountSubAction[] = [
    {
        id: 'settings-general',
        parentId: 'settings',
        title: 'Общие настройки',
        description: 'Название, лимиты, уведомления',
        path: '/general',
    },
    {
        id: 'settings-security',
        parentId: 'settings',
        title: 'Безопасность',
        description: 'Пароли, двухфакторная аутентификация',
        path: '/security',
    },
    {
        id: 'settings-limits',
        parentId: 'settings',
        title: 'Лимиты и ограничения',
        description: 'Установка лимитов операций',
        path: '/limits',
    },
    {
        id: 'settings-notifications',
        parentId: 'settings',
        title: 'Уведомления',
        description: 'Push, SMS, email уведомления',
        path: '/notifications',
    },
    {
        id: 'settings-access',
        parentId: 'settings',
        title: 'Доступ',
        description: 'Управление доступом',
        path: '/access',
    },
    {
        id: 'settings-close',
        parentId: 'settings',
        title: 'Закрытие счета',
        description: 'Закрыть счет',
        path: '/close',
    },
];

// Функция получения подразделов по ID родителя
export const getSubActionsByParentId = (parentId: string): AccountSubAction[] => {
    const allSubActions = [
        ...statementActions,
        ...paymentsMainActions,
        ...transfersSubActions,
        ...invoicingSubActions,
        ...cardsSubActions,
        ...accountsSubActions,
        ...depositsPersonalSubActions,
        ...depositsBusinessSubActions,
        ...creditsSubActions,
        ...fxSubActions,
        ...reportsMainActions,
        ...reportsSubActions,
        ...reportsDocumentsSubActions,
        ...consultantSubActions,
        ...documentsActions,
        ...settingsActions,
    ];

    return allSubActions.filter(action => action.parentId === parentId);
};

// Функция получения действия по ID
export const getActionById = (id: string): AccountSubAction | undefined => {
    const allSubActions = [
        ...statementActions,
        ...paymentsMainActions,
        ...transfersSubActions,
        ...invoicingSubActions,
        ...cardsSubActions,
        ...accountsSubActions,
        ...depositsPersonalSubActions,
        ...depositsBusinessSubActions,
        ...creditsSubActions,
        ...fxSubActions,
        ...reportsMainActions,
        ...reportsSubActions,
        ...reportsDocumentsSubActions,
        ...consultantSubActions,
        ...documentsActions,
        ...settingsActions,
    ];

    return allSubActions.find(action => action.id === id);
};
