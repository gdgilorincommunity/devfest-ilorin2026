import type { Speaker } from '@/components/speaker-card'

/**
 * Placeholder roster from the Figma. Replace with the confirmed line-up —
 * the homepage section shows the first few, the speakers list page shows all.
 */
export const SPEAKERS: Speaker[] = [
  {
    id: 'speaker-1',
    name: 'Sodiq Akinjobi',
    role: 'Community Lead, Google',
    image: '/images/speakers/placeholder.jpg',
    badge: 'yellow',
  },
  {
    id: 'speaker-2',
    name: 'Sodiq Akinjobi',
    role: 'Community Lead, Google',
    image: '/images/speakers/placeholder.jpg',
    badge: 'blue',
  },
  {
    id: 'speaker-3',
    name: 'Sodiq Akinjobi',
    role: 'Community Lead, Google',
    image: '/images/speakers/placeholder.jpg',
    badge: 'red',
  },
]

/** Accent badges cycle yellow → blue → red across a list of any length. */
export const BADGE_CYCLE = ['yellow', 'blue', 'red'] as const
