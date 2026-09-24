import React, { ReactNode, useEffect, useRef } from 'react'

interface ModalConfirmProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'primary' | 'danger'
  onConfirm: () => void
  onClose: () => void
  children?: ReactNode
}

export default function ModalConfirm({
  open,
  title,
  description,
  confirmLabel = 'Ya',
  cancelLabel = 'Batal',
  variant = 'primary',
  onConfirm,
  onClose,
  children,
}: ModalConfirmProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const confirmButtonClasses =
    variant === 'danger'
      ? 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-600/30'
      : 'bg-madrasah-600 text-white hover:bg-madrasah-700 focus:ring-madrasah-600/30'

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div
        className="
          w-full max-w-md rounded-xl border border-slate-200 bg-white p-6
          shadow-lg focus:outline-none
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="space-y-3">
          <h3 id="modal-title" className="text-base font-bold text-slate-900">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-slate-600">{description}</p>
          )}
          {children}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="
              inline-flex h-10 items-center justify-center rounded-lg
              border border-slate-300 bg-white px-4 text-sm font-semibold
              text-slate-700 hover:bg-slate-50 focus:outline-none
              focus:ring-2 focus:ring-slate-300
            "
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`
              inline-flex h-10 items-center justify-center rounded-lg
              px-4 text-sm font-semibold text-white
              focus:outline-none focus:ring-2
              ${confirmButtonClasses}
            `.trim()}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}