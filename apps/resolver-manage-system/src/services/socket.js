import { io } from 'socket.io-client'

const URL = import.meta.env.VITE_API_URL || 'http://localhost:5173'

const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
})

export function connectSocket({ userId, orgId, role }) {
  if (!socket.connected) socket.connect()
  socket.emit('join', { userId, orgId, role })
}

export function disconnectSocket() {
  if (socket.connected) socket.disconnect()
}

export default socket
