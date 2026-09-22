import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Calendar } from 'lucide-react'

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
 * Showcases the event venue (Ilorin Innovation Hub) with crisp SVG vector artwork,
 * date pill badge, and action CTA buttons for workshop and dinner tickets.
 */
export function Venues({
  title = 'Venues',
  venueName = {
    firstLine: 'Innovation',
    secondLine: 'hub Ilorin',
  },
  date = '30th - 31st Oct 2025',
  workshopTicket = {
    label: 'Get Workshop Ticket',
    href: config.ticketUrl,
  },
  dinnerTicket = {
    label: 'Get your dinner',
    href: config.dinnerTicketUrl,
  },
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
          {/* Title Header */}
          <div className="relative z-10 flex flex-col items-center px-4 pt-7 text-center sm:pt-12 lg:pt-14">
            <h3 className="flex flex-col font-sans text-5xl font-black leading-[0.92] tracking-tight sm:text-6xl md:text-7xl lg:text-[88px] xl:text-[94px]">
              <span className="bg-gradient-to-b from-[#2B7FFF] to-[#458CFF] bg-clip-text text-transparent">
                {venueName.firstLine}
              </span>
              <span className="bg-gradient-to-b from-[#458CFF] to-[#8FA8FE] bg-clip-text text-transparent">
                {venueName.secondLine}
              </span>
            </h3>

            {/* Mobile Date Badge (Centered in the middle between text and vector image) */}
            {date && (
              <div className="my-6 flex justify-center sm:hidden">
                <div className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF3B30] via-[#FF4552] to-[#FF5E7E] px-5 py-4 text-xs font-semibold text-white shadow-md">
                  <Calendar className="h-4 w-4 stroke-[2.2]" />
                  <span>{date}</span>
                </div>
              </div>
            )}
          </div>

          {/* IIH Vector Artwork (Takes >= 40% of white container on mobile) */}
          <div className="pointer-events-none absolute right-0 bottom-0 z-0 flex h-[44%] min-h-[195px] w-[155%] max-w-none justify-end select-none sm:h-[48%] sm:w-[110%] md:h-auto md:w-[90%] lg:w-[82%]">
            <Image
              priority
              alt="Ilorin Innovation Hub Architecture"
              className="h-full w-auto object-contain object-bottom-right sm:h-[250px] sm:w-full md:h-auto"
              height={303}
              quality={90}
              src="/images/IIH-vector.svg"
              width={1007}
            />
          </div>

          {/* Desktop Date Badge (Bottom-left corner with +2px vertical padding) */}
          {date && (
            <div className="absolute bottom-7 left-7 z-10 hidden sm:block lg:bottom-8 lg:left-8">
              <div className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF3B30] via-[#FF4552] to-[#FF5E7E] px-6 py-[18px] text-xs font-semibold text-white shadow-md sm:text-sm">
                <Calendar className="h-4 w-4 stroke-[2.2]" />
                <span>{date}</span>
              </div>
            </div>
          )}
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
