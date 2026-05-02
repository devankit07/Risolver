import { Outlet } from 'react-router-dom'
import { Footer, Navbar } from '@resolver/ui'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext.jsx'

export default function MainLayout() {
  const { user, logout } = useAuth()

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
