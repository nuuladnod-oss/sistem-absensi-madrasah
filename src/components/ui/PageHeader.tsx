import React from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  periodBadge?: string
  action?: React.ReactNode
  className?: string
}

export default function PageHeader({
  title,
  subtitle,
  periodBadge,
  action,
  className = '',
}: PageHeaderProps) {
  return (
    <div
      className={`
        flex flex-col gap-4 border-b border-slate-200 pb-4
        sm:flex-row sm:items-center sm:justify-between
        ${className}
      `.trim()}
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {periodBadge && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <span
                className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                aria-hidden="true"
              />
              {periodBadge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}