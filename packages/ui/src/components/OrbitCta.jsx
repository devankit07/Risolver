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
    <section className={`flex min-h-[500px] items-center overflow-x-visible bg-white py-20 ${containerClassName}`}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="grid w-full items-center gap-14 md:grid-cols-2">
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
          className="relative mx-auto flex min-h-[340px] w-full max-w-[min(100%,420px)] items-center justify-center px-2 py-4 sm:min-h-[360px] sm:max-w-[440px] sm:px-4"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute h-[min(78vw,310px)] w-[min(78vw,310px)] max-h-[310px] max-w-[310px] rounded-full border border-indigo-100 bg-indigo-50/35"
            animate={{ rotate: 360 }}
            transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute h-[min(56vw,220px)] w-[min(56vw,220px)] max-h-[220px] max-w-[220px] rounded-full border border-indigo-200 bg-white/70"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          />

          <div className="relative z-10 flex w-[min(100%,300px)] items-center justify-center rounded-[28px] bg-white px-5 py-4 shadow-[0_16px_40px_rgba(79,70,229,0.28)] ring-1 ring-indigo-100">
            <img
              src="/logo.png"
              alt="Resolver"
              width={320}
              height={80}
              className="h-auto w-full max-h-28 object-contain object-center"
              decoding="async"
            />
          </div>

          {[
            {
              label: labels[0] ?? 'AI triage',
              pos: 'left-3 top-1/2 z-20 -translate-y-1/2 sm:left-2 md:left-0',
            },
            {
              label: labels[1] ?? 'Live updates',
              pos: 'right-3 top-1/2 z-20 -translate-y-1/2 sm:right-2 md:right-0',
            },
            {
              label: labels[2] ?? 'Postmortem',
              pos: 'left-1/2 top-4 z-20 max-w-[calc(100%-2rem)] -translate-x-1/2 sm:top-3',
            },
            {
              label: labels[3] ?? 'Assign team',
              pos: 'bottom-4 left-1/2 z-20 max-w-[calc(100%-2rem)] -translate-x-1/2 sm:bottom-3',
            },
          ].map((node, idx) => (
            <motion.span
              key={node.label}
              className={`absolute ${node.pos} inline-flex max-w-[11rem] items-center justify-center whitespace-nowrap rounded-full border border-indigo-200 bg-white px-3 py-1 text-center text-[11px] font-semibold text-indigo-600 shadow-sm sm:text-xs`}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: idx * 0.25 }}
            >
              {node.label}
            </motion.span>
          ))}
        </motion.div>
        </div>
      </div>
    </section>
  )
}
