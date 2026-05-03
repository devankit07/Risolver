import { useSelector } from 'react-redux'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  Plus,
  Link,
  Globe,
  Sparkles,
  MessageSquare,
  Shield,
  AlertCircle,
  FileText,
  Zap,
  MoreHorizontal,
  ChevronRight,
  Activity,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { KpiCard, Avatar, SurfaceCard } from '@resolver/ui'

const IN = 'var(--accent, #4f46e5)'
const BK = 'var(--text-primary, #1e293b)'
const OPEN_FILL = '#4f46e5'
const RESOLVED_FILL = '#10b981'

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
  { title: 'Payment service outage - INC-038', date: 'May 1, 2026' },
  { title: 'Auth token expiry bug - INC-037', date: 'May 1, 2026' },
  { title: 'CDN cache miss storm - INC-034', date: 'Apr 30, 2026' },
]

const MINI_THREADS = [
  { id: 't1', name: 'Sara Patel', preview: 'Rolling restart complete on pool…', time: '2m ago', unread: true },
  { id: 't2', name: 'INC-041 thread', preview: 'P99 still elevated — checking DB…', time: '12m ago', unread: true },
  { id: 't3', name: 'Priya Nair', preview: 'Postmortem draft looks good.', time: '1h ago', unread: false },
]

const RECENT_ACTIVITIES = [
  { actor: 'Sara Patel', action: 'raised severity on INC-041 to critical', time: '3m ago' },
  { actor: 'James Lee', action: 'joined the INC-040 war room', time: '12m ago' },
  { actor: 'Priya Nair', action: 'published postmortem for INC-038', time: '1h ago' },
  { actor: 'Alex Kim', action: 'acknowledged alert · CDN edge US-East', time: '2h ago' },
]

