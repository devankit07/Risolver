import { Link } from 'react-router-dom'

const columns = [
  {
    title: 'Setup',
    links: [
      { label: 'Register', href: '/#features' },
      { label: 'Team Invite', href: '/#features' },
      { label: 'Testers', href: '/#features' },
      { label: 'Workspace', href: '/#features' },
      { label: 'Roles', to: '/docs#roles-permissions' },
    ],
  },
  {
    title: 'Respond',
    links: [
      { label: 'Report', to: '/docs#creating-an-incident' },
      { label: 'Escalate', href: '/#features' },
      { label: 'Assign', to: '/docs#assigning-responders' },
      { label: 'Timeline', to: '/docs#live-updates' },
      { label: 'AI Triage', to: '/docs#incident-triage' },
    ],
  },
  {
    title: 'Resolve',
    links: [
      { label: 'Fix', href: '/#features' },
      { label: 'Re-verify', href: '/#features' },
      { label: 'Postmortem', to: '/docs#postmortem-generation' },
      { label: 'Approval', href: '/#features' },
      { label: 'Publish', to: '/docs#public-status-page' },
    ],
  },
  {
    title: 'Pages',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Docs', to: '/docs' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl overflow-x-auto px-6 py-14">
        <div className="grid min-w-[1120px] grid-cols-[220px_1fr_1fr_1fr_1fr] items-start gap-10">
          <div className="flex flex-col items-start gap-5">
            <Link to="/" className="inline-flex items-center" aria-label="Resolver — home">
              <img
                src="/logo.png"
                alt="Resolver"
                width={360}
                height={84}
                className="h-14 w-auto max-w-[min(100%,320px)] object-contain object-left sm:h-16 md:h-[4.5rem]"
                decoding="async"
              />
            </Link>
            <p className="max-w-[15rem] text-left text-sm leading-relaxed text-slate-800 text-balance">
              © 2026 Resolver Technology Ltd. All rights reserved.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="border-l border-indigo-200 pl-5 md:pl-6">
              <p className="text-xl font-medium text-indigo-600">{col.title}</p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {col.links.map((item) =>
                  item.to ? (
                    <li key={item.label}>
                      <Link className="whitespace-nowrap text-lg leading-tight text-black transition hover:text-slate-700" to={item.to}>
                        {item.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={item.label}>
                      <a className="whitespace-nowrap text-lg leading-tight text-black transition hover:text-slate-700" href={item.href}>
                        {item.label}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
