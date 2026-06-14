import type { Metadata } from 'next';
import './globals.css';

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
        <nav className="border-b bg-white px-6 py-4">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <a href="/" className="font-semibold">
              Furniture Marketplace
            </a>
            <div className="space-x-4 text-sm">
              <a href="/login" className="hover:underline">
                Log in
              </a>
              <a href="/register" className="hover:underline">
                Register
              </a>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
