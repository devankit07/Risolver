import { Outlet, useSearchParams } from 'react-router-dom'
import { Footer, Navbar } from '@resolver/ui'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext.jsx'
import { useEffect } from 'react'

export default function MainLayout() {
  const { user, logout } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('logout') === 'true') {
      logout().then(() => {
        setSearchParams({}, { replace: true })
      })
    }
  }, [searchParams, logout, setSearchParams])

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar user={user} onLogout={logout} />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="min-h-[50vh]"
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  )
}
