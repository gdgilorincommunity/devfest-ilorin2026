import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import TrackBottomBadge, {
  type TrackType,
} from '@/components/track-bottom-badge'
import TrackTopPill from '@/components/track-top-pill'
import { cn } from '@/lib/utils'

export interface EventTrackItem {
  id: TrackType
  title: string
  image: string
  /** Ring colour around the card, straight from the Figma frame. */
  borderClass: string
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
    image: '/images/tracks/workshop.jpg',
    borderClass: 'border-[#00AF57]',
  },
  {
    id: 'conference',
    title: 'Conference',
    image: '/images/tracks/conference.jpg',
    borderClass: 'border-[#FC413D]',
  },
  {
    id: 'dinner',
    title: 'Dinner',
    image: '/images/tracks/dinner.jpg',
    borderClass: 'border-[#3186FF]',
  },
]

/**
 * Devfest Ilorin 2026 Event Tracks Section
 *
 * Renders the 3 event format cards (Workshop, Conference, Dinner) as real
 * elements rather than flattened artwork: the photo is a plain image clipped
 * by the card's rounded frame, with the glyph pill and the gradient title
 * badge composed on top. Each piece loads on its own and the text stays
 * selectable and translatable.
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
        // Blue wash from the Figma frame, over its #FCF4F4 base. The radial
        // geometry (112.8% x 126.88% at 50% 17.07%) is the Figma gradient
        // transform converted to percentages of the frame.
        'bg-[#FCF4F4]',
        'bg-[radial-gradient(112.8%_126.88%_at_50%_17.07%,#FFFFFF_52%,#BCCFFF_76%,#A9A8FF_100%)]',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-378 flex-col items-center px-4 md:px-16 lg:px-24">
        {/* Section Heading */}
        <h2
          data-reveal
          className="mb-10 text-center font-sans text-3xl font-bold tracking-tight text-[#1E1E1E] sm:text-4xl lg:mb-14 lg:text-[58px]"
        >
          {title}
        </h2>

        {/* 3 Event Track Cards */}
        <div className="grid w-full grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-9.5">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              data-reveal
              className={cn(
                'relative flex aspect-415/659 w-full max-w-85 flex-col items-center justify-between overflow-hidden rounded-[90px] border-4 p-6 transition-transform duration-200 ease-out-strong hover:not-active:scale-[1.02] active:scale-[0.99] sm:max-w-90 sm:rounded-[110px] sm:p-8 lg:max-w-102.75 lg:rounded-[140px] lg:p-10',
                track.borderClass,
              )}
              style={
                { '--reveal-delay': `${index * 70}ms` } as React.CSSProperties
              }
            >
              {/* Photo, clipped by the card frame */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[#F8D8D8]"
              >
                <Image
                  fill
                  alt=""
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 411px"
                  src={track.image}
                />
              </div>

              <TrackTopPill className="relative" priority={index === 0} />

              <TrackBottomBadge
                className="relative"
                label={track.title}
                track={track.id}
              />
            </div>
          ))}
        </div>

        {/* Get Tickets CTA Button */}
        {ticketButton && (
          <div data-reveal className="mt-12 flex justify-center lg:mt-16">
            <Link
              className="inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-black px-6.75 py-5 text-base font-bold text-white transition-opacity hover:opacity-90"
              href={ticketButton.href}
            >
              <span>{ticketButton.label}</span>
              <span className="flex h-6.5 w-8 items-center justify-center rounded-full bg-white text-black">
                <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default EventTracks
