import { useParams, useNavigate } from 'react-router-dom'
import { StatusBadge } from '@resolver/ui'

const REPORTS_DATA = {
  r1: {
    title: 'Payment service outage — 45 minutes downtime',
    status: 'published',
    date: 'May 1, 2026',
    duration: '45m',
    severity: 'critical',
    services: ['Payments', 'API Gateway'],
    whatHappened: 'At 08:34 UTC the payment service began returning 503 errors across all regions. The root cause was identified as PostgreSQL connection pool exhaustion triggered by a surge in checkout traffic following a promotional email campaign.',
    timeline: [
      { time: '08:34 UTC', event: 'First 503 errors detected on payment endpoint' },
      { time: '08:37 UTC', event: 'PagerDuty alert fired — on-call engineer paged' },
      { time: '08:42 UTC', event: 'Incident declared — team assembled in war room' },
      { time: '08:51 UTC', event: 'Root cause identified: connection pool at 100%' },
      { time: '09:01 UTC', event: 'Pool size increased from 100 to 200, service restarted' },
      { time: '09:19 UTC', event: 'All metrics nominal — incident resolved' },
    ],
    rootCause: 'The connection pool limit (100) was undersized for peak promotional traffic. The email campaign drove 3x normal checkout volume, exhausting the pool within minutes. AI-assisted triage identified the pool exhaustion pattern within 90 seconds.',
    solutionApplied: [
      'Increased DB connection pool limit from 100 to 200',
      'Restarted DB proxy service to apply new config',
      'Diverted 30% of traffic to read replicas during recovery',
    ],
    preventionSteps: [
      'Set connection pool alerting threshold at 75% utilization',
      'Implement auto-scaling for connection pool based on traffic patterns',
      'Load test checkout flow before any marketing campaigns',
      'Add circuit breaker to payment service to fail-fast gracefully',
    ],
    aiIdentified: true,
  },
}

export default function ReportDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const report = REPORTS_DATA[id] ?? REPORTS_DATA.r1

  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto bg-white">
      <div className="flex items-center gap-3 mb-6">
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
          className="h-7 px-3 rounded-lg text-[11px] font-semibold bg-[#4f46e5] text-white hover:bg-[#4338ca]"
        >
          Share
        </button>
        <button
          type="button"
          className="h-7 px-3 rounded-lg text-[11px] font-semibold border border-slate-200 bg-white text-slate-700 hover:border-[#4f46e5]/40"
        >
          ↓ PDF
        </button>
      </div>

      <h1 className="text-[24px] font-bold leading-tight mb-4 text-[#0f172a]">{report.title}</h1>

      <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-slate-200">
        <StatusBadge variant="light" status={report.status} />
        <StatusBadge variant="light" status={report.severity} />
        <span className="text-[13px] text-slate-500">{report.date}</span>
        <span className="text-[13px] text-slate-500">Duration: {report.duration}</span>
        <div className="flex gap-1.5 flex-wrap">
          {report.services.map((s) => (
            <span key={s} className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* What happened */}
        <Section title="What happened">
          <p className="text-[14px] leading-relaxed text-slate-600">{report.whatHappened}</p>
        </Section>

        {/* Timeline */}
        <Section title="Timeline">
          <div className="flex flex-col">
            {report.timeline.map((t, i) => (
              <div key={i} className="flex gap-4 relative">
                {i < report.timeline.length - 1 && (
                  <span className="absolute left-[5px] top-4 bottom-0 w-px bg-slate-200" />
                )}
                <span className="w-3 h-3 rounded-full mt-1 shrink-0 bg-[#4f46e5]" />
                <div className="pb-5">
                  <span className="text-[11px] font-mono font-semibold text-[#4f46e5]">{t.time}</span>
                  <p className="text-[13px] mt-0.5 text-slate-600">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Root cause */}
        <Section title="Root cause">
          <div className="flex flex-col gap-2">
            {report.aiIdentified && (
              <span className="self-start text-[10px] font-bold px-2 py-1 rounded-md bg-[#4f46e5] text-white">
                AI identified
              </span>
            )}
            <p className="text-[14px] leading-relaxed text-slate-600">{report.rootCause}</p>
          </div>
        </Section>

        {/* Solution applied */}
        <Section title="Solution applied">
          <ol className="flex flex-col gap-2 pl-4 list-decimal">
            {report.solutionApplied.map((s, i) => (
              <li key={i} className="text-[14px] text-slate-600">{s}</li>
            ))}
          </ol>
        </Section>

        {/* Prevention steps */}
        <Section title="Prevention steps">
          <ol className="flex flex-col gap-2 pl-4 list-decimal">
            {report.preventionSteps.map((s, i) => (
              <li key={i} className="text-[14px] text-slate-600">{s}</li>
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
