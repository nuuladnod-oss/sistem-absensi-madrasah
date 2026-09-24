interface MetricCardProps {
  label: string
  value: number | string
  helper?: string
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

const trendColor: Record<NonNullable<MetricCardProps['trend']>, string> = {
  up: 'text-emerald-600',
  down: 'text-rose-600',
  neutral: 'text-slate-500',
}

export default function MetricCard({
  label,
  value,
  helper,
  trend = 'neutral',
  className = '',
}: MetricCardProps) {
  return (
    <div
      className={`
        rounded-xl border border-slate-200 bg-white p-4 shadow-xs
        ${className}
      `.trim()}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-slate-900 tabular-nums">
          {value}
        </span>
      </div>
      {helper && (
        <p className={`mt-1 text-xs ${trendColor[trend]}`}>{helper}</p>
      )}
    </div>
  )
}