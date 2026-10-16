import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, User } from '../services/auth.service';
import { disconnectSocket } from '../services/socket.service';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string; company?: string }) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.login(email, password);
          localStorage.setItem('nomeryc_token', data.token);
          localStorage.setItem('nomeryc_refresh_token', data.refreshToken);
          set({
            user: data.user,
            token: data.token,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          const message = err.response?.data?.responseMessage || 'Erreur de connexion';
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authService.register(data);
          localStorage.setItem('nomeryc_token', res.token);
          localStorage.setItem('nomeryc_refresh_token', res.refreshToken);
          set({
            user: res.user,
            token: res.token,
            refreshToken: res.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          const message = err.response?.data?.responseMessage || 'Erreur d\'inscription';
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } finally {
          disconnectSocket();
          localStorage.removeItem('nomeryc_token');
          localStorage.removeItem('nomeryc_refresh_token');
          set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
        }
      },

      fetchMe: async () => {
        set({ isLoading: true });
        try {
          const user = await authService.getMe();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch {
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'nomeryc-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
