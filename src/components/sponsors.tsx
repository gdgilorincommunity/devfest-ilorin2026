import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

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
  headline?: LogoItem[]
  diamond?: LogoItem[]
  sponsors?: LogoItem[]
  partners?: LogoItem[]
  ctaButton?: {
    label: string
    href: string
  }
  className?: string
}

export const DEFAULT_HEADLINE: LogoItem[] = [
  {
    id: 'blaaiz',
    name: 'Blaaiz',
    src: '/svg/sponsors/blaaiz.svg',
    href: 'https://blaaiz.com',
    // Intrinsic artwork is 336x73; kept at the row's 60px height.
    width: 276,
    height: 60,
  },
]

export const DEFAULT_DIAMOND: LogoItem[] = [
  {
    id: 'qorelly',
    name: 'Qorelly',
    src: '/svg/sponsors/qorelly.svg',
    href: 'https://qorelly.com',
    width: 244,
    height: 60,
  },
]

export const DEFAULT_SPONSORS: LogoItem[] = [
  {
    id: 'malhub',
    name: 'MalHub',
    src: '/svg/sponsors/malhub.svg',
    href: 'https://malhub.org',
    // Intrinsic artwork is 2171x857; kept at the row's 60px height.
    width: 152,
    height: 60,
  },
  {
    id: 'verafy',
    name: 'Verafy',
    src: '/svg/sponsors/verafy.svg',
    href: 'https://verafy.me',
    // Intrinsic artwork is 776x319; kept at the row's 60px height.
    width: 146,
    height: 60,
  },
  {
    id: 'ilorin-innovation-hub',
    name: 'Ilorin Innovation Hub',
    src: '/svg/sponsors/ihs.webp',
    href: 'https://iih.ng',
    // Intrinsic artwork is 700x257; kept at the row's 60px height.
    width: 163,
    height: 60,
  },
  {
    id: 'sqaleup',
    name: 'SqaleUp',
    src: '/svg/sponsors/sqaleup.svg',
    href: 'https://sqaleupinc.com',
    // Intrinsic artwork is 1049x336; kept at the row's 60px height.
    width: 187,
    height: 60,
  },
  {
    id: 'celerlinks',
    name: 'Celerlinks',
    src: '/svg/sponsors/celerlinks.webp',
    href: 'https://celerlinks.com',
    // Intrinsic artwork is 1722x320; kept at the row's 60px height.
    width: 323,
    height: 60,
  },
]

export const DEFAULT_PARTNERS: LogoItem[] = [
  {
    id: 'fuskar',
    name: 'Fuskar',
    // Intrinsic artwork is 351x141; kept at the row's 60px height.
    src: '/svg/partners/fuskar.svg',
    width: 149,
    height: 60,
  },
  {
    id: 'exploit-forge',
    name: 'Exploit-Forge',
    src: '/svg/partners/exploitforge.webp',
    // Trimmed artwork is 1271x255; kept at the row's 60px height.
    width: 299,
    height: 60,
  },
  {
    id: 'pixel-pioneer',
    name: 'Pixel Pioneer',
    src: '/svg/sponsors/pixel-pioneer.svg',
    width: 242,
    height: 60,
  },
  {
    id: 'startuplist-africa',
    name: 'StartupList Africa',
    src: '/svg/partners/startuplist-africa.svg',
    // Intrinsic artwork is 134x47; kept at the row's 60px height.
    width: 171,
    height: 60,
  },
  {
    id: 'unovia',
    name: 'Unovia',
    src: '/svg/partners/unovialogo.svg',
    // Intrinsic artwork is 829x278; kept at the row's 60px height.
    width: 179,
    height: 60,
  },
  {
    id: 'campusx',
    name: 'CampusX',
    src: '/svg/partners/campusx.webp',
    // Trimmed artwork is 1925x422; kept at the row's 60px height.
    width: 274,
    height: 60,
  },
]

function LogoBoard({
  logos,
  title,
  logoClassName = 'h-10 sm:h-12 lg:h-14',
}: {
  logos: LogoItem[]
  title: string
  logoClassName?: string
}) {
  const isGrid = logos.length > 2

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

      {/*
        Several logos wrap onto centred rows rather than scrolling sideways:
        three to a row on phones, each scaled to its cell, and as many as fit
        at their full height from sm: up.
      */}
      <ul
        className={cn(
          'items-center px-6',
          isGrid
            ? 'flex flex-wrap justify-center gap-x-4 gap-y-6 sm:gap-x-8 sm:gap-y-8 lg:gap-x-10'
            : 'flex flex-nowrap justify-center-safe gap-6 overflow-x-auto sm:gap-8 lg:gap-10',
        )}
      >
        {logos.map((logo) => {
          const image = (
            <Image
              alt={logo.name}
              className={cn(
                'object-contain',
                isGrid
                  ? 'h-auto max-h-10 w-full sm:h-12 sm:max-h-none sm:w-auto lg:h-14'
                  : cn('w-auto', logoClassName),
              )}
              height={logo.height}
              src={logo.src}
              width={logo.width}
            />
          )

          return (
            <li
              key={logo.id}
              className={cn(
                'flex items-center justify-center',
                isGrid
                  ? 'w-[calc((100%-2rem)/3)] sm:w-auto sm:shrink-0'
                  : 'shrink-0',
              )}
            >
              {logo.href ? (
                <a
                  className="flex w-full justify-center"
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
      </ul>
    </div>
  )
}

/**
 * Stacked "Sponsors" and "Partners" logo boards with a sponsorship CTA,
 * matching the Figma frame's lavender radial cards.
 */
export function Sponsors({
  headline = DEFAULT_HEADLINE,
  diamond = DEFAULT_DIAMOND,
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
      <div
        data-reveal
        className="mx-auto flex w-full max-w-378 flex-col items-center gap-6 px-4 md:px-16 lg:gap-8 lg:px-24"
      >
        {/* The headline sponsor sits a step above every other tier. */}
        <LogoBoard
          logoClassName="h-12 sm:h-16 lg:h-20"
          logos={headline}
          title="Headline"
        />
        <LogoBoard logos={diamond} title="Diamond" />
        <LogoBoard logos={sponsors} title="Sponsors" />
        <LogoBoard logos={partners} title="Partners" />

        {ctaButton && (
          <div className="mt-4 flex justify-center">
            <a
              className="ease-out-strong inline-flex cursor-pointer items-center gap-3 rounded-full bg-black px-7 py-4 text-base font-bold text-white transition-transform duration-150 hover:not-active:scale-[1.03] active:scale-[0.97]"
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
