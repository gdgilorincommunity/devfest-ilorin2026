'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

import config from '@/config'

/** Sent by the CLI app when the visitor closes it (× or `exit`). */
const EXIT_MESSAGE_TYPE = 'devfest-cli:exit'

/**
 * Our reply: "taking them home". Without it the CLI breaks out of the frame
 * itself after 600 ms, which on a slow network would race router.push.
 */
const EXIT_ACK_TYPE = 'devfest-cli:exit-ack'

/**
 * Full-bleed embed of the DevFest CLI site.
 *
 * The CLI cannot leave on its own: navigating from inside the frame would load
 * the homepage inside the frame and keep /cli in the address bar. So it posts
 * an exit message and we take the visitor home from here. Only messages from
 * this frame, at the CLI's origin, count.
 */
export function CliFrame() {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const router = useRouter()

  useEffect(() => {
    const cliOrigin = new URL(config.cliUrl).origin

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== cliOrigin) return
      const frame = frameRef.current?.contentWindow

      if (!frame || event.source !== frame) return
      if (event.data?.type !== EXIT_MESSAGE_TYPE) return
      frame.postMessage({ type: EXIT_ACK_TYPE }, cliOrigin)
      router.push('/')
    }

    window.addEventListener('message', onMessage)

    return () => window.removeEventListener('message', onMessage)
  }, [router])

  return (
    <iframe
      ref={frameRef}
      allow="clipboard-write; fullscreen"
      className="fixed inset-0 h-dvh w-screen border-0"
      src={config.cliUrl}
      title={`${config.appName} CLI`}
    />
  )
}
