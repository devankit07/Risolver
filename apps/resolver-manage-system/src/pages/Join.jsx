import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import {
  Shield, User, Lock, ArrowRight, Loader2, CheckCircle2,
  Activity, Cpu, Database, Building2, Tag, AlertTriangle,
} from 'lucide-react'
import { hydrateAuth } from '../store/authSlice.js'
import api from '../services/api.js'
import { getApiBaseUrl } from '../config/apiUrl.js'

const inputCls =
  'w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4 pl-12 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 placeholder:text-slate-400'

function FieldIcon({ icon: Icon }) {
  return (
    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
      <Icon className="h-4 w-4" />
    </span>
  )
}

function RolePill({ role }) {
  const map = {
    admin:     'bg-red-50    text-red-700    border-red-200',
    manager:   'bg-purple-50 text-purple-700 border-purple-200',
    creator:   'bg-indigo-50 text-indigo-700 border-indigo-200',
    responder: 'bg-green-50  text-green-700  border-green-200',
  }
  const cls = map[role?.toLowerCase()] ?? 'bg-slate-100 text-slate-600 border-slate-200'
  return (
    <span className={`inline-flex rounded-full border px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${cls}`}>
      {role || '—'}
    </span>
  )
}

// ─── Animated left panel ──────────────────────────────────────────────────────

