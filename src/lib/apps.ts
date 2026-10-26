import config from '@/config'
import { APP_CATEGORIES, OTHER_CATEGORY } from '@/lib/app-showcase-form'

/** The categories the submission form offers, so a listing can file under one. */
export type AppCategory =
  (typeof APP_CATEGORIES)[number] | typeof OTHER_CATEGORY

export type AppContributor = {
  name: string
  /** GitHub username; the credit links to the profile and shows its avatar. */
  github: string
  /** What they did, shown when the app has more than one contributor. */
  role?: string
}

export type App = {
  id: string
  name: string
  tagline: string
  /**
   * The app's own hosted site, so install and notifications work. Its
   * embedded route on this site stays for direct visits.
   */
  href: string
  /** The app's own square home-screen icon (its apple-touch-icon). */
  icon: string
  /** The icon is a bare logo, not a full tile: it sits padded on white. */
  iconPadded?: boolean
  category: AppCategory
  /** Everyone credited for the app, in display order. */
  contributors: AppContributor[]
}

const AHMZYJAZZY: AppContributor = { name: 'Ahmzyjazzy', github: 'Ahmzyjazzy' }
const TWENTY4: AppContributor = {
  name: 'Imam Bashir (Twenty4)',
  github: 'Imambash6',
}
const HAZARDSECURITY: AppContributor = {
  name: 'Michael Olukayode',
  github: 'hazardsecurity',
}
const BILEFRESH: AppContributor = {
  name: 'Farouk Bilesanmi',
  github: 'Bilefresh',
}
const AMEERALABI: AppContributor = { name: 'Ameer Alabi', github: 'AmeerAlabi' }
const SAHEEDKEHINDE: AppContributor = {
  name: 'Adeogun Saheed Kehinde',
  github: 'saheedkehinde',
}
const DAREYOLOYE: AppContributor = { name: 'Darey Oloye', github: 'dareyoloye' }
const DEV_MOTOLANI: AppContributor = {
  name: 'Deborah Faloyo',
  github: 'Dev-Motolani',
}
const MUTAWAKKIL_YUSUF: AppContributor = {
  name: 'Mutawakkil Yusuf',
  github: 'Mutawakkil-Yusuf',
}
const AREOUS: AppContributor = { name: 'Areous Ahmad', github: 'itzareous' }
const CYB3RFLEX: AppContributor = {
  name: 'Abdulmuheez Qazeem',
  github: 'Cyb3rflex',
}

export function isExternalApp(app: App) {
  return /^https?:\/\//.test(app.href)
}

/**
 * Tags for every outbound app link, so builders can see the visit came from
 * the gallery. An app's own tags in `href` win: its link stays as given.
 */
export const GALLERY_UTM = {
  utm_source: 'devfestilorin',
  utm_medium: 'app_gallery',
} as const

/** The app's link as the gallery opens it, with the gallery's UTM tags. */
export function appGalleryUrl(app: App) {
  if (!isExternalApp(app)) return app.href

  const url = new URL(app.href)

  for (const [key, value] of Object.entries(GALLERY_UTM)) {
    if (!url.searchParams.has(key)) url.searchParams.set(key, value)
  }

  return url.toString()
}

export function githubProfileUrl(author: AppContributor) {
  return `https://github.com/${author.github}`
}

export function githubAvatarUrl(author: AppContributor) {
  return `https://avatars.githubusercontent.com/${author.github}?s=64`
}

/**
 * Every app listed on /apps. Each card opens the app's own site; adding an
 * app to the page is one entry here, pointing at that site and its OG card.
 */
