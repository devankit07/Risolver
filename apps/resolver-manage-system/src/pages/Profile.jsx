import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Avatar, StatusBadge, KpiCard } from '@resolver/ui'

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
  const members = useSelector((s) => s.team.members)
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
    <div className="flex flex-col lg:flex-row gap-6 max-w-full">
      <div className="shrink-0 rounded-xl border border-slate-200 bg-white p-6 flex flex-col gap-4 shadow-sm w-full lg:w-[260px] self-start">
        <div className="flex flex-col items-center gap-3 text-center">
          <Avatar name={member.name} size={72} />
          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a]">{member.name}</h2>
            <div className="mt-2">
              <RoleBadge role={member.role} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-slate-600">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: member.status === 'online' ? '#4f46e5' : '#94a3b8' }}
            />
            <span>
              {member.status === 'online' ? 'Online' : member.status === 'away' ? 'Away' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="border-t border-slate-200" />

        <div className="flex flex-col gap-3">
          {[
            { label: 'Email', value: member.email },
            { label: 'Joined', value: 'Jan 12, 2025' },
            { label: 'Team', value: 'Platform SRE' },
            { label: 'Last active', value: member.lastActive },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">{label}</span>
              <span className="text-[13px] text-slate-700">{value ?? '—'}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => navigate('/messages')}
            className="w-full py-2.5 rounded-xl text-[13px] font-semibold border border-slate-200 bg-white text-[#0f172a] hover:border-[#4f46e5]/40"
          >
            Send message
          </button>
          <button
            type="button"
            className="w-full py-2.5 rounded-xl text-[13px] font-semibold bg-[#4f46e5] text-white hover:bg-[#4338ca]"
          >
            Assign to incident
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <div className="flex items-center gap-0 border-b border-slate-200">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-[13px] font-semibold transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'text-[#4f46e5] border-[#4f46e5]'
                  : 'text-slate-500 border-transparent hover:text-[#0f172a]'
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
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-2">
                <span className="text-[12px] font-semibold text-[#0f172a]">Skills & expertise</span>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {isAdminOrManager && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-2">
                <span className="text-[12px] font-semibold text-[#0f172a]">Permissions</span>
                <div className="flex flex-wrap gap-2">
                  {['Manage incidents', 'Invite members', 'Publish reports', 'Configure alerts', 'View all data'].map((p) => (
                    <span
                      key={p}
                      className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#eef2ff] text-[#3730a3] border border-[#c7d2fe]"
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
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {['Title', 'Status', 'Date'].map((h) => (
                    <th key={h} className="py-3 px-3 text-[10px] uppercase font-semibold tracking-wider text-slate-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEMO_INCIDENTS.map((inc) => (
                  <tr key={inc.id} className="border-b border-slate-100">
                    <td className="py-3 px-3 text-[13px] text-slate-800">{inc.title}</td>
                    <td className="py-3 px-3">
                      <StatusBadge variant="light" status={inc.status} />
                    </td>
                    <td className="py-3 px-3 text-[12px] text-slate-500">{inc.date}</td>
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
                className="flex items-center gap-3 rounded-xl p-4 border border-slate-200 bg-white shadow-sm"
              >
                <span className="w-2 h-2 rounded-full shrink-0 bg-[#4f46e5]" />
                <span className="flex-1 text-[13px] text-slate-600">{a.action}</span>
                <span className="text-[12px] text-slate-400">{a.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function RoleBadge({ role }) {
  const roleKey = role?.toLowerCase()
  const styles = {
    admin: { bg: '#eef2ff', color: '#3730a3', border: '#c7d2fe' },
    manager: { bg: '#eef2ff', color: '#312e81', border: '#c7d2fe' },
    engineer: { bg: '#f1f5f9', color: '#0f172a', border: '#e2e8f0' },
    devops: { bg: '#f1f5f9', color: '#0f172a', border: '#e2e8f0' },
    viewer: { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
  }
  const s = styles[roleKey] ?? styles.viewer
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold border"
      style={{ background: s.bg, color: s.color, borderColor: s.border }}
    >
      {role}
    </span>
  )
}
