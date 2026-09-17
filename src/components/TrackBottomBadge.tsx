import { cn } from '@/lib/utils'

export type TrackType = 'workshop' | 'conference' | 'dinner'

export interface TrackBottomBadgeProps {
  track: TrackType
  label?: string
  className?: string
}

const trackGradientMap: Record<TrackType, string> = {
  workshop: 'bg-gradient-to-b from-[#00A859] to-[#24C6DC]',
  conference: 'bg-gradient-to-b from-[#FF3B30] to-[#FA709A]',
  dinner: 'bg-gradient-to-b from-[#2B7FFF] to-[#818CF8]',
}

const defaultLabelMap: Record<TrackType, string> = {
  workshop: 'Workshop',
  conference: 'Conference',
  dinner: 'Dinner',
}

/**
 * Bottom gradient container for the Workshop, Conference, and Dinner cards.
 */
export function TrackBottomBadge({
  track,
  label,
  className,
}: TrackBottomBadgeProps) {
  const displayLabel = label || defaultLabelMap[track]
  const gradientClass = trackGradientMap[track]

  return (
    <div
      className={cn(
        'w-full rounded-full px-5 py-8 text-center font-sans text-2xl font-bold tracking-tight text-white shadow-md sm:px-6 sm:py-9 sm:text-[30px]',
        gradientClass,
        className,
      )}
    >
      {displayLabel}
    </div>
  )
}

export default TrackBottomBadge
