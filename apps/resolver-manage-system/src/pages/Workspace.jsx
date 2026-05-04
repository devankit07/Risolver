import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
import {
  WorkspaceHeader,
  ResolutionMethodCard,
  TimelineItem,
  AiTriageCard,
} from '@resolver/ui'
import { Sparkles, Paperclip, Hash, Github } from 'lucide-react'
import { updateRealtimeIncident } from '../store/incidentsSlice.js'

const API = (import.meta.env.VITE_API_URL ?? '').replace('/api', '')

export default function Workspace() {
  const { incidentId } = useParams()
  const navigate = useNavigate()
  /** @type {any} */
  const dispatch = useDispatch()
  const { list, triageLoading, triageData } = useSelector((/** @type {any} */ s) => s.incidents) // triageLoading drives AI card

  const incident = list.find((i) => i.id === incidentId) ?? {
    id: incidentId ?? '',
    title: incidentId ? `Incident ${incidentId}` : 'Incident',
    status: 'open',
    severity: 'medium',
    service: '—',
    assignees: [],
    createdAt: '—',
  }

  const [timeline, setTimeline] = useState([])
  const [updateText, setUpdateText] = useState('')
  const [updateType, setUpdateType] = useState('Update')
  const [resolution, setResolution] = useState(null)
  const [githubUrl, setGithubUrl] = useState('')
  const [resolved, setResolved] = useState(false)
  const [repoAnalyzing, setRepoAnalyzing] = useState(false)
  const feedRef = useRef(null)

  const rawTriage = triageData[incidentId]
  const triage = {
    summary: Array.isArray(rawTriage?.summary) ? rawTriage.summary : [],
    suggestions: Array.isArray(rawTriage?.suggestions) ? rawTriage.suggestions : [],
  }

  useEffect(() => {
    if (!API) return
    const socket = io(`${API}/incidents`, {
      transports: ['websocket'],
      auth: { token: localStorage.getItem('resolver_token') ?? localStorage.getItem('token') ?? '' },
    })
    socket.emit('incident:subscribe', { incidentId })
    socket.on('incident:update', (payload) => {
      dispatch(updateRealtimeIncident(payload))
      if (payload.timelineEntry) {
        setTimeline((prev) => [payload.timelineEntry, ...prev])
      }
    })
    return () => {
      socket.disconnect()
    }
  }, [incidentId, dispatch])

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

  function handleResolve() {
    setResolved(true)
  }

  function handleAiSolutionConfirm() {
    if (!githubUrl.trim()) return
    setRepoAnalyzing(true)
    window.setTimeout(() => setRepoAnalyzing(false), 1600)
  }

  return (
    <div className="flex flex-col gap-4">
      <WorkspaceHeader
        incidentId={incident.id}
        title={incident.title}
        severity={incident.severity}
        status={incident.status}
        assigneeName={incident.assignees?.[0]}
        onBack={() => navigate(-1)}
        onMarkResolved={handleResolve}
        resolved={resolved}
        resolutionMethod={resolution === 'ai_solution' ? 'AI Solution' : resolution === 'ai_suggestion' ? 'AI Suggestion' : resolution === 'manual' ? 'Manual' : undefined}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[380px_minmax(0,1fr)_280px]">
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          <AiTriageCard
            variant="light"
            summary={triage.summary}
            suggestions={triage.suggestions}
            isLoading={triageLoading}
          />

          {!resolved && (
            <ResolutionMethodCard selected={resolution} onSelect={(m) => setResolution(m)} />
          )}

          {resolution === 'ai_solution' && !resolved && (
            <div className="rounded-[8px] border border-[var(--border,#e2e8f0)] bg-white p-4">
              <label className="text-[12px] font-medium text-[var(--text-secondary,#64748b)]">GitHub repository URL</label>
              <input
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/org/repo"
                className="mt-2 w-full rounded-[8px] border border-[var(--border,#e2e8f0)] px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-[var(--accent,#4f46e5)]/25"
              />
              <button
                type="button"
                onClick={handleAiSolutionConfirm}
                className="mt-3 w-full rounded-[6px] bg-[var(--accent,#4f46e5)] py-2 text-[12px] font-semibold text-white hover:brightness-110"
              >
                Analyze →
              </button>
              {repoAnalyzing && (
                <p className="mt-3 flex items-center gap-2 text-[13px] text-[var(--text-secondary,#64748b)]">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[var(--accent,#4f46e5)] border-t-transparent" />
                  Analyzing repository…
                </p>
              )}
            </div>
          )}

          {resolution && !resolved && (
            <div className="rounded-[8px] border border-violet-200 bg-violet-50 p-4">
              <p className="text-[13px] leading-relaxed text-violet-950">
                {resolution === 'manual'
                  ? 'Describe the remediation in the manual resolution panel below.'
                  : 'AI-generated remediation steps would appear here after analysis completes.'}
              </p>
              {resolution !== 'manual' && (
                <button
                  type="button"
                  onClick={handleResolve}
                  className="mt-4 w-full rounded-[6px] bg-[var(--success,#10b981)] py-2.5 text-[13px] font-semibold text-white hover:brightness-110"
                >
                  Mark as done →
                </button>
              )}
            </div>
          )}

          {resolution === 'manual' && !resolved && (
            <div className="rounded-[8px] border border-[var(--border,#e2e8f0)] bg-white p-4">
              <textarea
                rows={4}
                placeholder="Describe what you did to resolve this…"
                className="w-full rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-base,#f8fafc)] px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-[var(--accent,#4f46e5)]/20"
              />
              <button
                type="button"
                onClick={handleResolve}
                className="mt-3 w-full rounded-[6px] bg-slate-700 py-2.5 text-[13px] font-semibold text-white hover:bg-[var(--accent,#4f46e5)]"
              >
                Submit manually →
              </button>
            </div>
          )}
        </div>

        {/* Column 2 */}
        <div className="flex min-h-[520px] flex-col rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-surface,#fff)]">
          <div className="flex items-center justify-between border-b border-[var(--border,#e2e8f0)] px-4 py-3">
            <span className="text-[13px] font-semibold text-[var(--text-primary,#1e293b)]">Live timeline</span>
            <button type="button" className="rounded-[6px] bg-[var(--accent,#4f46e5)] px-3 py-1 text-[11px] font-semibold text-white">
              Post update
            </button>
          </div>
          <div ref={feedRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            {timeline.length === 0 ? (
              <p className="py-8 text-center text-[13px] text-[var(--text-secondary,#64748b)]">No timeline entries yet.</p>
            ) : (
              timeline.map((item, idx) => (
                <TimelineItem key={item.id} variant="light" item={item} isLast={idx === timeline.length - 1} />
              ))
            )}
          </div>
          <div className="border-t border-[var(--border,#e2e8f0)] p-3">
            <div className="mb-2 flex gap-2">
              {['Update', 'Escalation', 'Note'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setUpdateType(t)}
                  className={`rounded-[6px] px-3 py-1 text-[11px] font-semibold ${
                    updateType === t ? 'bg-[var(--accent-dim,#eef2ff)] text-[var(--accent,#4f46e5)]' : 'text-[var(--text-secondary,#64748b)]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              className="w-full rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-base,#f8fafc)] px-3 py-2 text-[13px] outline-none"
              placeholder="Post an update…"
            />
            <div className="mt-2 flex items-center justify-between">
              <div className="flex gap-2 text-[var(--text-secondary,#64748b)]">
                <Paperclip size={18} />
                <Hash size={18} />
              </div>
              <button
                type="button"
                onClick={postUpdate}
                className="rounded-[6px] bg-[var(--accent,#4f46e5)] px-4 py-2 text-[12px] font-semibold text-white"
              >
                Post
              </button>
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-4">
          <div className="rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-surface,#fff)] p-4">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[var(--text-primary,#1e293b)]">Recent commits</span>
              <Github size={16} className="text-[var(--text-secondary,#64748b)]" />
            </div>
            <p className="mt-1 text-[11px] text-[var(--text-secondary,#64748b)]">from linked repository</p>
            <div className="mt-4 flex flex-col">
              <p className="py-2 text-[13px] text-[var(--text-secondary,#64748b)]">No commits linked yet.</p>
            </div>
            <button type="button" className="mt-3 text-[12px] font-semibold text-[var(--accent,#4f46e5)] hover:underline">
              View on GitHub →
            </button>
          </div>

          <div className="rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-surface,#fff)] p-4">
            <p className="text-[13px] font-semibold text-[var(--text-primary,#1e293b)]">Incident details</p>
            <dl className="mt-3 space-y-2 text-[12px]">
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--text-secondary,#64748b)]">Service</dt>
                <dd className="font-medium">{incident.service}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--text-secondary,#64748b)]">Created</dt>
                <dd>{incident.createdAt}</dd>
              </div>
            </dl>
            {resolved && (
              <p className="mt-4 text-[12px] font-semibold text-[var(--accent,#4f46e5)]">
                <Sparkles className="mr-1 inline h-3 w-3" />
                View full report
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
