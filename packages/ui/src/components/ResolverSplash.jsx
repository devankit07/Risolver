import gsap from 'gsap'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

/** @param {{ subtitle: string, variant?: 'public' | 'admin' }} props */
export function ResolverSplash({ subtitle, variant = 'public' }) {
  const logoRef = useRef(null)

  useEffect(() => {
    const el = logoRef.current
    if (!el) return undefined
    const tween = gsap.fromTo(el, { y: -6 }, { y: 6, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    return () => {
      tween.kill()
    }
  }, [])

  const pill =
    variant === 'admin'
      ? 'bg-rose-600/90 text-white'
      : 'bg-resolver-accent/90 text-white'

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 rounded-2xl border border-slate-200 bg-white px-10 py-12 shadow-xl shadow-resolver-accent/15">
      <div className="flex items-center gap-3">
        <span
          ref={logoRef}
          className="inline-flex size-14 items-center justify-center rounded-2xl bg-resolver-ink text-2xl font-semibold text-white"
        >
          R
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-resolver-muted">
            Incident responder
          </p>
          <h1 className="text-3xl font-bold text-resolver-ink">resolver</h1>
        </div>
        <span className={`ml-auto rounded-full px-3 py-1 text-[11px] font-semibold ${pill}`}>
          {variant === 'admin' ? 'Manage' : 'Public'}
        </span>
      </div>
      <motion.p
        className="text-lg text-resolver-muted"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {subtitle}
      </motion.p>
    </div>
  )
}
