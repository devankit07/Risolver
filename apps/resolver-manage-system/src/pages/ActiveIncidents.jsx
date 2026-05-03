import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Avatar, SurfaceCard } from '@resolver/ui'

/** @typedef {{ incidentsListSearch?: string }} ActiveIncidentsOutletContext */

function severityStyles(sev) {
  switch (sev) {
    case 'critical':
      return 'bg-rose-50 text-rose-700 ring-1 ring-rose-100'
    case 'high':
      return 'bg-orange-50 text-orange-800 ring-1 ring-orange-100'
    case 'medium':
      return 'bg-amber-50 text-amber-900 ring-1 ring-amber-100'
    case 'low':
      return 'bg-slate-100 text-slate-600 ring-1 ring-slate-200/80'
    default:
      return 'bg-slate-100 text-slate-600 ring-1 ring-slate-200/80'
  }
}

function dotClass(sev) {
  switch (sev) {
    case 'critical':
      return 'animate-pulse bg-[var(--danger,#ef4444)]'
    case 'high':
      return 'bg-orange-500'
    case 'medium':
      return 'bg-amber-500'
    case 'low':
      return 'bg-slate-400'
    default:
      return 'bg-slate-400'
  }
}

function formatAssignees(names) {
  if (!names?.length) return 'Unassigned'
  if (names.length === 1) return names[0]
  return `${names[0]} +${names.length - 1}`
}

