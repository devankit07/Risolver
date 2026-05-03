import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Avatar, StatusBadge, KpiCard, NotificationItem } from '@resolver/ui'
import { Mail, Calendar, Users, Clock, Briefcase } from 'lucide-react'

const SKILLS_MAP = {
  engineer: ['Backend', 'PostgreSQL', 'AWS'],
  devops: ['Terraform', 'Docker', 'AWS', 'CI/CD'],
  manager: ['On-call planning', 'Escalations'],
}

const DEMO_INCIDENTS = [
  { id: 'INC-041', title: 'API Gateway timeout spike', status: 'investigating', severity: 'critical', resolvedAt: '—', duration: '42m' },
  { id: 'INC-038', title: 'Payment service 503 errors', status: 'resolved', severity: 'critical', resolvedAt: 'May 1', duration: '45m' },
]

const DEMO_NOTIFICATIONS = [
  {
    id: 'n1',
    incidentId: 'INC-041',
    title: 'You have been assigned to: Payment gateway 500 errors',
    sublabel: 'Assigned by Priya Nair (Manager) · 2 min ago',
    severity: 'critical',
    unread: true,
  },
  {
    id: 'n2',
    incidentId: 'INC-039',
    title: 'You have been assigned to: CDN cache failure review',
    sublabel: 'Assigned by Priya Nair (Manager) · 1h ago',
    severity: 'medium',
    unread: false,
  },
]

