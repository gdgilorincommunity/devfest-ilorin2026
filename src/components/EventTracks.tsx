import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { DevfestIconBadge } from '@/components/DevfestIconBadge'
import { TrackBottomBadge, type TrackType } from '@/components/TrackBottomBadge'
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
    image: '/images/recap-images/workshop-image.png',
    borderColor: 'border-[#00A859]',
  },
  {
    id: 'conference',
    title: 'Conference',
    image: '/images/recap-images/conference-image.png',
    borderColor: 'border-[#FF3B30]',
  },
  {
    id: 'dinner',
    title: 'Dinner',
    image: '/images/recap-images/dinner-image.png',
    borderColor: 'border-[#2B7FFF]',
  },
]

/**
 * Devfest Ilorin 2026 Event Tracks Section
 *
 * Renders the 3 event format cards (Workshop, Conference, Dinner) as live composite
 * containers with raw high-resolution background photos, top DevFest icon badges,
 * and bottom gradient title pills.
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

        {/* 3 Composite Event Track Cards */}
        <div className="grid w-full grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
          {tracks.map((track) => (
            <div
              key={track.id}
              className={cn(
                'relative aspect-[320/470] w-full max-w-[335px] overflow-hidden rounded-[88px] border-[3px] shadow-sm sm:max-w-[360px] sm:rounded-[100px] lg:max-w-[380px] lg:rounded-[110px]',
                track.borderColor,
              )}
            >
              {/* Raw High-Res Background Image */}
              <Image
                fill
                priority
                alt={`Devfest Ilorin 2026 ${track.title}`}
                className="object-cover"
                quality={90}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                src={track.image}
              />

              {/* Top Devfest Brand Icons Container */}
              <div className="absolute top-5 left-1/2 z-10 -translate-x-1/2 sm:top-6 lg:top-7">
                <DevfestIconBadge />
              </div>

              {/* Bottom Track Title Gradient Container */}
              <div className="absolute bottom-6 left-1/2 z-10 w-[72%] max-w-[250px] -translate-x-1/2 sm:bottom-7 sm:w-[74%] sm:max-w-[260px] lg:bottom-8">
                <TrackBottomBadge label={track.title} track={track.id} />
              </div>
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
