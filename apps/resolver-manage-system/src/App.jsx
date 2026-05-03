import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Workspace from './pages/Workspace.jsx'
import Team from './pages/Team.jsx'
import Profile from './pages/Profile.jsx'
import Messages from './pages/Messages.jsx'
import Reports from './pages/Reports.jsx'
import ReportDetail from './pages/ReportDetail.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard"             element={<Dashboard />} />
        <Route path="/incidents"             element={<Navigate to="/dashboard" replace />} />
        <Route path="/workspace/:incidentId" element={<Workspace />} />
        <Route path="/team"                  element={<Team />} />
        <Route path="/team/:userId"          element={<Profile />} />
        <Route path="/messages"              element={<Messages />} />
        <Route path="/reports"               element={<Reports />} />
        <Route path="/reports/:id"           element={<ReportDetail />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