export const APPS: App[] = [
  {
    id: 'faaji',
    name: 'Faaji',
    tagline:
      "Don't just attend. Experience it. Complete quests, earn badges and get your Faaji Wrapped.",
    href: config.faajiUrl,
    icon: '/images/apps/faaji.png',
    category: 'Engagement tool',
    contributors: [
      { ...AHMZYJAZZY, role: 'Design & Engineering' },
      { ...TWENTY4, role: 'Product Idea' },
    ],
  },
  {
    id: 'typerace',
    name: 'TypeRace',
    tagline:
      'How fast can you type? Practise free, race the room on your phone and climb the boards.',
    href: config.typeraceUrl,
    icon: '/images/apps/typerace.png',
    category: 'Game',
    contributors: [AHMZYJAZZY],
  },
  {
    id: 'cli',
    name: 'DevFest CLI',
    tagline:
      'Play the trivia tournament from your terminal. Sign in with Google and climb the leaderboard.',
    href: config.cliUrl,
    icon: '/images/apps/cli.png',
    category: 'Game',
    contributors: [AHMZYJAZZY],
  },
  {
    id: 'map',
    name: 'DevFest Map',
    tagline:
      'Every GDG chapter on one globe. Drop into any DevFest, catch livestreams and take a Balloon Ride.',
    href: config.mapUrl,
    icon: '/images/apps/map.png',
    category: 'Utility',
    contributors: [AHMZYJAZZY],
  },
  {
    id: 'meetadev',
    name: 'Meetadev',
    tagline:
      'Find the people you should meet at DevFest: mentors, learners and collaborators. Contacts swap only when both say yes.',
    href: 'https://www.meetadev.xyz',
    icon: '/images/apps/meetadev.png',
    category: 'Engagement tool',
    contributors: [HAZARDSECURITY],
  },
  {
    id: 'awaplay',
    name: 'AwaPlay',
    tagline:
      'Play Ludo, Whot, Chess, Ayo and 20+ more multiplayer games with friends, straight from WhatsApp. No download.',
    href: 'https://awaplay.app?utm_source=gdgilorin',
    icon: '/images/apps/awaplay.png',
    category: 'Game',
    contributors: [BILEFRESH],
  },
  {
    id: 'giftcanvas',
    name: 'GiftCanvas',
    tagline:
      'Make a personalised gift card with your words, photos and voice notes, and send it as one link.',
    href: 'https://canvas.gift',
    icon: '/images/apps/giftcanvas.png',
    category: 'Other',
    contributors: [AMEERALABI],
  },
  {
    id: 'aegisflow',
    name: 'AegisFlow',
    tagline:
      'Check suspicious messages, screenshots and claims with AI that explains the warning signs, not just a verdict.',
    href: 'https://aegisflowx.vercel.app',
    // The site ships no icon yet; a stand-in in its colours until it does.
    icon: '/images/apps/aegisflow.svg',
    category: 'Utility',
    contributors: [SAHEEDKEHINDE],
  },
  {
    id: 'floww',
    name: 'Floww',
    tagline:
      'Bookkeeping for creatives and small businesses: connect your bank read-only and let AI sort every transaction.',
    href: 'https://www.flowws.finance',
    icon: '/images/apps/floww.png',
    iconPadded: true,
    category: 'Utility',
    contributors: [DAREYOLOYE, DEV_MOTOLANI],
  },
  {
    id: 'amaanah',
    name: 'Amaanah',
    tagline:
      'Track who owes what without the awkward follow-up, and run ajo and esusu savings circles in one place.',
    href: 'https://amaanah-beta.vercel.app',
    icon: '/images/apps/amaanah.png',
    category: 'Utility',
    contributors: [MUTAWAKKIL_YUSUF],
  },
  {
    id: 'qorelly',
    name: 'Qorelly',
    tagline:
      'Run your restaurant, spa, pharmacy or shop from one place: POS, inventory, digital menus and bookings.',
    href: 'https://qorelly.com',
    icon: '/images/apps/qorelly.svg',
    category: 'Utility',
    contributors: [AREOUS, AHMZYJAZZY],
  },
  {
    id: 'roastix',
    name: 'Roastix',
    tagline:
      'Paste your code and get roasted: AI flags the security holes and suggests the fixes, with savage humour.',
    href: 'https://roastix.vercel.app',
    icon: '/images/apps/roastix.png',
    category: 'Utility',
    contributors: [CYB3RFLEX],
  },
]
