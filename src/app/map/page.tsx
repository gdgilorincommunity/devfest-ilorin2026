import type { Metadata } from 'next'

import { Suspense } from 'react'

import config from '@/config'

import {
  chapterDescription,
  chapterName,
  fetchChapter,
  visitId,
} from './chapter'
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
const metadata: Metadata = {
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
 * A shared chapter link, /map?visit=slug/id, previews as that chapter:
 * "DevFest Map - GDG Lagos, Nigeria", where it is and what is next, and the
 * chapter's own banner. Anything else gets the page's card above.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const { visit } = await searchParams
  const id = visitId(visit)
  const chapter = id == null ? null : await fetchChapter(id)

  if (!chapter) return metadata

  const url = `/map?visit=${visit}`
  const chapterTitle = `DevFest Map - ${chapterName(chapter)}`
  const chapterText = chapterDescription(chapter)
  const images = chapter.pictureUrl
    ? [
        {
          url: chapter.pictureUrl,
          alt: `${chapterName(chapter)} on DevFest Map`,
        },
      ]
    : [ogImage]

  return {
    title: chapterTitle,
    description: chapterText,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: chapterTitle,
      description: chapterText,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: chapterTitle,
      description: chapterText,
      images,
    },
  }
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
