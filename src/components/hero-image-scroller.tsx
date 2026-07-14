'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

type HeroImageScrollerProps = {
  children: ReactNode
  className?: string
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
  speed?: 'fast' | 'medium' | 'normal' | 'slow'
}

const speedMap = {
  fast: '20s',
  medium: '45s',
  normal: '70s',
  slow: '100s',
} as const

export function HeroImageScroller({
  children,
  className,
  direction = 'left',
  pauseOnHover = true,
  speed = 'slow',
}: HeroImageScrollerProps) {
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
      className={cn('relative z-0 overflow-hidden', className)}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          'flex w-max min-w-full shrink-0 flex-nowrap gap-10 py-4 [backface-visibility:hidden] [transform:translateZ(0)]',
          start && 'animate-scroll',
          pauseOnHover && 'hover:[animation-play-state:paused]',
        )}
      >
        {children}
      </ul>
    </div>
  )
}
