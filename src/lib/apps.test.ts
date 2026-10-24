import { type App, appGalleryUrl } from '@/lib/apps'

const app = (href: string): App => ({
  id: 'test',
  name: 'Test',
  tagline: '',
  href,
  icon: '',
  category: 'Utility',
  contributors: [],
})

describe('appGalleryUrl', () => {
  it('tags an app link as coming from the gallery', () => {
    const url = new URL(appGalleryUrl(app('https://example.com/play')))

    expect(url.origin + url.pathname).toBe('https://example.com/play')
    expect(url.searchParams.get('utm_source')).toBe('devfestilorin')
    expect(url.searchParams.get('utm_medium')).toBe('app_gallery')
  })

  it("keeps the app's own tags and other query params", () => {
    const url = new URL(
      appGalleryUrl(app('https://example.com/?utm_source=gdgilorin&ref=x')),
    )

    expect(url.searchParams.get('utm_source')).toBe('gdgilorin')
    expect(url.searchParams.get('utm_medium')).toBe('app_gallery')
    expect(url.searchParams.get('ref')).toBe('x')
  })

  it('leaves a route on this site alone', () => {
    expect(appGalleryUrl(app('/map'))).toBe('/map')
  })
})
