const COLORS = [
  '#00e87a22',
  '#534AB722',
  '#378add22',
  '#ff444422',
  '#f59e0b22',
]

const TEXT_COLORS = ['#00e87a', '#7F77DD', '#378add', '#ff4444', '#f59e0b']

function colorIndex(name = '') {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff
  return h % COLORS.length
}

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

/**
 * @param {{ name?: string, size?: number, className?: string, colorOverride?: string, foreground?: string }} props
 */
export function Avatar({ name = '?', size = 28, className = '', colorOverride, foreground }) {
  const idx = colorIndex(name)
  const bg = colorOverride ?? COLORS[idx]
  const color = foreground ?? TEXT_COLORS[idx]
  const fontSize = Math.round(size * 0.38)
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold shrink-0 ${className}`}
      style={{ width: size, height: size, background: bg, color, fontSize }}
      title={name}
    >
      {initials(name)}
    </span>
  )
}
