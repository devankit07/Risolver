/**
 * Elevated metric tile (webfudge / Books-style): large value, optional icon in cut corner, dot + sublabel.
 *
 * @param {{
 *   label: string,
 *   value: string | number,
 *   sublabel?: string,
 *   valueColor?: string,
 *   className?: string,
 *   variant?: 'dark' | 'light',
 *   icon?: import('react').ComponentType<{ className?: string; 'aria-hidden'?: boolean }>,
 *   dotClassName?: string,
 * }} props
 */
export function KpiCard({
  label,
  value,
  sublabel,
  valueColor,
  className = '',
  variant = 'light',
  icon: Icon,
  dotClassName = 'bg-indigo-500',
}) {
  const light = variant === 'light'
  const valC = valueColor ?? (light ? '#0f172a' : '#f0f0f0')
  const labelC = light ? 'text-slate-600' : 'text-zinc-400'
  const subC = light ? 'text-slate-500' : 'text-zinc-500'

  return (
    <div
      className={[
        'group relative overflow-hidden rounded-xl border-0 p-6 pb-0 pr-0',
        'shadow-[0_3px_16px_rgba(15,23,42,0.10),0_2px_5px_rgba(15,23,42,0.06)]',
        'transition-shadow duration-300 hover:shadow-[0_6px_26px_rgba(15,23,42,0.12),0_3px_8px_rgba(15,23,42,0.08)]',
        light ? 'bg-white' : 'bg-zinc-900',
        className,
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 pr-2">
          <p className={`mb-2 text-sm font-medium ${labelC}`}>{label}</p>
          <p
            className="text-4xl font-bold leading-none tracking-tight"
            style={{ color: valC }}
          >
            {value}
          </p>
          {sublabel && (
            <div className={`mt-2 flex items-center gap-1.5 text-sm ${subC}`}>
              <span className={`h-2 w-2 shrink-0 rounded-full ${dotClassName}`} aria-hidden />
              <span>{sublabel}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div
            className={[
              'relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden sm:h-28 sm:w-28',
              'rounded-2xl rounded-bl-none rounded-tr-none',
              light ? 'bg-indigo-50' : 'bg-white/10',
            ].join(' ')}
            aria-hidden
          >
            <Icon
              className={[
                'absolute -bottom-5 -right-5 h-full w-full sm:-bottom-6 sm:-right-6',
                light ? 'text-indigo-600 opacity-90' : 'text-indigo-300 opacity-80',
              ].join(' ')}
            />
          </div>
        )}
      </div>
    </div>
  )
}
