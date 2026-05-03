import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
import { StatusBadge, Avatar, TimelineItem } from '@resolver/ui'
import { triageIncident, updateRealtimeIncident } from '../store/incidentsSlice.js'
import { 
  Sparkles, 
  Zap, 
  Send, 
  RotateCcw, 
  Paperclip, 
  AtSign, 
  ChevronRight,
  MessageSquare,
  AlertTriangle
} from 'lucide-react'

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
  /** @type {any} */
  const dispatch = useDispatch();
  const { list, triageLoading, triageData } = useSelector((/** @type {any} */ s) => s.incidents)

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
    return () => { socket.disconnect(); }
  }, [incidentId, dispatch])

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = 0
  }, [timeline.length])

  function handleTriage() {
    dispatch(/** @type {any} */(triageIncident)(incidentId))
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

  const [activeTab, setActiveTab] = useState('Update')

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 min-h-screen bg-[#fafbfc]">
      {/* LEFT COLUMN */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Problem Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white/50">
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] font-bold text-slate-800">Problem</h2>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-100 text-[#4f46e5]">
                <Sparkles size={12} fill="currentColor" className="opacity-80" />
                <span className="text-[10px] font-bold uppercase tracking-wider">AI Analysis</span>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <ul className="flex flex-col gap-2.5">
                {triage.summary.map((point, i) => (
                  <li key={i} className="text-[13px] text-slate-600 leading-relaxed font-medium">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Solution Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white/50">
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] font-bold text-slate-800">Solution</h2>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-100 text-[#4f46e5]">
                <Zap size={12} fill="currentColor" className="opacity-80" />
                <span className="text-[10px] font-bold uppercase tracking-wider">AI Suggested</span>
              </div>
            </div>
          </div>
          <div className="p-5 flex flex-col gap-5">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <ul className="flex flex-col gap-2.5">
                {triage.suggestions.map((point, i) => (
                  <li key={i} className="text-[13px] text-slate-600 leading-relaxed font-medium">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white text-[#4f46e5] text-[13px] font-bold hover:bg-indigo-50 transition-colors"
              >
                <Send size={16} />
                Send Report
              </button>
              <button
                type="button"
                className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl bg-[#4f46e5] text-white text-[13px] font-bold hover:bg-[#4338ca] transition-all shadow-md shadow-indigo-100"
              >
                <RotateCcw size={16} />
                Reverify Code
              </button>
            </div>
          </div>
        </div>

        {/* Update / Input Section */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 p-2 bg-slate-50/50 border-b border-slate-100">
            {['Update', 'Escalation', 'Note'].map((tab) => (
              <button
                key={tab}
                onClick={() => setUpdateType(tab)}
                className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${
                  updateType === tab 
                    ? 'bg-indigo-50 text-[#4f46e5] border border-indigo-100' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-4">
            <textarea
              rows={4}
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              placeholder="Add update, escalation, or note..."
              className="w-full text-[14px] text-slate-700 placeholder:text-slate-400 border-none outline-none resize-none focus:ring-0"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) postUpdate()
              }}
            />
            <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-4 text-slate-400">
                <button type="button" className="hover:text-slate-600 transition-colors">
                  <Paperclip size={18} />
                </button>
                <button type="button" className="hover:text-slate-600 transition-colors">
                  <AtSign size={18} />
                </button>
              </div>
              <button
                type="button"
                onClick={postUpdate}
                className="h-10 px-6 rounded-xl bg-[#4f46e5] text-white text-[13px] font-bold hover:bg-[#4338ca] transition-all"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN — Latest Incidents / Timeline */}
      <div className="w-full lg:w-[380px] shrink-0">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col min-h-full">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-[15px] font-bold text-slate-800">Latest Incidents</h2>
          </div>
          
          <div ref={feedRef} className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-0">
            {timeline.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <MessageSquare size={32} className="opacity-20 mb-3" />
                <p className="text-[13px]">No updates yet</p>
              </div>
            ) : (
              timeline.map((item, idx) => (
                <TimelineItem 
                  key={item.id} 
                  variant="light" 
                  item={item} 
                  isLast={idx === timeline.length - 1} 
                />
              ))
            )}
          </div>

          <div className="px-6 py-4 border-t border-slate-100">
            <button
              onClick={() => navigate('/incidents')}
              className="flex items-center gap-1.5 text-[13px] font-bold text-[#4f46e5] hover:gap-2 transition-all"
            >
              View all incidents
              <ChevronRight size={16} />
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
