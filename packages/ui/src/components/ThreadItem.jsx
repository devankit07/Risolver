import { Avatar } from './Avatar.jsx'

/**
 * Thread row for chat sidebar (Threads tab).
 *
 * @param {{
 *   name: string,
 *   incidentTag: string,
 *   preview: string,
 *   time: string,
 *   unread?: number,
 *   selected?: boolean,
 *   onClick?: () => void,
 * }} props
 */
export function ThreadItem({ name, incidentTag, preview, time, unread = 0, selected = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
        selected ? 'border-l-2 border-[var(--accent,#4f46e5)] bg-[var(--accent-dim,#eef2ff)]' : 'border-l-2 border-transparent hover:bg-slate-100',
      ].join(' ')}
    >
      <Avatar name={name} size={36} className="shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[13px] font-semibold text-[var(--text-primary,#1e293b)]">{name}</span>
          <span className="shrink-0 rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--accent,#4f46e5)] ring-1 ring-indigo-100">
            {incidentTag}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-[var(--text-secondary,#64748b)]">{preview}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-[10px] tabular-nums text-slate-400">{time}</span>
        {unread > 0 ? (
          <span className="min-w-[18px] rounded-full bg-red-500 px-1.5 py-0.5 text-center text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        ) : null}
      </div>
    </button>
  )
}
