import Image from 'next/image'

import { cn } from '@/lib/utils'

export interface LogoProps {
  className?: string
  priority?: boolean
}

/**
 * The 2026 DevFest Ilorin lockup: the dark-outlined GDG mark beside the
 * wordmark. Replaces the bracketed `{ DevFest }` lockup used in 2025.
 *
 * The wordmark is live text rather than part of the SVG so it renders in
 * Google Sans alongside the rest of the page and stays selectable.
 */
export function Logo({ className, priority = false }: LogoProps) {
  return (
    <span className={cn('flex items-center gap-2.5 lg:gap-3', className)}>
      <Image
        aria-hidden
        alt=""
        className="h-9 w-auto shrink-0 lg:h-13"
        height={38}
        priority={priority}
        src="/svg/gdg-icon.svg"
        width={69}
      />
      <span className="font-sans text-xl font-medium whitespace-nowrap text-[#1E1E1E] lg:text-[30px]">
        DevFest Ilorin
      </span>
    </span>
  )
}

export default Logo
