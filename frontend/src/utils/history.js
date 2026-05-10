const HISTORY_KEY = 'ai-summary-history';

export function loadSummaryHistory() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    return JSON.parse(window.localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveSummaryHistory(history) {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 12)));
    return true;
  } catch (error) {
    console.warn(`Unable to save summary history: ${error.message}`);
    return false;
  }
}

export function createHistoryItem(result) {
  return {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    title: result.summary.split(/\s+/).slice(0, 9).join(' '),
    result
  };
}
