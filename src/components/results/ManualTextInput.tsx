'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { COPY } from '@/lib/copy';

interface ManualTextInputProps {
  onSubmit: (text: string) => void;
  loading: boolean;
}

export function ManualTextInput({ onSubmit, loading }: ManualTextInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) onSubmit(text.trim());
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 w-full max-w-lg">
      <Input
        value={text}
        onChange={setText}
        placeholder="Type the text you see in the image…"
        ariaLabel="Manual text input for font analysis"
        size="lg"
        disabled={loading}
      />
      <Button
        variant="primary"
        size="md"
        onClick={handleSubmit}
        loading={loading}
        disabled={!text.trim()}
      >
        {COPY['error.noText.manualSubmit']}
      </Button>
    </div>
  );
}