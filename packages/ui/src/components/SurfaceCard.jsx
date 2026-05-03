/**
 * Same elevated surface as {@link KpiCard} — use for dashboard panels so KPI row and content cards match.
 *
 * @param {{ children?: import('react').ReactNode, className?: string } & import('react').HTMLAttributes<HTMLDivElement>} props
 */
export function SurfaceCard({ children, className = '', ...rest }) {
  return (
    <div
      className={[
        'group relative overflow-hidden rounded-[8px] border-0 bg-white',
        'shadow-[0_3px_16px_rgba(15,23,42,0.10),0_2px_5px_rgba(15,23,42,0.06)]',
        'transition-shadow duration-300 hover:shadow-[0_6px_26px_rgba(15,23,42,0.12),0_3px_8px_rgba(15,23,42,0.08)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </div>
  )
}
