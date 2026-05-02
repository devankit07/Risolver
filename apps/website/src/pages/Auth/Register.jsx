import { Mail, Lock, User, ArrowRight, Building2, Users, Phone, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
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

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  /* step 1 state */
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  /* step 2 state */
  const [orgName, setOrgName] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [phone, setPhone] = useState('')

  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleStep1 = (e) => {
    e.preventDefault()
    setError('')
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register({ name, email, password, organizationName: orgName })
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
      <AuthEyebrow icon={step === 1 ? User : Building2}>
        {step === 1 ? 'Create your account' : 'Set up your organization'}
      </AuthEyebrow>

      <AuthTabStrip
        items={[
          { to: '/login', label: 'Sign in', end: true },
          { to: '/register', label: 'Register', end: true },
        ]}
      />

      {/* Step indicator */}
      <div className="mb-6 flex items-center gap-3 w-full max-w-md">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">1</div>
          <span className={`text-xs font-semibold ${step === 1 ? 'text-slate-900' : 'text-slate-400'}`}>Your details</span>
        </div>
        <div className="h-px flex-1 bg-slate-200" />
        <div className="flex items-center gap-2">
          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>2</div>
          <span className={`text-xs font-semibold ${step === 2 ? 'text-slate-900' : 'text-slate-400'}`}>Organization</span>
        </div>
      </div>

      {/* Step 1 — Personal details */}
      {step === 1 && (
        <>
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-semibold tracking-tight text-slate-900 [font-family:Georgia,'Times_New_Roman',serif]">
              Join Resolver
            </h2>
            <p className="text-slate-500">Create your profile — we'll set up your organization next.</p>
          </div>

          {error && (
            <div className="mb-4 w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleStep1} className="w-full space-y-6">
            <div className="space-y-2">
              <label htmlFor="reg-name" className={`block ${authLabelClassName}`}>Full name</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <User size={18} aria-hidden />
                </div>
                <input id="reg-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe" className={authInputClassName} required />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="reg-email" className={`block ${authLabelClassName}`}>Email address</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <Mail size={18} aria-hidden />
                </div>
                <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" className={authInputClassName} required />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="reg-password" className={`block ${authLabelClassName}`}>Password</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <Lock size={18} aria-hidden />
                </div>
                <input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 chars, upper, lower, number, symbol" className={authInputClassName} required />
              </div>
              <p className="ml-1 text-[11px] text-slate-400">Minimum 8 characters.</p>
            </div>

            <button type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500 active:scale-[0.98]">
              Continue <ArrowRight size={18} aria-hidden />
            </button>
          </form>

          <AuthTrustFooter />
        </>
      )}

      {/* Step 2 — Organization */}
      {step === 2 && (
        <>
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-semibold tracking-tight text-slate-900 [font-family:Georgia,'Times_New_Roman',serif]">
              Almost there
            </h2>
            <p className="text-slate-500">
              Setting up organization for <span className="font-semibold text-indigo-600">{email}</span>
            </p>
          </div>

          {error && (
            <div className="mb-4 w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {/* email pre-filled read-only */}
            <div className="space-y-2">
              <label className={authLabelClassName}>Your email</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <Mail size={18} aria-hidden />
                </div>
                <input type="email" value={email} readOnly
                  className={`${authInputClassName} cursor-not-allowed opacity-60`} />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="org-name" className={`block ${authLabelClassName}`}>Organization / Company name</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <Building2 size={18} aria-hidden />
                </div>
                <input id="org-name" type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Acme Corp" className={authInputClassName} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="team-size" className={`block ${authLabelClassName}`}>Team size</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <Users size={18} aria-hidden />
                  </div>
                  <input id="team-size" type="number" min={1} value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    placeholder="e.g. 25" className={authInputClassName} required />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className={`block ${authLabelClassName}`}>Phone number</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <Phone size={18} aria-hidden />
                  </div>
                  <input id="phone" type="tel" value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210" className={authInputClassName} />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => { setStep(1); setError('') }}
                className="flex-1 rounded-2xl border border-slate-200 py-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]">
                Back
              </button>
              <button type="submit" disabled={loading}
                className="flex flex-[2] items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? 'Creating account…' : 'Create account'}
                {!loading && <ArrowRight size={18} aria-hidden />}
              </button>
            </div>
          </form>
          <AuthTrustFooter />
        </>
      )}
    </AuthSplitLayout>
  )
}
