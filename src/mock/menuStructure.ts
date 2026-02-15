import {
    SendOutlined,
    FileTextOutlined,
    CreditCardOutlined,
    BankOutlined,
    DollarOutlined,
    SafetyCertificateOutlined,
    SwapOutlined,
    CloudUploadOutlined,
    AppstoreOutlined,
} from '@ant-design/icons';
import type { FC } from 'react';

export interface MenuItem {
    id: string;
    label: string;
    icon?: FC<{ className?: string }>;
    componentId?: string; // для связи с компонентом
    items?: MenuItem[]; // для подменю
}

export const paymentsMenuStructure: MenuItem[] = [
    {
        id: 'transfers',
        label: 'ПЛАТЕЖИ И ПЕРЕВОДЫ',
        icon: SendOutlined,
        items: [
            { id: 'payment_orders', label: 'платежные поручения', componentId: 'payment_orders' },
            { id: 'transfer_to_personal', label: 'перевод с расчетного счета на свой счет физ лица', componentId: 'transfer_to_personal' },
            { id: 'currency_exchange', label: 'валютная операция', componentId: 'currency_exchange' },
            { id: 'card_to_card', label: 'перевод с карты на карту', componentId: 'card_to_card' },
            { id: 'sberbank_transfer', label: 'перевод клиенту СберБанка', componentId: 'sberbank_transfer' },
            { id: 'scheduled_payments', label: 'платежи по календарю', componentId: 'scheduled_payments' },
            { id: 'card_replenishment', label: 'пополнить расчетный счет с карты любого банка', componentId: 'card_replenishment' },
            { id: 'arbitration_office', label: 'кабинет арбитражного управления', componentId: 'arbitration_office' },
            { id: 'mass_payments', label: 'массовые платежи', componentId: 'mass_payments' },
            { id: 'bank_messages', label: 'переписка с банком', componentId: 'bank_messages' },
            { id: 'qr_payment', label: 'платеж по qr коду', componentId: 'qr_payment' },
            { id: 'registry_payments', label: 'реестровые перечисления', componentId: 'registry_payments' },
        ],
    },
    {
        id: 'invoicing',
        label: 'ВЫСТАВЛЕНИЕ СЧЕТОВ',
        icon: FileTextOutlined,
        items: [
            { id: 'invoice_service', label: 'сервис выставления счетов', componentId: 'invoice_service' },
        ],
    },
    {
        id: 'bank_cards',
        label: 'БАНКОВСКИЕ КАРТЫ',
        icon: CreditCardOutlined,
        items: [
            { id: 'cards', label: 'карты', componentId: 'cards' },
        ],
    },
    {
        id: 'bank_accounts',
        label: 'БАНКОВСКИЕ СЧЕТА',
        icon: BankOutlined,
        items: [
            { id: 'account_settings', label: 'настройка счета', componentId: 'account_settings' },
            { id: 'contract_parameters', label: 'параметры договора', componentId: 'contract_parameters' },
        ],
    },
    {
        id: 'deposits',
        label: 'ДЕПОЗИТЫ И РАЗМЕЩЕНИЯ',
        icon: SafetyCertificateOutlined,
        items: [
            { id: 'business_deposits', label: 'депозиты бизнесу', componentId: 'business_deposits' },
            { id: 'placements', label: 'размещения', componentId: 'placements' },
        ],
    },
    {
        id: 'credits',
        label: 'КРЕДИТЫ ДЛЯ БИЗНЕСА',
        icon: DollarOutlined,
        items: [
            { id: 'guarantees', label: 'гарантии', componentId: 'guarantees' },
            { id: 'credit_application', label: 'заявка на кредитный продукт', componentId: 'credit_application' },
            { id: 'credits', label: 'кредиты', componentId: 'credits' },
        ],
    },
    {
        id: 'currency_operations',
        label: 'ВАЛЮТНЫЕ ОПЕРАЦИИ',
        icon: SwapOutlined,
        items: [
            { id: 'currency_ops', label: 'валютные операции', componentId: 'currency_ops' },
            { id: 'currency_control_docs', label: 'документы валютного контроля', componentId: 'currency_control_docs' },
            { id: 'conversion_ops', label: 'конверсионные операции', componentId: 'conversion_ops' },
            { id: 'currency_exchange_spec', label: 'обмен валюты по спец курсу', componentId: 'currency_exchange_spec' },
        ],
    },
    {
        id: 'uploads',
        label: 'ВЫГРУЗКИ И ЗАГРУЗКИ',
        icon: CloudUploadOutlined,
        items: [
            { id: '1c_upload', label: 'загрузить документы из 1С', componentId: '1c_upload' },
            { id: 'counterparties_upload', label: 'загрузить контрагентов', componentId: 'counterparties_upload' },
            { id: 'upload_history', label: 'история запросов выписок и приложений', componentId: 'upload_history' },
        ],
    },
    {
        id: 'other',
        label: 'ДРУГИЕ ОПЕРАЦИИ',
        icon: AppstoreOutlined,
        items: [
            { id: 'gov_services', label: 'гос услуги', componentId: 'gov_services' },
            { id: 'salary_project', label: 'зарплатный проект', componentId: 'salary_project' },
            { id: 'mobile_notify', label: 'мобильное информирование', componentId: 'mobile_notify' },
            { id: 'update_balances', label: 'обновить остатки', componentId: 'update_balances' },
            { id: 'insurance', label: 'страхование АУ', componentId: 'insurance' },
        ],
    },
];

