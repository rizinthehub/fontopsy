'use client';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { RegionSelector } from './RegionSelector';
import { COPY } from '@/lib/copy';
import type { BoundingBox } from '@/types/common';

interface ImagePreviewProps {
  src: string;
  onReset: () => void;
  onRegionChange: (region: BoundingBox | null) => void;
  onAnalyze: () => void;
  analyzing: boolean;
}

export function ImagePreview({
  src,
  onReset,
  onRegionChange,
  onAnalyze,
  analyzing,
}: ImagePreviewProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-xs text-text-tertiary uppercase tracking-widest">
        {COPY['upload.region.caption']}
      </p>

      {/* Image + overlay container */}
      <div className="relative rounded-md overflow-hidden border border-border max-h-[600px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Uploaded image for font analysis"
          className="w-full object-contain max-h-[600px]"
        />
        <RegionSelector onChange={onRegionChange} />
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3">
        <Button variant="ghost" size="md" onClick={onReset} disabled={analyzing}>
          <Icon name="x" size={16} />
          {COPY['upload.action.reset']}
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={onAnalyze}
          loading={analyzing}
        >
          <Icon name="scan-search" size={16} />
          {COPY['upload.action.analyze']}
        </Button>
      </div>
    </div>
  );
}