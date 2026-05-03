import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api.js'

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const fetchIncidents = createAsyncThunk(
  'incidents/fetchAll',
  async ({ status, severity, service, assignedTo, search, page, limit } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams()
      if (status)     params.append('status', status)
      if (severity)   params.append('severity', severity)
      if (service)    params.append('service', service)
      if (assignedTo) params.append('assignedTo', assignedTo)
      if (search)     params.append('search', search)
      if (page)       params.append('page', page)
      if (limit)      params.append('limit', limit)
      const { data } = await api.get(`/incidents?${params}`)
      // sendResponse wraps payload under data.data
      return data.data ?? data
    } catch (err) {
      return rejectWithValue(err.response?.data ?? 'Failed to fetch incidents')
    }
  },
)

export const fetchIncidentStats = createAsyncThunk(
  'incidents/stats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/incidents/stats')
      return data.data ?? data
    } catch (err) {
      return rejectWithValue(err.response?.data ?? 'Failed to fetch stats')
    }
  },
)

export const fetchIncident = createAsyncThunk(
  'incidents/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/incidents/${id}`)
      return data.data?.incident ?? data.incident ?? data
    } catch (err) {
      return rejectWithValue(err.response?.data ?? 'Failed to fetch incident')
    }
  },
)

export const createIncidentThunk = createAsyncThunk(
  'incidents/create',
  async (body, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/incidents', body)
      return data.data?.incident ?? data.incident ?? data
    } catch (err) {
      return rejectWithValue(err.response?.data ?? 'Failed to create incident')
    }
  },
)

export const updateIncidentStatusThunk = createAsyncThunk(
  'incidents/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/incidents/${id}/status`, { status })
      return data.data?.incident ?? data.incident ?? data
    } catch (err) {
      return rejectWithValue(err.response?.data ?? 'Failed to update status')
    }
  },
)

// Keep legacy thunks used by workspace/other pages
export const triageIncident = createAsyncThunk(
  'incidents/triage',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/incident/${id}/triage`, {})
      return { id, triage: data }
    } catch (err) {
      return rejectWithValue(err.response?.data ?? 'Failed to triage')
    }
  },
)

export const generatePostmortem = createAsyncThunk(
  'incidents/postmortem',
  async ({ id, body }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/incident/${id}/postmortem`, body)
      return { id, postmortem: data }
    } catch (err) {
      return rejectWithValue(err.response?.data ?? 'Failed to generate postmortem')
    }
  },
)

// ─── Slice ───────────────────────────────────────────────────────────────────

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState: {
    list: [],
    current: null,
    total: 0,
    page: 1,
    pages: 1,
    loading: false,
    creating: false,
    triageLoading: false,
    postmortemLoading: false,
    error: null,
    createError: null,
    triageData: {},
    postmortemData: {},
    stats: { open: 0, investigating: 0, resolved: 0, critical: 0, resolvedToday: 0 },
    filters: { status: '', severity: '', service: '', search: '' },
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters(state) {
      state.filters = { status: '', severity: '', service: '', search: '' }
    },
    // Socket-driven updates
    addRealtimeIncident(state, action) {
      const exists = state.list.find(
        (i) => String(i._id) === String(action.payload._id) || String(i.id) === String(action.payload.id),
      )
      if (!exists) state.list.unshift(action.payload)
    },
    updateRealtimeIncident(state, action) {
      const idx = state.list.findIndex(
        (i) => String(i._id) === String(action.payload._id) || String(i.id) === String(action.payload.id),
      )
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload }
      if (
        state.current &&
        (String(state.current._id) === String(action.payload._id) ||
          String(state.current.id) === String(action.payload.id))
      ) {
        state.current = { ...state.current, ...action.payload }
      }
    },
    prependIncident(state, action) {
      const exists = state.list.find((i) => String(i._id) === String(action.payload._id))
      if (!exists) {
        state.list.unshift(action.payload)
        state.total += 1
        state.stats.open = (state.stats.open || 0) + 1
      }
    },
    updateIncidentInList(state, action) {
      const { incidentId, changes } = action.payload
      const idx = state.list.findIndex((i) => String(i._id) === String(incidentId))
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...changes }
    },
    updateIncidentStatusInList(state, action) {
      const { incidentId, status } = action.payload
      const idx = state.list.findIndex((i) => String(i._id) === String(incidentId))
      if (idx !== -1) {
        const prev = state.list[idx].status
        state.list[idx] = { ...state.list[idx], status }
        if (prev !== 'resolved' && status === 'resolved') {
          state.stats.resolved = (state.stats.resolved || 0) + 1
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncidents.pending, (s) => { s.loading = true; s.error = null })
      .addCase(fetchIncidents.fulfilled, (s, a) => {
        s.loading = false
        const payload = a.payload ?? {}
        // payload is already unwrapped (data.data from sendResponse)
        s.list = Array.isArray(payload.incidents) ? payload.incidents : []
        s.total = payload.total ?? s.list.length
        s.page = payload.page ?? 1
        s.pages = payload.pages ?? 1
        if (payload.stats) s.stats = { ...s.stats, ...payload.stats }
      })
      .addCase(fetchIncidents.rejected, (s, a) => { s.loading = false; s.error = a.payload })

      .addCase(fetchIncidentStats.fulfilled, (s, a) => {
        const p = a.payload
        s.stats = {
          open: p.byStatus?.open ?? p.open ?? 0,
          investigating: p.byStatus?.investigating ?? p.investigating ?? 0,
          resolved: p.byStatus?.resolved ?? p.resolved ?? 0,
          critical: p.bySeverity?.critical ?? p.critical ?? 0,
          resolvedToday: p.resolvedToday ?? 0,
        }
      })

      .addCase(fetchIncident.fulfilled, (s, a) => { s.current = a.payload })

      .addCase(createIncidentThunk.pending, (s) => { s.creating = true; s.createError = null })
      .addCase(createIncidentThunk.fulfilled, (s, a) => {
        s.creating = false
        const inc = a.payload
        const exists = s.list.find((i) => String(i._id) === String(inc._id))
        if (!exists) s.list.unshift(inc)
      })
      .addCase(createIncidentThunk.rejected, (s, a) => { s.creating = false; s.createError = a.payload })

      .addCase(updateIncidentStatusThunk.fulfilled, (s, a) => {
        const inc = a.payload
        if (!inc?._id) return
        const idx = s.list.findIndex((i) => String(i._id) === String(inc._id))
        if (idx !== -1) s.list[idx] = { ...s.list[idx], ...inc }
      })

      .addCase(triageIncident.pending, (s) => { s.triageLoading = true })
      .addCase(triageIncident.fulfilled, (s, a) => {
        s.triageLoading = false
        s.triageData[a.payload.id] = a.payload.triage
      })
      .addCase(triageIncident.rejected, (s) => { s.triageLoading = false })

      .addCase(generatePostmortem.pending, (s) => { s.postmortemLoading = true })
      .addCase(generatePostmortem.fulfilled, (s, a) => {
        s.postmortemLoading = false
        s.postmortemData[a.payload.id] = a.payload.postmortem
      })
      .addCase(generatePostmortem.rejected, (s) => { s.postmortemLoading = false })
  },
})

export const {
  setFilters,
  clearFilters,
  addRealtimeIncident,
  updateRealtimeIncident,
  prependIncident,
  updateIncidentInList,
  updateIncidentStatusInList,
} = incidentsSlice.actions

export default incidentsSlice.reducer
