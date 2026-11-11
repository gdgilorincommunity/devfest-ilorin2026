import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Calendar, MapPin } from 'lucide-react'

import { cn } from '@/lib/utils'
import config from '@/config'

export interface VenuesProps {
  title?: string
  venueName?: {
    firstLine: string
    secondLine: string
  }
  date?: string
  workshopTicket?: {
    label: string
    href: string
  }
  dinnerTicket?: {
    label: string
    href: string
  }
  className?: string
}

/**
 * Venues Section Component
 *
 * Showcases the event venue (Ilorin Innovation Hub) with a photo from the
 * event, date and venue pills, and action CTA buttons. With the event over, the ticket
 * buttons gave way to a single link to the photos.
 */
export function Venues({
  title = 'Venues',
  venueName = {
    firstLine: 'Innovation',
    secondLine: 'hub Ilorin',
  },
  date = '6th - 7th Nov 2026',
  workshopTicket = {
    label: 'View Photos',
    href: config.photosUrl,
  },
  dinnerTicket,
  className,
}: VenuesProps) {
  return (
    <section
      aria-label={title}
      className={cn(
        'relative w-full overflow-hidden bg-gradient-to-b from-[#181A20] via-[#16181F] to-[#1C2232] py-16 sm:py-20 lg:py-24',
        className,
      )}
    >
      <div
        data-reveal
        className="mx-auto flex w-full max-w-[1512px] flex-col items-center px-4 md:px-[64px] lg:px-[128px]"
      >
        {/* Section Heading */}
        <h2 className="mb-10 text-center font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl lg:mb-14 lg:text-5xl">
          {title}
        </h2>

        {/* Venue Showcase Card */}
        <div className="relative aspect-[16/12] w-full max-w-[1256px] min-h-[440px] overflow-hidden rounded-[36px] bg-[#FBF9F7] shadow-lg sm:aspect-[2/1] sm:min-h-[460px] sm:rounded-[48px] lg:aspect-[2.3/1] lg:min-h-[520px] lg:rounded-[56px]">
          {/* Venue photo from DevFest Ilorin 2026, filling the card. It sits
              low so the DevFest banner stays in view. */}
          <Image
            fill
            alt="The DevFest Ilorin 2026 banner outside Ilorin Innovation Hub"
            className="pointer-events-none z-0 object-cover object-[50%_85%] select-none"
            quality={85}
            sizes="(max-width: 1256px) 100vw, 1256px"
            src="/images/venue/iih-2026.webp"
          />

          {/* Date pill bottom left and venue pill bottom right; on phones
              they sit side by side, centred, and wrap if they must. */}
          <div className="absolute inset-x-4 bottom-4 z-10 flex flex-wrap items-center justify-center gap-3 sm:inset-x-7 sm:bottom-7 sm:justify-between lg:inset-x-8 lg:bottom-8">
            {date && (
              <div className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF3B30] via-[#FF4552] to-[#FF5E7E] px-5 py-4 text-xs font-semibold text-white shadow-md sm:px-6 sm:py-[18px] sm:text-sm">
                <Calendar className="h-4 w-4 stroke-[2.2]" />
                <span>{date}</span>
              </div>
            )}
            <h3 className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2B7FFF] via-[#458CFF] to-[#8FA8FE] px-5 py-4 text-xs font-semibold text-white shadow-md ring-2 ring-white/80 sm:px-6 sm:py-[18px] sm:text-sm">
              <MapPin className="h-4 w-4 stroke-[2.2]" />
              <span>
                {venueName.firstLine} {venueName.secondLine}
              </span>
            </h3>
          </div>
        </div>

        {/* Action CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:mt-10 sm:gap-6">
          {workshopTicket && (
            <Link
              className="inline-flex cursor-pointer items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition-opacity hover:opacity-90 sm:px-9 sm:py-4.5 sm:text-base"
              href={workshopTicket.href || '#'}
            >
              <span>{workshopTicket.label}</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
                <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </span>
            </Link>
          )}

          {dinnerTicket && (
            <Link
              className="inline-flex cursor-pointer items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition-opacity hover:opacity-90 sm:px-9 sm:py-4.5 sm:text-base"
              href={dinnerTicket.href || '#'}
            >
              <span>{dinnerTicket.label}</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
                <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export default Venues
