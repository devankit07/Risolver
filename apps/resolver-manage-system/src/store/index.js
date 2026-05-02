import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import incidentsReducer from './incidentsSlice.js'
import teamReducer from './teamSlice.js'
import messagesReducer from './messagesSlice.js'
import uiReducer from './uiSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    incidents: incidentsReducer,
    team: teamReducer,
    messages: messagesReducer,
    ui: uiReducer,
  },
})
