import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { X, Loader2, Sparkles } from 'lucide-react'
import { format } from 'date-fns'

function severityStyle(sev) {
  switch (sev) {
    case 'critical': return 'bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]'
    case 'high':     return 'bg-[#fffbeb] text-[#d97706] border border-[#fde68a]'
    case 'medium':   return 'bg-[#eef2ff] text-[#4f46e5] border border-[#c7d2fe]'
    case 'low':      return 'bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]'
    default:         return 'bg-[#f8fafc] text-[#64748b] border border-[#e2e8f0]'
  }
}

function statusStyle(st) {
  switch (st) {
    case 'published':        return 'bg-[#f0fdf4] text-[#16a34a]'
    case 'pending_approval': return 'bg-[#fffbeb] text-[#d97706]'
    default:                 return 'bg-[#f8fafc] text-[#94a3b8]'
  }
}

function statusLabel(st) {
  if (st === 'pending_approval') return 'Pending approval'
  return st ? st.charAt(0).toUpperCase() + st.slice(1) : '—'
}

function methodStyle(m) {
  switch (m) {
    case 'ai_solution':   return 'bg-[#f3f0ff] text-[#5b21b6] border border-[#ddd6fe]'
    case 'ai_suggestion': return 'bg-[#eef2ff] text-[#3730a3] border border-[#c7d2fe]'
    default:              return 'bg-[#f8fafc] text-[#475569] border border-[#e2e8f0]'
  }
}

function methodLabel(m) {
  if (m === 'ai_solution')   return 'AI Solution'
  if (m === 'ai_suggestion') return 'AI Suggestion'
  return m ? m.charAt(0).toUpperCase() + m.slice(1) : 'Manual'
}

