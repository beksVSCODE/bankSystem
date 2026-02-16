export * from './types';
export * from './accounts';
export * from './transactions';
export * from './templates';
export * from './reports';
export * from './documents';
export * from './menu';
export * from './operations';
export * from './utils';

import { formatMoney, maskCard } from './utils';

export const formatAccountCurrency = formatMoney;
export const maskAccountNumber = maskCard;
