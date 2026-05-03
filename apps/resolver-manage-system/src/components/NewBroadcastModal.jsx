import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { X, Check } from 'lucide-react'
import { sendBroadcast } from '../store/messagesSlice.js'

const ROLE_OPTIONS = [
  { id: 'all', label: 'All team' },
  { id: 'manager', label: 'Managers' },
  { id: 'creator', label: 'Creators' },
  { id: 'responder', label: 'Responders' },
]

export default function NewBroadcastModal({ onClose }) {
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [targetRoles, setTargetRoles] = useState(['all'])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const toggleRole = (roleId) => {
    if (roleId === 'all') {
      setTargetRoles(['all'])
      return
    }
    setTargetRoles((prev) => {
      const without = prev.filter((r) => r !== 'all')
      if (without.includes(roleId)) {
        const next = without.filter((r) => r !== roleId)
        return next.length === 0 ? ['all'] : next
      }
      return [...without, roleId]
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.')
      return
    }
    setSending(true)
    const result = await dispatch(sendBroadcast({ title: title.trim(), content: content.trim(), targetRoles }))
    setSending(false)
    if (!result.error) {
      onClose()
    } else {
      setError(result.payload ?? 'Failed to send broadcast.')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-md rounded-[12px] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--border,#e2e8f0)] px-5 py-4">
          <h2 className="text-[15px] font-semibold text-[var(--text-primary,#1e293b)]">New broadcast</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-slate-400 hover:bg-slate-100"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary,#64748b)]">
              Title
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Scheduled maintenance tonight"
              className="rounded-[8px] border border-[var(--border,#e2e8f0)] bg-white px-3 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-[var(--accent,#4f46e5)]/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary,#64748b)]">
              Message
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your announcement here…"
              className="resize-none rounded-[8px] border border-[var(--border,#e2e8f0)] bg-white px-3 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-[var(--accent,#4f46e5)]/20"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary,#64748b)]">
              Send to
            </label>
            <div className="flex flex-wrap gap-2">
              {ROLE_OPTIONS.map((opt) => {
                const selected = targetRoles.includes(opt.id)
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleRole(opt.id)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                      selected
                        ? 'bg-[var(--accent,#4f46e5)] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {selected && <Check size={11} />}
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          {error && (
            <p className="rounded-[6px] bg-red-50 px-3 py-2 text-[12px] text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-[8px] bg-[var(--accent,#4f46e5)] py-2.5 text-[13px] font-semibold text-white hover:brightness-110 disabled:opacity-50"
          >
            {sending ? 'Sending…' : 'Send broadcast'}
          </button>
        </form>
      </div>
    </div>
  )
}
