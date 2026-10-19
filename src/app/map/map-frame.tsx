'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

import config from '@/config'

/** Sent by DevFest Map when the visitor closes it (the × beside its logo). */
const EXIT_MESSAGE_TYPE = 'devfest-map:exit'

/** Campaign tags a shared /map link may carry, passed on so DevFest Map's
 *  analytics can tell which post a visit came from. Nothing else is. */
const FORWARDED = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']

/** A chapter a shared link points at, `?visit=gdg-accra/1240` (slug/id),
 *  opened in the map as its own /visit path. */
const VISIT = /^[a-z0-9-]+\/\d+$/

const mapSrc = (search: URLSearchParams) => {
  const url = new URL(config.mapUrl)
  const visit = search.get('visit')

  if (visit && VISIT.test(visit)) url.pathname = `/visit/${visit}`

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
 */
export function MapFrame() {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const router = useRouter()
  const search = useSearchParams()

  useEffect(() => {
    const mapOrigin = new URL(config.mapUrl).origin

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== mapOrigin) return
      if (event.source !== frameRef.current?.contentWindow) return
      if (event.data?.type !== EXIT_MESSAGE_TYPE) return
      router.push('/')
    }

    window.addEventListener('message', onMessage)

    return () => window.removeEventListener('message', onMessage)
  }, [router])

  return (
    <iframe
      ref={frameRef}
      allow="geolocation; autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write; web-share"
      className="fixed inset-0 h-dvh w-screen border-0"
      src={mapSrc(search)}
      title={`DevFest Map - ${config.appName}`}
    />
  )
}
