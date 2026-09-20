import { CheckCircle2, CircleDot, Clock } from 'lucide-react'

import { cn } from '@/lib/utils'

type Status = 'completed' | 'ongoing' | 'coming-up'

type StatusColumn = {
  status: Status
  label: string
  accent: string
  icon: typeof CheckCircle2
  items: string[]
}

const statusColumns: StatusColumn[] = [
  {
    status: 'completed',
    label: 'Completed',
    accent: '#34A853',
    icon: CheckCircle2,
    items: [
      'Call for Speakers opened and closed',
      "Speaker applications reviewed — 43 speakers applied, and we can't accept them all",
      'Day 1 workshop track structure locked (two parallel rooms, with a Jummat break built in)',
      'Day 2 main stage structure locked (single-track)',
      'CFP applicants notified of review timeline and next steps',
      'Ticket sales live',
    ],
  },
  {
    status: 'ongoing',
    label: 'Ongoing',
    accent: '#FBBC05',
    icon: Clock,
    items: [
      'Final agenda slots being locked — 3 open (1 keynote, 2 sponsor sessions)',
      'Dates confirmed: November 6 & 7',
      'Sponsorship conversations in progress',
      'Policy/fireside session being finalized',
      'Individual speaker invitations going out for the fireside slot',
    ],
  },
  {
    status: 'coming-up',
    label: 'Coming Up',
    accent: '#4285F4',
    icon: CircleDot,
    items: [
      'Venue confirmation and announcement',
      'Final headcount confirmation',
      "Hackathon component decision (running or not — affects at least one speaker's slot)",
      'Full agenda release',
    ],
  },
]

export default function EventStatus() {
  return (
    <section className="mx-auto flex w-full max-w-[1512px] flex-col gap-10 px-4 py-16 lg:gap-14 lg:px-[128px] lg:py-24">
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="font-sans text-3xl font-bold text-[#1E1E1E] lg:text-[40px]">
          Where Things Stand
        </h2>
        <p className="max-w-[560px] text-sm text-[#1E1E1E]/60 lg:text-base">
          A running look at what&apos;s done, what&apos;s in motion, and
          what&apos;s next as we build DevFest Ilorin 2026.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        {statusColumns.map((column) => (
          <div
            key={column.status}
            className="flex flex-col gap-5 rounded-3xl border border-black/10 bg-white/70 p-6"
          >
            <div className="flex items-center gap-2">
              <column.icon
                className="size-5"
                style={{ color: column.accent }}
              />
              <h3 className="font-sans text-lg font-bold text-[#1E1E1E]">
                {column.label}
              </h3>
              <span
                className="ml-auto flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-bold text-white"
                style={{ backgroundColor: column.accent }}
              >
                {column.items.length}
              </span>
            </div>

            <ul className="flex flex-col gap-3">
              {column.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-black/[0.03] p-3 text-sm leading-snug text-[#1E1E1E]/80"
                >
                  <span
                    className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full')}
                    style={{ backgroundColor: column.accent }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
