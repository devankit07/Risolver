import React from 'react'
import { Shield, MoreHorizontal } from 'lucide-react'
import { Avatar } from '@resolver/ui'

export function TeamManagement({ team }) {
  return (
    <div className="lg:col-span-2 flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between pb-6">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
              <Shield size={14} />
            </div>
            <span className="text-[15px] font-bold text-slate-900">Team Management</span>
          </div>
          <span className="text-[10px] font-bold tracking-wider text-slate-400">USERS + STATUS FIELD</span>
        </div>
        <button type="button" className="text-slate-400 hover:text-slate-600">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-8 max-h-[220px] scrollbar-hide">
        {team.map((m) => (
          <div key={m.id} className="flex items-center justify-between transition-colors hover:bg-slate-50/50 p-2 -mx-2 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar name={m.name} size={32} />
                <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${m.status === 'online' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-slate-900">{m.name}</span>
                <span className="text-[11px] text-slate-500">{m.role || 'Security Lead'}</span>
              </div>
            </div>
            <div className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider ${m.status === 'online' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
              {m.status === 'online' ? 'ACTIVE' : 'AWAY'}
            </div>
          </div>
        ))}
      </div>

      <button className="mt-auto w-full rounded-lg bg-black py-1.5 text-[10px] font-bold text-white transition-opacity hover:opacity-90">
        Click
      </button>
    </div>
  )
}
