import { Avatar } from './Avatar.jsx'

const TYPE_DARK = {
  update: '#00e87a',
  escalation: '#ff4444',
  change: '#f59e0b',
  ai: '#7F77DD',
  note: '#555',
}

const TYPE_LIGHT = {
  update: '#4f46e5',
  escalation: '#0f172a',
  change: '#6366f1',
  ai: '#4f46e5',
  note: '#94a3b8',
}

/**
 * @param {{
 *   item: { type: string, timestamp: string, author?: string, content: string, isAi?: boolean },
 *   isLast?: boolean,
 *   variant?: 'dark' | 'light',
 * }} props
 */
export function TimelineItem({ item, isLast = false, variant = 'dark' }) {
  const light = variant === 'light'
  const TYPE = light ? TYPE_LIGHT : TYPE_DARK
  const color = TYPE[item.type?.toLowerCase()] ?? (light ? '#cbd5e1' : '#555')
  const isAi = item.isAi || item.type?.toLowerCase() === 'ai'
  const line = light ? '#e2e8f0' : '#1a1a1a'
  const aiBg = light ? '#eef2ff' : '#534AB722'
  const aiBorder = light ? '#c7d2fe' : '#534AB744'
  const aiBadge = light ? '#4f46e5' : '#534AB7'
  const meta = light ? '#64748b' : '#555'
  const authorC = light ? '#475569' : '#888'
  const body = light ? '#0f172a' : '#f0f0f0'

  return (
    <div className="flex gap-3 relative">
      {!isLast && (
        <span className="absolute left-[7px] top-6 bottom-0 w-px" style={{ background: line }} />
      )}
      <span
        className={`w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 ring-2 ${light ? 'ring-white' : 'ring-[#0d0d0d]'}`}
        style={{ background: color }}
      />
      <div
        className={`flex-1 pb-4 rounded-lg p-3 ${isAi ? 'border' : ''}`}
        style={isAi ? { background: aiBg, borderColor: aiBorder } : {}}
      >
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-[10px]" style={{ color: meta }}>{item.timestamp}</span>
          {item.author && <Avatar name={item.author} size={16} />}
          {item.author && <span className="text-[11px]" style={{ color: authorC }}>{item.author}</span>}
          {isAi && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: aiBadge }}>
              AI
            </span>
          )}
        </div>
        <p className="text-[13px] leading-relaxed" style={{ color: body }}>
          {item.content}
        </p>
      </div>
    </div>
  )
}
