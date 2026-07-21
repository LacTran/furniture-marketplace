'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { apiFetch, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { AdoptionBanner } from '@/components/landing/AdoptionBanner';
import { UserDashboard } from '@/components/landing/UserDashboard';
import { ApiInspector } from '@/components/landing/ApiInspector';

interface MeResponse {
  userId: string;
  email: string;
  roles: string[];
}

export default function HomePage() {
  const { token, user, logout } = useAuthStore();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      <div className="space-y-16 py-6">
        <HeroSection />
        <FeatureGrid />
        <AdoptionBanner />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight font-serif">
            Welcome back, <span className="text-primary">{user?.displayName}</span>!
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Manage your rehoming listings and active deliveries.</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/posts/new">
            <Button variant="primary">+ Create New Post</Button>
          </a>
          <Button variant="outline" onClick={logout}>Sign Out</Button>
        </div>
      </div>

      <UserDashboard user={user} />
      <ApiInspector meData={me} error={error} />
    </div>
  );
}
