'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { AppFrameLoader, useHydrated } from '@/components/app-frame-loader'
import config from '@/config'

/** Sent by DevFest TypeRace when the visitor closes it (the × beside its logo). */
const EXIT_MESSAGE_TYPE = 'devfest-typerace:exit'

/**
 * Our reply: "taking them home". Without it TypeRace breaks out of the frame
 * itself after 600 ms, which on a slow network would race router.push.
 */
const EXIT_ACK_TYPE = 'devfest-typerace:exit-ack'

/**
 * Full-bleed embed of DevFest TypeRace, exactly as /cli embeds the CLI.
 *
 * TypeRace cannot leave on its own: navigating from inside the frame would
 * load the homepage inside the frame and keep /typerace in the address bar.
 * So it posts an exit message and we take the visitor home from here. Only
 * messages from this frame, at TypeRace's origin, count.
 */
export function TyperaceFrame() {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const hydrated = useHydrated()

  useEffect(() => {
    const typeraceOrigin = new URL(config.typeraceUrl).origin

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== typeraceOrigin) return
      const frame = frameRef.current?.contentWindow

      if (!frame || event.source !== frame) return
      if (event.data?.type !== EXIT_MESSAGE_TYPE) return
      frame.postMessage({ type: EXIT_ACK_TYPE }, typeraceOrigin)
      router.push('/')
    }

    window.addEventListener('message', onMessage)

    return () => window.removeEventListener('message', onMessage)
  }, [router])

  return (
    <>
      {hydrated && (
        <iframe
          ref={frameRef}
          allow="clipboard-write; fullscreen"
          className="fixed inset-0 h-dvh w-screen border-0"
          src={config.typeraceUrl}
          title={`DevFest TypeRace - ${config.appName}`}
          onLoad={() => setLoaded(true)}
        />
      )}
      <AppFrameLoader app="typerace" loaded={loaded} />
    </>
  )
}
