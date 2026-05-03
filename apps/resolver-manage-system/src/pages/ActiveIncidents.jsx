import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { Plus, ChevronLeft, ChevronRight, RefreshCw, Bell } from 'lucide-react'
import {
  fetchIncidents,
  fetchIncidentStats,
  updateIncidentStatusThunk,
  prependIncident,
  updateIncidentInList,
  updateIncidentStatusInList,
} from '../store/incidentsSlice.js'
import CreateIncidentModal from '../components/CreateIncidentModal.jsx'
import socket from '../services/socket.js'
import { fetchUserNotifications } from '../store/teamSlice.js'

// ─── helpers ─────────────────────────────────────────────────────────────────

function useDebounce(value, delay = 300) {
  const [deb, setDeb] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDeb(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return deb
}

function severityStyle(sev) {
  switch (sev) {
    case 'critical': return 'bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]'
    case 'high':     return 'bg-[#fffbeb] text-[#d97706] border border-[#fde68a]'
    case 'medium':   return 'bg-[#eef2ff] text-[#4f46e5] border border-[#c7d2fe]'
    case 'low':      return 'bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]'
    default:         return 'bg-[#f8fafc] text-[#64748b] border border-[#e2e8f0]'
  }
}

function statusStyle(st) {
  switch (st) {
    case 'open':          return 'bg-[#fef2f2] text-[#dc2626]'
    case 'investigating':
    case 'in_progress':
    case 'assigned':      return 'bg-[#fffbeb] text-[#d97706]'
    case 'resolved':      return 'bg-[#f0fdf4] text-[#16a34a]'
    case 'closed':        return 'bg-[#f8fafc] text-[#94a3b8]'
    default:              return 'bg-[#f8fafc] text-[#64748b]'
  }
}

function statusLabel(st) {
  if (st === 'in_progress') return 'In Progress'
  if (st === 'assigned')    return 'Assigned'
  return st ? st.charAt(0).toUpperCase() + st.slice(1) : '—'
}

// Live duration counter hook for a single incident
function useLiveDuration(createdAt, status) {
  const [elapsed, setElapsed] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    const isLive = ['open', 'investigating', 'in_progress', 'assigned'].includes(status)
    if (!isLive || !createdAt) {
      setElapsed('')
      return
    }

    function compute() {
      const diffMs = Date.now() - new Date(createdAt).getTime()
      const totalSec = Math.floor(diffMs / 1000)
      const h = Math.floor(totalSec / 3600)
      const m = Math.floor((totalSec % 3600) / 60)
      const s = totalSec % 60
      if (h > 0) setElapsed(`${h}h ${m}m`)
      else if (m > 0) setElapsed(`${m}m ${s}s`)
      else setElapsed(`${s}s`)
    }

    compute()
    timerRef.current = setInterval(compute, 1000)
    return () => clearInterval(timerRef.current)
  }, [createdAt, status])

  return elapsed
}

