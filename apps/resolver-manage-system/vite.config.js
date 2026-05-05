import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  /* Deployed on Vercel at the project URL root — assets must be /assets/… not /app/assets/… */
  base: '/',
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
    port: 3002,
    strictPort: false,
    fs: { allow: [path.resolve(dirname, '../../')] },
  },
  /* Do not pre-bundle workspace @resolver/ui — Vite's dep scan drops lucide re-exports from the barrel. */
  optimizeDeps: {
    exclude: ['@resolver/ui'],
    include: ['lucide-react', 'socket.io-client', 'framer-motion', 'gsap'],
  },
})
