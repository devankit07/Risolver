import { motion, AnimatePresence } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { LogOut, ChevronDown, Shield, Tag } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/docs', label: 'Docs' },
  { to: '/pricing', label: 'Pricing' },

  { to: '/about', label: 'About' },
]

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

/** Avatar dropdown shown when user is logged in */
function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const roleLabel = user.role === 'admin' ? 'Admin' : user.role ?? 'Member'
  const tag = user.role === 'admin' ? 'Creator' : 'Responder'

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-2 pr-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
      >
        {/* avatar circle */}
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
          {initials(user.name)}
        </span>
        <span className="hidden max-w-[100px] truncate sm:block">{user.name.split(' ')[0]}</span>
        <ChevronDown size={14} className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
          >
            {/* User info header */}
            <div className="border-b border-slate-100 px-4 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
                  {initials(user.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="truncate text-[11px] text-slate-500">{user.email}</p>
                </div>
              </div>
              {/* role + tag badges */}
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                  <Shield size={10} />
                  {roleLabel}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  <Tag size={10} />
                  {tag}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-2">
              <button
                type="button"
                onClick={() => { setOpen(false); onLogout?.() }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * @param {{ user?: { name: string, email: string, role: string } | null, onLogout?: () => void }} props
 */
export function Navbar({ user, onLogout }) {
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
    return () => { document.body.style.overflow = '' }
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
        <NavLink to="/" className="flex shrink-0 items-center" aria-label="Resolver — home">
          <img
            src="/logo.png"
            alt="Resolver"
            width={400}
            height={90}
            className="h-12 w-auto max-h-14 max-w-[min(85vw,400px)] object-contain object-left sm:h-14 sm:max-h-16 md:h-16 md:max-h-[4.5rem] lg:max-w-[min(90vw,440px)]"
            decoding="async"
          />
        </NavLink>

        <ul className="hidden items-center gap-9 md:flex">
          {navLinks.map(({ to, label }) => (
            <li key={to + label}>
              <NavLink
                end={to === '/'}
                to={to}
                className={({ isActive }) =>
                  ['text-[15px] font-medium transition', isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'].join(' ')
                }
                onClick={() => setOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop right */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <UserMenu user={user} onLogout={onLogout} />
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  ['text-sm font-semibold transition', isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'].join(' ')
                }
              >
                Contact
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">
                Sign in
              </NavLink>
              <NavLink
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Register
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
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
                <NavLink
                  key={`m-${label}`}
                  end={to === '/'}
                  to={to}
                  className="block py-3 text-slate-600 hover:text-slate-900"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
              <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 py-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
                        {initials(user.name)}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.role} · {user.role === 'admin' ? 'Creator' : 'Responder'}</p>
                      </div>
                    </div>
                    <NavLink
                      to="/contact"
                      onClick={() => setOpen(false)}
                      className="block py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900"
                    >
                      Contact
                    </NavLink>
                    <button
                      type="button"
                      onClick={() => { setOpen(false); onLogout?.() }}
                      className="flex w-full items-center gap-2 rounded-xl border border-rose-200 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut size={16} className="ml-3" />
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" onClick={() => setOpen(false)}
                      className="w-full py-3 text-center text-sm font-semibold text-slate-600 hover:text-slate-900">
                      Sign in
                    </NavLink>
                    <NavLink to="/register" onClick={() => setOpen(false)}
                      className="inline-flex w-full items-center justify-center rounded-full bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500">
                      Register
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
