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
  const line = light ? '#f1f5f9' : '#1a1a1a'
  const meta = light ? '#94a3b8' : '#555'
  const authorC = light ? '#64748b' : '#888'
  const body = light ? '#334155' : '#f0f0f0'

  return (
    <div className="flex gap-4 relative">
      <div className="flex flex-col items-center shrink-0 w-4">
        <span
          className={`w-3.5 h-3.5 rounded-full z-10 ring-4 ${light ? 'ring-white' : 'ring-[#0d0d0d]'}`}
          style={{ background: color }}
        />
        {!isLast && (
          <div className="w-px flex-1 mt-1" style={{ background: line }} />
        )}
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[12px] font-medium" style={{ color: meta }}>{item.timestamp}</span>
          {isAi ? (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100">
              AI
            </span>
          ) : item.author ? (
            <div className="flex items-center gap-1.5">
               <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                {item.author.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          ) : null}
        </div>
        <p className="text-[13px] leading-relaxed font-normal" style={{ color: body }}>
          {item.content}
        </p>
      </div>
    </div>
  )
}
