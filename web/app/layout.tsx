import type { Metadata } from 'next';
import './globals.css';
import { ApiWarmup } from './ApiWarmup';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'Kyydissä — Give Furniture a Second Home',
  description: 'A lightweight two-sided marketplace connecting people rehoming furniture with local drivers with spare trunk space in Helsinki.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] flex flex-col font-jost">
        <ApiWarmup />
        <Navbar />
        <main className="layout-main">
          {children}
        </main>
      </body>
    </html>
  );
}
