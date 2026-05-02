import { motion } from 'framer-motion'

/**
 * @param {{
 *   children: import('react').ReactNode,
 *   className?: string,
 *   emphasized?: boolean,
 * }} props
 */
export function GlassCard({ children, className = '', emphasized = false }) {
  return (
    <motion.div
      className={[
        'rounded-xl border border-[var(--border)] bg-[var(--bg-card)]/85 p-6 backdrop-blur-sm',
        emphasized ? 'md:scale-[1.02] ring-1 ring-[var(--accent-green-dim)]' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      whileHover={{ y: -4, boxShadow: '0 20px 50px rgba(0, 0, 0, 0.55)' }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
