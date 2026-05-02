import { StatusBadge } from './StatusBadge.jsx'
import { Avatar } from './Avatar.jsx'

const SEVERITY_DOT = {
  critical: '#ff4444',
  high:     '#ff8c00',
  medium:   '#f59e0b',
  low:      '#888',
}

/**
 * @param {{
 *   incident: {
 *     id: string, title: string, status: string, severity: string,
 *     service?: string, assignees?: string[], createdAt?: string
 *   },
 *   onClick?: () => void
 * }} props
 */
export function IncidentRow({ incident, onClick }) {
  const dotColor = SEVERITY_DOT[incident.severity?.toLowerCase()] ?? '#888'

  return (
    <tr
      onClick={onClick}
      className="border-b cursor-pointer transition-colors hover:bg-[#0d0d0d]"
      style={{ borderColor: '#1a1a1a' }}
    >
      <td className="py-2.5 pl-4 pr-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dotColor }} />
          <span className="text-[12px]" style={{ color: '#f0f0f0' }}>{incident.title}</span>
        </div>
      </td>
      <td className="py-2.5 px-2">
        <span className="text-[11px]" style={{ color: '#555' }}>{incident.id}</span>
      </td>
      <td className="py-2.5 px-2">
        <StatusBadge status={incident.severity ?? 'low'} />
      </td>
      <td className="py-2.5 px-2">
        <StatusBadge status={incident.status ?? 'open'} />
      </td>
      <td className="py-2.5 px-2">
        <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: '#141414', color: '#888' }}>
          {incident.service ?? '—'}
        </span>
      </td>
      <td className="py-2.5 px-2">
        <div className="flex items-center gap-0.5">
          {(incident.assignees ?? []).slice(0, 3).map((a) => (
            <Avatar key={a} name={a} size={20} />
          ))}
        </div>
      </td>
      <td className="py-2.5 pl-2 pr-4 text-right">
        <span className="text-[11px]" style={{ color: '#555' }}>{incident.createdAt ?? '—'}</span>
      </td>
    </tr>
  )
}
