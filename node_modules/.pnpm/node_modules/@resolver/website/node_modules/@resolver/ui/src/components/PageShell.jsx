/**
 * @param {{
 *   children: import('react').ReactNode,
 *   title?: string,
 *   subtitle?: string,
 *   maxWidth?: 'md' | 'lg' | 'xl' | '6xl',
 *   className?: string,
 * }} props
 */
export function PageShell({ children, title, subtitle, maxWidth = '6xl', className = '' }) {
  const mw = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '6xl': 'max-w-6xl',
  }[maxWidth]
  return (
    <div className={['mx-auto w-full px-6', mw, className].filter(Boolean).join(' ')}>
      {title ? (
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] md:text-5xl">{title}</h1>
          {subtitle ? <p className="mt-4 max-w-2xl text-lg text-[var(--text-secondary)]">{subtitle}</p> : null}
        </header>
      ) : null}
      {children}
    </div>
  )
}
