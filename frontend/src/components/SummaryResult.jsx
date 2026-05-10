import { ChevronDown, Clipboard, Download, FileSearch, Hash, Sparkles } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function SummaryResult({ result, onNotify }) {
  if (!result) {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <div className="mb-4 rounded-lg bg-slate-100 p-4 text-slate-400 dark:bg-slate-800">
          <FileSearch size={42} aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">No summary yet</h2>
        <p className="mt-2 max-w-sm">Your summary, keywords, document statistics, and export actions will appear here.</p>
      </div>
    );
  }

  function exportPdf() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('AI Text Summary', 14, 18);
    doc.setFontSize(11);
    doc.text(doc.splitTextToSize(result.summary, 180), 14, 32);
    doc.save('summary.pdf');
    onNotify('Summary exported as PDF.', 'success');
  }

  async function copySummary() {
    await navigator.clipboard.writeText(result.summary);
    onNotify('Summary copied to clipboard.', 'success');
  }

  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-teal/10 p-3 text-teal dark:bg-teal/20">
            <Sparkles size={24} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Generated summary</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Source: {result.source.type} | {result.language} | {result.format}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copySummary}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Copy summary to clipboard"
          >
            <Clipboard size={16} aria-hidden="true" />
            Copy
          </button>
          <button
            type="button"
            onClick={exportPdf}
            className="inline-flex items-center gap-2 rounded-md bg-teal px-3 py-2 text-sm font-semibold text-white hover:bg-teal/90"
            aria-label="Export summary as PDF"
          >
            <Download size={16} aria-hidden="true" />
            Export
          </button>
        </div>
      </div>

      <details className="group rounded-lg border border-slate-200 open:bg-slate-50 dark:border-slate-800 dark:open:bg-slate-950" open>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
          Summary text
          <ChevronDown className="transition group-open:rotate-180" size={18} aria-hidden="true" />
        </summary>
        <div className="summary-scroll max-h-[360px] overflow-auto whitespace-pre-wrap px-4 pb-4 leading-7 text-slate-700 dark:text-slate-300">
          {result.summary}
        </div>
      </details>

      <details className="group rounded-lg border border-slate-200 dark:border-slate-800" open>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
          <span className="inline-flex items-center gap-2">
            <Hash size={16} className="text-coral" aria-hidden="true" />
            Keyword highlights
          </span>
          <ChevronDown className="transition group-open:rotate-180" size={18} aria-hidden="true" />
        </summary>
        <div className="flex flex-wrap gap-2 px-4 pb-4">
          {result.keywords.map((keyword, index) => (
            <span
              key={keyword}
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                index % 2 === 0 ? 'bg-coral/10 text-coral' : 'bg-amber/20 text-amber'
              }`}
            >
              {keyword}
            </span>
          ))}
        </div>
      </details>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Original characters" value={result.stats.originalCharacters} />
        <Stat label="Processed characters" value={result.stats.processedCharacters} />
        <Stat label="Reading minutes" value={result.stats.estimatedReadingMinutes} />
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
      <p className="text-2xl font-semibold text-teal">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}
