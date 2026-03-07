'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ShowToastInput {
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
}

interface ToastContextValue {
  showToast: (input: ShowToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function variantStyles(variant: ToastVariant) {
  if (variant === 'success') {
    return 'border-emerald-200 bg-white text-ink';
  }
  if (variant === 'error') {
    return 'border-red-200 bg-white text-ink';
  }
  if (variant === 'warning') {
    return 'border-amber-200 bg-white text-ink';
  }
  return 'border-ink/15 bg-white text-ink';
}

function indicatorStyles(variant: ToastVariant) {
  if (variant === 'success') return 'bg-emerald-500';
  if (variant === 'error') return 'bg-red-500';
  if (variant === 'warning') return 'bg-amber-500';
  return 'bg-ink/45';
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(({ title, description, variant = 'info', durationMs = 4200 }: ShowToastInput) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const next: ToastItem = { id, title, description, variant };
    setToasts((current) => [...current, next]);
    window.setTimeout(() => {
      dismissToast(id);
    }, durationMs);
  }, [dismissToast]);

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed top-5 right-5 z-[200] w-[min(420px,calc(100vw-24px))] space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border shadow-lg shadow-ink/[0.08] ${variantStyles(toast.variant)}`}
          >
            <div className="px-4 py-3 flex items-start gap-3">
              <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${indicatorStyles(toast.variant)}`} />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-ink/90">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-1 text-[12px] leading-relaxed text-ink/60">{toast.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="text-[11px] font-semibold text-ink/40 hover:text-ink/70 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: () => {},
    };
  }
  return context;
}
