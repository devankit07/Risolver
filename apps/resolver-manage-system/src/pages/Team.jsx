import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { KpiCard, TeamMemberRow, Avatar, StatusBadge } from '@resolver/ui'
import { LayoutGrid, List } from 'lucide-react'

const COL_HEADS = ['Name', 'Role', 'Status', 'Incidents this week', 'Last active', 'Joined on', 'Department', 'On-call', 'Actions']

const ROLE_OPTIONS = ['All', 'Admin', 'Manager', 'Engineer', 'DevOps']

export default function Team() {
  const navigate = useNavigate()
  const { members = [], loading = false } = useSelector((s) => s?.team || {})
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [view, setView] = useState('list')

  const filtered = members.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'All' || m.role === roleFilter
    return matchSearch && matchRole
  })

  const onlineCount = members.filter((m) => m.status === 'online').length
  const totalIncidents = members.reduce((sum, m) => sum + (m.incidentsThisWeek ?? 0), 0)

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard variant="light" label="Total members" value={members.length} valueColor="var(--text-primary,#1e293b)" />
        <KpiCard
          variant="light"
          label="Online now"
          value={onlineCount}
          sublabel="Available"
          valueColor="var(--accent,#4f46e5)"
          dotClassName="bg-[var(--success,#10b981)]"
        />
        <KpiCard variant="light" label="Incidents handled" value={totalIncidents} sublabel="This week" valueColor="var(--text-primary,#1e293b)" />
        <KpiCard variant="light" label="Avg response time" value="8m" sublabel="Across team" valueColor="var(--text-primary,#1e293b)" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-[6px] bg-[var(--bg-base,#f8fafc)] p-0.5 ring-1 ring-[var(--border,#e2e8f0)]">
          <button
            type="button"
            onClick={() => setView('list')}
            className={`flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-[12px] font-semibold ${
              view === 'list' ? 'bg-white text-[var(--accent,#4f46e5)] shadow-sm' : 'text-[var(--text-secondary,#64748b)]'
            }`}
          >
            <List size={14} /> List view
          </button>
          <button
            type="button"
            onClick={() => setView('grid')}
            className={`flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-[12px] font-semibold ${
              view === 'grid' ? 'bg-white text-[var(--accent,#4f46e5)] shadow-sm' : 'text-[var(--text-secondary,#64748b)]'
            }`}
          >
            <LayoutGrid size={14} /> Grid view
          </button>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search team members…"
          className="min-w-[200px] flex-1 rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-surface,#fff)] px-3 py-2 text-[13px] outline-none placeholder:text-slate-400 focus:border-[var(--accent,#4f46e5)] focus:ring-2 focus:ring-[var(--accent,#4f46e5)]/15"
        />

        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 min-w-[140px] cursor-pointer appearance-none rounded-[8px] border border-[var(--accent-border,#c7d2fe)] bg-[var(--accent-dim,#eef2ff)] px-3 pr-8 text-[13px] font-medium text-[var(--accent,#4f46e5)] outline-none focus:ring-2 focus:ring-[var(--accent,#4f46e5)]/25"
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--accent,#4f46e5)]">▾</span>
        </div>

        <button
          type="button"
          className="h-10 shrink-0 rounded-[6px] bg-[var(--accent,#4f46e5)] px-4 text-[12px] font-semibold text-white hover:brightness-110"
        >
          + Invite member
        </button>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-[8px] bg-slate-100" />
            ))
          ) : filtered.length === 0 ? (
            <p className="col-span-full py-12 text-center text-[var(--text-secondary,#64748b)]">No team members found</p>
          ) : (
            filtered.map((member) => (
              <div
                key={member.id}
                className="flex flex-col rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-surface,#fff)] p-5 shadow-[0_3px_16px_rgba(15,23,42,0.06)]"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <Avatar name={member.name} size={56} />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                        member.status === 'online'
                          ? 'bg-[var(--success,#10b981)]'
                          : member.status === 'away'
                            ? 'bg-[var(--warning,#f59e0b)]'
                            : 'bg-slate-400'
                      }`}
                    />
                  </div>
                  <p className="mt-3 text-[15px] font-semibold text-[var(--text-primary,#1e293b)]">{member.name}</p>
                  <span className="mt-1 rounded-full bg-[var(--accent-dim,#eef2ff)] px-2 py-0.5 text-[11px] font-semibold text-[var(--accent,#4f46e5)]">
                    {member.role}
                  </span>
                  <div className="mt-3 flex items-center gap-2">
                    <StatusBadge variant="light" status={member.status ?? 'offline'} />
                  </div>
                  <p className="mt-4 text-[13px] text-[var(--text-secondary,#64748b)]">
                    <span className="font-semibold text-[var(--text-primary,#1e293b)]">{member.incidentsThisWeek ?? 0}</span>{' '}
                    incidents this week
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate(`/team/${member.id}`)}
                    className="mt-5 w-full rounded-[6px] border border-[var(--border,#e2e8f0)] py-2 text-[12px] font-semibold text-[var(--accent,#4f46e5)] hover:bg-[var(--accent-dim,#eef2ff)]"
                  >
                    View profile
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-surface,#fff)] shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border,#e2e8f0)] bg-[var(--bg-base,#f8fafc)]">
                {COL_HEADS.map((h) => (
                  <th key={h} className="py-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary,#64748b)]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    {COL_HEADS.map((h) => (
                      <td key={h} className="py-3 px-3">
                        <div className="h-3 w-4/5 animate-pulse rounded bg-slate-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-[13px] text-[var(--text-secondary,#64748b)]">
                    No team members found
                  </td>
                </tr>
              ) : (
                filtered.map((member) => (
                  <TeamMemberRow
                    key={member.id}
                    variant="light"
                    member={member}
                    onClick={() => navigate(`/team/${member.id}`)}
                    onViewProfile={() => navigate(`/team/${member.id}`)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
