import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

/**
 * @param {{
 *  badge?: string
 *  title: string
 *  description: string
 *  primaryLabel: string
 *  primaryTo: string
 *  labels?: string[]
 *  containerClassName?: string
 * }} props
 */
export function OrbitCta({
  badge = 'Get Started',
  title,
  description,
  primaryLabel,
  primaryTo,
  labels = ['AI triage', 'Live updates', 'Postmortem', 'Assign team'],
  containerClassName = '',
}) {
  return (
    <section className={`flex min-h-[500px] items-center bg-white px-6 py-20 ${containerClassName}`}>
      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 md:grid-cols-2">
        <motion.div
          className="md:pl-10 lg:pl-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45 }}
        >
          <p className="inline-flex items-center rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold tracking-wide text-indigo-600">
            {badge}
          </p>
          <h2 className="mt-5 max-w-md text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600">{description}</p>
          <Link
            to={primaryTo}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            {primaryLabel}
          </Link>
        </motion.div>

        <motion.div
          className="relative mx-auto flex h-[320px] w-full max-w-[360px] items-center justify-center"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute h-[310px] w-[310px] rounded-full border border-indigo-100 bg-indigo-50/35"
            animate={{ rotate: 360 }}
            transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute h-[220px] w-[220px] rounded-full border border-indigo-200 bg-white/70"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          />

          <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-600 text-white shadow-[0_16px_35px_rgba(79,70,229,0.35)]">
            <svg className="size-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5V4H2v16h5m10 0v-4a3 3 0 00-3-3H10a3 3 0 00-3 3v4m10 0H7m5-12a3 3 0 110 6 3 3 0 010-6z" />
            </svg>
          </div>

          {[
            { label: labels[0] ?? 'AI triage', pos: 'left-0 top-1/2 -translate-y-1/2' },
            { label: labels[1] ?? 'Live updates', pos: 'right-0 top-1/2 -translate-y-1/2' },
            { label: labels[2] ?? 'Postmortem', pos: 'left-1/2 top-2 -translate-x-1/2' },
            { label: labels[3] ?? 'Assign team', pos: 'left-1/2 bottom-2 -translate-x-1/2' },
          ].map((node, idx) => (
            <motion.span
              key={node.label}
              className={`absolute ${node.pos} inline-flex items-center rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold text-indigo-600 shadow-sm`}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: idx * 0.25 }}
            >
              {node.label}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
