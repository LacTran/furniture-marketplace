'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { BrandLogo } from '@/components/ui/BrandLogo';

interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  displayName: string;
  roles: string[];
}

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiFetch<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      setAuth(res.token, {
        userId: res.userId,
        email: res.email,
        displayName: res.displayName,
        roles: res.roles,
      });
      router.push('/');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 401 ? 'Invalid email or password.' : err.message);
      } else {
        setError('Something went wrong. Is the API running?');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md w-full mx-auto my-12">
      <Card>
        <CardHeader className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <BrandLogo />
          </div>
          <CardTitle className="text-2xl mt-1 text-foreground">Welcome Back</CardTitle>
          <CardDescription>Sign in to coordinate your furniture transport.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
                {error}
              </div>
            )}

            <Button type="submit" isLoading={loading} variant="primary" className="w-full">
              Sign In
            </Button>
          </CardContent>
        </form>

        <CardFooter className="justify-center text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <a href="/register" className="font-bold text-primary hover:opacity-80 underline transition-opacity ml-1">
            Register here
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
