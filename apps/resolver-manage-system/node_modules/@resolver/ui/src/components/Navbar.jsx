import { motion, AnimatePresence } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/docs', label: 'Docs' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About ' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 py-3">
      <nav
        className={[
          'mx-auto flex w-[min(100%-1rem,82rem)] items-center justify-between px-7 py-3 transition-all duration-300',
          scrolled
            ? 'rounded-full border border-black/10 bg-white/70 shadow-[0_12px_36px_rgba(31,41,55,0.12)] backdrop-blur-xl'
            : 'bg-transparent',
        ].join(' ')}
      >
        <NavLink
          to="/"
          className="flex items-center gap-1.5 font-semibold"
          aria-label="Resolver — home"
        >
          <span className="select-none text-lg leading-none tracking-tight">
            <span className="text-[var(--resolver-red)]">RE</span>
            <span className="text-[var(--accent-green)]">solver</span>
          </span>
        </NavLink>

        <ul className="hidden items-center gap-9 md:flex">
          {navLinks.map(({ to, label }) => (
            <li key={to + label}>
              {to.includes('#') ? (
                <a
                  href={to}
                  className="text-[15px] font-medium text-slate-600 transition hover:text-slate-900"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </a>
              ) : (
                <NavLink
                  end={to === '/'}
                  to={to}
                  className={({ isActive }) =>
                    [
                      'text-[15px] font-medium transition',
                      isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900',
                    ].join(' ')
                  }
                  onClick={() => setOpen(false)}
                >
                  {label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <button type="button" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
            Register
          </button>
          <NavLink
            to="/pricing"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            contact us
          </NavLink>
        </div>

        <button
          type="button"
          className="inline-flex rounded-lg border border-slate-300 p-2 text-slate-800 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-slate-200 bg-white/95 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map(({ to, label }) => (
                <div key={`m-${label}`}>
                  {to.includes('#') ? (
                    <a
                      href={to}
                      className="block py-3 text-slate-600 hover:text-slate-900"
                      onClick={() => setOpen(false)}
                    >
                      {label}
                    </a>
                  ) : (
                    <NavLink
                      end={to === '/'}
                      to={to}
                      className="block py-3 text-slate-600 hover:text-slate-900"
                      onClick={() => setOpen(false)}
                    >
                      {label}
                    </NavLink>
                  )}
                </div>
              ))}
              <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4">
                <button type="button" className="w-full py-3 text-sm font-semibold text-slate-600">
                  Sign in
                </button>
                <NavLink
                  to="/pricing"
                  onClick={() => setOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-full bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  Get started
                </NavLink>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
