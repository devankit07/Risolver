import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import {
  Mail, Lock, ArrowRight, Shield, Loader2, Hash,
  CheckCircle2, Activity, Cpu, Database,
} from 'lucide-react'
import { hydrateAuth } from '../store/authSlice.js'
import api from '../services/api.js'
import { getApiBaseUrl } from '../config/apiUrl.js'

// ─── Animated left panel (matches website design) ────────────────────────────

function AuthLeftPanel() {
  return (
    <div
      className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden lg:flex"
      style={{ background: 'radial-gradient(ellipse at 30% 20%, #1e1460 0%, #0d0d1f 55%, #050510 100%)' }}
    >
      <style>{`
        @keyframes orbFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-18px) scale(1.04)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spinCW   { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes spinCCW  { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(-360deg)} }
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes scan     { 0%{top:-4px} 100%{top:100%} }
      `}</style>

      {/* star field */}
      {Array.from({length:48}).map((_,i)=>{
        const s=Math.random()<.15?2:1
        return <div key={i} className="pointer-events-none absolute rounded-full bg-white" style={{width:s,height:s,top:`${Math.random()*100}%`,left:`${Math.random()*100}%`,opacity:Math.random()*.5+.1,animation:`blink ${2+Math.random()*4}s ease-in-out infinite`,animationDelay:`${Math.random()*4}s`}} />
      })}

      {/* grid */}
      <div className="pointer-events-none absolute inset-0 z-0" style={{backgroundImage:'linear-gradient(rgba(99,102,241,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.07) 1px,transparent 1px)',backgroundSize:'48px 48px'}} />

      {/* glow */}
      <div className="pointer-events-none absolute" style={{width:700,height:700,top:'50%',left:'50%',transform:'translate(-50%,-52%)',background:'radial-gradient(circle,rgba(99,102,241,.22) 0%,rgba(79,70,229,.1) 40%,transparent 70%)',filter:'blur(40px)'}} />

      {/* outer orbit */}
      <div className="pointer-events-none absolute" style={{width:560,height:560,top:'50%',left:'50%',borderRadius:'50%',border:'1px dashed rgba(99,102,241,.18)',animation:'spinCW 40s linear infinite'}}>
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full" style={{background:'#6366f1',boxShadow:'0 0 12px #6366f1,0 0 24px rgba(99,102,241,.5)'}} />
      </div>

      {/* inner orbit */}
      <div className="pointer-events-none absolute" style={{width:440,height:440,top:'50%',left:'50%',borderRadius:'50%',border:'1px solid rgba(14,165,233,.12)',animation:'spinCCW 28s linear infinite'}}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full" style={{background:'#0ea5e9',boxShadow:'0 0 10px #0ea5e9,0 0 20px rgba(14,165,233,.4)'}} />
      </div>

      {/* core glow */}
      <div className="pointer-events-none absolute rounded-full" style={{width:340,height:340,top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'radial-gradient(circle,rgba(99,102,241,.3) 0%,transparent 70%)',filter:'blur(12px)'}} />

      {/* glass center */}
      <div className="relative z-10 flex items-center justify-center" style={{animation:'fadeUp .8s ease both',animationDelay:'.2s'}}>
        <div className="relative flex flex-col items-center justify-center rounded-full" style={{width:280,height:280,background:'linear-gradient(145deg,rgba(99,102,241,.18),rgba(15,23,42,.6))',border:'1px solid rgba(99,102,241,.35)',backdropFilter:'blur(24px)',boxShadow:'0 0 80px rgba(99,102,241,.35),0 0 200px rgba(99,102,241,.1),inset 0 0 60px rgba(99,102,241,.08)'}}>
          <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
            <div className="absolute left-0 right-0 h-px" style={{background:'linear-gradient(to right,transparent,rgba(99,102,241,.6),transparent)',animation:'scan 3.5s linear infinite'}} />
          </div>
          <Shield size={52} className="text-indigo-400 drop-shadow-[0_0_20px_rgba(99,102,241,.8)]" />
          <div className="mt-3 text-[11px] font-bold uppercase tracking-[.22em] text-indigo-300/70">Resolver</div>
        </div>
      </div>

      {/* headline */}
      <div className="relative z-10 mt-14 px-10 text-center" style={{animation:'fadeUp .8s ease both',animationDelay:'.5s'}}>
        <h1 className="text-[19px] font-semibold tracking-wide text-white/90">Enterprise Incident Management</h1>
        <p className="mt-4 text-[13px] leading-relaxed text-indigo-200/45 max-w-[280px] mx-auto">
          Engineered for high-stakes environments where clarity and speed are paramount.
        </p>
      </div>

      {/* bottom bar */}
      <div className="absolute bottom-5 left-0 right-0 z-10 flex items-center justify-between px-8">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={11} className="text-indigo-400/60" />
          <span className="text-[9px] font-bold uppercase tracking-[.22em] text-white/20">Reliability Certified</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Activity size={10} className="text-emerald-400/50" />
          <span className="text-[9px] font-medium uppercase tracking-[.18em] text-white/20">All systems nominal</span>
        </div>
      </div>
    </div>
  )
}

// ─── Shared field styles ──────────────────────────────────────────────────────

const inputCls =
  'w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4 pl-12 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 placeholder:text-slate-400'

