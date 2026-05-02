import { Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AppSidebar, AppTopbar } from '@resolver/ui'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/team': 'Team manage',
  '/messages': 'Messages',
  '/reports': 'Reports',
  '/workspace': 'Work',
}

export default function AppLayout() {
  const { pathname } = useLocation()
  const user = useSelector((s) => s.auth.user)

  const title =
    Object.entries(PAGE_TITLES).find(([k]) => pathname.startsWith(k))?.[1] ?? 'Resolver'

  return (
    <div className="flex min-h-screen bg-white">
      <AppSidebar user={user} />

      <div className="flex flex-col flex-1 min-w-0 bg-slate-50/80">
        <AppTopbar title={title} notificationCount={3} />
        <main className="flex-1 overflow-auto p-5 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
