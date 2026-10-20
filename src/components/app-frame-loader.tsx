'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

import { cn } from '@/lib/utils'

export type EmbeddedApp = 'cli' | 'map' | 'typerace'

const NAMES: Record<EmbeddedApp, string> = {
  cli: 'DevFest CLI',
  map: 'DevFest Map',
  typerace: 'DevFest TypeRace',
}

/** How long the fade takes before the loader leaves the page. */
const FADE_MS = 300

/** If the app never reports in (a blocked frame, say), stop covering it. */
const GIVE_UP_MS = 15_000

const noop = () => () => {}

/**
 * False on the server and during hydration, true after. A frame page renders
 * its iframe only once this is true: an iframe in the server HTML can finish
 * loading before React attaches `onLoad`, and that load event is never seen,
 * which would leave the loader up for good.
 */
export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
}

/**
 * What a full-bleed app page shows until its iframe has loaded, in place of a
 * blank white page: a skeleton of the app itself, on the app's own ground, so
 * the hand-off to the real thing is a fade, not a flash.
 *
 * `loaded` comes from the iframe's load event. The loader fades out and then
 * leaves the DOM so it can never sit over the app.
 */
export function AppFrameLoader({
  app,
  loaded,
}: {
  app: EmbeddedApp
  loaded: boolean
}) {
  const [gone, setGone] = useState(false)
  const [gaveUp, setGaveUp] = useState(false)
  const done = loaded || gaveUp

  useEffect(() => {
    const timer = setTimeout(() => setGaveUp(true), GIVE_UP_MS)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!done) return
    const timer = setTimeout(() => setGone(true), FADE_MS)

    return () => clearTimeout(timer)
  }, [done])

  if (gone) return null

  return (
    <div
      aria-live="polite"
      className={cn(
        'fixed inset-0 z-10 grid place-items-center px-6 transition-opacity duration-300 ease-out',
        done && 'pointer-events-none opacity-0',
        app === 'cli' && 'bg-[#0b0b0d]',
        app === 'map' &&
          'bg-[#1b3fa8] bg-[radial-gradient(120%_120%_at_50%_0%,#3186ff_0%,#2453c9_45%,#142e7a_100%)]',
        app === 'typerace' &&
          'bg-[#fcf4f4] bg-[radial-gradient(85.98%_85.98%_at_50%_17.07%,#fcf4f4_52%,#fff7fa_76%,#ffc4c2_100%)] [@media(prefers-color-scheme:dark)]:bg-[#141214] [@media(prefers-color-scheme:dark)]:bg-[radial-gradient(85.98%_85.98%_at_50%_17.07%,#141214_52%,#171316_76%,#4a1d26_100%)]',
      )}
      role="status"
    >
      <span className="sr-only">Loading {NAMES[app]}</span>
      {app === 'cli' && <CliSkeleton />}
      {app === 'map' && <MapSkeleton />}
      {app === 'typerace' && <TyperaceSkeleton />}
    </div>
  )
}

/** A bar of text still arriving. */
function Line({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'block h-3 rounded-full motion-safe:animate-pulse',
        className,
      )}
    />
  )
}

/** The CLI's terminal window, before its banner prints. */
function CliSkeleton() {
  return (
    <div
      aria-hidden
      className="w-full max-w-3xl overflow-hidden rounded-[10px] border border-[#26262b] bg-[#121214]"
    >
      <div className="flex items-center gap-2 border-b border-[#26262b] px-4 py-3">
        <i className="size-3 rounded-full bg-[#ea4335]" />
        <i className="size-3 rounded-full bg-[#fbbc05]" />
        <i className="size-3 rounded-full bg-[#34a853]" />
        <Line className="ml-auto h-2.5 w-40 bg-[#26262b]" />
      </div>
      <div className="flex flex-col gap-4 p-6 sm:p-8">
        <Line className="h-14 w-full bg-[linear-gradient(90deg,#4285f4,#ea4335,#fbbc05)] opacity-25" />
        <Line className="w-56 bg-[#26262b]" />
        <Line className="w-72 bg-[#1a1a1e]" />
        <Line className="w-64 bg-[#1a1a1e]" />
        <span className="mt-4 font-mono text-sm text-[#5a5a60]">
          {'>'} starting devfest-ilorin…
        </span>
      </div>
    </div>
  )
}

/** The globe, before its tiles arrive. */
function MapSkeleton() {
  return (
    <div aria-hidden className="flex flex-col items-center gap-8">
      <div className="relative size-[min(70vw,420px)] rounded-full border-4 border-white/25 motion-safe:animate-pulse">
        <span className="absolute top-[38%] left-[46%] size-3 rounded-full bg-[#32a852]" />
        <span className="absolute top-[52%] left-[58%] size-2.5 rounded-full bg-[#ea4435]" />
        <span className="absolute top-[30%] left-[30%] size-2 rounded-full bg-[#32a852]" />
        <span className="absolute top-[62%] left-[36%] size-2 rounded-full bg-[#32a852]" />
      </div>
      <span className="font-sans text-white/80">Loading the globe…</span>
    </div>
  )
}

const KEYS = [
  ['T', '#537cbe'],
  ['Y', '#ea4435'],
  ['P', '#f8ab19'],
  ['E', '#32a852'],
  ['R', '#537cbe'],
  ['A', '#ea4435'],
  ['C', '#f8ab19'],
  ['E', '#32a852'],
] as const

/** TypeRace's keycap title typing itself, over lines of words to come. */
function TyperaceSkeleton() {
  return (
    <div
      aria-hidden
      className="flex w-full max-w-2xl flex-col items-center gap-10"
    >
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
        {[KEYS.slice(0, 4), KEYS.slice(4)].map((word, w) => (
          <span key={w} className="flex gap-1.5">
            {word.map(([letter, cap], i) => (
              <span
                key={i}
                className="grid size-11 place-items-center rounded-[10px] border-2 border-[#1e1e1e] pb-1 font-sans text-xl font-bold text-white motion-safe:animate-[typerace-press_1.6s_ease-in-out_infinite] sm:size-14 sm:text-2xl [@media(prefers-color-scheme:dark)]:border-[#f3eef0]"
                style={{
                  background: `linear-gradient(to top, color-mix(in oklab, ${cap} 72%, #1e1e1e) 5px, ${cap} 5px)`,
                  color: cap === '#f8ab19' ? '#1e1e1e' : undefined,
                  animationDelay: `${(w * 4 + i) * 110}ms`,
                }}
              >
                {letter}
              </span>
            ))}
          </span>
        ))}
      </div>
      <div className="flex w-full flex-col gap-4">
        <Line className="h-4 w-full bg-[#1e1e1e]/10 [@media(prefers-color-scheme:dark)]:bg-white/10" />
        <Line className="h-4 w-11/12 bg-[#1e1e1e]/10 [@media(prefers-color-scheme:dark)]:bg-white/10" />
        <Line className="h-4 w-4/5 bg-[#1e1e1e]/10 [@media(prefers-color-scheme:dark)]:bg-white/10" />
      </div>
    </div>
  )
}
