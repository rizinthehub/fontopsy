'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full',
        'bg-bg-base/80 backdrop-blur-md',
        'border-b border-border-subtle',
      )}
    >
      <div className="max-w-container mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Fontopsy home">
            <Image
              src="/logo-mark.svg"
              alt=""
              width={28}
              height={28}
              aria-hidden="true"
            />
            <span className="font-sans font-semibold text-base text-text-primary tracking-tight">
              Fontopsy
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <Link
              href="/about"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150"
            >
              About
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
          >
            <Icon name={mobileMenuOpen ? 'x' : 'menu'} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border-subtle bg-bg-elevated px-6 py-4">
          <nav aria-label="Mobile navigation">
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-text-secondary hover:text-text-primary py-2 transition-colors"
            >
              About
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}