export const reportsMenuStructure: MenuItem[] = [
    {
        id: 'reports',
        label: 'ОТЧЕТЫ',
        icon: FileTextOutlined,
        items: [
            { id: 'account_statement', label: 'выписка по счету', componentId: 'account_statement' },
            { id: 'balance_movement', label: 'график движения средств', componentId: 'balance_movement' },
            { id: 'counterparties', label: 'дебиторы и кредиторы', componentId: 'counterparties' },
            { id: 'transaction_calendar', label: 'календарь транзакций', componentId: 'transaction_calendar' },
            { id: 'spending_analysis', label: 'на что я трачу', componentId: 'spending_analysis' },
            { id: 'tag_report', label: 'отчет по тегам', componentId: 'tag_report' },
            { id: 'balance_structure', label: 'структура остатков', componentId: 'balance_structure' },
        ],
    },
    {
        id: 'documents',
        label: 'ДОКУМЕНТЫ',
        icon: FileTextOutlined,
        items: [
            { id: 'counterparty_check_history', label: 'история проверки контрагентов', componentId: 'counterparty_check_history' },
            { id: 'tariffs', label: 'мои тарифы', componentId: 'tariffs' },
            { id: 'counterparty_check', label: 'проверка контрагентов', componentId: 'counterparty_check' },
            { id: 'account_details', label: 'реквизиты счета', componentId: 'account_details' },
            { id: 'deposit_terms', label: 'условия вклада', componentId: 'deposit_terms' },
            { id: 'agreement_terms', label: 'условия договора счета', componentId: 'agreement_terms' },
        ],
    },
    {
        id: 'consultant',
        label: 'ПЕРСОНАЛЬНЫЙ КОНСУЛЬТАНТ',
        icon: FileTextOutlined,
        items: [
            { id: 'consultant_requests', label: 'история запросов услуг', componentId: 'consultant_requests' },
            { id: 'generated_reports', label: 'сформированные отчеты', componentId: 'generated_reports' },
        ],
    },
];

// Helper функция для поиска элемента по id
export const findMenuItemById = (items: MenuItem[], id: string): MenuItem | undefined => {
    for (const item of items) {
        if (item.id === id) return item;
        if (item.items) {
            const found = findMenuItemById(item.items, id);
            if (found) return found;
        }
    }
    return undefined;
};

// Helper функция для получения всех листовых пунктов (component items)
export const getAllComponentItems = (items: MenuItem[]): MenuItem[] => {
    let result: MenuItem[] = [];
    for (const item of items) {
        if (!item.items || item.items.length === 0) {
            result.push(item);
        } else {
            result = result.concat(getAllComponentItems(item.items));
        }
    }
    return result;
};
