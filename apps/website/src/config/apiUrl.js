/**
 * Deployed API (Render). In production builds this is fixed so Vercel cannot inject a stale Railway URL.
 * Local dev: set VITE_API_URL or defaults to http://localhost:5173/api (backend dev server).
 */
const PRODUCTION_API_BASE = 'https://risolver.onrender.com/api'

export function getApiBaseUrl() {
  if (import.meta.env.PROD) {
    return PRODUCTION_API_BASE
  }

  const devFallback = 'http://localhost:3001/api'
  const raw = import.meta.env.VITE_API_URL
  if (raw === undefined || raw === null || String(raw).trim() === '') {
    return devFallback
  }
  let s = String(raw).trim()
  if (!/^https?:\/\//i.test(s)) {
    s = `https://${s.replace(/^\/+/, '')}`
  }
  s = s.replace(/\/+$/, '')
  if (!/\/api$/i.test(s)) {
    s += '/api'
  }
  return s
}
