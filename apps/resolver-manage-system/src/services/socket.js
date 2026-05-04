import { io } from 'socket.io-client'

const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5173/api').replace('/api', '')

const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ['websocket', 'polling'],
})

export function connectSocket({ userId, orgId, role }) {
  if (!socket.connected) socket.connect()
  socket.emit('join', { userId, orgId, role })
}

export function disconnectSocket() {
  if (socket.connected) socket.disconnect()
}

export default socket
