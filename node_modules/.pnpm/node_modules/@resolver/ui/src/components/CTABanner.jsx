import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from './Button.jsx'

/**
 * @param {{
 *   title: string,
 *   subtitle: string,
 *   ctaLabel: string,
 *   onCtaClick?: () => void,
 *   ctaHref?: string,
 *   ctaTo?: string,
 * }} props
 */
export function CTABanner({ title, subtitle, ctaLabel, onCtaClick, ctaHref, ctaTo }) {
  return (
    <motion.section
      className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-8 py-14 text-center shadow-cta-glow md:px-16"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45 }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--accent-green-dim)_0%,_transparent_55%)]" />
      <div className="relative mx-auto max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl">{title}</h2>
        <p className="mt-4 text-lg text-[var(--text-secondary)]">{subtitle}</p>
        <div className="mt-8">
          {ctaTo ? (
            <Link
              to={ctaTo}
              className="inline-flex items-center justify-center rounded-lg bg-[var(--accent-green)] px-8 py-3 text-base font-semibold text-black transition hover:brightness-110"
            >
              {ctaLabel}
            </Link>
          ) : null}
          {!ctaTo && ctaHref ? (
            <a
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-lg bg-[var(--accent-green)] px-8 py-3 text-base font-semibold text-black transition hover:brightness-110"
            >
              {ctaLabel}
            </a>
          ) : null}
          {!ctaTo && !ctaHref ? (
            <Button variant="primary" className="px-8 py-3 text-base" type="button" onClick={onCtaClick}>
              {ctaLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </motion.section>
  )
}
