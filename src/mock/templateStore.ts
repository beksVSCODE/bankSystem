import { create } from 'zustand';

export interface AccountTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    actions: string[]; // IDs действий в этом шаблоне
    color?: string;
    icon?: string;
    createdAt: string;
    updatedAt: string;
    isDefault?: boolean;
}

interface TemplateStore {
    templates: AccountTemplate[];

    // Actions
    addTemplate: (template: Omit<AccountTemplate, 'id' | 'createdAt' | 'updatedAt'>) => AccountTemplate;
    updateTemplate: (id: string, updates: Partial<AccountTemplate>) => void;
    deleteTemplate: (id: string) => void;
    getTemplate: (id: string) => AccountTemplate | undefined;
    getTemplatesByCategory: (category: string) => AccountTemplate[];
    getAllTemplates: () => AccountTemplate[];

    // Default templates
    initializeDefaultTemplates: () => void;
}

const defaultTemplates: AccountTemplate[] = [
    {
        id: 'tpl-statements',
        name: 'Выписки и документы',
        description: 'Шаблон для работы с выписками и документацией',
        category: 'reports',
        actions: ['statement-download', 'statement-history', 'documents-contracts', 'documents-statements'],
        icon: 'FileTextOutlined',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDefault: true,
    },
    {
        id: 'tpl-payments',
        name: 'Платежи и переводы',
        description: 'Шаблон для быстрых платежей и переводов',
        category: 'payments',
        actions: ['transfers-payment-order', 'transfers-card-to-card'],
        icon: 'SendOutlined',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDefault: true,
    },
    {
        id: 'tpl-analytics',
        name: 'Аналитика и отчеты',
        description: 'Шаблон для анализа и создания отчетов',
        category: 'analytics',
        actions: ['reports-cash-flow', 'reports-calendar'],
        icon: 'BarChartOutlined',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDefault: true,
    },
    {
        id: 'tpl-cards',
        name: 'Управление картами',
        description: 'Шаблон для управления банковскими картами',
        category: 'cards',
        actions: ['cards-list'],
        icon: 'CreditCardOutlined',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDefault: true,
    },
    {
        id: 'tpl-settings',
        name: 'Настройки счета',
        description: 'Шаблон для управления настройками счета',
        category: 'settings',
        actions: ['settings-general', 'settings-security', 'settings-limits', 'settings-notifications'],
        icon: 'SettingOutlined',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDefault: true,
    },
];

export const useTemplateStore = create<TemplateStore>((set, get) => ({
    templates: [],

    addTemplate: (template) => {
        const newTemplate: AccountTemplate = {
            ...template,
            id: `tpl-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        set((state) => ({
            templates: [...state.templates, newTemplate],
        }));
        return newTemplate;
    },

    updateTemplate: (id, updates) => {
        set((state) => ({
            templates: state.templates.map((tpl) =>
                tpl.id === id
                    ? { ...tpl, ...updates, updatedAt: new Date().toISOString() }
                    : tpl
            ),
        }));
    },

    deleteTemplate: (id) => {
        set((state) => ({
            templates: state.templates.filter((tpl) => tpl.id !== id && !tpl.isDefault),
        }));
    },

    getTemplate: (id) => {
        return get().templates.find((tpl) => tpl.id === id);
    },

    getTemplatesByCategory: (category) => {
        return get().templates.filter((tpl) => tpl.category === category);
    },

    getAllTemplates: () => {
        return get().templates;
    },

    initializeDefaultTemplates: () => {
        const { templates } = get();
        if (templates.length === 0) {
            set({ templates: defaultTemplates });
        }
    },
}));

// Инициализация при загрузке модуля
useTemplateStore.getState().initializeDefaultTemplates();
