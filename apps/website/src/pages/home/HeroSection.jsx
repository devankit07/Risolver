import gsap from 'gsap'
import { motion } from 'framer-motion'
import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const MANAGE_URL = import.meta.env.VITE_MANAGE_URL || 'http://localhost:3001'

export default function HeroSection() {
  const heroWordsRef = useRef(null)
  const { user } = useAuth()

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
          {user ? (
            /* ── logged-in CTAs ── */
            <>
              <a
                href={MANAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500"
              >
                Access your dashboard ↗
              </a>
              <Link
                to="/docs"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                View docs
              </Link>
            </>
          ) : (
            /* ── logged-out CTAs ── */
            <>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500"
              >
                Register
              </Link>
              <Link
                to="/docs"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                See how it works
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── DASHBOARD DEMO (screenshot) ── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.4 }}
        className="relative z-10 mx-auto mt-14 w-full max-w-6xl"
      >
        <div className="pointer-events-none absolute -inset-x-6 -top-6 h-32 bg-gradient-to-b from-transparent via-indigo-50/60 to-transparent blur-2xl" />

        <div className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-[0_40px_120px_rgba(15,23,42,0.15),0_0_0_1px_rgba(99,102,241,0.05)]">
          <img
            src="/image.png"
            alt="Resolver incident response dashboard"
            className="block h-auto w-full"
            loading="eager"
            decoding="async"
          />
        </div>

        <div
          className="pointer-events-none absolute -inset-x-4 bottom-0 h-[min(58%,26rem)] min-h-[12rem] bg-[linear-gradient(to_top,#fff_0%,#fff_14%,rgba(255,255,255,0.97)_32%,rgba(255,255,255,0.85)_55%,rgba(255,255,255,0.45)_78%,transparent_100%)]"
          aria-hidden
        />
      </motion.div>
    </section>
  )
}
