import type { FontMetadata } from '@/types';
import { COPY } from '@/lib/copy';

interface FontMetaProps {
  font: FontMetadata;
  variant?: 'full' | 'mini';
}

export function FontMeta({ font, variant = 'full' }: FontMetaProps) {
  if (variant === 'mini') {
    return (
      <p className="font-mono text-xs text-text-tertiary truncate">
        {font.designer} · {font.category}
      </p>
    );
  }

  const cells = [
    { label: COPY['result.meta.designer'], value: font.designer },
    { label: COPY['result.meta.category'], value: font.category },
    {
      label: COPY['result.meta.license'],
      value: (
        <a
          href={font.licenseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-accent-hover underline underline-offset-2 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {font.license}
        </a>
      ),
    },
    {
      label: COPY['result.meta.weights'],
      value: font.weights.join(', '),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cells.map((cell) => (
        <div key={cell.label} className="space-y-1">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            {cell.label}
          </p>
          <p className="font-mono text-xs text-text-secondary">
            {cell.value}
          </p>
        </div>
      ))}
    </div>
  );
}