export default function ActiveIncidents() {
  const navigate = useNavigate()
  /** @type {ActiveIncidentsOutletContext} */
  const outlet = useOutletContext()
  const searchRaw = outlet?.incidentsListSearch ?? ''
  const search = searchRaw.trim().toLowerCase()

  const incidents = useSelector((/** @type {any} */ s) => s.incidents.list)

  const active = useMemo(() => {
    const running = incidents.filter((/** @type {{ status: string }} */ i) => i.status !== 'resolved')
    if (!search) return running
    const tokens = search.split(/\s+/).filter(Boolean)
    return running.filter((inc) => {
      const hay = [
        inc.id,
        inc.title,
        inc.service,
        inc.status,
        inc.severity,
        ...(inc.assignees ?? []),
        inc.assignedAt,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return tokens.every((t) => hay.includes(t))
    })
  }, [incidents, search])

  return (
    <div className="mt-4 flex max-w-full flex-col gap-6 md:mt-6">
      <div>
        <p className="text-sm font-medium text-[var(--text-secondary,#64748b)]">Operations</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-[var(--text-primary,#1e293b)] sm:text-2xl">
          Running incidents
        </h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-[var(--text-secondary,#64748b)]">
          All open and in-progress incidents for your organization. Open a row to jump into the workspace.
        </p>
      </div>

      <SurfaceCard className="overflow-hidden p-0">
        {active.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-[13px] text-[var(--text-secondary,#64748b)]">
              {search ? 'No incidents match your search.' : 'No active incidents right now.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop / tablet table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--border,#e2e8f0)] bg-[var(--bg-base,#f8fafc)]">
                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary,#64748b)]">
                      Incident
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary,#64748b)]">
                      Severity
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary,#64748b)]">
                      Assigned to
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary,#64748b)]">
                      Status
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary,#64748b)]">
                      Assigned at
                    </th>
                    <th className="w-12 px-2 py-3" aria-hidden />
                  </tr>
                </thead>
                <tbody>
                  {active.map((inc) => (
                    <tr
                      key={inc.id}
                      tabIndex={0}
                      aria-label={`Open workspace for ${inc.id}`}
                      onClick={() => navigate(`/workspace/${inc.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          navigate(`/workspace/${inc.id}`)
                        }
                      }}
                      className="cursor-pointer border-b border-[var(--border,#e2e8f0)] transition-colors last:border-0 hover:bg-[var(--bg-base,#f8fafc)]"
                    >
                      <td className="px-4 py-3 align-middle">
                        <div className="flex min-w-0 items-start gap-3 text-left">
                          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotClass(inc.severity)}`} aria-hidden />
                          <span className="min-w-0">
                            <span className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--text-secondary,#64748b)]">
                              {inc.id}
                            </span>
                            <span className="block text-[14px] font-semibold text-[var(--text-primary,#1e293b)]">
                              {inc.title}
                            </span>
                            {inc.service ? (
                              <span className="mt-0.5 block text-[12px] text-[var(--text-secondary,#64748b)]">
                                {inc.service}
                              </span>
                            ) : null}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${severityStyles(inc.severity)}`}
                        >
                          {inc.severity ?? '—'}
                        </span>
                      </td>
                      <td className="max-w-[200px] px-4 py-3 align-middle">
                        <div className="flex items-center gap-2">
                          {inc.assignees?.length ? (
                            <>
                              <Avatar name={inc.assignees[0]} size={28} />
                              <span className="min-w-0 truncate text-[13px] text-[var(--text-primary,#1e293b)]">
                                {formatAssignees(inc.assignees)}
                              </span>
                            </>
                          ) : (
                            <span className="text-[13px] text-[var(--text-secondary,#64748b)]">Unassigned</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                            inc.status === 'investigating' ? 'bg-rose-50 text-rose-600' : 'bg-slate-200/80 text-slate-600'
                          }`}
                        >
                          {inc.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 align-middle text-[13px] text-[var(--text-secondary,#64748b)]">
                        {inc.assignedAt ?? '—'}
                      </td>
                      <td className="px-2 py-3 align-middle">
                        <span className="flex h-9 w-9 items-center justify-center text-slate-300">
                          <ChevronRight size={18} aria-hidden />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile stacked cards */}
            <ul className="flex flex-col gap-2 p-4 md:hidden">
              {active.map((inc) => (
                <li key={inc.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/workspace/${inc.id}`)}
                    className="flex w-full flex-col gap-3 rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-base,#f8fafc)] px-4 py-3 text-left transition-colors hover:border-[var(--accent-border,#c7d2fe)] hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotClass(inc.severity)}`} aria-hidden />
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-secondary,#64748b)]">
                            {inc.id}
                          </p>
                          <p className="text-[14px] font-semibold text-[var(--text-primary,#1e293b)]">{inc.title}</p>
                          {inc.service ? (
                            <p className="mt-0.5 text-[12px] text-[var(--text-secondary,#64748b)]">{inc.service}</p>
                          ) : null}
                        </div>
                      </div>
                      <ChevronRight size={18} className="mt-1 shrink-0 text-slate-300" aria-hidden />
                    </div>
                    <dl className="grid grid-cols-2 gap-2 border-t border-[var(--border,#e2e8f0)] pt-3 text-[12px]">
                      <div>
                        <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-secondary,#64748b)]">
                          Severity
                        </dt>
                        <dd className="mt-0.5">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${severityStyles(inc.severity)}`}
                          >
                            {inc.severity ?? '—'}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-secondary,#64748b)]">
                          Status
                        </dt>
                        <dd className="mt-0.5">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${
                              inc.status === 'investigating' ? 'bg-rose-50 text-rose-600' : 'bg-slate-200/80 text-slate-600'
                            }`}
                          >
                            {inc.status}
                          </span>
                        </dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-secondary,#64748b)]">
                          Assigned to
                        </dt>
                        <dd className="mt-1 flex items-center gap-2 text-[13px] text-[var(--text-primary,#1e293b)]">
                          {inc.assignees?.length ? (
                            <>
                              <Avatar name={inc.assignees[0]} size={28} />
                              <span>{formatAssignees(inc.assignees)}</span>
                            </>
                          ) : (
                            <span className="text-[var(--text-secondary,#64748b)]">Unassigned</span>
                          )}
                        </dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-secondary,#64748b)]">
                          Assigned at
                        </dt>
                        <dd className="mt-0.5 text-[13px] text-[var(--text-secondary,#64748b)]">{inc.assignedAt ?? '—'}</dd>
                      </div>
                    </dl>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </SurfaceCard>
    </div>
  )
}
