'use client';

import { memo, type ReactNode } from 'react';
import { useFontLoader } from '@/lib/hooks/useFontLoader';
import { Skeleton } from '@/components/ui/Skeleton';

interface FontPreviewProps {
  family: string;
  text: string;
  size: number;
  weight?: number;
  children?: ReactNode;
  className?: string;
  minHeight?: number;
}

export const FontPreview = memo(function FontPreview({
  family,
  text,
  size,
  weight = 400,
  children,
  className,
  minHeight,
}: FontPreviewProps) {
  const { loaded } = useFontLoader(family);
  const skeletonHeight = minHeight ?? Math.round(size * 1.4);

  return (
    <div className={`relative ${className ?? ''}`} style={{ minHeight }}>
      {!loaded ? (
        <Skeleton
          width="100%"
          height={skeletonHeight}
          className="rounded-md"
        />
      ) : (
        <div
          style={{
            fontFamily: `"${family}", system-ui, sans-serif`,
            fontSize: size,
            fontWeight: weight,
            lineHeight: 1.2,
            color: 'var(--color-text-primary)',
            wordBreak: 'break-word',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {text || 'The quick brown fox'}
        </div>
      )}
      {/* Children rendered on top (e.g. AnatomyOverlay) */}
      {loaded && children}
    </div>
  );
});