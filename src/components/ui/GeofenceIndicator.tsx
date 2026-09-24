interface GeofenceIndicatorProps {
  distanceMeter: number | null
  accuracyMeter: number | null
  radiusMeter?: number
  accuracyLimit?: number
  className?: string
}

function isWithinRadius(
  distance: number | null,
  radius: number,
): boolean | null {
  if (distance === null) return null
  return distance <= radius
}

function isAccuracyValid(
  accuracy: number | null,
  limit: number,
): boolean | null {
  if (accuracy === null) return null
  return accuracy <= limit
}

export default function GeofenceIndicator({
  distanceMeter,
  accuracyMeter,
  radiusMeter = 200,
  accuracyLimit = 30,
  className = '',
}: GeofenceIndicatorProps) {
  const withinRadius = isWithinRadius(distanceMeter, radiusMeter)
  const accuracyOk = isAccuracyValid(accuracyMeter, accuracyLimit)

  const ready =
    withinRadius === true && accuracyOk === true

  const statusText = ready
    ? `Dalam Radius (${distanceMeter}m dari gerbang)`
    : `Di Luar Radius (${distanceMeter}m)`

  const accuracyText =
    accuracyMeter === null
      ? 'Akurasi: -'
      : `Akurasi ±${accuracyMeter}m`

  return (
    <div
      className={`
        inline-flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2
        text-xs font-medium
        ${ready
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-amber-50 text-amber-700 border-amber-200'}
        ${className}
      `.trim()}
    >
      <span
        className={`
          h-2 w-2 rounded-full
          ${ready ? 'bg-emerald-500' : 'bg-amber-500'}
        `}
        aria-hidden="true"
      />
      <span>{statusText}</span>
      <span className="text-slate-400">|</span>
      <span className="font-mono tabular-nums">{accuracyText}</span>
      {accuracyMeter !== null && accuracyMeter > accuracyLimit && (
        <span className="text-rose-600">
          (Akurasi melebihi {accuracyLimit}m)
        </span>
      )}
    </div>
  )
}