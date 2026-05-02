import { createSlice } from '@reduxjs/toolkit'

const DEMO_CONVERSATIONS = [
  {
    id: 'c1',
    name: 'Sara Patel',
    preview: 'Check the DB connection logs — it looks like pool exhaustion',
    timestamp: '4:18 AM',
    unread: 2,
    messages: [
      { id: 'm1', author: 'Sara Patel', content: 'Hey, did you see INC-041? Gateway is timing out again.', timestamp: '4:10 AM', isOwn: false },
      { id: 'm2', author: 'Me', content: 'Yeah, already looking into it. Could be pool exhaustion upstream.', timestamp: '4:12 AM', isOwn: true },
      { id: 'm3', author: 'Sara Patel', content: 'Check the DB connection logs — it looks like pool exhaustion', timestamp: '4:18 AM', isOwn: false },
    ],
  },
  {
    id: 'c2',
    name: 'Alex Kim',
    preview: 'Postmortem for INC-038 is ready for review',
    timestamp: '3:55 AM',
    unread: 0,
    messages: [
      { id: 'm4', author: 'Alex Kim', content: 'Postmortem for INC-038 is ready for review', timestamp: '3:55 AM', isOwn: false },
      { id: 'm5', author: 'Me', content: "Great, I'll take a look now.", timestamp: '3:58 AM', isOwn: true },
    ],
  },
  {
    id: 'c3',
    name: 'Incident — INC-041',
    preview: 'AI: Root cause identified — connection pool limit exceeded',
    timestamp: '4:05 AM',
    unread: 1,
    messages: [
      { id: 'm6', author: 'System', content: 'Root cause identified — connection pool limit exceeded under peak load.', timestamp: '4:05 AM', isOwn: false, isAi: true },
      { id: 'm7', author: 'James Lee', content: 'Increasing pool size to 200 and restarting the service.', timestamp: '4:08 AM', isOwn: false },
    ],
  },
]

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    conversations: DEMO_CONVERSATIONS,
    activeConversationId: 'c1',
  },
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload
      const conv = state.conversations.find((c) => c.id === action.payload)
      if (conv) conv.unread = 0
    },
    sendMessage: (state, action) => {
      const { conversationId, content } = action.payload
      const conv = state.conversations.find((c) => c.id === conversationId)
      if (!conv) return
      const msg = {
        id: `m${Date.now()}`,
        author: 'Me',
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
      }
      conv.messages.push(msg)
      conv.preview = content
      conv.timestamp = msg.timestamp
    },
  },
})

export const { setActiveConversation, sendMessage } = messagesSlice.actions
export default messagesSlice.reducer
