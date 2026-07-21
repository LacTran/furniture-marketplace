import React from 'react';
import { Button } from '@/components/ui/Button';

export interface PostsHeaderProps {
  token: string | null;
}

export function PostsHeader({ token }: PostsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight font-serif">Rehoming Listings</h1>
        <p className="text-slate-500 text-sm mt-1">Browse furniture needing transport across Helsinki.</p>
      </div>
      {token ? (
        <a href="/posts/new">
          <Button variant="primary">+ Post Item to Rehome</Button>
        </a>
      ) : (
        <a href="/login" className="text-sm font-bold text-primary hover:opacity-80 transition-opacity">
          Sign in to post requests &rarr;
        </a>
      )}
    </div>
  );
}
