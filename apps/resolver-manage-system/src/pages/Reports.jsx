import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { KpiCard, ReportTableRow } from '@resolver/ui'

const TABLE_REPORTS = [
  {
    id: 'INC-038',
    title: 'Payment service outage — 45 minutes downtime',
    assignedTo: 'Sara Patel',
    resolvedBy: 'James Lee',
    duration: '45m',
    severity: 'critical',
    method: 'ai_solution',
    status: 'published',
  },
  {
    id: 'INC-037',
    title: 'Auth token expiry regression after deploy v2.3.1',
    assignedTo: 'James Lee',
    resolvedBy: 'Priya Nair',
    duration: '1h 12m',
    severity: 'high',
    method: 'ai_suggestion',
    status: 'pending',
  },
  {
    id: 'INC-034',
    title: 'CDN cache invalidation storm',
    assignedTo: 'Alex Kim',
    resolvedBy: 'Alex Kim',
    duration: '23m',
    severity: 'medium',
    method: 'manual',
    status: 'draft',
  },
  {
    id: 'INC-028',
    title: 'Database primary failover — replica lag',
    assignedTo: 'Sara Patel',
    resolvedBy: 'Sara Patel',
    duration: '18m',
    severity: 'high',
    method: 'manual',
    status: 'published',
  },
]

const TIME_TABS = ['All time', 'Last 30 days', 'Last 90 days']

export default function Reports() {
  const navigate = useNavigate()
  const [timeTab, setTimeTab] = useState('All time')
  const [serviceFilter, setServiceFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    return TABLE_REPORTS.filter((r) => {
      const okSearch =
        !search ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase())
      const okStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Published' && r.status === 'published') ||
        (statusFilter === 'Pending approval' && r.status === 'pending') ||
        (statusFilter === 'Draft' && r.status === 'draft')
      return okSearch && okStatus
    })
  }, [search, statusFilter])

  const slice = filtered.slice(page * pageSize, page * pageSize + pageSize)
  const published = TABLE_REPORTS.filter((r) => r.status === 'published').length
  const pending = TABLE_REPORTS.filter((r) => r.status === 'pending').length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[20px] font-semibold tracking-tight text-[var(--text-primary,#1e293b)]">Incident reports</h1>
        <p className="mt-1 text-[14px] text-[var(--text-secondary,#64748b)]">
          Postmortems, resolutions, and team accountability
        </p>
      </div>

      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-3 rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-surface,#fff)] p-3 shadow-sm">
        <div className="flex flex-wrap gap-1 rounded-[6px] bg-[var(--bg-base,#f8fafc)] p-0.5 ring-1 ring-[var(--border,#e2e8f0)]">
          {TIME_TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTimeTab(t)}
              className={`rounded-[6px] px-3 py-1.5 text-[12px] font-medium ${
                timeTab === t ? 'bg-white text-[var(--accent,#4f46e5)] shadow-sm' : 'text-[var(--text-secondary,#64748b)]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="h-10 rounded-[8px] border border-[var(--border,#e2e8f0)] bg-white px-3 text-[13px]"
        >
          <option>All services</option>
          <option>Payments</option>
          <option>Auth</option>
          <option>CDN</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-[8px] border border-[var(--border,#e2e8f0)] bg-white px-3 text-[13px]"
        >
          {['All', 'Published', 'Pending approval', 'Draft'].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          className="h-10 w-[200px] rounded-[8px] border border-[var(--border,#e2e8f0)] px-3 text-[13px] outline-none focus:ring-2 focus:ring-[var(--accent,#4f46e5)]/20"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Total reports" value={TABLE_REPORTS.length} valueColor="var(--text-primary,#1e293b)" />
        <KpiCard label="Published" value={published} dotClassName="bg-[var(--success,#10b981)]" valueColor="var(--accent,#4f46e5)" />
        <KpiCard label="Pending approval" value={pending} dotClassName="bg-[var(--warning,#f59e0b)]" valueColor="var(--text-primary,#1e293b)" />
        <KpiCard label="Avg resolution time" value="42m" sublabel="Rolling 30d" valueColor="var(--text-primary,#1e293b)" />
      </div>

      <div className="overflow-hidden rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-surface,#fff)] shadow-sm">
        <table className="w-full min-w-[960px] text-left">
          <thead>
            <tr className="border-b border-[var(--border,#e2e8f0)] bg-[var(--bg-base,#f8fafc)]">
              {['INC ID', 'Incident title', 'Assigned to', 'Resolved by', 'Duration', 'Severity', 'Method', 'Status', ''].map((h) => (
                <th key={h || 'a'} className="py-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary,#64748b)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((r) => (
              <ReportTableRow key={r.id} report={r} onClick={() => navigate(`/reports/${r.id}`)} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-[13px] text-[var(--text-secondary,#64748b)]">
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setPage(0)
            }}
            className="rounded-[6px] border border-[var(--border,#e2e8f0)] px-2 py-1"
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-[6px] border border-[var(--border,#e2e8f0)] px-3 py-1 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={(page + 1) * pageSize >= filtered.length}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-[6px] border border-[var(--border,#e2e8f0)] px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
