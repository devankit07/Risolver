import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { authHeaders } from '../utils/authHeaders.js'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:5173'

export const fetchIncidents = createAsyncThunk('incidents/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API}/api/incidents`, {
      headers: authHeaders(),
    })
    return data.incidents ?? data
  } catch (err) {
    return rejectWithValue(err.response?.data ?? 'Failed to fetch incidents')
  }
})

export const fetchIncident = createAsyncThunk('incidents/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API}/api/incidents/${id}`, {
      headers: authHeaders(),
    })
    return data.incident ?? data
  } catch (err) {
    return rejectWithValue(err.response?.data ?? 'Failed to fetch incident')
  }
})

export const triageIncident = createAsyncThunk('incidents/triage', async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API}/api/incidents/${id}/triage`, {}, {
      headers: authHeaders(),
    })
    return { id, triage: data }
  } catch (err) {
    return rejectWithValue(err.response?.data ?? 'Failed to triage')
  }
})

export const generatePostmortem = createAsyncThunk('incidents/postmortem', async ({ id, body }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API}/api/incidents/${id}/postmortem`, body, {
      headers: authHeaders(),
    })
    return { id, postmortem: data }
  } catch (err) {
    return rejectWithValue(err.response?.data ?? 'Failed to generate postmortem')
  }
})

const DEMO_INCIDENTS = [
  { id: 'INC-041', title: 'API Gateway timeout spike', status: 'investigating', severity: 'critical', service: 'API Gateway', assignees: ['Alex Kim', 'Sara Patel'], createdAt: 'May 2, 4:12 AM', assignedAt: 'May 2, 4:18 AM' },
  { id: 'INC-040', title: 'Database connection pool exhausted', status: 'open', severity: 'high', service: 'PostgreSQL', assignees: ['James Lee'], createdAt: 'May 2, 3:47 AM', assignedAt: 'May 2, 3:50 AM' },
  { id: 'INC-039', title: 'CDN cache invalidation failure', status: 'investigating', severity: 'medium', service: 'CDN', assignees: ['Priya Nair', 'Alex Kim'], createdAt: 'May 1, 11:30 PM', assignedAt: 'May 2, 12:05 AM' },
  { id: 'INC-038', title: 'Payment service 503 errors', status: 'resolved', severity: 'critical', service: 'Payments', assignees: ['Sara Patel'], createdAt: 'May 1, 8:00 PM', assignedAt: 'May 1, 8:04 PM' },
  { id: 'INC-037', title: 'Auth token expiry not refreshing', status: 'resolved', severity: 'high', service: 'Auth', assignees: ['James Lee', 'Priya Nair'], createdAt: 'May 1, 2:15 PM', assignedAt: 'May 1, 2:20 PM' },
  { id: 'INC-036', title: 'Notification queue backlog', status: 'open', severity: 'low', service: 'Notifications', assignees: [], createdAt: 'May 1, 9:00 AM' },
]

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState: {
    list: DEMO_INCIDENTS,
    current: null,
    loading: false,
    triageLoading: false,
    postmortemLoading: false,
    error: null,
    triageData: {},
    postmortemData: {},
  },
  reducers: {
    addRealtimeIncident: (state, action) => {
      const exists = state.list.find((i) => i.id === action.payload.id)
      if (!exists) state.list.unshift(action.payload)
    },
    updateRealtimeIncident: (state, action) => {
      const idx = state.list.findIndex((i) => i.id === action.payload.id)
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload }
      if (state.current?.id === action.payload.id) {
        state.current = { ...state.current, ...action.payload }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncidents.pending, (s) => { s.loading = true; s.error = null })
      .addCase(fetchIncidents.fulfilled, (s, a) => { s.loading = false; s.list = a.payload })
      .addCase(fetchIncidents.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(fetchIncident.fulfilled, (s, a) => { s.current = a.payload })
      .addCase(triageIncident.pending, (s) => { s.triageLoading = true })
      .addCase(triageIncident.fulfilled, (s, a) => { s.triageLoading = false; s.triageData[a.payload.id] = a.payload.triage })
      .addCase(triageIncident.rejected, (s) => { s.triageLoading = false })
      .addCase(generatePostmortem.pending, (s) => { s.postmortemLoading = true })
      .addCase(generatePostmortem.fulfilled, (s, a) => { s.postmortemLoading = false; s.postmortemData[a.payload.id] = a.payload.postmortem })
      .addCase(generatePostmortem.rejected, (s) => { s.postmortemLoading = false })
  },
})

export const { addRealtimeIncident, updateRealtimeIncident } = incidentsSlice.actions
export default incidentsSlice.reducer
