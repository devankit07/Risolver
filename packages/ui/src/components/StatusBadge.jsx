/* Light palette: indigo + black only. Dark: legacy greens/reds for marketing pages. */
const CONFIG_DARK = {
  open:          { label: 'Open',          bg: '#ff444422', color: '#ff4444', border: '#ff444433' },
  investigating: { label: 'Investigating', bg: '#f59e0b22', color: '#f59e0b', border: '#f59e0b33' },
  resolved:      { label: 'Resolved',      bg: '#00e87a22', color: '#00e87a', border: '#00e87a33' },
  critical:      { label: 'Critical',      bg: '#ff000033', color: '#ff4444', border: '#ff000044' },
  high:          { label: 'High',          bg: '#ff444422', color: '#ff8c00', border: '#ff444433' },
  medium:        { label: 'Medium',        bg: '#f59e0b22', color: '#f59e0b', border: '#f59e0b33' },
  low:           { label: 'Low',           bg: '#44444422', color: '#888',    border: '#44444433' },
  published:     { label: 'Published',     bg: '#00e87a22', color: '#00e87a', border: '#00e87a33' },
  draft:         { label: 'Draft',         bg: '#f59e0b22', color: '#f59e0b', border: '#f59e0b33' },
  online:        { label: 'Online',        bg: '#00e87a22', color: '#00e87a', border: '#00e87a33' },
  offline:       { label: 'Offline',       bg: '#44444422', color: '#888',    border: '#44444433' },
  away:          { label: 'Away',          bg: '#f59e0b22', color: '#f59e0b', border: '#f59e0b33' },
}

/** Indigo emphasis tiers (same hue, different weight) */
const CONFIG_LIGHT = {
  open:          { label: 'Open',          bg: '#eef2ff', color: '#3730a3', border: '#c7d2fe' },
  investigating: { label: 'Investigating', bg: '#e0e7ff', color: '#312e81', border: '#a5b4fc' },
  resolved:      { label: 'Resolved',      bg: '#f8fafc', color: '#0f172a', border: '#cbd5e1' },
  critical:      { label: 'Critical',      bg: '#e0e7ff', color: '#0f172a', border: '#4f46e5' },
  high:          { label: 'High',          bg: '#eef2ff', color: '#312e81', border: '#818cf8' },
  medium:        { label: 'Medium',        bg: '#f1f5f9', color: '#0f172a', border: '#94a3b8' },
  low:           { label: 'Low',           bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
  published:     { label: 'Published',     bg: '#eef2ff', color: '#3730a3', border: '#c7d2fe' },
  draft:         { label: 'Draft',         bg: '#f1f5f9', color: '#0f172a', border: '#cbd5e1' },
  online:        { label: 'Online',        bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  offline:       { label: 'Offline',       bg: '#f9fafb', color: '#4b5563', border: '#e5e7eb' },
  away:          { label: 'Away',          bg: '#fffbeb', color: '#d97706', border: '#fef3c7' },
}

/**
 * @param {{ status: string, className?: string, variant?: 'dark' | 'light' }} props
 */
export function StatusBadge({ status = 'open', className = '', variant = 'dark' }) {
  const key = status.toLowerCase()
  const table = variant === 'light' ? CONFIG_LIGHT : CONFIG_DARK
  const c = table[key] ?? (variant === 'light'
    ? { label: status, bg: '#f1f5f9', color: '#0f172a', border: '#e2e8f0' }
    : { label: status, bg: '#44444422', color: '#888', border: '#44444433' })
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${className}`}
      style={{ background: c.bg, color: c.color, borderColor: c.border }}
    >
      {c.label}
    </span>
  )
}
