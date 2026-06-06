'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ConfidenceBadge } from './ConfidenceBadge';
import { COPY } from '@/lib/copy';

interface ResultHeaderProps {
  score: number;
}

export function ResultHeader({ score }: ResultHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between pb-6 border-b border-border-subtle">
      <Button
        variant="ghost"
        size="md"
        onClick={() => router.push('/')}
        aria-label="Start a new analysis"
      >
        <Icon name="arrow-left" size={16} />
        {COPY['result.back']}
      </Button>
      <ConfidenceBadge score={score} />
    </div>
  );
}