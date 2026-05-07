import { useEffect, useState, useCallback } from 'react'
import { Outlet, useLocation, NavLink, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { AppSidebar, AppTopbar, MotionPage } from '@resolver/ui'
import { LayoutDashboard, MessageSquare, Users, FileText, Briefcase } from 'lucide-react'
import { clearAuth } from '../store/authSlice.js'
import FloatingNotifications from '../components/FloatingNotifications.jsx'
import api from '../services/api.js'

const PAGE_META = {
  '/dashboard': {
    title: 'Dashboard',
    subtitle: 'Monitor incidents, throughput, and team readiness.',
    breadcrumb: ['Home', 'Dashboard'],
  },
  '/team': {
    title: 'Team manage',
    subtitle: 'Roster, roles, and on-call coverage.',
    breadcrumb: ['Home', 'Team'],
  },
  '/messages': {
    title: 'Messages',
    subtitle: 'Incident threads and team coordination.',
    breadcrumb: ['Home', 'Messages'],
  },
  '/reports': {
    title: 'Reports',
    subtitle: 'Postmortems and shared summaries.',
    breadcrumb: ['Home', 'Reports'],
  },
  '/incidents/active': {
    title: 'Active incidents',
    subtitle: 'Open and in-progress incidents across your organization.',
    breadcrumb: ['Home', 'Active incidents'],
  },
  '/workspace': {
    title: 'Work',
    subtitle: 'Incident workspace and timeline.',
    breadcrumb: ['Home', 'Workspace'],
  },
  '/projects': {
    title: 'Projects',
    subtitle: "Manage and track your organization's projects.",
    breadcrumb: ['Home', 'Projects'],
  },
}

function metaForPath(pathname) {
  const entry = Object.entries(PAGE_META).find(([k]) => pathname.startsWith(k))
  return (
    entry?.[1] ?? {
      title: 'Resolver',
      subtitle: undefined,
      breadcrumb: ['Home'],
    }
  )
}

export default function AppLayout() {
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.user)
  const token = useSelector((s) => s.auth.token)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true)
    const uid = user?._id ?? user?.id
    if (uid) {
      void api.patch(`/users/${uid}/status`, { status: 'offline' }).catch(() => {})
    }
    dispatch(clearAuth())
    localStorage.removeItem('manage_token')
    localStorage.removeItem('manage_user')
    localStorage.removeItem('resolver_token')
    localStorage.removeItem('resolver_user')
    window.location.href =
      (import.meta.env.VITE_WEBSITE_URL || (import.meta.env.DEV ? 'http://localhost:3000' : '')) + '/?logout=true'
  }, [user, dispatch])

  /** @type {{ id: string }[]} */
  const incidents = useSelector((s) => s.incidents?.list ?? [])
  const firstWorkspaceId =
    incidents.find((/** @type {{ status: string }} */ i) => i.status !== 'resolved')?.id ?? incidents[0]?.id
  const workspaceTo = firstWorkspaceId ? `/workspace/${firstWorkspaceId}` : '/workspace'

  const [incidentsListSearch, setIncidentsListSearch] = useState('')
  useEffect(() => {
    if (!pathname.startsWith('/incidents/active')) setIncidentsListSearch('')
  }, [pathname])

  // Redirect to login if not authenticated (after all hooks).
  // Allow admin/manager website sessions through via resolver_token.
  const hasToken = (() => {
    if (token || localStorage.getItem('manage_token')) return true
    try {
      const u = JSON.parse(localStorage.getItem('resolver_user') || 'null')
      if ((u?.role?.toLowerCase() === 'admin' || u?.role?.toLowerCase() === 'manager') && localStorage.getItem('resolver_token')) return true
    } catch { /* ignore */ }
    return false
  })()

  if (isLoggingOut) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg-base,#f8fafc)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--accent,#4f46e5)] border-t-transparent" />
          <p className="text-[13px] font-medium text-slate-500">Signing out...</p>
        </div>
      </div>
    )
  }

  if (!user && !hasToken) {
    if (pathname === '/') {
      const websiteUrl = import.meta.env.VITE_WEBSITE_URL
      if (websiteUrl) {
        window.location.href = websiteUrl
        return null
      }
    }
    return <Navigate to="/login" replace />
  }

  const meta = metaForPath(pathname)
  const isDashboard = pathname === '/dashboard' || pathname === '/'
  const firstName = user?.name?.split(/\s+/)[0] ?? 'there'
  const isActiveIncidentsPage = pathname.startsWith('/incidents/active')

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-base,#f8fafc)]">
      <FloatingNotifications />
      <AppSidebar user={user} workspaceTo={workspaceTo} onLogout={handleLogout} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden pb-14 md:pb-0">
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-6 pt-4 md:px-6 md:pb-8 md:pt-6">
          <AppTopbar
            mode={isDashboard ? 'welcome' : 'page'}
            title={meta.title}
            welcomeName={firstName}
            welcomeOrganizationName={user?.organizationName}
            subtitle={isDashboard ? undefined : meta.subtitle}
            breadcrumb={isDashboard ? [] : meta.breadcrumb}
            notificationCount={3}
            searchPlaceholder="Search incidents…"
            onSearch={isActiveIncidentsPage ? setIncidentsListSearch : undefined}
          />
          <MotionPage>
            <Outlet context={{ incidentsListSearch }} />
          </MotionPage>
        </main>
      </div>

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-around border-t border-[var(--border,#e2e8f0)] bg-white shadow-[0_-2px_10px_rgba(15,23,42,0.06)] md:hidden"
        aria-label="Primary"
      >
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${isActive ? 'text-[var(--accent,#4f46e5)]' : 'text-slate-500'}`
          }
        >
          <LayoutDashboard className="h-5 w-5" />
          Home
        </NavLink>
        <NavLink
          to="/messages"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${isActive ? 'text-[var(--accent,#4f46e5)]' : 'text-slate-500'}`
          }
        >
          <MessageSquare className="h-5 w-5" />
          Chat
        </NavLink>
        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${isActive ? 'text-[var(--accent,#4f46e5)]' : 'text-slate-500'}`
          }
        >
          <Briefcase className="h-5 w-5" />
          Projects
        </NavLink>
        <NavLink
          to="/team"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${isActive ? 'text-[var(--accent,#4f46e5)]' : 'text-slate-500'}`
          }
        >
          <Users className="h-5 w-5" />
          Team
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${isActive ? 'text-[var(--accent,#4f46e5)]' : 'text-slate-500'}`
          }
        >
          <FileText className="h-5 w-5" />
          Reports
        </NavLink>
        <NavLink
          to={workspaceTo}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${isActive ? 'text-[var(--accent,#4f46e5)]' : 'text-slate-500'}`
          }
        >
          <Briefcase className="h-5 w-5" />
          Work
        </NavLink>
      </nav>
    </div>
  )
}
