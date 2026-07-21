import React from 'react';

export function BrandLogo() {
  return (
    <a href="/" className="flex items-center gap-2 font-bold text-lg text-[var(--color-foreground)] hover:opacity-90 transition-opacity">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white font-black font-serif shadow-sm">
        K
      </span>
      <span className="tracking-tight font-extrabold font-serif text-xl text-[var(--color-foreground)]">
        Kyydissä
      </span>
    </a>
  );
}
