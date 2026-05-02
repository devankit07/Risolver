/** Optional JWT for backend calls (manage-system has no login; omit header if unset). */
export function authHeaders() {
  const t = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
  return t ? { Authorization: `Bearer ${t}` } : {}
}
