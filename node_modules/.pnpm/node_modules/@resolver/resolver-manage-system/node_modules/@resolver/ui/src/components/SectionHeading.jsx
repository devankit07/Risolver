/**
 * @param {{
 *   eyebrow?: string,
 *   title: string,
 *   subtitle?: string,
 *   align?: 'left' | 'center',
 * }} props
 */
export function SectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
  const alignCls = align === 'center' ? 'text-center mx-auto' : ''
  return (
    <div className={`max-w-3xl ${alignCls}`}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-green)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-4 text-lg text-[var(--text-secondary)]">{subtitle}</p> : null}
    </div>
  )
}
