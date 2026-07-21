import React from 'react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { NavLinks } from '@/app/NavLinks';

export function Navbar() {
  return (
    <header className="layout-header">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <BrandLogo />
        <NavLinks />
      </div>
    </header>
  );
}
