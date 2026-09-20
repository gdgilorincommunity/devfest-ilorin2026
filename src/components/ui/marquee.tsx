'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type MarqueeProps = {
  children: ReactNode
  className?: string
  direction?: 'left' | 'right'
  /**
   * Tailwind gap utility applied to the track.
   * @default 'gap-10'
   */
  gapClass?: string
  /**
   * Fade the track out against the section background on both edges.
   */
  maskEdges?: boolean
  pauseOnHover?: boolean
  speed?: 'fast' | 'medium' | 'normal' | 'slow'
  /**
   * Tailwind padding utility applied to the track.
   * @default 'py-4'
   */
  trackPaddingClass?: string
}

const speedMap = {
  fast: '20s',
  medium: '45s',
  normal: '70s',
  slow: '100s',
} as const

/**
 * Seamless infinite marquee. The track is duplicated on mount so the
 * `animate-scroll` keyframe (see `globals.css`) can loop without a visible seam.
 */
export function Marquee({
  children,
  className,
  direction = 'left',
  gapClass = 'gap-10',
  maskEdges = false,
  pauseOnHover = true,
  speed = 'slow',
  trackPaddingClass = 'py-4',
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLUListElement>(null)
  const [start, setStart] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    const scroller = scrollerRef.current

    if (!container || !scroller) {
      return
    }

    Array.from(scroller.children).forEach((item) => {
      scroller.appendChild(item.cloneNode(true))
    })

    container.style.setProperty(
      '--animation-direction',
      direction === 'left' ? 'forwards' : 'reverse',
    )
    container.style.setProperty('--animation-duration', speedMap[speed])
    setStart(true)
  }, [direction, speed])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative z-0 overflow-hidden',
        maskEdges &&
          '[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]',
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          'flex w-max min-w-full shrink-0 flex-nowrap [backface-visibility:hidden] [transform:translateZ(0)]',
          gapClass,
          trackPaddingClass,
          start && 'animate-scroll',
          pauseOnHover && 'hover:[animation-play-state:paused]',
          'motion-reduce:animate-none',
        )}
      >
        {children}
      </ul>
    </div>
  )
}

export default Marquee
