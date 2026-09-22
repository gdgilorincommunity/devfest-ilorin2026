import Link from 'next/link'
import { Clock } from 'lucide-react'

import {
  AGENDA,
  type AgendaDay,
  type AgendaSession,
  type AgendaTrack,
  type SessionKind,
} from '@/lib/agenda'
import { getSpeaker } from '@/lib/speakers'
import { cn } from '@/lib/utils'

/**
 * Session-type pills reuse the recap-row gradients so the agenda reads as
 * part of the same family as the rest of the site.
 */
const KIND_META: Record<SessionKind, { label: string; className: string }> = {
  keynote: {
    label: 'Keynote',
    className: 'bg-gradient-to-b from-[#FFC700] to-[#FFA000] text-[#1E1E1E]',
  },
  talk: {
    label: 'Talk',
    className: 'bg-gradient-to-b from-[#2B7FFF] to-[#A5B4FC] text-white',
  },
  technical: {
    label: 'Technical',
    className: 'bg-gradient-to-b from-[#2B7FFF] to-[#A5B4FC] text-white',
  },
  lightning: {
    label: 'Lightning',
    className: 'bg-gradient-to-b from-[#FF3B30] to-[#FA709A] text-white',
  },
  panel: {
    label: 'Panel',
    className: 'bg-gradient-to-b from-[#00C853] to-[#00B4D8] text-white',
  },
  workshop: {
    label: 'Workshop',
    className: 'bg-gradient-to-b from-[#00C853] to-[#00B4D8] text-white',
  },
  hardware: {
    label: 'Hardware',
    className: 'bg-gradient-to-b from-[#FFC700] to-[#FFA000] text-[#1E1E1E]',
  },
  community: {
    label: 'Community',
    className: 'bg-gradient-to-b from-white to-[#DDE3FF] text-[#1E1E1E]',
  },
  break: {
    label: 'Break',
    className: 'bg-[#1E1E1E]/8 text-[#1E1E1E]',
  },
}

/** Day headers echo the ticket cards for the same day. */
const ACCENT_META = {
  yellow: {
    className: 'bg-gradient-to-b from-[#FFC700] via-[#FFD600] to-[#FFE55C]',
    textClass: 'text-[#111111]',
    mutedClass: 'text-[#111111]/70',
  },
  green: {
    className: 'bg-gradient-to-b from-[#00A859] via-[#00B74A] to-[#46D3B6]',
    textClass: 'text-white',
    mutedClass: 'text-white/80',
  },
} as const

function SpeakerLink({ id }: { id: string }) {
  const speaker = getSpeaker(id)

  return (
    <Link
      className="group/speaker inline-flex flex-col rounded-md outline-none focus-visible:ring-3 focus-visible:ring-[#3186FF]/40"
      href={`/speakers#speaker-${speaker.id}`}
    >
      <span className="font-sans text-sm font-bold text-[#1E1E1E] underline-offset-4 group-hover/speaker:underline">
        {speaker.name}
      </span>
      <span className="text-xs text-[#1E1E1E]/60">{speaker.role}</span>
    </Link>
  )
}

