import { cn } from '@/lib/utils';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Skeleton({ width, height, className }: SkeletonProps) {
  return (
    <div
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      className={cn(
        'rounded-sm bg-gradient-to-r from-bg-overlay via-surface-hover to-bg-overlay',
        'bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]',
        className,
      )}
    />
  );
}