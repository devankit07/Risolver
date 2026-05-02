import { motion } from 'framer-motion'
import { useState } from 'react'

/**
 * @param {{
 *  badge?: string
 *  title: string
 *  subtitle?: string
 *  items: { q: string, a: string }[]
 *  className?: string
 * }} props
 */
export function FaqAccordion({ badge = 'FAQ', title, subtitle = '', items, className = '' }) {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <section className={`bg-white px-6 py-24 ${className}`}>
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[340px_1fr]">
        <motion.div
          className="lg:sticky lg:top-24 lg:self-start"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <p className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
            {badge}
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">{title}</h2>
          {subtitle ? <p className="mt-4 text-base leading-relaxed text-slate-600">{subtitle}</p> : null}
        </motion.div>

        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45 }}
        >
          {items.map((item, idx) => {
            const isOpen = openFaq === idx
            return (
              <article
                key={item.q}
                className={[
                  'rounded-2xl border bg-white transition-all',
                  isOpen
                    ? 'border-indigo-200 shadow-[0_12px_30px_rgba(99,102,241,0.14)]'
                    : 'border-slate-200 hover:border-slate-300',
                ].join(' ')}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] font-semibold text-slate-900">{item.q}</span>
                  <span
                    className={[
                      'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold transition',
                      isOpen ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600',
                    ].join(' ')}
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                <div
                  className={[
                    'grid transition-all duration-300',
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                  ].join(' ')}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{item.a}</p>
                  </div>
                </div>
              </article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
