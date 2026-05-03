import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api.js'

export const generateInvite = createAsyncThunk(
  'invite/generate',
  async ({ name, role, specialization, organizationId }, { rejectWithValue }) => {
    try {
      const res = await api.post('/invites/generate', { name, role, specialization, organizationId })
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to generate invite')
    }
  },
)

export const fetchRoles = createAsyncThunk(
  'invite/roles',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/invites/roles')
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to fetch roles')
    }
  },
)

export const addCustomRole = createAsyncThunk(
  'invite/addRole',
  async (roleName, { rejectWithValue }) => {
    try {
      const res = await api.post('/invites/roles/add', { roleName })
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to add custom role')
    }
  },
)

export const fetchInviteList = createAsyncThunk(
  'invite/list',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/invites')
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to fetch invites')
    }
  },
)

const inviteSlice = createSlice({
  name: 'invite',
  initialState: {
    lastGenerated: null,
    invites: [],
    // Tag = system access level (controls permissions)
    defaultRoles: ['manager', 'creator', 'responder'],
    // Specialization = organizational/team role (display only)
    defaultSpecializations: ['Manager', 'Dev', 'DevOps', 'Tester', 'SRE', 'Designer'],
    customRoles: [],
    loading: false,
    generating: false,
    error: null,
  },
  reducers: {
    clearLastGenerated: (state) => {
      state.lastGenerated = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateInvite.pending, (s) => { s.generating = true; s.error = null })
      .addCase(generateInvite.fulfilled, (s, a) => {
        s.generating = false
        s.lastGenerated = a.payload
      })
      .addCase(generateInvite.rejected, (s, a) => {
        s.generating = false
        s.error = a.payload
      })

      .addCase(fetchRoles.fulfilled, (s, a) => {
        s.defaultRoles = a.payload?.defaultRoles ?? s.defaultRoles
        s.customRoles = a.payload?.customRoles ?? []
      })

      .addCase(addCustomRole.fulfilled, (s, a) => {
        s.defaultRoles = a.payload?.defaultRoles ?? s.defaultRoles
        s.customRoles = a.payload?.customRoles ?? []
      })

      .addCase(fetchInviteList.pending, (s) => { s.loading = true })
      .addCase(fetchInviteList.fulfilled, (s, a) => {
        s.loading = false
        s.invites = a.payload?.invites ?? []
      })
      .addCase(fetchInviteList.rejected, (s) => { s.loading = false })
  },
})

export const { clearLastGenerated } = inviteSlice.actions
export default inviteSlice.reducer
