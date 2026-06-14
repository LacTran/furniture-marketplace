// Thin wrapper around fetch for talking to the .NET API.
//
// Why a wrapper instead of calling fetch() directly everywhere?
// - One place to set the base URL (from env var)
// - One place to attach the Authorization header when the user is logged in
// - One place to handle non-2xx responses consistently

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

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
    // Try to extract a useful message from the API's error response,
    // but don't blow up if the body isn't JSON.
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      message = data.message ?? data.title ?? JSON.stringify(data.errors ?? data);
    } catch {
      // ignore — keep default message
    }
    throw new ApiError(message, res.status);
  }

  // Some endpoints (e.g. health check) might return empty bodies.
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
