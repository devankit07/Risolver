import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: false,
    activeTab: 'all',
  },
  reducers: {
    setSidebarOpen: (state, action) => { state.sidebarOpen = action.payload },
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen },
    setActiveTab: (state, action) => { state.activeTab = action.payload },
  },
})

export const { setSidebarOpen, toggleSidebar, setActiveTab } = uiSlice.actions
export default uiSlice.reducer
