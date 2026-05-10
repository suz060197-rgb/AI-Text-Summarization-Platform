import { useEffect, useState } from 'react';
import { FileText, SearchCheck, Sparkles } from 'lucide-react';
import AuthPanel from '../components/AuthPanel.jsx';
import HistoryPanel from '../components/HistoryPanel.jsx';
import LoaderPanel from '../components/LoaderPanel.jsx';
import SummaryForm from '../components/SummaryForm.jsx';
import SummaryResult from '../components/SummaryResult.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import ToastStack from '../components/ToastStack.jsx';
import { summarizePdf, summarizeText } from '../utils/api.js';
import { clearAuthSession, loadAuthSession, saveAuthSession } from '../utils/auth.js';
import { createHistoryItem, loadSummaryHistory, saveSummaryHistory } from '../utils/history.js';
import { createToast } from '../utils/notifications.js';
import { applyTheme, getStoredTheme } from '../utils/theme.js';

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  const [toasts, setToasts] = useState([]);
  const [history, setHistory] = useState([]);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const storedTheme = getStoredTheme();
    setTheme(storedTheme);
    applyTheme(storedTheme);
    setHistory(loadSummaryHistory());
    setSession(loadAuthSession());
  }, []);

  function notify(message, type = 'info') {
    const toast = createToast(message, type);
    setToasts((current) => [...current, toast]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== toast.id));
    }, 3800);
  }

  function updateHistory(nextHistory) {
    setHistory(nextHistory);
    const saved = saveSummaryHistory(nextHistory);
    if (!saved) {
      notify('Summary generated, but browser history could not be saved.', 'info');
    }
  }

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  async function handleSubmit(payload) {
    setLoading(true);
    setResult(null);

    try {
      const response = payload.file ? await summarizePdf(payload) : await summarizeText(payload);
      setResult(response);
      try {
        updateHistory([createHistoryItem(response), ...history]);
      } catch (historyError) {
        console.warn(`Unable to update summary history: ${historyError.message}`);
      }
      notify('Summary generated successfully.', 'success');
    } catch (requestError) {
      notify(requestError.response?.data?.error?.message || 'Unable to generate summary.', 'error');
    } finally {
      setLoading(false);
    }
  }

  function openHistoryItem(item) {
    setResult(item.result);
    notify('Previous summary opened.', 'info');
  }

  function deleteHistoryItem(id) {
    updateHistory(history.filter((item) => item.id !== id));
    notify('Summary removed from history.', 'success');
  }

  function dismissToast(id) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  function handleAuthenticated(nextSession) {
    setSession(nextSession);
    saveAuthSession(nextSession);
  }

  function handleLogout() {
    clearAuthSession();
    setSession(null);
    notify('Logged out successfully.', 'success');
  }

  return (
    <main className="min-h-screen bg-cloud text-ink transition-colors dark:bg-night dark:text-slate-100">
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <section className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-night/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <img src="/app-icon.svg" alt="" className="h-10 w-10" />
            <div>
              <h1 className="text-lg font-semibold sm:text-xl">AI Text Summarization Platform</h1>
              <p className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">
                Text and PDF summaries for faster research review
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full bg-teal/10 px-3 py-2 text-sm font-medium text-teal dark:bg-teal/20 sm:flex">
              <Sparkles size={16} aria-hidden="true" />
              AI Ready
            </div>
            <AuthPanel
              session={session}
              onAuthenticated={handleAuthenticated}
              onLogout={handleLogout}
              onNotify={notify}
            />
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-7 grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-coral/10 p-3 text-coral">
              <FileText size={28} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-white">
                Research-ready summaries
              </h2>
              <p className="mt-1 max-w-2xl text-slate-600 dark:text-slate-400">
                Paste long-form text or upload a PDF/Word document, then generate summaries in English, Spanish, Hindi, or Marathi.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <SearchCheck size={18} className="text-teal" aria-hidden="true" />
            Local history enabled
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr_0.7fr]">
          <SummaryForm onSubmit={handleSubmit} loading={loading} onNotify={notify} />
          {loading ? <LoaderPanel /> : <SummaryResult result={result} onNotify={notify} />}
          <HistoryPanel history={history} onOpen={openHistoryItem} onDelete={deleteHistoryItem} />
        </div>
      </section>
    </main>
  );
}
