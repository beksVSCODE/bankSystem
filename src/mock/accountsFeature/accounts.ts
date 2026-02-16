import type { AccountRecord } from './types';
import { mockAccounts, mockCards } from '@/mock/data';
import type { Account, Card } from '@/mock/types';

export const mockClientBankUsers = [
    { id: 'u-1', name: 'ООО Альфа Трейд' },
    { id: 'u-2', name: 'ИП Смирнова Е.В.' },
    { id: 'u-3', name: 'ООО Бета Сервис' },
];

export const mockFavoriteRecipients = [
    { id: 'fav-1', name: 'ООО Логистик Плюс', account: '40702810100000034567' },
    { id: 'fav-2', name: 'ООО ПартнерГрупп', account: '40702810500000099887' },
];

const mapAccountType = (account: Account): AccountRecord['type'] => {
    if (account.accountCategory === 'business') {
        return 'settlement';
    }
    if (account.accountType === 'savings') {
        return 'savings';
    }
    if (account.accountType === 'deposit') {
        return 'deposit';
    }
    return 'current';
};

const getTariff = (account: Account) =>
    account.accountCategory === 'business' ? 'Корпоративный Плюс' : 'Бизнес Стандарт';

const getCommission = (account: Account) =>
    account.accountCategory === 'business' ? '0.25% за платежные поручения' : '0.3% за внешние переводы';

export const mockAccountsCatalog: AccountRecord[] = mockAccounts.map((account) => ({
    id: account.id,
    name: account.name,
    type: mapAccountType(account),
    status: account.isActive ? 'active' : 'blocked',
    currency: account.currency,
    balance: account.balance,
    accountNumber: account.accountNumber,
    inn: account.accountCategory === 'business' ? '7708123456' : undefined,
    kpp: account.accountCategory === 'business' ? '770801001' : undefined,
    bik: account.accountCategory === 'business' ? '044525225' : undefined,
    correspondentAccount: account.accountCategory === 'business' ? '30101810400000000225' : undefined,
    interestRate: account.interestRate,
    termMonths: account.accountType === 'deposit' ? 12 : undefined,
    openedAt: account.createdAt,
    tariff: getTariff(account),
    commission: getCommission(account),
}));

const normalizeCardStatus = (status: Card['status']): 'active' | 'frozen' =>
    status === 'active' ? 'active' : 'frozen';

export const mockCardsByAccount: Record<
    string,
    Array<{ id: string; number: string; expiry: string; status: 'active' | 'frozen'; kind: string; dailyLimit: number; monthlyLimit: number }>
> = mockAccounts.reduce((acc, account) => {
    const cardsForAccount = mockCards
        .filter((card) => card.accountId === account.id)
        .map((card) => ({
            id: card.id,
            number: card.cardNumber,
            expiry: card.expiryDate,
            status: normalizeCardStatus(card.status),
            kind: card.cardType,
            dailyLimit: card.dailyLimit ?? 0,
            monthlyLimit: card.monthlyLimit ?? 0,
        }));
    return {
        ...acc,
        [account.id]: cardsForAccount,
    };
}, {} as Record<string, Array<{ id: string; number: string; expiry: string; status: 'active' | 'frozen'; kind: string; dailyLimit: number; monthlyLimit: number }>>);
