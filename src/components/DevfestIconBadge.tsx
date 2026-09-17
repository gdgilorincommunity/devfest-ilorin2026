import Image from 'next/image'

import { cn } from '@/lib/utils'

export interface DevfestIconBadgeProps {
  className?: string
}

/**
 * Top icon pill container displaying the 4 high-resolution DevFest brand icons:
 * Devfest brackets, star, globe, and scallop wave.
 */
export function DevfestIconBadge({ className }: DevfestIconBadgeProps) {
  return (
    <div
      className={cn(
        'flex w-[197.5px] items-center justify-between overflow-hidden rounded-full border border-black/5 bg-white px-3.5 py-3.5 sm:w-[205px] sm:px-4 sm:py-4',
        className,
      )}
    >
      {/* Devfest Code Brackets */}
      <Image
        alt="Devfest code brackets"
        className="h-3.5 w-auto shrink-0 object-contain sm:h-4"
        height={25}
        quality={90}
        src="/images/recap-images/devfest-icon.png"
        width={44}
      />

      {/* 8-point Asterisk Star */}
      <Image
        alt="Star icon"
        className="h-3.5 w-auto shrink-0 object-contain sm:h-4"
        height={28}
        quality={90}
        src="/images/recap-images/devfest-star-icon.png"
        width={28}
      />

      {/* Wireframe Globe */}
      <Image
        alt="World icon"
        className="h-3.5 w-auto shrink-0 object-contain sm:h-4"
        height={28}
        quality={90}
        src="/images/recap-images/devfest-world-icon.png"
        width={31}
      />

      {/* Scallop Wave */}
      <Image
        alt="Wave pattern"
        className="h-2 w-auto shrink-0 object-contain sm:h-2.5"
        height={16}
        quality={90}
        src="/images/recap-images/devfest-icon-2.png"
        width={101}
      />
    </div>
  )
}

export default DevfestIconBadge
