import { Megaphone, Users } from 'lucide-react'

/**
 * @param {{
 *   title: string,
 *   sentBy: string,
 *   time: string,
 *   scope?: 'all' | 'role',
 *   roleLabel?: string,
 *   selected?: boolean,
 *   onClick?: () => void,
 * }} props
 */
export function BroadcastItem({
  title,
  sentBy,
  time,
  scope = 'all',
  roleLabel = '',
  selected = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex w-full items-start gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors',
        selected ? 'border-[var(--accent-border,#c7d2fe)] bg-[var(--accent-dim,#eef2ff)]' : 'hover:bg-slate-50',
      ].join(' ')}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        {scope === 'all' ? <Megaphone size={18} /> : <Users size={18} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-[var(--text-primary,#1e293b)]">{title}</p>
        <p className="mt-0.5 text-[11px] text-[var(--text-secondary,#64748b)]">
          Sent by {sentBy} · {time}
        </p>
        {scope === 'role' && roleLabel ? (
          <span className="mt-1 inline-block rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
            {roleLabel}
          </span>
        ) : null}
      </div>
    </button>
  )
}
