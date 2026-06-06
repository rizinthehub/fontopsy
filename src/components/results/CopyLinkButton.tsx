'use client';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useClipboard } from '@/lib/hooks/useClipboard';
import { useToast } from '@/components/feedback/ToastProvider';
import { COPY } from '@/lib/copy';

export function CopyLinkButton() {
  const { copy, copied } = useClipboard();
  const { push } = useToast();

  const handleCopy = async () => {
    const ok = await copy(window.location.href);
    if (ok) {
      push({ kind: 'success', message: COPY['result.share.copied'] });
    }
  };

  return (
    <Button
      variant="secondary"
      size="md"
      onClick={() => void handleCopy()}
    >
      <Icon name={copied ? 'check' : 'link-2'} size={16} />
      {copied ? COPY['result.share.copied'] : COPY['result.share.copy']}
    </Button>
  );
}