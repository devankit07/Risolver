import { useEffect, useRef, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AlertTriangle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import {
  fetchPostmortems,
  fetchPendingApprovals,
  approvePostmortem,
  fetchPostmortemDetail,
  updatePostmortemStatus,
} from '../store/postmortemsSlice.js'
import PostmortemDetailModal from '../components/PostmortemDetailModal.jsx'
import RequestChangesModal from '../components/RequestChangesModal.jsx'
import socket from '../services/socket.js'

function useDebounce(value, delay = 300) {
  const [deb, setDeb] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDeb(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return deb
}

// ─── Badge helpers ────────────────────────────────────────────────────────────

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
    case 'published':        return 'bg-[#f0fdf4] text-[#16a34a]'
    case 'pending_approval': return 'bg-[#fffbeb] text-[#d97706]'
    case 'draft':            return 'bg-[#f8fafc] text-[#94a3b8]'
    default:                 return 'bg-[#f8fafc] text-[#64748b]'
  }
}

function statusLabel(st) {
  if (st === 'pending_approval') return 'Pending approval'
  if (st === 'published')        return 'Published'
  return st ? st.charAt(0).toUpperCase() + st.slice(1) : '—'
}

function methodStyle(m) {
  switch (m) {
    case 'ai_solution':   return 'bg-[#f3f0ff] text-[#5b21b6] border border-[#ddd6fe]'
    case 'ai_suggestion': return 'bg-[#eef2ff] text-[#3730a3] border border-[#c7d2fe]'
    default:              return 'bg-[#f8fafc] text-[#475569] border border-[#e2e8f0]'
  }
}

function methodLabel(m) {
  if (m === 'ai_solution')   return 'AI Solution'
  if (m === 'ai_suggestion') return 'AI Suggestion'
  if (m === 'manual')        return 'Manual'
  return m || '—'
}

