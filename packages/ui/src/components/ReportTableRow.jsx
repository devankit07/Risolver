import { Avatar } from './Avatar.jsx'
import { StatusBadge } from './StatusBadge.jsx'
import { ChevronRight } from 'lucide-react'

function ReportStatusPill({ status }) {
  if (status === 'published') {
    return (
      <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
        Published
      </span>
    )
  }
  if (status === 'pending') {
    return (
      <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 ring-1 ring-amber-200">
        Pending approval
      </span>
    )
  }
  return (
    <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200">
      Draft
    </span>
  )
}

const METHOD = {
  ai_solution: { label: 'AI Solution', className: 'bg-violet-50 text-violet-800 ring-1 ring-violet-200' },
  ai_suggestion: { label: 'AI Suggestion', className: 'bg-indigo-50 text-indigo-800 ring-1 ring-indigo-200' },
  manual: { label: 'Manual', className: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200' },
}

/**
 * @param {{
 *   report: {
 *     id: string,
 *     title: string,
 *     assignedTo: string,
 *     resolvedBy: string,
 *     duration: string,
 *     severity: string,
 *     method: keyof typeof METHOD,
 *     status: 'published' | 'pending' | 'draft',
 *   },
 *   onClick?: () => void,
 * }} props
 */
export function ReportTableRow({ report, onClick }) {
  const m = METHOD[report.method] ?? METHOD.manual
  const statusKey =
    report.status === 'published' ? 'published' : report.status === 'pending' ? 'draft' : 'draft'

  return (
    <tr
      onClick={onClick}
      className="cursor-pointer border-b border-[var(--border,#e2e8f0)] transition-colors hover:bg-[var(--bg-base,#f8fafc)]"
    >
      <td className="py-3 pl-4 pr-2">
        <span className="font-mono text-[11px] font-semibold text-[var(--accent,#4f46e5)]">{report.id}</span>
      </td>
      <td className="max-w-[200px] py-3 pr-2">
        <span className="line-clamp-2 text-[13px] font-medium text-[var(--text-primary,#1e293b)]">{report.title}</span>
      </td>
      <td className="py-3 pr-2">
        <div className="flex items-center gap-2">
          <Avatar name={report.assignedTo} size={24} />
          <span className="text-[12px] text-[var(--text-primary,#1e293b)]">{report.assignedTo}</span>
        </div>
      </td>
      <td className="py-3 pr-2">
        <div className="flex items-center gap-2">
          <Avatar name={report.resolvedBy} size={24} />
          <span className="text-[12px] text-[var(--text-primary,#1e293b)]">{report.resolvedBy}</span>
        </div>
      </td>
      <td className="py-3 pr-2 text-[12px] tabular-nums text-[var(--text-secondary,#64748b)]">{report.duration}</td>
      <td className="py-3 pr-2">
        <StatusBadge variant="light" status={report.severity} />
      </td>
      <td className="py-3 pr-2">
        <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold ${m.className}`}>{m.label}</span>
      </td>
      <td className="py-3 pr-2">
        <ReportStatusPill status={report.status} />
      </td>
      <td className="py-3 pr-4">
        <ChevronRight size={16} className="text-slate-300" aria-hidden />
      </td>
    </tr>
  )
}
