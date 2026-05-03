import React from 'react'
import { FileText, ExternalLink } from 'lucide-react'

export function PublicReports({ reports }) {
  return (
    <div className="flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-0.5 pb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
            <FileText size={14} />
          </div>
          <span className="text-[15px] font-bold text-slate-900">Public reports</span>
        </div>
        <span className="text-[10px] font-bold tracking-wider text-slate-400">POSTMORTEMS COLLECTION</span>
      </div>

      <div className="flex flex-col gap-6 pb-8">
        {reports.slice(0, 2).map((r) => (
          <div key={r.title} className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-bold text-slate-900">{r.title.split(' — ')[0]}</span>
              <span className="text-[11px] text-slate-400">{r.date} • {r.title.split(' — ')[1]}</span>
            </div>
            <ExternalLink size={14} className="text-slate-300" />
          </div>
        ))}
      </div>

      <button className="mt-auto w-full rounded-lg bg-black py-1.5 text-[10px] font-bold text-white transition-opacity hover:opacity-90">
        View all
      </button>
    </div>
  )
}
