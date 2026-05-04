import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { getApiBaseUrl } from '../config/apiUrl.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  /* hydrate from localStorage on mount */
  useEffect(() => {
    try {
      const stored = localStorage.getItem('resolver_user')
      const storedToken = localStorage.getItem('resolver_token')
      if (stored && storedToken) {
        const u = JSON.parse(stored)
        setUser(u)
        setToken(storedToken)
        /* backfill last email if not already saved */
        if (u?.email && !localStorage.getItem('resolver_last_email')) {
          localStorage.setItem('resolver_last_email', u.email)
        }
      }
    } catch {
      /* ignore corrupt data */
    } finally {
      setLoading(false)
    }
  }, [])

  const persist = useCallback((u, t) => {
    setUser(u)
    setToken(t)
    localStorage.setItem('resolver_user', JSON.stringify(u))
    localStorage.setItem('resolver_token', t)
    /* remember email so login can pre-fill it */
    if (u?.email) localStorage.setItem('resolver_last_email', u.email)
  }, [])

  /** Turn backend error/validation response into a readable message */
  const extractError = (data) => {
    if (Array.isArray(data.error) && data.error.length > 0) {
      return data.error.map((e) => e.message).join(' · ')
    }
    return data.message || 'Something went wrong'
  }

  /** Register admin (step-1 + step-2 data merged) */
  const register = useCallback(async ({ name, email, password, organizationName }) => {
    /* capture email immediately — even if the call fails, login can pre-fill it */
    localStorage.setItem('resolver_last_email', email.trim())
    const res = await fetch(`${getApiBaseUrl()}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password, organizationName }),
    })
    const data = await res.json()
    if (!data.success) throw new Error(extractError(data))
    persist(data.data.user, data.data.token)
    return data.data.user
  }, [persist])

  /** Login */
  const login = useCallback(async ({ email, password }) => {
    /* capture email immediately */
    localStorage.setItem('resolver_last_email', email.trim())
    const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!data.success) throw new Error(extractError(data))
    persist(data.data.user, data.data.token)
    return data.data.user
  }, [persist])

  /** Logout */
  const logout = useCallback(async () => {
    try {
      await fetch(`${getApiBaseUrl()}/auth/logout`, {
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
    } catch { /* ignore network errors on logout */ }
    setUser(null)
    setToken(null)
    localStorage.removeItem('resolver_user')
    localStorage.removeItem('resolver_token')
  }, [token])

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
