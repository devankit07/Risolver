import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { KpiCard, TeamMemberRow } from '@resolver/ui'
import { Info, CheckCircle2 } from 'lucide-react'

const COL_HEADS = ['Name', 'Role', 'Status', 'Incidents this week', 'Last active', 'Joined on', 'Department', 'Email verified', 'Actions']

export default function Team() {
  const navigate = useNavigate()
  const { members, loading } = useSelector((/** @type {any} */ s) => s.team)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')

  const roles = ['All', ...new Set(members.map((m) => m.role))]

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard variant="light" label="Total members" value={members.length} valueColor="#0f172a" />
        <KpiCard variant="light" label="Online now" value={onlineCount} sublabel="Available" valueColor="#4f46e5" />
        <KpiCard variant="light" label="Incidents handled" value={totalIncidents} sublabel="This week" valueColor="#0f172a" />
        <KpiCard variant="light" label="Avg response time" value="8m" sublabel="Across team" valueColor="#0f172a" />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search team members…"
          className="flex-1 min-w-[200px] h-10 px-3 rounded-xl text-[13px] outline-none border border-slate-200 bg-white text-[#0f172a] placeholder:text-slate-400 focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-10 px-3 rounded-xl text-[13px] outline-none border border-slate-200 bg-white text-slate-700"
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="h-10 px-3 rounded-lg text-[12px] font-semibold bg-[#4f46e5] text-white hover:bg-[#4338ca] shrink-0"
        >
          + Invite member
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {COL_HEADS.map((h) => (
                <th key={h} className="py-3 px-3 text-[10px] uppercase tracking-wider font-semibold text-slate-500">
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
                      <div className="h-3 rounded animate-pulse bg-slate-100 w-4/5" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center text-slate-400 text-[13px]">
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
    </div>
  )
}
