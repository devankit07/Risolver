/**
 * @typedef {{ label: string, resolver: import('react').ReactNode, pagerduty: import('react').ReactNode, opsgenie: import('react').ReactNode, statuspage: import('react').ReactNode }} ComparisonRow
 */

/**
 * @param {{ rows: ComparisonRow[] }} props
 */
export function ComparisonTable({ rows }) {
  const cols = [
    { key: 'resolver', label: 'Resolver', highlight: true },
    { key: 'pagerduty', label: 'PagerDuty', highlight: false },
    { key: 'opsgenie', label: 'incident.io', highlight: false },
    { key: 'statuspage', label: 'Jira', highlight: false },
  ]
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="p-4 font-semibold text-[var(--text-secondary)]">Feature</th>
            {cols.map((c) => (
              <th
                key={c.key}
                className={[
                  'p-4 font-semibold',
                  c.highlight
                    ? 'rounded-t-lg border-x border-t border-[var(--accent-green)] bg-[var(--accent-green-dim)] text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)]',
                ].join(' ')}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-[var(--border)] last:border-0">
              <td className="p-4 font-medium text-[var(--text-primary)]">{row.label}</td>
              {cols.map((c) => (
                <td
                  key={c.key}
                  className={[
                    'p-4 text-[var(--text-secondary)]',
                    c.highlight ? 'border-x border-[var(--accent-green)] bg-[var(--accent-green-dim)]/50' : '',
                  ].join(' ')}
                >
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Check() {
  return (
    <span className="inline-flex items-center gap-1 font-medium text-[var(--accent-green)]">
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 6L9 17l-5-5" />
      </svg>
      Yes
    </span>
  )
}

export function Cross() {
  return (
    <span className="inline-flex items-center gap-1 font-medium text-[var(--resolver-red)]">
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
      No
    </span>
  )
}
