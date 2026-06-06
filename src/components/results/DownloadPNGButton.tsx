'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/feedback/ToastProvider';
import { buildCardUrl } from '@/lib/share/buildCardUrl';
import { toKebabCase } from '@/lib/utils';
import { COPY } from '@/lib/copy';
import type { AnalysisResult } from '@/types';

interface DownloadPNGButtonProps {
  result: AnalysisResult;
}

export function DownloadPNGButton({ result }: DownloadPNGButtonProps) {
  const [loading, setLoading] = useState(false);
  const { push } = useToast();

  const handleDownload = async () => {
    setLoading(true);
    try {
      const url = buildCardUrl(result);
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to generate card');

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `fontopsy-${toKebabCase(result.identified.family)}-${result.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);

      push({ kind: 'success', message: COPY['result.share.downloaded'] });
    } catch {
      push({ kind: 'error', message: "Couldn't generate card. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="primary"
      size="md"
      loading={loading}
      onClick={() => void handleDownload()}
    >
      <Icon name="download" size={16} />
      {COPY['result.share.download']}
    </Button>
  );
}