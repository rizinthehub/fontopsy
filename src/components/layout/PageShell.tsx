import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-dvh flex flex-col bg-bg-base text-text-primary">
      <Header />
      <main className="flex-1 w-full max-w-container mx-auto px-6 md:px-8 lg:px-12 py-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}