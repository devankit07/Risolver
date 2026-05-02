import { motion } from 'framer-motion'

/**
 * @param {{
 *   icon: import('react').ReactNode,
 *   title: string,
 *   description: string,
 *   className?: string,
 * }} props
 */
export function FeatureCard({ icon, title, description, className = '' }) {
  return (
    <motion.article
      className={[
        'group rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6',
        'hover:border-[var(--border-hover)] transition-colors',
        'border-l-4 border-l-transparent hover:border-l-[var(--accent-green)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)' }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-4 text-[var(--accent-green)] [&_svg]:size-10">{icon}</div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>
    </motion.article>
  )
}
