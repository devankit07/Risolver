import { createServer } from 'http'
import { Server } from 'socket.io'
import app from './src/app.js'
import { connectDB } from './src/config/database.js'
import { config } from './src/config/config.js'

const httpServer = createServer(app)

function socketCorsAllowed(origin) {
  if (!origin) return true
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) return true
  if (/^https:\/\/([a-z0-9-]+)\.onrender\.com$/i.test(origin)) return true
  if (/^https:\/\/([a-z0-9-]+\.)*vercel\.app$/i.test(origin)) return true
  const extra = (process.env.CORS_EXTRA_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return extra.includes(origin)
}

const io = new Server(httpServer, {
  cors: {
    origin(origin, cb) {
      cb(null, socketCorsAllowed(origin))
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
  });
