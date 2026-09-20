import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { type TrackType } from '@/components/track-bottom-badge'
import { cn } from '@/lib/utils'

export interface EventTrackItem {
  id: TrackType
  title: string
  image: string
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
  },
  {
    id: 'conference',
    title: 'Conference',
    image: '/images/recap-images/conference.svg',
  },
  {
    id: 'dinner',
    title: 'Dinner',
    image: '/images/recap-images/dinner.svg',
  },
]

/**
 * Devfest Ilorin 2026 Event Tracks Section
 *
 * Renders the 3 event format cards (Workshop, Conference, Dinner) from the
 * Figma card artwork, which already carries the gradient ring, the brand icon
 * pill and the track title.
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
        'relative w-full overflow-hidden py-16 sm:py-20 lg:py-24',
        // Blue wash from the Figma frame: white to ~55%, ramping to #BFD0FF,
        // with a soft highlight lifting the bottom centre.
        'bg-[radial-gradient(50%_30%_at_50%_100%,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0)_75%),linear-gradient(to_bottom,#FFFFFF_0%,#FFFFFF_55%,#BFD0FF_100%)]',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-378 flex-col items-center px-4 md:px-16 lg:px-24">
        {/* Section Heading */}
        <h2 className="mb-10 text-center font-sans text-3xl font-bold tracking-tight text-[#1A1A1A] sm:text-4xl lg:mb-14 lg:text-[60px]">
          {title}
        </h2>

        {/* 3 Event Track SVG Cards */}
        <div className="grid w-full grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-10">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="relative aspect-415/659 w-full max-w-85 select-none transition-transform duration-200 hover:scale-[1.02] sm:max-w-90 lg:max-w-[411px]"
            >
              <Image
                fill
                priority
                alt={`Devfest Ilorin 2026 ${track.title}`}
                className="h-full w-full object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 411px"
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
