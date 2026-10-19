import config from '@/config'

/** A chapter a shared link points at, `?visit=gdg-accra/822` (slug/id). */
export const VISIT = /^[a-z0-9-]+\/\d+$/

/** The chapter id in a `?visit=` value, or null if it is not one. */
export const visitId = (visit: string | string[] | undefined): number | null =>
  typeof visit === 'string' && VISIT.test(visit)
    ? Number(visit.split('/')[1])
    : null

/** What a link preview needs from DevFest Map's get_place. */
export interface SharedChapter {
  title: string
  city: string
  country: string
  pictureUrl: string | null
  profile: { membersCount: number | null } | null
  events: {
    title: string
    startAt: string
    timezone: string | null
    status: string
  }[]
}

/**
 * The chapter from DevFest Map's public API, or null. Cached for an hour,
 * and given up on after a few seconds so a slow API never holds the page.
 */
export const fetchChapter = async (
  id: number,
): Promise<SharedChapter | null> => {
  try {
    const res = await fetch(
      `${config.mapApiUrl}/rest/v1/rpc/get_place?p_chapter_id=${id}`,
      {
        headers: { apikey: config.mapApiKey },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(3000),
      },
    )

    if (!res.ok) return null

    return ((await res.json()) as SharedChapter | null) ?? null
  } catch {
    return null
  }
}

const countryName = (code: string) => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? code
  } catch {
    return code
  }
}

/**
 * "GDG on Campus University of Lagos - Lagos, Nigeria" → "GDG on Campus
 * University of Lagos, Nigeria"; "GDG Lagos" → "GDG Lagos, Nigeria".
 */
export const chapterName = (c: SharedChapter) => {
  const name = c.title.replace(/\s+-\s+[^-]+$/, '')

  return c.country ? `${name}, ${countryName(c.country)}` : name
}

/** One or two lines on the chapter: where, how big, and what is next. */
export const chapterDescription = (c: SharedChapter) => {
  const where = [c.city, c.country && countryName(c.country)]
    .filter(Boolean)
    .join(', ')
  const members = c.profile?.membersCount
  const next = c.events.find((e) => e.status !== 'completed')
  const parts = [
    `${where}${members ? ` · ${members.toLocaleString('en')} members` : ''}.`,
  ]

  if (next) {
    const date = new Intl.DateTimeFormat('en', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: next.timezone ?? 'UTC',
    }).format(new Date(next.startAt))

    parts.push(
      `${next.status === 'live' ? 'Live now' : 'Next'}: ${next.title}, ${date}.`,
    )
  }

  parts.push(
    'See its events, recaps, organizers and local radio on DevFest Map.',
  )

  return parts.join(' ')
}
