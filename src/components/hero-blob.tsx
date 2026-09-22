import Image from 'next/image'

import { HERO_BLOB_CLUSTERS, type HeroBlobCluster } from '@/lib/hero-blobs'
import { cn } from '@/lib/utils'

/**
 * The clip paths every hero blob references. Render this once per page —
 * the paths are shared by the mobile and desktop layouts, so duplicating
 * them would duplicate the ids.
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
            <path d={cluster.clipPath} />
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
}

/**
 * One hero cluster: a blob-clipped photo with its decorative shape beside it.
 *
 * The photo and the shape are separate requests, so neither blocks the other
 * and the small vector shape paints immediately.
 */
export function HeroBlob({
  cluster,
  size,
  priority = false,
  className,
  enterDelay,
}: HeroBlobProps) {
  const { aspect, photoBox, decoBox } = cluster
  // Fit the cluster inside a `size` x `size` square, the way the previous
  // object-contain artwork did, so the surrounding layout is unchanged.
  const width = aspect >= 1 ? size : size * aspect
  const height = aspect >= 1 ? size / aspect : size

  return (
    <div
      className={cn(
        'relative shrink-0',
        enterDelay !== undefined && 'hero-enter',
        className,
      )}
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
        className="absolute"
        style={{
          width: `${photoBox.widthPct}%`,
          height: `${photoBox.heightPct}%`,
          left: `${photoBox.leftPct}%`,
          top: `${photoBox.topPct}%`,
          transform: `translate(-50%, -50%) rotate(${photoBox.rotate}deg)`,
          clipPath: `url(#hero-blob-${cluster.id})`,
        }}
      >
        <Image
          fill
          alt={cluster.alt}
          className="object-cover"
          priority={priority}
          sizes={`${Math.round(size)}px`}
          src={cluster.photo}
        />
      </div>

      <Image
        aria-hidden
        alt=""
        className="absolute"
        height={100}
        priority={priority}
        src={cluster.deco}
        style={{
          width: `${decoBox.widthPct}%`,
          height: `${decoBox.heightPct}%`,
          left: `${decoBox.leftPct}%`,
          top: `${decoBox.topPct}%`,
          transform: `translate(-50%, -50%) rotate(${decoBox.rotate}deg)`,
        }}
        width={100}
      />
    </div>
  )
}

export default HeroBlob
