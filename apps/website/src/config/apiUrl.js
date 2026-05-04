/**
 * VITE_API_URL on Vercel: https://YOUR-SERVICE.up.railway.app/api
 * Prepends https:// and /api if omitted (reduces misconfigured deploys).
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
