import { COPY } from '@/lib/copy';
import {
  MIN_HIGH_CONFIDENCE,
  MIN_MEDIUM_CONFIDENCE,
} from '@/lib/constants';

interface ConfidenceBadgeProps {
  score: number;
}

export function ConfidenceBadge({ score }: ConfidenceBadgeProps) {
  const level =
    score >= MIN_HIGH_CONFIDENCE
      ? 'high'
      : score >= MIN_MEDIUM_CONFIDENCE
        ? 'medium'
        : 'low';

  const config = {
    high: {
      label: COPY['result.confidence.high'],
      color: 'var(--color-conf-high)',
      bg: 'var(--color-success-bg)',
    },
    medium: {
      label: COPY['result.confidence.medium'],
      color: 'var(--color-conf-medium)',
      bg: 'var(--color-warning-bg)',
    },
    low: {
      label: COPY['result.confidence.low'],
      color: 'var(--color-conf-low)',
      bg: 'var(--color-error-bg)',
    },
  }[level];

  return (
    <div
      aria-label={`Confidence: ${score.toFixed(2)} out of 1.0. ${config.label}.`}
      className="inline-flex items-center gap-2 h-7 px-3 rounded-full font-mono text-xs font-medium uppercase tracking-[0.04em]"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: config.color }}
      />
      {config.label} · {score.toFixed(2)}
    </div>
  );
}