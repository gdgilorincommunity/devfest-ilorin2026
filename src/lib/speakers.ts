import type { BadgeColor, Speaker } from '@/components/speaker-card'

/** Accent badges cycle yellow → blue → red across a list of any length. */
export const BADGE_CYCLE = [
  'yellow',
  'blue',
  'red',
] as const satisfies readonly BadgeColor[]

/** Speakers whose card still falls back to the placeholder portrait. */
const PLACEHOLDER_PORTRAIT = '/images/speakers/placeholder.jpg'

/**
 * Speaker ids that have a supplied headshot at
 * `/images/speakers/<id>.webp`. Everyone else falls back to the placeholder,
 * so this set doubles as the checklist of photos still outstanding.
 */
const HAS_PHOTO = new Set<string>([
  'sodiq-akinjobi',
  'idris-olubisi',
  'oluyinka-abubakar',
  'daniel-okoro',
  'dami-oshun',
  'ahmed-olarenwaju',
  'david-oluwabusayo',
  'akorede-ibrahim',
  'daniel-olowoniyi',
  'fabusuyi-deborah',
  'oladosu-ibrahim',
  'shalom-bamigboye',
  'yusuf-sanusi',
  'olawore-hikmah',
  'iniobong-pius-umouman',
  'daniel-umoren',
  'abdul-jemeel-odewole',
])

type SpeakerSeed = Omit<Speaker, 'badge' | 'image'>

function withBadges(seeds: SpeakerSeed[]): Speaker[] {
  return seeds.map((seed, index) => ({
    ...seed,
    image: HAS_PHOTO.has(seed.id)
      ? `/images/speakers/${seed.id}.webp`
      : PLACEHOLDER_PORTRAIT,
    badge: BADGE_CYCLE[index % BADGE_CYCLE.length],
  }))
}

/**
 * The confirmed 2026 line-up, taken from the agenda. Ordered so the first
 * few carry the homepage section; the speakers page shows everyone.
 *
 * Only named people are listed. Slots the agenda still marks as pending —
 * the unconfirmed GDEs, the empty standard sessions, unnamed panelists — are
 * represented on the schedule as "to be announced" rather than here.
 */
export const SPEAKERS: Speaker[] = withBadges([
  // The first six carry the homepage section, so they lead with speakers
  // whose headshots have arrived.
  {
    id: 'sodiq-akinjobi',
    name: 'Sodiq Akinjobi',
    role: 'Program Manager, Google',
  },
  {
    id: 'idris-olubisi',
    name: 'Idris Olubisi',
    role: 'Developer Relations Engineer, Midnight',
  },
  {
    id: 'oluyinka-abubakar',
    name: 'Oluyinka Abubakar',
    role: 'Engineering Lead, MTN Nigeria',
  },
  {
    id: 'daniel-okoro',
    name: 'Daniel Okoro',
    role: 'Senior Software Engineer, TTMS Switzerland',
  },
  {
    id: 'dami-oshun',
    name: 'Dami Oshun',
    role: 'Software Engineer, Seamless Technologies',
  },
  {
    id: 'ahmed-olarenwaju',
    name: 'Ahmed Olarenwaju',
    role: 'Fullstack AI Engineer, INDICINA',
  },
  {
    id: 'gabriel-agbobli',
    name: 'Gabriel Agbobli',
    role: 'Google Developer Expert',
  },
  {
    id: 'umar-farouk-zubairu',
    name: 'Umar Farouk Zubairu',
    role: 'Google Developer Expert',
  },
  {
    id: 'kerry-okpere',
    name: 'Kerry Okpere',
    role: 'Google Developer Expert',
  },
  {
    id: 'areous',
    name: 'Areous',
    role: 'Lead Organiser, GDG Ilorin',
  },
  {
    id: 'david-oluwabusayo',
    name: 'David Oluwabusayo',
    role: 'CTO & Software Engineer, Paperless',
  },
  {
    id: 'akorede-ibrahim',
    name: 'Akorede Ibrahim',
    role: 'Product Engineer, NISO',
  },
  {
    id: 'tunmise-akinade',
    name: 'Tunmise Akinade',
    role: 'CEO, TelyTreat',
  },
  {
    id: 'hamza-lateef',
    name: 'Hamza Lateef',
    role: 'COO, Cyber Plural',
  },
  {
    id: 'daniel-olowoniyi',
    name: 'Daniel Olowoniyi',
    role: 'Software Engineer, Alveum',
  },
  {
    id: 'fabusuyi-deborah',
    name: 'Fabusuyi Deborah',
    role: 'Frontend Engineer, Rank',
  },
  {
    id: 'oladosu-ibrahim',
    name: 'Oladosu Ibrahim',
    role: 'Cloud & DevOps, Turing',
  },
  {
    id: 'shalom-bamigboye',
    name: 'Shalom Bamigboye',
    role: 'CEO & Co-founder, Entobo Technologies',
  },
  {
    id: 'john-oba',
    name: 'John Oba',
    role: 'CTO, Startup List Africa',
  },
  {
    id: 'yusuf-sanusi',
    name: 'Yusuf Sanusi',
    role: 'Senior Backend Engineer, Autocheck Africa',
  },
  {
    id: 'lateefah-bello',
    name: 'Lateefah Bello',
    role: 'Cloud, Arthurite Integrated',
  },
  {
    id: 'olawore-hikmah',
    name: 'Olawore Hikmah',
    role: 'Robotics & VR',
  },
  {
    id: 'habeeb-ajibola',
    name: 'Habeeb Ajibola',
    role: 'Community Manager, Web3 Africa',
  },
  {
    id: 'iniobong-pius-umouman',
    name: 'Iniobong Pius Umouman',
    role: 'Senior Software Engineer, Leatherback',
  },
  {
    id: 'daniel-umoren',
    name: 'Daniel Umoren',
    role: 'Community Manager, Enyata',
  },
  {
    id: 'abdul-jemeel-odewole',
    name: 'Abdul-Jemeel Odewole',
    role: 'Senior Software Engineer, Fincra',
  },
])

/** How many speakers the homepage section shows before its "view all" CTA. */
export const FEATURED_SPEAKER_COUNT = 6

export const FEATURED_SPEAKERS = SPEAKERS.slice(0, FEATURED_SPEAKER_COUNT)

const speakersById = new Map(SPEAKERS.map((speaker) => [speaker.id, speaker]))

export function getSpeaker(id: string): Speaker {
  const speaker = speakersById.get(id)

  if (!speaker) {
    throw new Error(
      `Unknown speaker id "${id}" — add them to src/lib/speakers.ts`,
    )
  }

  return speaker
}
