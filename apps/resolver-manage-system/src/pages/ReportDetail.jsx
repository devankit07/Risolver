import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPostmortemDetail, clearDetail } from '../store/postmortemsSlice.js'
import { StatusBadge } from '@resolver/ui'
import { Loader2 } from 'lucide-react'

export default function ReportDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { activeDetail: report, loading } = useSelector((state) => state.postmortems)

  useEffect(() => {
    if (id) {
      dispatch(fetchPostmortemDetail(id))
    }
    return () => {
      dispatch(clearDetail())
    }
  }, [id, dispatch])

  if (loading || !report || String(report._id) !== id) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-16">
        {loading ? (
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        ) : (
          <>
            <p className="text-[15px] font-medium text-slate-700">Report not found</p>
            <p className="max-w-md text-center text-[13px] text-slate-500">
              This report does not exist or could not be loaded.
            </p>
            <button
              type="button"
              onClick={() => navigate('/reports')}
              className="rounded-[8px] bg-[#4f46e5] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#4338ca]"
            >
              Back to reports
            </button>
          </>
        )}
      </div>
    )
  }

  // Safely extract fields based on typical backend schema
  const title = report.incidentRef?.title || report.title || 'Untitled Report'
  const severity = report.severity || report.incidentRef?.severity || 'low'
  const date = report.createdAt ? new Date(report.createdAt).toLocaleDateString() : '—'
  const duration = report.duration || '—'
  const service = report.service || report.incidentRef?.service || report.incidentRef?.affectedService || 'Unknown'
  const services = Array.isArray(service) ? service : [service]
  
  const whatHappened = report.content?.whatHappened || report.whatHappened || 'No details provided.'
  const rootCause = report.content?.rootCause || report.rootCause || 'Not specified.'
  
  const rawSolution = report.content?.solutionApplied || report.solutionApplied || []
  const solutionApplied = Array.isArray(rawSolution) ? rawSolution : typeof rawSolution === 'string' ? rawSolution.split('\n') : []
  
  const rawPrevention = report.content?.preventionSteps || report.preventionSteps || []
  const preventionSteps = Array.isArray(rawPrevention) ? rawPrevention : typeof rawPrevention === 'string' ? rawPrevention.split('\n') : []
  
  const timeline = Array.isArray(report.timeline) ? report.timeline : []
  const aiIdentified = report.resolutionMethod === 'ai_solution' || report.resolutionMethod === 'ai_suggestion'

  return (
    <div className="mx-auto min-h-screen max-w-3xl bg-white px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/reports')}
          className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-[#0f172a]"
        >
          ← Back
        </button>
        <div className="flex-1" />
        <button
          type="button"
          className="h-7 rounded-lg bg-[#4f46e5] px-3 text-[11px] font-semibold text-white hover:bg-[#4338ca]"
        >
          Share
        </button>
        <button
          type="button"
          className="h-7 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-700 hover:border-[#4f46e5]/40"
        >
          ↓ PDF
        </button>
      </div>

      <h1 className="mb-4 text-[24px] font-bold leading-tight text-[#0f172a]">{title}</h1>

      <div className="mb-8 flex flex-wrap items-center gap-3 border-b border-slate-200 pb-6">
        <StatusBadge variant="light" status={report.status} />
        <StatusBadge variant="light" status={severity} />
        <span className="text-[13px] text-slate-500">{date}</span>
        <span className="text-[13px] text-slate-500">Duration: {duration}</span>
        <div className="flex flex-wrap gap-1.5">
          {services.map((s, idx) => (
            <span key={idx} className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] text-slate-600">
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <Section title="What happened">
          <p className="text-[14px] leading-relaxed text-slate-600 whitespace-pre-wrap">{whatHappened}</p>
        </Section>

        {timeline.length > 0 && (
          <Section title="Timeline">
            <div className="flex flex-col">
              {timeline.map((t, i) => (
                <div key={i} className="relative flex gap-4">
                  {i < timeline.length - 1 && (
                    <span className="absolute bottom-0 left-[5px] top-4 w-px bg-slate-200" />
                  )}
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#4f46e5]" />
                  <div className="pb-5">
                    <span className="font-mono text-[11px] font-semibold text-[#4f46e5]">
                      {t.time || new Date(t.timestamp).toLocaleTimeString()}
                    </span>
                    <p className="mt-0.5 text-[13px] text-slate-600">{t.event || t.message || JSON.stringify(t)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section title="Root cause">
          <div className="flex flex-col gap-2">
            {aiIdentified && (
              <span className="self-start rounded-md bg-[#4f46e5] px-2 py-1 text-[10px] font-bold text-white">
                AI identified
              </span>
            )}
            <p className="text-[14px] leading-relaxed text-slate-600 whitespace-pre-wrap">{rootCause}</p>
          </div>
        </Section>

        {solutionApplied.length > 0 && (
          <Section title="Solution applied">
            <ol className="flex list-decimal flex-col gap-2 pl-4">
              {solutionApplied.map((s, i) => (
                <li key={i} className="text-[14px] text-slate-600">
                  {s}
                </li>
              ))}
            </ol>
          </Section>
        )}

        {preventionSteps.length > 0 && (
          <Section title="Prevention steps">
            <ol className="flex list-decimal flex-col gap-2 pl-4">
              {preventionSteps.map((s, i) => (
                <li key={i} className="text-[14px] text-slate-600">
                  {s}
                </li>
              ))}
            </ol>
          </Section>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-[16px] font-bold text-[#0f172a]">{title}</h2>
      {children}
    </div>
  )
}
