import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api.js'

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const fetchPostmortems = createAsyncThunk(
  'postmortems/fetch',
  async ({ status, service, search, page } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams()
      if (status)  params.append('status', status)
      if (service) params.append('service', service)
      if (search)  params.append('search', search)
      if (page)    params.append('page', page)
      const { data } = await api.get(`/postmortems?${params}`)
      return data.data ?? data
    } catch (err) {
      return rejectWithValue(err.response?.data ?? 'Failed to fetch reports')
    }
  },
)

export const fetchPublicPostmortems = createAsyncThunk(
  'postmortems/public',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/postmortems/public')
      return data.data ?? data
    } catch (err) {
      return rejectWithValue(err.response?.data ?? 'Failed to fetch public reports')
    }
  },
)

export const fetchPendingApprovals = createAsyncThunk(
  'postmortems/pending',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/postmortems/pending')
      return data.data ?? data
    } catch (err) {
      return rejectWithValue(err.response?.data ?? 'Failed to fetch pending approvals')
    }
  },
)

export const approvePostmortem = createAsyncThunk(
  'postmortems/approve',
  async ({ id, action, feedback }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/postmortems/${id}/approve`, { action, feedback })
      return data.data?.postmortem ?? data.postmortem ?? data
    } catch (err) {
      return rejectWithValue(err.response?.data ?? 'Failed to approve report')
    }
  },
)

export const fetchPostmortemDetail = createAsyncThunk(
  'postmortems/detail',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/postmortems/${id}`)
      return data.data?.postmortem ?? data.postmortem ?? data
    } catch (err) {
      return rejectWithValue(err.response?.data ?? 'Failed to fetch report detail')
    }
  },
)

// ─── Slice ───────────────────────────────────────────────────────────────────

const postmortemsSlice = createSlice({
  name: 'postmortems',
  initialState: {
    postmortems: [],
    pendingApprovals: [],
    activeDetail: null,
    stats: { total: 0, published: 0, pendingApproval: 0, avgResolutionTime: '—' },
    total: 0,
    page: 1,
    pages: 1,
    loading: false,
    approving: false,
    error: null,
  },
  reducers: {
    updatePostmortemStatus(state, action) {
      const { id, status } = action.payload
      const idx = state.postmortems.findIndex((p) => String(p._id) === String(id))
      if (idx !== -1) state.postmortems[idx] = { ...state.postmortems[idx], status }
      if (state.activeDetail && String(state.activeDetail._id) === String(id)) {
        state.activeDetail = { ...state.activeDetail, status }
      }
      // Remove from pending if now published
      if (status === 'published') {
        state.pendingApprovals = state.pendingApprovals.filter((p) => String(p._id) !== String(id))
      }
    },
    clearDetail(state) {
      state.activeDetail = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostmortems.pending, (s) => { s.loading = true; s.error = null })
      .addCase(fetchPostmortems.fulfilled, (s, a) => {
        s.loading = false
        const p = a.payload ?? {}
        s.postmortems = Array.isArray(p.postmortems) ? p.postmortems : []
        s.total = p.total ?? 0
        s.page = p.page ?? 1
        s.pages = p.pages ?? 1
        if (p.stats) s.stats = { ...s.stats, ...p.stats }
      })
      .addCase(fetchPostmortems.rejected, (s, a) => { s.loading = false; s.error = a.payload })

      .addCase(fetchPublicPostmortems.fulfilled, (s, a) => {
        const p = a.payload ?? {}
        s.postmortems = Array.isArray(p.postmortems) ? p.postmortems : []
        s.total = p.total ?? 0
      })

      .addCase(fetchPendingApprovals.fulfilled, (s, a) => {
        const p = a.payload ?? {}
        s.pendingApprovals = Array.isArray(p.postmortems) ? p.postmortems : []
        // Sync stats if possible
        s.stats.pendingApproval = s.pendingApprovals.length
      })

      .addCase(fetchPostmortemDetail.pending, (s) => {
        s.loading = true
        s.activeDetail = null
        s.error = null
      })
      .addCase(fetchPostmortemDetail.fulfilled, (s, a) => {
        s.loading = false
        s.activeDetail = a.payload
      })
      .addCase(fetchPostmortemDetail.rejected, (s, a) => {
        s.loading = false
        s.error = a.payload
      })

      .addCase(approvePostmortem.pending, (s) => { s.approving = true })
      .addCase(approvePostmortem.fulfilled, (s, a) => {
        s.approving = false
        const updated = a.payload
        if (!updated?._id) return
        
        // Update in lists
        const idx = s.postmortems.findIndex((p) => String(p._id) === String(updated._id))
        if (idx !== -1) s.postmortems[idx] = updated
        
        if (s.activeDetail && String(s.activeDetail._id) === String(updated._id)) {
          s.activeDetail = updated
        }
        
        s.pendingApprovals = s.pendingApprovals.filter(
          (p) => String(p._id) !== String(updated._id),
        )
        
        // Update stats counters
        s.stats.pendingApproval = Math.max(0, s.stats.pendingApproval - 1)
        if (updated.status === 'published') {
           s.stats.published += 1
        }
      })
      .addCase(approvePostmortem.rejected, (s, a) => { 
        s.approving = false 
        s.error = a.payload
      })

  },
})

export const { updatePostmortemStatus, clearDetail } = postmortemsSlice.actions
export default postmortemsSlice.reducer
