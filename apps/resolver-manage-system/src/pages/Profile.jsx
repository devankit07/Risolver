import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Avatar, StatusBadge, KpiCard } from '@resolver/ui'
import { Mail, Calendar, Users, Clock, MessageSquare, Briefcase, Activity, ChevronLeft, Bell } from 'lucide-react'

const TABS = ['Overview', 'Incidents', 'Activity']

const SKILLS_MAP = {
  engineer: ['Backend', 'Node.js', 'AWS', 'Kubernetes'],
  devops: ['Terraform', 'AWS', 'Docker', 'CI/CD', 'Prometheus'],
  admin: ['Team leadership', 'Incident management', 'Postmortems'],
  manager: ['On-call planning', 'Escalations', 'SLA management'],
}

const DEMO_INCIDENTS = [
  { id: 'INC-041', title: 'API Gateway timeout spike', status: 'investigating', date: 'May 2, 2026' },
  { id: 'INC-038', title: 'Payment service 503 errors', status: 'resolved', date: 'May 1, 2026' },
  { id: 'INC-035', title: 'Auth service intermittent failures', status: 'resolved', date: 'Apr 30, 2026' },
]

const DEMO_ACTIVITY = [
  { action: 'Posted update on INC-041', time: '4:18 AM' },
  { action: 'Escalated INC-040 to Critical', time: '3:50 AM' },
  { action: 'Generated postmortem for INC-038', time: 'Yesterday' },
  { action: 'Added James Lee to INC-037', time: 'Yesterday' },
]

