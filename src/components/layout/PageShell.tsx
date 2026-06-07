import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-dvh flex flex-col bg-bg-base text-text-primary">
      {/* Skip to main content — screen reader + keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-text-inverse focus:rounded-md focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      <Header />
      <main
        id="main-content"
        className="flex-1 w-full max-w-container mx-auto px-6 md:px-8 lg:px-12 py-10"
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}