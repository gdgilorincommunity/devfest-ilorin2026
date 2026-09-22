import Image from 'next/image'

import { cn } from '@/lib/utils'

export interface TrackTopPillProps {
  className?: string
  priority?: boolean
}

/**
 * The white glyph pill that sits at the top of each event track card.
 *
 * Each glyph is its own exported Figma asset rather than one flattened image,
 * so they load independently and stay crisp at any card size.
 */
export function TrackTopPill({
  className,
  priority = false,
}: TrackTopPillProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'flex items-center justify-center gap-2.5 rounded-full bg-white px-4 py-2.5 sm:gap-3.5 sm:px-5 sm:py-3.5 lg:gap-4.5 lg:px-5 lg:py-5',
        className,
      )}
    >
      <Image
        alt=""
        className="h-3.5 w-auto sm:h-4.5 lg:h-5.75"
        height={24}
        priority={priority}
        src="/svg/track-pill-gdg.svg"
        width={44}
      />
      <Image
        alt=""
        className="h-4 w-auto sm:h-5 lg:h-6.75"
        height={28}
        priority={priority}
        src="/svg/track-pill-asterisk.svg"
        width={28}
      />
      <Image
        alt=""
        className="h-4 w-auto sm:h-5 lg:h-6.75"
        height={28}
        priority={priority}
        src="/svg/track-pill-globe.svg"
        width={31}
      />
      <Image
        alt=""
        className="h-2.25 w-auto sm:h-3 lg:h-3.75"
        height={16}
        priority={priority}
        src="/svg/track-pill-wave.svg"
        width={101}
      />
    </div>
  )
}

export default TrackTopPill
