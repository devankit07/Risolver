import gsap from 'gsap'
import { useEffect, useState } from 'react'

const SCRIPT = [
  '> resolver incident create',
  '✓ Incident INC-042 created — "Payment gateway 500 errors"',
  '✓ AI triage running...',
  '✓ Summary: API returning 500 on /charge endpoint',
  '✓ Suggestions: Check DB pool, verify Stripe status',
  '> resolver assign @rahul @priya',
  '✓ Responders notified',
]

export function AnimatedTerminal() {
  const [lines, setLines] = useState(() => SCRIPT.map(() => ''))

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 })

    tl.call(() => setLines(SCRIPT.map(() => '')))

    const proxy = { p: 0 }
    SCRIPT.forEach((fullLine, lineIndex) => {
      tl.fromTo(
        proxy,
        { p: 0 },
        {
          p: 1,
          duration: Math.max(0.35, fullLine.length * 0.022),
          ease: 'none',
          onUpdate: function updateLine() {
            const prog = proxy.p
            const chars = Math.min(fullLine.length, Math.ceil(prog * fullLine.length))
            setLines((prev) => {
              const next = [...prev]
              next[lineIndex] = fullLine.slice(0, chars)
              return next
            })
          },
          onComplete() {
            proxy.p = 0
            setLines((prev) => {
              const next = [...prev]
              next[lineIndex] = fullLine
              return next
            })
          },
        },
      )
      tl.to({}, { duration: 0.06 })
    })

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div className="w-full max-w-2xl rounded-xl border border-[var(--border)] bg-[#0d0d0d] p-6 font-mono text-sm text-[var(--accent-green)] shadow-card md:p-8 md:text-[15px]">
      <div className="mb-4 flex items-center gap-2 border-b border-[var(--border)] pb-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-xs text-[var(--text-secondary)]">resolver-cli</span>
      </div>
      <pre className="m-0 whitespace-pre-wrap break-words leading-relaxed">
        {SCRIPT.map((full, i) => (
          <span key={full} className="block min-h-[1.4em]">
            {lines[i] ?? ''}
            {i === SCRIPT.length - 1 && lines[i] === full ? (
              <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-[var(--accent-green)] align-[-2px]" />
            ) : null}
          </span>
        ))}
      </pre>
    </div>
  )
}
