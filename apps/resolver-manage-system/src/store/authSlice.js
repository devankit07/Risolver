import { createSlice } from '@reduxjs/toolkit'

/** Display user for shell (sidebar / topbar). No login flow in manage-system. */
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: { name: 'Admin User', email: 'admin@resolver.io', role: 'Admin' },
    token: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
  },
})

export const { setUser } = authSlice.actions
export default authSlice.reducer
