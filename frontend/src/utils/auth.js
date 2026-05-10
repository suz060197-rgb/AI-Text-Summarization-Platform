const AUTH_SESSION_KEY = 'ai-summary-auth-session';

export function loadAuthSession() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return JSON.parse(window.localStorage.getItem(AUTH_SESSION_KEY) || 'null');
  } catch {
    return null;
  }
}

export function saveAuthSession(session) {
  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  window.localStorage.removeItem(AUTH_SESSION_KEY);
}
