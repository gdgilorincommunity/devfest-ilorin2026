import Image from 'next/image'

import { getSpeakerAppearances } from '@/lib/agenda'
import { cn } from '@/lib/utils'

export type BadgeColor = 'yellow' | 'blue' | 'red'

export interface Speaker {
  id: string
  name: string
  role: string
  image: string
  badge: BadgeColor
}

const badgeSrcMap: Record<BadgeColor, string> = {
  yellow: '/svg/badges/badge-yellow.svg',
  blue: '/svg/badges/badge-blue.svg',
  red: '/svg/badges/badge-red.svg',
}

/**
 * Blob outline exported from Figma (`speaker_mask.svg`, 436 viewBox with the
 * artwork inset at 28,28 over 380x380). Normalised to objectBoundingBox units
 * so a single definition clips every portrait regardless of card size.
 */
const BLOB_PATH =
  'M242.789 56.6625C191.924 -0.781111 97.0065 33.7659 94.9653 110.466L94.6268 123.144C94.0048 146.56 83.6948 168.67 66.1572 184.198L56.6625 192.607C-0.781125 243.472 33.7659 338.389 110.466 340.43L123.144 340.769C146.56 341.391 168.67 351.701 184.198 369.239L192.607 378.733C243.472 436.177 338.389 401.63 340.43 324.93L340.769 312.251C341.391 288.836 351.701 266.726 369.239 251.198L378.733 242.789C436.177 191.924 401.63 97.0065 324.93 94.9654L312.251 94.6268C288.836 94.0048 266.726 83.6948 251.198 66.1572L242.789 56.6625Z'

export const SPEAKER_BLOB_CLIP_ID = 'devfest-speaker-blob'

/**
 * Shared SVG clip-path definition backing every `SpeakerCard` in browsers
 * without CSS `shape()`; newer browsers use the animatable copy in globals.css.
 *
 * Render this exactly once per page that shows speaker cards — the cards
 * reference it by id, so the homepage section and the speakers list page each
 * need it, but a page must not render it twice.
 */
export function SpeakerBlobClip() {
  return (
    <svg aria-hidden className="absolute size-0" focusable="false">
      <defs>
        <clipPath clipPathUnits="objectBoundingBox" id={SPEAKER_BLOB_CLIP_ID}>
          {/* (p - 28) / 380 maps the Figma path into 0..1 space */}
          <path
            d={BLOB_PATH}
            transform="scale(0.00263158) translate(-28 -28)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}

/** First letters of the first two words of a name, e.g. "Umar Farouk" → "UF". */
function initialsFrom(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

/**
 * Fallback portrait for speakers whose headshot hasn't arrived: a dotted
 * pattern over a soft brand wash, with the speaker's initials centred. Fills
 * the same blob-clipped square as a real photo.
 */
function SpeakerPlaceholder({ name }: { name: string }) {
  return (
    <div
      aria-hidden
      className="flex size-full items-center justify-center bg-[#EEF1FF]"
      style={{
        backgroundImage: 'radial-gradient(#C2CCEE 1.6px, transparent 1.7px)',
        backgroundSize: '16px 16px',
        backgroundPosition: '-8px -8px',
      }}
    >
      <span className="font-sans text-5xl font-extrabold tracking-tight text-[#8A97C9] lg:text-6xl">
        {initialsFrom(name)}
      </span>
    </div>
  )
}

export interface SpeakerCardProps {
  speaker: Speaker
  className?: string
  priority?: boolean
  /**
   * Passed through to the portrait's `sizes` attribute. Override when the card
   * sits in a grid with different column counts to the homepage section.
   */
  sizes?: string
}

/**
 * A single speaker: blob-clipped portrait, accent badge and name pill, with
 * the speaker's agenda slots revealed over the portrait on hover or focus.
 *
 * Requires `<SpeakerBlobClip />` to be present once on the same page.
 */
export function SpeakerCard({
  speaker,
  className,
  priority = false,
  sizes = '(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 380px',
}: SpeakerCardProps) {
  const appearances = getSpeakerAppearances(speaker.id)

  return (
    <figure
      className={cn(
        // scroll-mt clears the sticky navbar when the agenda deep-links here.
        'flex w-full max-w-95 scroll-mt-28 flex-col items-center',
        className,
      )}
      id={`speaker-${speaker.id}`}
    >
      {/*
        Hover (or focus, which covers keyboard and tap) morphs the blob into a
        rounded square, swings the badge upright and slides the session panel
        up. The motion lives in the `.speaker-tile` rules in globals.css.
      */}
      <div
        className="speaker-tile relative w-full outline-none"
        tabIndex={appearances.length > 0 ? 0 : undefined}
      >
        {/* Accent badge, overlapping the top-left of the portrait */}
        <Image
          aria-hidden
          alt=""
          className="speaker-badge absolute top-[-6%] left-[8%] z-10 w-[28%] max-w-29.25"
          height={117}
          src={badgeSrcMap[speaker.badge]}
          width={117}
        />

        <div className="speaker-portrait relative aspect-square w-full overflow-hidden">
          {speaker.image ? (
            <Image
              fill
              alt={`${speaker.name}, ${speaker.role}`}
              className="object-cover"
              priority={priority}
              quality={90}
              sizes={sizes}
              src={speaker.image}
            />
          ) : (
            <SpeakerPlaceholder name={speaker.name} />
          )}

          {appearances.length > 0 && (
            <div className="speaker-sessions absolute inset-x-0 bottom-0 flex max-h-full flex-col justify-end gap-4 bg-linear-to-t from-[#1E1E1E] from-60% to-[#1E1E1E]/85 px-[9%] pt-[12%] pb-[9%] text-white">
              {appearances.map(({ session, day, track, moderating }) => (
                <div key={session.id} className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold tracking-wider text-white/60 uppercase">
                    {moderating ? 'Moderating · ' : ''}
                    {track.name}
                  </span>
                  <span className="line-clamp-3 text-base leading-snug font-bold">
                    {session.title}
                  </span>
                  <span className="flex flex-wrap gap-x-2 text-xs text-white/80">
                    <span>
                      {day.label} · {day.date}
                    </span>
                    <span aria-hidden>·</span>
                    <span>{session.time ?? session.duration}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <figcaption className="mt-2 w-full max-w-53.75 rounded-full border border-[#1E1E1E] bg-white px-5 py-2.5 text-center">
        <span className="block font-sans text-sm font-bold text-[#1E1E1E]">
          {speaker.name}
        </span>
        <span className="block text-xs text-[#1E1E1E]/70">{speaker.role}</span>
      </figcaption>
    </figure>
  )
}

export default SpeakerCard
