import React from 'react'
import { MessageSquare, MoreHorizontal } from 'lucide-react'

export function MiniChat() {
  return (
    <div className="lg:col-span-1 flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between pb-6">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
              <MessageSquare size={14} />
            </div>
            <span className="text-[15px] font-bold text-slate-900">Mini chat preview</span>
          </div>
          <span className="text-[10px] font-bold tracking-wider text-slate-400">MESSAGES COLLECTION</span>
        </div>
        <button type="button" className="text-slate-400 hover:text-slate-600">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-5 pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[12px] font-bold text-slate-400">S</div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-slate-900">System Alert</span>
              <span className="text-[12px] text-slate-500">CPU usage exceeded 90%...</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">2m ago</span>
            <div className="h-1.5 w-1.5 rounded-full bg-black" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[12px] font-bold text-slate-400">S</div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-slate-900">Security Bot</span>
              <span className="text-[12px] text-slate-500">Suspicious login attempt detected</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">15m ago</span>
            <div className="h-1.5 w-1.5 rounded-full bg-black" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[12px] font-bold text-slate-400">I</div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-slate-900">Incident #104</span>
              <span className="text-[12px] text-slate-500">Database connection recovered</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">1h ago</span>
          </div>
        </div>
      </div>

      <button className="mt-auto w-full rounded-lg bg-black py-1.5 text-[10px] font-bold text-white transition-opacity hover:opacity-90">
        Click
      </button>
    </div>
  )
}
