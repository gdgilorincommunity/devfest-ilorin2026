import type { Metadata } from 'next'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import RevealObserver from '@/components/reveal-observer'
import { SpeakerBlobClip, SpeakerCard } from '@/components/speaker-card'
import SubpageHero from '@/components/subpage-hero'
import config from '@/config'
import { SPEAKERS } from '@/lib/speakers'

export const metadata: Metadata = {
  title: `Speakers - ${config.appName}`,
  description: `Meet the ${SPEAKERS.length} speakers bringing workshops, talks and panels to ${config.appName} on November 6th and 7th.`,
}

export default function SpeakersPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <RevealObserver />
      <Navbar />

      <SubpageHero
        description="Engineers, founders and Google Developer Experts leading two days of workshops, talks and panels."
        eyebrow={`${SPEAKERS.length} speakers · November 6 – 7`}
        title="Our speakers"
      >
        <Link
          className="ease-out-strong inline-flex cursor-pointer items-center gap-3 rounded-full bg-black px-7 py-4 text-base font-bold text-white transition-transform duration-150 hover:not-active:scale-[1.03] active:scale-[0.97]"
          href="/schedule"
        >
          <span>See the agenda</span>
          <span className="flex size-7 items-center justify-center rounded-full bg-white text-black">
            <ArrowUpRight className="size-4 stroke-[2.5]" />
          </span>
        </Link>
      </SubpageHero>

      <section
        aria-label="All speakers"
        className="relative w-full overflow-hidden bg-[#FDF2F1] py-16 sm:py-20 lg:py-24"
      >
        <SpeakerBlobClip />

        <div className="mx-auto w-full max-w-378 px-4 md:px-16 lg:px-32">
          <ul className="grid w-full grid-cols-1 justify-items-center gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
            {SPEAKERS.map((speaker, index) => (
              <li
                key={speaker.id}
                data-reveal
                className="flex w-full justify-center"
                style={
                  {
                    // Stagger within each row of three, then reset, so late
                    // rows don't accumulate a long delay.
                    '--reveal-delay': `${(index % 3) * 70}ms`,
                  } as React.CSSProperties
                }
              >
                <SpeakerCard priority={index < 3} speaker={speaker} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  )
}
