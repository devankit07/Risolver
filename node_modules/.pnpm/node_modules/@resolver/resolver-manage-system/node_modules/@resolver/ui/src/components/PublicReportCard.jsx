import { StatusBadge } from './StatusBadge.jsx'

/**
 * @param {{
 *   report: object,
 *   onClick?: () => void,
 *   variant?: 'dark' | 'light',
 * }} props
 */
export function PublicReportCard({ report, onClick, variant = 'dark' }) {
  const L = variant === 'light'

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-4 cursor-pointer transition-colors flex flex-col gap-2 ${
        L ? 'bg-white border-slate-200 hover:border-[#4f46e5]/35 shadow-sm' : 'hover:border-[#2f2f2f]'
      }`}
      style={L ? undefined : { background: '#0d0d0d', borderColor: '#1a1a1a' }}
    >
      <div className="flex items-center justify-between">
        <StatusBadge variant={L ? 'light' : 'dark'} status={report.status ?? 'published'} />
        <span className={`text-[11px] ${L ? 'text-slate-400' : ''}`} style={L ? undefined : { color: '#555' }}>
          {report.date}
        </span>
      </div>

      <h3 className={`text-[14px] font-semibold ${L ? 'text-[#0f172a]' : ''}`} style={L ? undefined : { color: '#f0f0f0' }}>
        {report.title}
      </h3>

      {report.services?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {report.services.map((s) => (
            <span
              key={s}
              className={`text-[10px] px-2 py-0.5 rounded-full ${L ? 'bg-slate-100 text-slate-600' : ''}`}
              style={L ? undefined : { background: '#141414', color: '#888' }}
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {report.duration && (
        <span className={`text-[11px] ${L ? 'text-slate-500' : ''}`} style={L ? undefined : { color: '#555' }}>
          Duration: {report.duration}
        </span>
      )}

      {report.summary && (
        <p
          className={`text-[12px] leading-relaxed overflow-hidden ${L ? 'text-slate-600' : ''}`}
          style={
            L
              ? { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }
              : { color: '#888', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }
          }
        >
          {report.summary}
        </p>
      )}

      <div className="flex items-center justify-between pt-1">
        <span className={`text-[12px] font-semibold ${L ? 'text-[#4f46e5]' : ''}`} style={L ? undefined : { color: '#00e87a' }}>
          Read full report →
        </span>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className={`text-[11px] px-2 py-1 rounded-lg border transition-colors ${
            L ? 'border-slate-200 bg-white text-slate-600 hover:border-[#4f46e5]/40' : ''
          }`}
          style={L ? undefined : { background: '#111', borderColor: '#1f1f1f', color: '#888' }}
          title="Download PDF"
        >
          ↓ PDF
        </button>
      </div>
    </div>
  )
}
