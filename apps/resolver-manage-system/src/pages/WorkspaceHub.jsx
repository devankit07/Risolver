import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'

/**
 * Entry point for "Workspace" when no incident id is in the URL.
 * Redirects to the first open/incident workspace when data exists; otherwise shows an empty state.
 */
export default function WorkspaceHub() {
  const navigate = useNavigate()
  const list = useSelector((/** @type {any} */ s) => s.incidents?.list ?? [])

  const targetId = useMemo(() => {
    const active = list.find((/** @type {{ status: string }} */ i) => i.status !== 'resolved')
    return active?.id ?? list[0]?.id
  }, [list])

  if (targetId) {
    return <Navigate to={`/workspace/${targetId}`} replace />
  }

  return (
    <div className="mt-4 flex max-w-lg flex-col gap-4 md:mt-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary,#1e293b)] sm:text-2xl">Workspace</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-secondary,#64748b)]">
          Open an incident to use the war room, timeline, and AI triage. There are no incidents in your organization yet.
        </p>
      </div>
      <button
        type="button"
        onClick={() => navigate('/incidents/active')}
        className="w-fit rounded-[8px] bg-[var(--accent,#4f46e5)] px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:brightness-110"
      >
        Go to active incidents
      </button>
    </div>
  )
}