export default function Profile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const members = useSelector((s) => s?.team?.members || [])
  const member = members.find((m) => m.id === userId) ?? members[0]
  const [activeTab, setActiveTab] = useState('Overview')

  if (!member) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-[13px]">
        Member not found
      </div>
    )
  }

  const roleKey = member.role?.toLowerCase()
  const isAdminOrManager = roleKey === 'admin' || roleKey === 'manager'
  const skills = SKILLS_MAP[roleKey] ?? []

  return (
    <div className="bg-[#f9f9ff] font-body-md text-on-background selection:bg-primary-container selection:text-on-primary-container w-full h-full relative overflow-hidden flex flex-col">
      <style>{`
        /* Hide the parent layout's AppTopbar and padding to prevent duplicate headers */
        .flex.min-h-0.min-w-0.flex-1.flex-col > .shrink-0.px-4 {
          display: none !important;
        }
        main.min-h-0.flex-1 {
          padding: 0 !important;
        }
      `}</style>
      <header className="h-16 shrink-0 border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between px-6 w-full z-30">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/team')} className="p-1.5 text-gray-500 hover:bg-surface-container-low rounded-md transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-semibold text-gray-900">Team Member Profile</h2>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-500 hover:bg-surface-container-low rounded-full transition-all flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </button>
          <div className="h-8 w-8 rounded-full overflow-hidden ml-2 border border-outline-variant">
            <img alt="User profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmzHDJwxcgo49OYkINmlK-_wLsw2M-IYee6zxS8r-e3Z_uPugjDWv_mHur-ptWDAvh6XgtENuc1LtCAuI5fzsrHgvPDQFGp_aa1suzN-j_WyXg4ztb0DFuWBxjh0IK8Fd1J_TP5ljctMSEgHYhdIrCO8J0NlUY336L0LXuoSEqEKV1A3cnmZUbgg5hsUnuPpEELpc9x-jA9EoHMAB0lBecLwbnfiWqkWuPATxeqzvijPbb1-KlLkRUNdG8hEDuVKo0t9_bpgPux9lH"/>
          </div>
        </div>
      </header>

      <div className="p-6 flex-1 overflow-auto">
        <div className="flex flex-col lg:flex-row gap-6 max-w-full">
      <div className="shrink-0 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 flex flex-col gap-4 shadow-sm w-full lg:w-[260px] self-start">
        <div className="flex flex-col items-center gap-3 text-center">
          <Avatar name={member.name} size={72} />
          <div className="mt-1">
            <h2 className="text-lg font-bold text-gray-900">{member.name}</h2>
            <div className="mt-2">
              <RoleBadge role={member.role} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mt-1">
            <span
              className={`w-2.5 h-2.5 rounded-full ${member.status === 'online' ? 'bg-primary animate-pulse' : member.status === 'away' ? 'bg-secondary' : 'bg-gray-400'}`}
            />
            <span>
              {member.status === 'online' ? 'Online' : member.status === 'away' ? 'Away' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="border-t border-outline-variant" />

        <div className="flex flex-col gap-4 mt-2">
          {[
            { label: 'Email', value: member.email, icon: Mail },
            { label: 'Joined', value: 'Jan 12, 2025', icon: Calendar },
            { label: 'Team', value: 'Platform SRE', icon: Users },
            { label: 'Last active', value: member.lastActive, icon: Clock },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-gray-500 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-0">
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{label}</span>
                <span className="text-sm text-gray-700 font-medium">{value ?? '—'}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <button
            type="button"
            onClick={() => navigate('/messages')}
            className="w-full py-2.5 rounded-xl text-sm font-semibold border border-outline-variant bg-surface-container-lowest text-gray-700 hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Send message
          </button>
          <button
            type="button"
            className="w-full py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-[#3730a3] transition-colors"
          >
            Assign to incident
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6 min-w-0">
        <div className="flex items-center gap-6 border-b border-outline-variant">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'text-primary border-primary'
                  : 'text-gray-500 border-transparent hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Overview' && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {isAdminOrManager ? (
                <>
                  <KpiCard variant="light" label="Incidents managed" value={member.incidentsThisWeek ?? 12} valueColor="#0f172a" />
                  <KpiCard variant="light" label="Postmortems created" value={4} valueColor="#0f172a" />
                  <KpiCard variant="light" label="Members managed" value={members.length} valueColor="#4f46e5" />
                </>
              ) : (
                <>
                  <KpiCard variant="light" label="Incidents resolved" value={member.incidentsThisWeek ?? 5} valueColor="#4f46e5" />
                  <KpiCard variant="light" label="Avg response time" value="6m" valueColor="#0f172a" />
                  <KpiCard variant="light" label="This week" value={member.incidentsThisWeek ?? 5} valueColor="#0f172a" />
                </>
              )}
            </div>

            {!isAdminOrManager && skills.length > 0 && (
              <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm flex flex-col gap-3 mt-2">
                <span className="text-sm font-bold text-gray-900 flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary" /> Skills & expertise</span>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-surface-container-low text-gray-700 border border-outline-variant"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {isAdminOrManager && (
              <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm flex flex-col gap-3 mt-2">
                <span className="text-sm font-bold text-gray-900 flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary" /> Permissions</span>
                <div className="flex flex-wrap gap-2">
                  {['Manage incidents', 'Invite members', 'Publish reports', 'Configure alerts', 'View all data'].map((p) => (
                    <span
                      key={p}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-container/30 text-primary border border-primary/20"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Incidents' && (
          <div className="rounded-2xl border border-outline-variant overflow-hidden bg-surface-container-lowest shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  {['Incident Title', 'Status', 'Date'].map((h) => (
                    <th key={h} className="px-4 py-3 text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {DEMO_INCIDENTS.map((inc) => (
                  <tr key={inc.id} className="hover:bg-surface-container-low transition-colors cursor-pointer group">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{inc.id}: {inc.title}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge variant="light" status={inc.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm font-medium">
                      {inc.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Activity' && (
          <div className="flex flex-col gap-2">
            {DEMO_ACTIVITY.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl p-4 border border-outline-variant bg-surface-container-lowest shadow-sm hover:border-primary/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{a.action}</p>
                  <p className="text-xs text-gray-500">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
        </div>
      </div>
    </div>
  )
}

function RoleBadge({ role }) {
  const roleKey = role?.toLowerCase()
  const styles = {
    admin: 'bg-error-container text-error border-error/20',
    manager: 'bg-primary-container text-primary border-primary/20',
    engineer: 'bg-secondary-container text-secondary border-secondary/20',
    devops: 'bg-tertiary-container text-tertiary border-tertiary/20',
    viewer: 'bg-surface-container-low text-on-surface-variant border-outline-variant',
  }
  const s = styles[roleKey] ?? styles.viewer
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${s}`}
    >
      {role}
    </span>
  )
}
