import { NavLink, useLocation } from 'react-router-dom'
import { Avatar } from './Avatar.jsx'

/** Indigo + white palette aligned with Resolver marketing site */
const SIDEBAR_BG = '#4338ca'
const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: GridIcon, prefix: null },
  { to: '/messages', label: 'Messages', icon: ChatIcon, prefix: '/messages' },
  { to: '/team', label: 'Team manage', icon: PeopleIcon, prefix: '/team' },
  { to: '/reports', label: 'Reports', icon: DocIcon, prefix: '/reports' },
  { to: '/workspace/INC-041', label: 'Work page', icon: ToolsIcon, prefix: '/workspace' },
]

/**
 * @param {{ user?: { name: string, email?: string } }} props
 */
export function AppSidebar({ user }) {
  const { pathname } = useLocation()

  return (
    <aside
      className="hidden md:flex flex-col shrink-0 z-40 w-[248px] min-h-screen sticky top-0 rounded-tr-[28px] shadow-lg shadow-indigo-950/10 overflow-hidden"
      style={{ background: SIDEBAR_BG }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-5">
        <span
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white/95 text-[#4338ca] font-bold text-sm shadow-sm"
          aria-hidden
        >
          R
        </span>
        <div className="flex flex-col min-w-0">
          <span className="text-[15px] font-bold tracking-tight text-white leading-tight">Resolver</span>
          <span className="text-[11px] text-white/70 truncate">Incident response</span>
        </div>
      </div>

      {/* Box-style nav (ref: Goodle-style stacked cards) */}
      <nav className="flex flex-col gap-2.5 px-3 flex-1 pb-4">
        {NAV.map(({ to, label, icon: Icon, prefix }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => {
              const active = prefix ? pathname.startsWith(prefix) : isActive
              return [
                'group flex items-center gap-3 rounded-xl px-4 py-3.5 text-[13px] font-semibold transition-all duration-150 border',
                active
                  ? 'bg-white text-[#312e81] border-white shadow-md'
                  : 'bg-white/10 text-white border-white/10 hover:bg-white/20 hover:border-white/25',
              ].join(' ')
            }}
          >
            <span className="opacity-90 group-[.bg-white]:opacity-100">
              <Icon size={18} />
            </span>
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Profile — bottom of sidebar */}
      <div
        className="mt-auto px-3 pt-3 pb-5 border-t flex items-center gap-3"
        style={{ borderColor: 'rgba(255,255,255,0.15)' }}
      >
        <Avatar
          name={user?.name ?? 'User'}
          size={40}
          colorOverride="#ffffff"
          foreground="#4338ca"
          className="ring-2 ring-white/50 shrink-0 shadow-sm"
        />
        <div className="flex flex-col min-w-0">
          <span className="text-[13px] font-semibold text-white truncate">{user?.name ?? 'User'}</span>
          <span className="text-[11px] text-white/65 truncate">{user?.email ?? ''}</span>
        </div>
      </div>
    </aside>
  )
}

function GridIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="shrink-0">
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".85" />
      <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".85" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".85" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".85" />
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
      <path d="M3 1.5h7l3 3v10a1 1 0 01-1 1H3a1 1 0 01-1-1v-12a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
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
