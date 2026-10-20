import {
  HERO_BLOB_SHAPES,
  type HeroBlobShape,
} from '@/lib/hero-blob-shapes.generated'

/**
 * Hero blob clusters, measured off the Figma hero frame (node 882:39).
 *
 * Each cluster is a photo clipped to a blob outline plus one decorative
 * shape. The outline, the photo and how the photo sits inside it all come
 * from the Figma exports via `scripts/hero-shapes.mjs` (see
 * `HERO_BLOB_SHAPES`); this file only places the pieces.
 *
 * All box values are percentages of the cluster box. `leftPct`/`topPct`
 * locate the element's CENTRE, because each one is rotated about its centre
 * and Figma measures the rotated bounding box. The photo box's rotation
 * comes from the shape data, which also needs it to build an upright hover
 * square.
 */
export interface HeroBlobBox {
  widthPct: number
  heightPct: number
  /** Centre X, as a percentage of the cluster box. */
  leftPct: number
  /** Centre Y, as a percentage of the cluster box. */
  topPct: number
  rotate: number
}

export interface HeroBlobCaption {
  title: string
  description: string
}

export interface HeroBlobCluster {
  id: string
  alt: string
  /** Revealed over the photo on hover, once the blob has squared up. */
  caption: HeroBlobCaption
  deco: string
  /** Cluster width / height, so the box keeps the Figma proportions. */
  aspect: number
  shape: HeroBlobShape
  photoBox: HeroBlobBox
  decoBox: HeroBlobBox
}

export const HERO_BLOB_CLUSTERS: HeroBlobCluster[] = [
  {
    id: 'one',
    alt: 'DevFest Ilorin attendees posing together',
    caption: {
      title: 'Networking',
      description: 'Meet the tech leaders and builders in the room',
    },
    deco: '/svg/hero/deco-one.svg',
    aspect: 1.0,
    shape: HERO_BLOB_SHAPES.one,
    photoBox: {
      widthPct: 86.32,
      heightPct: 86.33,
      leftPct: 50,
      topPct: 50,
      rotate: HERO_BLOB_SHAPES.one.rotate,
    },
    decoBox: {
      widthPct: 23.28,
      heightPct: 23.28,
      leftPct: 77.84,
      topPct: 19.1,
      rotate: 57,
    },
  },
  {
    id: 'two',
    alt: 'A speaker presenting beside the About screen',
    caption: {
      title: 'Workshops',
      description: 'Hands-on sessions led by GDEs and engineers',
    },
    deco: '/svg/hero/deco-two.svg',
    aspect: 0.8985,
    shape: HERO_BLOB_SHAPES.two,
    photoBox: {
      widthPct: 75.25,
      heightPct: 67.61,
      leftPct: 50,
      topPct: 55.07,
      rotate: HERO_BLOB_SHAPES.two.rotate,
    },
    decoBox: {
      widthPct: 18.59,
      heightPct: 17.3,
      leftPct: 32.79,
      topPct: 12.02,
      rotate: -45,
    },
  },
  {
    id: 'three',
    alt: 'The DevFest Ilorin main hall filled with attendees',
    caption: {
      title: 'Conference day',
      description: 'A full day of keynotes, talks and panels on the main stage',
    },
    deco: '/svg/hero/deco-three.svg',
    aspect: 1.0,
    shape: HERO_BLOB_SHAPES.three,
    photoBox: {
      widthPct: 72.29,
      heightPct: 72.29,
      leftPct: 50,
      topPct: 50,
      rotate: HERO_BLOB_SHAPES.three.rotate,
    },
    decoBox: {
      widthPct: 16.75,
      heightPct: 16.75,
      leftPct: 16.83,
      topPct: 32.34,
      rotate: -100,
    },
  },
  {
    id: 'four',
    alt: 'A DevFest Ilorin session in progress at Ilorin Innovation Hub',
    caption: {
      title: 'Tech talks',
      description: "Speakers sharing what they've built and learned",
    },
    deco: '/svg/hero/deco-four.svg',
    aspect: 1.1681,
    shape: HERO_BLOB_SHAPES.four,
    photoBox: {
      widthPct: 73.52,
      heightPct: 88.95,
      leftPct: 56.13,
      topPct: 50.01,
      rotate: HERO_BLOB_SHAPES.four.rotate,
    },
    decoBox: {
      widthPct: 18.6,
      heightPct: 21.73,
      leftPct: 12.95,
      topPct: 21.34,
      rotate: -125,
    },
  },
]

export default HERO_BLOB_CLUSTERS
