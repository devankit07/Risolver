/**
 * Two-column chat shell: fixed-width left rail + flexible message area.
 *
 * @param {{ left: import('react').ReactNode, right: import('react').ReactNode, className?: string }} props
 */
export function ChatPanel({ left, right, className = '' }) {
  return (
    <div
      className={[
        'flex min-h-0 w-full flex-1 overflow-hidden rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-surface,#fff)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex w-[300px] shrink-0 flex-col border-r border-[var(--border,#e2e8f0)] bg-[var(--bg-base,#f8fafc)]">{left}</div>
      <div className="flex min-w-0 flex-1 flex-col bg-[var(--bg-surface,#fff)]">{right}</div>
    </div>
  )
}
