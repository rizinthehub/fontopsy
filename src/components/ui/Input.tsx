'use client';

import { cn } from '@/lib/utils';

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: InputSize;
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
}

const sizeClasses: Record<InputSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-3.5 text-sm',
};

export function Input({
  value,
  onChange,
  placeholder,
  size = 'md',
  ariaLabel,
  disabled,
  className,
}: InputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'w-full bg-bg-sunken border border-border rounded-md text-text-primary placeholder:text-text-tertiary',
        'hover:border-border-strong focus:border-accent focus:outline-none',
        'transition-colors duration-150 disabled:text-text-disabled disabled:cursor-not-allowed',
        sizeClasses[size],
        className,
      )}
    />
  );
}