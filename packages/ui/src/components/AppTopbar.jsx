import { useState } from 'react'
import { Search, Plus, Filter, Download, Bell, ChevronRight } from 'lucide-react'

/**
 * Workspace-style header (webfudge-inspired): glass surface, light title, search + tool actions.
 *
 * @param {{
 *   mode?: 'welcome' | 'page',
 *   title?: string,
 *   welcomeName?: string,
 *   welcomeOrganizationName?: string,
 *   subtitle?: string,
 *   breadcrumb?: string[],
 *   onSearch?: (v: string) => void,
 *   onCreateIncident?: () => void,
 *   onFilter?: () => void,
 *   onExport?: () => void,
 *   onNotifications?: () => void,
 *   notificationCount?: number,
 *   searchPlaceholder?: string,
 * }} props
 */
export function AppTopbar({
  mode = 'page',
  title = 'Dashboard',
  welcomeName = 'there',
  welcomeOrganizationName,
  subtitle,
  breadcrumb = [],
  onSearch,
  onCreateIncident,
  onFilter,
  onExport,
  onNotifications,
  notificationCount = 0,
  searchPlaceholder = 'Search incidents…',
}) {
  const [q, setQ] = useState('')

  const formattedDate =
    subtitle ??
    new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  const showBreadcrumb = mode === 'page' && breadcrumb.length > 0
  const headline =
    mode === 'welcome' ? `Welcome, ${welcomeName}` : title

  return (
    <header className="mb-4 shrink-0 z-30 w-full min-w-0">
      <div
        className="rounded-xl border border-white/40 bg-white/90 p-5 shadow-[0_3px_20px_rgba(15,23,42,0.08),0_1px_3px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-6"
        style={{ boxShadow: '0 3px 20px rgba(15,23,42,0.08), 0 1px 3px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.8)' }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
          <div className="min-w-0 flex-1">
            {showBreadcrumb && (
              <nav className="mb-1.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500" aria-label="Breadcrumb">
                {breadcrumb.map((crumb, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />}
                    <span
                      className={
                        i === breadcrumb.length - 1
                          ? 'font-medium text-slate-800'
                          : 'text-slate-500'
                      }
                    >
                      {crumb}
                    </span>
                  </span>
                ))}
              </nav>
            )}
            <h1
              className="text-3xl font-light leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-[2.5rem] md:leading-[1.1]"
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              {headline}
            </h1>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 md:text-[0.95rem]">
              {mode === 'welcome' ? (
                <>
                  <span>{formattedDate}</span>
                  {welcomeOrganizationName ? (
                    <>
                      <span className="text-slate-300" aria-hidden>
                        ·
                      </span>
                      <span className="font-medium text-slate-600">{welcomeOrganizationName}</span>
                    </>
                  ) : null}
                </>
              ) : (
                subtitle ?? 'Monitor incidents, your team, and response health.'
              )}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:shrink-0">
            <div className="relative w-full min-w-0 sm:max-w-xs lg:w-64">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                strokeWidth={2}
                aria-hidden
              />
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                  onSearch?.(e.target.value)
                }}
                placeholder={searchPlaceholder}
                className="h-10 w-full rounded-xl border border-slate-200/80 bg-white/80 pl-10 pr-3 text-sm text-slate-900 shadow-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:shadow-md focus:ring-2 focus:ring-indigo-500/20"
                type="search"
                autoComplete="off"
              />
            </div>

            <div className="flex items-center justify-end gap-2 sm:shrink-0">
              <TopbarAction onClick={onCreateIncident} label="New incident" accent>
                <Plus className="h-5 w-5" strokeWidth={2} />
              </TopbarAction>
              <TopbarAction label="Filter" onClick={onFilter}>
                <Filter className="h-5 w-5 text-slate-600" strokeWidth={2} />
              </TopbarAction>
              <TopbarAction label="Export" onClick={onExport}>
                <Download className="h-5 w-5 text-slate-600" strokeWidth={2} />
              </TopbarAction>
              <TopbarAction label="Notifications" onClick={onNotifications} className="relative">
                <Bell className="h-5 w-5 text-slate-600" strokeWidth={2} />
                {notificationCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </TopbarAction>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function TopbarAction({ children, onClick, label, className = '', accent = false }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={[
        'inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200',
        accent
          ? 'border-indigo-200/80 bg-indigo-50 text-indigo-600 shadow-sm hover:border-indigo-300 hover:bg-indigo-100/80'
          : 'border-slate-200/80 bg-white/90 text-slate-800 shadow-sm hover:border-slate-300 hover:bg-slate-50',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}
