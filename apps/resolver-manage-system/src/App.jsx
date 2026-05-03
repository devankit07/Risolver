import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import AppLayout from './layouts/AppLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Workspace from './pages/Workspace.jsx'
import Team from './pages/Team.jsx'
import Profile from './pages/Profile.jsx'
import Messages from './pages/Messages.jsx'
import Reports from './pages/Reports.jsx'
import ReportDetail from './pages/ReportDetail.jsx'
import ActiveIncidents from './pages/ActiveIncidents.jsx'
import WorkspaceHub from './pages/WorkspaceHub.jsx'
import Login from './pages/Login.jsx'
import Join from './pages/Join.jsx'
import socket, { connectSocket, disconnectSocket } from './services/socket.js'
import api from './services/api.js'
import { updateMemberStatus, addNotification } from './store/teamSlice.js'
import {
  addRealtimeIncident,
  updateRealtimeIncident,
  prependIncident,
  updateIncidentInList,
  updateIncidentStatusInList,
} from './store/incidentsSlice.js'
import { updatePostmortemStatus } from './store/postmortemsSlice.js'

function SocketConnector() {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.user)

  useEffect(() => {
    if (!user) return

    const userId = String(user._id ?? user.id ?? '')
    const orgId = String(user.organizationId ?? '')
    const role = user.role ?? ''

    connectSocket({ userId, orgId, role })
    void api.patch(`/users/${userId}/status`, { status: 'online' }).catch(() => {})

    const onStatus = ({ userId: uid, status }) => {
      dispatch(updateMemberStatus({ userId: uid, status }))
    }
    const onNotification = (notification) => {
      dispatch(addNotification(notification))
    }
    const onIncidentNew = (incident) => {
      const assigneeRaw = incident?.assignedTo
      const assigneeId =
        assigneeRaw && typeof assigneeRaw === 'object'
          ? String(assigneeRaw._id ?? assigneeRaw.id ?? '')
          : String(assigneeRaw ?? '')
      const privileged = ['admin', 'manager'].includes(role)
      const includeForMyList = privileged || assigneeId === userId
      if (!includeForMyList) return
      dispatch(addRealtimeIncident(incident))
      dispatch(prependIncident(incident))
    }
    const onIncidentUpdate = (incident) => {
      dispatch(updateRealtimeIncident(incident))
    }
    const onIncidentUpdated = ({ incidentId, changes }) => {
      dispatch(updateIncidentInList({ incidentId, changes }))
    }
    const onIncidentStatus = ({ incidentId, status }) => {
      dispatch(updateIncidentStatusInList({ incidentId, status }))
    }
    const onPostmortemPublished = (pm) => {
      dispatch(updatePostmortemStatus({ id: pm._id, status: 'published' }))
    }

    socket.on('user:status', onStatus)
    socket.on('notification:new', onNotification)
    socket.on('incident:new', onIncidentNew)
    socket.on('incident:update', onIncidentUpdate)
    socket.on('incident:updated', onIncidentUpdated)
    socket.on('incident:statusChanged', onIncidentStatus)
    socket.on('postmortem:published', onPostmortemPublished)

    return () => {
      socket.off('user:status', onStatus)
      socket.off('notification:new', onNotification)
      socket.off('incident:new', onIncidentNew)
      socket.off('incident:update', onIncidentUpdate)
      socket.off('incident:updated', onIncidentUpdated)
      socket.off('incident:statusChanged', onIncidentStatus)
      socket.off('postmortem:published', onPostmortemPublished)
      disconnectSocket()
    }
  }, [user, dispatch])

  return null
}

export default function App() {
  return (
    <>
      <SocketConnector />
      <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard"             element={<Dashboard />} />
        <Route path="/incidents/active"      element={<ActiveIncidents />} />
        <Route path="/incidents"             element={<Navigate to="/incidents/active" replace />} />
        <Route path="/workspace"             element={<WorkspaceHub />} />
        <Route path="/workspace/:incidentId" element={<Workspace />} />
        <Route path="/team"                  element={<Team />} />
        <Route path="/team/:userId"          element={<Profile />} />
        <Route path="/messages"              element={<Messages />} />
        <Route path="/reports"               element={<Reports />} />
        <Route path="/reports/:id"           element={<ReportDetail />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/join"  element={<Join />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
    </>
  )
}
