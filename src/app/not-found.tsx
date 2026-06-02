import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';

export default function NotFound() {
  return (
    <PageShell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="font-mono text-xs text-text-tertiary uppercase tracking-widest mb-4">
          404
        </p>
        <h1 className="font-sans text-2xl font-semibold text-text-primary mb-2">
          Page not found
        </h1>
        <p className="text-sm text-text-secondary mb-8">
          This page doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-10 px-4 bg-accent text-text-inverse text-sm font-semibold rounded-md hover:bg-accent-hover transition-colors duration-150"
        >
          Back Home
        </Link>
      </div>
    </PageShell>
  );
}