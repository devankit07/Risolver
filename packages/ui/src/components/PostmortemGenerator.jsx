import { useState } from 'react'

/**
 * @param {{
 *   incidentId: string,
 *   initialProblem?: string,
 *   onGenerate?: (data: { problem: string, solution: string }) => Promise<any>,
 *   onPublish?: () => void,
 *   onSendToTeam?: () => void,
 *   variant?: 'dark' | 'light',
 * }} props
 */
export function PostmortemGenerator({
  incidentId: _incidentId,
  initialProblem = '',
  onGenerate,
  onPublish,
  onSendToTeam,
  variant = 'dark',
}) {
  const [problem, setProblem] = useState(initialProblem)
  const [solution, setSolution] = useState('')
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(null)
  const [preview, setPreview] = useState(false)
  const [sendToTeam, setSendToTeam] = useState(false)
  const [publishPublic, setPublishPublic] = useState(false)

  const L = variant === 'light'
  const card = L ? 'bg-white border-slate-200' : 'bg-[#0d0d0d] border-[#1a1a1a]'
  const label = L ? 'text-slate-500' : 'text-[#888]'
  const input = L
    ? 'bg-slate-50 border-slate-200 text-[#0f172a]'
    : 'bg-[#111] border-[#1a1a1a] text-[#f0f0f0]'
  const title = L ? 'text-[#0f172a]' : 'text-[#f0f0f0]'
  const subtle = L ? 'text-slate-400' : 'text-[#555]'
  const border = L ? 'border-slate-200' : 'border-[#1a1a1a]'
  const btnPrimary = L ? 'bg-[#4f46e5] text-white' : 'bg-[#4f46e5] text-white'
  const textBody = L ? 'text-[#0f172a]' : 'text-[#f0f0f0]'

  async function handleGenerate() {
    setLoading(true)
    try {
      const result = await onGenerate?.({ problem, solution })
      setGenerated(
        result ?? {
          whatHappened: problem || 'An incident occurred affecting service availability.',
          rootCause: 'Root cause identified through system analysis.',
          solutionApplied: solution || 'Applied a targeted fix to resolve the issue.',
          preventionSteps: ['Add monitoring', 'Update runbook', 'Review alerts'],
        },
      )
    } catch {
      /* parent */
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-3 ${card}`}>
      <span className={`text-[13px] font-semibold ${title}`}>Generate postmortem</span>

      {!generated && <span className={`text-[11px] ${subtle}`}>No draft generated yet</span>}

      <div className="flex flex-col gap-2">
        <label className={`text-[11px] font-medium ${label}`}>Problem description</label>
        <textarea
          rows={3}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Describe what happened..."
          className={`w-full rounded-lg px-3 py-2 text-[12px] resize-none outline-none border ${input}`}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className={`text-[11px] font-medium ${label}`}>Solution applied</label>
        <textarea
          rows={3}
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          placeholder="What was done to resolve it..."
          className={`w-full rounded-lg px-3 py-2 text-[12px] resize-none outline-none border ${input}`}
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className={`flex-1 min-w-[120px] py-2 rounded-lg text-[12px] font-semibold transition-opacity disabled:opacity-50 ${btnPrimary}`}
        >
          {loading ? 'Generating…' : 'Generate with AI'}
        </button>
        {generated && (
          <button
            type="button"
            onClick={() => setPreview((v) => !v)}
            className={`px-3 py-2 rounded-lg text-[12px] border border-slate-200 bg-white text-slate-600`}
          >
            {preview ? 'Hide' : 'Preview'}
          </button>
        )}
      </div>

      {generated && preview && (
        <div className={`flex flex-col gap-2 border-t pt-3 ${border}`}>
          {[
            ['What happened', generated.whatHappened],
            ['Root cause', generated.rootCause],
            ['Solution applied', generated.solutionApplied],
          ].map(([lbl, text]) => (
            <details key={lbl} className="group">
              <summary className={`text-[11px] font-medium cursor-pointer select-none ${label}`}>{lbl}</summary>
              <p className={`mt-1 text-[12px] leading-relaxed pl-2 ${textBody}`}>{text}</p>
            </details>
          ))}
          {generated.preventionSteps?.length > 0 && (
            <details>
              <summary className={`text-[11px] font-medium cursor-pointer ${label}`}>Prevention steps</summary>
              <ol className={`mt-1 pl-4 flex flex-col gap-0.5 list-decimal ${textBody} text-[12px]`}>
                {generated.preventionSteps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </details>
          )}
        </div>
      )}

      {generated && (
        <div className={`flex flex-col gap-2 border-t pt-3 ${border}`}>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sendToTeam}
              onChange={(e) => {
                setSendToTeam(e.target.checked)
                if (e.target.checked) onSendToTeam?.()
              }}
              className="rounded accent-[#4f46e5]"
            />
            <span className={`text-[12px] ${label}`}>Send to team</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={publishPublic}
              onChange={(e) => {
                setPublishPublic(e.target.checked)
                if (e.target.checked) onPublish?.()
              }}
              className="rounded accent-[#4f46e5]"
            />
            <span className={`text-[12px] ${label}`}>Publish publicly</span>
          </label>
          <button
            type="button"
            className={`w-full py-2 rounded-lg text-[12px] border ${L ? 'border-slate-200 text-slate-600 bg-white' : 'border-[#1f1f1f] text-[#888]'}`}
          >
            ↓ Download PDF
          </button>
        </div>
      )}
    </div>
  )
}
