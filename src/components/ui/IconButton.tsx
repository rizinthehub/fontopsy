'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type IconButtonVariant = 'ghost' | 'solid';
type IconButtonSize = 'sm' | 'md';

interface IconButtonProps {
  icon: ReactNode;
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const variantClasses: Record<IconButtonVariant, string> = {
  ghost: 'bg-transparent text-text-secondary hover:bg-surface hover:text-text-primary',
  solid: 'bg-surface text-text-primary border border-border hover:bg-surface-hover',
};

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'w-8 h-8 rounded-sm',
  md: 'w-10 h-10 rounded-md',
};

export function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  onClick,
  disabled,
  className,
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center transition-all duration-150 ease-out active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {icon}
    </button>
  );
}