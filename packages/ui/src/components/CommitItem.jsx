import { Avatar } from './Avatar.jsx'

/**
 * @param {{ hash: string, message: string, author: string, time: string }} props
 */
export function CommitItem({ hash, message, author, time }) {
  return (
    <div className="flex flex-col gap-1 border-b border-[var(--border,#e2e8f0)] py-2 last:border-0">
      <div className="flex items-center gap-2">
        <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-700">{hash}</code>
        <span className="truncate text-[12px] font-medium text-[var(--text-primary,#1e293b)]">{message}</span>
      </div>
      <div className="flex items-center gap-2 pl-0.5">
        <Avatar name={author} size={16} />
        <span className="text-[11px] text-[var(--text-secondary,#64748b)]">{author}</span>
        <span className="text-[10px] tabular-nums text-slate-400">{time}</span>
      </div>
    </div>
  )
}