function SessionCard({ session }: { session: AgendaSession }) {
  const kind = KIND_META[session.kind]
  const isBreak = session.kind === 'break'

  return (
    <li
      className={cn(
        'flex flex-col gap-3 rounded-[28px] border p-5 sm:p-6',
        isBreak
          ? 'border-dashed border-[#1E1E1E]/20 bg-transparent'
          : 'border-black/5 bg-white shadow-xs',
        session.tba && !isBreak && 'bg-white/60',
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'inline-flex items-center rounded-full px-3.5 py-1.5 font-sans text-xs font-semibold whitespace-nowrap',
            kind.className,
          )}
        >
          {kind.label}
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-black/8 bg-[#FCF4F4] px-3 py-1.5 font-sans text-xs font-medium text-[#1E1E1E]/70">
          <Clock aria-hidden className="size-3.5" />
          {session.time ?? session.duration}
        </span>

        {session.time && (
          <span className="text-xs font-medium text-[#1E1E1E]/50">
            {session.duration}
          </span>
        )}
      </div>

      <h4
        className={cn(
          'font-sans leading-snug font-bold text-[#1E1E1E]',
          isBreak ? 'text-base' : 'text-base sm:text-lg',
          session.tba && 'text-[#1E1E1E]/60',
        )}
      >
        {session.title}
      </h4>

      {(session.moderatorId ||
        session.speakerIds?.length ||
        session.presenter) && (
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {session.moderatorId && (
            <div className="flex flex-col">
              <span className="mb-1 text-[10px] font-bold tracking-wide text-[#1E1E1E]/40 uppercase">
                Moderator
              </span>
              <SpeakerLink id={session.moderatorId} />
            </div>
          )}

          {session.speakerIds?.map((id) => (
            <SpeakerLink key={id} id={id} />
          ))}

          {session.presenter && (
            <span className="font-sans text-sm font-bold text-[#1E1E1E]">
              {session.presenter}
            </span>
          )}
        </div>
      )}

      {session.note && (
        <p className="text-xs text-[#1E1E1E]/50">{session.note}</p>
      )}
    </li>
  )
}

function TrackColumn({ track, index }: { track: AgendaTrack; index: number }) {
  return (
    <div
      data-reveal
      className="flex flex-col gap-4"
      style={{ '--reveal-delay': `${index * 70}ms` } as React.CSSProperties}
    >
      <h3 className="px-1 font-sans text-lg font-bold text-[#1E1E1E] sm:text-xl">
        {track.name}
      </h3>
      <ul className="flex flex-col gap-4">
        {track.sessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </ul>
    </div>
  )
}

function DayHeader({ day }: { day: AgendaDay }) {
  const accent = ACCENT_META[day.accent]

  return (
    <div
      data-reveal
      className={cn(
        'flex flex-col gap-6 rounded-[32px] p-7 shadow-xs sm:flex-row sm:items-end sm:justify-between sm:rounded-[36px] sm:p-9',
        accent.className,
      )}
    >
      <div className="flex flex-col gap-2">
        <span
          className={cn(
            'font-sans text-sm font-bold tracking-wide uppercase',
            accent.mutedClass,
          )}
        >
          {day.date}
        </span>
        <h2
          className={cn(
            'font-sans text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-[64px]',
            accent.textClass,
          )}
        >
          {day.label}
        </h2>
      </div>
      <p
        className={cn(
          'max-w-md font-sans text-sm font-medium sm:text-base',
          accent.mutedClass,
        )}
      >
        {day.summary}
      </p>
    </div>
  )
}

function DaySection({ day }: { day: AgendaDay }) {
  // The main stage is a single long list; give it a wide column and let the
  // workshop rooms sit beside it. Days with only rooms split evenly.
  const hasMainStage = day.tracks.some((track) => track.id.endsWith('-main'))

  return (
    <section
      aria-labelledby={`${day.id}-heading`}
      className="scroll-mt-28 w-full"
      id={day.id}
    >
      <DayHeader day={day} />

      <div
        className={cn(
          'mt-8 grid gap-8 lg:mt-10',
          hasMainStage
            ? 'lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]'
            : 'md:grid-cols-2 lg:grid-cols-4',
        )}
      >
        {day.tracks.map((track, index) => (
          <TrackColumn key={track.id} index={index} track={track} />
        ))}
      </div>

      {/* aria-labelledby target; the visible heading is inside DayHeader */}
      <span className="sr-only" id={`${day.id}-heading`}>
        {day.label}, {day.date}
      </span>
    </section>
  )
}

export interface AgendaProps {
  days?: AgendaDay[]
  className?: string
}

export function Agenda({ days = AGENDA, className }: AgendaProps) {
  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-378 flex-col gap-20 px-4 md:px-12 lg:gap-28 lg:px-24',
        className,
      )}
    >
      {days.map((day) => (
        <DaySection key={day.id} day={day} />
      ))}
    </div>
  )
}

export default Agenda
