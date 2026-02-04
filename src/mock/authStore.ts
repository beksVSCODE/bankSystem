import { create } from 'zustand';
import type { User, AuthState } from './types';
import { mockUser } from './data';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => boolean;
}

// Check localStorage for persisted auth state
const getInitialAuthState = (): AuthState => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('bankAuthState');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { isAuthenticated: false, user: null };
      }
    }
  }
  return { isAuthenticated: false, user: null };
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...getInitialAuthState(),

  login: async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock validation - accept any non-empty credentials
    if (email.trim() && password.trim()) {
      const authState = { isAuthenticated: true, user: mockUser };
      localStorage.setItem('bankAuthState', JSON.stringify(authState));
      set(authState);
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem('bankAuthState');
    set({ isAuthenticated: false, user: null });
  },

  checkAuth: () => {
    return get().isAuthenticated;
  },
}));
