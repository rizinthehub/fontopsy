'use client';

import { use } from 'react';
import dynamic from 'next/dynamic';
import { Spinner } from '@/components/ui/Spinner';

const ResultsView = dynamic(
  () => import('@/components/results/ResultsView').then((m) => m.ResultsView),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    ),
  },
);

interface ResultPageProps {
  params: Promise<{ id: string }>;
}

export default function ResultPage({ params }: ResultPageProps) {
  const { id } = use(params);
  return <ResultsView id={id} />;
}