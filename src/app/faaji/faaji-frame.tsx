'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { AppFrameLoader, useHydrated } from '@/components/app-frame-loader'
import config from '@/config'

/** Sent by Faaji when the visitor closes it. */
const EXIT_MESSAGE_TYPE = 'devfest-faaji:exit'

/**
 * Our reply: "taking them home". Without it Faaji breaks out of the frame
 * itself after 600 ms, which on a slow network would race router.push.
 */
const EXIT_ACK_TYPE = 'devfest-faaji:exit-ack'

/**
 * Full-bleed embed of Faaji, exactly as /typerace embeds TypeRace. Only
 * messages from this frame, at Faaji's origin, count.
 */
export function FaajiFrame() {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const hydrated = useHydrated()

  useEffect(() => {
    const faajiOrigin = new URL(config.faajiUrl).origin

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== faajiOrigin) return
      const frame = frameRef.current?.contentWindow

      if (!frame || event.source !== frame) return
      if (event.data?.type !== EXIT_MESSAGE_TYPE) return
      frame.postMessage({ type: EXIT_ACK_TYPE }, faajiOrigin)
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
          // Camera for QR scanning, share and clipboard for links, fullscreen for the big screen.
          allow="camera; clipboard-write; fullscreen; web-share"
          className="fixed inset-0 h-dvh w-screen border-0"
          src={config.faajiUrl}
          title={`Faaji - ${config.appName}`}
          onLoad={() => setLoaded(true)}
        />
      )}
      <AppFrameLoader app="faaji" loaded={loaded} />
    </>
  )
}