function AuthLeftPanel() {
  return (
    <div
      className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden lg:flex"
      style={{ background: 'radial-gradient(ellipse at 30% 20%, #1e1460 0%, #0d0d1f 55%, #050510 100%)' }}
    >
      <style>{`
        @keyframes orbFloat2 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-18px) scale(1.04)} }
        @keyframes fadeUp2   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spinCW2   { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes spinCCW2  { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(-360deg)} }
        @keyframes blink2    { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes scan2     { 0%{top:-4px} 100%{top:100%} }
      `}</style>

      {Array.from({length:48}).map((_,i)=>{
        const s=Math.random()<.15?2:1
        return <div key={i} className="pointer-events-none absolute rounded-full bg-white" style={{width:s,height:s,top:`${Math.random()*100}%`,left:`${Math.random()*100}%`,opacity:Math.random()*.5+.1,animation:`blink2 ${2+Math.random()*4}s ease-in-out infinite`,animationDelay:`${Math.random()*4}s`}} />
      })}

      <div className="pointer-events-none absolute inset-0 z-0" style={{backgroundImage:'linear-gradient(rgba(99,102,241,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.07) 1px,transparent 1px)',backgroundSize:'48px 48px'}} />
      <div className="pointer-events-none absolute" style={{width:700,height:700,top:'50%',left:'50%',transform:'translate(-50%,-52%)',background:'radial-gradient(circle,rgba(99,102,241,.22) 0%,rgba(79,70,229,.1) 40%,transparent 70%)',filter:'blur(40px)'}} />
      <div className="pointer-events-none absolute" style={{width:560,height:560,top:'50%',left:'50%',borderRadius:'50%',border:'1px dashed rgba(99,102,241,.18)',animation:'spinCW2 40s linear infinite'}}>
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full" style={{background:'#6366f1',boxShadow:'0 0 12px #6366f1,0 0 24px rgba(99,102,241,.5)'}} />
      </div>
      <div className="pointer-events-none absolute" style={{width:440,height:440,top:'50%',left:'50%',borderRadius:'50%',border:'1px solid rgba(14,165,233,.12)',animation:'spinCCW2 28s linear infinite'}}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full" style={{background:'#0ea5e9',boxShadow:'0 0 10px #0ea5e9,0 0 20px rgba(14,165,233,.4)'}} />
      </div>
      <div className="pointer-events-none absolute rounded-full" style={{width:340,height:340,top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'radial-gradient(circle,rgba(99,102,241,.3) 0%,transparent 70%)',filter:'blur(12px)'}} />

      <div className="relative z-10 flex items-center justify-center" style={{animation:'fadeUp2 .8s ease both',animationDelay:'.2s'}}>
        <div className="relative flex flex-col items-center justify-center rounded-full" style={{width:280,height:280,background:'linear-gradient(145deg,rgba(99,102,241,.18),rgba(15,23,42,.6))',border:'1px solid rgba(99,102,241,.35)',backdropFilter:'blur(24px)',boxShadow:'0 0 80px rgba(99,102,241,.35),inset 0 0 60px rgba(99,102,241,.08)'}}>
          <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
            <div className="absolute left-0 right-0 h-px" style={{background:'linear-gradient(to right,transparent,rgba(99,102,241,.6),transparent)',animation:'scan2 3.5s linear infinite'}} />
          </div>
          <CheckCircle2 size={52} className="text-indigo-400 drop-shadow-[0_0_20px_rgba(99,102,241,.8)]" />
          <div className="mt-3 text-[11px] font-bold uppercase tracking-[.22em] text-indigo-300/70">Join Resolver</div>
        </div>
      </div>

      <div className="relative z-10 mt-14 px-10 text-center" style={{animation:'fadeUp2 .8s ease both',animationDelay:'.5s'}}>
        <h1 className="text-[19px] font-semibold tracking-wide text-white/90">You've been invited</h1>
        <p className="mt-4 text-[13px] leading-relaxed text-indigo-200/45 max-w-[280px] mx-auto">
          Set up your account and join your team's incident response workspace.
        </p>
      </div>

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

// ─── Main Join page ───────────────────────────────────────────────────────────

export default function Join() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const urlId = searchParams.get('id') ?? ''

  const [inviteId, setInviteId] = useState(urlId.toUpperCase())
  const [invite, setInvite]     = useState(null)   // { orgName, role, name, specialization }
  const [fetching, setFetching] = useState(false)
  const [fetchErr, setFetchErr] = useState('')

  const [name, setName]         = useState('')
  const [pass, setPass]         = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)

  // Auto-fetch when URL has an id
  useEffect(() => {
    if (urlId) fetchInvite(urlId.toUpperCase())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlId])

  async function fetchInvite(id) {
    setFetching(true)
    setFetchErr('')
    setInvite(null)
    try {
      const res  = await fetch(`${getApiBaseUrl()}/invites/validate?id=${encodeURIComponent(id)}`)
      const data = await res.json()
      if (!data.success) { setFetchErr('Could not verify invite.'); return }
      const info = data.data ?? data
      if (!info.valid) {
        setFetchErr(
          info.reason === 'used'    ? 'This invite has already been used.' :
          info.reason === 'expired' ? 'This invite has expired. Ask your admin for a new one.' :
          'Invite not found.',
        )
        return
      }
      setInvite(info)
      // Pre-fill name only if the admin set a placeholder like the invite name
      if (info.name) setName(info.name)
    } catch {
      setFetchErr('Could not reach the server.')
    } finally {
      setFetching(false)
    }
  }

  async function handleSetup(e) {
    e.preventDefault()
    setError('')

    if (!name.trim())           return setError('Please enter your name.')
    if (pass.length < 6)        return setError('Password must be at least 6 characters.')
    if (pass !== confirm)       return setError('Passwords do not match.')

    setLoading(true)
    try {
      const res  = await fetch(`${getApiBaseUrl()}/invites/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ inviteId: inviteId.trim(), name: name.trim(), password: pass }),
      })
      const data = await res.json()
      if (!data.success) { setError(data.message || 'Setup failed.'); return }

      const user  = data.data.user
      const token = data.data.token

      localStorage.setItem('manage_user', JSON.stringify(user))
      localStorage.setItem('manage_token', token)
      dispatch(hydrateAuth({ user, token }))
      const uid = user?._id ?? user?.id
      if (uid) void api.patch(`/users/${uid}/status`, { status: 'online' }).catch(() => {})

      setDone(true)
      setTimeout(() => navigate('/dashboard', { replace: true }), 1400)
    } catch {
      setError('Could not connect. Is the server running?')
    } finally {
      setLoading(false)
    }
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
            Team invitation
          </span>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-semibold tracking-tight text-slate-900 [font-family:Georgia,'Times_New_Roman',serif]">
              Set up your account
            </h2>
            <p className="text-sm text-slate-500">
              Enter your invite ID, confirm your details, and create a password.
            </p>
          </div>

          {/* ── Step 1: enter / verify invite ID ── */}
          {!invite && (
            <div className="mb-6 space-y-4">
              <div className="space-y-2">
                <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Invite ID
                </label>
                <div className="relative">
                  <FieldIcon icon={Tag} />
                  <input
                    type="text"
                    value={inviteId}
                    onChange={e => setInviteId(e.target.value.toUpperCase())}
                    placeholder="RES-XXXX"
                    className={`${inputCls} font-mono tracking-widest`}
                  />
                </div>
              </div>

              {fetchErr && (
                <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  {fetchErr}
                </div>
              )}

              <button
                type="button"
                disabled={fetching || !inviteId.trim()}
                onClick={() => fetchInvite(inviteId.trim())}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {fetching ? <Loader2 size={18} className="animate-spin" /> : <>Verify invite <ArrowRight size={18} /></>}
              </button>

              <p className="text-center text-[12px] text-slate-400">
                Already set up?{' '}
                <Link to="/login" className="font-semibold text-indigo-600 hover:underline">Sign in</Link>
              </p>
            </div>
          )}

          {/* ── Step 2: confirmed invite details + form ── */}
          {invite && !done && (
            <form onSubmit={handleSetup} className="space-y-5">
              {/* Invite info card */}
              <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-purple-50/40 p-4 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Invite details</p>
                <div className="grid grid-cols-2 gap-3 text-[13px]">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Organization</span>
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <Building2 size={13} className="text-indigo-400" />
                      {invite.orgName || '—'}
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Role</span>
                    <RolePill role={invite.role} />
                  </div>
                  {invite.specialization && (
                    <div className="col-span-2 flex flex-col gap-0.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Specialization</span>
                      <span className="font-medium text-slate-800 capitalize">{invite.specialization}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  <CheckCircle2 size={13} className="text-green-500" />
                  <span className="text-[11px] font-semibold text-green-600">Invite code{' '}
                    <span className="font-mono">{inviteId}</span> verified
                  </span>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Your name
                </label>
                <div className="relative">
                  <FieldIcon icon={User} />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Full name"
                    required
                    autoComplete="name"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Create password
                </label>
                <div className="relative">
                  <FieldIcon icon={Lock} />
                  <input
                    type="password"
                    value={pass}
                    onChange={e => setPass(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    autoComplete="new-password"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Confirm password */}
              <div className="space-y-2">
                <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Confirm password
                </label>
                <div className="relative">
                  <FieldIcon icon={Lock} />
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Repeat password"
                    required
                    autoComplete="new-password"
                    className={inputCls}
                  />
                </div>
                {confirm && pass !== confirm && (
                  <p className="ml-1 text-[11px] text-rose-500">Passwords don't match</p>
                )}
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? <Loader2 size={18} className="animate-spin" />
                  : <>Create account &amp; sign in <ArrowRight size={18} /></>}
              </button>

              <p className="text-center text-[12px] text-slate-400">
                Already set up?{' '}
                <Link to="/login" className="font-semibold text-indigo-600 hover:underline">Sign in instead</Link>
              </p>
            </form>
          )}

          {/* ── Step 3: success ── */}
          {done && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">You're in!</h3>
              <p className="text-sm text-slate-500">Account created. Redirecting to your dashboard…</p>
              <Loader2 size={18} className="animate-spin text-indigo-400" />
            </div>
          )}

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
