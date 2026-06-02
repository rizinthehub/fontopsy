'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-text-inverse hover:bg-accent-hover active:bg-accent-pressed disabled:opacity-30 disabled:cursor-not-allowed',
  secondary:
    'bg-surface text-text-primary border border-border hover:bg-surface-hover hover:border-border-strong disabled:text-text-disabled disabled:border-border-subtle disabled:cursor-not-allowed',
  ghost:
    'bg-transparent text-text-secondary hover:bg-surface hover:text-text-primary disabled:text-text-disabled disabled:cursor-not-allowed',
  danger:
    'bg-transparent text-error border border-error/30 hover:bg-error-bg hover:border-error/50 disabled:opacity-30 disabled:cursor-not-allowed',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm font-medium rounded-md',
  md: 'h-10 px-4 text-sm font-semibold rounded-md',
  lg: 'h-12 px-5 text-base font-semibold rounded-md',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  iconLeft,
  iconRight,
  children,
  onClick,
  disabled,
  type = 'button',
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled ?? loading}
      className={cn(
        'inline-flex items-center gap-2 transition-all duration-150 ease-out active:scale-[0.98] select-none',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {loading ? <Spinner size="sm" /> : iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  );
}

// Inline Spinner to avoid circular import
function Spinner({ size }: { size: 'sm' }) {
  return (
    <svg
      className="animate-spin text-current"
      width={size === 'sm' ? 16 : 16}
      height={size === 'sm' ? 16 : 16}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}