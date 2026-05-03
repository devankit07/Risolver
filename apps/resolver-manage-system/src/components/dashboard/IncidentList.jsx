import React from 'react'
import { AlertCircle, ChevronRight } from 'lucide-react'

export function IncidentList({ incidents }) {
  return (
    <div className="flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-0.5 pb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
            <AlertCircle size={14} />
          </div>
          <span className="text-[15px] font-bold text-slate-900">Active incidents list</span>
        </div>
        <span className="text-[10px] font-bold tracking-wider text-slate-400">INCIDENTS COLLECTION</span>
      </div>

      <div className="flex flex-col gap-3 pb-8">
        {incidents.filter(i => i.status !== 'resolved').slice(0, 2).map((inc) => (
          <div key={inc.id} className="flex items-center justify-between rounded-2xl bg-slate-50/50 p-3">
            <div className="flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${inc.severity === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{inc.id}</span>
                <span className="text-[12px] font-bold text-slate-900 truncate max-w-[120px]">{inc.title}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <div className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${inc.status === 'investigating' ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-600'}`}>
                {inc.status.charAt(0).toUpperCase() + inc.status.slice(1)}
              </div>
              <ChevronRight size={14} className="text-slate-300" />
            </div>
          </div>
        ))}
      </div>

      <button className="mt-auto w-full rounded-lg bg-black py-1.5 text-[10px] font-bold text-white transition-opacity hover:opacity-90">
        View All
      </button>
    </div>
  )
}
