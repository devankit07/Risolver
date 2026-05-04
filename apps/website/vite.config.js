import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
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
    port: 3000,
    strictPort: false,
    fs: { allow: [path.resolve(dirname, '../../')] },
  },
  optimizeDeps: {
    include: ['socket.io-client', 'framer-motion', 'gsap'],
    exclude: ['@resolver/ui'],
  },
})
