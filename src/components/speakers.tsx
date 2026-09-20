import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Blob outline exported from Figma (`speaker_mask.svg`, 436 viewBox with the
 * artwork inset at 28,28 over 380x380). Normalised to objectBoundingBox units
 * so a single definition clips every speaker photo regardless of card size.
 */
const BLOB_PATH =
  'M242.789 56.6625C191.924 -0.781111 97.0065 33.7659 94.9653 110.466L94.6268 123.144C94.0048 146.56 83.6948 168.67 66.1572 184.198L56.6625 192.607C-0.781125 243.472 33.7659 338.389 110.466 340.43L123.144 340.769C146.56 341.391 168.67 351.701 184.198 369.239L192.607 378.733C243.472 436.177 338.389 401.63 340.43 324.93L340.769 312.251C341.391 288.836 351.701 266.726 369.239 251.198L378.733 242.789C436.177 191.924 401.63 97.0065 324.93 94.9654L312.251 94.6268C288.836 94.0048 266.726 83.6948 251.198 66.1572L242.789 56.6625Z'

const BLOB_CLIP_ID = 'devfest-speaker-blob'

type BadgeColor = 'yellow' | 'blue' | 'red'

const badgeSrcMap: Record<BadgeColor, string> = {
  yellow: '/svg/badges/badge-yellow.svg',
  blue: '/svg/badges/badge-blue.svg',
  red: '/svg/badges/badge-red.svg',
}

export interface Speaker {
  id: string
  name: string
  role: string
  image: string
  badge: BadgeColor
}

export interface SpeakersProps {
  title?: string
  speakers?: Speaker[]
  ctaButton?: {
    label: string
    href: string
  }
  className?: string
}

export const DEFAULT_SPEAKERS: Speaker[] = [
  {
    id: 'speaker-1',
    name: 'Sodiq Akinjobi',
    role: 'Community Lead, Google',
    image: '/images/speakers/placeholder.jpg',
    badge: 'yellow',
  },
  {
    id: 'speaker-2',
    name: 'Sodiq Akinjobi',
    role: 'Community Lead, Google',
    image: '/images/speakers/placeholder.jpg',
    badge: 'blue',
  },
  {
    id: 'speaker-3',
    name: 'Sodiq Akinjobi',
    role: 'Community Lead, Google',
    image: '/images/speakers/placeholder.jpg',
    badge: 'red',
  },
]

/**
 * Shared SVG clip-path definition. Rendered once, off-screen, and referenced
 * by every speaker photo through `clip-path: url(#devfest-speaker-blob)`.
 */
function BlobClipDefinition() {
  return (
    <svg aria-hidden className="absolute size-0" focusable="false">
      <defs>
        <clipPath clipPathUnits="objectBoundingBox" id={BLOB_CLIP_ID}>
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

export function Speakers({
  title = 'Our speakers',
  speakers = DEFAULT_SPEAKERS,
  ctaButton = { label: 'View all speakers', href: '#speakers' },
  className,
}: SpeakersProps) {
  return (
    <section
      aria-label={title}
      className={cn(
        'relative w-full overflow-hidden bg-[#FDF2F1] py-16 sm:py-20 lg:py-24',
        className,
      )}
      id="speakers"
    >
      <BlobClipDefinition />

      <div className="mx-auto flex w-full max-w-[1512px] flex-col items-center px-4 md:px-[64px] lg:px-[128px]">
        <h2 className="mb-12 text-center font-sans text-4xl font-bold tracking-tight text-[#1A1A1A] sm:text-5xl lg:mb-16 lg:text-[56px]">
          {title}
        </h2>

        <div className="grid w-full grid-cols-1 justify-items-center gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {speakers.map((speaker) => (
            <figure
              key={speaker.id}
              className="flex w-full max-w-[380px] flex-col items-center"
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
                  style={{ clipPath: `url(#${BLOB_CLIP_ID})` }}
                >
                  <Image
                    fill
                    alt={`${speaker.name}, ${speaker.role}`}
                    className="object-cover"
                    quality={90}
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 380px"
                    src={speaker.image}
                  />
                </div>
              </div>

              <figcaption className="mt-2 w-full max-w-[215px] rounded-full border border-[#1E1E1E] bg-white px-5 py-2.5 text-center">
                <span className="block font-sans text-sm font-bold text-[#1E1E1E]">
                  {speaker.name}
                </span>
                <span className="block text-xs text-[#1E1E1E]/70">
                  {speaker.role}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        {ctaButton && (
          <div className="mt-12 flex justify-center lg:mt-14">
            <Link
              className="inline-flex cursor-pointer items-center gap-3 rounded-full bg-black px-7 py-4 text-base font-bold text-white transition-transform duration-300 hover:scale-105"
              href={ctaButton.href}
            >
              <span>{ctaButton.label}</span>
              <span className="flex size-7 items-center justify-center rounded-full bg-white text-black">
                <ArrowUpRight className="size-4 stroke-[2.5]" />
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default Speakers
