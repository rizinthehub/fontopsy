import Link from 'next/link';
import { COPY } from '@/lib/copy';

export function Footer() {
  return (
    <footer className="w-full border-t border-border-subtle bg-bg-base">
      <div className="max-w-container mx-auto px-6 md:px-8 lg:px-12 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-tertiary font-sans">
            {COPY['footer.credits']}
          </p>
          <nav className="flex items-center gap-6" aria-label="Footer navigation">
            <Link
              href="/about"
              className="text-xs text-text-tertiary hover:text-text-secondary transition-colors duration-150"
            >
              {COPY['footer.about']}
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-tertiary hover:text-text-secondary transition-colors duration-150"
            >
              {COPY['footer.github']}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}