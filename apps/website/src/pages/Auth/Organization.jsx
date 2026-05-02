import { Mail, User, Users, ArrowRight, Building2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AuthSplitLayout } from '../../layouts/AuthSplitLayout.jsx'
import {
  AuthBackLink,
  AuthDivider,
  AuthEyebrow,
  AuthTabStrip,
  AuthTrustFooter,
  GoogleOAuthButton,
  authInputClassName,
  authLabelClassName,
} from '../../components/auth/AuthChrome.jsx'

export function OrganizationPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [teamSize, setTeamSize] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/')
  }

  return (
    <AuthSplitLayout>
      <AuthBackLink />
      <AuthEyebrow icon={Building2}>Organization setup</AuthEyebrow>

      <AuthTabStrip
        items={[
          { to: '/login', label: 'Sign in', end: true },
          { to: '/register', label: 'Register', end: true },
          { to: '/organization', label: 'Organization', end: true },
        ]}
      />

      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-semibold tracking-tight text-slate-900 [font-family:Georgia,'Times_New_Roman',serif]">
          Almost there
        </h2>
        <p className="text-slate-500">Tell us about your organization so we can tailor Resolver for your team.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="org-name" className={`block ${authLabelClassName}`}>
            Organization name
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <User size={18} aria-hidden />
            </div>
            <input
              id="org-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Resolver Inc."
              className={authInputClassName}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="org-email" className={`block ${authLabelClassName}`}>
            Organization email
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Mail size={18} aria-hidden />
            </div>
            <input
              id="org-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="org@company.com"
              className={authInputClassName}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="org-team-size" className={`block ${authLabelClassName}`}>
            Team size
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Users size={18} aria-hidden />
            </div>
            <input
              id="org-team-size"
              type="number"
              min={1}
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              placeholder="100"
              className={authInputClassName}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500 active:scale-[0.98]"
        >
          Create account
          <ArrowRight size={18} aria-hidden />
        </button>
      </form>

      <AuthDivider />
      <GoogleOAuthButton />
      <AuthTrustFooter />
    </AuthSplitLayout>
  )
}
