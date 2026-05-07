import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { StatusBadge } from '@resolver/ui'
import { fetchPostmortemDetail, clearDetail } from '../store/postmortemsSlice.js'
import { Loader2, Sparkles, ArrowLeft, Share2, Download, ShieldAlert } from 'lucide-react'

export default function ReportDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { activeDetail: report, loading } = useSelector((s) => s.postmortems)

  useEffect(() => {
    if (id) dispatch(fetchPostmortemDetail(id))
    return () => {
      dispatch(clearDetail())
    }
  }, [id, dispatch])


  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-indigo-500" size={40} />
          <p className="text-sm font-medium text-slate-500">Loading comprehensive report...</p>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-16">
        <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
           <span className="text-2xl">🔍</span>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-900">Report not found</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-xs">
            We couldn't find the postmortem report you're looking for. It might have been deleted or moved.
          </p>
        </div>
        <button
          onClick={() => navigate('/reports')}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
        >
          Back to Reports
        </button>
      </div>
    )
  }

  const incRef = report.incidentRef || report.incident || report.incidentId || {}
  const incTitle = report.title || incRef.title || 'Incident Report'
  const svc = report.service || incRef.service || incRef.affectedService || '—'
  const isAI = report.generatedBy === 'ai'

  const currentUser = useSelector((s) => s.auth.user)
  const isPrivileged = currentUser?.role?.toLowerCase() === 'admin' || currentUser?.role?.toLowerCase() === 'manager'

  const handleApprove = async () => {
    try {
      await api.patch(`/postmortems/${id}/approve`, { action: 'approve' })
      dispatch(fetchPostmortemDetail(id))
    } catch (err) {
      console.error('Failed to approve report', err)
    }
  }

  const handleRequestChanges = async () => {
    try {
      await api.patch(`/postmortems/${id}/approve`, { action: 'request_changes', feedback: 'Please provide more details.' })
      dispatch(fetchPostmortemDetail(id))
    } catch (err) {
      console.error('Failed to request changes', err)
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-white px-6 py-12 md:px-10">
      {/* Approval Banner */}
      {report.status === 'pending_approval' && (
        <div className="mb-8 flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <ShieldAlert size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">Awaiting Approval</p>
              <p className="text-xs text-amber-700">This report has been submitted and is waiting for a manager to review and publish it.</p>
            </div>
          </div>
          {isPrivileged && (
            <div className="flex gap-3">
              <button 
                onClick={handleRequestChanges}
                className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-[13px] font-bold text-amber-700 hover:bg-amber-100 transition-all"
              >
                Request Changes
              </button>
              <button 
                onClick={handleApprove}
                className="rounded-xl bg-amber-600 px-6 py-2 text-[13px] font-bold text-white shadow-lg shadow-amber-100 hover:bg-amber-700 transition-all"
              >
                Approve & Publish
              </button>
            </div>
          )}
        </div>
      )}

      {/* Top Navigation */}
      <div className="mb-10 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          Back to Activity
        </button>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-colors">
            <Share2 size={16} /> Share
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-[13px] font-bold text-white shadow-md hover:bg-indigo-700 transition-all shadow-indigo-100">
            <Download size={16} /> PDF
          </button>
        </div>
      </div>

      {/* Header Info */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[12px] font-bold border border-slate-200">
            {incRef.incidentId || 'INC-REF'}
          </span>
          <StatusBadge status={report.status} />
          {isAI && (
             <span className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-600 border border-purple-100 rounded-lg text-[11px] font-bold uppercase tracking-wider">
               <Sparkles size={12} /> AI Assisted
             </span>
          )}
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-8 leading-tight">{incTitle}</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-slate-100">
           <MetaItem label="Service" value={svc} isIndigo />
           <MetaItem label="Severity" value={<StatusBadge status={incRef.severity || 'medium'} />} />
           <MetaItem label="Duration" value={report.duration || '—'} />
           <MetaItem label="Resolution" value={report.resolutionMethod || 'Manual'} isCapitalized />
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-16">
        <Section title="What Happened">
          <div className="max-w-none">
            <p className="text-[16px] leading-relaxed text-slate-600 bg-slate-50/50 p-8 rounded-2xl border border-slate-100 font-medium">
              {report.whatHappened || report.summary}
            </p>
          </div>
        </Section>


        {report.timeline?.length > 0 && (
          <Section title="Event Timeline">
            <div className="space-y-6 pl-4 border-l-2 border-slate-100 ml-2">
              {report.timeline.map((t, i) => (
                <div key={i} className="relative flex flex-col gap-1.5">
                  <span className="absolute -left-[25px] top-1.5 h-3.5 w-3.5 rounded-full bg-white border-2 border-indigo-500 shadow-sm" />
                  <span className="font-mono text-[11px] font-bold text-indigo-600 uppercase tracking-widest">{t.time}</span>
                  <p className="text-[15px] text-slate-700 font-medium">{t.event}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <Section title="Successes">
              <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <p className="text-[15px] text-emerald-900 leading-relaxed font-medium italic">"{report.whatWorked || '—'}"</p>
              </div>
           </Section>
           <Section title="Pain Points">
              <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-100">
                <p className="text-[15px] text-rose-900 leading-relaxed font-medium italic">"{report.whatDidntWork || '—'}"</p>
              </div>
           </Section>
        </div>

        <Section title="Root Cause Analysis">
          <div className="flex flex-col gap-5">
            <p className="text-[17px] leading-relaxed text-slate-800 font-bold bg-white shadow-sm border border-slate-100 p-8 rounded-2xl">
              {report.rootCause || report.solutionApplied || 'Investigation completed and resolution applied.'}
            </p>
          </div>
        </Section>

        {report.recommendations && (
           <Section title="Team Recommendations">
              <div className="p-8 rounded-2xl bg-indigo-50/50 border border-indigo-100 shadow-sm">
                <p className="text-[16px] text-indigo-950 leading-relaxed italic font-medium">
                   "{report.recommendations}"
                </p>
              </div>
           </Section>
        )}

        <Section title="Impact Assessment">
           <div className="flex items-center gap-4 bg-slate-900 p-6 rounded-2xl text-white">
              <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
                 <ShieldAlert size={24} className="text-indigo-300" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-0.5">Affected Scope</p>
                <p className="text-[15px] font-medium">{report.impact || 'No significant impact recorded.'}</p>
              </div>
           </div>
        </Section>
      </div>
    </div>
  )
}

function MetaItem({ label, value, isIndigo, isCapitalized }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">{label}</p>
      <div className={`text-[15px] font-bold ${isIndigo ? 'text-indigo-600' : 'text-slate-800'} ${isCapitalized ? 'capitalize' : ''}`}>
        {value}
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-[18px] font-black uppercase tracking-widest text-slate-900 border-l-4 border-indigo-500 pl-4 leading-none">{title}</h2>
      {children}
    </div>
  )
}
