'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import config from '@/config'

import { mapPathFor, pageQueryFor } from './map-url'

/** Sent by DevFest Map when the visitor closes it (the × beside its logo). */
const EXIT_MESSAGE_TYPE = 'devfest-map:exit'

/** Sent by DevFest Map whenever its URL changes: { type, path }. */
const ROUTE_MESSAGE_TYPE = 'devfest-map:route'

/** Campaign tags a shared /map link may carry, passed on so DevFest Map's
 *  analytics can tell which post a visit came from. Nothing else is. */
const FORWARDED = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']

const mapSrc = (search: URLSearchParams) => {
  // ?visit=, ?explore=, ?tab= and ?station= open the map on that view.
  const url = new URL(mapPathFor(search), config.mapUrl)

  for (const key of FORWARDED) {
    const value = search.get(key)

    if (value) url.searchParams.set(key, value)
  }

  return url.toString()
}

/**
 * Full-bleed embed of DevFest Map.
 *
 * The map cannot leave on its own: navigating from inside the frame would
 * load the homepage inside the frame and keep /map in the address bar. So it
 * posts an exit message and we take the visitor home from here. Only messages
 * from this frame, at the map's origin, count.
 *
 * `allow` delegates what the map uses: precise location for "locate me"
 * (only ever asked on a tap), autoplay for local radio after the first tap,
 * fullscreen and picture-in-picture for livestreams, and web-share and
 * clipboard for Share (the map's links come back here as /map?visit=).
 *
 * As the visitor moves around, the map reports its URL and this page's
 * address bar follows (map-url.ts), so a refresh comes back to the same view.
 * The frame's src is worked out once: changing the address bar must not
 * reload the map.
 */
export function MapFrame() {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const router = useRouter()
  const search = useSearchParams()
  const [src] = useState(() => mapSrc(search))

  useEffect(() => {
    const mapOrigin = new URL(config.mapUrl).origin

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== mapOrigin) return
      if (event.source !== frameRef.current?.contentWindow) return
      if (event.data?.type === EXIT_MESSAGE_TYPE) return router.push('/')
      if (event.data?.type !== ROUTE_MESSAGE_TYPE) return
      if (typeof event.data.path !== 'string') return

      const query = pageQueryFor(event.data.path)

      if (!query) return

      // Slashes stay readable: ?visit=gdg-lagos/543, not gdg-lagos%2F543.
      const next = query.size
        ? `/map?${query.toString().replaceAll('%2F', '/')}`
        : '/map'

      if (next !== `${location.pathname}${location.search}`)
        window.history.replaceState(window.history.state, '', next)
    }

    window.addEventListener('message', onMessage)

    return () => window.removeEventListener('message', onMessage)
  }, [router])

  return (
    <iframe
      ref={frameRef}
      allow="geolocation; autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write; web-share"
      className="fixed inset-0 h-dvh w-screen border-0"
      src={src}
      title={`DevFest Map - ${config.appName}`}
    />
  )
}
