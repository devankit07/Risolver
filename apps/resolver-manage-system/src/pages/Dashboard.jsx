import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  Plus, Link, Sparkles, MessageSquare, AlertCircle,
  FileText, Zap, MoreHorizontal, ChevronRight, Activity, Info, AlertTriangle,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { KpiCard, Avatar, SurfaceCard } from '@resolver/ui'
import { fetchStats, fetchChart, fetchInsights, fetchRecentActivity, fetchMessagePreviews } from '../store/dashboardSlice.js'
import { fetchTeamMembers } from '../store/teamSlice.js'
import { fetchIncidents } from '../store/incidentsSlice.js'
import InviteModal from '../components/InviteModal.jsx'
import CreateIncidentModal from '../components/CreateIncidentModal.jsx'

const IN = 'var(--accent, #4f46e5)'
const BK = 'var(--text-primary, #1e293b)'
const OPEN_FILL = '#4f46e5'
const RESOLVED_FILL = '#10b981'

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

function SkeletonRow({ count = 3 }) {
  return Array.from({ length: count }).map((_, i) => (
    <div key={i} className="flex items-center gap-3 border-b border-[var(--border,#e2e8f0)] px-3 py-3 last:border-0">
      <div className="h-2 w-2 shrink-0 rounded-full bg-slate-200" />
      <div className="flex-1 space-y-1.5">
        <div className="h-2.5 w-3/4 animate-pulse rounded bg-slate-100" />
        <div className="h-2 w-1/2 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  ))
}

function InsightIcon({ type }) {
  if (type === 'warning') return <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
  if (type === 'tip') return <Sparkles size={14} className="text-violet-500 shrink-0 mt-0.5" />
  return <Info size={14} className="text-sky-500 shrink-0 mt-0.5" />
}

function insightBg(type) {
  if (type === 'warning') return 'bg-amber-50 border-amber-100'
  if (type === 'tip') return 'bg-violet-50 border-violet-100'
  return 'bg-sky-50 border-sky-100'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const authUser = useSelector((s) => s.auth.user)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const canCreateIncident = ['admin', 'manager', 'creator'].includes(authUser?.role)
  const isAdmin = authUser?.role === 'admin'

  const incidents = useSelector((s) => s.incidents.list)
  const team = useSelector((s) => s.team.members)
  const stats = useSelector((s) => s.dashboard.stats)
  const chart = useSelector((s) => s.dashboard.chart)
  const insights = useSelector((s) => s.dashboard.insights)
  const activities = useSelector((s) => s.dashboard.activities)
  const messagePreviews = useSelector((s) => s.dashboard.messagePreviews)
  const statsLoading = useSelector((s) => s.dashboard.statsLoading)
  const chartLoading = useSelector((s) => s.dashboard.chartLoading)
  const insightsLoading = useSelector((s) => s.dashboard.insightsLoading)
  const activityLoading = useSelector((s) => s.dashboard.activityLoading)

  useEffect(() => {
    dispatch(fetchStats())
    dispatch(fetchChart())
    dispatch(fetchInsights())
    dispatch(fetchRecentActivity())
    dispatch(fetchMessagePreviews())
    dispatch(fetchTeamMembers({ status: 'online' }))
    dispatch(fetchIncidents())
  }, [dispatch])

  const activeCount = stats?.activeIncidents ?? incidents.filter((i) => i.status !== 'resolved').length
  const resolvedToday = stats?.resolvedToday ?? 0
  const avgMTTR = stats?.avgMTTR
  const teamOnline = stats?.teamOnline ?? team.filter((m) => m.status === 'online').length
  const criticalCount = incidents.filter((i) => i.severity === 'critical').length

  return (
    <div className="mt-4 flex max-w-full flex-col gap-4 md:mt-6">
      {inviteOpen && <InviteModal onClose={() => setInviteOpen(false)} />}
      {createOpen && (
        <CreateIncidentModal
          onClose={() => {
            setCreateOpen(false)
            dispatch(fetchIncidents())
          }}
        />
      )}

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Active incidents"
          value={statsLoading ? '—' : activeCount}
          sublabel={statsLoading ? 'Loading…' : `${criticalCount} critical`}
          valueColor={BK}
          dotClassName="bg-[var(--danger,#ef4444)]"
        />
        <KpiCard
          label="Resolved today"
          value={statsLoading ? '—' : resolvedToday}
          sublabel={statsLoading ? 'Loading…' : 'Last 24 hours'}
          valueColor={IN}
          dotClassName="bg-[var(--success,#10b981)]"
        />
        <KpiCard
          label="Avg. MTTR"
          value={statsLoading ? '—' : avgMTTR != null ? `${avgMTTR}m` : '—'}
          sublabel={statsLoading ? 'Loading…' : avgMTTR != null ? 'Last 30 days' : 'No data yet'}
          valueColor={BK}
        />
        <KpiCard
          label="Team online"
          value={statsLoading ? '—' : teamOnline}
          sublabel={statsLoading ? 'Loading…' : 'On-call now'}
          valueColor={IN}
          dotClassName="bg-[var(--accent,#4f46e5)]"
        />
      </div>

      {/* Chart + Quick access */}
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
          <div className="flex h-[260px] w-full min-h-[220px] min-w-0 items-center justify-center">
            {chartLoading ? (
              <div className="h-full w-full animate-pulse rounded-[8px] bg-slate-100" />
            ) : chart.length === 0 ? (
              <p className="text-[13px] text-[var(--text-secondary,#64748b)]">No incident trend data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOpen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={OPEN_FILL} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={OPEN_FILL} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={RESOLVED_FILL} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={RESOLVED_FILL} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border,#e2e8f0)" />
                  <XAxis
                    dataKey="date"
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
                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--border,#e2e8f0)', fontSize: '12px' }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: 12 }}
                    formatter={(value) => <span className="text-[12px] text-[var(--text-secondary,#64748b)]">{value}</span>}
                  />
                  <Area type="monotone" dataKey="open" name="Open" stroke={OPEN_FILL} fillOpacity={1} fill="url(#colorOpen)" strokeWidth={3} activeDot={{ r: 6 }} />
                  <Area type="monotone" dataKey="resolved" name="Resolved" stroke={RESOLVED_FILL} fillOpacity={1} fill="url(#colorResolved)" strokeWidth={3} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </SurfaceCard>

        <SurfaceCard className="flex flex-col p-6">
          <PanelHead icon={Zap} title="Quick access" meta="Incidents & invitations" />
          <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
            {canCreateIncident && (
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="flex flex-col items-center justify-center gap-2 rounded-[8px] bg-[var(--accent,#4f46e5)] py-10 text-white shadow-sm transition hover:brightness-110"
              >
                <Plus size={20} strokeWidth={2} />
                <span className="text-[12px] font-semibold">New incident</span>
              </button>
            )}
            {isAdmin && (
              <button
                type="button"
                onClick={() => setInviteOpen(true)}
                className="flex flex-col items-center justify-center gap-2 rounded-[8px] border border-[var(--border,#e2e8f0)] bg-white py-10 text-[var(--text-primary,#1e293b)] shadow-sm transition-colors hover:border-[var(--accent-border,#c7d2fe)] hover:bg-[var(--accent-dim,#eef2ff)]"
              >
                <Link size={20} className="text-[var(--accent,#4f46e5)]" strokeWidth={2} />
                <span className="text-[12px] font-semibold">Invite link</span>
              </button>
            )}
          </div>
          {!canCreateIncident && !isAdmin && (
            <p className="mt-4 text-center text-[12px] text-[var(--text-secondary,#64748b)]">
              Open incidents from the sidebar. Your admin can send team invites.
            </p>
          )}
        </SurfaceCard>
      </div>

      {/* Bottom 3-col row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">

        {/* Active incidents */}
        <SurfaceCard className="flex h-full min-h-0 flex-col p-6">
          <PanelHead icon={AlertCircle} title="Active incidents list" meta="Incidents collection" />
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-[8px] border border-[var(--border,#e2e8f0)] bg-white shadow-sm">
              {incidents.filter((i) => i.status !== 'resolved').length === 0 ? (
                <p className="px-3 py-8 text-center text-[13px] text-[var(--text-secondary,#64748b)]">
                  No active incidents.
                </p>
              ) : (
                incidents
                  .filter((i) => i.status !== 'resolved')
                  .slice(0, 4)
                  .map((inc) => (
                    <button
                      key={inc._id ?? inc.id}
                      type="button"
                      onClick={() => navigate(`/workspace/${inc._id ?? inc.id}`)}
                      className="flex w-full items-center justify-between gap-3 border-b border-[var(--border,#e2e8f0)] px-3 py-3 text-left transition-colors last:border-b-0 hover:bg-[var(--bg-base,#f8fafc)]"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${inc.severity === 'critical' ? 'animate-pulse bg-[var(--danger,#ef4444)]' : 'bg-[var(--warning,#f59e0b)]'}`}
                          aria-hidden
                        />
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-secondary,#64748b)]">
                            {inc._id ?? inc.id}
                          </p>
                          <p className="truncate text-[13px] font-semibold text-[var(--text-primary,#1e293b)]">{inc.title}</p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          {inc.status.charAt(0).toUpperCase() + inc.status.slice(1)}
                        </span>
                        <ChevronRight size={18} className="shrink-0 text-slate-400" strokeWidth={2} aria-hidden />
                      </div>
                    </button>
                  ))
              )}
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

        {/* Public reports + Recent activities */}
        <div className="flex min-h-0 flex-col gap-4 lg:h-full">
          <SurfaceCard className="flex min-h-0 flex-1 flex-col p-6">
            <PanelHead icon={FileText} title="Public reports" meta="Postmortems collection" />
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex flex-1 flex-col overflow-y-auto rounded-[8px] border border-[var(--border,#e2e8f0)] bg-white shadow-sm">
                <p className="px-3 py-8 text-center text-[13px] text-[var(--text-secondary,#64748b)]">
                  No published reports yet.
                </p>
              </div>
              <button type="button" className={`${primaryBtn} mt-4 shrink-0`} onClick={() => navigate('/reports')}>
                View all
              </button>
            </div>
          </SurfaceCard>

          <SurfaceCard className="flex min-h-0 flex-1 flex-col p-6">
            <PanelHead icon={Activity} title="Recent activities" meta="Organization feed" />
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-[8px] border border-[var(--border,#e2e8f0)] bg-white shadow-sm">
              {activityLoading ? (
                <SkeletonRow count={3} />
              ) : activities.length === 0 ? (
                <p className="px-3 py-8 text-center text-[13px] text-[var(--text-secondary,#64748b)]">
                  No recent activity yet.
                </p>
              ) : (
                activities.map((a, idx) => (
                  <button
                    key={a._id ?? idx}
                    type="button"
                    onClick={() => navigate('/incidents/active')}
                    className="flex w-full items-start justify-between gap-3 border-b border-[var(--border,#e2e8f0)] px-3 py-3 text-left transition-colors last:border-b-0 hover:bg-[var(--bg-base,#f8fafc)]"
                  >
                    <div className="min-w-0">
                      <p className="text-[13px] leading-snug text-[var(--text-primary,#1e293b)]">
                        <span className="font-semibold">{a.userId?.name ?? 'Someone'}</span>{' '}
                        <span className="font-normal text-[var(--text-secondary,#64748b)]">{a.title}</span>
                      </p>
                      <p className="mt-1 text-[11px] text-[var(--text-secondary,#64748b)]">
                        {new Date(a.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <ChevronRight size={18} className="mt-0.5 shrink-0 text-slate-400" strokeWidth={2} aria-hidden />
                  </button>
                ))
              )}
            </div>
          </SurfaceCard>
        </div>

        {/* AI insights + Message threads */}
        <div className="flex min-h-0 flex-col gap-4 lg:h-full">
          <SurfaceCard className="flex min-h-0 flex-1 flex-col p-6">
            <PanelHead icon={Sparkles} title="AI insights" meta="Operational signals" />
            {insightsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 w-full animate-pulse rounded-[6px] bg-slate-100" />
                ))}
              </div>
            ) : insights.length === 0 ? (
              <p className="text-[13px] leading-relaxed text-[var(--text-secondary,#64748b)]">
                No operational insights yet. Connect data sources to populate AI signals here.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {insights.map((ins, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 rounded-[6px] border p-3 text-[13px] leading-snug ${insightBg(ins.type)}`}
                  >
                    <InsightIcon type={ins.type} />
                    <span className="text-[var(--text-primary,#1e293b)]">{ins.text}</span>
                  </div>
                ))}
              </div>
            )}
          </SurfaceCard>

          <SurfaceCard className="flex min-h-0 flex-1 flex-col p-6">
            <PanelHead icon={MessageSquare} title="Message threads" meta="Latest previews" />
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
              {messagePreviews.length === 0 ? (
                <p className="py-4 text-center text-[13px] text-[var(--text-secondary,#64748b)]">
                  No message threads yet.
                </p>
              ) : (
                messagePreviews.map((t) => (
                  <button
                    key={t.threadId}
                    type="button"
                    onClick={() => navigate('/messages')}
                    className="flex items-center justify-between gap-2 rounded-[8px] px-2 py-2.5 text-left hover:bg-[var(--bg-base,#f8fafc)]"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <Avatar name={t.otherUser?.name ?? '?'} size={32} />
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-semibold text-[var(--text-primary,#1e293b)]">
                          {t.otherUser?.name ?? '—'}
                        </p>
                        <p className="truncate text-[11px] text-[var(--text-secondary,#64748b)]">{t.lastMessage}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-[10px] text-slate-400">{t.timestamp}</span>
                  </button>
                ))
              )}
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
