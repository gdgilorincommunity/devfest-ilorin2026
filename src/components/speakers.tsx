import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import {
  SpeakerBlobClip,
  SpeakerCard,
  type Speaker,
} from '@/components/speaker-card'
import { SPEAKERS } from '@/lib/speakers'
import { cn } from '@/lib/utils'

export interface SpeakersProps {
  title?: string
  speakers?: Speaker[]
  ctaButton?: {
    label: string
    href: string
  }
  className?: string
}

export function Speakers({
  title = 'Our speakers',
  speakers = SPEAKERS,
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
      <SpeakerBlobClip />

      <div
        data-reveal
        className="mx-auto flex w-full max-w-378 flex-col items-center px-4 md:px-16 lg:px-32"
      >
        <h2 className="mb-12 text-center font-sans text-4xl font-bold tracking-tight text-[#1A1A1A] sm:text-5xl lg:mb-16 lg:text-[56px]">
          {title}
        </h2>

        <div className="grid w-full grid-cols-1 justify-items-center gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {speakers.map((speaker) => (
            <SpeakerCard key={speaker.id} speaker={speaker} />
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
