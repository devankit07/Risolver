import gsap from 'gsap'
import { motion } from 'framer-motion'
import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function HeroSection() {
  const heroWordsRef = useRef(null)

  useLayoutEffect(() => {
    const root = heroWordsRef.current
    if (!root) return undefined
    const ctx = gsap.context(() => {
      gsap.from('.hero-word', {
        opacity: 0,
        y: 30,
        duration: 0.75,
        stagger: 0.08,
        ease: 'power3.out',
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[radial-gradient(circle_at_25%_8%,#eef1ff_0%,#f8f9ff_44%,#ffffff_100%)] px-6 pb-0 pt-28 md:pt-36">

      {/* ── grid bg ── */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage:
              'linear-gradient(to right,rgba(99,102,241,0.13) 1px,transparent 1px),linear-gradient(to bottom,rgba(99,102,241,0.13) 1px,transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(99,102,241,0.10)_0%,transparent_100%)]" />
      </div>

      {/* ── soft blobs ── */}
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-indigo-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-28 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />

      {/* ── strong bottom white gradient ── */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-white via-white/90 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white to-transparent" />

      {/* ── hero text + cta ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <h1
          ref={heroWordsRef}
          className="mt-2 space-y-2 text-4xl font-medium leading-[1.05] tracking-[-0.025em] text-slate-900 md:text-6xl lg:text-[68px] [font-family:Georgia,'Times_New_Roman',serif]"
        >
          <span className="hero-word block whitespace-nowrap">
            Respond <span className="italic underline decoration-2 underline-offset-[0.14em]">Faster</span> Resolve Smarter.
          </span>
          <span className="hero-word block whitespace-nowrap">
            One Platform Zero <span className="underline decoration-2 underline-offset-[0.14em]">Chaos.</span>
          </span>
        </h1>

        <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-500 md:text-lg">
          Built for teams that can't afford downtime — real-time incident management, AI triage, and auto postmortems in one workspace.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/pricing"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500"
          >
            Get started free
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            See how it works
          </a>
        </div>
      </div>

      {/* ── DASHBOARD DEMO ── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.4 }}
        className="relative z-10 mx-auto mt-14 w-full max-w-6xl"
      >
        {/* glow behind card */}
        <div className="pointer-events-none absolute -inset-x-6 -top-6 h-32 bg-gradient-to-b from-transparent via-indigo-50/60 to-transparent blur-2xl" />

        <div className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-[0_40px_120px_rgba(15,23,42,0.15),0_0_0_1px_rgba(99,102,241,0.05)]">

          {/* window chrome */}
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
            <span className="size-3 rounded-full bg-rose-400" />
            <span className="size-3 rounded-full bg-amber-400" />
            <span className="size-3 rounded-full bg-emerald-400" />
            <span className="mx-auto rounded-md border border-slate-200 bg-white px-20 py-1 text-[11px] text-slate-400">
              app.resolver.io / dashboard
            </span>
          </div>

          <div className="grid md:grid-cols-[200px_1fr]">

            {/* ── sidebar ── */}
            <aside className="border-r border-slate-100 bg-gradient-to-b from-indigo-600 to-indigo-500 p-4 text-white">
              <div className="mb-5 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-xs font-bold">R</span>
                <span className="text-sm font-semibold">Resolver</span>
              </div>
              <ul className="space-y-0.5 text-[13px]">
                {[
                  { label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', active: true },
                  { label: 'Incidents', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', active: false },
                  { label: 'Escalations', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', active: false },
                  { label: 'AI Analysis', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', active: false },
                  { label: 'Team', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', active: false },
                  { label: 'Reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', active: false },
                  { label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', active: false },
                ].map((item) => (
                  <li
                    key={item.label}
                    className={[
                      'flex cursor-default items-center gap-2.5 rounded-lg px-3 py-2',
                      item.active ? 'bg-white/20 font-semibold text-white' : 'text-indigo-100 hover:bg-white/10',
                    ].join(' ')}
                  >
                    <svg className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                    {item.label}
                  </li>
                ))}
              </ul>
            </aside>

            {/* ── main content ── */}
            <div className="bg-[#f9fafb] p-5">

              {/* header */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Welcome back, Admin 👋</p>
                  <p className="text-xs text-slate-500">Here's your incident overview for today</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-7 items-center gap-1 rounded-full bg-emerald-100 px-3 text-[11px] font-semibold text-emerald-700">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    All systems up
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* stat cards */}
              <div className="mb-4 grid grid-cols-3 gap-3">
                {[
                  { label: 'Open Incidents', value: '04', sub: '+1 since yesterday', color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' },
                  { label: 'Avg. MTTR', value: '31 min', sub: '↓ 12% this week', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                  { label: 'AI Suggestions', value: '17', sub: '6 applied today', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
                ].map((s) => (
                  <div key={s.label} className={`rounded-xl border ${s.border} bg-white p-3 shadow-sm`}>
                    <p className="text-[11px] font-medium text-slate-500">{s.label}</p>
                    <p className={`mt-1 text-xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="mt-0.5 text-[10px] text-slate-400">{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* bottom row: chart + incidents */}
              <div className="grid gap-3 md:grid-cols-[1fr_220px]">

                {/* chart */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-700">Incident trend</p>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">Last 7 days</span>
                  </div>
                  <svg viewBox="0 0 340 72" className="h-20 w-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <polygon
                      fill="url(#chartGrad)"
                      points="0,72 0,58 48,52 96,48 144,50 192,40 240,32 288,36 340,20 340,72"
                    />
                    <polyline
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      points="0,58 48,52 96,48 144,50 192,40 240,32 288,36 340,20"
                    />
                    {[
                      [0,58],[48,52],[96,48],[144,50],[192,40],[240,32],[288,36],[340,20],
                    ].map(([x, y]) => (
                      <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="#6366f1" />
                    ))}
                  </svg>
                </div>

                {/* recent incidents */}
                <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                  <p className="mb-2 text-xs font-semibold text-slate-700">Recent Incidents</p>
                  <ul className="space-y-2">
                    {[
                      { id: 'INC-042', label: 'Payment gateway 500', sev: 'P1', color: 'bg-rose-100 text-rose-700' },
                      { id: 'INC-041', label: 'Auth service slow', sev: 'P2', color: 'bg-amber-100 text-amber-700' },
                      { id: 'INC-040', label: 'DB pool exhausted', sev: 'P2', color: 'bg-amber-100 text-amber-700' },
                      { id: 'INC-039', label: 'CDN cache miss', sev: 'P3', color: 'bg-blue-100 text-blue-700' },
                    ].map((inc) => (
                      <li key={inc.id} className="flex items-center gap-2">
                        <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold ${inc.color}`}>{inc.sev}</span>
                        <span className="truncate text-[11px] text-slate-600">{inc.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* strong bottom fade out into page */}
        <div className="pointer-events-none absolute -inset-x-4 bottom-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent" />
      </motion.div>
    </section>
  )
}
