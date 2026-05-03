import { Avatar } from './Avatar.jsx'
import { StatusBadge } from './StatusBadge.jsx'

const ROLE_DARK = {
  admin:   { bg: '#00e87a22', color: '#00e87a', border: '#00e87a33' },
  manager: { bg: '#00e87a22', color: '#00e87a', border: '#00e87a33' },
  engineer:{ bg: '#378add22', color: '#378add', border: '#378add33' },
  devops:  { bg: '#378add22', color: '#378add', border: '#378add33' },
  viewer:  { bg: '#44444422', color: '#888',    border: '#44444433' },
}

const ROLE_LIGHT = {
  admin:   { bg: '#f5f3ff', color: '#6366f1', border: '#ddd6fe' },
  manager: { bg: '#f5f3ff', color: '#6366f1', border: '#ddd6fe' },
  engineer:{ bg: '#f9fafb', color: '#374151', border: '#e5e7eb' },
  devops:  { bg: '#f9fafb', color: '#374151', border: '#e5e7eb' },
  viewer:  { bg: '#f9fafb', color: '#374151', border: '#e5e7eb' },
}

/**
 * @param {{
 *   member: object,
 *   onClick?: () => void,
 *   onViewProfile?: () => void,
 *   variant?: 'dark' | 'light',
 * }} props
 */
export function TeamMemberRow({ member, onClick, onViewProfile, variant = 'dark' }) {
  const roleKey = member.role?.toLowerCase() ?? 'viewer'
  const rs = (variant === 'light' ? ROLE_LIGHT : ROLE_DARK)[roleKey] ?? (variant === 'light' ? ROLE_LIGHT.viewer : ROLE_DARK.viewer)

  const L = variant === 'light'
  const rowHover = L ? 'hover:bg-slate-50' : 'hover:bg-[#0d0d0d]'

  return (
    <tr
      onClick={onClick}
      className={`border-b cursor-pointer border-l-2 border-l-transparent transition-colors hover:border-l-indigo-500 ${L ? 'hover:bg-[#f8fafc]' : ''} ${rowHover} ${L ? 'border-slate-200' : 'border-[#1a1a1a]'}`}
    >
      <td className="py-3 pl-4 pr-2">
        <div className="flex items-center gap-2.5">
          <Avatar name={member.name} size={28} />
          <div className="flex flex-col">
            <span className={`text-[13px] font-semibold ${L ? 'text-[#0f172a]' : ''}`} style={L ? undefined : { color: '#f0f0f0' }}>
              {member.name}
            </span>
            <span className={`text-[11px] ${L ? 'text-slate-500' : ''}`} style={L ? undefined : { color: '#555' }}>
              {member.email}
            </span>
          </div>
        </div>
      </td>
      <td className="py-3 px-2">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border"
          style={{ background: rs.bg, color: rs.color, borderColor: rs.border }}
        >
          {member.role}
        </span>
      </td>
      <td className="py-3 px-2">
        <StatusBadge variant={L ? 'light' : 'dark'} status={member.status ?? 'offline'} />
      </td>
      <td className="py-3 px-2">
        <span className={`text-[13px] ${L ? 'text-slate-600' : ''}`} style={L ? undefined : { color: '#888' }}>
          {member.incidentsThisWeek ?? 0}
        </span>
      </td>
      <td className="py-3 px-2">
        <span className={`text-[11px] ${L ? 'text-slate-500' : ''}`} style={L ? undefined : { color: '#555' }}>
          {member.lastActive ?? '—'}
        </span>
      </td>
      <td className="py-3 px-2">
        <span className={`text-[11px] ${L ? 'text-slate-500' : ''}`} style={L ? undefined : { color: '#888' }}>
          {member.joinedOn ?? '—'}
        </span>
      </td>
      <td className="py-3 px-2">
        <span className={`text-[11px] ${L ? 'text-slate-500' : ''}`} style={L ? undefined : { color: '#888' }}>
          {member.department ?? '—'}
        </span>
      </td>
      <td className="py-3 px-2">
        {member.onCall ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Yes
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            No
          </span>
        )}
      </td>
      <td className="py-3 pl-2 pr-4">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onViewProfile?.()
          }}
          className={`text-[11px] px-3 py-1.5 rounded-lg border font-medium transition-colors ${
            L
              ? 'border-slate-200 bg-white text-[#4f46e5] hover:border-[#4f46e5]/40'
              : ''
          }`}
          style={L ? undefined : { background: '#111', borderColor: '#1f1f1f', color: '#888' }}
        >
          View profile
        </button>
      </td>
    </tr>
  )
}
