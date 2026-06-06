'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/layout/PageShell';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/feedback/ErrorState';
import { EmptyState } from '@/components/feedback/EmptyState';
import { LoadingPipeline } from '@/components/feedback/LoadingPipeline';
import { ResultHeader } from './ResultHeader';
import { IdentifiedFontCard } from './IdentifiedFontCard';
import { TypeTester } from './TypeTester';
import { AlternativesStrip } from './AlternativesStrip';
import { PairingSection } from './PairingSection';
import { ShareBar } from './ShareBar';
import { ManualTextInput } from './ManualTextInput';
import { getResult, setResult } from '@/lib/storage/resultMap';
import { loadResult, saveResult, addRecentEntry } from '@/lib/storage/recentAnalyses';
import { useAnalyze } from '@/lib/hooks/useAnalyze';
import { TYPE_TESTER_DEFAULT_SIZE } from '@/lib/constants';
import { COPY } from '@/lib/copy';
import type { AnalysisResult } from '@/types';
import type { AnatomyTerm } from '@/lib/fonts/anatomyTerms';

interface ResultsViewProps {
  id: string;
}

export function ResultsView({ id }: ResultsViewProps) {
  const router = useRouter();
  const { mutate: analyze, status: analyzeStatus } = useAnalyze();

  // Core result state
  const [result, setResultState] = useState<AnalysisResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  // UI state
  const [testerText, setTesterText] = useState('');
  const [fontSize, setFontSize] = useState(TYPE_TESTER_DEFAULT_SIZE);
  const [overlayOn, setOverlayOn] = useState(true);
  const [activeTerm, setActiveTerm] = useState<AnatomyTerm | undefined>(undefined);

  // Load result on mount
  useEffect(() => {
    let found = getResult(id);
    if (!found) {
      found = loadResult(id);
      if (found) setResult(found);
    }
    if (found) {
      setResultState(found);
      setTesterText(found.text);
    } else {
      setNotFound(true);
    }
  }, [id]);

  const handleToggleOverlay = useCallback(() => {
    setOverlayOn((v) => !v);
  }, []);

  const handleTermClick = useCallback((term: AnatomyTerm) => {
    setActiveTerm((prev) => (prev === term ? undefined : term));
  }, []);

  const handleHoverTerm = useCallback((term: AnatomyTerm | null) => {
    if (term) setActiveTerm(term);
  }, []);

  // Manual text re-analysis
  const handleManualSubmit = useCallback(
    async (text: string) => {
      if (!result) return;
      try {
        const newResult = await analyze({
          imageUrl: result.imageUrl,
          imageKey: result.imageKey,
          manualText: text,
        });
        setResult(newResult);
        saveResult(newResult);
        addRecentEntry({
          id: newResult.id,
          family: newResult.identified.family,
          category: newResult.identified.font.category,
          thumbnailUrl: newResult.imageUrl,
          createdAt: newResult.createdAt,
        });
        setResultState(newResult);
        setTesterText(newResult.text);
        router.replace(`/result/${newResult.id}`);
      } catch {
        // error handled by useAnalyze
      }
    },
    [result, analyze, router],
  );

  // ── Not found ──────────────────────────────────────────────────────────────
  if (notFound) {
    return (
      <PageShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <ErrorState
            title={COPY['error.notFound.title']}
            message={COPY['error.notFound.message']}
            action={{ label: COPY['error.notFound.action'], onClick: () => router.push('/') }}
          />
        </div>
      </PageShell>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (!result) {
    return (
      <PageShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </PageShell>
    );
  }

  // ── Re-analyzing (manual text) ─────────────────────────────────────────────
  if (analyzeStatus === 'pending') {
    return (
      <PageShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingPipeline />
        </div>
      </PageShell>
    );
  }

  // ── No text found (NO_TEXT_FOUND result path) ──────────────────────────────
  const noTextFound = !result.text || result.text.trim() === '';
  if (noTextFound) {
    return (
      <PageShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <EmptyState
            title={COPY['error.noText.title']}
            message={COPY['error.noText.message']}
          >
            <ManualTextInput
              onSubmit={handleManualSubmit}
              loading={analyzeStatus === ('pending' as string)}
            />
          </EmptyState>
        </div>
      </PageShell>
    );
  }

  // ── Full results ───────────────────────────────────────────────────────────
  return (
    <PageShell>
      <div className="py-8 space-y-12 pb-24 md:pb-12">
        {/* Header */}
        <ResultHeader score={result.identified.score} />

        {/* Identified font */}
        <IdentifiedFontCard
          match={result.identified}
          text={testerText}
          fontSize={fontSize}
          overlayOn={overlayOn}
          onToggleOverlay={handleToggleOverlay}
          {...(activeTerm ? { activeTerm } : {})}
          onTermClick={handleTermClick}
          onHoverTerm={handleHoverTerm}
        />

        {/* Type tester */}
        <TypeTester
          value={testerText}
          onChange={setTesterText}
          size={fontSize}
          onSizeChange={setFontSize}
        />

        {/* Alternatives */}
        <AlternativesStrip
          alternatives={result.alternatives}
          text={testerText}
          size={fontSize}
        />

        {/* Pairings */}
        <PairingSection pairings={result.pairings} />

        {/* Share bar */}
        <ShareBar result={result} />
      </div>
    </PageShell>
  );
}