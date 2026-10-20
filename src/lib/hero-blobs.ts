import {
  HERO_BLOB_SHAPES,
  type HeroBlobShape,
} from '@/lib/hero-blob-shapes.generated'
import HERO_LAYOUT from '@/lib/hero-layout.json'

/**
 * Hero blob clusters, measured off the Figma hero frame (node 882:39).
 *
 * Each cluster is a photo clipped to a blob outline plus one decorative
 * shape. The outline, the photo and how the photo sits inside it all come
 * from the Figma exports via `scripts/hero-shapes.mjs` (see
 * `HERO_BLOB_SHAPES`); this file only places the pieces.
 *
 * The geometry — cluster aspect, photo box and deco box — lives in
 * hero-layout.json, which the generator reads too: the hover square and the
 * photo placement are built for these exact boxes, so they must share one
 * source. All box values are percentages of the cluster box.
 * `leftPct`/`topPct` locate the element's CENTRE, because each one is rotated
 * about its centre and Figma measures the rotated bounding box.
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
    shape: HERO_BLOB_SHAPES.one,
    ...HERO_LAYOUT.one,
  },
  {
    id: 'two',
    alt: 'A speaker presenting beside the About screen',
    caption: {
      title: 'Workshops',
      description: 'Hands-on sessions led by GDEs and engineers',
    },
    deco: '/svg/hero/deco-two.svg',
    shape: HERO_BLOB_SHAPES.two,
    ...HERO_LAYOUT.two,
  },
  {
    id: 'three',
    alt: 'The DevFest Ilorin main hall filled with attendees',
    caption: {
      title: 'Conference day',
      description: 'A full day of keynotes, talks and panels on the main stage',
    },
    deco: '/svg/hero/deco-three.svg',
    shape: HERO_BLOB_SHAPES.three,
    ...HERO_LAYOUT.three,
  },
  {
    id: 'four',
    alt: 'A DevFest Ilorin session in progress at Ilorin Innovation Hub',
    caption: {
      title: 'Tech talks',
      description: "Speakers sharing what they've built and learned",
    },
    deco: '/svg/hero/deco-four.svg',
    shape: HERO_BLOB_SHAPES.four,
    ...HERO_LAYOUT.four,
  },
]

export default HERO_BLOB_CLUSTERS
