import { motion } from 'framer-motion'

/**
 * Page enter animation wrapper (manage-system shell).
 *
 * @param {{ children: import('react').ReactNode, className?: string }} props
 */
export function MotionPage({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
