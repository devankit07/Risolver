import { useState } from 'react'

/**
 * Light shell topbar — indigo/black only; avatar lives in sidebar.
 *
 * @param {{
 *   title: string,
 *   onSearch?: (v: string) => void,
 *   onCreateIncident?: () => void,
 *   notificationCount?: number,
 * }} props
 */
export function AppTopbar({ title, onSearch, onCreateIncident, notificationCount = 0 }) {
  const [q, setQ] = useState('')

  return (
    <header
      className="flex items-center gap-3 px-5 shrink-0 z-30 border-b border-slate-200 bg-white"
      style={{
        height: 52,
        position: 'sticky',
        top: 0,
      }}
    >
      <span className="text-[14px] font-semibold shrink-0 text-[#0f172a] tracking-tight">{title}</span>

      <div className="flex-1 max-w-md mx-auto">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            onSearch?.(e.target.value)
          }}
          placeholder="Search incidents..."
          className="w-full h-9 px-3.5 text-[13px] rounded-full outline-none border border-slate-200 bg-slate-50 text-[#0f172a] placeholder:text-slate-400 focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20"
        />
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <TopbarBtn onClick={onCreateIncident} title="New incident">
          <PlusIcon />
        </TopbarBtn>
        <TopbarBtn title="Filter">
          <FilterIcon />
        </TopbarBtn>
        <TopbarBtn title="Export">
          <DownloadIcon />
        </TopbarBtn>
        <TopbarBtn title="Notifications" className="relative">
          <BellIcon />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#0f172a] ring-2 ring-white" />
          )}
        </TopbarBtn>
      </div>
    </header>
  )
}

function TopbarBtn({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`relative flex items-center justify-center w-9 h-9 rounded-lg transition-colors border border-slate-200 bg-white text-[#0f172a] hover:bg-slate-50 hover:border-[#4f46e5]/40 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
      <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
function FilterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
      <path d="M2 3h10M4 7h6M6 11h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
      <path d="M7 2v7M4.5 6.5L7 9l2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function BellIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 1.5a4 4 0 00-4 4v2.5l-1 1.5h10l-1-1.5V5.5a4 4 0 00-4-4z"
        stroke="currentColor"
        strokeWidth="1.35"
      />
      <path d="M5.5 10.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  )
}
