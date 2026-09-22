import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { HeroImages } from '@/components/hero-images'
import config from '@/config'
import { SPONSOR_MAILTO } from '@/lib/sponsor'
import { cn } from '@/lib/utils'

export default function Hero() {
  return (
    <section
      className={cn(
        'flex w-full flex-1 flex-col items-center',
        // Reddish wash from the Figma hero, over its #FCF4F4 base. A single
        // radial — the Figma gradient transform converted to percentages —
        // replaces the old linear ramp, whose hard final stop banded into a
        // visible edge. It sits on the SECTION rather than the max-width
        // content box so it bleeds to the viewport edges; capping it at
        // max-w-378 left the flat page colour showing in strips either side
        // on wide screens.
        'bg-[#FCF4F4]',
        'bg-[radial-gradient(85.98%_85.98%_at_50%_17.07%,#FCF4F4_52%,#FFF7FA_76%,#FFC4C2_100%)]',
      )}
    >
      <div className="relative flex min-h-0 w-full max-w-378 flex-1 flex-col items-center justify-center gap-8 overflow-hidden px-4 lg:px-0">
        <div className="pointer-events-none z-10 mt-12 flex w-full flex-col items-center justify-center gap-6 lg:absolute lg:inset-0 lg:mt-0 lg:gap-8">
          {/* Headline sponsor lockup */}
          <div
            className="hero-enter pointer-events-auto flex flex-col items-center gap-2"
            style={{ '--enter-delay': '80ms' } as React.CSSProperties}
          >
            <span className="text-sm font-bold text-[#1E1E1E]/70 lg:text-base">
              headline Sponsor
            </span>
            <a
              aria-label="Qorelly — headline sponsor"
              href="https://qorelly.com"
              rel="noopener noreferrer sponsored"
              target="_blank"
            >
              <Image
                priority
                alt="Qorelly"
                className="h-7.5 w-auto transition-transform duration-300 hover:scale-105 lg:h-9.25"
                height={37}
                src="/svg/sponsors/qorelly-blue.svg"
                width={150}
              />
            </a>
          </div>

          <div
            className="hero-enter pointer-events-auto flex w-full max-w-254.5 items-center justify-center"
            style={{ '--enter-delay': '160ms' } as React.CSSProperties}
          >
            <h1 className="w-full text-center font-sans text-5xl leading-[110%] font-bold text-[#1E1E1E] sm:text-6xl lg:w-252.5 lg:text-[80px] lg:leading-[100%]">
              Devfest Ilorin
              <span className="block">2026</span>
            </h1>
          </div>

          <p
            className="hero-enter pointer-events-auto max-w-130 text-center text-base font-medium text-[#1E1E1E]/60 lg:text-lg"
            style={{ '--enter-delay': '240ms' } as React.CSSProperties}
          >
            Join us at DevFest Ilorin 2026 on November 6th &ndash; 7th.
            Ilorin&apos;s largest tech celebration of the year!
          </p>

          <div
            className="hero-enter pointer-events-auto flex items-center justify-center gap-4 sm:gap-6"
            style={{ '--enter-delay': '320ms' } as React.CSSProperties}
          >
            <Button
              showArrow
              render={
                <a
                  href={config.ticketUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                />
              }
              size="pill"
              variant="gradient"
            >
              Get Tickets
            </Button>

            <Button
              showArrow
              render={<a href={SPONSOR_MAILTO} />}
              size="pill"
              variant="black"
            >
              Sponsor Us
            </Button>
          </div>
        </div>

        <HeroImages />
      </div>
    </section>
  )
}
