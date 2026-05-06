import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Avatar } from './Avatar.jsx'

/** Design token — sidebar surface */
const SIDEBAR_BG = 'var(--sidebar-bg, #3730a3)'
const NAV = (workspaceTo) => [
  { to: '/dashboard', label: 'Dashboard', icon: GridIcon, prefix: null },
  { to: '/projects', label: 'Projects', icon: BriefcaseIcon, prefix: '/projects' },
  { to: '/messages', label: 'Messages', icon: ChatIcon, prefix: '/messages' },
  { to: '/team', label: 'Team', icon: PeopleIcon, prefix: '/team' },
  { to: '/incidents/active', label: 'Incidents', icon: AlertIncidentsIcon, prefix: '/incidents' },
  { to: '/reports', label: 'Reports', icon: DocIcon, prefix: '/reports' },
  { to: workspaceTo, label: 'Workspace', icon: ToolsIcon, prefix: '/workspace' },
]

/**
 * Icon rail (72px) that expands to 220px on hover with labels + profile text.
 *
 * @param {{ user?: { name?: string, email?: string, role?: string } | null, logoSrc?: string, workspaceTo?: string, onLogout?: () => void }} props
 */
const HOVER_LEAVE_MS = 140

function formatRoleLabel(role) {
  if (!role || typeof role !== 'string') return 'Member'
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
}

