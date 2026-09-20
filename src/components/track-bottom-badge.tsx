import { cn } from '@/lib/utils'

export type TrackType = 'workshop' | 'conference' | 'dinner'

export interface TrackBottomBadgeProps {
  track: TrackType
  label?: string
  className?: string
}

/**
 * Radial washes lifted from the Figma frame. They share the geometry and the
 * 52% / 76% / 100% stop positions used by the accent badges and the gradient
 * button variant, so the whole brand palette stays in step.
 */
const trackGradientMap: Record<TrackType, string> = {
  workshop:
    'bg-[radial-gradient(85.98%_85.98%_at_50%_17.07%,#00AF57_52%,#45BFB8_76%,#6EC7F0_100%)]',
  conference:
    'bg-[radial-gradient(85.98%_85.98%_at_50%_17.07%,#FC413D_52%,#FD526F_76%,#FF63A0_100%)]',
  dinner:
    'bg-[radial-gradient(85.98%_85.98%_at_50%_17.07%,#3186FF_52%,#6D97FF_76%,#A9A8FF_100%)]',
}

const defaultLabelMap: Record<TrackType, string> = {
  workshop: 'Workshop',
  conference: 'Conference',
  dinner: 'Dinner',
}

/**
 * Bottom gradient container for the Workshop, Conference and Dinner cards.
 * The Figma pill is 309x161 design px, so it keeps a fixed aspect ratio and
 * centres its label rather than relying on vertical padding.
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
        'flex aspect-309/161 w-full items-center justify-center rounded-full px-5 text-center font-sans text-2xl font-bold tracking-tight text-white shadow-md sm:text-3xl lg:text-[40px]',
        gradientClass,
        className,
      )}
    >
      {displayLabel}
    </div>
  )
}

export default TrackBottomBadge