function RoleBadge({ role }) {
  const key = role?.toLowerCase()
  const map = {
    manager: 'bg-[var(--accent-dim,#eef2ff)] text-[var(--accent,#4f46e5)] ring-1 ring-[var(--accent-border,#c7d2fe)]',
    engineer: 'bg-sky-50 text-sky-800 ring-1 ring-sky-200',
    devops: 'bg-teal-50 text-teal-800 ring-1 ring-teal-200',
    admin: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
    viewer: 'bg-slate-50 text-slate-600 ring-1 ring-slate-200',
  }
  const cls = map[key] ?? map.viewer
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${cls}`}>
      {role}
    </span>
  )
}

export default function Profile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const members = useSelector((s) => s?.team?.members || [])
  const member = members.find((m) => m.id === userId)
  const [activeTab, setActiveTab] = useState('Overview')
  const [incFilter, setIncFilter] = useState('All')

  useEffect(() => {
    if (member?.role === 'Admin') {
      navigate('/team', { replace: true })
    }
  }, [member, navigate])

  const roleKey = member?.role?.toLowerCase()
  const isManager = roleKey === 'manager'
  const isEngineerLike = roleKey === 'engineer' || roleKey === 'devops'
  const skills = SKILLS_MAP[roleKey] ?? []
  const managedPeers = useMemo(() => members.filter((m) => m.role !== 'Admin' && m.role !== 'Manager'), [members])

  const filteredIncidents = DEMO_INCIDENTS.filter((i) => {
    if (incFilter === 'Open') return i.status !== 'resolved'
    if (incFilter === 'Resolved') return i.status === 'resolved'
    return true
  })

  if (!member) {
    return (
      <div className="flex h-48 items-center justify-center text-[var(--text-secondary,#64748b)]">
        Member not found
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <aside className="sticky top-4 w-full shrink-0 rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-surface,#fff)] p-5 lg:w-[260px]">
        <div className="flex flex-col items-center text-center">
          <Avatar name={member.name} size={72} />
          <h2 className="mt-3 text-[18px] font-medium text-[var(--text-primary,#1e293b)]">{member.name}</h2>
          <div className="mt-2">
            <RoleBadge role={member.role} />
          </div>
          <div className="mt-3 flex items-center gap-2 text-[13px] text-[var(--text-secondary,#64748b)]">
            <span
              className={`h-2 w-2 rounded-full ${
                member.status === 'online'
                  ? 'bg-[var(--success,#10b981)]'
                  : member.status === 'away'
                    ? 'bg-[var(--warning,#f59e0b)]'
                    : 'bg-slate-400'
              }`}
            />
            {member.status === 'online' ? 'Online' : member.status === 'away' ? 'Away' : 'Offline'}
          </div>
        </div>

        <div className="my-5 border-t border-[var(--border,#e2e8f0)]" />

        <dl className="flex flex-col gap-4">
          {[
            { label: 'Email', value: member.email, icon: Mail },
            { label: 'Joined', value: member.joinedOn ?? '—', icon: Calendar },
            { label: 'Department', value: member.department ?? '—', icon: Users },
            { label: 'Last active', value: member.lastActive ?? '—', icon: Clock },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[var(--bg-base,#f8fafc)] text-[var(--text-secondary,#64748b)]">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary,#64748b)]">{label}</dt>
                <dd className="text-[13px] font-medium text-[var(--text-primary,#1e293b)]">{value}</dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => navigate('/messages')}
            className="w-full rounded-[6px] border border-[var(--border,#e2e8f0)] py-2.5 text-[13px] font-semibold text-[var(--text-primary,#1e293b)] hover:bg-[var(--bg-base,#f8fafc)]"
          >
            Send message
          </button>
          <button
            type="button"
            onClick={() => navigate('/workspace/INC-041')}
            className="w-full rounded-[6px] bg-[var(--accent,#4f46e5)] py-2.5 text-[13px] font-semibold text-white hover:brightness-110"
          >
            Assign to incident
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap gap-4 border-b border-[var(--border,#e2e8f0)]">
          {['Overview', 'Incidents', 'Notifications'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-[13px] font-semibold transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-[var(--accent,#4f46e5)] text-[var(--accent,#4f46e5)]'
                  : 'border-b-2 border-transparent text-[var(--text-secondary,#64748b)] hover:text-[var(--text-primary,#1e293b)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Overview' && (
          <div className="mt-6 flex flex-col gap-6">
            <div className={`grid gap-3 ${isManager ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
              {isManager ? (
                <>
                  <KpiCard label="Total incidents managed" value={member.incidentsThisWeek ?? 12} valueColor="var(--text-primary,#1e293b)" />
                  <KpiCard label="Postmortems created" value={4} valueColor="var(--text-primary,#1e293b)" />
                </>
              ) : isEngineerLike ? (
                <>
                  <KpiCard label="Resolved this week" value={member.incidentsThisWeek ?? 5} valueColor="var(--accent,#4f46e5)" dotClassName="bg-[var(--success,#10b981)]" />
                  <KpiCard label="Avg response time" value="6m" sublabel="Rolling" valueColor="var(--text-primary,#1e293b)" />
                  <KpiCard label="Open now" value={1} valueColor="var(--text-primary,#1e293b)" dotClassName="bg-[var(--danger,#ef4444)]" />
                </>
              ) : (
                <>
                  <KpiCard label="Incidents" value={member.incidentsThisWeek ?? 0} valueColor="var(--text-primary,#1e293b)" />
                </>
              )}
            </div>

            {isManager && (
              <section className="rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-surface,#fff)] p-5">
                <h3 className="flex items-center gap-2 text-[14px] font-semibold text-[var(--text-primary,#1e293b)]">
                  <Users className="h-4 w-4 text-[var(--accent,#4f46e5)]" />
                  Team members under management
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {managedPeers.slice(0, 5).map((m) => (
                    <li key={m.id} className="flex items-center justify-between rounded-[8px] bg-[var(--bg-base,#f8fafc)] px-3 py-2">
                      <div className="flex items-center gap-3">
                        <Avatar name={m.name} size={32} />
                        <div>
                          <p className="text-[13px] font-semibold text-[var(--text-primary,#1e293b)]">{m.name}</p>
                          <p className="text-[11px] text-[var(--text-secondary,#64748b)]">{m.role}</p>
                        </div>
                      </div>
                      <span
                        className={`h-2 w-2 rounded-full ${m.status === 'online' ? 'bg-[var(--success,#10b981)]' : 'bg-slate-400'}`}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {isEngineerLike && skills.length > 0 && (
              <section className="rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-surface,#fff)] p-5">
                <h3 className="flex items-center gap-2 text-[14px] font-semibold text-[var(--text-primary,#1e293b)]">
                  <Briefcase className="h-4 w-4 text-[var(--accent,#4f46e5)]" />
                  Skills & tags
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span key={s} className="rounded-[6px] bg-[var(--bg-base,#f8fafc)] px-3 py-1 text-[12px] font-medium text-[var(--text-primary,#1e293b)] ring-1 ring-[var(--border,#e2e8f0)]">
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {isEngineerLike && (
              <section className="overflow-hidden rounded-[8px] border border-[var(--border,#e2e8f0)]">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-[var(--bg-base,#f8fafc)] text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary,#64748b)]">
                    <tr>
                      {['INC ID', 'Title', 'Status', 'Severity', 'Resolved at'].map((h) => (
                        <th key={h} className="px-4 py-3">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border,#e2e8f0)]">
                    {DEMO_INCIDENTS.map((inc) => (
                      <tr key={inc.id} className="hover:bg-[var(--bg-base,#f8fafc)]">
                        <td className="px-4 py-3 font-mono text-[11px] font-semibold text-[var(--accent,#4f46e5)]">{inc.id}</td>
                        <td className="px-4 py-3 font-medium text-[var(--text-primary,#1e293b)]">{inc.title}</td>
                        <td className="px-4 py-3">
                          <StatusBadge variant="light" status={inc.status} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge variant="light" status={inc.severity} />
                        </td>
                        <td className="px-4 py-3 text-[var(--text-secondary,#64748b)]">{inc.resolvedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}
          </div>
        )}

        {activeTab === 'Incidents' && (
          <div className="mt-6 space-y-4">
            <div className="flex gap-2">
              {['All', 'Open', 'Resolved'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setIncFilter(f)}
                  className={`rounded-[6px] px-3 py-1.5 text-[12px] font-semibold ${
                    incFilter === f ? 'bg-[var(--accent-dim,#eef2ff)] text-[var(--accent,#4f46e5)]' : 'text-[var(--text-secondary,#64748b)]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="overflow-hidden rounded-[8px] border border-[var(--border,#e2e8f0)]">
              <table className="w-full text-[13px]">
                <thead className="bg-[var(--bg-base,#f8fafc)] text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary,#64748b)]">
                  <tr>
                    {['INC ID', 'Title', 'Severity', 'Status', 'Duration', 'Resolved at'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border,#e2e8f0)]">
                  {filteredIncidents.map((inc) => (
                    <tr key={inc.id} className="hover:bg-[var(--bg-base,#f8fafc)]">
                      <td className="px-4 py-3 font-mono text-[11px] font-semibold text-[var(--accent,#4f46e5)]">{inc.id}</td>
                      <td className="px-4 py-3">{inc.title}</td>
                      <td className="px-4 py-3">
                        <StatusBadge variant="light" status={inc.severity} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge variant="light" status={inc.status} />
                      </td>
                      <td className="px-4 py-3">{inc.duration}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#64748b)]">{inc.resolvedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Notifications' && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-end">
              <button type="button" className="text-[13px] font-semibold text-[var(--accent,#4f46e5)] hover:underline">
                Mark all as read
              </button>
            </div>
            {DEMO_NOTIFICATIONS.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-[8px] border border-dashed border-[var(--border,#e2e8f0)] py-16 text-center">
                <p className="text-[15px] font-medium text-[var(--text-primary,#1e293b)]">No new incident assignments</p>
                <p className="text-[13px] text-[var(--text-secondary,#64748b)]">You&apos;re all caught up.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {DEMO_NOTIFICATIONS.map((n) => (
                  <NotificationItem
                    key={n.id}
                    incidentId={n.incidentId}
                    title={n.title}
                    sublabel={n.sublabel}
                    severity={n.severity}
                    unread={n.unread}
                    onOpen={() => navigate(`/workspace/${n.incidentId}`)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
