interface PairingLabelProps {
  tone: 'editorial' | 'modern' | 'playful' | 'classic';
}

const toneConfig = {
  editorial: {
    bg: 'var(--color-info-bg)',
    color: 'var(--color-info)',
  },
  modern: {
    bg: 'var(--color-accent-muted)',
    color: 'var(--color-accent)',
  },
  playful: {
    bg: '#F472B61A',
    color: '#F472B6',
  },
  classic: {
    bg: 'var(--color-warning-bg)',
    color: 'var(--color-warning)',
  },
} as const;

export function PairingLabel({ tone }: PairingLabelProps) {
  const config = toneConfig[tone];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[10px] font-medium uppercase tracking-[0.04em]"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      {tone}
    </span>
  );
}