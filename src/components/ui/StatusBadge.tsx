export type AttendanceStatusType =
  | 'HADIR'
  | 'TERLAMBAT'
  | 'PULANG_CEPAT'
  | 'BELUM_ABSEN_PULANG'
  | 'ALPA'
  | 'IZIN'
  | 'SAKIT'
  | 'IZIN_MENUNGGU_APPROVAL'

interface StatusBadgeProps {
  status: AttendanceStatusType
  className?: string
}

const statusConfig: Record<
  AttendanceStatusType,
  { label: string; bg: string }
> = {
  HADIR: {
    label: 'Hadir',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  TERLAMBAT: {
    label: 'Terlambat',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  PULANG_CEPAT: {
    label: 'Pulang Cepat',
    bg: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  BELUM_ABSEN_PULANG: {
    label: 'Belum Absen Pulang',
    bg: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  ALPA: { label: 'Alpa', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
  IZIN: { label: 'Izin Resmi', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  SAKIT: {
    label: 'Sakit',
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  IZIN_MENUNGGU_APPROVAL: {
    label: 'Menunggu Approval',
    bg: 'bg-purple-50 text-purple-700 border-purple-200',
  },
}

export default function StatusBadge({
  status,
  className = '',
}: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.HADIR

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-1 rounded-full
        text-xs font-semibold border whitespace-nowrap
        ${config.bg}
        ${className}
      `.trim()}
    >
      {config.label}
    </span>
  )
}