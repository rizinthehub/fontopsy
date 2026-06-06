import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';

interface ErrorStateProps {
  title: string;
  message: string;
  action?: { label: string; onClick: () => void };
}

export function ErrorState({ title, message, action }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-12 max-w-sm mx-auto">
      <Icon name="alert-triangle" size={48} className="text-error mb-4" />
      <h2 className="text-xl font-semibold text-text-primary mb-2">{title}</h2>
      <p className="text-sm text-text-secondary mb-6">{message}</p>
      {action && (
        <Button variant="primary" size="md" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}