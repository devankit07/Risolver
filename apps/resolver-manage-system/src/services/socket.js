import { io } from 'socket.io-client'
import { getSocketOrigin } from '../config/apiUrl.js'

const SOCKET_URL = getSocketOrigin()

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
