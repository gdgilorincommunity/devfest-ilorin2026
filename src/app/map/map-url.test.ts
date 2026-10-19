import { mapPathFor, pageQueryFor } from './map-url'

const q = (s: string) => new URLSearchParams(s)

describe('map route mirroring', () => {
  it('opens the map where the page query says', () => {
    expect(mapPathFor(q('visit=gdg-lagos/543'))).toBe('/visit/gdg-lagos/543')
    expect(mapPathFor(q('visit=gdg-lagos/543&tab=team&station=ab-1'))).toBe(
      '/visit/gdg-lagos/543/team?station=ab-1',
    )
    expect(mapPathFor(q('explore=gdg-lagos/543'))).toBe(
      '/explore/gdg-lagos/543',
    )
    expect(mapPathFor(q('ride=1'))).toBe('/balloon-ride')
    expect(mapPathFor(q('visit=../../evil&tab=x'))).toBe('/')
    expect(mapPathFor(q('visit=gdg-lagos/543&tab=<script>'))).toBe(
      '/visit/gdg-lagos/543',
    )
    expect(mapPathFor(q(''))).toBe('/')
  })

  it('mirrors the map path as a page query, and round-trips', () => {
    expect(pageQueryFor('/visit/gdg-lagos/543/events')?.toString()).toBe(
      'visit=gdg-lagos%2F543&tab=events',
    )
    expect(
      pageQueryFor('/explore/gdg-lagos/543?station=ab-1')?.toString(),
    ).toBe('explore=gdg-lagos%2F543&station=ab-1')
    expect(pageQueryFor('/')?.toString()).toBe('')
    expect(pageQueryFor('/balloon-ride')?.toString()).toBe('ride=1')
    expect(pageQueryFor('/listen/x/y')).toBeNull()
    expect(pageQueryFor('/visit/Bad Slug/1')).toBeNull()

    for (const path of [
      '/visit/gdg-ilorin/219/watch?station=ab-1',
      '/explore/gdg-ilorin/219',
    ])
      expect(mapPathFor(pageQueryFor(path)!)).toBe(path)
  })
})
