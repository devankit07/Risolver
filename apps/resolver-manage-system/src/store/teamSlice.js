import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { authHeaders } from '../utils/authHeaders.js'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:5173'

export const fetchTeam = createAsyncThunk('team/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API}/api/team`, {
      headers: authHeaders(),
    })
    return data.members ?? data
  } catch {
    return rejectWithValue('Failed to fetch team')
  }
})

const DEMO_MEMBERS = [
  { id: 'u1', name: 'Alex Kim',    role: 'Admin',    status: 'online',  email: 'alex@resolver.io',  incidentsThisWeek: 8,  lastActive: 'Now' },
  { id: 'u2', name: 'Sara Patel',  role: 'Engineer', status: 'online',  email: 'sara@resolver.io',  incidentsThisWeek: 5,  lastActive: 'Now' },
  { id: 'u3', name: 'James Lee',   role: 'DevOps',   status: 'away',    email: 'james@resolver.io', incidentsThisWeek: 3,  lastActive: '15m ago' },
  { id: 'u4', name: 'Priya Nair',  role: 'Manager',  status: 'online',  email: 'priya@resolver.io', incidentsThisWeek: 12, lastActive: 'Now' },
  { id: 'u5', name: 'Tom Wick',    role: 'Engineer', status: 'offline', email: 'tom@resolver.io',   incidentsThisWeek: 2,  lastActive: '2h ago' },
  { id: 'u6', name: 'Nia Brooks',  role: 'Viewer',   status: 'offline', email: 'nia@resolver.io',   incidentsThisWeek: 0,  lastActive: '1d ago' },
]

const teamSlice = createSlice({
  name: 'team',
  initialState: {
    members: DEMO_MEMBERS,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeam.pending, (s) => { s.loading = true })
      .addCase(fetchTeam.fulfilled, (s, a) => { s.loading = false; s.members = a.payload })
      .addCase(fetchTeam.rejected, (s, a) => { s.loading = false; s.error = a.payload })
  },
})

export default teamSlice.reducer
