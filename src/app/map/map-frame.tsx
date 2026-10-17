'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

import config from '@/config'

/** Sent by DevFest Map when the visitor closes it (the × beside its logo). */
const EXIT_MESSAGE_TYPE = 'devfest-map:exit'

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
 * fullscreen and picture-in-picture for livestreams, and clipboard for share.
 */
export function MapFrame() {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const router = useRouter()

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
      allow="geolocation; autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write"
      className="fixed inset-0 h-dvh w-screen border-0"
      src={config.mapUrl}
      title={`DevFest Map - ${config.appName}`}
    />
  )
}
