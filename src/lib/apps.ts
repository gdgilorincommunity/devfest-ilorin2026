export type AppAuthor = {
  name: string
  /** GitHub username; the credit links to the profile and shows its avatar. */
  github: string
}

export type App = {
  id: string
  name: string
  tagline: string
  /** A route on this site, or a full URL for an app hosted elsewhere. */
  href: string
  /** The app page's own 1200x630 social card, reused as its preview. */
  image: string
  imageAlt: string
  /** Everyone credited for building the app, in display order. */
  authors: AppAuthor[]
}

const AHMZYJAZZY: AppAuthor = { name: 'Ahmzyjazzy', github: 'Ahmzyjazzy' }

export function isExternalApp(app: App) {
  return /^https?:\/\//.test(app.href)
}

export function githubProfileUrl(author: AppAuthor) {
  return `https://github.com/${author.github}`
}

export function githubAvatarUrl(author: AppAuthor) {
  return `https://avatars.githubusercontent.com/${author.github}?s=64`
}

/**
 * Every app listed on /apps. Each one still lives at its own route; adding an
 * app to the page is one entry here, pointing at that route and its OG card.
 */
export const APPS: App[] = [
  {
    id: 'cli',
    name: 'DevFest CLI',
    tagline:
      'Play the trivia tournament from your terminal. Sign in with Google and climb the leaderboard.',
    href: '/cli',
    image: '/images/og/cli.png',
    imageAlt:
      'The DevFest CLI running in a terminal, showing the DevFest banner and the tournament.',
    authors: [AHMZYJAZZY],
  },
  {
    id: 'map',
    name: 'DevFest Map',
    tagline:
      'Every GDG chapter on one globe. Drop into any DevFest, catch livestreams and take a Balloon Ride.',
    href: '/map',
    image: '/images/og/map.png',
    imageAlt:
      'DevFest Map: a satellite globe dotted with GDG chapters, centred on Ilorin, Nigeria.',
    authors: [AHMZYJAZZY],
  },
]
