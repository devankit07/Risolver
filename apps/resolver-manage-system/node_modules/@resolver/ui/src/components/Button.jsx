/** @typedef {'primary' | 'secondary' | 'ghost'} ButtonVariant */

/**
 * @param {{
 *   children: import('react').ReactNode,
 *   variant?: ButtonVariant,
 *   className?: string,
 *   type?: 'button' | 'submit' | 'reset',
 *   ...import('react').ButtonHTMLAttributes<HTMLButtonElement>
 * }} props
 */
export function Button({ children, variant = 'primary', className = '', type = 'button', ...rest }) {
  const base =
    'inline-flex items-center justify-center font-semibold transition rounded-lg px-6 py-2.5 disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    primary:
      'bg-[var(--accent-green)] text-black hover:brightness-110 rounded-lg px-6 py-2.5',
    secondary:
      'border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] bg-transparent',
    ghost: 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-transparent px-4 py-2',
  }
  return (
    <button type={type} className={[base, variants[variant], className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </button>
  )
}
