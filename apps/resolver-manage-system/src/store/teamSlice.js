import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api.js'

export const fetchTeamMembers = createAsyncThunk(
  'team/fetch',
  async ({ role, status, search, page } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams()
      if (role && role !== 'All') params.append('role', role)
      if (status) params.append('status', status)
      if (search) params.append('search', search)
      if (page) params.append('page', page)
      const res = await api.get(`/users?${params}`)
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to fetch team')
    }
  },
)

export const fetchUserProfile = createAsyncThunk(
  'team/profile',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/users/${userId}`)
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to fetch profile')
    }
  },
)

export const fetchUserIncidents = createAsyncThunk(
  'team/userIncidents',
  async ({ userId, status, page } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams()
      if (status) params.append('status', status)
      if (page) params.append('page', page)
      const res = await api.get(`/users/${userId}/incidents?${params}`)
      return { userId, ...res.data.data }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to fetch incidents')
    }
  },
)

export const fetchUserNotifications = createAsyncThunk(
  'team/notifications',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/users/${userId}/notifications`)
      return { userId, notifications: res.data.data?.notifications ?? [] }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to fetch notifications')
    }
  },
)

export const markAllNotificationsRead = createAsyncThunk(
  'team/markRead',
  async (userId, { rejectWithValue }) => {
    try {
      await api.patch(`/users/${userId}/notifications/read-all`)
      return userId
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to mark notifications read')
    }
  },
)

export const deleteTeamMember = createAsyncThunk(
  'team/delete',
  async (userId, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${userId}`)
      return userId
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to remove member')
    }
  },
)

export const updateUserStatus = createAsyncThunk(
  'team/status',
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/users/${userId}/status`, { status })
      return { userId, status: res.data.data?.status ?? status }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to update status')
    }
  },
)

const teamSlice = createSlice({
  name: 'team',
  initialState: {
    members: [],
    total: 0,
    loading: false,
    error: null,
    profileCache: {},
    incidentsCache: {},
    notificationsCache: {},
  },
  reducers: {
    removeMemberFromList: (state, action) => {
      const id = String(action.payload)
      state.members = state.members.filter(
        (m) => String(m._id ?? m.id) !== id,
      )
      delete state.profileCache[id]
    },
    updateMemberStatus: (state, action) => {
      const { userId, status } = action.payload
      const idx = state.members.findIndex(
        (m) => String(m._id) === String(userId) || String(m.id) === String(userId),
      )
      if (idx !== -1) state.members[idx].status = status
    },
    addNotification: (state, action) => {
      const n = action.payload
      const uid = String(n.userId?._id ?? n.userId ?? '')
      if (!uid) return
      if (!state.notificationsCache[uid]) state.notificationsCache[uid] = []
      const id = n._id != null ? String(n._id) : null
      if (id && state.notificationsCache[uid].some((x) => String(x._id) === id)) return
      state.notificationsCache[uid].unshift(n)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembers.pending, (s) => { s.loading = true; s.error = null })
      .addCase(fetchTeamMembers.fulfilled, (s, a) => {
        s.loading = false
        s.members = a.payload?.users ?? a.payload ?? []
        s.total = a.payload?.total ?? s.members.length
      })
      .addCase(fetchTeamMembers.rejected, (s, a) => { s.loading = false; s.error = a.payload })

      .addCase(fetchUserProfile.fulfilled, (s, a) => {
        // Key by the userId arg so URL params always match the cache lookup
        const userId = a.meta.arg
        const user = a.payload?.user ?? a.payload
        if (userId && user) {
          s.profileCache[String(userId)] = user
          // Also key by the returned _id for any direct lookups
          const id = String(user._id ?? user.id ?? '')
          if (id && id !== String(userId)) s.profileCache[id] = user
        }
      })

      .addCase(fetchUserIncidents.fulfilled, (s, a) => {
        if (a.payload?.userId) {
          s.incidentsCache[a.payload.userId] = a.payload?.incidents ?? []
        }
      })

      .addCase(fetchUserNotifications.fulfilled, (s, a) => {
        if (a.payload?.userId) {
          s.notificationsCache[a.payload.userId] = a.payload.notifications
        }
      })

      .addCase(markAllNotificationsRead.fulfilled, (s, a) => {
        const userId = a.payload
        if (s.notificationsCache[userId]) {
          s.notificationsCache[userId] = s.notificationsCache[userId].map((n) => ({
            ...n,
            isRead: true,
          }))
        }
      })

      .addCase(deleteTeamMember.fulfilled, (s, a) => {
        const id = String(a.payload)
        s.members = s.members.filter((m) => String(m._id ?? m.id) !== id)
        delete s.profileCache[id]
      })

      .addCase(updateUserStatus.fulfilled, (s, a) => {
        const { userId, status } = a.payload
        const idx = s.members.findIndex(
          (m) => String(m._id) === String(userId) || String(m.id) === String(userId),
        )
        if (idx !== -1) s.members[idx].status = status
      })
  },
})

export const { updateMemberStatus, addNotification, removeMemberFromList } = teamSlice.actions
export default teamSlice.reducer
