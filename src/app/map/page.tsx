import type { Metadata } from 'next'

import { Suspense } from 'react'

import config from '@/config'

import { MapFrame } from './map-frame'

const title = `DevFest Map - ${config.appName}`
const description =
  'Every GDG chapter on one globe. Drop into any DevFest, watch livestreams, hear the local radio and take a Balloon Ride to a chapter you have never visited.'

const ogImage = {
  url: '/images/og/map.png',
  width: 1200,
  height: 630,
  alt: 'DevFest Map by GDG Ilorin: a satellite globe dotted with GDG chapters, centred on Ilorin, Nigeria.',
}

/**
 * As on /cli: the root layout declares site-wide `openGraph` and `twitter`
 * blocks, so this page declares its own, or sharing /map would surface the
 * homepage's card.
 */
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/map' },
  openGraph: {
    type: 'website',
    url: '/map',
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
 * The visitor keeps the /map URL on this domain while DevFest Map renders in
 * place, full-bleed with no page chrome, exactly as /cli embeds the CLI.
 * DevFest Map's own close button posts a message that `MapFrame` turns into
 * a navigation home. A shared link's UTM tags are passed on to the frame so
 * DevFest Map's analytics can tell which post a visit came from.
 */
export default function MapPage() {
  // useSearchParams needs a Suspense boundary to keep this page static.
  return (
    <Suspense>
      <MapFrame />
    </Suspense>
  )
}
