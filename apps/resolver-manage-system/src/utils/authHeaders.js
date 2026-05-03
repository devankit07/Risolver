/** Bearer token — same keys as website AuthContext (`resolver_token`). */
export function authHeaders() {
  if (typeof localStorage === 'undefined') return {}
  const t = localStorage.getItem('resolver_token') ?? localStorage.getItem('token')
  return t ? { Authorization: `Bearer ${t}` } : {}
}
