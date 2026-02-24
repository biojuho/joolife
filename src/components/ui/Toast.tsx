'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

// ---------- Types ----------

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

// ---------- Context ----------

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
}

// ---------- Config ----------

const typeConfig: Record<
  ToastType,
  { icon: typeof CheckCircle; bg: string; border: string; text: string }
> = {
  success: {
    icon: CheckCircle,
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
  },
};

// ---------- Single Toast Item ----------

function ToastItem({
  toast: t,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const config = typeConfig[t.type];
  const Icon = config.icon;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(t.id), 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [t.id, onDismiss]);

  return (
    <div
      className={cn(
        'flex items-center gap-2.5 rounded-xl border px-4 py-3 shadow-lg transition-all duration-300',
        config.bg,
        config.border,
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-2 opacity-0',
      )}
      role="alert"
    >
      <Icon className={cn('h-4 w-4 shrink-0', config.text)} />
      <p className={cn('flex-1 text-sm font-medium', config.text)}>
        {t.message}
      </p>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onDismiss(t.id), 300);
        }}
        className={cn(
          'shrink-0 rounded-md p-0.5 transition-colors hover:bg-black/5',
          config.text,
        )}
        aria-label="닫기"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ---------- Provider ----------

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = String(++toastId);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container */}
      <div
        aria-live="polite"
        className="fixed top-4 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