// Static duration for resolved incidents
function staticDuration(createdAt, resolvedAt) {
  if (!createdAt || !resolvedAt) return '—'
  const diffMs = new Date(resolvedAt) - new Date(createdAt)
  const totalMin = Math.floor(diffMs / 60000)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

// ─── IncidentRow ─────────────────────────────────────────────────────────────

function IncidentRow({ incident, onOpen, onStatusChange, canManage }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const isLive = ['open', 'investigating', 'in_progress', 'assigned'].includes(incident.status)
  const liveDuration = useLiveDuration(incident.createdAt, incident.status)

  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const assignee = incident.assignedTo
  const assigneeName =
    typeof assignee === 'object' ? assignee?.name : null

  const duration = isLive
    ? liveDuration
    : staticDuration(incident.createdAt, incident.resolvedAt)

  const incId = incident.incidentId || incident._id || '—'
  const title = incident.title || '—'
  const svc = incident.service || incident.affectedService || '—'

  return (
    <tr
      className="cursor-pointer border-b border-[#e2e8f0] transition-colors last:border-0 hover:bg-[#f8fafc]"
      onClick={() => onOpen(incident._id)}
    >
      {/* INC ID */}
      <td className="px-3 py-3 align-middle">
        <span className="font-mono rounded-[4px] bg-[#f1f5f9] px-2 py-1 text-[11px] text-[#475569]">
          {incId}
        </span>
      </td>

      {/* Title */}
      <td className="max-w-[240px] px-3 py-3 align-middle">
        <p
          className="text-[14px] font-medium text-[#1e293b] truncate"
          title={title}
        >
          {title.length > 40 ? title.slice(0, 40) + '…' : title}
        </p>
        {incident.description ? (
          <p className="text-[12px] text-[#64748b] truncate mt-0.5">
            {incident.description.slice(0, 60)}
            {incident.description.length > 60 ? '…' : ''}
          </p>
        ) : null}
      </td>

      {/* Severity */}
      <td className="px-3 py-3 align-middle">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${severityStyle(incident.severity)}`}>
          {incident.severity || '—'}
        </span>
      </td>

      {/* Status */}
      <td className="px-3 py-3 align-middle">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyle(incident.status)}`}>
          {statusLabel(incident.status)}
        </span>
      </td>

      {/* Service */}
      <td className="px-3 py-3 align-middle text-[13px] text-[#64748b]">
        {svc}
      </td>

      {/* Assigned to */}
      <td className="px-3 py-3 align-middle">
        {assigneeName ? (
          <div className="flex items-center gap-1.5">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-700">
              {assigneeName.charAt(0).toUpperCase()}
            </span>
            <span className="text-[13px] text-[#1e293b] truncate max-w-[100px]">{assigneeName}</span>
          </div>
        ) : (
          <span className="text-[13px] text-[#94a3b8]">Unassigned</span>
        )}
      </td>

      {/* Created */}
      <td className="whitespace-nowrap px-3 py-3 align-middle text-[12px] text-[#64748b]">
        {incident.createdAt
          ? formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true })
          : '—'}
      </td>

      {/* Duration */}
      <td className="whitespace-nowrap px-3 py-3 align-middle text-[12px] text-[#64748b] tabular-nums">
        {duration || '—'}
      </td>

      {/* Actions */}
      <td className="px-3 py-3 align-middle" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpen(incident._id)}
            className="whitespace-nowrap text-[12px] font-medium text-indigo-600 hover:text-indigo-800"
          >
            Open workspace →
          </button>

          {canManage && (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex h-6 w-6 items-center justify-center rounded-[4px] text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#475569]"
                title="More actions"
              >
                ···
              </button>
              {menuOpen && (
                <div className="absolute right-0 z-50 mt-1 w-44 rounded-[8px] border border-[#e2e8f0] bg-white py-1 shadow-lg">
                  <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">
                    Change status
                  </p>
                  {['open', 'investigating', 'resolved'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => { onStatusChange(incident._id, s); setMenuOpen(false) }}
                      className="w-full px-3 py-1.5 text-left text-[13px] capitalize text-[#1e293b] hover:bg-[#f8fafc]"
                    >
                      {statusLabel(s)}
                    </button>
                  ))}
                  <div className="my-1 border-t border-[#e2e8f0]" />
                  <button
                    type="button"
                    onClick={() => { onStatusChange(incident._id, 'closed'); setMenuOpen(false) }}
                    className="w-full px-3 py-1.5 text-left text-[13px] text-red-600 hover:bg-[#fef2f2]"
                  >
                    Close incident
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}

function SkeletonRow() {
  return (
    <tr className="border-b border-[#e2e8f0]">
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i} className="px-3 py-3">
          <div className="h-4 animate-pulse rounded bg-[#f1f5f9]" />
        </td>
      ))}
    </tr>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const STATUS_TABS = [
  { label: 'All', value: '' },
  { label: 'Open', value: 'open' },
  { label: 'Investigating', value: 'investigating,in_progress,assigned' },
  { label: 'Resolved', value: 'resolved' },
]

const SEVERITY_OPTIONS = ['', 'critical', 'high', 'medium', 'low']
const PAGE_SIZES = [10, 20, 50]

