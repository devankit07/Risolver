import { createServer } from 'http'
import { Server } from 'socket.io'
import app from './src/app.js'
import { connectDB } from './src/config/database.js'
import { config } from './src/config/config.js'

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin(origin, cb) {
      if (
        !origin ||
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
        origin === 'https://server-production-a2c4.up.railway.app'
      ) {
        cb(null, true)
      } else {
        cb(null, false)
      }
    },
    credentials: true,
    methods: ['GET', 'POST'],
  },
})

app.set('io', io)

io.on('connection', (socket) => {
  socket.on('join', ({ userId, orgId, role }) => {
    if (orgId) socket.join(String(orgId))
    if (userId) socket.join(`user:${String(userId)}`)
    if (role) socket.join(`role:${String(role)}`)
  })

  socket.on('disconnect', () => {})
})

connectDB()
  .then(() => {
    const port = Number(config.PORT)
    httpServer.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`)
    })
  })
  .catch((err) => {
    console.error('Fatal startup error:', err.message)
    process.exit(1)
  })