function FieldIcon({ icon: Icon }) {
  return (
    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
      <Icon className="h-4 w-4" />
    </span>
  )
}

function ErrorBox({ msg }) {
  if (!msg) return null
  return (
    <div className="mb-4 w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      {msg}
    </div>
  )
}

// ─── Email login tab ──────────────────────────────────────────────────────────

function EmailLoginForm({ onSuccess }) {
  const [email, setEmail]   = useState('')
  const [pass, setPass]     = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), password: pass }),
      })
      const data = await res.json()
      if (!data.success) { setError(data.message || 'Invalid credentials'); return }
      onSuccess(data.data.user, data.data.token)
    } catch {
      setError('Could not connect. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="w-full space-y-5">
      <ErrorBox msg={error} />

      <div className="space-y-2">
        <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">Email address</label>
        <div className="relative">
          <FieldIcon icon={Mail} />
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
            placeholder="you@company.com" required autoComplete="email" className={inputCls} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">Password</label>
        <div className="relative">
          <FieldIcon icon={Lock} />
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)}
            placeholder="••••••••" required autoComplete="current-password" className={inputCls} />
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? <Loader2 size={18} className="animate-spin" /> : <>Continue to dashboard <ArrowRight size={18} /></>}
      </button>
    </form>
  )
}

// ─── Invite ID login tab ──────────────────────────────────────────────────────

function InviteLoginForm({ onSuccess }) {
  const [inviteId, setInviteId] = useState('')
  const [pass, setPass]         = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const rawId = inviteId.trim().toUpperCase()
    const email = `${rawId.toLowerCase()}@invite.resolver.local`
    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password: pass }),
      })
      const data = await res.json()
      if (!data.success) { setError('Invalid invite ID or password.'); return }
      onSuccess(data.data.user, data.data.token)
    } catch {
      setError('Could not connect. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="w-full space-y-5">
      <ErrorBox msg={error} />

      {/* info banner */}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-[12px] leading-relaxed text-indigo-700">
        <span className="font-bold">Team member?</span> Enter the invite ID (e.g.{' '}
        <span className="font-mono font-semibold">RES-ABCD</span>) and the password you set when
        you joined. First time? Click the invite link in your message.
      </div>

      <div className="space-y-2">
        <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">Invite ID</label>
        <div className="relative">
          <FieldIcon icon={Hash} />
          <input type="text" value={inviteId} onChange={e=>setInviteId(e.target.value)}
            placeholder="RES-XXXX" required
            className={`${inputCls} font-mono tracking-widest`} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">Password</label>
        <div className="relative">
          <FieldIcon icon={Lock} />
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)}
            placeholder="••••••••" required autoComplete="current-password" className={inputCls} />
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? <Loader2 size={18} className="animate-spin" /> : <>Sign in <ArrowRight size={18} /></>}
      </button>

      <p className="text-center text-[12px] text-slate-400">
        First time joining?{' '}
        <Link to="/join" className="font-semibold text-indigo-600 hover:underline">
          Set up your account
        </Link>
      </p>
    </form>
  )
}

// ─── Main Login page ──────────────────────────────────────────────────────────

export default function Login() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const [tab, setTab] = useState('email')  // 'email' | 'invite'

  function handleSuccess(user, token) {
    localStorage.setItem('manage_user', JSON.stringify(user))
    localStorage.setItem('manage_token', token)
    dispatch(hydrateAuth({ user, token }))
    const uid = user?._id ?? user?.id
    if (uid) void api.patch(`/users/${uid}/status`, { status: 'online' }).catch(() => {})
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="flex min-h-screen">
      <AuthLeftPanel />

      {/* Right panel */}
      <div className="flex w-full flex-col items-center justify-center overflow-y-auto bg-white p-8 lg:w-1/2">
        <div className="w-full max-w-md py-10">
          {/* Eyebrow */}
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[.22em] text-indigo-600">
            <Shield className="h-3.5 w-3.5" />
            Resolver access
          </span>

          {/* Tab strip */}
          <div className="mb-8 flex w-full rounded-full border border-slate-200 bg-slate-50/90 p-1">
            {[
              { key: 'email',  label: 'Email login' },
              { key: 'invite', label: 'Login with ID' },
            ].map(t => (
              <button key={t.key} type="button" onClick={() => setTab(t.key)}
                className={[
                  'flex-1 min-h-[40px] rounded-full px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider transition-all',
                  tab === t.key
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80'
                    : 'text-slate-500 hover:text-slate-800',
                ].join(' ')}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-semibold tracking-tight text-slate-900 [font-family:Georgia,'Times_New_Roman',serif]">
              {tab === 'email' ? 'Welcome back' : 'Team sign in'}
            </h2>
            <p className="text-slate-500 text-sm">
              {tab === 'email'
                ? 'Sign in to coordinate incidents and keep your team aligned.'
                : 'Use your invite ID and password to access the workspace.'}
            </p>
          </div>

          {tab === 'email'
            ? <EmailLoginForm onSuccess={handleSuccess} />
            : <InviteLoginForm onSuccess={handleSuccess} />}

          {/* Trust footer */}
          <div className="mt-12 text-center">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Trusted by organizations worldwide
            </p>
            <div className="flex justify-center gap-8 text-slate-300">
              <Activity size={20} /><Cpu size={20} /><Database size={20} /><Shield size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
