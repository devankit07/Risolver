import { Mail, Lock, ArrowRight, Activity, Cpu, Database, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthSplitLayout } from '../../layouts/AuthSplitLayout.jsx';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login
    navigate('/');
  };

  return (
    <AuthSplitLayout>
      {/* Toggle */}
      <div className="mb-12 flex w-fit rounded-lg bg-slate-100 p-1">
        <Link
          to="/login"
          className="rounded-md bg-white px-6 py-2 text-sm font-semibold text-slate-900 shadow-sm"
        >
          SIGN IN
        </Link>
        <Link
          to="/register"
          className="rounded-md px-6 py-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900"
        >
          REGISTER
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-bold text-slate-900">Welcome back</h2>
        <p className="text-slate-500">Access the SRE Portal to manage active incidents.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Email Address
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Mail size={18} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Password
            </label>
            <Link to="#" className="text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-500">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Lock size={18} />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-500 active:scale-[0.98]"
        >
          CONTINUE TO DASHBOARD
          <ArrowRight size={18} />
        </button>
      </form>

      <div className="my-10 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-100"></div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Security Protocol
        </span>
        <div className="h-px flex-1 bg-slate-100"></div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              className="text-[#4285F4]"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              className="text-[#34A853]"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              className="text-[#FBBC05]"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              className="text-[#EA4335]"
            />
          </svg>
          Google
        </button>
      </div>

      <div className="mt-12 text-center">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Trusted by organizations worldwide
        </p>
        <div className="flex justify-center gap-8 text-slate-300">
          <Activity size={20} />
          <Cpu size={20} />
          <Database size={20} />
          <Shield size={20} />
        </div>
      </div>
    </AuthSplitLayout>
  );
}