import { ChevronLeft } from 'lucide-react'
import { StatusBadge } from './StatusBadge.jsx'
import { Avatar } from './Avatar.jsx'

/**
 * Incident workspace top bar.
 *
 * @param {{
 *   incidentId: string,
 *   title: string,
 *   severity: string,
 *   status: string,
 *   assigneeName?: string,
 *   onBack?: () => void,
 *   onMarkResolved?: () => void,
 *   resolved?: boolean,
 *   resolutionMethod?: string,
 * }} props
 */
export function WorkspaceHeader({
  incidentId,
  title,
  severity,
  status,
  assigneeName = '',
  onBack,
  onMarkResolved,
  resolved = false,
  resolutionMethod,
}) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-[var(--border,#e2e8f0)] bg-[var(--bg-surface,#fff)] px-4">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] text-[var(--text-secondary,#64748b)] hover:bg-slate-100"
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="shrink-0 rounded-md bg-[var(--accent-dim,#eef2ff)] px-2 py-0.5 text-[11px] font-bold text-[var(--accent,#4f46e5)]">
          {incidentId}
        </span>
        <h1 className="truncate text-base font-medium text-[var(--text-primary,#1e293b)]">{title}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
            severity === 'critical'
              ? 'bg-red-50 text-[var(--danger,#ef4444)]'
              : severity === 'high'
                ? 'bg-amber-50 text-[var(--warning,#f59e0b)]'
                : 'bg-slate-100 text-slate-600'
          }`}
        >
          {severity}
        </span>
        {resolved ? (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--success,#10b981)]">
            Resolved
          </span>
        ) : (
          <StatusBadge variant="light" status={status} />
        )}
        {resolutionMethod ? (
          <span className="hidden rounded-md bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-700 sm:inline">
            {resolutionMethod}
          </span>
        ) : null}
      </div>

      <div className="flex min-w-0 items-center justify-end gap-3">
        {assigneeName ? (
          <div className="hidden items-center gap-2 sm:flex">
            <Avatar name={assigneeName} size={28} />
            <span className="truncate text-[13px] font-medium text-[var(--text-primary,#1e293b)]">{assigneeName}</span>
          </div>
        ) : null}
        {!resolved && onMarkResolved ? (
          <button
            type="button"
            onClick={onMarkResolved}
            className="shrink-0 rounded-[6px] bg-[var(--success,#10b981)] px-3 py-1.5 text-[12px] font-semibold text-white hover:brightness-110"
          >
            Mark resolved
          </button>
        ) : null}
      </div>
    </header>
  )
}
