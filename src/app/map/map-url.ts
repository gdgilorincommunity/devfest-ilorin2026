import { VISIT } from './chapter'

/**
 * DevFest Map's URL and this page's, kept in step so a refresh or a copied
 * link from devfestilorin.com/map comes back to the same view:
 *
 *   map /visit/gdg-lagos/543          page /map?visit=gdg-lagos/543
 *   map /visit/gdg-lagos/543/team     page /map?visit=gdg-lagos/543&tab=team
 *   map /explore/gdg-lagos/543        page /map?explore=gdg-lagos/543
 *   map …?station=abc                 page …&station=abc
 *   map /balloon-ride                 page /map?ride=1
 */
const TABS = ['events', 'team', 'watch', 'visit', 'website']
const STATION = /^[A-Za-z0-9-]{1,64}$/

/** The map path to open for this page's query. */
export const mapPathFor = (q: URLSearchParams): string => {
  const visit = q.get('visit')
  const explore = q.get('explore')
  const tab = q.get('tab')
  const station = q.get('station')
  let path = '/'

  if (visit && VISIT.test(visit))
    path = `/visit/${visit}${tab && TABS.includes(tab) ? `/${tab}` : ''}`
  else if (explore && VISIT.test(explore)) path = `/explore/${explore}`
  else if (q.has('ride')) return '/balloon-ride'

  return station && STATION.test(station) && path !== '/'
    ? `${path}?station=${station}`
    : path
}

/** This page's query for a map path, or null if it is not one we mirror. */
export const pageQueryFor = (mapPath: string): URLSearchParams | null => {
  let url: URL

  try {
    url = new URL(mapPath, 'https://map.invalid')
  } catch {
    return null
  }

  const parts = url.pathname.split('/').filter(Boolean)
  const q = new URLSearchParams()
  const chapter = `${parts[1]}/${parts[2]}`
  const station = url.searchParams.get('station')

  if (parts.length === 0) return q
  if (parts[0] === 'balloon-ride') {
    q.set('ride', '1')

    return q
  }
  if (!VISIT.test(chapter)) return null
  if (parts[0] === 'visit') {
    q.set('visit', chapter)
    if (parts[3] && TABS.includes(parts[3])) q.set('tab', parts[3])
  } else if (parts[0] === 'explore') q.set('explore', chapter)
  else return null
  if (station && STATION.test(station)) q.set('station', station)

  return q
}
