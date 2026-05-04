import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5173/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  let token = localStorage.getItem('manage_token')
  if (!token) {
    try {
      const u = JSON.parse(localStorage.getItem('resolver_user') || 'null')
      if (u?.role === 'admin' || u?.role === 'manager') {
        token = localStorage.getItem('resolver_token')
      }
    } catch { /* ignore */ }
  }
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('manage_token')
      localStorage.removeItem('manage_user')
      window.location.href = import.meta.env.BASE_URL + 'login'
    }
    return Promise.reject(err)
  },
)

export default api
