import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api.js'

export const fetchStats = createAsyncThunk('dashboard/stats', async () => {
  const res = await api.get('/dashboard/stats')
  return res.data.data
})

export const fetchChart = createAsyncThunk('dashboard/chart', async () => {
  const res = await api.get('/dashboard/chart')
  return res.data.data
})

export const fetchInsights = createAsyncThunk('dashboard/insights', async () => {
  const res = await api.post('/dashboard/insights')
  return res.data.data
})

export const fetchRecentActivity = createAsyncThunk('dashboard/activity', async () => {
  const res = await api.get('/dashboard/recent-activity')
  return res.data.data
})

export const fetchMessagePreviews = createAsyncThunk('dashboard/messages', async () => {
  const res = await api.get('/dashboard/message-previews')
  return res.data.data
})

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: null,
    chart: [],
    insights: [],
    activities: [],
    messagePreviews: [],
    statsLoading: false,
    chartLoading: false,
    insightsLoading: false,
    activityLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (s) => { s.statsLoading = true })
      .addCase(fetchStats.fulfilled, (s, a) => {
        s.statsLoading = false
        s.stats = a.payload
      })
      .addCase(fetchStats.rejected, (s) => { s.statsLoading = false })

      .addCase(fetchChart.pending, (s) => { s.chartLoading = true })
      .addCase(fetchChart.fulfilled, (s, a) => {
        s.chartLoading = false
        s.chart = a.payload?.chart ?? []
      })
      .addCase(fetchChart.rejected, (s) => { s.chartLoading = false })

      .addCase(fetchInsights.pending, (s) => { s.insightsLoading = true })
      .addCase(fetchInsights.fulfilled, (s, a) => {
        s.insightsLoading = false
        s.insights = a.payload?.insights ?? []
      })
      .addCase(fetchInsights.rejected, (s) => { s.insightsLoading = false })

      .addCase(fetchRecentActivity.pending, (s) => { s.activityLoading = true })
      .addCase(fetchRecentActivity.fulfilled, (s, a) => {
        s.activityLoading = false
        s.activities = a.payload?.activities ?? []
      })
      .addCase(fetchRecentActivity.rejected, (s) => { s.activityLoading = false })

      .addCase(fetchMessagePreviews.fulfilled, (s, a) => {
        s.messagePreviews = a.payload?.previews ?? []
      })
  },
})

export default dashboardSlice.reducer
