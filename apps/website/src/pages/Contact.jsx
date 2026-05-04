import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, CheckCircle2, SendHorizonal, Zap, Clock, Lock, MessageCircle, Users, ArrowRight } from 'lucide-react'
import { MarketingPageShell } from '../components/MarketingPageShell.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5173/api'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.45, delay },
})

const inputCls =
  'w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50'

const readOnlyCls =
  'w-full rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-700 outline-none cursor-default'

const BENEFITS = [
  {
    icon: Zap,
    title: 'Fast response',
    desc: 'Our team responds within 2 business hours — no ticket queues, no bots.',
  },
  {
    icon: Clock,
    title: 'Async-friendly',
    desc: 'Describe your problem at your pace. We read every message carefully before replying.',
  },
  {
    icon: Lock,
    title: 'Private & secure',
    desc: 'Your details are never shared or used for anything other than helping you.',
  },
  {
    icon: MessageCircle,
    title: 'Real humans',
    desc: 'Every reply comes from the core team — the same people who built Resolver.',
  },
  {
    icon: Users,
    title: 'For teams of all sizes',
    desc: "Whether you're a solo SRE or managing a 500-person org, we're here to help.",
  },
]

export const Contact = () => {
  const { user } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [organization, setOrganization] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  /* auto-fill from auth when user is signed in */
  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      if (user.organizationName) setOrganization(user.organizationName)
      setConsent(true)
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!consent) return
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch(`${API}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message: `Organization: ${organization || 'N/A'}\nPhone: ${phone || 'N/A'}\n\n${message}`,
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message || 'Failed to send')
      setStatus('success')
    } catch (err) {
      setErrorMsg(err.message)
      setStatus('error')
    }
  }

  return (
    <MarketingPageShell maxWidthClass="max-w-5xl">

      {/* ── HEADER ── */}
      <div className="text-center">
        <motion.span
          className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600"
          {...fadeUp(0)}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Contact Resolver
        </motion.span>

        <motion.h1
          className="mt-8 text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.1] tracking-tight text-slate-900 [font-family:Georgia,'Times_New_Roman',serif]"
          {...fadeUp(0.07)}
        >
          How can we help your
          <br />
          <span className="italic text-indigo-400 text-[1.1em]">business?</span>
        </motion.h1>

        <motion.p
          className="mt-6 mx-auto max-w-xl text-base leading-relaxed text-slate-500 md:text-lg"
          {...fadeUp(0.13)}
        >
          Describe your challenge — we read every message and reply personally within 2 hours.
        </motion.p>
      </div>

      {/* ── FORM + SIDEBAR ── */}
      <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_340px]">

        {/* Contact Form */}
        <motion.div
          className="rounded-[2.5rem] border border-slate-200/80 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] md:p-12"
          {...fadeUp(0.2)}
        >
          {/* logged-in banner */}
          {user && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 px-4 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-xs font-bold text-white">
                {user.name?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <p className="text-[12px] text-indigo-700">
                Sending as <span className="font-bold">{user.name}</span> · {user.email}
              </p>
            </div>
          )}

          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Message sent!</h3>
                <p className="mt-2 text-sm text-slate-500">We'll get back to you within 2 business hours.</p>
              </div>
              <button
                onClick={() => { setStatus('idle'); setMessage(''); setOrganization(''); setPhone(''); if (!user) { setConsent(false) } }}
                className="rounded-2xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'error' && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errorMsg}
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                    Full Name
                  </label>
                  {user ? (
                    <input type="text" value={name} readOnly className={readOnlyCls} />
                  ) : (
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe" className={inputCls} required />
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                    Email
                  </label>
                  {user ? (
                    <input type="email" value={email} readOnly className={readOnlyCls} />
                  ) : (
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@company.com" className={inputCls} required />
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Organization</label>
                  {user && user.organizationName ? (
                    <input type="text" value={organization} readOnly className={readOnlyCls} />
                  ) : (
                    <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Company Name" className={inputCls} />
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Phone (Optional)</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210" className={inputCls} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">How can we help?</label>
                <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your problem, question, or feedback — anything helps…"
                  className={`${inputCls} resize-none`} required minLength={10} />
              </div>

              {!user && (
                <div className="flex items-start gap-3 px-1">
                  <input id="consent" type="checkbox" checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <label htmlFor="consent" className="text-xs leading-relaxed text-slate-500">
                    I agree to receive communications from Resolver.
                    See our <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={!consent || status === 'loading'}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SendHorizonal size={16} />
                {status === 'loading' ? 'Sending…' : 'Send Message'}
              </button>

              {/* nudge to sign up if not logged in */}
              {!user && (
                <p className="text-center text-[12px] text-slate-400">
                  Have an account?{' '}
                  <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
                    Sign in to auto-fill your details
                  </Link>
                </p>
              )}
            </form>
          )}
        </motion.div>

        {/* ── Right: notice / why contact us ── */}
        <div className="space-y-6 lg:pt-4">
          <motion.div {...fadeUp(0.25)}>
            <h3 className="text-xl font-semibold text-slate-900 [font-family:Georgia,'Times_New_Roman',serif]">
              Why reach out?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Whether you're facing an incident, planning a rollout, or just curious — this form is
              the fastest path to a real answer.
            </p>
          </motion.div>

          <div className="space-y-4">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.title}
                className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                {...fadeUp(0.3 + i * 0.07)}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <b.icon size={17} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-slate-800">{b.title}</p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-slate-500">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA if not logged in */}
          {!user && (
            <motion.div
              className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5"
              {...fadeUp(0.65)}
            >
              <p className="text-[13px] font-semibold text-indigo-800">
                Sign up to get faster support
              </p>
              <p className="mt-1 text-[12px] text-indigo-600/80 leading-relaxed">
                Registered users get priority replies and their details are auto-filled — no typing needed.
              </p>
              <Link
                to="/register"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-[12px] font-bold text-white shadow-sm transition hover:bg-indigo-500"
              >
                Create free account <ArrowRight size={13} />
              </Link>
            </motion.div>
          )}
        </div>

      </div>
    </MarketingPageShell>
  )
}
