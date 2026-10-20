'use client'

import { useEffect, useRef, useState } from 'react'

import { HeroBlob, HeroBlobClipPaths } from '@/components/hero-blob'
import { HeroImageScroller } from '@/components/hero-image-scroller'
import { HERO_BLOB_CLUSTERS } from '@/lib/hero-blobs'

const HERO_IMAGE_SIZE = {
  mobile: 300,
  desktop: 330,
} as const

const [clusterOne, clusterTwo, clusterThree, clusterFour] = HERO_BLOB_CLUSTERS

/** Carousel order: top left, bottom left, bottom right, top right. */
const CAROUSEL_ORDER = ['one', 'two', 'four', 'three'] as const
/** First photo opens once the hero's entrance has settled. */
const CAROUSEL_START_MS = 1500
/** How long each photo stays open: the square, the caption, a moment to read. */
const CAROUSEL_HOLD_MS = 3200
/** All photos at rest between one and the next. */
const CAROUSEL_GAP_MS = 700
/** Quiet time after the visitor scrolls or leaves a photo before resuming. */
const CAROUSEL_RESUME_MS = 3000

/**
 * Cycles the hover state through the hero photos on its own, like a
 * carousel, so visitors on a mouse see that they respond. It pauses while the
 * visitor hovers a photo, scrolls, or has the hero (or the tab) out of view,
 * and picks up again from the next photo once things are quiet.
 */
function useHoverCarousel(root: React.RefObject<HTMLElement | null>) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const element = root.current

    if (!element || typeof window.matchMedia !== 'function') return

    const canHover = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (min-width: 1024px)',
    ).matches
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (!canHover || reducedMotion) return

    let next = 0
    let timer = 0
    let hovering = false
    let inView = true
    let quietUntil = 0

    const isPaused = () =>
      hovering || !inView || document.hidden || Date.now() < quietUntil

    const open = () => {
      if (isPaused()) {
        setActive(null)
        timer = window.setTimeout(open, 500)

        return
      }
      setActive(CAROUSEL_ORDER[next])
      next = (next + 1) % CAROUSEL_ORDER.length
      timer = window.setTimeout(close, CAROUSEL_HOLD_MS)
    }

    const close = () => {
      setActive(null)
      timer = window.setTimeout(open, CAROUSEL_GAP_MS)
    }

    // Hand over to the visitor at once: close whatever is open and wait.
    const pause = () => {
      window.clearTimeout(timer)
      setActive(null)
      timer = window.setTimeout(open, 500)
    }

    const onPointerOver = (event: PointerEvent) => {
      if (!(event.target as Element).closest('.hero-blob') || hovering) return
      hovering = true
      pause()
    }
    const onPointerOut = (event: PointerEvent) => {
      const to = event.relatedTarget as Element | null

      if (!hovering || to?.closest('.hero-blob')) return
      hovering = false
      quietUntil = Date.now() + CAROUSEL_RESUME_MS
    }
    const onScroll = () => {
      quietUntil = Date.now() + CAROUSEL_RESUME_MS
      pause()
    }
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
    })

    element.addEventListener('pointerover', onPointerOver)
    element.addEventListener('pointerout', onPointerOut)
    window.addEventListener('scroll', onScroll, { passive: true })
    observer.observe(element)
    timer = window.setTimeout(open, CAROUSEL_START_MS)

    return () => {
      window.clearTimeout(timer)
      element.removeEventListener('pointerover', onPointerOver)
      element.removeEventListener('pointerout', onPointerOut)
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [root])

  return active
}

export function HeroImages() {
  const desktop = useRef<HTMLDivElement>(null)
  const active = useHoverCarousel(desktop)

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

      <div
        ref={desktop}
        className="relative mt-8 hidden h-full w-full flex-col items-center justify-between gap-16 lg:mt-6 lg:flex lg:flex-row lg:items-stretch lg:gap-0 lg:px-0"
      >
        <div className="flex w-full flex-col items-center gap-16 lg:w-auto lg:items-start lg:gap-0 lg:pt-7.75 lg:pl-16.25">
          <div className="relative mx-auto w-fit lg:mx-0">
            <HeroBlob
              priority
              cluster={clusterOne}
              demo={active === clusterOne.id}
              enterDelay={160}
              size={HERO_IMAGE_SIZE.desktop}
            />
          </div>

          <div className="relative mx-auto mt-16 w-fit lg:mx-0 lg:mt-2.5 lg:ml-21.25">
            <HeroBlob
              cluster={clusterTwo}
              demo={active === clusterTwo.id}
              enterDelay={280}
              size={HERO_IMAGE_SIZE.desktop}
            />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-16 lg:w-auto lg:items-start lg:gap-0 lg:pt-0 lg:pr-23">
          <div className="relative mx-auto w-fit lg:mx-0 lg:-mt-12.5">
            <HeroBlob
              cluster={clusterThree}
              demo={active === clusterThree.id}
              enterDelay={220}
              size={HERO_IMAGE_SIZE.desktop}
            />
          </div>

          <div className="relative mx-auto w-fit lg:mx-0 lg:mt-20 lg:-ml-17.5">
            <HeroBlob
              cluster={clusterFour}
              demo={active === clusterFour.id}
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
