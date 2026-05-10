import { useState } from 'react';
import { LogIn, LogOut, UserPlus, X } from 'lucide-react';
import { loginUser, registerUser } from '../utils/api.js';

export default function AuthPanel({ session, onAuthenticated, onLogout, onNotify }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const response =
        mode === 'register'
          ? await registerUser({ name, email, password })
          : await loginUser({ email, password });
      onAuthenticated(response);
      onNotify(mode === 'register' ? 'Account created successfully.' : 'Logged in successfully.', 'success');
      setOpen(false);
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      onNotify(error.response?.data?.error?.message || 'Authentication failed.', 'error');
    } finally {
      setLoading(false);
    }
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200 md:inline-flex">
          {session.user.name}
        </span>
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          aria-label="Log out"
        >
          <LogOut size={17} aria-hidden="true" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center gap-2 rounded-md bg-teal px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal/90"
        aria-label="Open login form"
      >
        <LogIn size={17} aria-hidden="true" />
        <span className="hidden sm:inline">Login</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 px-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                  {mode === 'register' ? 'Create account' : 'Welcome back'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Login to personalize your summarization workspace.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close login form"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="mb-4 grid grid-cols-2 rounded-md bg-slate-100 p-1 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`rounded px-3 py-2 text-sm font-semibold ${mode === 'login' ? 'bg-white text-teal shadow-sm dark:bg-slate-950' : 'text-slate-500'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`rounded px-3 py-2 text-sm font-semibold ${mode === 'register' ? 'bg-white text-teal shadow-sm dark:bg-slate-950' : 'text-slate-500'}`}
              >
                Register
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {mode === 'register' && (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Name</span>
                  <input
                    aria-label="Name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-teal dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    required
                  />
                </label>
              )}
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Email</span>
                <input
                  aria-label="Email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-teal dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Password</span>
                <input
                  aria-label="Password"
                  type="password"
                  minLength="6"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-teal dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-teal px-4 py-3 font-semibold text-white transition hover:bg-teal/90 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {mode === 'register' ? <UserPlus size={18} aria-hidden="true" /> : <LogIn size={18} aria-hidden="true" />}
                {loading ? 'Please wait...' : mode === 'register' ? 'Create Account' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
