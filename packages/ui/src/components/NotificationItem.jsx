/**
 * Incident assignment notification (profile tab).
 *
 * @param {{
 *   incidentId: string,
 *   title: string,
 *   sublabel: string,
 *   severity: 'critical' | 'high' | 'medium' | 'low',
 *   unread?: boolean,
 *   onOpen?: () => void,
 * }} props
 */
export function NotificationItem({ incidentId, title, sublabel, severity = 'medium', unread = false, onOpen }) {
  const dot = {
    critical: 'bg-[var(--danger,#ef4444)]',
    high: 'bg-[var(--warning,#f59e0b)]',
    medium: 'bg-[var(--accent,#4f46e5)]',
    low: 'bg-slate-400',
  }[severity]

  return (
    <div
      className={[
        'flex items-start gap-3 rounded-[8px] border border-[var(--border,#e2e8f0)] p-3',
        unread ? 'border-l-[3px] border-l-[var(--accent,#4f46e5)] bg-[var(--accent-dim,#eef2ff)]' : 'border-l-[3px] border-l-transparent bg-white',
      ].join(' ')}
    >
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot}`} aria-hidden />
      <div className="min-w-0 flex-1">
        <span className="inline-block rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-[var(--accent,#4f46e5)]">
          {incidentId}
        </span>
        <p className="mt-1 text-[13px] font-semibold text-[var(--text-primary,#1e293b)]">{title}</p>
        <p className="mt-0.5 text-[11px] text-[var(--text-secondary,#64748b)]">{sublabel}</p>
      </div>
      {onOpen ? (
        <button
          type="button"
          onClick={onOpen}
          className="shrink-0 rounded-[6px] bg-[var(--accent,#4f46e5)] px-2.5 py-1 text-[11px] font-semibold text-white hover:brightness-110"
        >
          Open workspace →
        </button>
      ) : null}
    </div>
  )
}
