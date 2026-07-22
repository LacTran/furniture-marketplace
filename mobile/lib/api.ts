import { useAuthStore } from '@/lib/auth-store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://furniture-marketplace-jkp7.onrender.com';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  token?: string | null;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      message = data.message ?? data.title ?? JSON.stringify(data.errors ?? data);
    } catch {
      // ignore — keep default message
    }

    // Auto-logout invalid or expired sessions silently
    if (res.status === 401) {
      useAuthStore.getState().logout();
    }

    throw new ApiError(message, res.status);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
