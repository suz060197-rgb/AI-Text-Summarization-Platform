export function createToast(message, type = 'info') {
  return {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    message,
    type
  };
}

export const toastStyles = {
  success: 'border-teal/30 bg-teal text-white',
  error: 'border-red-300 bg-red-600 text-white',
  info: 'border-slate-300 bg-ink text-white'
};
