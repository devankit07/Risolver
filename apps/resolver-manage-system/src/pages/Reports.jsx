import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PublicReportCard } from '@resolver/ui'

const DEMO_REPORTS = [
  {
    id: 'r1',
    title: 'Payment service outage — 45 minutes downtime',
    status: 'published',
    date: 'May 1, 2026',
    services: ['Payments', 'API Gateway'],
    duration: '45m',
    summary:
      'The payment service experienced complete unavailability for 45 minutes due to a connection pool exhaustion cascade.',
  },
  {
    id: 'r2',
    title: 'Auth token expiry regression after deploy v2.3.1',
    status: 'published',
    date: 'May 1, 2026',
    services: ['Auth', 'Frontend'],
    duration: '1h 12m',
    summary:
      'A regression introduced in deploy v2.3.1 caused JWT token refresh to fail silently, logging out active users.',
  },
  {
    id: 'r3',
    title: 'CDN cache invalidation storm caused elevated origin load',
    status: 'draft',
    date: 'Apr 30, 2026',
    services: ['CDN', 'Origin servers'],
    duration: '23m',
    summary:
      'A misconfigured cache TTL led to simultaneous expiration of 80% of cached assets, causing a thundering herd.',
  },
  {
    id: 'r4',
    title: 'Database primary failover — read replica lag',
    status: 'published',
    date: 'Apr 28, 2026',
    services: ['PostgreSQL', 'Backend'],
    duration: '18m',
    summary:
      'Scheduled maintenance on the primary database triggered an unplanned failover with 40-second replica lag.',
  },
]

const TIME_FILTERS = ['All time', 'Last 30 days', 'Last 90 days']

export default function Reports() {
  const navigate = useNavigate()
  const [timeFilter, setTimeFilter] = useState('All time')
  const [serviceFilter, setServiceFilter] = useState('All')

  const services = ['All', ...new Set(DEMO_REPORTS.flatMap((r) => r.services))]

  const filtered = DEMO_REPORTS.filter((r) => {
    return serviceFilter === 'All' || r.services.includes(serviceFilter)
  })

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-[20px] font-bold text-[#0f172a] tracking-tight">Incident postmortems</h1>
        <p className="text-[14px] text-slate-500">Public transparency reports for resolved incidents</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-1 py-1 shadow-sm">
          {TIME_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setTimeFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                timeFilter === f ? 'bg-[#eef2ff] text-[#4f46e5]' : 'text-slate-500 hover:text-[#0f172a]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="h-10 px-3 rounded-xl text-[13px] outline-none border border-slate-200 bg-white text-slate-700"
        >
          {services.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400 text-[13px]">
          No reports found — try a different filter
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((report) => (
            <PublicReportCard
              key={report.id}
              variant="light"
              report={report}
              onClick={() => navigate(`/reports/${report.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
