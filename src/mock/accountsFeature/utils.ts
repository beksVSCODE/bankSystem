export const formatMoney = (amount: number, currency: 'RUB' | 'USD' | 'EUR' = 'RUB') =>
    new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);

export const maskCard = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length < 8) {
        return value;
    }
    return `${digits.slice(0, 4)} **** **** ${digits.slice(-4)}`;
};

export const formatDate = (value: string | number | Date, withTime = false) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '—';
    }
    return date.toLocaleString('ru-RU', withTime ? undefined : { dateStyle: 'short' });
};
