import { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { KpiCard, Avatar, StatusBadge } from '@resolver/ui'
import { LayoutGrid, List } from 'lucide-react'
import { fetchTeamMembers } from '../store/teamSlice.js'
import InviteModal from '../components/InviteModal.jsx'

const ROLE_OPTIONS = ['All', 'manager', 'responder']

const TAG_COLOR = {
  admin:     'bg-red-50    text-red-700',
  manager:   'bg-purple-50 text-purple-700',
  responder: 'bg-emerald-50 text-emerald-700',
}

const COL_HEADS = ['Name', 'Role', 'Status', 'Department', 'Last active', 'Joined on', 'Actions']

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-[8px] border border-[var(--border,#e2e8f0)] bg-white p-5">
      <div className="flex flex-col items-center gap-3">
        <div className="h-14 w-14 animate-pulse rounded-full bg-slate-100" />
        <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
        <div className="h-2.5 w-16 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  )
}

function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function Team() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { members = [], total = 0, loading = false } = useSelector((s) => s?.team || {})
  const currentUser = useSelector((s) => s.auth.user)
  const isAdmin = currentUser?.role === 'admin'
  const myId = String(currentUser?._id ?? currentUser?.id ?? '')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [view, setView] = useState('list')
  const [inviteOpen, setInviteOpen] = useState(false)

  const debouncedSearch = useDebouncedValue(search, 300)

  useEffect(() => {
    dispatch(fetchTeamMembers())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchTeamMembers({ search: debouncedSearch || undefined, role: roleFilter }))
  }, [debouncedSearch, roleFilter, dispatch])

  const onlineCount = members.filter((m) => m.status === 'online').length

  return (
    <div className="flex flex-col gap-5">
      {inviteOpen && <InviteModal onClose={() => setInviteOpen(false)} />}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard variant="light" label="Total members" value={total || members.length} valueColor="var(--text-primary,#1e293b)" />
        <KpiCard
          variant="light"
          label="Online now"
          value={onlineCount}
          sublabel="Available"
          valueColor="var(--accent,#4f46e5)"
          dotClassName="bg-[var(--success,#10b981)]"
        />
        <KpiCard variant="light" label="Incidents handled" value="—" sublabel="This week" valueColor="var(--text-primary,#1e293b)" />
        <KpiCard variant="light" label="Avg response time" value="—" sublabel="No data yet" valueColor="var(--text-primary,#1e293b)" />
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
                {r === 'All' ? 'All roles' : r === 'responder' ? 'Team Member' : r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--accent,#4f46e5)]">▾</span>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="h-10 shrink-0 rounded-[6px] bg-[var(--accent,#4f46e5)] px-4 text-[12px] font-semibold text-white hover:brightness-110"
          >
            + Invite member
          </button>
        )}
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : members.length === 0 ? (
            <p className="col-span-full py-12 text-center text-[var(--text-secondary,#64748b)]">No team members found</p>
          ) : (
            members.map((member) => (
              <div
                key={member._id ?? member.id}
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
                  <div className="mt-1 flex flex-wrap items-center justify-center gap-1">
                    {member.specialization && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                        {member.specialization}
                      </span>
                    )}
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${TAG_COLOR[member.role] ?? 'bg-[var(--accent-dim,#eef2ff)] text-[var(--accent,#4f46e5)]'}`}>
                      {member.role === 'responder' ? 'Team Member' : member.role}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <StatusBadge variant="light" status={member.status ?? 'offline'} />
                  </div>
                  {member.department && (
                    <p className="mt-2 text-[12px] text-[var(--text-secondary,#64748b)]">{member.department}</p>
                  )}
                  {(isAdmin || String(member._id ?? member.id) === myId) && (
                    <button
                      type="button"
                      onClick={() => navigate(`/team/${member._id ?? member.id}`)}
                      className="mt-5 w-full rounded-[6px] border border-[var(--border,#e2e8f0)] py-2 text-[12px] font-semibold text-[var(--accent,#4f46e5)] hover:bg-[var(--accent-dim,#eef2ff)]"
                    >
                      {String(member._id ?? member.id) === myId ? 'My profile' : 'View profile'}
                    </button>
                  )}
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
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    {COL_HEADS.map((h) => (
                      <td key={h} className="py-3 px-3">
                        <div className="h-3 w-4/5 animate-pulse rounded bg-slate-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={COL_HEADS.length} className="py-16 text-center text-[13px] text-[var(--text-secondary,#64748b)]">
                    No team members found
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr
                    key={member._id ?? member.id}
                    className="border-b border-[var(--border,#e2e8f0)] last:border-0 hover:bg-[var(--bg-base,#f8fafc)]"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <Avatar name={member.name} size={32} />
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white ${
                              member.status === 'online'
                                ? 'bg-[var(--success,#10b981)]'
                                : member.status === 'away'
                                  ? 'bg-[var(--warning,#f59e0b)]'
                                  : 'bg-slate-400'
                            }`}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-[var(--text-primary,#1e293b)]">{member.name}</p>
                          <p className="text-[11px] text-[var(--text-secondary,#64748b)]">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap items-center gap-1">
                        {member.specialization && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                            {member.specialization}
                          </span>
                        )}
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${TAG_COLOR[member.role] ?? 'bg-[var(--accent-dim,#eef2ff)] text-[var(--accent,#4f46e5)]'}`}>
                          {member.role === 'responder' ? 'Team Member' : member.role}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          member.status === 'online'
                            ? 'bg-emerald-50 text-emerald-700'
                            : member.status === 'away'
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            member.status === 'online'
                              ? 'bg-emerald-500'
                              : member.status === 'away'
                                ? 'bg-amber-500'
                                : 'bg-slate-400'
                          }`}
                        />
                        {member.status === 'online' ? 'Online' : member.status === 'away' ? 'Away' : 'Offline'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[13px] text-[var(--text-secondary,#64748b)]">
                      {member.department ?? '—'}
                    </td>
                    <td className="py-3 px-3 text-[12px] text-[var(--text-secondary,#64748b)]">
                      {member.lastActive ? formatDate(member.lastActive) : '—'}
                    </td>
                    <td className="py-3 px-3 text-[12px] text-[var(--text-secondary,#64748b)]">
                      {formatDate(member.createdAt)}
                    </td>
                    <td className="py-3 px-3">
                      {(isAdmin || String(member._id ?? member.id) === myId) && (
                        <button
                          type="button"
                          onClick={() => navigate(`/team/${member._id ?? member.id}`)}
                          className="rounded-[6px] border border-[var(--border,#e2e8f0)] px-3 py-1.5 text-[11px] font-semibold text-[var(--accent,#4f46e5)] hover:bg-[var(--accent-dim,#eef2ff)]"
                        >
                          {String(member._id ?? member.id) === myId ? 'My profile' : 'View profile'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
