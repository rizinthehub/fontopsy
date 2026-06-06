import { Icon } from '@/components/ui/Icon';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  message: string;
  children?: ReactNode;
}

export function EmptyState({ title, message, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-12 max-w-sm mx-auto">
      <Icon name="scan-search" size={48} className="text-text-tertiary mb-4" />
      <h2 className="text-xl font-semibold text-text-primary mb-2">{title}</h2>
      <p className="text-sm text-text-secondary mb-6">{message}</p>
      {children && <div className="w-full">{children}</div>}
    </div>
  );
}