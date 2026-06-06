import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { COPY } from '@/lib/copy';

interface DropPromptProps {
  onBrowse: () => void;
  isDragging: boolean;
}

export function DropPrompt({ onBrowse, isDragging }: DropPromptProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 px-6 text-center">
      <div
        className={`transition-colors duration-150 ${
          isDragging ? 'text-accent' : 'text-text-tertiary'
        }`}
      >
        <Icon name="upload-cloud" size={48} />
      </div>

      <div className="space-y-1">
        <p className="text-base font-medium text-text-primary">
          {COPY['upload.idle.primary']}
        </p>
        <p className="text-sm text-text-tertiary">
          {COPY['upload.idle.secondary']}
        </p>
      </div>

      <Button variant="secondary" size="md" onClick={onBrowse}>
        <Icon name="folder-open" size={16} />
        {COPY['upload.idle.button']}
      </Button>
    </div>
  );
}