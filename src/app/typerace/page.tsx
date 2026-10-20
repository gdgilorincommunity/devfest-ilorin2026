import type { Metadata } from 'next'

import config from '@/config'

import { TyperaceFrame } from './typerace-frame'

const title = `DevFest TypeRace - ${config.appName}`
const description = `How fast can you type? Typing races for ${config.appName}: practise free, race the room on your phone and climb the boards.`

const ogImage = {
  url: '/images/og/typerace.png',
  width: 1200,
  height: 630,
  alt: 'DevFest TypeRace by GDG Ilorin: TYPE RACE in GDG-coloured keycaps over a line of words being typed.',
}

/**
 * As on /cli and /map: the root layout declares site-wide `openGraph` and
 * `twitter` blocks, so this page declares its own, or sharing /typerace would
 * surface the homepage's card.
 */
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/typerace' },
  openGraph: {
    type: 'website',
    url: '/typerace',
    title,
    description,
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [ogImage],
  },
}

/**
 * The visitor keeps the /typerace URL on this domain while TypeRace renders
 * in place, full-bleed with no page chrome, exactly as /cli embeds the CLI.
 * TypeRace's own close button posts a message that `TyperaceFrame` turns
 * into a navigation home.
 */
export default function TyperacePage() {
  return <TyperaceFrame />
}
