import { Sparkles, Lightbulb, Pencil } from 'lucide-react'

/**
 * Three resolution paths for workspace (visual chooser).
 *
 * @param {{
 *   selected: 'ai_solution' | 'ai_suggestion' | 'manual' | null,
 *   onSelect: (m: 'ai_solution' | 'ai_suggestion' | 'manual') => void,
 * }} props
 */
export function ResolutionMethodCard({ selected, onSelect }) {
  const btn =
    'flex w-full flex-col gap-1 rounded-[8px] border px-4 py-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent,#4f46e5)] focus-visible:ring-offset-2'

  return (
    <div className="rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-base,#f8fafc)] p-4">
      <p className="mb-3 text-[12px] font-medium text-[var(--text-secondary,#64748b)]">How do you want to resolve this?</p>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => onSelect('ai_solution')}
          className={`${btn} ${
            selected === 'ai_solution'
              ? 'border-[var(--accent,#4f46e5)] bg-[var(--accent,#4f46e5)] text-white'
              : 'border-transparent bg-[var(--accent,#4f46e5)] text-white hover:brightness-110'
          }`}
        >
          <span className="flex items-center gap-2 text-[13px] font-semibold">
            <Sparkles size={16} /> AI Solution
          </span>
          <span className={`text-[11px] ${selected === 'ai_solution' ? 'text-indigo-100' : 'text-indigo-100'}`}>
            Full code analysis via GitHub
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelect('ai_suggestion')}
          className={`${btn} border-2 border-[var(--accent,#4f46e5)] bg-white text-[var(--accent,#4f46e5)] hover:bg-[var(--accent-dim,#eef2ff)] ${
            selected === 'ai_suggestion' ? 'ring-2 ring-[var(--accent,#4f46e5)] ring-offset-2' : ''
          }`}
        >
          <span className="flex items-center gap-2 text-[13px] font-semibold">
            <Lightbulb size={16} /> AI Suggestion
          </span>
          <span className="text-[11px] text-[var(--text-secondary,#64748b)]">Smart suggestions based on incident</span>
        </button>

        <button
          type="button"
          onClick={() => onSelect('manual')}
          className={`${btn} border border-[var(--border,#e2e8f0)] bg-white text-[var(--text-secondary,#64748b)] hover:bg-slate-50 ${
            selected === 'manual' ? 'border-slate-400 ring-2 ring-slate-300' : ''
          }`}
        >
          <span className="flex items-center gap-2 text-[13px] font-semibold text-[var(--text-primary,#1e293b)]">
            <Pencil size={16} /> Manual
          </span>
          <span className="text-[11px]">Write your own solution</span>
        </button>
      </div>
    </div>
  )
}
