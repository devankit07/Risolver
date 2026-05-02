import { Avatar } from './Avatar.jsx'

/**
 * @param {{
 *   message: { content: string, timestamp: string, author: string, isOwn: boolean, isAi?: boolean },
 *   variant?: 'dark' | 'light',
 * }} props
 */
export function MessageBubble({ message, variant = 'dark' }) {
  const { content, timestamp, author, isOwn, isAi } = message
  const L = variant === 'light'

  if (isAi) {
    return (
      <div
        className={`rounded-xl p-3 border mx-2 my-1 ${L ? 'bg-[#eef2ff] border-[#c7d2fe]' : ''}`}
        style={L ? undefined : { background: '#534AB722', borderColor: '#534AB744' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white"
            style={{ background: L ? '#4f46e5' : '#534AB7' }}
          >
            AI
          </span>
          <span className="text-[10px]" style={{ color: L ? '#64748b' : '#555' }}>{timestamp}</span>
        </div>
        <p className="text-[13px]" style={{ color: L ? '#312e81' : '#AFA9EC' }}>{content}</p>
      </div>
    )
  }

  return (
    <div className={`flex items-end gap-2 my-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isOwn && <Avatar name={author} size={24} className="mb-1 shrink-0" />}

      <div className="flex flex-col max-w-[70%]" style={{ alignItems: isOwn ? 'flex-end' : 'flex-start' }}>
        <div
          className="px-3 py-2 text-[13px] leading-relaxed"
          style={
            L
              ? {
                  background: isOwn ? '#4f46e5' : '#f1f5f9',
                  color: isOwn ? '#fff' : '#0f172a',
                  borderRadius: isOwn ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  border: isOwn ? 'none' : '1px solid #e2e8f0',
                }
              : {
                  background: isOwn ? '#00e87a' : '#141414',
                  color: isOwn ? '#000' : '#f0f0f0',
                  borderRadius: isOwn ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  border: isOwn ? 'none' : '0.5px solid #1a1a1a',
                }
          }
        >
          {content}
        </div>
        <span className="text-[10px] mt-0.5 px-1" style={{ color: L ? '#94a3b8' : '#555' }}>{timestamp}</span>
      </div>
    </div>
  )
}
