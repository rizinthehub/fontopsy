'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[Fontopsy] Global error:', error);
  }, [error]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-bg-base text-center px-6">
      <p className="font-mono text-xs text-text-tertiary uppercase tracking-widest mb-4">
        Error
      </p>
      <h1 className="font-sans text-2xl font-semibold text-text-primary mb-2">
        Something went wrong
      </h1>
      <p className="text-sm text-text-secondary mb-8 max-w-sm">
        An unexpected error occurred. Please try again.
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center h-10 px-4 bg-accent text-text-inverse text-sm font-semibold rounded-md hover:bg-accent-hover transition-colors duration-150"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center h-10 px-4 bg-surface text-text-primary text-sm font-semibold rounded-md border border-border hover:bg-surface-hover transition-colors duration-150"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}