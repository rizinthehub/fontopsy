'use client';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useClipboard } from '@/lib/hooks/useClipboard';
import { useToast } from '@/components/feedback/ToastProvider';
import { COPY } from '@/lib/copy';

interface CopyCSSButtonProps {
  family: string;
}

export function CopyCSSButton({ family }: CopyCSSButtonProps) {
  const { copy, copied } = useClipboard();
  const { push } = useToast();

  const handleCopy = async () => {
    const encoded = family.replace(/ /g, '+');
    const snippet = `<!-- Add to <head> -->
<link href="https://fonts.googleapis.com/css2?family=${encoded}&display=swap" rel="stylesheet">

/* CSS */
font-family: '${family}', sans-serif;`;

    const ok = await copy(snippet);
    if (ok) {
      push({ kind: 'success', message: `${COPY['copyCss.copied']} — ${family}` });
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => void handleCopy()}
      aria-label={`Copy CSS import for ${family} to clipboard`}
    >
      <Icon name={copied ? 'check' : 'copy'} size={14} />
      {copied ? COPY['copyCss.copied'] : COPY['copyCss.default']}
    </Button>
  );
}