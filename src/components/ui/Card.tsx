import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  padded?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, padded = true, className, onClick }: CardProps) {
  const isInteractive = !!onClick;

  return (
    <div
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      className={cn(
        'bg-bg-elevated border border-border rounded-lg',
        padded && 'p-6',
        isInteractive &&
          'cursor-pointer transition-all duration-150 hover:border-border-strong hover:shadow-[0_0_0_1px_var(--color-border-strong)]',
        className,
      )}
    >
      {children}
    </div>
  );
}