/**
 * Single source for API base URL. Vercel must set VITE_API_URL to the full Railway URL, e.g.
 *   https://server-production-a2c4.up.railway.app/api
 * Accepts missing `https://` and missing `/api` suffix (fixes common dashboard typos).
 */
export function getApiBaseUrl() {
  const devFallback = 'http://localhost:5173/api'
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

/** Socket.io origin (same host as API, no /api path). */
export function getSocketOrigin() {
  return getApiBaseUrl().replace(/\/api\/?$/i, '')
}
