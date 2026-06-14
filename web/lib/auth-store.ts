'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Matches the AuthResponse record from the .NET API (AuthDtos.cs)
export interface AuthUser {
  userId: string;
  email: string;
  displayName: string;
  roles: string[];
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
}

// Persisted to localStorage so the user stays logged in across page reloads.
// This is a normal web app (not a Claude artifact), so localStorage is fine here.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
