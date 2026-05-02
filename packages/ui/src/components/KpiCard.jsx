/**
 * @param {{
 *   label: string,
 *   value: string | number,
 *   sublabel?: string,
 *   valueColor?: string,
 *   className?: string,
 *   variant?: 'dark' | 'light',
 * }} props
 */
export function KpiCard({
  label,
  value,
  sublabel,
  valueColor,
  className = '',
  variant = 'dark',
}) {
  const light = variant === 'light'
  const bg = light ? '#ffffff' : '#111'
  const border = light ? '#e2e8f0' : '#1a1a1a'
  const labelC = light ? '#64748b' : '#555'
  const valC = valueColor ?? (light ? '#4f46e5' : '#f0f0f0')
  const subC = light ? '#94a3b8' : '#555'

  return (
    <div
      className={`rounded-xl border p-3 flex flex-col gap-1 shadow-sm ${className}`}
      style={{ background: bg, borderColor: border }}
    >
      <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: labelC }}>
        {label}
      </span>
      <span className="text-lg font-semibold leading-tight" style={{ color: valC }}>
        {value}
      </span>
      {sublabel && (
        <span className="text-[10px]" style={{ color: subC }}>
          {sublabel}
        </span>
      )}
    </div>
  )
}
