import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { HeroImages } from '@/components/hero-images'
import config from '@/config'
import { SPONSOR_MAILTO } from '@/lib/sponsor'

export default function Hero() {
  return (
    <section className="relative flex min-h-0 w-full max-w-[1512px] flex-1 flex-col items-center justify-center gap-8 overflow-hidden px-4 lg:px-0">
      <div className="pointer-events-none z-10 mt-12 flex w-full flex-col items-center justify-center gap-6 lg:absolute lg:inset-0 lg:mt-0 lg:gap-8">
        {/* Headline sponsor lockup */}
        <div className="pointer-events-auto flex flex-col items-center gap-2">
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
              className="h-[30px] w-auto transition-transform duration-300 hover:scale-105 lg:h-[37px]"
              height={37}
              src="/svg/sponsors/qorelly-blue.svg"
              width={150}
            />
          </a>
        </div>

        <div className="pointer-events-auto flex w-full max-w-[1018px] items-center justify-center">
          <h1 className="w-full text-center font-sans text-5xl leading-[110%] font-bold text-[#1E1E1E] sm:text-6xl lg:w-[1010px] lg:text-[80px] lg:leading-[100%]">
            Devfest Ilorin
            <span className="block">2026</span>
          </h1>
        </div>

        <p className="pointer-events-auto max-w-[520px] text-center text-base font-medium text-[#1E1E1E]/60 lg:text-lg">
          Join us at DevFest Ilorin 2026 on November 6th &ndash; 7th.
          Ilorin&apos;s largest tech celebration of the year!
        </p>

        <div className="pointer-events-auto flex items-center justify-center gap-4 sm:gap-6">
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
    </section>
  )
}