export function AppSidebar({ user, logoSrc = '/favi.png', workspaceTo = '/dashboard', onLogout }) {
  const { pathname } = useLocation()
  const items = NAV(workspaceTo)
  const roleLabel = formatRoleLabel(user?.role)

  const [open, setOpen] = useState(false)
  const leaveTimer = useRef(null)

  useEffect(() => {
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current)
    }
  }, [])

  const onSidebarEnter = () => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current)
      leaveTimer.current = null
    }
    setOpen(true)
  }

  const onSidebarLeave = () => {
    leaveTimer.current = setTimeout(() => setOpen(false), HOVER_LEAVE_MS)
  }

  return (
    <div
      onMouseEnter={onSidebarEnter}
      onMouseLeave={onSidebarLeave}
      className={`box-border z-40 hidden h-full min-h-0 shrink-0 flex-col overflow-x-hidden pt-6 pb-0 transition-[width] duration-300 ease-out md:flex md:flex-col ${open ? 'w-[220px]' : 'w-[72px]'}`}
    >
      <header className="flex min-w-0 shrink-0 items-center gap-2 px-1.5 pb-3">
        <NavLink
          to="/dashboard"
          end
          title="Dashboard"
          className={({ isActive }) =>
            [
              'flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-white p-1 shadow-sm ring-1 ring-slate-200/80 transition-shadow',
              isActive ? 'ring-2 ring-[var(--accent,#4f46e5)]' : 'hover:ring-slate-300',
            ].join(' ')
          }
        >
          <img src={logoSrc} alt="" width={36} height={36} className="h-9 w-9 object-contain" decoding="async" />
        </NavLink>
        <div
          className={`min-w-0 overflow-hidden transition-[max-width,opacity,transform] duration-300 ease-out ${open ? 'max-w-[200px] translate-x-0 opacity-100' : 'max-w-0 -translate-x-1 opacity-0'}`}
          aria-hidden={!open}
        >
          <span className="block truncate text-lg font-bold leading-tight tracking-tight text-slate-900">Resolver</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Incident response</span>
        </div>
      </header>

      <div
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-tr-[20px] border border-white/10 shadow-lg"
        style={{ background: SIDEBAR_BG }}
      >
        <aside className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden" style={{ background: SIDEBAR_BG }}>
          <nav
            className={`flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pb-4 pt-5 transition-[padding,gap] duration-300 ease-out ${open ? 'gap-2 px-3' : 'gap-1 px-2'}`}
          >
            {items.map(({ to, label, icon: Icon, prefix }) => (
              <NavLink
                key={label}
                to={to}
                title={label}
                className={({ isActive }) => {
                  const active = prefix ? pathname.startsWith(prefix) : isActive
                  return [
                    'flex min-w-0 items-center rounded-[8px] py-3 text-[13px] font-semibold transition-all duration-200 border overflow-hidden',
                    open ? 'justify-start gap-3 px-3' : 'justify-center gap-0 px-2',
                    active
                      ? 'border-white bg-white text-[#312e81] shadow-md'
                      : 'border-white/10 bg-white/10 text-white hover:bg-white/20',
                  ].join(' ')
                }}
              >
                <Icon size={18} className="shrink-0" />
                <span
                  className={`min-w-0 flex-1 overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-300 ease-out ${open ? 'max-w-[180px] translate-x-0 opacity-100' : 'max-w-0 translate-x-[-4px] opacity-0'}`}
                >
                  {label}
                </span>
              </NavLink>
            ))}
          </nav>

          <div
            className={`mt-auto flex min-w-0 flex-col border-t border-white/15 transition-[padding] duration-300 ease-out ${open ? 'px-3 py-3' : 'px-2 py-3'}`}
            style={{ borderColor: 'rgba(255,255,255,0.15)' }}
          >
            <div className={`flex min-w-0 items-center transition-[gap] duration-300 ease-out ${open ? 'gap-3' : 'gap-2'}`}>
              <Avatar
                name={user?.name ?? 'User'}
                size={40}
                colorOverride="#ffffff"
                foreground="var(--sidebar-bg, #3730a3)"
                className="ring-2 ring-white/40 shrink-0 shadow-sm"
              />
              <div
                className={`min-w-0 flex-1 overflow-hidden transition-[max-width,opacity,transform] duration-300 ease-out ${open ? 'max-w-[200px] translate-x-0 opacity-100' : 'max-w-0 translate-x-[-4px] opacity-0'}`}
                aria-hidden={!open}
              >
                <span className="block truncate text-[13px] font-semibold text-white">{user?.name ?? 'User'}</span>
                {user?.email ? (
                  <span className="mt-0.5 block truncate text-[11px] font-normal text-white/80" title={user.email}>
                    {user.email}
                  </span>
                ) : null}
                <span className="mt-1 inline-flex rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/90">
                  {roleLabel}
                </span>
              </div>
            </div>
            {onLogout && open && (
              <button
                type="button"
                onClick={onLogout}
                className="mt-3 w-full rounded-[6px] border border-white/20 py-1.5 text-[11px] font-semibold text-white/70 transition hover:border-white/40 hover:bg-white/10 hover:text-white"
              >
                Sign out
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

function GridIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="shrink-0">
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".9" />
      <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".9" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".9" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".9" />
    </svg>
  )
}

function PeopleIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="shrink-0">
      <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M1 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M15 13c0-2.21-1.34-4-3-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function ChatIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="shrink-0">
      <rect x="1" y="2" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4 14l3-3h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Open / active incidents — matches other nav icons (stroke, 16×16). */
function AlertIncidentsIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden>
      <path
        d="M8 2.2l5.8 10.4a1 1 0 01-.87 1.4H3.07a1 1 0 01-.87-1.4L8 2.2z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path d="M8 6v3.2M8 11.35v.01" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  )
}

function DocIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path
        d="M3 1.5h7l3 3v10a1 1 0 01-1 1H3a1 1 0 01-1-1v-12a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M10 1.5v3h3M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function ToolsIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path
        d="M10.5 2a3.5 3.5 0 00-3.4 4.3L2 11.5 2 14l2.5 0 5.2-5.1A3.5 3.5 0 1010.5 2z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BriefcaseIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="shrink-0">
      <rect x="2" y="4" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.35" />
      <path d="M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.35" />
      <path d="M2 8h12" stroke="currentColor" strokeWidth="1.35" />
    </svg>
  )
}