function PanelHead({ icon: Icon, title, meta, action }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3 border-b border-[var(--border,#e2e8f0)] pb-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[var(--accent-dim,#eef2ff)] text-[var(--accent,#4f46e5)]">
            <Icon size={16} strokeWidth={2} aria-hidden />
          </div>
          <h2 className="text-[15px] font-semibold tracking-tight text-[var(--text-primary,#1e293b)]">{title}</h2>
        </div>
        {meta ? (
          <p className="mt-2 pl-[42px] text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary,#64748b)]">
            {meta}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  )
}

const primaryBtn =
  'w-full rounded-[6px] bg-[var(--accent,#4f46e5)] py-2.5 text-center text-[12px] font-semibold text-white shadow-sm transition-colors hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent,#4f46e5)] focus-visible:ring-offset-2'

export default function Dashboard() {
  const navigate = useNavigate()
  const incidents = useSelector((/** @type {any} */ s) => s.incidents.list)
  const team = useSelector((/** @type {any} */ s) => s.team.members)

  const activeCount = incidents.filter((i) => i.status !== 'resolved').length
  const resolvedToday = incidents.filter((i) => i.status === 'resolved').length
  const criticalCount = incidents.filter((i) => i.severity === 'critical').length
  const onlineCount = team.filter((m) => m.status === 'online').length

  return (
    <div className="mt-4 flex max-w-full flex-col gap-4 md:mt-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Active incidents"
          value={activeCount}
          sublabel={`${criticalCount} critical`}
          valueColor={BK}
          dotClassName="bg-[var(--danger,#ef4444)]"
        />
        <KpiCard
          label="Resolved today"
          value={resolvedToday}
          sublabel="↑ 2 vs yesterday"
          valueColor={IN}
          dotClassName="bg-[var(--success,#10b981)]"
        />
        <KpiCard label="Avg. MTTR" value="38m" sublabel="Mean time to resolve" valueColor={BK} />
        <KpiCard
          label="Team online"
          value={onlineCount}
          sublabel="On-call now"
          valueColor={IN}
          dotClassName="bg-[var(--accent,#4f46e5)]"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SurfaceCard className="flex flex-col p-6 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border,#e2e8f0)] pb-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--text-secondary,#64748b)]">Incidents over last 7 days</p>
              <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-[var(--text-primary,#1e293b)]">
                Open vs resolved
              </p>
            </div>
            <button
              type="button"
              className="rounded-[6px] p-2 text-[var(--text-secondary,#64748b)] transition-colors hover:bg-slate-50"
              aria-label="Chart actions"
            >
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="h-[260px] w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border,#e2e8f0)" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-secondary,#64748b)', fontSize: 11, fontWeight: 500 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  width={28}
                  domain={[0, 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid var(--border,#e2e8f0)',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 12 }}
                  formatter={(value) => <span className="text-[12px] text-[var(--text-secondary,#64748b)]">{value}</span>}
                />
                <Bar dataKey="open" name="Open" fill={OPEN_FILL} radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="resolved" name="Resolved" fill={RESOLVED_FILL} radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SurfaceCard>

        <SurfaceCard className="flex flex-col p-6">
          <PanelHead icon={Zap} title="Quick access" meta="Static actions" />
          <div className="grid flex-1 grid-cols-2 gap-3">
            <button
              type="button"
              className="flex flex-col items-center justify-center gap-2 rounded-[8px] bg-[var(--accent,#4f46e5)] py-7 text-white shadow-sm transition hover:brightness-110"
            >
              <Plus size={20} strokeWidth={2} />
              <span className="text-[12px] font-semibold">New incident</span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center justify-center gap-2 rounded-[8px] border border-[var(--border,#e2e8f0)] bg-white py-7 text-[var(--text-primary,#1e293b)] shadow-sm transition-colors hover:border-[var(--accent-border,#c7d2fe)] hover:bg-[var(--accent-dim,#eef2ff)]"
            >
              <Link size={20} className="text-[var(--accent,#4f46e5)]" strokeWidth={2} />
              <span className="text-[12px] font-semibold">Invite link</span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center justify-center gap-2 rounded-[8px] border border-[var(--border,#e2e8f0)] bg-white py-7 text-[var(--text-primary,#1e293b)] shadow-sm transition-colors hover:border-[var(--accent-border,#c7d2fe)] hover:bg-[var(--accent-dim,#eef2ff)]"
            >
              <Globe size={20} className="text-[var(--accent,#4f46e5)]" strokeWidth={2} />
              <span className="text-[12px] font-semibold">Public status</span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center justify-center gap-2 rounded-[8px] border border-[var(--border,#e2e8f0)] bg-white py-7 text-[var(--text-primary,#1e293b)] shadow-sm transition-colors hover:border-[var(--accent-border,#c7d2fe)] hover:bg-[var(--accent-dim,#eef2ff)]"
            >
              <Sparkles size={20} className="text-[var(--accent,#4f46e5)]" strokeWidth={2} />
              <span className="text-[12px] font-semibold">AI postmortem</span>
            </button>
          </div>
        </SurfaceCard>
      </div>

      <SurfaceCard className="flex flex-col p-6">
        <PanelHead
          icon={Shield}
          title="Team management"
          meta="Users + status"
          action={
            <button type="button" className="rounded-[6px] p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
              <MoreHorizontal size={20} />
            </button>
          }
        />

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between gap-3 rounded-[8px] border border-[var(--border,#e2e8f0)] px-3 py-3 transition-colors hover:bg-[var(--bg-base,#f8fafc)]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative shrink-0">
                  <Avatar name={m.name} size={36} />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
                      m.status === 'online'
                        ? 'bg-[var(--success,#10b981)]'
                        : m.status === 'away'
                          ? 'bg-[var(--warning,#f59e0b)]'
                          : 'bg-slate-400'
                    }`}
                    aria-hidden
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--text-primary,#1e293b)]">{m.name}</p>
                  <p className="text-[11px] text-[var(--text-secondary,#64748b)]">{m.role}</p>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  m.status === 'online'
                    ? 'bg-emerald-50 text-emerald-700'
                    : m.status === 'away'
                      ? 'bg-amber-50 text-amber-800'
                      : 'bg-slate-100 text-slate-500'
                }`}
              >
                {m.status === 'online' ? 'Online' : m.status === 'away' ? 'Away' : 'Offline'}
              </span>
            </div>
          ))}
        </div>

        <button type="button" className={`${primaryBtn} mt-6 max-w-xs`} onClick={() => navigate('/team')}>
          View all
        </button>
      </SurfaceCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
        <SurfaceCard className="flex h-full min-h-0 flex-col p-6">
          <PanelHead icon={AlertCircle} title="Active incidents list" meta="Incidents collection" />

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-[8px] border border-[var(--border,#e2e8f0)] bg-white shadow-sm">
              {incidents
                .filter((i) => i.status !== 'resolved')
                .slice(0, 4)
                .map((inc) => (
                  <button
                    key={inc.id}
                    type="button"
                    onClick={() => navigate(`/workspace/${inc.id}`)}
                    className="flex w-full items-center justify-between gap-3 border-b border-[var(--border,#e2e8f0)] px-3 py-3 text-left transition-colors last:border-b-0 hover:bg-[var(--bg-base,#f8fafc)]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${inc.severity === 'critical' ? 'animate-pulse bg-[var(--danger,#ef4444)]' : 'bg-[var(--warning,#f59e0b)]'}`}
                        aria-hidden
                      />
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-secondary,#64748b)]">
                          {inc.id}
                        </p>
                        <p className="truncate text-[13px] font-semibold text-[var(--text-primary,#1e293b)]">{inc.title}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          inc.status === 'investigating' ? 'bg-rose-50 text-rose-600' : 'bg-slate-200/80 text-slate-600'
                        }`}
                      >
                        {inc.status.charAt(0).toUpperCase() + inc.status.slice(1)}
                      </span>
                      <ChevronRight size={18} className="shrink-0 text-slate-400" strokeWidth={2} aria-hidden />
                    </div>
                  </button>
                ))}
            </div>

            <button
              type="button"
              className={`${primaryBtn} mt-4 shrink-0`}
              onClick={() => navigate('/incidents/active')}
            >
              View all
            </button>
          </div>
        </SurfaceCard>

        <div className="flex min-h-0 flex-col gap-4 lg:h-full">
          <SurfaceCard className="flex min-h-0 flex-1 flex-col p-6">
            <PanelHead icon={FileText} title="Public reports" meta="Postmortems collection" />

            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex flex-1 flex-col overflow-y-auto rounded-[8px] border border-[var(--border,#e2e8f0)] bg-white shadow-sm">
                {REPORTS.slice(0, 3).map((r) => {
                  const reportId = r.title.split(' - ')[1]
                  return (
                    <button
                      key={r.title}
                      type="button"
                      onClick={() => navigate(`/reports/${reportId}`)}
                      className="flex w-full items-start justify-between gap-3 border-b border-[var(--border,#e2e8f0)] px-3 py-3 text-left transition-colors last:border-b-0 hover:bg-[var(--bg-base,#f8fafc)]"
                    >
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold leading-snug text-[var(--text-primary,#1e293b)]">
                          {r.title.split(' - ')[0]}
                        </p>
                        <p className="mt-1 text-[11px] text-[var(--text-secondary,#64748b)]">
                          {r.date} · {reportId}
                        </p>
                      </div>
                      <ChevronRight size={18} className="mt-0.5 shrink-0 text-slate-400" strokeWidth={2} aria-hidden />
                    </button>
                  )
                })}
              </div>

              <button type="button" className={`${primaryBtn} mt-4 shrink-0`} onClick={() => navigate('/reports')}>
                View all
              </button>
            </div>
          </SurfaceCard>

          <SurfaceCard className="flex min-h-0 flex-1 flex-col p-6">
            <PanelHead icon={Activity} title="Recent activities" meta="Organization feed" />
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-[8px] border border-[var(--border,#e2e8f0)] bg-white shadow-sm">
              {RECENT_ACTIVITIES.map((a, idx) => (
                <button
                  key={`${a.actor}-${idx}`}
                  type="button"
                  onClick={() => navigate('/incidents/active')}
                  className="flex w-full items-start justify-between gap-3 border-b border-[var(--border,#e2e8f0)] px-3 py-3 text-left transition-colors last:border-b-0 hover:bg-[var(--bg-base,#f8fafc)]"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] leading-snug text-[var(--text-primary,#1e293b)]">
                      <span className="font-semibold">{a.actor}</span>{' '}
                      <span className="font-normal text-[var(--text-secondary,#64748b)]">{a.action}</span>
                    </p>
                    <p className="mt-1 text-[11px] text-[var(--text-secondary,#64748b)]">{a.time}</p>
                  </div>
                  <ChevronRight size={18} className="mt-0.5 shrink-0 text-slate-400" strokeWidth={2} aria-hidden />
                </button>
              ))}
            </div>
          </SurfaceCard>
        </div>

        <div className="flex min-h-0 flex-col gap-4 lg:h-full">
          <SurfaceCard className="flex min-h-0 flex-1 flex-col p-6">
            <PanelHead icon={Sparkles} title="AI insights" meta="Operational signals" />

            <ul className="flex min-h-0 flex-1 flex-col justify-center gap-4">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-[var(--accent-dim,#eef2ff)] text-[var(--accent,#4f46e5)]">
                  <Sparkles size={14} />
                </span>
                <p className="text-[13px] leading-relaxed text-[var(--text-secondary,#64748b)]">
                  MTTR trend is down <span className="font-semibold text-[var(--text-primary,#1e293b)]">12%</span> vs last
                  sprint.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-[var(--accent-dim,#eef2ff)] text-[var(--accent,#4f46e5)]">
                  <Sparkles size={14} />
                </span>
                <p className="text-[13px] leading-relaxed text-[var(--text-secondary,#64748b)]">
                  Recurring alert pattern in <span className="font-semibold text-[var(--text-primary,#1e293b)]">US-East-1</span>.
                </p>
              </li>
            </ul>
          </SurfaceCard>

          <SurfaceCard className="flex min-h-0 flex-1 flex-col p-6">
            <PanelHead icon={MessageSquare} title="Message threads" meta="Latest previews" />
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
              {MINI_THREADS.map((t) => (
                <button
                  key={`stack-${t.id}`}
                  type="button"
                  onClick={() => navigate('/messages')}
                  className="flex items-center justify-between gap-2 rounded-[8px] px-2 py-2.5 text-left hover:bg-[var(--bg-base,#f8fafc)]"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Avatar name={t.name} size={32} />
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-semibold text-[var(--text-primary,#1e293b)]">{t.name}</p>
                      <p className="truncate text-[11px] text-[var(--text-secondary,#64748b)]">{t.preview}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] text-slate-400">{t.time}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => navigate('/messages')}
              className="mt-3 shrink-0 inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--accent,#4f46e5)] hover:underline"
            >
              View all →
            </button>
          </SurfaceCard>
        </div>
      </div>
    </div>
  )
}
