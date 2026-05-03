import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { X, Loader2 } from 'lucide-react'
import { approvePostmortem } from '../store/postmortemsSlice.js'

export default function RequestChangesModal({ report, onClose, onSent }) {
  const dispatch = useDispatch()
  const { approving } = useSelector((s) => s.postmortems)
  const [feedback, setFeedback] = useState('')
  const [error, setError]       = useState(null)
  const [toast, setToast]       = useState(null)
  const backdropRef = useRef(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!feedback.trim()) return setError('Please enter feedback before submitting.')

    const result = await dispatch(
      approvePostmortem({ id: report._id, action: 'request_changes', feedback }),
    )

    if (approvePostmortem.fulfilled.match(result)) {
      const resolvedName = report.resolvedBy?.name ?? 'the resolver'
      setToast(`Feedback sent to ${resolvedName}`)
      setTimeout(() => { setToast(null); onSent() }, 1500)
    } else {
      setError('Failed to send feedback. Please try again.')
    }
  }

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
      onClick={(e) => { if (e.target === backdropRef.current) onClose() }}
    >
      <div className="w-full max-w-md rounded-[12px] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
          <h2 className="text-[16px] font-semibold text-[#1e293b]">Request changes</h2>
          <button type="button" onClick={onClose} className="text-[#94a3b8] hover:text-[#64748b]">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">
          <p className="text-[13px] text-[#64748b]">
            Provide feedback for{' '}
            <span className="font-medium text-[#1e293b]">
              {report.resolvedBy?.name ?? 'the resolver'}
            </span>
            . The report will be moved back to draft status.
          </p>

          <div>
            <label className="mb-1 block text-[12px] font-medium text-[#475569]">
              Feedback <span className="text-red-500">*</span>
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Describe what changes are needed…"
              rows={4}
              className="w-full rounded-[8px] border border-[#e2e8f0] px-3 py-2 text-[13px] text-[#1e293b] outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
            />
          </div>

          {error && (
            <p className="rounded-[8px] bg-red-50 px-3 py-2 text-[13px] text-red-600">{error}</p>
          )}
          {toast && (
            <p className="rounded-[8px] bg-green-50 px-3 py-2 text-[13px] text-green-700">{toast}</p>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-[#e2e8f0] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[8px] border border-[#e2e8f0] px-4 py-2 text-[13px] font-medium text-[#475569] hover:bg-[#f8fafc]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={approving}
              className="flex items-center gap-2 rounded-[8px] bg-[#4f46e5] px-4 py-2 text-[13px] font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {approving && <Loader2 size={13} className="animate-spin" />}
              Send feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
