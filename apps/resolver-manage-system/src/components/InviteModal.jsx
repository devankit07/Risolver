import { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { X, Copy, Check, Plus, ChevronDown, Tag, Briefcase } from 'lucide-react'
import { generateInvite, fetchRoles, addCustomRole, clearLastGenerated } from '../store/inviteSlice.js'

// ─── Tag config ───────────────────────────────────────────────────────────────

const TAG_OPTIONS = [
  {
    value: 'creator',
    label: 'Creator',
    desc: 'Can create & manage incidents',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dot: 'bg-indigo-500',
  },
  {
    value: 'responder',
    label: 'Responder',
    desc: 'Responds to assigned incidents',
    color: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-500',
  },
]

function TagPill({ value }) {
  const t = TAG_OPTIONS.find((x) => x.value === value)
  if (!t) return <span className="text-[12px] text-slate-500">{value}</span>
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${t.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
      {t.label}
    </span>
  )
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyBtn({ value }) {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* ignore */ }
  }, [value])
  return (
    <button type="button" onClick={copy}
      className="ml-2 flex shrink-0 items-center gap-1 rounded-[6px] border border-[var(--border,#e2e8f0)] bg-white px-2 py-1 text-[11px] font-semibold text-[var(--text-secondary,#64748b)] transition-colors hover:border-[var(--accent,#4f46e5)] hover:text-[var(--accent,#4f46e5)]">
      {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function Field({ label, value, mono, children }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-base,#f8fafc)] px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary,#64748b)]">{label}</p>
        {children ?? (
          <p className={`mt-0.5 truncate text-[13px] font-semibold text-[var(--text-primary,#1e293b)] ${mono ? 'font-mono' : ''}`}>
            {value}
          </p>
        )}
      </div>
      {value && <CopyBtn value={value} />}
    </div>
  )
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export default function InviteModal({ onClose }) {
  const dispatch = useDispatch()
  const { defaultRoles, defaultSpecializations = [], customRoles, generating, lastGenerated, error } = useSelector((s) => s.invite)
  const auth = useSelector((s) => s.auth)
  const orgId = auth.user?.organizationId ?? auth.user?._id

  const [name, setName]               = useState('')
  const [tag, setTag]                 = useState('')           // system role: manager | creator | responder
  const [specialization, setSpec]     = useState('')           // team role: Dev, DevOps, Tester…
  const [addingSpec, setAddingSpec]   = useState(false)
  const [newSpecName, setNewSpecName] = useState('')
  const [addSpecError, setAddSpecError] = useState('')
  const [step, setStep] = useState('form') // 'form' | 'result'

  // We reuse the customRoles mechanism for custom specializations
  const allSpecs = [...defaultSpecializations, ...customRoles.filter((r) => !defaultRoles.includes(r))]

  useEffect(() => {
    dispatch(fetchRoles())
    return () => { dispatch(clearLastGenerated()) }
  }, [dispatch])

  useEffect(() => {
    if (lastGenerated) setStep('result')
  }, [lastGenerated])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !tag) return
    dispatch(generateInvite({ name: name.trim(), role: tag, specialization: specialization || null, organizationId: orgId }))
  }

  const handleAddSpec = async () => {
    setAddSpecError('')
    if (!newSpecName.trim() || newSpecName.trim().length < 2) { setAddSpecError('Min 2 characters'); return }
    const result = await dispatch(addCustomRole(newSpecName.trim()))
    if (!result.error) {
      setSpec(newSpecName.trim())
      setNewSpecName('')
      setAddingSpec(false)
    } else {
      setAddSpecError(result.payload ?? 'Failed to add')
    }
  }

  const handleDone = () => {
    dispatch(clearLastGenerated())
    setStep('form')
    setName('')
    setTag('')
    setSpec('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-md rounded-[12px] bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border,#e2e8f0)] px-5 py-4">
          <h2 className="text-[15px] font-semibold text-[var(--text-primary,#1e293b)]">
            {step === 'form' ? 'Invite team member' : 'Credentials generated'}
          </h2>
          <button type="button" onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>

        {/* ── Form step ── */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">

            {/* Full name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold uppercase tracking-wider text-[var(--text-secondary,#64748b)]">
                Full name
              </label>
              <input required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alice Johnson"
                className="rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-surface,#fff)] px-3 py-2.5 text-[13px] outline-none placeholder:text-slate-400 focus:border-[var(--accent,#4f46e5)] focus:ring-2 focus:ring-[var(--accent,#4f46e5)]/15" />
            </div>

            {/* Role / Specialization */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-[var(--text-secondary,#64748b)]">
                <Briefcase size={12} />
                Role / Team
              </label>
              <p className="text-[11px] text-slate-400 -mt-1">Their job or department (e.g. Dev, DevOps, Tester)</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select value={specialization} onChange={(e) => setSpec(e.target.value)}
                    className="w-full cursor-pointer appearance-none rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-surface,#fff)] px-3 py-2.5 pr-8 text-[13px] outline-none focus:border-[var(--accent,#4f46e5)] focus:ring-2 focus:ring-[var(--accent,#4f46e5)]/15">
                    <option value="">Select role…</option>
                    {allSpecs.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <button type="button" onClick={() => setAddingSpec(!addingSpec)} title="Add custom role"
                  className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[8px] border border-[var(--border,#e2e8f0)] bg-white text-slate-400 hover:border-[var(--accent,#4f46e5)] hover:text-[var(--accent,#4f46e5)]">
                  <Plus size={16} />
                </button>
              </div>

              {addingSpec && (
                <div className="flex flex-col gap-1.5 rounded-[8px] border border-[var(--accent-border,#c7d2fe)] bg-[var(--accent-dim,#eef2ff)] p-3">
                  <p className="text-[11px] font-semibold text-[var(--accent,#4f46e5)]">Add custom role</p>
                  <div className="flex gap-2">
                    <input value={newSpecName} onChange={(e) => setNewSpecName(e.target.value)}
                      placeholder="e.g. SRE, QA, Designer"
                      className="flex-1 rounded-[6px] border border-[var(--border,#e2e8f0)] bg-white px-2.5 py-1.5 text-[12px] outline-none focus:border-[var(--accent,#4f46e5)]"
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSpec() } }} />
                    <button type="button" onClick={handleAddSpec}
                      className="rounded-[6px] bg-[var(--accent,#4f46e5)] px-3 py-1.5 text-[12px] font-semibold text-white hover:brightness-110">
                      Add
                    </button>
                  </div>
                  {addSpecError && <p className="text-[11px] text-red-600">{addSpecError}</p>}
                </div>
              )}
            </div>

            {/* Tag = system access level */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-[var(--text-secondary,#64748b)]">
                <Tag size={12} />
                Access tag
              </label>
              <p className="text-[11px] text-slate-400 -mt-1">Determines what this person can do in the system</p>
              <div className="flex flex-col gap-2">
                {TAG_OPTIONS.map((t) => (
                  <label key={t.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-[8px] border px-3 py-2.5 transition-colors ${
                      tag === t.value
                        ? 'border-[var(--accent,#4f46e5)] bg-[var(--accent-dim,#eef2ff)]'
                        : 'border-[var(--border,#e2e8f0)] bg-white hover:border-slate-300'
                    }`}>
                    <input type="radio" name="tag" value={t.value} checked={tag === t.value}
                      onChange={() => setTag(t.value)} className="sr-only" />
                    <span className={`h-2.5 w-2.5 rounded-full ${t.dot}`} />
                    <div className="min-w-0 flex-1">
                      <span className={`text-[13px] font-semibold ${tag === t.value ? 'text-[var(--accent,#4f46e5)]' : 'text-[var(--text-primary,#1e293b)]'}`}>
                        {t.label}
                      </span>
                      <p className="text-[11px] text-slate-400">{t.desc}</p>
                    </div>
                    {tag === t.value && (
                      <Check size={14} className="shrink-0 text-[var(--accent,#4f46e5)]" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <p className="rounded-[6px] bg-red-50 px-3 py-2 text-[12px] text-red-700">{error}</p>
            )}

            <button type="submit" disabled={generating || !name.trim() || !tag}
              className="w-full rounded-[8px] bg-[var(--accent,#4f46e5)] py-2.5 text-[13px] font-semibold text-white shadow-sm transition-opacity hover:brightness-110 disabled:opacity-50">
              {generating ? 'Generating…' : 'Generate credentials'}
            </button>
          </form>
        )}

        {/* ── Result step ── */}
        {step === 'result' && lastGenerated && (
          <div className="flex flex-col gap-4 p-5">
            <div className="flex items-center gap-2 rounded-[8px] bg-emerald-50 px-3 py-2.5">
              <Check size={16} className="shrink-0 text-emerald-600" />
              <p className="text-[13px] font-semibold text-emerald-800">Credentials generated successfully</p>
            </div>

            <div className="flex flex-col gap-2">
              <Field label="Name" value={lastGenerated.name} />

              <div className="flex gap-2">
                {lastGenerated.specialization && (
                  <div className="flex-1 rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-base,#f8fafc)] px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary,#64748b)]">Role</p>
                    <p className="mt-0.5 text-[13px] font-semibold text-[var(--text-primary,#1e293b)]">{lastGenerated.specialization}</p>
                  </div>
                )}
                <div className="flex-1 rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-base,#f8fafc)] px-3 py-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary,#64748b)]">Access tag</p>
                  <div className="mt-0.5"><TagPill value={lastGenerated.role} /></div>
                </div>
              </div>

              <Field label="Login ID" value={lastGenerated.inviteId} mono />
              <Field label="Temp Password" value={lastGenerated.tempPassword} mono />
              <Field label="Share link" value={lastGenerated.shareLink} />
            </div>

            <div className="flex items-start gap-2 rounded-[8px] border border-amber-200 bg-amber-50 px-3 py-2.5 text-[12px] text-amber-800">
              <span className="mt-0.5 text-amber-500">⚠</span>
              Save these now. Password is shown only once and cannot be recovered.
            </div>

            <button type="button" onClick={handleDone}
              className="w-full rounded-[8px] bg-[var(--accent,#4f46e5)] py-2.5 text-[13px] font-semibold text-white hover:brightness-110">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
