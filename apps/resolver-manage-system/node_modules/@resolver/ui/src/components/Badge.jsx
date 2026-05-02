/**
 * @param {{ children: import('react').ReactNode, className?: string }} props
 */
export function Badge({ children, className = '' }) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full border border-[var(--border)]',
        'bg-[var(--bg-secondary)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  )
}
