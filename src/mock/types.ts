// Banking Data Types

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  avatar?: string;
  userType: 'individual' | 'business';
  createdAt: string;
  lastLogin: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'card' | 'checking' | 'savings' | 'deposit';
  currency: 'RUB' | 'USD' | 'EUR';
  balance: number;
  accountNumber: string;
  cardNumber?: string;
  expiryDate?: string;
  isActive: boolean;
  color: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: TransactionCategory;
  amount: number;
  type: 'income' | 'expense';
  accountId: string;
  merchant?: string;
  status: 'completed' | 'pending' | 'failed';
}

export type TransactionCategory = 
  | 'salary'
  | 'transfer'
  | 'shopping'
  | 'groceries'
  | 'transport'
  | 'entertainment'
  | 'utilities'
  | 'healthcare'
  | 'restaurants'
  | 'education'
  | 'investments'
  | 'other';

export interface CategoryInfo {
  name: string;
  nameRu: string;
  icon: string;
  color: string;
}

export interface AnalyticsData {
  period: string;
  income: number;
  expense: number;
}

export interface CategoryBreakdown {
  category: TransactionCategory;
  amount: number;
  percentage: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}
