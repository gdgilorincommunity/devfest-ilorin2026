import Image from 'next/image'

import { cn } from '@/lib/utils'

export interface DevfestIconBadgeProps {
  className?: string
}

/**
 * Top icon pill on the event track cards: the GDG mark, asterisk, globe and
 * scallop wave locked up inside a white pill. Rendered from the Figma vector
 * export so it stays crisp at every card size.
 */
export function DevfestIconBadge({ className }: DevfestIconBadgeProps) {
  return (
    <Image
      alt="DevFest Ilorin"
      className={cn('h-auto w-[197.5px] sm:w-[205px]', className)}
      height={48}
      src="/svg/devfest-frame.svg"
      width={295}
    />
  )
}

export default DevfestIconBadge
