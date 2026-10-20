import Image from 'next/image'

import { HERO_BLOB_CLUSTERS, type HeroBlobCluster } from '@/lib/hero-blobs'
import { cn } from '@/lib/utils'

/**
 * The SVG clip paths behind each hero blob, for browsers without CSS
 * `shape()` (the `.hero-blob-photo` rules in globals.css use the animatable
 * `shape()` copy where they can). Render this once per page — the paths are
 * shared by the mobile and desktop layouts, so duplicating them would
 * duplicate the ids.
 */
export function HeroBlobClipPaths() {
  return (
    <svg aria-hidden className="absolute h-0 w-0" focusable="false">
      <defs>
        {HERO_BLOB_CLUSTERS.map((cluster) => (
          <clipPath
            key={cluster.id}
            clipPathUnits="objectBoundingBox"
            id={`hero-blob-${cluster.id}`}
          >
            <path d={cluster.shape.clipPath} />
          </clipPath>
        ))}
      </defs>
    </svg>
  )
}

export interface HeroBlobProps {
  cluster: HeroBlobCluster
  /** Longest edge of the cluster box, in px. */
  size: number
  priority?: boolean
  className?: string
  /** Stagger offset for the on-load entrance, in ms. Omit to skip it. */
  enterDelay?: number
  /** Shows the hover state on its own — driven by the hero's carousel. */
  demo?: boolean
}

/**
 * One hero cluster: a blob-clipped photo with its decorative shape beside it.
 *
 * The photo and the shape are separate requests, so neither blocks the other
 * and the small vector shape paints immediately. On hover (desktop pointers
 * only) the blob morphs into an upright rounded square and the decorative
 * shape springs — see the `.hero-blob` rules in globals.css.
 */
export function HeroBlob({
  cluster,
  size,
  priority = false,
  className,
  enterDelay,
  demo = false,
}: HeroBlobProps) {
  const { aspect, shape, caption, photoBox, decoBox } = cluster
  // Fit the cluster inside a `size` x `size` square, the way the previous
  // object-contain artwork did, so the surrounding layout is unchanged.
  const width = aspect >= 1 ? size : size * aspect
  const height = aspect >= 1 ? size / aspect : size

  // The hover square, upright on screen: the generator gives its centre and
  // side relative to the photo box, in units of the box height.
  const boxHeight = (height * photoBox.heightPct) / 100
  const frameSize = shape.frame.size * boxHeight
  const frameLeft =
    (width * photoBox.leftPct) / 100 + shape.frame.x * boxHeight - frameSize / 2
  const frameTop =
    (height * photoBox.topPct) / 100 + shape.frame.y * boxHeight - frameSize / 2

  return (
    <div
      className={cn(
        'hero-blob relative shrink-0',
        enterDelay !== undefined && 'hero-enter',
        className,
      )}
      data-demo={demo || undefined}
      style={
        {
          width,
          height,
          ...(enterDelay !== undefined && {
            '--enter-delay': `${enterDelay}ms`,
          }),
        } as React.CSSProperties
      }
    >
      <div
        className="hero-blob-photo absolute"
        data-shape={cluster.id}
        style={
          {
            width: `${photoBox.widthPct}%`,
            height: `${photoBox.heightPct}%`,
            left: `${photoBox.leftPct}%`,
            top: `${photoBox.topPct}%`,
            transform: `translate(-50%, -50%) rotate(${photoBox.rotate}deg)`,
            // The SVG clip is the fallback; the shapes the hover morphs
            // between come from hero-blob-shapes.generated.css by data-shape.
            '--hero-blob-fallback': `url(#hero-blob-${cluster.id})`,
          } as React.CSSProperties
        }
      >
        {/* Zooms on hover; the photo's own transform places it, so the
            zoom needs a wrapper of its own. */}
        <div className="hero-blob-zoom absolute inset-0">
          <Image
            fill
            alt={cluster.alt}
            className="max-w-none origin-top-left"
            priority={priority}
            sizes={`${Math.round(((width * photoBox.widthPct) / 100) * shape.photoScale)}px`}
            src={shape.photo}
            style={{ transform: shape.photoTransform }}
          />
        </div>
      </div>

      {/* Sits exactly over the hover square, upright, so the caption reads
          straight even though the photo box is rotated. Hidden from screen
          readers: it only shows on hover, and the photo's alt describes it. */}
      <div
        aria-hidden
        className="hero-blob-caption pointer-events-none absolute"
        style={{
          left: frameLeft,
          top: frameTop,
          width: frameSize,
          height: frameSize,
        }}
      >
        <div className="hero-blob-caption-panel absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-linear-to-t from-[#1E1E1E]/90 from-40% to-transparent px-[9%] pt-[18%] pb-[8%] text-white">
          <span className="text-base leading-tight font-bold">
            {caption.title}
          </span>
          <span className="text-xs leading-snug text-white/80">
            {caption.description}
          </span>
        </div>
      </div>

      {/* Positioned by the wrapper, rotated by the image, so the hover
          spring can turn the shape about its own centre. */}
      <div
        className="absolute -translate-1/2"
        style={{
          width: `${decoBox.widthPct}%`,
          height: `${decoBox.heightPct}%`,
          left: `${decoBox.leftPct}%`,
          top: `${decoBox.topPct}%`,
        }}
      >
        <Image
          aria-hidden
          alt=""
          className="hero-blob-deco size-full"
          height={100}
          priority={priority}
          src={cluster.deco}
          style={{ transform: `rotate(${decoBox.rotate}deg)` }}
          width={100}
        />
      </div>
    </div>
  )
}

export default HeroBlob
