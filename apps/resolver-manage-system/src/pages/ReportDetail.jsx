import { useParams, useNavigate } from 'react-router-dom'
import { StatusBadge } from '@resolver/ui'

/** Populate from API when reports are wired */
const REPORTS_DATA = {}

export default function ReportDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const report = REPORTS_DATA[id]

  if (!report) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-16">
        <p className="text-[15px] font-medium text-slate-700">Report not found</p>
        <p className="max-w-md text-center text-[13px] text-slate-500">
          This report does not exist or has not been loaded yet.
        </p>
        <button
          type="button"
          onClick={() => navigate('/reports')}
          className="rounded-[8px] bg-[#4f46e5] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#4338ca]"
        >
          Back to reports
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-3xl bg-white px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
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

      <h1 className="mb-4 text-[24px] font-bold leading-tight text-[#0f172a]">{report.title}</h1>

      <div className="mb-8 flex flex-wrap items-center gap-3 border-b border-slate-200 pb-6">
        <StatusBadge variant="light" status={report.status} />
        <StatusBadge variant="light" status={report.severity} />
        <span className="text-[13px] text-slate-500">{report.date}</span>
        <span className="text-[13px] text-slate-500">Duration: {report.duration}</span>
        <div className="flex flex-wrap gap-1.5">
          {report.services.map((s) => (
            <span key={s} className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] text-slate-600">
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <Section title="What happened">
          <p className="text-[14px] leading-relaxed text-slate-600">{report.whatHappened}</p>
        </Section>

        <Section title="Timeline">
          <div className="flex flex-col">
            {report.timeline.map((t, i) => (
              <div key={i} className="relative flex gap-4">
                {i < report.timeline.length - 1 && (
                  <span className="absolute bottom-0 left-[5px] top-4 w-px bg-slate-200" />
                )}
                <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#4f46e5]" />
                <div className="pb-5">
                  <span className="font-mono text-[11px] font-semibold text-[#4f46e5]">{t.time}</span>
                  <p className="mt-0.5 text-[13px] text-slate-600">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Root cause">
          <div className="flex flex-col gap-2">
            {report.aiIdentified && (
              <span className="self-start rounded-md bg-[#4f46e5] px-2 py-1 text-[10px] font-bold text-white">
                AI identified
              </span>
            )}
            <p className="text-[14px] leading-relaxed text-slate-600">{report.rootCause}</p>
          </div>
        </Section>

        <Section title="Solution applied">
          <ol className="flex list-decimal flex-col gap-2 pl-4">
            {report.solutionApplied.map((s, i) => (
              <li key={i} className="text-[14px] text-slate-600">
                {s}
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Prevention steps">
          <ol className="flex list-decimal flex-col gap-2 pl-4">
            {report.preventionSteps.map((s, i) => (
              <li key={i} className="text-[14px] text-slate-600">
                {s}
              </li>
            ))}
          </ol>
        </Section>
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
