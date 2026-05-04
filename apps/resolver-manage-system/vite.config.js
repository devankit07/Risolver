import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Public URL path where this app is hosted.
 * - Railway (Express mounts app at /app): omit VITE_BASE_PATH or use /app — default is /app/
 * - Vercel (deploy at project URL root): set VITE_BASE_PATH=/ in Environment Variables and redeploy
 */
function viteBase() {
  const raw = process.env.VITE_BASE_PATH
  if (raw === undefined || raw === null) {
    return '/app/'
  }
  const t = String(raw).trim()
  if (t === '' || t === '/') return '/'
  const withLeading = t.startsWith('/') ? t : `/${t}`
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`
}

export default defineConfig({
  plugins: [react()],
  base: viteBase(),
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@resolver/ui/styles.css': path.resolve(dirname, '../../packages/ui/src/styles/styles.css'),
    },
  },
  server: {
    port: 3001,
    strictPort: false,
    fs: { allow: [path.resolve(dirname, '../../')] },
  },
  /* Do not pre-bundle workspace @resolver/ui — Vite's dep scan drops lucide re-exports from the barrel. */
  optimizeDeps: {
    exclude: ['@resolver/ui'],
    include: ['lucide-react', 'socket.io-client', 'framer-motion', 'gsap'],
  },
})
