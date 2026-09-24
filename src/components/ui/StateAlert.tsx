import React, { ReactNode } from 'react'

type AlertVariant = 'success' | 'warning' | 'error' | 'info'

interface StateAlertProps {
  variant: AlertVariant
  title?: string
  children: ReactNode
  action?: ReactNode
  onDismiss?: () => void
  className?: string
}

const variantConfig: Record<
  AlertVariant,
  { bg: string; border: string; icon: string; title: string }
> = {
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: 'text-emerald-600',
    title: 'text-emerald-900',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'text-amber-600',
    title: 'text-amber-900',
  },
  error: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    icon: 'text-rose-600',
    title: 'text-rose-900',
  },
  info: {
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    icon: 'text-sky-600',
    title: 'text-sky-900',
  },
}

const icons: Record<AlertVariant, ReactNode> = {
  success: (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
  warning: (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  error: (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
      />
    </svg>
  ),
  info: (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
}

export default function StateAlert({
  variant,
  title,
  children,
  action,
  onDismiss,
  className = '',
}: StateAlertProps) {
  const cfg = variantConfig[variant]

  return (
    <div
      className={`
        flex items-start gap-3 rounded-xl border p-4
        ${cfg.bg} ${cfg.border} ${className}
      `.trim()}
    >
      <div className={`shrink-0 ${cfg.icon}`.trim()} aria-hidden="true">
        {icons[variant]}
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        {title && (
          <p className={`text-sm font-bold ${cfg.title}`.trim()}>{title}</p>
        )}
        <div className="text-xs text-slate-700 leading-relaxed">
          {children}
        </div>
        {action && <div className="pt-1">{action}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-slate-400 hover:text-slate-600 focus:outline-none"
          aria-label="Tutup"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  )
}