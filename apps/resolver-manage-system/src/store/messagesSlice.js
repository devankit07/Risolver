import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api.js'

export const fetchThreads = createAsyncThunk('messages/fetchThreads', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/messages/threads')
    return res.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message ?? 'Failed to fetch threads')
  }
})

export const fetchThread = createAsyncThunk('messages/fetchThread', async (otherUserId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/messages/thread/${otherUserId}`)
    return { ...res.data.data, otherUserId }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message ?? 'Failed to fetch thread')
  }
})

export const sendMessageThunk = createAsyncThunk('messages/send', async ({ receiverId, content, incidentRef }, { rejectWithValue }) => {
  try {
    const res = await api.post('/messages/send', { receiverId, content, incidentRef })
    return res.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message ?? 'Failed to send message')
  }
})

export const fetchSearchUsers = createAsyncThunk('messages/searchUsers', async (search, { rejectWithValue }) => {
  try {
    const res = await api.get(`/messages/users?search=${encodeURIComponent(search ?? '')}`)
    return res.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message ?? 'Failed to search users')
  }
})

export const fetchBroadcasts = createAsyncThunk('messages/fetchBroadcasts', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/broadcasts')
    return res.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message ?? 'Failed to fetch broadcasts')
  }
})

export const sendBroadcast = createAsyncThunk('messages/sendBroadcast', async ({ title, content, targetRoles }, { rejectWithValue }) => {
  try {
    const res = await api.post('/broadcasts', { title, content, targetRoles })
    return res.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message ?? 'Failed to send broadcast')
  }
})

export const markBroadcastRead = createAsyncThunk('messages/markBroadcastRead', async (broadcastId, { rejectWithValue }) => {
  try {
    await api.patch(`/broadcasts/${broadcastId}/read`)
    return broadcastId
  } catch (err) {
    return rejectWithValue(err.response?.data?.message ?? 'Failed to mark as read')
  }
})

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    threads: [],
    activeThread: null,
    activeThreadUserId: null,
    broadcasts: [],
    searchUsers: [],
    loadingThreads: false,
    loadingMessages: false,
    loadingBroadcasts: false,
    sendingMessage: false,
    activeTab: 'threads',
    conversations: [],
    activeConversationId: null,
  },
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload
    },
    setActiveThreadUserId: (state, action) => {
      state.activeThreadUserId = action.payload
    },
    clearActiveThread: (state) => {
      state.activeThread = null
      state.activeThreadUserId = null
    },
    receiveMessage: (state, action) => {
      const { message, threadId } = action.payload
      if (state.activeThread && state.activeThreadUserId === String(message.sender?._id ?? message.sender)) {
        state.activeThread.messages.push(message)
      }
      const idx = state.threads.findIndex((t) => t.threadId === threadId)
      if (idx !== -1) {
        state.threads[idx].lastMessage = { content: message.content, createdAt: message.createdAt, senderId: String(message.sender?._id ?? message.sender) }
        state.threads[idx].unreadCount = (state.threads[idx].unreadCount ?? 0) + 1
        const [thread] = state.threads.splice(idx, 1)
        state.threads.unshift(thread)
      }
    },
    addSentMessage: (state, action) => {
      const { message, threadId } = action.payload
      if (state.activeThread && state.activeThreadUserId) {
        const isCurrentThread = state.activeThread.messages.some((m) => m.threadId === threadId) ||
          String(state.activeThreadUserId) === String(message.receiver)
        if (isCurrentThread) {
          const exists = state.activeThread.messages.find((m) => String(m._id) === String(message._id))
          if (!exists) state.activeThread.messages.push(message)
        }
      }
      const idx = state.threads.findIndex((t) => t.threadId === threadId)
      if (idx !== -1) {
        state.threads[idx].lastMessage = { content: message.content, createdAt: message.createdAt, senderId: String(message.sender?._id ?? message.sender) }
        const [thread] = state.threads.splice(idx, 1)
        state.threads.unshift(thread)
      }
    },
    markThreadRead: (state, action) => {
      const threadId = action.payload
      const idx = state.threads.findIndex((t) => t.threadId === threadId)
      if (idx !== -1) state.threads[idx].unreadCount = 0
    },
    addBroadcast: (state, action) => {
      const exists = state.broadcasts.find((b) => String(b._id) === String(action.payload._id))
      if (!exists) state.broadcasts.unshift(action.payload)
    },
    clearSearchUsers: (state) => {
      state.searchUsers = []
    },
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.pending, (s) => { s.loadingThreads = true })
      .addCase(fetchThreads.fulfilled, (s, a) => {
        s.loadingThreads = false
        s.threads = a.payload?.threads ?? []
      })
      .addCase(fetchThreads.rejected, (s) => { s.loadingThreads = false })

      .addCase(fetchThread.pending, (s) => { s.loadingMessages = true })
      .addCase(fetchThread.fulfilled, (s, a) => {
        s.loadingMessages = false
        s.activeThread = { messages: a.payload?.messages ?? [], otherUser: a.payload?.otherUser ?? null }
        s.activeThreadUserId = a.payload?.otherUserId ?? null
        const threadId = s.threads.find((t) => String(t.otherUser?._id) === String(a.payload?.otherUserId))?.threadId
        if (threadId) {
          const idx = s.threads.findIndex((t) => t.threadId === threadId)
          if (idx !== -1) s.threads[idx].unreadCount = 0
        }
      })
      .addCase(fetchThread.rejected, (s) => { s.loadingMessages = false })

      .addCase(sendMessageThunk.pending, (s) => { s.sendingMessage = true })
      .addCase(sendMessageThunk.fulfilled, (s, a) => {
        s.sendingMessage = false
        if (s.activeThread) {
          const exists = s.activeThread.messages.find((m) => String(m._id) === String(a.payload?.message?._id))
          if (!exists && a.payload?.message) s.activeThread.messages.push(a.payload.message)
        }
      })
      .addCase(sendMessageThunk.rejected, (s) => { s.sendingMessage = false })

      .addCase(fetchSearchUsers.fulfilled, (s, a) => {
        s.searchUsers = a.payload?.users ?? []
      })

      .addCase(fetchBroadcasts.pending, (s) => { s.loadingBroadcasts = true })
      .addCase(fetchBroadcasts.fulfilled, (s, a) => {
        s.loadingBroadcasts = false
        s.broadcasts = a.payload?.broadcasts ?? []
      })
      .addCase(fetchBroadcasts.rejected, (s) => { s.loadingBroadcasts = false })

      .addCase(sendBroadcast.fulfilled, (s, a) => {
        if (a.payload?.broadcast) s.broadcasts.unshift({ ...a.payload.broadcast, isRead: true })
      })

      .addCase(markBroadcastRead.fulfilled, (s, a) => {
        const idx = s.broadcasts.findIndex((b) => String(b._id) === String(a.payload))
        if (idx !== -1) s.broadcasts[idx].isRead = true
      })
  },
})

export const {
  setActiveTab,
  setActiveThreadUserId,
  clearActiveThread,
  receiveMessage,
  addSentMessage,
  markThreadRead,
  addBroadcast,
  clearSearchUsers,
  setActiveConversation,
} = messagesSlice.actions

export default messagesSlice.reducer
