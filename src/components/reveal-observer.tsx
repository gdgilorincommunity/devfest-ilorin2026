'use client'

import { useEffect } from 'react'

/**
 * Watches every `[data-reveal]` element on the page and marks it
 * `data-visible` the first time it enters the viewport.
 *
 * A single observer for the whole page, rather than a hook per section, so
 * the sections themselves stay server components — they only need to carry
 * the attribute. The styling lives in globals.css.
 */
export function RevealObserver() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(
      '[data-reveal]:not([data-visible])',
    )

    if (nodes.length === 0) return

    // Skip the animation for anything already on screen at mount — content
    // above the fold should just be there, not fade in late.
    const reveal = (node: HTMLElement) => {
      node.setAttribute('data-visible', '')
    }

    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach(reveal)

      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue

          reveal(entry.target as HTMLElement)
          observer.unobserve(entry.target)
        }
      },
      // Start slightly before the element is fully on screen so the motion
      // finishes about when it reaches a comfortable reading position.
      { rootMargin: '0px 0px -10% 0px', threshold: 0.01 },
    )

    nodes.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [])

  return null
}

export default RevealObserver
