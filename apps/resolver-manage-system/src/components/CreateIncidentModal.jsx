import { useState, useEffect, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { X, Loader2, ImagePlus, User } from 'lucide-react'
import { createIncidentThunk } from '../store/incidentsSlice.js'
import api from '../services/api.js'

const SEVERITIES = ['critical', 'high', 'medium', 'low']

const MAX_IMAGE_BYTES = 420_000
const MAX_IMAGES = 4

export default function CreateIncidentModal({ onClose }) {
  const dispatch = useDispatch()
  const authUser = useSelector((s) => s.auth.user)
  const selfId = authUser?._id ?? authUser?.id
  const selfName = authUser?.name ?? 'Me'
  const { creating, createError } = useSelector((s) => s.incidents)

  const [form, setForm] = useState({
    title: '',
    description: '',
    severity: '',
    service: '',
    assignedToUserId: '',
  })
  const [assigneeSearch, setAssigneeSearch] = useState('')
  const [assigneeName, setAssigneeName] = useState('')
  const [teamRoster, setTeamRoster] = useState([])
  const [rosterLoading, setRosterLoading] = useState(true)
  const [assignPickerOpen, setAssignPickerOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [formError, setFormError] = useState(null)
  const [reportImages, setReportImages] = useState([])
  const fileInputRef = useRef(null)
  const backdropRef = useRef(null)

  useEffect(() => {
    setRosterLoading(true)
    api
      .get('/users?limit=150&page=1')
      .then(({ data }) => {
        const users = data.data?.users ?? data.users ?? []
        setTeamRoster(Array.isArray(users) ? users : [])
      })
      .catch(() => setTeamRoster([]))
      .finally(() => setRosterLoading(false))
  }, [])

  const filteredAssignees = useMemo(() => {
    const q = assigneeSearch.trim().toLowerCase()
    const sid = String(selfId ?? '')
    const base = teamRoster.filter((u) => String(u._id ?? u.id) !== sid)
    if (!q) return base
    return base.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        String(u.email ?? '').toLowerCase().includes(q) ||
        String(u.role ?? '').toLowerCase().includes(q),
    )
  }, [teamRoster, assigneeSearch, selfId])

  function handleField(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function addImagesFromFiles(fileList) {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'))
    if (files.length === 0) return
    setFormError(null)
    files.forEach((file) => {
      if (file.size > MAX_IMAGE_BYTES) {
        setFormError(`Each image must be under ${Math.round(MAX_IMAGE_BYTES / 1024)} KB`)
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result
        if (typeof dataUrl !== 'string') return
        setReportImages((prev) => (prev.length >= MAX_IMAGES ? prev : [...prev, dataUrl]))
      }
      reader.readAsDataURL(file)
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removeImageAt(index) {
    setReportImages((prev) => prev.filter((_, i) => i !== index))
  }

  function assignToSelf() {
    if (!selfId) return
    setForm((f) => ({ ...f, assignedToUserId: String(selfId) }))
    setAssigneeName(selfName)
    setAssigneeSearch('')
    setAssignPickerOpen(false)
  }

  function selectAssignee(user) {
    const id = user._id ?? user.id
    setForm((f) => ({ ...f, assignedToUserId: String(id) }))
    setAssigneeName(user.name)
    setAssigneeSearch('')
    setAssignPickerOpen(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError(null)

    const desc = form.description.trim()
    if (!form.title.trim()) return setFormError('Title is required.')
    if (!form.severity) return setFormError('Severity is required.')
    if (!form.service.trim()) return setFormError('Service is required.')
    if (!form.assignedToUserId) return setFormError('Please assign this incident to a team member.')
    if (!desc && reportImages.length === 0) {
      return setFormError('Describe the problem in text and/or add at least one screenshot.')
    }

    const result = await dispatch(
      createIncidentThunk({
        ...form,
        description: desc,
        reportImages: reportImages.length ? reportImages : undefined,
      }),
    )
    if (createIncidentThunk.fulfilled.match(result)) {
      const name = result.payload?.assignedTo?.name ?? assigneeName
      setToast(`Incident created and assigned to ${name}`)
      setTimeout(() => { setToast(null); onClose() }, 1500)
    } else {
      setFormError(
        typeof result.payload === 'string'
          ? result.payload
          : result.payload?.message ?? 'Failed to create incident.',
      )
    }
  }

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
      onClick={(e) => { if (e.target === backdropRef.current) onClose() }}
    >
      <div className="relative w-full max-w-lg rounded-[12px] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
          <h2 className="text-[16px] font-semibold text-[#1e293b]">New incident</h2>
          <button type="button" onClick={onClose} className="text-[#94a3b8] hover:text-[#64748b]">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">
          {/* Title */}
          <div>
            <label className="mb-1 block text-[12px] font-medium text-[#475569]">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              value={form.title}
              onChange={(e) => handleField('title', e.target.value)}
              placeholder="Brief description of the incident"
              className="w-full rounded-[8px] border border-[#e2e8f0] px-3 py-2 text-[13px] text-[#1e293b] outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Description — optional if you attach images */}
          <div>
            <label className="mb-1 block text-[12px] font-medium text-[#475569]">
              Description <span className="font-normal text-[#94a3b8]">(or use images below)</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleField('description', e.target.value)}
              placeholder="What happened? What is affected?"
              rows={3}
              className="w-full rounded-[8px] border border-[#e2e8f0] px-3 py-2 text-[13px] text-[#1e293b] outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
            />
          </div>

          {/* Screenshots / problem images */}
          <div>
            <label className="mb-1 block text-[12px] font-medium text-[#475569]">
              Screenshots <span className="font-normal text-[#94a3b8]">(optional if you wrote a description)</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={(e) => addImagesFromFiles(e.target.files)}
            />
            <div className="flex flex-wrap gap-2">
              {reportImages.map((src, i) => (
                <div key={i} className="group relative h-20 w-20 overflow-hidden rounded-[8px] border border-[#e2e8f0]">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImageAt(i)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 text-[11px] font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {reportImages.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-[8px] border border-dashed border-[#cbd5e1] text-[#64748b] hover:border-[#4f46e5] hover:bg-indigo-50/50 hover:text-[#4f46e5]"
                >
                  <ImagePlus size={18} />
                  <span className="text-[10px] font-semibold">Add</span>
                </button>
              )}
            </div>
            <p className="mt-1 text-[11px] text-[#94a3b8]">Up to {MAX_IMAGES} images · max ~{Math.round(MAX_IMAGE_BYTES / 1024)} KB each</p>
          </div>

          {/* Severity + Service */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#475569]">
                Severity <span className="text-red-500">*</span>
              </label>
              <select
                value={form.severity}
                onChange={(e) => handleField('severity', e.target.value)}
                className="w-full rounded-[8px] border border-[#e2e8f0] px-3 py-2 text-[13px] text-[#1e293b] outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">Select…</option>
                {SEVERITIES.map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#475569]">
                Service <span className="text-red-500">*</span>
              </label>
              <input
                value={form.service}
                onChange={(e) => handleField('service', e.target.value)}
                placeholder="e.g. Payment API"
                className="w-full rounded-[8px] border border-[#e2e8f0] px-3 py-2 text-[13px] text-[#1e293b] outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Assign to */}
          <div>
            <label className="mb-1 block text-[12px] font-medium text-[#475569]">
              Assign to <span className="text-red-500">*</span>
            </label>
            {form.assignedToUserId ? (
              <div className="flex items-center justify-between rounded-[8px] border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-700">
                    {assigneeName.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-[13px] text-[#1e293b]">{assigneeName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setForm((f) => ({ ...f, assignedToUserId: '' })); setAssigneeName('') }}
                  className="text-[12px] text-[#94a3b8] hover:text-[#64748b]"
                >
                  Change
                </button>
              </div>
            ) : (
              <>
                {selfId && (
                  <button
                    type="button"
                    onClick={assignToSelf}
                    className="mb-2 inline-flex items-center gap-1.5 rounded-[6px] border border-[#e2e8f0] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#4f46e5] hover:bg-[#eef2ff]"
                  >
                    <User size={12} /> Assign to me
                  </button>
                )}
              <div className="relative">
                <input
                  value={assigneeSearch}
                  onChange={(e) => setAssigneeSearch(e.target.value)}
                  onFocus={() => setAssignPickerOpen(true)}
                  onBlur={() => { setTimeout(() => setAssignPickerOpen(false), 220) }}
                  placeholder="Click to see team — type to filter by name"
                  autoComplete="off"
                  className="w-full rounded-[8px] border border-[#e2e8f0] px-3 py-2 text-[13px] text-[#1e293b] outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                {assignPickerOpen && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-y-auto rounded-[8px] border border-[#e2e8f0] bg-white shadow-lg">
                    {rosterLoading ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 size={16} className="animate-spin text-[#94a3b8]" />
                      </div>
                    ) : filteredAssignees.length === 0 ? (
                      <p className="px-3 py-4 text-center text-[12px] text-[#64748b]">
                        {teamRoster.length <= 1
                          ? 'No other teammates in your org yet. Invite someone from Team.'
                          : 'No matching members. Clear the filter to see everyone.'}
                      </p>
                    ) : (
                      filteredAssignees.map((u) => {
                        const uid = u._id ?? u.id
                        return (
                          <button
                            key={String(uid)}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => selectAssignee(u)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-[#f8fafc]"
                          >
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-semibold text-indigo-700">
                              {u.name?.charAt(0).toUpperCase() ?? '?'}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[13px] font-medium text-[#1e293b]">{u.name}</p>
                              <p className="truncate text-[11px] text-[#64748b] capitalize">
                                {u.role}{u.email ? ` · ${u.email}` : ''}
                              </p>
                            </div>
                            <span
                              className={`shrink-0 h-2 w-2 rounded-full ${
                                u.status === 'online' ? 'bg-green-400' : 'bg-[#cbd5e1]'
                              }`}
                            />
                          </button>
                        )
                      })
                    )}
                  </div>
                )}
              </div>
              <p className="mt-1 text-[11px] text-[#94a3b8]">Everyone in your org appears here; use the field to narrow the list.</p>
              </>
            )}
          </div>

          {/* Error */}
          {(formError || createError) && (
            <p className="rounded-[8px] bg-red-50 px-3 py-2 text-[13px] text-red-600">
              {formError || (typeof createError === 'string' ? createError : createError?.message ?? 'Error')}
            </p>
          )}

          {/* Toast */}
          {toast && (
            <p className="rounded-[8px] bg-green-50 px-3 py-2 text-[13px] text-green-700">{toast}</p>
          )}

          {/* Footer */}
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
              disabled={creating}
              className="flex items-center gap-2 rounded-[8px] bg-[#4f46e5] px-4 py-2 text-[13px] font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {creating && <Loader2 size={13} className="animate-spin" />}
              Create incident
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
