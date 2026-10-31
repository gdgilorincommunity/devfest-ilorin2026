/**
 * Poster designs for /get-dp.
 *
 * A poster is a stack of same-sized PNGs with the visitor's photo slotted in:
 *
 *   background → photo → overlay → foreground → name and title
 *
 * Every layer PNG is exported at the poster's full size, transparent where
 * the layers below should show through, so they stack without positioning.
 * To change a design, replace its PNGs in /public/images/get-dp and, if the
 * name card or the face moved, the coordinates below. All coordinates are in
 * poster pixels.
 */

export interface DpBackdrop {
  id: string
  label: string
  /** CSS background for the picker swatch: a colour or a gradient. */
  swatch: string
  background: string
  /** Optional layer over the photo that fades its bottom into the background. */
  overlay?: string
}

export interface DpPhotoSlot {
  /** Where the centre of the face should land. */
  faceX: number
  faceY: number
  /** How wide the detected face should be. */
  faceWidth: number
  /**
   * The photo should reach down to this line, so it doesn't end in a hard
   * edge mid-poster.
   */
  minBottom: number
  /**
   * The highest the top of the head goes, clear of the headline. A photo too
   * short to reach `minBottom` with its face in place, such as a tight
   * headshot, is enlarged to fill from here down instead. So is a photo
   * where no face is found.
   */
  headTop: number
}

/**
 * The round frame used when the visitor keeps their photo's own background:
 * the photo is clipped to the circle and ringed in their chosen colour.
 */
export interface DpCircleSlot {
  /** Centre of the circle. */
  x: number
  y: number
  radius: number
  /** Width of the coloured ring drawn around it. */
  ring: number
}

export interface DpTextSlot {
  /** Centre of the text. */
  x: number
  /** Middle of the first line. */
  y: number
  maxWidth: number
  maxFontSize: number
  /** Long text shrinks down to this size, then wraps or is cut short. */
  minFontSize: number
  fontWeight: number
  color: string
  maxLines: number
  /** Line height as a multiple of the font size. */
  lineHeight: number
}

export interface DpTemplate {
  id: string
  label: string
  width: number
  height: number
  backdrops: DpBackdrop[]
  foreground: string
  photo: DpPhotoSlot
  circle: DpCircleSlot
  name: DpTextSlot
  title: DpTextSlot
  titlePlaceholder: string
  /** Caption offered alongside the poster when sharing from a phone. */
  shareText: string
}

const BACKDROPS: DpBackdrop[] = [
  {
    id: 'lavender',
    label: 'Lavender',
    swatch: '#A9A8FF',
    background: '/images/get-dp/background-lavender.png',
    overlay: '/images/get-dp/fade-lavender.png',
  },
  {
    id: 'pink',
    label: 'Pink',
    swatch: '#FF6FA2',
    background: '/images/get-dp/background-pink.png',
    overlay: '/images/get-dp/fade-pink.png',
  },
  {
    id: 'teal',
    label: 'Teal',
    swatch: 'linear-gradient(135deg, #78C9FF, #3CBCAB)',
    background: '/images/get-dp/background-teal.png',
    overlay: '/images/get-dp/fade-teal.png',
  },
  {
    id: 'yellow',
    label: 'Yellow',
    swatch: 'linear-gradient(135deg, #FFEE48, #FFDD24)',
    background: '/images/get-dp/background-yellow.png',
    overlay: '/images/get-dp/fade-yellow.png',
  },
]

export interface DpRingColor {
  id: string
  label: string
  value: string
}

/** Colours offered for the circle frame's ring. */
export const RING_COLORS: DpRingColor[] = [
  { id: 'blue', label: 'Blue', value: '#3186FF' },
  { id: 'green', label: 'Green', value: '#34A853' },
  { id: 'yellow', label: 'Yellow', value: '#FBBC04' },
  { id: 'red', label: 'Red', value: '#EA4335' },
  { id: 'white', label: 'White', value: '#FFFFFF' },
  { id: 'black', label: 'Black', value: '#1E1E1E' },
]

// Both designs share the poster size and the name card.
const LAYOUT = {
  width: 1080,
  height: 1210,
  backdrops: BACKDROPS,
  photo: {
    faceX: 540,
    faceY: 600,
    faceWidth: 300,
    minBottom: 1210,
    headTop: 270,
  },
  // Sits between the headline and the sponsor card, clear of both.
  circle: {
    x: 540,
    y: 590,
    radius: 290,
    ring: 16,
  },
  name: {
    x: 324,
    y: 1076,
    maxWidth: 360,
    maxFontSize: 40,
    minFontSize: 24,
    fontWeight: 700,
    color: '#1E1E1E',
    maxLines: 1,
    lineHeight: 1.2,
  },
  title: {
    x: 324,
    y: 1116,
    maxWidth: 350,
    maxFontSize: 23,
    minFontSize: 18,
    fontWeight: 400,
    color: '#5F6368',
    maxLines: 2,
    lineHeight: 1.3,
  },
} satisfies Omit<
  DpTemplate,
  'id' | 'label' | 'foreground' | 'titlePlaceholder' | 'shareText'
>

export const DP_TEMPLATES: DpTemplate[] = [
  {
    id: 'attendee',
    label: 'Attendee',
    foreground: '/images/get-dp/foreground-attendee.png',
    titlePlaceholder: 'Frontend Developer',
    shareText:
      'I’ll be at DevFest Ilorin 2026, November 6 – 7! Get your DP at devfestilorin.com/get-dp #devfestilorin26 #DevFest2026',
    ...LAYOUT,
  },
]
