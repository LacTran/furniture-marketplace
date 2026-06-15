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
    <div className="space-x-4 text-sm">
      <a href="/posts" className="hover:underline">
        Browse
      </a>

      {token ? (
        <>
          <span className="text-gray-500">Hi, {user?.displayName}</span>
          <button onClick={handleLogout} className="hover:underline">
            Log out
          </button>
        </>
      ) : (
        <>
          <a href="/login" className="hover:underline">
            Log in
          </a>
          <a href="/register" className="hover:underline">
            Register
          </a>
        </>
      )}
    </div>
  );
}