import { cn } from '@/lib/utils';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Divider({ orientation = 'horizontal', className }: DividerProps) {
  if (orientation === 'vertical') {
    return <div className={cn('w-px self-stretch bg-border-subtle mx-4', className)} />;
  }
  return <div className={cn('w-full h-px bg-border-subtle my-6', className)} />;
}