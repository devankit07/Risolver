import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
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

export default function Dashboard() {
  const navigate = useNavigate()
  const incidents = useSelector((s) => s.incidents.list)
  const team = useSelector((s) => s.team.members)

  const activeCount = incidents.filter((i) => i.status !== 'resolved').length
  const resolvedToday = incidents.filter((i) => i.status === 'resolved').length
  const criticalCount = incidents.filter((i) => i.severity === 'critical').length
  const onlineCount = team.filter((m) => m.status === 'online').length

  return (
    <div className="flex flex-col gap-5 max-w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard
          variant="light"
          label="Active incidents"
          value={activeCount}
          sublabel={`${criticalCount} critical`}
          valueColor={BK}
        />
        <KpiCard variant="light" label="Resolved today" value={resolvedToday} sublabel="↑ 2 vs yesterday" valueColor={IN} />
        <KpiCard variant="light" label="Avg. MTTR" value="38m" sublabel="Mean time to resolve" valueColor={BK} />
        <KpiCard variant="light" label="Team online" value={onlineCount} sublabel="On-call now" valueColor={IN} />
      </div>

      <div className="flex items-center gap-2 min-h-9 px-3 rounded-xl border border-slate-200 bg-slate-50/80">
        {TABS.map((tab, i) =>
          tab === null ? (
            <span key={i} className="h-3.5 w-px mx-0.5 bg-slate-300" />
          ) : (
            <button
              key={tab}
              type="button"
              className={`text-[12px] px-2.5 py-1 rounded-lg font-medium transition-colors ${
                tab === 'All' ? 'bg-white text-[#4f46e5] shadow-sm border border-slate-200' : 'text-slate-500 hover:text-[#0f172a]'
              }`}
            >
              {tab}
            </button>
          ),
        )}
        <div className="flex-1" />
        <button
          type="button"
          className="text-[12px] px-3 py-1.5 rounded-lg font-medium border border-slate-200 bg-white text-[#0f172a] hover:border-[#4f46e5]/40"
        >
          + New
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-3">
          <span className="text-[12px] font-medium text-slate-500">Incidents over last 7 days</span>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CHART_DATA} barGap={4} barCategoryGap="28%">
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  fontSize: 12,
                  color: BK,
                }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="resolved" name="Resolved" fill="#c7d2fe" stroke={IN} strokeWidth={1} radius={[4, 4, 0, 0]} />
              <Bar dataKey="open" name="Open" fill="#e2e8f0" stroke={BK} strokeWidth={1} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-2">
            <span className="text-[12px] font-semibold text-[#0f172a]">Active incidents</span>
            {incidents.filter((i) => i.status !== 'resolved').slice(0, 4).length === 0 ? (
              <p className="text-[12px] text-center py-6 text-slate-400">No active incidents</p>
            ) : (
              incidents
                .filter((i) => i.status !== 'resolved')
                .slice(0, 4)
                .map((inc) => (
                  <button
                    key={inc.id}
                    type="button"
                    onClick={() => navigate(`/workspace/${inc.id}`)}
                    className="flex items-center gap-2 text-left rounded-lg p-2 -mx-2 transition-colors hover:bg-slate-50"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0 ring-2 ring-white"
                      style={{
                        background: inc.severity === 'critical' ? BK : IN,
                        opacity: inc.severity === 'critical' ? 1 : 0.65,
                      }}
                    />
                    <span className="flex-1 text-[12px] truncate text-slate-600">{inc.title}</span>
                    <StatusBadge variant="light" status={inc.status} />
                  </button>
                ))
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-2">
            <span className="text-[12px] font-semibold text-[#0f172a]">Team on-call</span>
            {team.slice(0, 4).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => navigate(`/team/${m.id}`)}
                className="flex items-center gap-2 text-left rounded-lg p-2 -mx-2 hover:bg-slate-50 w-full"
              >
                <Avatar name={m.name} size={28} />
                <span className="flex-1 text-[13px] text-[#0f172a] font-medium">{m.name}</span>
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: m.status === 'online' ? IN : '#94a3b8' }}
                />
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-2">
            <span className="text-[12px] font-semibold text-[#0f172a]">Public reports</span>
            {REPORTS.map((r) => (
              <div key={r.title} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-[#4f46e5]" />
                <div className="flex flex-col">
                  <span className="text-[12px] text-slate-700">{r.title}</span>
                  <span className="text-[11px] text-slate-400">{r.date}</span>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => navigate('/reports')}
              className="text-[12px] font-medium text-left mt-1 text-[#4f46e5] hover:text-[#3730a3]"
            >
              View all →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
