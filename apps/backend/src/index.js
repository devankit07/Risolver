import 'dotenv/config'
import http from 'node:http'
import { Server as SocketIOServer } from 'socket.io'
import { createApp } from './app.js'
import { disconnectMongo, connectMongo } from './mongo.js'
import { mountIncidentNamespace, notifyIncidentBroadcast } from './socket-io.js'

const preferredPort = Number(process.env.PORT ?? 5173)
const mongoUri = process.env.MONGODB_URI

/** Tries preferredPort then preferredPort+1… when EADDRINUSE (up to maxAttempts). */
async function listenWithPortFallback(server, startPort, maxAttempts = 30) {
  const base = Number(startPort)
  if (!Number.isFinite(base)) throw new TypeError(`Invalid PORT: ${startPort}`)

  let lastErr
  for (let i = 0; i < maxAttempts; i++) {
    const port = base + i
    try {
      await new Promise((resolve, reject) => {
        const onErr = (err) => {
          server.removeListener('error', onErr)
          reject(err)
        }
        server.once('error', onErr)
        server.listen(port, () => {
          server.removeListener('error', onErr)
          resolve(undefined)
        })
      })
      if (i > 0) console.warn(`[resolver-backend] Port ${base} busy; using ${port}`)
      return port
    } catch (err) {
      lastErr = err
      if (err.code !== 'EADDRINUSE') throw err
    }
  }
  throw lastErr
}

async function bootstrap() {
  if (mongoUri) {
    try {
      await connectMongo(mongoUri)
      console.warn('[resolver-backend] Connected to MongoDB')
    } catch (error) {
      console.error('[resolver-backend] Mongo connection failed:', error)
    }
  } else {
    console.warn('[resolver-backend] MONGODB_URI not set; continuing without persistence')
  }

  const app = createApp()
  const server = http.createServer(app)

  const io = new SocketIOServer(server, {
    cors: { origin: true, credentials: true },
  })

  mountIncidentNamespace(io)

  app.post('/api/incidents/demo-broadcast/:id', (req, res) => {
    const incidentId = req.params.id
    notifyIncidentBroadcast(io, incidentId, {
      incidentId,
      message: 'Demo broadcast from resolver backend',
      at: new Date().toISOString(),
    })
    res.json({ ok: true })
  })

  const port = await listenWithPortFallback(server, preferredPort)
  console.warn(`[resolver-backend] Listening on ${port}`)

  process.on('SIGINT', async () => {
    await disconnectMongo().catch(() => undefined)
    server.close(() => process.exit(0))
  })

  process.on('SIGTERM', async () => {
    await disconnectMongo().catch(() => undefined)
    server.close(() => process.exit(0))
  })
}

void bootstrap()
