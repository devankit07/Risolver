import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
import { AiTriageCard, PostmortemGenerator, TimelineItem, StatusBadge, Avatar } from '@resolver/ui'
import { triageIncident, generatePostmortem, updateRealtimeIncident } from '../store/incidentsSlice.js'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:5173'
const IN = '#4f46e5'
const BK = '#0f172a'

const DEMO_TIMELINE = [
  { id: 't1', type: 'ai', timestamp: '4:02 AM', author: null, content: 'Incident auto-detected: elevated error rate on API Gateway. P99 latency jumped to 8.2s.', isAi: true },
  { id: 't2', type: 'escalation', timestamp: '4:05 AM', author: 'Alex Kim', content: 'Severity escalated to Critical. Paging on-call team.' },
  { id: 't3', type: 'update', timestamp: '4:10 AM', author: 'Sara Patel', content: 'Investigating upstream DB connection pool. Pool usage at 98%.' },
  { id: 't4', type: 'change', timestamp: '4:18 AM', author: 'James Lee', content: 'Increased DB connection pool limit to 200. Restarting DB proxy service.' },
  { id: 't5', type: 'update', timestamp: '4:22 AM', author: 'Sara Patel', content: 'Error rate dropping. API latency returning to normal levels.' },
]

const DEMO_TRIAGE = {
  summary: [
    'API Gateway experiencing timeout errors under peak load',
    'Root cause: PostgreSQL connection pool exhausted (98% utilization)',
    'Affects all downstream services dependent on the primary DB cluster',
    'Estimated 12% of requests failing with 503 responses',
  ],
  suggestions: [
    'Increase DB connection pool limit from 100 to 200 immediately',
    'Restart DB proxy service after pool limit change',
    'Enable read replicas to offload SELECT queries',
    'Set up connection pool alerting threshold at 80%',
    'Review slow query log — potential N+1 query causing pool pressure',
  ],
}

const UPDATE_TYPES = ['Update', 'Escalate', 'Note']

