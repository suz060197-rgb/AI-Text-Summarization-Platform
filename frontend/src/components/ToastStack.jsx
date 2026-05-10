import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { toastStyles } from '../utils/notifications.js';

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info
};

export default function ToastStack({ toasts, onDismiss }) {
  return (
    <div
      className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || Info;
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 rounded-lg border px-4 py-3 shadow-xl ${toastStyles[toast.type]}`}
          >
            <Icon size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
            <p className="flex-1 text-sm font-medium leading-5">{toast.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="rounded p-1 transition hover:bg-white/15"
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
