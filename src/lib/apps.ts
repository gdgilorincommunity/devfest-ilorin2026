import config from '@/config'

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
  /** The app page's own 1200x630 social card, reused as its preview. */
  image: string
  imageAlt: string
  /** Everyone credited for the app, in display order. */
  contributors: AppContributor[]
}

const AHMZYJAZZY: AppContributor = { name: 'Ahmzyjazzy', github: 'Ahmzyjazzy' }
const TWENTY4: AppContributor = {
  name: 'Imam Bashir (Twenty4)',
  github: 'Imambash6',
}

export function isExternalApp(app: App) {
  return /^https?:\/\//.test(app.href)
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
    image: '/images/og/faaji.png',
    imageAlt: 'Faaji: Adé the crowned crane with the GDG Ilorin team.',
    contributors: [
      { ...AHMZYJAZZY, role: 'Design, engineering and custom assets' },
      { ...TWENTY4, role: 'Idea and PRD v1' },
    ],
  },
  {
    id: 'typerace',
    name: 'DevFest TypeRace',
    tagline:
      'How fast can you type? Practise free, race the room on your phone and climb the boards.',
    href: config.typeraceUrl,
    image: '/images/og/typerace.png',
    imageAlt:
      'DevFest TypeRace: TYPE RACE in GDG-coloured keycaps over a line of words being typed.',
    contributors: [AHMZYJAZZY],
  },
  {
    id: 'cli',
    name: 'DevFest CLI',
    tagline:
      'Play the trivia tournament from your terminal. Sign in with Google and climb the leaderboard.',
    href: config.cliUrl,
    image: '/images/og/cli.png',
    imageAlt:
      'The DevFest CLI running in a terminal, showing the DevFest banner and the tournament.',
    contributors: [AHMZYJAZZY],
  },
  {
    id: 'map',
    name: 'DevFest Map',
    tagline:
      'Every GDG chapter on one globe. Drop into any DevFest, catch livestreams and take a Balloon Ride.',
    href: config.mapUrl,
    image: '/images/og/map.png',
    imageAlt:
      'DevFest Map: a satellite globe dotted with GDG chapters, centred on Ilorin, Nigeria.',
    contributors: [AHMZYJAZZY],
  },
]
