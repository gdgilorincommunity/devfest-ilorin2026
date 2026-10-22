import type { Metadata } from 'next'

import config from '@/config'

import { FaajiFrame } from './faaji-frame'

const title = `Faaji - ${config.appName}`
const description =
  "Don't just attend. Experience it. Complete quests, earn badges and get your Faaji Wrapped."

const ogImage = {
  url: '/images/og/faaji.png',
  width: 1200,
  height: 630,
  alt: 'Faaji: Adé the crowned crane with the GDG Ilorin team. Don’t just attend. Experience it.',
}

/**
 * As on /typerace: the root layout declares site-wide `openGraph` and
 * `twitter` blocks, so this page declares its own.
 */
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/faaji' },
  openGraph: {
    type: 'website',
    url: '/faaji',
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
 * Faaji renders in place, full-bleed, as /typerace embeds TypeRace. Faaji's
 * close button posts a message that `FaajiFrame` turns into a navigation home.
 */
export default function FaajiPage() {
  return <FaajiFrame />
}
