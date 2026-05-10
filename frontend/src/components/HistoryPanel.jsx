import { Clock, RotateCcw, Trash2 } from 'lucide-react';

export default function HistoryPanel({ history, onOpen, onDelete }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Summary history</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Saved locally in this browser.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {history.length}
        </span>
      </div>

      {history.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-300 p-5 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Generated summaries will appear here with timestamps.
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <article
              key={item.id}
              className="rounded-md border border-slate-200 p-3 transition hover:border-teal/50 dark:border-slate-800"
            >
              <h3 className="line-clamp-2 text-sm font-semibold text-slate-800 dark:text-slate-100">{item.title}</h3>
              <p className="mt-2 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Clock size={13} aria-hidden="true" />
                {new Date(item.createdAt).toLocaleString()}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => onOpen(item)}
                  className="inline-flex items-center gap-1 rounded-md bg-teal px-3 py-2 text-xs font-semibold text-white hover:bg-teal/90"
                  aria-label={`Open summary from ${new Date(item.createdAt).toLocaleString()}`}
                >
                  <RotateCcw size={14} aria-hidden="true" />
                  Open
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  aria-label={`Delete summary from ${new Date(item.createdAt).toLocaleString()}`}
                >
                  <Trash2 size={14} aria-hidden="true" />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
