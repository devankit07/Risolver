import { Outlet } from 'react-router-dom'
import { Footer, Navbar } from '@resolver/ui'
import { motion } from 'framer-motion'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar />
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
