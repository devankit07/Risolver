import { Mail, Lock, ArrowRight, Shield } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AuthSplitLayout } from '../../layouts/AuthSplitLayout.jsx'
import {
  AuthBackLink,
  AuthEyebrow,
  AuthTabStrip,
  AuthTrustFooter,
  authInputClassName,
  authLabelClassName,
} from '../../components/auth/AuthChrome.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [autoFilled, setAutoFilled] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  /* read saved email after mount so SSR / hydration is safe */
  useEffect(() => {
    const saved = localStorage.getItem('resolver_last_email')
    if (saved) {
      setEmail(saved)
      setAutoFilled(true)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthSplitLayout>
      <AuthBackLink />
      <AuthEyebrow icon={Shield}>Resolver access</AuthEyebrow>

      <AuthTabStrip
        items={[
          { to: '/login', label: 'Sign in', end: true },
          { to: '/register', label: 'Register', end: true },
        ]}
      />

      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-semibold tracking-tight text-slate-900 [font-family:Georgia,'Times_New_Roman',serif]">
          Welcome back
        </h2>
        <p className="text-slate-500">Sign in to coordinate incidents and keep your team aligned.</p>
      </div>

      {error && (
        <div className="mb-4 w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="login-email" className={authLabelClassName}>Email address</label>
            {autoFilled && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                ✓ auto-filled
              </span>
            )}
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Mail size={18} aria-hidden />
            </div>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setAutoFilled(false) }}
              placeholder="name@company.com"
              className={authInputClassName}
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="login-password" className={authLabelClassName}>Password</label>
            <Link to="#" className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-500">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Lock size={18} aria-hidden />
            </div>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={authInputClassName}
              autoComplete="current-password"
              required
            />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? 'Signing in…' : 'Continue to dashboard'}
          {!loading && <ArrowRight size={18} aria-hidden />}
        </button>
      </form>

      <AuthTrustFooter />
    </AuthSplitLayout>
  )
}
