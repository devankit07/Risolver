import { Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AppSidebar, AppTopbar } from '@resolver/ui'

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
  '/workspace': {
    title: 'Work',
    subtitle: 'Incident workspace and timeline.',
    breadcrumb: ['Home', 'Workspace'],
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
  const user = useSelector((s) => s.auth.user)

  const meta = metaForPath(pathname)
  const isDashboard = pathname === '/dashboard' || pathname === '/'
  const firstName = user?.name?.split(/\s+/)[0] ?? 'there'

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      <AppSidebar user={user} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0 px-4 pt-4 md:px-6 md:pt-6">
          <AppTopbar
            mode={isDashboard ? 'welcome' : 'page'}
            title={meta.title}
            welcomeName={firstName}
            subtitle={isDashboard ? undefined : meta.subtitle}
            breadcrumb={isDashboard ? [] : meta.breadcrumb}
            notificationCount={3}
            searchPlaceholder="Search incidents…"
          />
        </div>
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-6 md:px-6 md:pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
