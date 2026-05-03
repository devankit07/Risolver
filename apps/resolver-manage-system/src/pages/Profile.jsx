import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { formatDistanceToNow } from 'date-fns'
import { Avatar, StatusBadge, KpiCard } from '@resolver/ui'
import { Mail, Calendar, Building2, Clock, ArrowLeft, Plus, X, Bell, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import {
  fetchUserProfile,
  fetchUserIncidents,
  fetchUserNotifications,
  markAllNotificationsRead,
  deleteTeamMember,
} from '../store/teamSlice.js'
import { setActiveThreadUserId, fetchThread } from '../store/messagesSlice.js'
import api from '../services/api.js'

const PAGE_SIZE = 10

function relativeTime(d) {
  if (!d) return '—'
  try { return formatDistanceToNow(new Date(d), { addSuffix: true }) } catch { return '—' }
}
function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function roleBgText(role) {
  const map = {
    manager: { bg: 'bg-indigo-50', text: 'text-[#3730a3]', border: 'border-[#c7d2fe]' },
    creator: { bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200' },
    responder: { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' },
    admin: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
  }
  return map[role?.toLowerCase()] ?? { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' }
}

function avatarBg(role) {
  const map = { manager: '#eef2ff', creator: '#eff6ff', responder: '#f0fdf4', admin: '#f1f5f9' }
  return map[role?.toLowerCase()] ?? '#f1f5f9'
}

function SeverityDot({ severity }) {
  const colors = { critical: 'bg-red-500', high: 'bg-amber-500', medium: 'bg-indigo-500', low: 'bg-emerald-500' }
  return <span className={`inline-block h-2 w-2 rounded-full ${colors[severity] ?? 'bg-slate-400'}`} />
}

function StatusPill({ status }) {
  const map = {
    open: 'bg-red-50 text-red-700',
    assigned: 'bg-amber-50 text-amber-800',
    in_progress: 'bg-blue-50 text-blue-700',
    resolved: 'bg-emerald-50 text-emerald-700',
  }
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${map[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {status?.replace('_', ' ')}
    </span>
  )
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="w-full shrink-0 rounded-[10px] border border-[var(--border,#e2e8f0)] bg-white p-5 lg:w-[260px]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-[72px] w-[72px] animate-pulse rounded-full bg-slate-100" />
          <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        <div className="h-10 w-full animate-pulse rounded-[8px] bg-slate-100" />
        <div className="h-40 w-full animate-pulse rounded-[8px] bg-slate-100" />
      </div>
    </div>
  )
}

export default function Profile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('Overview')
  const [incFilter, setIncFilter] = useState('All')
  const [incPage, setIncPage] = useState(1)
  const [savingSkills, setSavingSkills] = useState(false)
  const [localSkills, setLocalSkills] = useState(null)
  const [addingSkill, setAddingSkill] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const auth = useSelector((s) => s.auth)
  const myId = String(auth.user?._id ?? auth.user?.id ?? '')
  const myRole = auth.user?.role ?? ''
  const isAdmin = myRole === 'admin'
  const isSelf = myId === userId

  const profileCache = useSelector((s) => s.team.profileCache)
  const incidentsCache = useSelector((s) => s.team.incidentsCache)
  const notificationsCache = useSelector((s) => s.team.notificationsCache)
  const allMembers = useSelector((s) => s.team.members)

  const profile = profileCache[userId] || allMembers.find((m) => String(m._id ?? m.id) === userId)
  const userIncidents = incidentsCache[userId] ?? []
  const notifications = notificationsCache[userId] ?? []
  const unreadCount = notifications.filter((n) => !n.isRead).length
  const skills = localSkills ?? profile?.skills ?? []

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId))
      dispatch(fetchUserIncidents({ userId }))
      dispatch(fetchUserNotifications(userId))
    }
  }, [userId, dispatch])

  // Admin viewing own profile → go to team (admins manage from team page)
  // Non-admin viewing someone else's profile → not allowed, go back to team
  useEffect(() => {
    if (isSelf && myRole === 'admin') { navigate('/team', { replace: true }); return }
    if (!isSelf && myRole !== 'admin') { navigate('/team', { replace: true }); return }
  }, [isSelf, myRole, navigate])

  useEffect(() => {
    if (profile?.skills) setLocalSkills(profile.skills)
  }, [profile?.skills])

  const allMembers2 = useSelector((s) => s.team.members)
  const managedPeers = useMemo(
    () => allMembers2.filter((m) => m.role !== 'admin' && m.role !== 'manager'),
    [allMembers2],
  )

  const roleKey = profile?.role?.toLowerCase()
  const isManager = roleKey === 'manager'
  const isWorker = roleKey === 'creator' || roleKey === 'responder'
  const roleStyle = roleBgText(profile?.role)

  const filteredIncidents = useMemo(() => {
    if (incFilter === 'Open') return userIncidents.filter((i) => i.status !== 'resolved')
    if (incFilter === 'Resolved') return userIncidents.filter((i) => i.status === 'resolved')
    return userIncidents
  }, [userIncidents, incFilter])

  const totalPages = Math.ceil(filteredIncidents.length / PAGE_SIZE)
  const pagedIncidents = filteredIncidents.slice((incPage - 1) * PAGE_SIZE, incPage * PAGE_SIZE)

  const openInCurrentWeek = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    return userIncidents.filter((i) => i.status === 'resolved' && new Date(i.resolvedAt ?? i.createdAt) > weekAgo).length
  }, [userIncidents])

  const openNow = useMemo(
    () => userIncidents.filter((i) => i.status !== 'resolved').length,
    [userIncidents],
  )

  const canEditSkills = isSelf || isAdmin

  const saveSkills = useCallback(async (updated) => {
    setSavingSkills(true)
    try {
      await api.patch(`/users/${userId}/skills`, { skills: updated })
      setLocalSkills(updated)
    } catch { /* silent */ } finally {
      setSavingSkills(false)
    }
  }, [userId])

  const handleAddSkill = () => {
    const s = newSkill.trim()
    if (!s || skills.includes(s) || skills.length >= 10) return
    const updated = [...skills, s]
    setLocalSkills(updated)
    saveSkills(updated)
    setNewSkill('')
    setAddingSkill(false)
  }

  const handleRemoveSkill = (skill) => {
    const updated = skills.filter((s) => s !== skill)
    setLocalSkills(updated)
    saveSkills(updated)
  }

  const canDelete = isAdmin && !isSelf && profile?.role !== 'admin'

  const handleDeleteMember = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return }
    setDeleting(true)
    try {
      await dispatch(deleteTeamMember(userId)).unwrap()
      navigate('/team', { replace: true })
    } catch { /* error shown inline */ } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  const handleOpenMessages = () => {
    dispatch(setActiveThreadUserId(userId))
    dispatch(fetchThread(userId))
    navigate('/messages?tab=threads')
  }

  if (!profile) return <ProfileSkeleton />

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* LEFT SIDEBAR */}
      <aside className="sticky top-4 w-full shrink-0 rounded-[10px] border border-[var(--border,#e2e8f0)] bg-white p-5 lg:w-[260px]">
        <button
          type="button"
          onClick={() => navigate('/team')}
          className="mb-4 flex items-center gap-1.5 text-[12px] font-semibold text-[var(--text-secondary,#64748b)] hover:text-[var(--accent,#4f46e5)]"
        >
          <ArrowLeft size={14} /> Team
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className="flex h-[72px] w-[72px] items-center justify-center rounded-full text-xl font-bold"
            style={{ backgroundColor: avatarBg(profile.role) }}
          >
            {profile.name?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <h2 className="mt-3 text-[18px] font-semibold text-[var(--text-primary,#1e293b)]">{profile.name}</h2>
          <span
            className={`mt-2 inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}
          >
            {profile.role}
          </span>
          <div className="mt-3 flex items-center gap-1.5 text-[13px] text-[var(--text-secondary,#64748b)]">
            <span className={`h-2 w-2 rounded-full ${
              profile.status === 'online' ? 'bg-emerald-500' : profile.status === 'away' ? 'bg-amber-400' : 'bg-slate-400'
            }`} />
            {profile.status === 'online' ? 'Online' : profile.status === 'away' ? 'Away' : 'Offline'}
          </div>
        </div>

        <div className="my-5 border-t border-[var(--border,#e2e8f0)]" />

        <dl className="flex flex-col gap-4">
          {[
            { label: 'Email', value: profile.email, icon: Mail },
            { label: 'Joined', value: formatDate(profile.createdAt), icon: Calendar },
            { label: 'Department', value: profile.department ?? '—', icon: Building2 },
            { label: 'Last active', value: profile.lastActive ? relativeTime(profile.lastActive) : '—', icon: Clock },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[var(--bg-base,#f8fafc)] text-[var(--text-secondary,#64748b)]">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary,#64748b)]">{label}</dt>
                <dd className="break-all text-[13px] font-medium text-[var(--text-primary,#1e293b)]">{value}</dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleOpenMessages}
            className="w-full rounded-[6px] border border-[var(--border,#e2e8f0)] py-2.5 text-[13px] font-semibold text-[var(--text-primary,#1e293b)] hover:bg-[var(--bg-base,#f8fafc)]"
          >
            Send message
          </button>
          {(isSelf || isAdmin) && (
            <button
              type="button"
              onClick={() => navigate('/incidents/active')}
              className="w-full rounded-[6px] bg-[var(--accent,#4f46e5)] py-2.5 text-[13px] font-semibold text-white hover:brightness-110"
            >
              Assign to incident
            </button>
          )}

          {/* Admin-only: remove account */}
          {canDelete && (
            <div className="mt-2 border-t border-[var(--border,#e2e8f0)] pt-3">
              {confirmDelete ? (
                <div className="rounded-[8px] border border-rose-200 bg-rose-50 p-3 text-center">
                  <p className="mb-2.5 text-[12px] font-semibold text-rose-700">
                    Remove <span className="font-bold">{profile.name}</span>?<br />
                    <span className="font-normal text-rose-600">This cannot be undone.</span>
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 rounded-[6px] border border-rose-200 bg-white py-1.5 text-[12px] font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteMember}
                      disabled={deleting}
                      className="flex-1 rounded-[6px] bg-rose-600 py-1.5 text-[12px] font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
                    >
                      {deleting ? 'Removing…' : 'Confirm'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleDeleteMember}
                  className="flex w-full items-center justify-center gap-2 rounded-[6px] border border-rose-200 py-2.5 text-[13px] font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 size={14} /> Remove account
                </button>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* RIGHT CONTENT */}
      <div className="min-w-0 flex-1">
        {/* Tab bar */}
        <div className="flex flex-wrap gap-4 border-b border-[var(--border,#e2e8f0)]">
          {[
            { label: 'Overview', badge: null },
            { label: 'Incidents', badge: userIncidents.length || null },
            { label: 'Notifications', badge: unreadCount || null },
          ].map(({ label, badge }) => (
            <button
              key={label}
              type="button"
              onClick={() => setActiveTab(label)}
              className={`flex items-center gap-1.5 pb-3 text-[13px] font-semibold transition-colors ${
                activeTab === label
                  ? 'border-b-2 border-[var(--accent,#4f46e5)] text-[var(--accent,#4f46e5)]'
                  : 'border-b-2 border-transparent text-[var(--text-secondary,#64748b)] hover:text-[var(--text-primary,#1e293b)]'
              }`}
            >
              {label}
              {badge ? (
                <span className="rounded-full bg-[var(--accent,#4f46e5)] px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === 'Overview' && (
          <div className="mt-6 flex flex-col gap-6">
            {isWorker && (
              <div className="grid gap-3 sm:grid-cols-3">
                <KpiCard label="Resolved this week" value={openInCurrentWeek} valueColor="var(--accent,#4f46e5)" dotClassName="bg-[var(--success,#10b981)]" />
                <KpiCard label="Avg response time" value="—" sublabel="No data yet" valueColor="var(--text-primary,#1e293b)" />
                <KpiCard label="Currently open" value={openNow} valueColor="var(--text-primary,#1e293b)" dotClassName="bg-[var(--danger,#ef4444)]" />
              </div>
            )}
            {isManager && (
              <div className="grid gap-3 sm:grid-cols-2">
                <KpiCard label="Incidents managed" value={userIncidents.length} valueColor="var(--text-primary,#1e293b)" />
                <KpiCard label="Postmortems created" value="—" valueColor="var(--text-primary,#1e293b)" />
              </div>
            )}

            {/* Skills section */}
            {isWorker && (
              <section className="rounded-[10px] border border-[var(--border,#e2e8f0)] bg-white p-5">
                <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary,#64748b)]">
                  Skills &amp; tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="flex items-center gap-1.5 rounded-full bg-[#f1f5f9] px-3 py-1 text-[12px] font-medium text-[#475569]"
                    >
                      {s}
                      {canEditSkills && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(s)}
                          className="text-slate-400 hover:text-red-500"
                          aria-label={`Remove ${s}`}
                        >
                          <X size={11} />
                        </button>
                      )}
                    </span>
                  ))}
                  {canEditSkills && !addingSkill && skills.length < 10 && (
                    <button
                      type="button"
                      onClick={() => setAddingSkill(true)}
                      className="flex items-center gap-1 rounded-full border border-dashed border-slate-300 px-3 py-1 text-[12px] text-slate-400 hover:border-[var(--accent,#4f46e5)] hover:text-[var(--accent,#4f46e5)]"
                    >
                      <Plus size={11} /> Add
                    </button>
                  )}
                  {addingSkill && (
                    <div className="flex items-center gap-1.5">
                      <input
                        autoFocus
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') { e.preventDefault(); handleAddSkill() }
                          if (e.key === 'Escape') { setAddingSkill(false); setNewSkill('') }
                        }}
                        maxLength={20}
                        placeholder="e.g. AWS"
                        className="w-20 rounded-full border border-[var(--accent,#4f46e5)] px-3 py-1 text-[12px] outline-none"
                      />
                      <button type="button" onClick={handleAddSkill} className="text-[11px] font-semibold text-[var(--accent,#4f46e5)] hover:underline">
                        Add
                      </button>
                      <button type="button" onClick={() => { setAddingSkill(false); setNewSkill('') }} className="text-slate-400">
                        <X size={12} />
                      </button>
                    </div>
                  )}
                  {skills.length === 0 && !canEditSkills && (
                    <p className="text-[13px] text-[var(--text-secondary,#64748b)]">No skills listed.</p>
                  )}
                </div>
              </section>
            )}

            {/* Manager — team section */}
            {isManager && managedPeers.length > 0 && (
              <section className="rounded-[10px] border border-[var(--border,#e2e8f0)] bg-white p-5">
                <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary,#64748b)]">
                  Team members
                </h3>
                <ul className="flex flex-col gap-2">
                  {managedPeers.slice(0, 6).map((m) => (
                    <li key={m._id ?? m.id}>
                      <button
                        type="button"
                        onClick={() => navigate(`/team/${m._id ?? m.id}`)}
                        className="flex w-full items-center justify-between rounded-[8px] bg-[var(--bg-base,#f8fafc)] px-3 py-2 hover:bg-[var(--accent-dim,#eef2ff)]"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar name={m.name} size={32} />
                          <div>
                            <p className="text-[13px] font-semibold text-[var(--text-primary,#1e293b)]">{m.name}</p>
                            <p className="text-[11px] text-[var(--text-secondary,#64748b)]">{m.role}</p>
                          </div>
                        </div>
                        <span className={`h-2 w-2 rounded-full ${m.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      </button>
                    </li>
                  ))}
                </ul>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => navigate('/team')}
                    className="mt-3 text-[12px] font-semibold text-[var(--accent,#4f46e5)] hover:underline"
                  >
                    Invite new member →
                  </button>
                )}
              </section>
            )}

            {/* Recent incidents preview */}
            {isWorker && userIncidents.length > 0 && (
              <section className="overflow-hidden rounded-[10px] border border-[var(--border,#e2e8f0)]">
                <div className="flex items-center justify-between bg-[var(--bg-base,#f8fafc)] px-4 py-3">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary,#64748b)]">
                    Recent incidents
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('Incidents')}
                    className="text-[12px] font-semibold text-[var(--accent,#4f46e5)] hover:underline"
                  >
                    View all incidents →
                  </button>
                </div>
                <table className="w-full text-[13px]">
                  <tbody className="divide-y divide-[var(--border,#e2e8f0)]">
                    {userIncidents.slice(0, 3).map((inc) => (
                      <tr
                        key={inc._id ?? inc.id}
                        className="cursor-pointer hover:bg-[var(--bg-base,#f8fafc)]"
                        onClick={() => navigate(`/workspace/${inc._id ?? inc.id}`)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <SeverityDot severity={inc.severity} />
                            <span className="font-medium text-[var(--text-primary,#1e293b)]">{inc.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3"><StatusPill status={inc.status} /></td>
                        <td className="px-4 py-3 text-[var(--text-secondary,#64748b)]">
                          {inc.resolvedAt ? formatDate(inc.resolvedAt) : 'Ongoing'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {isWorker && userIncidents.length === 0 && (
              <div className="flex h-32 items-center justify-center rounded-[10px] border border-dashed border-[var(--border,#e2e8f0)] text-[13px] text-[var(--text-secondary,#64748b)]">
                No incidents assigned yet.
              </div>
            )}
          </div>
        )}

        {/* ── INCIDENTS TAB ── */}
        {activeTab === 'Incidents' && (
          <div className="mt-6 space-y-4">
            <div className="flex gap-2">
              {['All', 'Open', 'Resolved'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => { setIncFilter(f); setIncPage(1) }}
                  className={`rounded-[6px] px-3 py-1.5 text-[12px] font-semibold ${
                    incFilter === f ? 'bg-[var(--accent-dim,#eef2ff)] text-[var(--accent,#4f46e5)]' : 'text-[var(--text-secondary,#64748b)]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="overflow-hidden rounded-[10px] border border-[var(--border,#e2e8f0)]">
              <table className="w-full text-[13px]">
                <thead className="bg-[var(--bg-base,#f8fafc)] text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary,#64748b)]">
                  <tr>
                    {['Title', 'Severity', 'Status', 'Duration', 'Date'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border,#e2e8f0)]">
                  {pagedIncidents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-[13px] text-[var(--text-secondary,#64748b)]">
                        No incidents match this filter.
                      </td>
                    </tr>
                  ) : (
                    pagedIncidents.map((inc) => {
                      const duration = inc.status === 'resolved' && inc.resolvedAt && inc.createdAt
                        ? `${Math.round((new Date(inc.resolvedAt) - new Date(inc.createdAt)) / 60000)}m`
                        : 'Ongoing'
                      return (
                        <tr
                          key={inc._id ?? inc.id}
                          className="cursor-pointer hover:bg-[var(--bg-base,#f8fafc)]"
                          onClick={() => navigate(`/workspace/${inc._id ?? inc.id}`)}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <SeverityDot severity={inc.severity} />
                              <span className="font-medium text-[var(--text-primary,#1e293b)]">{inc.title}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[11px] font-semibold capitalize text-[var(--text-secondary,#64748b)]">
                              {inc.severity}
                            </span>
                          </td>
                          <td className="px-4 py-3"><StatusPill status={inc.status} /></td>
                          <td className="px-4 py-3 text-[var(--text-secondary,#64748b)]">{duration}</td>
                          <td className="px-4 py-3 text-[var(--text-secondary,#64748b)]">{formatDate(inc.createdAt)}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between text-[12px]">
                <p className="text-[var(--text-secondary,#64748b)]">
                  Page {incPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={incPage === 1}
                    onClick={() => setIncPage((p) => p - 1)}
                    className="flex items-center gap-1 rounded-[6px] border border-[var(--border,#e2e8f0)] px-3 py-1.5 text-[var(--text-secondary,#64748b)] hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ChevronLeft size={14} /> Prev
                  </button>
                  <button
                    type="button"
                    disabled={incPage === totalPages}
                    onClick={() => setIncPage((p) => p + 1)}
                    className="flex items-center gap-1 rounded-[6px] border border-[var(--border,#e2e8f0)] px-3 py-1.5 text-[var(--text-secondary,#64748b)] hover:bg-slate-50 disabled:opacity-40"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── NOTIFICATIONS TAB ── */}
        {activeTab === 'Notifications' && (
          <div className="mt-6 space-y-4">
            {unreadCount > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-[12px] text-[var(--text-secondary,#64748b)]">{unreadCount} unread</p>
                <button
                  type="button"
                  onClick={() => dispatch(markAllNotificationsRead(userId))}
                  className="text-[12px] font-semibold text-[var(--accent,#4f46e5)] hover:underline"
                >
                  Mark all as read
                </button>
              </div>
            )}

            {notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-[10px] border border-dashed border-[var(--border,#e2e8f0)] py-16 text-center">
                <Bell className="h-8 w-8 text-slate-300" />
                <p className="text-[15px] font-semibold text-[var(--text-primary,#1e293b)]">You&apos;re all caught up</p>
                <p className="text-[13px] text-[var(--text-secondary,#64748b)]">No new assignments</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {notifications.map((n) => {
                  const dotColor = {
                    critical: 'bg-red-500',
                    high: 'bg-amber-500',
                    medium: 'bg-indigo-500',
                    info: 'bg-emerald-500',
                  }[n.type] ?? 'bg-indigo-500'

                  return (
                    <div
                      key={n._id}
                      className={`flex items-start gap-3 rounded-[8px] border p-4 transition-colors ${
                        !n.isRead
                          ? 'border-l-[3px] border-[var(--accent-border,#c7d2fe)] bg-[var(--accent-dim,#eef2ff)]'
                          : 'border-l-[3px] border-transparent border-[var(--border,#e2e8f0)] bg-white'
                      }`}
                    >
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {n.incidentId && (
                              <span className="rounded-full bg-[var(--accent-dim,#eef2ff)] px-2 py-0.5 text-[10px] font-semibold text-[var(--accent,#4f46e5)]">
                                INC
                              </span>
                            )}
                            <p className="text-[13px] font-semibold text-[var(--text-primary,#1e293b)]">{n.title}</p>
                          </div>
                          <span className="shrink-0 text-[11px] text-slate-400">
                            {relativeTime(n.createdAt)}
                          </span>
                        </div>
                        {n.body && (
                          <p className="mt-1 text-[12px] text-[var(--text-secondary,#64748b)]">{n.body}</p>
                        )}
                        {n.incidentId && (
                          <button
                            type="button"
                            onClick={() => navigate(`/workspace/${n.incidentId}`)}
                            className="mt-2 rounded-[6px] bg-[var(--accent,#4f46e5)] px-3 py-1 text-[11px] font-semibold text-white hover:brightness-110"
                          >
                            Open workspace →
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
