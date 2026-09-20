/* eslint-disable prettier/prettier */
'use client'

/**
 * Kept as a named alias so the hero keeps its original import path.
 * The implementation now lives in the generic `Marquee` component,
 * which the sponsor and partner rows share.
 */
export {
  Marquee as HeroImageScroller,
  type MarqueeProps as HeroImageScrollerProps,
} from '@/components/ui/marquee'
