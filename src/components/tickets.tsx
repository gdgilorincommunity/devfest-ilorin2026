import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { DevfestIconBadge } from '@/components/devfest-icon-badge'
import config from '@/config'
import { cn } from '@/lib/utils'

export interface TicketCardItem {
  id: string
  title: string
  tags: string[]
  gradientClass: string
  titleColorClass?: string
  tagBgClass?: string
  buttonText: string
  buttonHref: string
}

export interface TicketsProps {
  title?: string
  tickets?: TicketCardItem[]
  className?: string
}

export const DEFAULT_TICKETS: TicketCardItem[] = [
  {
    id: 'day-1',
    title: 'Day 1',
    tags: ['Free', 'Workshop'],
    gradientClass: 'bg-gradient-to-b from-[#FFC700] via-[#FFD600] to-[#FFE55C]',
    titleColorClass: 'text-[#111111]',
    tagBgClass: 'bg-white text-[#111111]',
    buttonText: 'Get Tickets',
    buttonHref: config.ticketUrl,
  },
  {
    id: 'day-2',
    title: 'Day 2',
    tags: ['Free', 'Conference'],
    gradientClass: 'bg-gradient-to-b from-[#00A859] via-[#00B74A] to-[#46D3B6]',
    titleColorClass: 'text-white',
    tagBgClass: 'bg-white text-[#111111]',
    buttonText: 'Get Tickets',
    buttonHref: config.ticketUrl,
  },
  {
    id: 'dinner',
    title: 'Dinner',
    tags: ['VIP', 'Invite'],
    gradientClass: 'bg-gradient-to-b from-[#FF3B30] via-[#FF2E55] to-[#FA669F]',
    titleColorClass: 'text-white',
    tagBgClass: 'bg-white text-[#111111]',
    buttonText: 'Read More',
    buttonHref: config.dinnerTicketUrl || config.ticketUrl,
  },
]

export function Tickets({
  title = 'Tickets',
  tickets = DEFAULT_TICKETS,
  className,
}: TicketsProps) {
  return (
    <section
      aria-label={title}
      className={cn(
        'relative w-full overflow-hidden border-t-[3px] border-black bg-[#FCF4F4] py-16 sm:py-20 lg:py-24',
        className,
      )}
    >
      <div
        data-reveal
        className="mx-auto flex w-full max-w-340 flex-col px-4 md:px-12"
      >
        {/* =========================
            HEADER ROW
        ========================== */}
        <div className="mb-10 flex min-h-21.5 w-full max-w-330 flex-col items-start justify-between gap-6 opacity-100 sm:flex-row sm:items-center lg:mb-14 lg:h-21.5">
          {/* Title */}
          <h2 className="font-sans text-5xl font-extrabold tracking-tight text-[#111111] sm:text-6xl lg:text-[64px]">
            {title}
          </h2>

          {/* Header Branding & Indicator Pill */}
          <div className="flex max-w-[1250.3px] flex-wrap items-center gap-4.5 min-h-[75.4px] opacity-80 transition-opacity">
            {/* GDG Ilorin Single-Line Branding */}
            <div className="flex items-center gap-4.5">
              <div className="relative flex h-[36.8px] w-[67.4px] shrink-0 items-center justify-center opacity-100">
                <Image
                  alt="Google Developer Groups"
                  className="h-[36.8px] w-[67.9px] object-contain opacity-100"
                  height={37}
                  quality={90}
                  src="/images/recap-images/devfest-icon.png"
                  width={67}
                />
              </div>
              <span className="whitespace-nowrap font-sans text-[10px] font-normal leading-[100%] tracking-[0%] text-[#100F10] opacity-100 sm:text-[14px]">
                Google Developer Groups Ilorin
              </span>
            </div>

            {/* Decorative Pill Track */}
            <div className="inline-flex h-[75.4px] w-[527.9px] max-w-full items-center justify-between gap-4.5 rounded-full border border-black/5 bg-white px-6 shadow-xs">
              <Image
                alt="Star icon"
                className="h-[43.4px] w-[43.4px] shrink-0 object-contain opacity-100"
                height={26}
                src="/images/recap-images/devfest-star-icon.png"
                width={26}
              />
              <Image
                alt="Arrow icon"
                className="h-[32.8px] w-[108.6px] shrink-0 object-contain opacity-50"
                height={33}
                src="/svg/lanyard_elements_4.svg"
                width={109}
              />
              <Image
                alt="World icon"
                className="h-[47.2px] w-[43.4px] shrink-0 object-contain opacity-100"
                height={26}
                src="/images/recap-images/devfest-world-icon.png"
                width={26}
              />
              <Image
                alt="Wave pattern"
                className="h-6 w-[157.2px] shrink-0 object-contain opacity-100"
                height={17}
                src="/images/recap-images/devfest-icon-2.png"
                width={84}
              />
              <Image
                alt="Star icon"
                className="h-[43.4px] w-[43.4px] shrink-0 object-contain"
                height={26}
                src="/images/recap-images/devfest-star-icon.png"
                width={26}
              />
            </div>
          </div>
        </div>

        {/* =========================
            TICKET CARDS GRID
        ========================== */}
        <div className="grid w-full max-w-330 grid-cols-1 gap-7 opacity-100 md:grid-cols-3">
          {tickets.map((ticket) => (
            <article
              key={ticket.id}
              className={cn(
                'relative flex min-h-[327.6px] w-full flex-col justify-between overflow-hidden rounded-[32px] p-6 opacity-100 shadow-xs transition-transform duration-200 hover:scale-[1.01] sm:min-h-[327.6px] sm:rounded-[36px] sm:p-7',
                ticket.gradientClass,
              )}
            >
              {/* Card Top Pill Badge */}
              <div className="self-start">
                <DevfestIconBadge className="scale-95 sm:scale-100" />
              </div>

              {/* Title & Category Tags */}
              <div className="my-auto flex flex-col gap-4 py-6">
                <h3
                  className={cn(
                    'font-sans text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-[56px]',
                    ticket.titleColorClass || 'text-[#111111]',
                  )}
                >
                  {ticket.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3">
                  {ticket.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        'inline-flex items-center rounded-full px-5 py-2 font-sans text-xs font-semibold shadow-xs sm:px-6 sm:py-2.5 sm:text-sm',
                        ticket.tagBgClass || 'bg-white text-[#111111]',
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action CTA Button */}
              <div className="self-start">
                <Link
                  className="inline-flex cursor-pointer items-center gap-3.5 rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:px-7 sm:py-4 sm:text-base"
                  href={ticket.buttonHref || '#'}
                >
                  <span>{ticket.buttonText}</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black">
                    <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Tickets
