'use client'

import { useEffect, useState } from 'react'

import { HeroBlob, HeroBlobClipPaths } from '@/components/hero-blob'
import { HeroImageScroller } from '@/components/hero-image-scroller'
import { HERO_BLOB_CLUSTERS } from '@/lib/hero-blobs'

const HERO_IMAGE_SIZE = {
  mobile: 300,
  desktop: 330,
} as const

const [clusterOne, clusterTwo, clusterThree, clusterFour] = HERO_BLOB_CLUSTERS

/** Once per visit, so returning to the homepage doesn't replay it. */
const DEMO_SEEN_KEY = 'devfest-hero-demo-seen'
/** After the hero's entrance has settled. */
const DEMO_START_MS = 1500
/** Long enough for the square, the caption and a moment to read it. */
const DEMO_HOLD_MS = 2400

/**
 * Plays the top-left photo's hover once on its own, so visitors on a mouse
 * see that the photos respond. Any real input — moving the mouse, scrolling,
 * a key — cancels it at once.
 */
function useHoverDemo() {
  const [demo, setDemo] = useState(false)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return

    const canHover = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (min-width: 1024px)',
    ).matches
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (!canHover || reducedMotion) return

    try {
      if (sessionStorage.getItem(DEMO_SEEN_KEY)) return
    } catch {
      // Storage can be unavailable (private mode); the demo just plays.
    }

    const events = ['pointermove', 'wheel', 'scroll', 'keydown'] as const
    const timers: number[] = []
    const stop = () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      setDemo(false)
      events.forEach((event) => window.removeEventListener(event, stop))
    }

    events.forEach((event) =>
      window.addEventListener(event, stop, { passive: true, once: true }),
    )
    timers.push(
      window.setTimeout(() => {
        // Marked when it actually plays, so a cancelled run doesn't count.
        try {
          sessionStorage.setItem(DEMO_SEEN_KEY, '1')
        } catch {}
        setDemo(true)
      }, DEMO_START_MS),
      window.setTimeout(stop, DEMO_START_MS + DEMO_HOLD_MS),
    )

    return stop
  }, [])

  return demo
}

export function HeroImages() {
  const demo = useHoverDemo()

  return (
    <>
      <HeroBlobClipPaths />

      <div className="relatives w-full pb-4 lg:hidden">
        {' '}
        {/*Removed the mt-auto to reduce the excess space on the images top in mobile version */}
        <HeroImageScroller direction="left" speed="medium">
          {HERO_BLOB_CLUSTERS.map((cluster, index) => (
            <li
              key={cluster.id}
              className="relative flex shrink-0 items-center justify-center"
              style={{
                height: HERO_IMAGE_SIZE.mobile,
                width: HERO_IMAGE_SIZE.mobile,
              }}
            >
              <HeroBlob
                cluster={cluster}
                priority={index === 0}
                size={HERO_IMAGE_SIZE.mobile}
              />
            </li>
          ))}
        </HeroImageScroller>
      </div>

      <div className="relative mt-8 hidden h-full w-full flex-col items-center justify-between gap-16 lg:mt-6 lg:flex lg:flex-row lg:items-stretch lg:gap-0 lg:px-0">
        <div className="flex w-full flex-col items-center gap-16 lg:w-auto lg:items-start lg:gap-0 lg:pt-7.75 lg:pl-16.25">
          <div className="relative mx-auto w-fit lg:mx-0">
            <HeroBlob
              priority
              cluster={clusterOne}
              demo={demo}
              enterDelay={160}
              size={HERO_IMAGE_SIZE.desktop}
            />
          </div>

          <div className="relative mx-auto mt-16 w-fit lg:mx-0 lg:mt-2.5 lg:ml-21.25">
            <HeroBlob
              cluster={clusterTwo}
              enterDelay={280}
              size={HERO_IMAGE_SIZE.desktop}
            />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-16 lg:w-auto lg:items-start lg:gap-0 lg:pt-0 lg:pr-23">
          <div className="relative mx-auto w-fit lg:mx-0 lg:-mt-12.5">
            <HeroBlob
              cluster={clusterThree}
              enterDelay={220}
              size={HERO_IMAGE_SIZE.desktop}
            />
          </div>

          <div className="relative mx-auto w-fit lg:mx-0 lg:mt-20 lg:-ml-17.5">
            <HeroBlob
              cluster={clusterFour}
              enterDelay={340}
              size={HERO_IMAGE_SIZE.desktop}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default HeroImages
