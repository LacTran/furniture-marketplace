import type { Metadata } from 'next';
import './globals.css';
import { ApiWarmup } from './ApiWarmup';
import { NavLinks } from './NavLinks';

export const metadata: Metadata = {
  title: 'Furniture Marketplace',
  description: 'Small furniture delivery marketplace — portfolio project',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <ApiWarmup />
        <nav className="border-b bg-white px-6 py-4">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <a href="/" className="font-semibold">
              Furniture Marketplace
            </a>
            <NavLinks />
          </div>
        </nav>
        <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
