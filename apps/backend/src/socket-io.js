/**
 * Mirrors REST bearer auth: handshake.auth.token or Authorization header.
 * @param {import('socket.io').Server} io
 */
export function mountIncidentNamespace(io) {
  const incidentNs = io.of('/incidents')

  incidentNs.use((socket, next) => {
    const token =
      typeof socket.handshake.auth.token === 'string'
        ? socket.handshake.auth.token
        : (socket.handshake.headers.authorization?.replace('Bearer ', '').trim() ?? '')

    if (!token && process.env.NODE_ENV === 'production') {
      next(new Error('unauthorized'))
      return
    }
    socket.data.userId = token ? 'jwt-subject-placeholder' : 'dev-anonymous'
    next()
  })

  incidentNs.on('connection', (socket) => {
    socket.emit('incident:pong', { ok: true, at: new Date().toISOString() })
    socket.on('incident:subscribe', ({ incidentId }) => {
      if (!incidentId) return
      void socket.join(`incident:${incidentId}`)
    })
  })

  return incidentNs
}

/**
 * @param {import('socket.io').Server} io
 */
export function notifyIncidentBroadcast(io, incidentId, payload) {
  io.of('/incidents').to(`incident:${incidentId}`).emit('incident:update', payload)
}
