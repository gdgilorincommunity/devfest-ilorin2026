import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { type TrackType } from '@/components/TrackBottomBadge'
import { cn } from '@/lib/utils'

export interface EventTrackItem {
  id: TrackType
  title: string
  image: string
  borderColor: string
}

export interface EventTracksProps {
  title?: string
  tracks?: EventTrackItem[]
  ticketButton?: {
    label: string
    href: string
  }
  className?: string
}

export const DEFAULT_TRACKS: EventTrackItem[] = [
  {
    id: 'workshop',
    title: 'Workshop',
    image: '/images/recap-images/workshop.svg',
    borderColor: 'border-[#00A859]',
  },
  {
    id: 'conference',
    title: 'Conference',
    image: '/images/recap-images/conference.svg',
    borderColor: 'border-[#FF3B30]',
  },
  {
    id: 'dinner',
    title: 'Dinner',
    image: '/images/recap-images/dinner.svg',
    borderColor: 'border-[#2B7FFF]',
  },
]

/**
 * Devfest Ilorin 2026 Event Tracks Section
 *
 * Renders the 3 event format cards (Workshop, Conference, Dinner) using dedicated
 * high-resolution SVG artwork with embedded branding, icons, and titles.
 */
export function EventTracks({
  title = 'Devfest Ilorin 2026',
  tracks = DEFAULT_TRACKS,
  ticketButton = {
    label: 'Get Tickets',
    href: 'https://devfest.gdgilorin.com',
  },
  className,
}: EventTracksProps) {
  return (
    <section
      aria-label={title}
      className={cn(
        'relative w-full overflow-hidden bg-gradient-to-b from-white via-white to-[#EBF3FF] py-16 sm:py-20 lg:py-24',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-[1512px] flex-col items-center px-4 md:px-[64px] lg:px-[128px]">
        {/* Section Heading */}
        <h2 className="mb-10 text-center font-sans text-3xl font-bold tracking-tight text-[#1A1A1A] sm:text-4xl lg:mb-14 lg:text-5xl">
          {title}
        </h2>

        {/* 3 Event Track SVG Cards */}
        <div className="grid w-full grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="relative aspect-[415/659] w-full max-w-[340px] select-none transition-transform duration-200 hover:scale-[1.02] sm:max-w-[360px] lg:max-w-[380px]"
            >
              <Image
                fill
                priority
                alt={`Devfest Ilorin 2026 ${track.title}`}
                className="h-full w-full object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                src={track.image}
              />
            </div>
          ))}
        </div>

        {/* Get Tickets CTA Button */}
        {ticketButton && (
          <div className="mt-12 flex justify-center lg:mt-16">
            <Link
              className="inline-flex cursor-pointer items-center gap-3 rounded-full bg-black px-7 py-4.5 text-base font-semibold text-white transition-opacity hover:opacity-90 sm:gap-3.5 sm:px-8 sm:py-5 sm:text-lg"
              href={ticketButton.href}
            >
              <span>{ticketButton.label}</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black sm:h-7 sm:w-7">
                <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5] sm:h-4 sm:w-4" />
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default EventTracks
