'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';

export function NavLinks() {
  const router = useRouter();
  const { token, user, logout } = useAuthStore();

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <div className="flex items-center gap-6 text-sm font-medium">
      <a href="/posts" className="text-foreground/80 hover:text-primary transition-colors">
        Browse Listings
      </a>

      {token ? (
        <div className="flex items-center gap-4">
          <span className="rounded-full bg-background px-3 py-1.5 text-xs text-primary font-semibold border border-border">
            {user?.displayName}
          </span>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-white hover:bg-rose-50 hover:text-rose-600 border border-border px-3.5 py-1.5 text-foreground transition-colors font-medium cursor-pointer"
          >
            Log out
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <a href="/login" className="text-foreground/80 hover:text-primary transition-colors">
            Log in
          </a>
          <a
            href="/register"
            className="rounded-lg bg-accent hover:opacity-90 text-white px-4 py-2 transition-all font-semibold shadow-sm hover:-translate-y-0.5"
          >
            Get Started
          </a>
        </div>
      )}
    </div>
  );
}