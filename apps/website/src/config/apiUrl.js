/**
 * API Base URL Configuration
 * This file is engineered to be foolproof against stale environment variables.
 */
const PRODUCTION_API_BASE = 'https://risolver.onrender.com/api'

export function getApiBaseUrl() {
  // 1. Force Render in production mode or if deployed on Vercel
  const isVercel = typeof window !== 'undefined' && window.location.hostname.endsWith('.vercel.app')
  if (import.meta.env.PROD || isVercel) {
    return PRODUCTION_API_BASE
  }

  // 2. Development mode logic
  const devFallback = 'http://localhost:5173/api'
  const envUrl = import.meta.env.VITE_API_URL

  if (!envUrl) {
    return devFallback
  }

  let url = String(envUrl).trim()
  
  // 3. Fallback check: if the URL contains "railway", it is stale. Force Render.
  if (url.includes('railway.app')) {
    return PRODUCTION_API_BASE
  }

  // Ensure protocol
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url.replace(/^\/+/, '')}`
  }
  
  // Clean trailing slashes
  url = url.replace(/\/+$/, '')
  
  // Ensure it ends with /api if it doesn't already
  if (!/\/api$/i.test(url)) {
    url += '/api'
  }
  
  return url
}


