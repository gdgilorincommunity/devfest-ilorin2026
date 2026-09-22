import type { Metadata } from 'next'

import Link from 'next/link'

import Agenda from '@/components/agenda'
import { Button } from '@/components/ui/button'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import RevealObserver from '@/components/reveal-observer'
import SubpageHero from '@/components/subpage-hero'
import config from '@/config'
import { AGENDA } from '@/lib/agenda'

export const metadata: Metadata = {
  title: `Agenda - ${config.appName}`,
  description: `The full two-day ${config.appName} programme: workshops on Friday, November 6 and conference sessions on Saturday, November 7.`,
}

const DAY_JUMP_STYLES = {
  yellow:
    'bg-gradient-to-b from-[#FFC700] via-[#FFD600] to-[#FFE55C] text-[#111111]',
  green:
    'bg-gradient-to-b from-[#00A859] via-[#00B74A] to-[#46D3B6] text-white',
} as const

export default function SchedulePage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <RevealObserver />
      <Navbar />

      <SubpageHero
        description="Two days in Ilorin: hands-on workshops on Friday, then a full conference day of keynotes, talks, lightning sessions and panels on Saturday."
        eyebrow="November 6 – 7, 2026"
        title="Agenda"
      >
        {AGENDA.map((day) => (
          <Link
            key={day.id}
            className={`ease-out-strong inline-flex items-center gap-2 rounded-full px-5 py-3 font-sans text-sm font-bold shadow-xs transition-transform duration-150 hover:not-active:scale-[1.03] active:scale-[0.97] ${DAY_JUMP_STYLES[day.accent]}`}
            href={`#${day.id}`}
          >
            <span>{day.label}</span>
            <span className="opacity-70">·</span>
            <span className="font-medium opacity-80">{day.date}</span>
          </Link>
        ))}
      </SubpageHero>

      <section
        aria-label="Full programme"
        className="w-full bg-[#FDF2F1] py-16 sm:py-20 lg:py-24"
      >
        <Agenda />
      </section>

      <section
        aria-label="Tickets"
        className="w-full border-t-[3px] border-black bg-[#FCF4F4] py-16 sm:py-20"
      >
        <div
          data-reveal
          className="mx-auto flex w-full max-w-378 flex-col items-center gap-6 px-4 text-center md:px-16"
        >
          <h2 className="font-sans text-3xl font-bold tracking-tight text-[#1E1E1E] sm:text-4xl lg:text-[44px]">
            Ready to join us?
          </h2>
          <p className="max-w-130 text-base font-medium text-[#1E1E1E]/60">
            Day 1 and Day 2 are free to attend. Grab your ticket and pick your
            sessions.
          </p>
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
        </div>
      </section>

      <Footer />
    </main>
  )
}