export default function Workspace() {
  const { incidentId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { list, triageLoading, triageData } = useSelector((s) => s.incidents)

  const incident = list.find((i) => i.id === incidentId) ?? {
    id: incidentId,
    title: 'Loading incident…',
    status: 'investigating',
    severity: 'critical',
    service: 'Unknown',
    assignees: ['Alex Kim', 'Sara Patel'],
    createdAt: '—',
  }

  const [timeline, setTimeline] = useState(DEMO_TIMELINE)
  const [updateText, setUpdateText] = useState('')
  const [updateType, setUpdateType] = useState('Update')
  const triage = triageData[incidentId] ?? DEMO_TRIAGE
  const feedRef = useRef(null)

  useEffect(() => {
    const socket = io(`${API}/incidents`, {
      transports: ['websocket'],
      auth: { token: localStorage.getItem('token') ?? 'dev-admin-session' },
    })
    socket.emit('incident:subscribe', { incidentId })
    socket.on('incident:update', (payload) => {
      dispatch(updateRealtimeIncident(payload))
      if (payload.timelineEntry) {
        setTimeline((prev) => [payload.timelineEntry, ...prev])
      }
    })
    socket.on('incident:new', (payload) => {
      dispatch(updateRealtimeIncident(payload))
    })
    return () => socket.disconnect()
  }, [incidentId, dispatch])

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = 0
  }, [timeline.length])

  function handleTriage() {
    dispatch(triageIncident(incidentId))
  }

  function postUpdate() {
    if (!updateText.trim()) return
    const entry = {
      id: `t${Date.now()}`,
      type: updateType.toLowerCase(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      author: 'You',
      content: updateText.trim(),
    }
    setTimeline((prev) => [entry, ...prev])
    setUpdateText('')
  }

  const sevColor = { critical: BK, high: IN, medium: IN, low: '#94a3b8' }

  return (
    <div className="flex flex-col gap-0 -mx-1 min-h-[calc(100vh-6rem)] md:-mx-2">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-white shrink-0 rounded-t-xl shadow-sm">
        <span className="text-[11px] font-mono px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 font-semibold">
          {incident.id}
        </span>
        <span className="text-[15px] font-semibold flex-1 truncate text-[#0f172a]">{incident.title}</span>
        <StatusBadge variant="light" status={incident.severity} />
        <StatusBadge variant="light" status={incident.status} />
        <button
          type="button"
          className="h-9 px-4 rounded-lg text-[12px] font-semibold bg-[#4f46e5] text-white hover:bg-[#4338ca] shrink-0"
        >
          Resolve incident
        </button>
        <button
          type="button"
          className="w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
        >
          ···
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row bg-slate-50/50 rounded-b-xl border border-t-0 border-slate-200 shadow-sm">
        {/* LEFT — Problem (ref-3) */}
        <div className="w-full lg:w-[280px] shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col gap-3 p-4 overflow-y-auto bg-white">
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Problem</h2>
            <AiTriageCard
              variant="light"
              summary={triage.summary}
              suggestions={triage.suggestions}
              generatedAt="2 min ago"
              isLoading={triageLoading}
            />
          </div>

          <button
            type="button"
            onClick={handleTriage}
            className="w-full py-2 rounded-lg text-[12px] font-semibold border border-[#4f46e5]/30 text-[#4f46e5] bg-[#eef2ff] hover:bg-[#e0e7ff]"
          >
            {triageLoading ? 'Triaging…' : '↺ Re-triage with AI'}
          </button>

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Details</h2>
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 flex flex-col gap-2.5">
              <DetailRow label="Assignees">
                <div className="flex items-center gap-1">
                  {incident.assignees?.slice(0, 3).map((a) => <Avatar key={a} name={a} size={22} />) ?? null}
                  <button type="button" className="text-[10px] ml-1 text-[#4f46e5] font-medium">
                    + Add
                  </button>
                </div>
              </DetailRow>
              <DetailRow label="Service">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                  {incident.service ?? '—'}
                </span>
              </DetailRow>
              <DetailRow label="Created">
                <span className="text-[11px] text-slate-600">{incident.createdAt}</span>
              </DetailRow>
              <DetailRow label="Severity">
                <span className="text-[11px] font-bold" style={{ color: sevColor[incident.severity] ?? '#64748b' }}>
                  {incident.severity?.toUpperCase() ?? '—'}
                </span>
              </DetailRow>
            </div>
          </div>
        </div>

        {/* CENTER — Solutions / timeline */}
        <div className="flex-1 flex flex-col overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200 min-h-[320px] lg:min-h-0 bg-white">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 shrink-0 bg-slate-50/80">
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Solutions</h2>
              <span className="text-[13px] font-semibold text-[#0f172a]">Live timeline</span>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#4f46e5]">
              <span className="w-2 h-2 rounded-full bg-[#4f46e5] animate-pulse" />
              Live
            </span>
          </div>

          <div ref={feedRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-1">
            {timeline.length === 0 ? (
              <p className="text-[13px] text-center mt-12 text-slate-400">No updates yet — post below</p>
            ) : (
              timeline.map((item, idx) => (
                <TimelineItem key={item.id} variant="light" item={item} isLast={idx === timeline.length - 1} />
              ))
            )}
          </div>

          <div className="shrink-0 border-t border-slate-200 px-4 py-3 flex flex-col gap-2 bg-slate-50">
            <textarea
              rows={3}
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              placeholder="Add update, escalation, or note…"
              className="w-full rounded-xl px-3 py-2 text-[13px] resize-none outline-none border border-slate-200 bg-white text-[#0f172a] placeholder:text-slate-400 focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) postUpdate()
              }}
            />
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex gap-1">
                {UPDATE_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setUpdateType(t)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
                      updateType === t
                        ? 'bg-[#eef2ff] text-[#4f46e5] border-[#c7d2fe]'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex-1" />
              <button
                type="button"
                onClick={postUpdate}
                className="h-9 px-5 rounded-lg text-[12px] font-semibold bg-[#4f46e5] text-white hover:bg-[#4338ca]"
              >
                Post
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT — Postmortem + actions */}
        <div className="w-full lg:w-[300px] shrink-0 flex flex-col gap-3 p-4 overflow-y-auto bg-white">
          <PostmortemGenerator
            variant="light"
            incidentId={incidentId}
            initialProblem={triage.summary?.[0] ?? ''}
            onGenerate={async ({ problem, solution }) => {
              const result = await dispatch(generatePostmortem({ id: incidentId, body: { problem, solution } }))
              return result.payload?.postmortem
            }}
          />

          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 flex flex-col gap-2">
            <span className="text-[12px] font-semibold text-[#0f172a]">Quick actions</span>
            {['Add responder', 'Change severity', 'Link related incident'].map((label) => (
              <button
                key={label}
                type="button"
                className="w-full text-left py-2 px-3 rounded-lg text-[12px] border border-slate-200 bg-white text-slate-600 hover:border-[#4f46e5]/40"
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => navigate('/reports')}
              className="w-full text-left py-2 px-1 text-[12px] font-medium text-[#4f46e5] hover:text-[#3730a3]"
            >
              View public status →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[11px] shrink-0 text-slate-500">{label}</span>
      {children}
    </div>
  )
}
