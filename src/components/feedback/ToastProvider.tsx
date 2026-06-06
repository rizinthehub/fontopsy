'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';
import {
  TOAST_DURATION_DEFAULT_MS,
  TOAST_DURATION_ERROR_MS,
} from '@/lib/constants';

export interface Toast {
  id: string;
  kind: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface ToastContextValue {
  push: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const duration =
      toast.kind === 'error' ? TOAST_DURATION_ERROR_MS : TOAST_DURATION_DEFAULT_MS;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [toast.kind, onDismiss]);

  const accentColor = {
    success: 'bg-success',
    error:   'bg-error',
    info:    'bg-info',
    warning: 'bg-warning',
  }[toast.kind];

  const iconName = {
    success: 'check',
    error:   'octagon-x',
    info:    'info',
    warning: 'alert-triangle',
  }[toast.kind] as Parameters<typeof Icon>[0]['name'];

  const iconColor = {
    success: 'text-success',
    error:   'text-error',
    info:    'text-info',
    warning: 'text-warning',
  }[toast.kind];

  return (
    <div
      role={toast.kind === 'error' ? 'alert' : 'status'}
      aria-live={toast.kind === 'error' ? 'assertive' : 'polite'}
      className={cn(
        'flex items-start gap-3 min-w-[280px] max-w-[400px]',
        'bg-bg-overlay border border-border rounded-md',
        'shadow-[0_12px_32px_rgba(0,0,0,0.5)]',
        'overflow-hidden',
        'animate-in slide-in-from-right-4 fade-in duration-200',
      )}
    >
      {/* Left accent strip */}
      <div className={`w-1 self-stretch shrink-0 ${accentColor}`} />

      {/* Content */}
      <div className="flex items-center gap-3 flex-1 py-3 pr-3">
        <Icon name={iconName} size={16} className={iconColor} />
        <p className="text-sm font-medium text-text-primary flex-1">
          {toast.message}
        </p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="text-text-tertiary hover:text-text-primary transition-colors shrink-0"
        >
          <Icon name="x" size={14} />
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ push, dismiss }}>
      {children}
      {/* Toast stack */}
      <div
        aria-label="Notifications"
        className="fixed bottom-6 right-6 z-[70] flex flex-col gap-2 items-end md:items-end"
      >
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => dismiss(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}