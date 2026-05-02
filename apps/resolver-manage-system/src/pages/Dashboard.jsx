import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Activity, CheckCircle2, Clock, Users } from 'lucide-react'
import { KpiCard, StatusBadge, Avatar } from '@resolver/ui'

const IN = '#4f46e5'
const BK = '#0f172a'

const CHART_DATA = [
  { day: 'Mon', resolved: 4, open: 2 },
  { day: 'Tue', resolved: 6, open: 3 },
  { day: 'Wed', resolved: 3, open: 5 },
  { day: 'Thu', resolved: 8, open: 1 },
  { day: 'Fri', resolved: 5, open: 4 },
  { day: 'Sat', resolved: 2, open: 2 },
  { day: 'Sun', resolved: 7, open: 1 },
]

const REPORTS = [
  { title: 'Payment service outage — INC-038', date: 'May 1, 2026' },
  { title: 'Auth token expiry bug — INC-037', date: 'May 1, 2026' },
  { title: 'CDN cache miss storm — INC-034', date: 'Apr 30, 2026' },
]

const TABS = ['All', 'Open', 'Investigating', 'Resolved', null, 'Critical', 'High', 'Medium']

const panelClass =
  'rounded-xl border border-slate-100 bg-white p-4 shadow-[0_3px_16px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.04)]'

export default function Dashboard() {
  const navigate = useNavigate()
  const incidents = useSelector((s) => s.incidents.list)
  const team = useSelector((s) => s.team.members)

  const activeCount = incidents.filter((i) => i.status !== 'resolved').length
  const resolvedToday = incidents.filter((i) => i.status === 'resolved').length
  const criticalCount = incidents.filter((i) => i.severity === 'critical').length
  const onlineCount = team.filter((m) => m.status === 'online').length

  return (
    <div className="flex max-w-full flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Active incidents"
          value={activeCount}
          sublabel={`${criticalCount} critical`}
          valueColor={BK}
          icon={Activity}
        />
        <KpiCard
          label="Resolved today"
          value={resolvedToday}
          sublabel="↑ 2 vs yesterday"
          valueColor={IN}
          icon={CheckCircle2}
          dotClassName="bg-emerald-500"
        />
        <KpiCard
          label="Avg. MTTR"
          value="38m"
          sublabel="Mean time to resolve"
          valueColor={BK}
          icon={Clock}
        />
        <KpiCard
          label="Team online"
          value={onlineCount}
          sublabel="On-call now"
          valueColor={IN}
          icon={Users}
        />
      </div>

      <div className="flex min-h-9 items-center gap-2 rounded-xl border border-slate-200/80 bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-sm">
        {TABS.map((tab, i) =>
          tab === null ? (
            <span key={i} className="mx-0.5 h-3.5 w-px bg-slate-200" />
          ) : (
            <button
              key={tab}
              type="button"
              className={`rounded-lg px-2.5 py-1 text-[12px] font-medium transition-colors ${
                tab === 'All'
                  ? 'border border-slate-200 bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ),
        )}
        <div className="flex-1" />
        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-900 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700"
        >
          + New
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
        <div className={`${panelClass} flex flex-col gap-3`}>
          <span className="text-[13px] font-semibold text-slate-700">Incidents over last 7 days</span>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={CHART_DATA} barGap={6} barCategoryGap="24%">
              <XAxis
                dataKey="day"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  fontSize: 12,
                  color: BK,
                  boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
                }}
                cursor={{ fill: '#f1f5f9' }}
              />
              <Bar dataKey="resolved" name="Resolved" fill="#c7d2fe" stroke={IN} strokeWidth={1} radius={[6, 6, 0, 0]} />
              <Bar dataKey="open" name="Open" fill="#e2e8f0" stroke={BK} strokeWidth={1} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-4">
          <div className={`${panelClass} flex flex-col gap-2`}>
            <span className="text-[13px] font-semibold text-slate-800">Active incidents</span>
            {incidents.filter((i) => i.status !== 'resolved').slice(0, 4).length === 0 ? (
              <p className="py-6 text-center text-[12px] text-slate-400">No active incidents</p>
            ) : (
              incidents
                .filter((i) => i.status !== 'resolved')
                .slice(0, 4)
                .map((inc) => (
                  <button
                    key={inc.id}
                    type="button"
                    onClick={() => navigate(`/workspace/${inc.id}`)}
                    className="-mx-2 flex items-center gap-2 rounded-lg p-2 text-left transition-colors hover:bg-slate-50"
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full ring-2 ring-white"
                      style={{
                        background: inc.severity === 'critical' ? BK : IN,
                        opacity: inc.severity === 'critical' ? 1 : 0.65,
                      }}
                    />
                    <span className="flex-1 truncate text-[12px] text-slate-600">{inc.title}</span>
                    <StatusBadge variant="light" status={inc.status} />
                  </button>
                ))
            )}
          </div>

          <div className={`${panelClass} flex flex-col gap-2`}>
            <span className="text-[13px] font-semibold text-slate-800">Team on-call</span>
            {team.slice(0, 4).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => navigate(`/team/${m.id}`)}
                className="-mx-2 flex w-full items-center gap-2 rounded-lg p-2 text-left hover:bg-slate-50"
              >
                <Avatar name={m.name} size={28} />
                <span className="flex-1 text-[13px] font-medium text-slate-900">{m.name}</span>
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: m.status === 'online' ? IN : '#94a3b8' }}
                />
              </button>
            ))}
          </div>

          <div className={`${panelClass} flex flex-col gap-2`}>
            <span className="text-[13px] font-semibold text-slate-800">Public reports</span>
            {REPORTS.map((r) => (
              <div key={r.title} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                <div className="flex flex-col">
                  <span className="text-[12px] text-slate-700">{r.title}</span>
                  <span className="text-[11px] text-slate-400">{r.date}</span>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => navigate('/reports')}
              className="mt-1 text-left text-[12px] font-medium text-indigo-600 hover:text-indigo-800"
            >
              View all →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