function TimelineDot({ type }) {
  const colorMap = {
    update:     'bg-indigo-500',
    escalation: 'bg-red-500',
    resolved:   'bg-green-500',
    ai:         'bg-purple-500',
    note:       'bg-slate-400',
  }
  return (
    <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${colorMap[type] ?? 'bg-slate-400'}`} />
  )
}

export default function PostmortemDetailModal({ id, canApprove, onClose, onApprove, onRequestChanges }) {
  const backdropRef = useRef(null)
  const { activeDetail: pm, approving } = useSelector((s) => s.postmortems)

  if (!pm || String(pm._id) !== String(id)) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="rounded-[12px] bg-white p-8 shadow-2xl">
          <Loader2 size={24} className="animate-spin text-indigo-500" />
        </div>
      </div>
    )
  }

  const incRef = pm.incidentRef || pm.incident || pm.incidentId || {}
  const incId  = incRef?.incidentId || incRef?._id || '—'
  const title  = pm.title || incRef?.title || '—'
  const sev    = pm.severity || incRef?.severity
  const svc    = pm.service || incRef?.service || incRef?.affectedService
  const isAI   = pm.generatedBy === 'ai' || pm.generatedBy === 'AI'

  function handleBackdrop(e) {
    if (e.target === backdropRef.current) onClose()
  }

  function handlePrint() {
    window.print()
  }

  function handleShare() {
    const url = `${window.location.origin}/reports/${pm._id}/public`
    navigator.clipboard.writeText(url).catch(() => {})
  }

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-end justify-end bg-black/40 backdrop-blur-[2px]"
      onClick={handleBackdrop}
    >
      {/* Slide-over panel */}
      <div className="report-detail flex h-full w-full max-w-[600px] flex-col bg-white shadow-2xl sm:rounded-l-[12px]">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-[#e2e8f0] px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono rounded-[4px] bg-[#f1f5f9] px-2 py-0.5 text-[11px] text-[#475569]">
                {incId}
              </span>
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyle(pm.status)}`}>
                {statusLabel(pm.status)}
              </span>
            </div>
            <h2 className="mt-2 text-[18px] font-semibold text-[#1e293b]">{title}</h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[12px] text-[#64748b]">
              {pm.createdAt && <span>{format(new Date(pm.createdAt), 'MMM d, yyyy')}</span>}
              {pm.duration && <span>· {pm.duration}</span>}
              {sev && (
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${severityStyle(sev)}`}>
                  {sev}
                </span>
              )}
              {pm.resolutionMethod && (
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${methodStyle(pm.resolutionMethod)}`}>
                  {methodLabel(pm.resolutionMethod)}
                </span>
              )}
            </div>
          </div>
          <button type="button" onClick={onClose} className="ml-4 shrink-0 text-[#94a3b8] hover:text-[#64748b]">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Incident overview */}
          <section>
            <h3 className="text-[14px] font-semibold text-[#1e293b] mb-3">Incident overview</h3>
            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#94a3b8]">Assigned to</p>
                <p className="mt-1 text-[#1e293b]">{pm.assignedTo?.name || '—'}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#94a3b8]">Resolved by</p>
                <p className="mt-1 text-[#1e293b]">{pm.resolvedBy?.name || '—'}</p>
              </div>
              {svc && (
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[#94a3b8]">Service</p>
                  <span className="mt-1 inline-block rounded-full bg-[#eef2ff] px-2.5 py-0.5 text-[11px] font-medium text-[#4f46e5]">
                    {svc}
                  </span>
                </div>
              )}
              {incRef?.resolvedAt && (
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[#94a3b8]">Resolved at</p>
                  <p className="mt-1 text-[#1e293b]">{format(new Date(incRef.resolvedAt), 'MMM d, yyyy HH:mm')}</p>
                </div>
              )}
            </div>
          </section>

          {/* What happened */}
          {pm.whatHappened && (
            <section>
              <h3 className="text-[14px] font-semibold text-[#1e293b] mb-2">What happened</h3>
              <p className="text-[14px] text-[#475569] leading-[1.7]">{pm.whatHappened}</p>
            </section>
          )}

          {/* Timeline */}
          {pm.timeline?.length > 0 && (
            <section>
              <h3 className="text-[14px] font-semibold text-[#1e293b] mb-3">Timeline</h3>
              <div className="flex flex-col gap-3">
                {pm.timeline.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <TimelineDot type={item.type || 'update'} />
                    <div>
                      {item.time && (
                        <p className="text-[11px] font-medium text-[#94a3b8]">{item.time}</p>
                      )}
                      <p className="text-[13px] text-[#1e293b]">{item.event}</p>
                      {item.author && (
                        <p className="text-[11px] text-[#94a3b8]">— {item.author}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Summary */}
          {pm.summary && (
            <section>
              <h3 className="text-[14px] font-semibold text-[#1e293b] mb-2">Summary</h3>
              <p className="text-[14px] text-[#475569] leading-[1.7]">{pm.summary}</p>
            </section>
          )}

          {/* Root Cause */}
          {pm.rootCause && (
            <section>
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-[14px] font-semibold text-[#1e293b]">Root cause</h3>
                {isAI ? (
                  <span className="inline-flex rounded-full bg-[#f3f0ff] px-2.5 py-0.5 text-[11px] font-semibold text-[#5b21b6]">
                    AI identified
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-[#f8fafc] px-2.5 py-0.5 text-[11px] font-semibold text-[#64748b]">
                    Manual
                  </span>
                )}
              </div>
              <p className="text-[14px] text-[#475569] leading-[1.7]">{pm.rootCause}</p>
            </section>
          )}

          {/* Analysis Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pm.whatWorked && (
              <section>
                <h3 className="text-[14px] font-semibold text-green-700 mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  What worked
                </h3>
                <p className="text-[14px] text-[#475569] leading-[1.7]">{pm.whatWorked}</p>
              </section>
            )}
            {pm.whatDidntWork && (
              <section>
                <h3 className="text-[14px] font-semibold text-red-700 mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  What didn't work
                </h3>
                <p className="text-[14px] text-[#475569] leading-[1.7]">{pm.whatDidntWork}</p>
              </section>
            )}
          </div>

          {/* Recommendations */}
          {pm.recommendations && (
            <section className="rounded-[8px] bg-indigo-50/50 border border-indigo-100 p-4">
              <h3 className="text-[14px] font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                <Sparkles size={14} />
                Recommendations
              </h3>
              <p className="text-[14px] text-indigo-950/80 leading-[1.7]">{pm.recommendations}</p>
            </section>
          )}

          {/* Impact */}
          {pm.impact && (
            <section>
              <h3 className="text-[14px] font-semibold text-[#1e293b] mb-2">Impact</h3>
              <p className="text-[14px] text-[#475569] leading-[1.7] font-medium">{pm.impact}</p>
            </section>
          )}
        </div>


        {/* Sticky footer */}
        <div className="shrink-0 flex items-center justify-between border-t border-[#e2e8f0] bg-white px-6 py-4">
          <div className="flex items-center gap-2">
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyle(pm.status)}`}>
              {statusLabel(pm.status)}
            </span>
            {canApprove && pm.status === 'pending_approval' && (
              <>
                <button
                  type="button"
                  disabled={approving}
                  onClick={() => onApprove(pm._id)}
                  className="flex items-center gap-1.5 rounded-[6px] bg-green-600 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-green-700 disabled:opacity-60"
                >
                  {approving && <Loader2 size={11} className="animate-spin" />}
                  Approve & publish
                </button>
                <button
                  type="button"
                  onClick={() => onRequestChanges(pm)}
                  className="rounded-[6px] border border-red-300 px-3 py-1.5 text-[12px] font-medium text-red-600 hover:bg-red-50"
                >
                  Request changes
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="rounded-[6px] border border-[#e2e8f0] px-3 py-1.5 text-[12px] font-medium text-[#475569] hover:bg-[#f8fafc]"
              title="Copy share link"
            >
              Share link
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-[6px] border border-[#e2e8f0] px-3 py-1.5 text-[12px] font-medium text-[#475569] hover:bg-[#f8fafc]"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
