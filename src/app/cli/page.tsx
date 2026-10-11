import type { Metadata } from 'next'

import config from '@/config'

import { CliFrame } from './cli-frame'

const title = `CLI - ${config.appName}`
const description = `Play the ${config.appName} trivia tournament from your terminal. Sign in with Google and compete on the leaderboard.`

const ogImage = {
  url: '/images/og/cli.png',
  width: 1200,
  height: 630,
  alt: `The ${config.appName} CLI running in a terminal, showing the DevFest banner and the ${config.appName} tournament.`,
}

/**
 * The root layout declares site-wide `openGraph` and `twitter` blocks, and
 * Next does not derive those from a page's `title`/`description` on its own —
 * without the explicit blocks below, sharing /cli would surface the
 * homepage's card instead of this one.
 *
 * The card is declared here rather than via the `opengraph-image` file
 * convention: that convention's companion `.alt.txt` did not emit
 * `og:image:alt` on this Next version, and this matches how the root layout
 * already declares its social image.
 */
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/cli' },
  openGraph: {
    type: 'website',
    url: '/cli',
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
 * The visitor keeps the /cli URL on this domain while the CLI app renders in
 * place. `fixed inset-0` takes the iframe out of the root layout's flex
 * column so it fills the viewport with no page chrome around it, and 100dvh
 * keeps it correct under mobile browser toolbars.
 *
 * There is deliberately no chrome over the frame. The CLI's own close button
 * (and its `exit` command) posts a message that `CliFrame` turns into a
 * navigation home.
 */
export default function CliPage() {
  return <CliFrame />
}
