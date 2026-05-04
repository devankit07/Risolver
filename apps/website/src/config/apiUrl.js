/**
 * VITE_API_URL on Vercel: https://<api-host>/api (e.g. Render or Railway).
 * Prepends https:// and /api if omitted (reduces misconfigured deploys).
 */
export function getApiBaseUrl() {
  const devFallback = 'http://localhost:5173/api'
  const prodFallback = 'https://risolver.onrender.com/api'
  const raw = import.meta.env.VITE_API_URL
  if (raw === undefined || raw === null || String(raw).trim() === '') {
    return import.meta.env.PROD ? prodFallback : devFallback
  }
  let s = String(raw).trim()
  if (!/^https?:\/\//i.test(s)) {
    s = `https://${s.replace(/^\/+/, '')}`
  }
  s = s.replace(/\/+$/, '')
  if (!/\/api$/i.test(s)) {
    s += '/api'
  }
  /* Vercel may still have an old VITE_API_URL pointing at a removed Railway app (DNS fails). */
  if (import.meta.env.PROD && /\.up\.railway\.app/i.test(s)) {
    return prodFallback
  }
  return s
}
