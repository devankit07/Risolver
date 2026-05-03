import { NavLink, useLocation } from 'react-router-dom'
import { Avatar } from './Avatar.jsx'

/** Design token — sidebar surface */
const SIDEBAR_BG = 'var(--sidebar-bg, #3730a3)'
const W_SIDEBAR = 220

const NAV = (workspaceTo) => [
  { to: '/dashboard', label: 'Dashboard', icon: GridIcon, prefix: null },
  { to: '/messages', label: 'Messages', icon: ChatIcon, prefix: '/messages' },
  { to: '/team', label: 'Team', icon: PeopleIcon, prefix: '/team' },
  { to: '/reports', label: 'Reports', icon: DocIcon, prefix: '/reports' },
  { to: workspaceTo, label: 'Workspace', icon: ToolsIcon, prefix: '/workspace' },
]

/**
 * Fixed 220px workspace sidebar — labels always visible.
 *
 * @param {{ user?: { name?: string, email?: string, role?: string }, logoSrc?: string, workspaceTo?: string }} props
 */
export function AppSidebar({ user, logoSrc = '/favi.png', workspaceTo = '/workspace/INC-041' }) {
  const { pathname } = useLocation()
  const items = NAV(workspaceTo)
  const roleLabel = user?.role ?? 'Member'

  return (
    <div
      className="box-border z-40 hidden h-full min-h-0 shrink-0 flex-col pt-6 pb-0 md:flex md:flex-col"
      style={{ width: W_SIDEBAR }}
    >
      <header className="flex shrink-0 items-center gap-2.5 px-1 pb-3">
        <NavLink
          to="/dashboard"
          end
          title="Dashboard"
          className={({ isActive }) =>
            [
              'flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-white p-1 shadow-sm ring-1 ring-white/30 transition-shadow',
              isActive ? 'ring-2 ring-white' : 'hover:ring-white/60',
            ].join(' ')
          }
        >
          <img src={logoSrc} alt="" width={36} height={36} className="h-9 w-9 object-contain" decoding="async" />
        </NavLink>
        <div className="min-w-0">
          <span className="block truncate text-lg font-bold leading-tight tracking-tight text-white">Resolver</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75">
            Incident response
          </span>
        </div>
      </header>

      <div
        className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-tr-[20px] border border-white/10 shadow-lg"
        style={{ background: SIDEBAR_BG }}
      >
        <aside className="flex min-h-0 flex-1 flex-col overflow-hidden" style={{ background: SIDEBAR_BG }}>
          <nav className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain px-3 pb-4 pt-5">
            {items.map(({ to, label, icon: Icon, prefix }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) => {
                  const active = prefix ? pathname.startsWith(prefix) : isActive
                  return [
                    'group flex items-center gap-3 rounded-[8px] px-3 py-3 text-[13px] font-semibold transition-colors border',
                    active
                      ? 'border-white bg-white text-[#312e81] shadow-md'
                      : 'border-white/10 bg-white/10 text-white hover:bg-white/20',
                  ].join(' ')
                }}
              >
                <Icon size={18} />
                <span className="truncate">{label}</span>
              </NavLink>
            ))}
          </nav>

          <div
            className="mt-auto flex items-center gap-3 border-t border-white/15 px-3 py-3"
            style={{ borderColor: 'rgba(255,255,255,0.15)' }}
          >
            <Avatar
              name={user?.name ?? 'User'}
              size={40}
              colorOverride="#ffffff"
              foreground="var(--sidebar-bg, #3730a3)"
              className="ring-2 ring-white/40 shrink-0 shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold text-white">{user?.name ?? 'User'}</span>
              <span className="mt-1 inline-flex rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/90">
                {roleLabel}
              </span>
            </div>
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
