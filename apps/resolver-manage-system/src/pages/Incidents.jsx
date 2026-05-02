import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IncidentRow } from '@resolver/ui'

const COL_HEADS = ['Title', 'ID', 'Severity', 'Status', 'Service', 'Assignees', 'Created']

export default function Incidents() {
  const navigate = useNavigate()
  const { list: incidents, loading } = useSelector((s) => s.incidents)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium" style={{ color: '#f0f0f0' }}>All incidents</span>
        <button
          className="h-8 px-3 rounded-md text-[12px] font-medium"
          style={{ background: '#00e87a', color: '#000' }}
        >
          + New incident
        </button>
      </div>

      <div className="rounded-lg border overflow-hidden" style={{ borderColor: '#1a1a1a' }}>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b" style={{ borderColor: '#1a1a1a', background: '#0d0d0d' }}>
              {COL_HEADS.map((h) => (
                <th key={h} className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-medium" style={{ color: '#555' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b" style={{ borderColor: '#1a1a1a' }}>
                  {COL_HEADS.map((h) => (
                    <td key={h} className="py-3 px-3">
                      <div className="h-3 rounded animate-pulse" style={{ background: '#141414', width: '80%' }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : incidents.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <p className="text-[13px]" style={{ color: '#444' }}>No incidents found</p>
                  <p className="text-[11px] mt-1" style={{ color: '#333' }}>All clear — no incidents to display</p>
                </td>
              </tr>
            ) : (
              incidents.map((inc) => (
                <IncidentRow
                  key={inc.id}
                  incident={inc}
                  onClick={() => navigate(`/workspace/${inc.id}`)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
