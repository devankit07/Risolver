import { createSlice } from '@reduxjs/toolkit'

/**
 * Synced with website signup/login (`resolver_user` / `resolver_token`).
 * User shape: { id, name, email, role, organizationName, organizationId, ... }
 */
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    setToken: (state, action) => {
      state.token = action.payload
    },
    hydrateAuth: (state, action) => {
      state.user = action.payload.user ?? null
      state.token = action.payload.token ?? null
    },
    clearAuth: (state) => {
      state.user = null
      state.token = null
    },
  },
})

export const { setUser, setToken, hydrateAuth, clearAuth } = authSlice.actions
export default authSlice.reducer
