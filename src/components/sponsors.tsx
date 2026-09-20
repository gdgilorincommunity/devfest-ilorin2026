import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

import { Marquee } from '@/components/ui/marquee'
import { SPONSOR_MAILTO } from '@/lib/sponsor'
import { cn } from '@/lib/utils'

export interface LogoItem {
  id: string
  name: string
  src: string
  href?: string
  /** Rendered height in px at the desktop breakpoint. */
  height: number
  width: number
}

export interface SponsorsProps {
  sponsors?: LogoItem[]
  partners?: LogoItem[]
  ctaButton?: {
    label: string
    href: string
  }
  className?: string
}

export const DEFAULT_SPONSORS: LogoItem[] = [
  {
    id: 'qorelly',
    name: 'Qorelly',
    src: '/svg/sponsors/qorelly.svg',
    href: 'https://qorelly.com',
    width: 244,
    height: 60,
  },
  {
    id: 'pixel-pioneer',
    name: 'Pixel Pioneer',
    src: '/svg/sponsors/pixel-pioneer.svg',
    width: 242,
    height: 60,
  },
]

export const DEFAULT_PARTNERS: LogoItem[] = [
  {
    id: 'qorelly',
    name: 'Qorelly',
    src: '/svg/sponsors/qorelly.svg',
    href: 'https://qorelly.com',
    width: 244,
    height: 60,
  },
  {
    id: 'pixel-pioneer',
    name: 'Pixel Pioneer',
    src: '/svg/sponsors/pixel-pioneer.svg',
    width: 242,
    height: 60,
  },
]

function LogoBoard({
  direction,
  logos,
  title,
}: {
  direction: 'left' | 'right'
  logos: LogoItem[]
  title: string
}) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-[20px] py-10 sm:py-12',
        // Radial wash from the Figma frame: white core fading to lavender.
        'bg-[radial-gradient(75%_150%_at_50%_0%,#FFFFFF_52%,#DAE5FF_76%,#E3E3FF_100%)]',
      )}
    >
      <h2 className="mb-8 text-center font-sans text-3xl font-bold tracking-tight text-[#1A1A1A] sm:text-4xl lg:text-[44px]">
        {title}
      </h2>

      <Marquee
        maskEdges
        direction={direction}
        gapClass="gap-12 sm:gap-16 lg:gap-20"
        speed="fast"
        trackPaddingClass="py-2"
      >
        {logos.map((logo) => {
          const image = (
            <Image
              alt={logo.name}
              className="h-9 w-auto object-contain sm:h-10 lg:h-15"
              height={logo.height}
              src={logo.src}
              width={logo.width}
            />
          )

          return (
            <li key={logo.id} className="flex shrink-0 items-center">
              {logo.href ? (
                <a
                  href={logo.href}
                  rel="noopener noreferrer sponsored"
                  target="_blank"
                >
                  {image}
                </a>
              ) : (
                image
              )}
            </li>
          )
        })}
      </Marquee>
    </div>
  )
}

/**
 * Stacked "Sponsors" and "Partners" logo boards with a sponsorship CTA,
 * matching the Figma frame's lavender radial cards.
 */
export function Sponsors({
  sponsors = DEFAULT_SPONSORS,
  partners = DEFAULT_PARTNERS,
  ctaButton = { label: 'Sponsor us', href: SPONSOR_MAILTO },
  className,
}: SponsorsProps) {
  return (
    <section
      aria-label="Sponsors and partners"
      className={cn('w-full bg-[#F0F0F0] py-16 sm:py-20 lg:py-24', className)}
      id="sponsors"
    >
      <div className="mx-auto flex w-full max-w-378 flex-col items-center gap-6 px-4 md:px-16 lg:gap-8 lg:px-24">
        <LogoBoard direction="left" logos={sponsors} title="Sponsors" />
        <LogoBoard direction="right" logos={partners} title="Partners" />

        {ctaButton && (
          <div className="mt-4 flex justify-center">
            <a
              className="inline-flex cursor-pointer items-center gap-3 rounded-full bg-black px-7 py-4 text-base font-bold text-white transition-transform duration-300 hover:scale-105"
              href={ctaButton.href}
            >
              <span>{ctaButton.label}</span>
              <span className="flex size-7 items-center justify-center rounded-full bg-white text-black">
                <ArrowUpRight className="size-4 stroke-[2.5]" />
              </span>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

export default Sponsors