export default function ActiveIncidents() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector((s) => s.auth.user)
  const myId = String(user?._id ?? user?.id ?? '')
  const { list: incidents, loading, total, pages, stats } = useSelector((s) => s.incidents)
  const notificationsCache = useSelector((s) => s.team.notificationsCache ?? {})
  const canManage = ['admin', 'manager'].includes(user?.role)
  const canCreateIncident = ['admin', 'manager', 'creator'].includes(user?.role)

  const assignmentAlerts = useMemo(() => {
    const list = notificationsCache[myId] ?? []
    return list.filter(
      (n) =>
        n.incidentId &&
        !n.isRead &&
        (n.type === 'incident_assigned' || String(n.title ?? '').toLowerCase().includes('assigned')),
    )
  }, [notificationsCache, myId])

  useEffect(() => {
    if (myId) dispatch(fetchUserNotifications(myId))
  }, [dispatch, myId])

  // Filters
  const [statusTab, setStatusTab] = useState('')
  const [severity, setSeverity] = useState('')
  const [serviceInput, setServiceInput] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [showCreate, setShowCreate] = useState(false)

  const debouncedService = useDebounce(serviceInput, 300)
  const debouncedSearch  = useDebounce(searchInput, 300)

  const load = useCallback(
    (overrides = {}) => {
      dispatch(
        fetchIncidents({
          status:   overrides.status   ?? statusTab,
          severity: overrides.severity ?? severity,
          service:  overrides.service  ?? debouncedService,
          search:   overrides.search   ?? debouncedSearch,
          page:     overrides.page     ?? page,
          limit:    overrides.limit    ?? pageSize,
        }),
      )
    },
    [dispatch, statusTab, severity, debouncedService, debouncedSearch, page, pageSize],
  )

  // Initial load
  useEffect(() => {
    dispatch(fetchIncidentStats())
  }, [dispatch])

  // Reload when filters change (reset page to 1)
  useEffect(() => {
    setPage(1)
    dispatch(
      fetchIncidents({
        status: statusTab,
        severity,
        service: debouncedService,
        search:  debouncedSearch,
        page: 1,
        limit: pageSize,
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusTab, severity, debouncedService, debouncedSearch, pageSize])

  // Page change
  useEffect(() => {
    load({ page })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  // Socket listeners
  useEffect(() => {
    const onNew     = (inc) => dispatch(prependIncident(inc))
    const onUpdated = ({ incidentId, changes }) => dispatch(updateIncidentInList({ incidentId, changes }))
    const onStatus  = ({ incidentId, status }) => dispatch(updateIncidentStatusInList({ incidentId, status }))

    socket.on('incident:new', onNew)
    socket.on('incident:updated', onUpdated)
    socket.on('incident:statusChanged', onStatus)

    return () => {
      socket.off('incident:new', onNew)
      socket.off('incident:updated', onUpdated)
      socket.off('incident:statusChanged', onStatus)
    }
  }, [dispatch])

  const handleStatusChange = useCallback(
    async (id, status) => {
      await dispatch(updateIncidentStatusThunk({ id, status }))
    },
    [dispatch],
  )

  const hasFilters = statusTab || severity || debouncedService || debouncedSearch
  const start = (page - 1) * pageSize + 1
  const end   = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-[13px] text-[#64748b]">Home &rsaquo; Active incidents</p>
        <h1 className="mt-1 text-[28px] font-medium text-[#1e293b]">Active incidents</h1>
        <p className="mt-1 text-[14px] text-[#64748b]">Open and in-progress incidents across your organization.</p>
      </div>

      {assignmentAlerts.length > 0 && (
        <div className="rounded-[10px] border border-indigo-200 bg-[#eef2ff] p-4">
          <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-[#4338ca]">
            <Bell size={14} aria-hidden /> New assignments for you
          </div>
          <ul className="flex flex-col gap-2">
            {assignmentAlerts.slice(0, 5).map((n) => (
              <li key={String(n._id)}>
                <button
                  type="button"
                  onClick={() => n.incidentId && navigate(`/workspace/${n.incidentId}`)}
                  className="flex w-full flex-wrap items-start justify-between gap-2 rounded-[8px] border border-[#c7d2fe] bg-white px-3 py-2 text-left shadow-sm transition hover:bg-[#f5f7ff]"
                >
                  <div>
                    <p className="text-[13px] font-semibold text-[#1e293b]">{n.title}</p>
                    {n.body ? (
                      <p className="mt-0.5 text-[12px] text-[#64748b]">{n.body}</p>
                    ) : null}
                  </div>
                  <span className="shrink-0 text-[11px] font-semibold text-[#4f46e5]">Open workspace →</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-[#6366f1]">
            Same alerts appear under <strong>Team → My profile → Notifications</strong>.
          </p>
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Open"           value={stats.open}          valueColor="#dc2626" />
        <KpiCard label="Investigating"  value={stats.investigating}  valueColor="#d97706" />
        <KpiCard label="Resolved today" value={stats.resolvedToday}  valueColor="#16a34a" />
        <KpiCard label="Critical"       value={stats.critical}       valueColor="#dc2626" danger />
      </div>

      {/* Filter + Action bar */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-[#e2e8f0] bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status tabs */}
          <div className="flex gap-1 rounded-[6px] bg-[#f8fafc] p-0.5 ring-1 ring-[#e2e8f0]">
            {STATUS_TABS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setStatusTab(t.value)}
                className={`rounded-[6px] px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  statusTab === t.value
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-[#64748b] hover:text-[#1e293b]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Severity */}
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="h-9 rounded-[8px] border border-[#e2e8f0] bg-white px-3 text-[13px] text-[#1e293b] outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All severities</option>
            {SEVERITY_OPTIONS.filter(Boolean).map((s) => (
              <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>

          {/* Service */}
          <input
            value={serviceInput}
            onChange={(e) => setServiceInput(e.target.value)}
            placeholder="Filter by service…"
            className="h-9 w-[160px] rounded-[8px] border border-[#e2e8f0] px-3 text-[13px] outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search incidents…"
            className="h-9 w-[200px] rounded-[8px] border border-[#e2e8f0] px-3 text-[13px] outline-none focus:ring-2 focus:ring-indigo-500/20"
          />

          <button
            type="button"
            onClick={() => load({ page: 1 })}
            title="Refresh"
            className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc]"
          >
            <RefreshCw size={14} />
          </button>

          {canCreateIncident && (
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="flex h-9 items-center gap-1.5 rounded-[8px] bg-[#4f46e5] px-4 text-[13px] font-medium text-white hover:bg-indigo-700"
            >
              <Plus size={14} />
              New incident
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-[10px] border border-[#e2e8f0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                {['INC ID', 'Title', 'Severity', 'Status', 'Service', 'Assigned to', 'Created', 'Duration', ''].map(
                  (h) => (
                    <th
                      key={h || '__actions'}
                      className="px-3 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#64748b]"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : incidents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center">
                    {hasFilters ? (
                      <div>
                        <p className="text-[14px] font-medium text-[#1e293b]">
                          No incidents match your filters
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setStatusTab('')
                            setSeverity('')
                            setServiceInput('')
                            setSearchInput('')
                          }}
                          className="mt-2 text-[13px] text-indigo-600 hover:underline"
                        >
                          Clear filters
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[14px] font-medium text-[#1e293b]">
                          No active incidents right now
                        </p>
                        <p className="mt-1 text-[13px] text-[#64748b]">
                          Everything is running smoothly 🎉
                        </p>
                        {canCreateIncident && (
                          <button
                            type="button"
                            onClick={() => setShowCreate(true)}
                            className="mt-3 inline-flex items-center gap-1.5 rounded-[8px] bg-[#4f46e5] px-4 py-2 text-[13px] font-medium text-white hover:bg-indigo-700"
                          >
                            <Plus size={14} />
                            Create incident
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                incidents.map((inc) => (
                  <IncidentRow
                    key={inc._id}
                    incident={inc}
                    onOpen={(id) => navigate(`/workspace/${id}`)}
                    onStatusChange={handleStatusChange}
                    canManage={canManage}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-[13px] text-[#64748b]">
          <div className="flex items-center gap-2">
            <span>Showing {start}–{end} of {total} incidents</span>
            <span>·</span>
            <span>Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
              className="rounded-[6px] border border-[#e2e8f0] px-2 py-1 text-[13px]"
            >
              {PAGE_SIZES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#e2e8f0] disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(pages, 5) }).map((_, i) => {
              const p = i + 1
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`flex h-8 w-8 items-center justify-center rounded-[6px] border text-[13px] ${
                    page === p
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-[#e2e8f0] hover:bg-[#f8fafc]'
                  }`}
                >
                  {p}
                </button>
              )
            })}
            <button
              type="button"
              disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#e2e8f0] disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Create modal */}
      {showCreate && <CreateIncidentModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}

// ─── KpiCard inline ───────────────────────────────────────────────────────────
function KpiCard({ label, value, valueColor, danger }) {
  return (
    <div className={`rounded-[10px] border p-4 ${danger ? 'border-[#fecaca] bg-[#fef2f2]' : 'border-[#e2e8f0] bg-white'}`}>
      <p className="text-[12px] font-medium text-[#64748b]">{label}</p>
      <p className="mt-1 text-[28px] font-semibold" style={{ color: valueColor }}>
        {value ?? 0}
      </p>
    </div>
  )
}
