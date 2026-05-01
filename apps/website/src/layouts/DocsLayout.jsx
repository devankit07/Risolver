import { useEffect, useState } from 'react'
import { DOC_NAV_SECTIONS, DocsSidebar } from '@resolver/ui'
import { Outlet } from 'react-router-dom'

const SECTION_IDS = DOC_NAV_SECTIONS.flatMap((s) => s.items.map((i) => i.id))

export default function DocsLayout() {
  const [activeId, setActiveId] = useState(() => {
    if (typeof window === 'undefined') return SECTION_IDS[0]
    const hash = window.location.hash.replace('#', '')
    return SECTION_IDS.includes(hash) ? hash : SECTION_IDS[0]
  })

  useEffect(() => {
    const headings = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean)
    if (headings.length === 0) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-15% 0px -60% 0px', threshold: [0, 0.3, 0.6, 1] },
    )

    headings.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex max-w-7xl gap-0 px-0 pt-20 lg:gap-0">
        {/* sticky sidebar panel */}
        <div className="hidden border-r border-slate-100 bg-white md:block">
          <div className="sticky top-20 w-[248px] px-5 py-8">
            <DocsSidebar activeId={activeId} />
          </div>
        </div>
        {/* main content */}
        <div className="min-w-0 flex-1 px-6 py-10 md:px-10 lg:px-16">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
