'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { apiFetch, ApiError } from '@/lib/api';

interface MeResponse {
  userId: string;
  email: string;
  roles: string[];
}

export default function HomePage() {
  const { token, user, logout } = useAuthStore();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // On load, if we have a token, call /api/auth/me to prove the
  // whole chain works: Next.js -> .NET API -> JWT validation -> DB lookup.
  useEffect(() => {
    if (!token) return;

    apiFetch<MeResponse>('/api/auth/me', { token })
      .then(setMe)
      .catch((err) => {
        if (err instanceof ApiError) {
          setError(`${err.status}: ${err.message}`);
        } else {
          setError('Failed to reach the API. Is it running on localhost:5000?');
        }
      });
  }, [token]);

  if (!token) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Welcome 👋</h1>
        <p className="text-gray-600">
          You&apos;re not logged in. Try{' '}
          <a href="/register" className="underline">
            registering
          </a>{' '}
          or{' '}
          <a href="/login" className="underline">
            logging in
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Welcome back, {user?.displayName} 👋</h1>

      <div className="rounded border bg-white p-4">
        <h2 className="mb-2 font-semibold">/api/auth/me response:</h2>
        {error && <p className="text-red-600">{error}</p>}
        {me ? (
          <pre className="rounded bg-gray-100 p-3 text-sm">
            {JSON.stringify(me, null, 2)}
          </pre>
        ) : !error ? (
          <p className="text-gray-500">Loading...</p>
        ) : null}
      </div>

      <button
        onClick={logout}
        className="rounded bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
      >
        Log out
      </button>
    </div>
  );
}
