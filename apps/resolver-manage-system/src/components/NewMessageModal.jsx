import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { X, Search } from 'lucide-react'
import { Avatar } from '@resolver/ui'
import { fetchSearchUsers, clearSearchUsers } from '../store/messagesSlice.js'

function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function NewMessageModal({ onClose, onSelectUser }) {
  const dispatch = useDispatch()
  const { searchUsers } = useSelector((s) => s.messages)
  const [q, setQ] = useState('')
  const debouncedQ = useDebouncedValue(q, 300)

  useEffect(() => {
    if (debouncedQ.trim()) {
      dispatch(fetchSearchUsers(debouncedQ))
    } else {
      dispatch(fetchSearchUsers(''))
    }
  }, [debouncedQ, dispatch])

  useEffect(() => {
    dispatch(fetchSearchUsers(''))
    return () => dispatch(clearSearchUsers())
  }, [dispatch])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-sm rounded-[12px] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--border,#e2e8f0)] px-5 py-4">
          <h2 className="text-[15px] font-semibold text-[var(--text-primary,#1e293b)]">New message</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-slate-400 hover:bg-slate-100"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search team members…"
              className="w-full rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-base,#f8fafc)] py-2 pl-8 pr-3 text-[13px] outline-none focus:ring-2 focus:ring-[var(--accent,#4f46e5)]/20"
            />
          </div>

          <div className="mt-3 flex max-h-[260px] flex-col gap-0.5 overflow-y-auto">
            {searchUsers.length === 0 ? (
              <p className="py-6 text-center text-[13px] text-[var(--text-secondary,#64748b)]">
                {q ? 'No users found.' : 'Start typing to search…'}
              </p>
            ) : (
              searchUsers.map((u) => (
                <button
                  key={String(u._id)}
                  type="button"
                  onClick={() => onSelectUser(String(u._id))}
                  className="flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-left hover:bg-[var(--accent-dim,#eef2ff)]"
                >
                  <div className="relative shrink-0">
                    <Avatar name={u.name} size={36} />
                    <span className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white ${
                      u.status === 'online' ? 'bg-emerald-500' : u.status === 'away' ? 'bg-amber-400' : 'bg-slate-400'
                    }`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[var(--text-primary,#1e293b)]">{u.name}</p>
                    <p className="text-[11px] text-[var(--text-secondary,#64748b)]">{u.role} · {u.status}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
