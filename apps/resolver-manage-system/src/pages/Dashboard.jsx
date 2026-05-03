import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import {
  Activity, CheckCircle2, Clock, Users, Plus, Link, Globe, Sparkles,
  MessageSquare, Shield, AlertCircle, FileText, Zap, MoreHorizontal, ExternalLink, ChevronRight
} from 'lucide-react'
import { KpiCard, Avatar } from '@resolver/ui'

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
  { title: 'Payment service outage - INC-038', date: 'May 1, 2026' },
  { title: 'Auth token expiry bug - INC-037', date: 'May 1, 2026' },
  { title: 'CDN cache miss storm - INC-034', date: 'Apr 30, 2026' },
]


export default function Dashboard() {
  const navigate = useNavigate();
  const incidents = useSelector((/** @type {any} */ s) => s.incidents.list);
  const team = useSelector((/** @type {any} */ s) => s.team.members);

  const activeCount = incidents.filter((i) => i.status !== 'resolved').length;
  const resolvedToday = incidents.filter((i) => i.status === 'resolved').length;
  const criticalCount = incidents.filter((i) => i.severity === 'critical').length;
  const onlineCount = team.filter((m) => m.status === 'online').length;

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

      {/* Top Grid: Chart & Quick Access */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Incidents over last 7 days */}
        <div className="lg:col-span-2 flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-[15px] font-bold text-slate-900">Incidents over last 7 days</span>
            </div>
            <button type="button" className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="h-[240px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                  dy={10}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Access */}
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                <Zap size={14} />
              </div>
              <span className="text-[15px] font-bold text-slate-900">Quick access</span>
            </div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400">STATIC ACTIONS</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-black py-8 text-white transition-transform hover:scale-[1.02]">
              <Plus size={20} />
              <span className="text-[12px] font-medium">New Incident</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white py-8 text-slate-900 transition-transform hover:scale-[1.02] hover:bg-slate-50">
              <Link size={20} className="text-slate-400" />
              <span className="text-[12px] font-medium">Invite link</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white py-8 text-slate-900 transition-transform hover:scale-[1.02] hover:bg-slate-50">
              <Globe size={20} className="text-slate-400" />
              <span className="text-[12px] font-medium">Public status</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white py-8 text-slate-900 transition-transform hover:scale-[1.02] hover:bg-slate-50">
              <Sparkles size={20} className="text-slate-400" />
              <span className="text-[12px] font-medium">AI postmortem</span>
            </button>
          </div>
        </div>
      </div>

      {/* Middle Grid: Mini Chat & Team Management */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Mini Chat Preview */}
        <div className="lg:col-span-1 flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-6">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                  <MessageSquare size={14} />
                </div>
                <span className="text-[15px] font-bold text-slate-900">Mini chat preview</span>
              </div>
              <span className="text-[10px] font-bold tracking-wider text-slate-400">MESSAGES COLLECTION</span>
            </div>
            <button type="button" className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-5 pb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[12px] font-bold text-slate-400">S</div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-slate-900">System Alert</span>
                  <span className="text-[12px] text-slate-500">CPU usage exceeded 90%...</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">2m ago</span>
                <div className="h-1.5 w-1.5 rounded-full bg-black" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[12px] font-bold text-slate-400">S</div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-slate-900">Security Bot</span>
                  <span className="text-[12px] text-slate-500">Suspicious login attempt detected</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">15m ago</span>
                <div className="h-1.5 w-1.5 rounded-full bg-black" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[12px] font-bold text-slate-400">I</div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-slate-900">Incident #104</span>
                  <span className="text-[12px] text-slate-500">Database connection recovered</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">1h ago</span>
              </div>
            </div>
          </div>

          <button className="mt-auto w-full rounded-xl bg-black py-2.5 text-[12px] font-bold text-white transition-opacity hover:opacity-90">
            View all
          </button>
        </div>

        {/* Team Management */}
        <div className="lg:col-span-2 flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-6">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                  <Shield size={14} />
                </div>
                <span className="text-[15px] font-bold text-slate-900">Team Management</span>
              </div>
              <span className="text-[10px] font-bold tracking-wider text-slate-400">USERS + STATUS FIELD</span>
            </div>
            <button type="button" className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-8 max-h-[220px] scrollbar-hide">
            {team.map((m) => (
              <div key={m.id} className="flex items-center justify-between transition-colors hover:bg-slate-50/50 p-2 -mx-2 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar name={m.name} size={32} />
                    <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${m.status === 'online' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-slate-900">{m.name}</span>
                    <span className="text-[11px] text-slate-500">{m.role || 'Security Lead'}</span>
                  </div>
                </div>
                <div className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider ${m.status === 'online' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  {m.status === 'online' ? 'ACTIVE' : 'AWAY'}
                </div>
              </div>
            ))}
          </div>

          <button className="mt-auto w-full rounded-xl bg-black py-2.5 text-[12px] font-bold text-white transition-opacity hover:opacity-90">
            View all
          </button>
        </div>
      </div>

      {/* Bottom Grid: Active Incidents, Public Reports, AI Insights */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Active Incidents List */}
        <div className="flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-0.5 pb-6">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                <AlertCircle size={14} />
              </div>
              <span className="text-[15px] font-bold text-slate-900">Active incidents list</span>
            </div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400">INCIDENTS COLLECTION</span>
          </div>

          <div className="flex flex-col gap-3 pb-8">
            {incidents.filter((i) => i.status !== 'resolved').slice(0, 2).map((inc) => (
              <div key={inc.id} className="flex items-center justify-between rounded-2xl bg-slate-50/50 p-3">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${inc.severity === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{inc.id}</span>
                    <span className="text-[12px] font-bold text-slate-900 truncate max-w-[120px]">{inc.title}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${inc.status === 'investigating' ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-600'}`}>
                    {inc.status.charAt(0).toUpperCase() + inc.status.slice(1)}
                  </div>
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
              </div>
            ))}
          </div>

          <button className="mt-auto w-full rounded-xl bg-black py-2.5 text-[12px] font-bold text-white transition-opacity hover:opacity-90">
            View All
          </button>
        </div>

        {/* Public Reports */}
        <div className="flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-0.5 pb-6">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                <FileText size={14} />
              </div>
              <span className="text-[15px] font-bold text-slate-900">Public reports</span>
            </div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400">POSTMORTEMS COLLECTION</span>
          </div>

          <div className="flex flex-col gap-6 pb-8">
            {REPORTS.slice(0, 2).map((r) => (
              <div key={r.title} className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] font-bold text-slate-900">{r.title.split(' - ')[0]}</span>
                  <span className="text-[11px] text-slate-400">{r.date} • {r.title.split(' - ')[1]}</span>
                </div>
                <ExternalLink size={14} className="text-slate-300" />
              </div>
            ))}
          </div>

          <button className="mt-auto w-full rounded-xl bg-black py-2.5 text-[12px] font-bold text-white transition-opacity hover:opacity-90">
            View all
          </button>
        </div>

        {/* AI Insights */}
        <div className="flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-0.5 pb-6">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                <Zap size={14} />
              </div>
              <span className="text-[15px] font-bold text-slate-900">AI Insights</span>
            </div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400">CLAUDE API - ON PAGE LOAD</span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <Sparkles size={14} className="mt-0.5 text-slate-400" />
              <span className="text-[12px] text-slate-600">Pattern detection: MTTR trend is decreasing by 12%</span>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles size={14} className="mt-0.5 text-slate-400" />
              <span className="text-[12px] text-slate-600">Recurring service alert detected in US-East-1</span>
            </div>
          </div>

          <div className="mt-auto pt-10">
            <span className="text-[10px] font-mono text-slate-300">POST /api/dashboard/insights</span>
          </div>
        </div>
      </div>
    </div>
  );
}
