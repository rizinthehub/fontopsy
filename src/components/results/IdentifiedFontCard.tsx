'use client';

import { useState } from 'react';
import { FontPreview } from './FontPreview';
import { FontMeta } from './FontMeta';
import { AnatomyOverlay } from './AnatomyOverlay';
import { AnatomyLegend } from './AnatomyLegend';
import { Tabs } from '@/components/ui/Tabs';
import { COPY } from '@/lib/copy';
import type { MatchResult } from '@/types';
import type { AnatomyTerm } from '@/lib/fonts/anatomyTerms';

interface IdentifiedFontCardProps {
  match: MatchResult;
  text: string;
  fontSize: number;
  overlayOn: boolean;
  onToggleOverlay: () => void;
  activeTerm?: AnatomyTerm;
  onTermClick: (term: AnatomyTerm) => void;
  onHoverTerm: (term: AnatomyTerm | null) => void;
}

export function IdentifiedFontCard({
  match,
  text,
  fontSize,
  overlayOn,
  onToggleOverlay,
  activeTerm,
  onTermClick,
  onHoverTerm,
}: IdentifiedFontCardProps) {
  const [activeTab, setActiveTab] = useState<string>('anatomy');

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    if (id === 'anatomy' && !overlayOn) onToggleOverlay();
    if (id === 'clean' && overlayOn) onToggleOverlay();
  };

  const tabItems = [
    {
      id: 'anatomy',
      label: COPY['result.anatomy.tab.withOverlay'],
      content: null,
    },
    {
      id: 'clean',
      label: COPY['result.anatomy.tab.clean'],
      content: null,
    },
  ];

  return (
    <div className="bg-bg-elevated border border-border rounded-lg p-5 md:p-8">
      {/* Eyebrow */}
      <p className="font-mono text-xs uppercase tracking-[0.1em] text-text-secondary mb-2">
        {COPY['result.eyebrow']}
      </p>

      {/* Font name */}
      <h1 className="font-sans text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-3">
        {match.family}
      </h1>

      {/* Meta */}
      <div className="mb-6">
        <FontMeta font={match.font} variant="full" />
      </div>

      {/* Anatomy toggle */}
      <div className="mb-4">
        <Tabs
          items={tabItems.map((t) => ({ ...t, content: <></> }))}
          activeId={activeTab}
          onChange={handleTabChange}
        />
      </div>

      {/* Preview area — 2 col on lg+ */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Font preview with anatomy overlay */}
        <div className="flex-1">
          <div
            className="relative bg-bg-sunken rounded-md overflow-hidden"
            style={{ minHeight: 220, padding: '40px 24px' }}
          >
            <FontPreview
              family={match.family}
              text={text || match.family}
              size={fontSize}
              minHeight={160}
            />
                        <AnatomyOverlay
              metrics={match.font.metrics}
              fontSize={fontSize}
              visible={overlayOn}
              {...(activeTerm ? { activeTerm } : {})}
              onClickTerm={onTermClick}
              onHoverTerm={onHoverTerm}
            />
          </div>
        </div>

        {/* Anatomy legend sidebar */}
        <div className="lg:w-[280px] shrink-0">
                    <AnatomyLegend
            metrics={match.font.metrics}
            {...(activeTerm ? { activeTerm } : {})}
            onTermClick={onTermClick}
          />
        </div>
      </div>
    </div>
  );
}