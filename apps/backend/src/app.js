import { incidentSchema } from '@resolver/ui/schemas/incident'
import cors from 'cors'
import express from 'express'

export function createApp() {
  const app = express()
  app.use(cors({ origin: true, credentials: true }))
  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'resolver-backend' })
  })

  app.get('/api/incidents/example', (_req, res) => {
    const demo = incidentSchema.safeParse({
      id: 'inc_demo_001',
      title: 'Staging latency spike',
      status: 'acknowledged',
      orgId: 'org_demo',
      updatedAt: new Date().toISOString(),
    })
    if (!demo.success) {
      res.status(500).json({ error: 'schema_mismatch', issues: demo.error.flatten() })
      return
    }
    res.json(demo.data)
  })

  return app
}
