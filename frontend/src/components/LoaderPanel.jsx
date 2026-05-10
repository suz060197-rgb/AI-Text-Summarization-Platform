import { Loader2 } from 'lucide-react';

export default function LoaderPanel() {
  return (
    <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center">
        <div className="absolute h-16 w-16 rounded-full border-4 border-teal/15" />
        <Loader2 className="animate-spin text-teal" size={38} aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Generating summary</h2>
      <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        Extracting key ideas, cleaning the input, and preparing a structured result.
      </p>
      <div className="mt-6 h-2 w-full max-w-xs overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full w-1/2 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-teal" />
      </div>
    </div>
  );
}
