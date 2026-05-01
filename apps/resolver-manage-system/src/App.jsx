import { ResolverSplash } from '@resolver/ui'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5173'

export default function App() {
  const [broadcastState, setBroadcastState] = useState('idle')
  const [socketLine, setSocketLine] = useState('connecting Socket.IO …')

  useEffect(() => {
    const socket = io(`${apiUrl}/incidents`, {
      transports: ['websocket'],
      auth: { token: 'dev-admin-session' },
    })

    socket.on('connect_error', () => setSocketLine('socket connection failed'))
    socket.on('connect', () => setSocketLine('listening on incident namespace ✓'))

    socket.on('incident:update', (payload) =>
      setSocketLine(`incident feed: ${JSON.stringify(payload)}`),
    )

    socket.emit('incident:subscribe', { incidentId: 'inc_demo_001' })

    return () => {
      socket.disconnect()
    }
  }, [])

  async function triggerBroadcast() {
    setBroadcastState('sending...')
    try {
      const response = await fetch(`${apiUrl}/api/incidents/demo-broadcast/inc_demo_001`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      setBroadcastState(JSON.stringify(data))
    } catch (error) {
      setBroadcastState(String(error))
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-resolver-surface px-6 py-16">
      <ResolverSplash
        variant="admin"
        subtitle="Internal manage console wired to the same resolver backend instance as the public site."
      />

      <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-resolver-ink">Simulate live incident</h2>
          <p className="mt-2 text-sm text-resolver-muted">
            POST /api/incidents/demo-broadcast/:id notifies Socket.IO subscribers.
          </p>
          <button
            type="button"
            onClick={() => void triggerBroadcast()}
            className="mt-6 inline-flex rounded-xl bg-resolver-accent px-4 py-2 text-sm font-semibold text-white shadow-md shadow-resolver-accent/35 transition hover:translate-y-[-1px] hover:bg-resolver-accent/95"
          >
            Broadcast demo incident
          </button>
          <p className="mt-4 text-xs text-resolver-muted">{broadcastState}</p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-resolver-ink">WebSocket diagnostics</h2>
          <p className="mt-2 text-sm text-resolver-muted">
            Mirrors REST auth placeholders; tighten JWT validation for production workloads.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-resolver-ink">{socketLine}</p>
        </section>
      </div>
    </main>
  )
}
