'use client';

import { useRouter } from 'next/navigation';
import type { RecentEntry } from '@/lib/storage/recentAnalyses';

interface RecentCardProps {
  entry: RecentEntry;
}

export function RecentCard({ entry }: RecentCardProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/result/${entry.id}`)}
      className="group text-left w-full bg-bg-elevated border border-border rounded-lg overflow-hidden hover:border-border-strong hover:bg-bg-overlay transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.98]"
    >
      {/* Thumbnail */}
      <div className="aspect-video w-full overflow-hidden bg-bg-sunken">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={entry.thumbnailUrl}
          alt={`${entry.family} analysis thumbnail`}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      {/* Meta */}
      <div className="p-3">
        <p className="text-sm font-semibold text-text-primary truncate">
          {entry.family}
        </p>
        <p className="font-mono text-xs text-text-tertiary uppercase tracking-wide mt-0.5">
          {entry.category}
        </p>
      </div>
    </button>
  );
}