/** @typedef {{ title: string, id: string }} DocLink */
/** @typedef {{ section: string, items: DocLink[] }} DocSection */

/** @type {DocSection[]} */
export const DOC_NAV_SECTIONS = [
  {
    section: 'Getting started',
    items: [
      { title: 'What is Resolver?', id: 'what-is-resolver' },
      { title: 'Quick start', id: 'quick-start' },
      { title: 'Create your organisation', id: 'create-organisation' },
    ],
  },
  {
    section: 'Incidents',
    items: [
      { title: 'Creating an incident', id: 'creating-an-incident' },
      { title: 'Managing incidents', id: 'managing-incidents' },
      { title: 'Assigning responders', id: 'assigning-responders' },
      { title: 'Live updates', id: 'live-updates' },
    ],
  },
  {
    section: 'AI features',
    items: [
      { title: 'Incident triage', id: 'incident-triage' },
      { title: 'AI suggestions', id: 'ai-suggestions' },
      { title: 'Postmortem generation', id: 'postmortem-generation' },
    ],
  },
  {
    section: 'Roles & permissions',
    items: [{ title: 'Overview', id: 'roles-permissions' }],
  },
  {
    section: 'Public status page',
    items: [{ title: 'Setup & embedding', id: 'public-status-page' }],
  },
]

/**
 * @param {{ activeId?: string }} props
 */
export function DocsSidebar({ activeId = '' }) {
  return (
    <aside className="hidden w-[240px] shrink-0 md:block">
      <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pb-8 pr-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-500">Documentation</p>
        <nav className="mt-5 flex flex-col gap-7" aria-label="Documentation sections">
          {DOC_NAV_SECTIONS.map((group) => (
            <div key={group.section}>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{group.section}</p>
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = activeId === item.id
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={[
                          'block rounded-lg py-1.5 pl-3 pr-2 text-[13px] transition-all duration-150',
                          active
                            ? 'border-l-2 border-indigo-500 bg-indigo-50 font-semibold text-indigo-600'
                            : 'border-l-2 border-transparent text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800',
                        ].join(' ')}
                      >
                        {item.title}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}
