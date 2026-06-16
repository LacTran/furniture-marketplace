import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export interface AuthUser {
  userId: string;
  email: string;
  displayName: string;
  roles: string[];
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean; // true while we're checking SecureStore on app launch
  setAuth: (token: string, user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

// SecureStore has no React-binding "persist" middleware the way localStorage
// does on web (zustand/middleware's `persist` assumes synchronous storage),
// so we hand-roll the load/save logic instead. SecureStore is async and
// backed by Keychain (iOS) / Keystore (Android) — appropriate for a JWT.
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true,

  setAuth: async (token, user) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    set({ token, user });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    set({ token: null, user: null });
  },

  // Called once on app launch to restore a previous session.
  loadFromStorage: async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const userJson = await SecureStore.getItemAsync(USER_KEY);
    set({
      token,
      user: userJson ? JSON.parse(userJson) : null,
      isLoading: false,
    });
  },
}));
