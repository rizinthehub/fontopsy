'use client';

import { useRecentAnalyses } from '@/lib/hooks/useRecentAnalyses';
import { RecentCard } from './RecentCard';
import { COPY } from '@/lib/copy';

export function RecentAnalyses() {
  const { entries } = useRecentAnalyses();

  if (entries.length === 0) return null;

  return (
    <section aria-label="Recent analyses">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-2xl font-semibold text-text-primary">
          {COPY['recent.heading']}
        </h2>
        <span className="font-mono text-xs text-text-tertiary bg-surface px-2 py-0.5 rounded-full">
          {entries.length}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {entries.map((entry) => (
          <RecentCard key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}