function AvatarChip({ name }) {
  if (!name) return <span className="text-[#94a3b8] text-[12px]">—</span>
  return (
    <div className="flex items-center gap-1">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[9px] font-semibold text-indigo-700">
        {name.charAt(0).toUpperCase()}
      </span>
      <span className="text-[12px] text-[#1e293b] truncate max-w-[80px]">{name}</span>
    </div>
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

// ─── Report row ───────────────────────────────────────────────────────────────

function ReportRow({ report, canApprove, onView, onApprove, onRequestChanges }) {
  const [approving, setApproving] = useState(false)
  const incRef = report.incidentRef || report.incident || report.incidentId || {}
  const incId  = incRef?.incidentId || incRef?._id || '—'
  const incTitle = incRef?.title || report.title || '—'
  const svc    = report.service || incRef?.service || incRef?.affectedService || '—'
  const sev    = report.severity || incRef?.severity || null

  async function handleApprove() {
    setApproving(true)
    await onApprove(report._id)
    setApproving(false)
  }

  return (
    <tr className="cursor-pointer border-b border-[#e2e8f0] transition-colors last:border-0 hover:bg-[#f8fafc]">
      {/* INC ID */}
      <td className="px-3 py-3 align-middle" onClick={() => onView(report._id)}>
        <span className="font-mono rounded-[4px] bg-[#f1f5f9] px-2 py-1 text-[11px] text-[#475569]">
          {incId}
        </span>
      </td>

      {/* Incident title */}
      <td className="max-w-[180px] px-3 py-3 align-middle" onClick={() => onView(report._id)}>
        <p className="text-[13px] font-medium text-[#1e293b] truncate" title={incTitle}>
          {incTitle.length > 35 ? incTitle.slice(0, 35) + '…' : incTitle}
        </p>
      </td>

      {/* Assigned to */}
      <td className="px-3 py-3 align-middle" onClick={() => onView(report._id)}>
        <AvatarChip name={report.assignedTo?.name} />
      </td>

      {/* Resolved by */}
      <td className="px-3 py-3 align-middle" onClick={() => onView(report._id)}>
        <AvatarChip name={report.resolvedBy?.name} />
      </td>

      {/* Duration */}
      <td className="whitespace-nowrap px-3 py-3 align-middle text-[12px] text-[#64748b]" onClick={() => onView(report._id)}>
        {report.duration || '—'}
      </td>

      {/* Severity */}
      <td className="px-3 py-3 align-middle" onClick={() => onView(report._id)}>
        {sev ? (
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${severityStyle(sev)}`}>
            {sev}
          </span>
        ) : <span className="text-[12px] text-[#94a3b8]">—</span>}
      </td>

      {/* Method */}
      <td className="px-3 py-3 align-middle" onClick={() => onView(report._id)}>
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${methodStyle(report.resolutionMethod)}`}>
          {methodLabel(report.resolutionMethod)}
        </span>
      </td>

      {/* Status */}
      <td className="px-3 py-3 align-middle" onClick={() => onView(report._id)}>
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyle(report.status)}`}>
          {statusLabel(report.status)}
        </span>
      </td>

      {/* Actions */}
      <td className="px-3 py-3 align-middle" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => onView(report._id)}
            className="whitespace-nowrap text-[12px] font-medium text-indigo-600 hover:text-indigo-800"
          >
            View report →
          </button>

          {canApprove && report.status === 'pending_approval' && (
            <>
              <button
                type="button"
                disabled={approving}
                onClick={handleApprove}
                className="flex items-center gap-1 rounded-[4px] bg-green-600 px-2 py-0.5 text-[11px] font-medium text-white hover:bg-green-700 disabled:opacity-60"
              >
                {approving && <Loader2 size={10} className="animate-spin" />}
                Approve
              </button>
              <button
                type="button"
                onClick={() => onRequestChanges(report)}
                className="rounded-[4px] border border-red-300 px-2 py-0.5 text-[11px] font-medium text-red-600 hover:bg-red-50"
              >
                Request changes
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

const TIME_TABS  = ['All time', 'Last 30 days', 'Last 90 days']
const PAGE_SIZES = [10, 20, 50]

export default function Reports() {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.user)
  const { postmortems, pendingApprovals, stats, total, pages, loading } = useSelector(
    (s) => s.postmortems,
  )

  const canApprove  = ['admin', 'manager'].includes(user?.role)
  const isAdminMgr  = canApprove
  const memberRole  = !isAdminMgr

  // Filters
  const [timeTab, setTimeTab] = useState('All time')
  const [serviceFilter, setServiceFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Modals
  const [detailId, setDetailId] = useState(null)
  const [changesTarget, setChangesTarget] = useState(null)

  const debouncedSearch = useDebounce(searchInput, 300)
  const debouncedService = useDebounce(serviceFilter, 300)

  const load = useCallback(
    (overrides = {}) => {
      dispatch(
        fetchPostmortems({
          status:  overrides.status  ?? statusFilter,
          service: overrides.service ?? debouncedService,
          search:  overrides.search  ?? debouncedSearch,
          page:    overrides.page    ?? page,
          limit:   pageSize,
        }),
      )
    },
    [dispatch, statusFilter, debouncedService, debouncedSearch, page, pageSize],
  )

  useEffect(() => {
    load()
    if (isAdminMgr) dispatch(fetchPendingApprovals())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setPage(1)
    dispatch(
      fetchPostmortems({
        status:  statusFilter,
        service: debouncedService,
        search:  debouncedSearch,
        page: 1,
        limit: pageSize,
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, debouncedService, debouncedSearch, pageSize])

  useEffect(() => {
    load({ page })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  // Socket listeners
  useEffect(() => {
    const onPublished = (pm) => dispatch(updatePostmortemStatus({ id: pm._id, status: 'published' }))
    socket.on('postmortem:published', onPublished)
    return () => socket.off('postmortem:published', onPublished)
  }, [dispatch])

  async function handleApprove(id) {
    await dispatch(approvePostmortem({ id, action: 'approve' }))
    dispatch(fetchPendingApprovals())
    load({ page })
  }

  function handleView(id) {
    dispatch(fetchPostmortemDetail(id))
    setDetailId(id)
  }

  const hasFilters = statusFilter || debouncedService || debouncedSearch
  const start = (page - 1) * pageSize + 1
  const end   = Math.min(page * pageSize, total)

  // Unique services from loaded data
  const uniqueServices = [...new Set(
    postmortems
      .map((p) => p.service || p.incidentRef?.service || p.incidentRef?.affectedService)
      .filter(Boolean),
  )]

  const STATUS_OPTIONS = isAdminMgr
    ? [{ label: 'All', value: '' }, { label: 'Published', value: 'published' }, { label: 'Pending approval', value: 'pending_approval' }, { label: 'Draft', value: 'draft' }]
    : [{ label: 'All', value: '' }, { label: 'Published', value: 'published' }]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-[13px] text-[#64748b]">Home &rsaquo; Reports</p>
        <h1 className="mt-1 text-[28px] font-medium text-[#1e293b]">Incident reports</h1>
        <p className="mt-1 text-[14px] text-[#64748b]">Postmortems, resolutions, and team accountability.</p>
      </div>

      {/* Pending approval banner */}
      {isAdminMgr && pendingApprovals.length > 0 && (
        <div className="flex items-center justify-between rounded-[10px] border border-[#fde68a] bg-[#fffbeb] px-4 py-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-[#d97706]" />
            <span className="text-[13px] font-medium text-[#92400e]">
              You have {pendingApprovals.length} report{pendingApprovals.length !== 1 ? 's' : ''} pending your approval
            </span>
          </div>
          <button
            type="button"
            onClick={() => setStatusFilter('pending_approval')}
            className="rounded-[6px] bg-[#d97706] px-4 py-1.5 text-[12px] font-medium text-white hover:bg-amber-700"
          >
            Review now
          </button>
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total reports"       value={stats.total}           />
        <KpiCard label="Published"           value={stats.published}       valueColor="#4f46e5" />
        <KpiCard label="Pending approval"    value={stats.pendingApproval} valueColor="#d97706" />
        <KpiCard label="Avg resolution time" value={stats.avgResolutionTime || '—'} />
      </div>

      {/* Filter bar */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-[#e2e8f0] bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Time tabs */}
          <div className="flex gap-1 rounded-[6px] bg-[#f8fafc] p-0.5 ring-1 ring-[#e2e8f0]">
            {TIME_TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimeTab(t)}
                className={`rounded-[6px] px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  timeTab === t
                    ? 'bg-white text-[#4f46e5] shadow-sm'
                    : 'text-[#64748b] hover:text-[#1e293b]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Service */}
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="h-9 rounded-[8px] border border-[#e2e8f0] bg-white px-3 text-[13px] text-[#1e293b] outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All services</option>
            {uniqueServices.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Status */}
          <div className="flex gap-1 rounded-[6px] bg-[#f8fafc] p-0.5 ring-1 ring-[#e2e8f0]">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatusFilter(opt.value)}
                className={`rounded-[6px] px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  statusFilter === opt.value
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-[#64748b] hover:text-[#1e293b]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search reports…"
          className="h-9 w-[200px] rounded-[8px] border border-[#e2e8f0] px-3 text-[13px] text-[#1e293b] outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-[10px] border border-[#e2e8f0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                {['INC ID', 'Incident title', 'Assigned to', 'Resolved by', 'Duration', 'Severity', 'Method', 'Status', ''].map(
                  (h) => (
                    <th
                      key={h || '__act'}
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
              ) : postmortems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center">
                    {hasFilters ? (
                      <div>
                        <p className="text-[14px] font-medium text-[#1e293b]">No reports match your filters</p>
                        <button
                          type="button"
                          onClick={() => { setStatusFilter(''); setServiceFilter(''); setSearchInput('') }}
                          className="mt-2 text-[13px] text-indigo-600 hover:underline"
                        >
                          Clear filters
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[14px] font-medium text-[#1e293b]">No incident reports yet.</p>
                        <p className="mt-1 text-[13px] text-[#64748b]">Reports appear here after incidents are resolved.</p>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                postmortems.map((r) => (
                  <ReportRow
                    key={r._id}
                    report={r}
                    canApprove={canApprove}
                    onView={handleView}
                    onApprove={handleApprove}
                    onRequestChanges={(rep) => setChangesTarget(rep)}
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
            <span>Showing {start}–{end} of {total} reports</span>
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
                    page === p ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-[#e2e8f0] hover:bg-[#f8fafc]'
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

      {/* Detail modal */}
      {detailId && (
        <PostmortemDetailModal
          id={detailId}
          canApprove={canApprove}
          onClose={() => setDetailId(null)}
          onApprove={handleApprove}
          onRequestChanges={(rep) => { setChangesTarget(rep); setDetailId(null) }}
        />
      )}

      {/* Request changes modal */}
      {changesTarget && (
        <RequestChangesModal
          report={changesTarget}
          onClose={() => setChangesTarget(null)}
          onSent={() => { setChangesTarget(null); load({ page }) }}
        />
      )}
    </div>
  )
}

function KpiCard({ label, value, valueColor }) {
  return (
    <div className="rounded-[10px] border border-[#e2e8f0] bg-white p-4">
      <p className="text-[12px] font-medium text-[#64748b]">{label}</p>
      <p className="mt-1 text-[28px] font-semibold text-[#1e293b]" style={valueColor ? { color: valueColor } : {}}>
        {value ?? 0}
      </p>
    </div>
  )
}
