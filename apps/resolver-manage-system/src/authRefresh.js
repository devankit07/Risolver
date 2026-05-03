import { hydrateAuth } from './store/authSlice.js'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:5173'

/** Refresh user (incl. organizationName) from GET /api/auth/me when a token exists. */
export function refreshAuthFromApi(store) {
  if (typeof localStorage === 'undefined') return
  // Prefer management-specific token; fall back to website token for admins/managers
  const token =
    localStorage.getItem('manage_token') ||
    (() => {
      try {
        const u = JSON.parse(localStorage.getItem('resolver_user') || 'null')
        if (u?.role === 'admin' || u?.role === 'manager') {
          return localStorage.getItem('resolver_token')
        }
      } catch { /* ignore */ }
      return null
    })()

  if (!token) return

  void fetch(`${API}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  })
    .then((r) => r.json())
    .then((payload) => {
      const user = payload?.data?.user
      if (payload?.success && user) {
        store.dispatch(hydrateAuth({ user, token }))
        try {
          localStorage.setItem('manage_user', JSON.stringify(user))
          localStorage.setItem('manage_token', token)
        } catch {
          /* ignore */
        }
      } else {
        localStorage.removeItem('manage_token')
        localStorage.removeItem('manage_user')
      }
    })
    .catch(() => {})
}
