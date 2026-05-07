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
import { Sparkles, Paperclip, Hash, Github, FileText, X } from 'lucide-react'
import { updateRealtimeIncident } from '../store/incidentsSlice.js'
import api from '../services/api.js'
import { getSocketOrigin } from '../config/apiUrl.js'

const API = getSocketOrigin()

export default function Workspace() {
  const { incidentId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { list } = useSelector((s) => s.incidents)
  const incident = list.find((i) => String(i._id || i.id) === incidentId) ?? {
    id: incidentId ?? '',
    title: 'Incident',
    severity: 'high',
    status: 'open'
  }

  const [loadingSummary, setLoadingSummary] = useState(false)
  const [loadingSuggestion, setLoadingSuggestion] = useState(false)
  const [aiSummary, setAiSummary] = useState(null)
  const [aiSuggestion, setAiSuggestion] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [resolved, setResolved] = useState(incident.status === 'resolved')

  const [timeline, setTimeline] = useState([])
  const [updateText, setUpdateText] = useState('')
  const [updateType, setUpdateType] = useState('Update')

  useEffect(() => {
    if (!API) return
    const socketClient = io(`${API}/incidents`, {
      transports: ['websocket'],
      auth: { token: localStorage.getItem('resolver_token') ?? localStorage.getItem('token') ?? '' },
    })
    socketClient.emit('incident:subscribe', { incidentId })
    socketClient.on('incident:update', (payload) => {
      dispatch(updateRealtimeIncident(payload))
      if (payload.timelineEntry) {
        setTimeline((prev) => [payload.timelineEntry, ...prev])
      }
    })
    return () => {
      socketClient.disconnect()
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
  const [aiMode, setAiMode] = useState(null) // 'summary' | 'suggestion'
  const [isResolving, setIsResolving] = useState(false)
  const [reportData, setReportData] = useState({ whatHappened: '', solution: '' })

  const fetchSummary = async () => {
    try {
      setLoadingSummary(true)
      const { data } = await api.get(`/ai/${incidentId}/summarize`)
      setAiSummary(data.summary)
      setAiMode('summary')
      setReportData(prev => ({ ...prev, whatHappened: data.summary?.join('\n') || '' }))
    } catch (err) {
      console.error('Failed to fetch summary', err)
    } finally {
      setLoadingSummary(false)
    }
  }

  const fetchSuggestion = async () => {
    try {
      setLoadingSuggestion(true)
      const { data } = await api.get(`/ai/${incidentId}/suggest-fix`)
      setAiSuggestion(data)
      setAiMode('suggestion')
      // Pre-fill both for suggestion mode
      setReportData({
        whatHappened: aiSummary?.join('\n') || '',
        solution: data.approach || ''
      })
      if (!aiSummary) fetchSummary()
    } catch (err) {
      console.error('Failed to fetch suggestion', err)
    } finally {
      setLoadingSuggestion(false)
    }
  }

  async function handleSendReport() {
    try {
      setSubmitting(true)
      await api.post('/postmortems', {
        incidentId,
        whatHappened: reportData.whatHappened,
        solutionApplied: reportData.solution,
        isAiGenerated: aiMode !== null,
        status: 'pending_approval'
      })
      setResolved(true)
      setIsResolving(false)
    } catch (err) {
      console.error('Failed to send report', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-120px)]">
      <WorkspaceHeader
        incidentId={incident.id}
        title={incident.title}
        severity={incident.severity}
        status={incident.status}
        assigneeName={incident.assignees?.[0]}
        onBack={() => navigate(-1)}
        onMarkResolved={() => setIsResolving(true)}
        resolved={resolved}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-hidden">
        {/* Left Container: Incident & AI */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">{incident.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">{incident.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-2 py-1 bg-slate-100 rounded text-[11px] font-bold text-slate-500 uppercase tracking-wider border border-slate-200">
                Service: {incident.service || '—'}
              </span>
              <span className="px-2 py-1 bg-slate-100 rounded text-[11px] font-bold text-slate-500 uppercase tracking-wider border border-slate-200">
                Severity: {incident.severity}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={fetchSummary}
                disabled={loadingSummary}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all ${aiMode === 'summary' ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/10' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
              >
                <Sparkles className={aiMode === 'summary' ? 'text-indigo-600' : 'text-slate-400'} size={20} />
                <span className="text-[13px] font-bold text-slate-900">AI Summary</span>
                <span className="text-[11px] text-slate-500 text-center">Break incident into points</span>
              </button>

              <button 
                onClick={fetchSuggestion}
                disabled={loadingSuggestion}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all ${aiMode === 'suggestion' ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/10' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-1">
                  <Sparkles className={aiMode === 'suggestion' ? 'text-indigo-600' : 'text-slate-400'} size={20} />
                  <span className="text-indigo-600 font-bold text-[14px]">+</span>
                </div>
                <span className="text-[13px] font-bold text-slate-900">Summary + Fix</span>
                <span className="text-[11px] text-slate-500 text-center">Points + Hint/Approach</span>
              </button>
            </div>
          </div>

          {(aiSummary || aiSuggestion) && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-6">
              <h4 className="text-[13px] font-bold text-indigo-900 mb-4 flex items-center gap-2 uppercase tracking-widest">
                <Sparkles size={14} /> AI Analysis
              </h4>
              
              {aiSummary && (
                <div className="space-y-2 mb-4">
                  <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Breakdown</p>
                  {aiSummary.map((p, i) => (
                    <div key={i} className="flex gap-2 text-[13px] text-slate-700 leading-relaxed">
                      <span className="text-indigo-500 font-black">•</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              )}

              {aiSuggestion && (
                <div className="space-y-2 pt-4 border-t border-indigo-100">
                  <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Suggested Approach (Hint)</p>
                  <p className="text-[13px] text-slate-700 leading-relaxed italic">"{aiSuggestion.approach}"</p>
                </div>
              )}
            </div>
          )}

          {!resolved && (
            <button 
              onClick={() => setIsResolving(true)}
              className="w-full rounded-xl bg-slate-900 py-4 text-sm font-bold text-white shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 mt-auto"
            >
              Resolve Incident →
            </button>
          )}
        </div>

        {/* Right Container: Timeline OR Report Draft */}
        <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-full">
          {!isResolving ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-slate-50/50">
                <span className="text-[13px] font-bold text-slate-900 uppercase tracking-widest">Live timeline</span>
                <div className="flex gap-1">
                  {['Update', 'Escalation', 'Note'].map(t => (
                    <button key={t} onClick={() => setUpdateType(t)} className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${updateType === t ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {timeline.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
                    <Hash size={32} strokeWidth={1} />
                    <p className="text-sm italic">No entries yet.</p>
                  </div>
                ) : (
                  timeline.map((item, idx) => (
                    <TimelineItem key={item.id} variant="light" item={item} isLast={idx === timeline.length - 1} />
                  ))
                )}
              </div>
              <div className="p-4 bg-slate-50/50 border-t border-slate-100">
                <div className="relative">
                  <textarea
                    rows={3}
                    value={updateText}
                    onChange={(e) => setUpdateText(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    placeholder="Post an update…"
                  />
                  <button
                    onClick={postUpdate}
                    className="absolute bottom-3 right-3 rounded-lg bg-indigo-600 px-4 py-1.5 text-[11px] font-bold text-white shadow-md hover:bg-indigo-700 transition-all"
                  >
                    Post
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-indigo-50/30">
                <span className="text-[13px] font-bold text-indigo-900 uppercase tracking-widest flex items-center gap-2">
                  <FileText size={16} /> Draft Postmortem
                </span>
                <button onClick={() => setIsResolving(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Problem Summary (What happened?)</label>
                  <textarea
                    rows={6}
                    value={reportData.whatHappened}
                    onChange={(e) => setReportData(prev => ({ ...prev, whatHappened: e.target.value }))}
                    placeholder="AI will help you break this down if you use Summary mode..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-[13px] leading-relaxed outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all"
                  />
                  {aiMode === 'summary' && <p className="text-[10px] text-indigo-500 font-medium italic">Pre-filled using AI Summary breakdown.</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Resolution Applied (How we fixed it?)</label>
                  <textarea
                    rows={6}
                    value={reportData.solution}
                    onChange={(e) => setReportData(prev => ({ ...prev, solution: e.target.value }))}
                    placeholder="Type manually or use Summary+Fix for an AI hint..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-[13px] leading-relaxed outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all"
                  />
                  {aiMode === 'suggestion' && <p className="text-[10px] text-indigo-500 font-medium italic">Pre-filled using AI Suggestion hint.</p>}
                </div>
              </div>

              <div className="p-6 border-t border-slate-100">
                <button 
                  onClick={handleSendReport}
                  disabled={submitting || !reportData.whatHappened.trim() || !reportData.solution.trim()}
                  className="w-full rounded-xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : 'Send for Approval →'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
