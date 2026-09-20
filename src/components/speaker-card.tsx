import Image from 'next/image'

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
 * Shared SVG clip-path definition backing every `SpeakerCard`.
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
 * A single speaker: blob-clipped portrait, accent badge and name pill.
 *
 * Requires `<SpeakerBlobClip />` to be present once on the same page.
 */
export function SpeakerCard({
  speaker,
  className,
  priority = false,
  sizes = '(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 380px',
}: SpeakerCardProps) {
  return (
    <figure
      className={cn(
        'flex w-full max-w-[380px] flex-col items-center',
        className,
      )}
    >
      <div className="relative w-full">
        {/* Accent badge, overlapping the top-left of the portrait */}
        <Image
          aria-hidden
          alt=""
          className="absolute -top-[6%] left-[8%] z-10 w-[28%] max-w-[117px]"
          height={117}
          src={badgeSrcMap[speaker.badge]}
          width={117}
        />

        <div
          className="relative aspect-square w-full"
          style={{ clipPath: `url(#${SPEAKER_BLOB_CLIP_ID})` }}
        >
          <Image
            fill
            alt={`${speaker.name}, ${speaker.role}`}
            className="object-cover"
            priority={priority}
            quality={90}
            sizes={sizes}
            src={speaker.image}
          />
        </div>
      </div>

      <figcaption className="mt-2 w-full max-w-[215px] rounded-full border border-[#1E1E1E] bg-white px-5 py-2.5 text-center">
        <span className="block font-sans text-sm font-bold text-[#1E1E1E]">
          {speaker.name}
        </span>
        <span className="block text-xs text-[#1E1E1E]/70">{speaker.role}</span>
      </figcaption>
    </figure>
  )
}

export default SpeakerCard
