/**
 * API Base URL Configuration
 * Production: Always uses the Render backend.
 * Local Development: Uses VITE_API_URL from .env or defaults to localhost.
 */
const PRODUCTION_API_BASE = 'https://risolver.onrender.com/api'

export function getApiBaseUrl() {
  // Always use the Render URL in production builds
  if (import.meta.env.PROD) {
    return PRODUCTION_API_BASE
  }

  // Development mode logic
  const devFallback = 'http://localhost:5173/api'
  const envUrl = import.meta.env.VITE_API_URL

  if (!envUrl) {
    return devFallback
  }

  let url = String(envUrl).trim()
  
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

