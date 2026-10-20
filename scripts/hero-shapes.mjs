#!/usr/bin/env node
/* eslint-disable no-console -- a CLI script reports to the terminal */
/**
 * Builds the hero blob shapes and photos from the Figma exports.
 *
 *   node scripts/hero-shapes.mjs one=<svg> two=<svg> three=<svg> four=<svg>
 *
 * Each export is one Figma vector with its photo as an image fill: a single
 * <path> plus a <pattern> holding the embedded photo and the transform that
 * places it (in the path's own bounding-box units).
 *
 * Two fitted transforms in `LAYOUT` tie the exports to the live hero, which
 * was built from earlier screenshots of the same frames:
 *   placement  maps the vector's bounding box (0-1) into the photo box (0-1)
 *              that src/lib/hero-blobs.ts positions and rotates, so the clean
 *              outline lands where the old one sat and the decorative shapes
 *              still meet its tips
 *   photo      maps the photo (0-1) into the photo box (0-1). The exports
 *              crop two of the photos differently from the live hero, so the
 *              crop was matched to the live images pixel-for-pixel instead of
 *              taken from the export's image fill. Leave it out to use the
 *              export's own fill.
 * Both were fitted once against the hero as shipped. If the Figma layout
 * changes, refit them rather than guessing.
 *
 * For every cluster this writes:
 *   - public/images/hero/<id>.webp — the embedded photo, resized for 2x screens
 *   - src/lib/hero-blob-shapes.generated.ts — for each cluster:
 *       blob     the outline as CSS `shape()` (percentages of the photo box)
 *       square   a rounded square with the SAME command list, so the browser
 *                can tween blob -> square; built to look upright on screen
 *                once the cluster's rotation is applied
 *       clipPath the outline as an SVG path in objectBoundingBox units, for
 *                browsers without `shape()`
 *       photoTransform  CSS transform that places the photo in the photo box
 *
 * Both shapes are subdivided to the same number of cubic segments (exact
 * subdivision, so the blob is unchanged) — sparse outlines like the oval
 * would otherwise give a lumpy square.
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

/**
 * Per cluster: the photo box's on-page rotation (deg) and width / height (px),
 * matching hero-blobs.ts, and the fitted affines [a, b, c, d, e, f].
 */
const LAYOUT = {
  one: {
    rotate: -100,
    boxAspect: 1,
    placement: [1.00158, -0.14133, 0.13349, 0.96496, -0.06859, 0.08735],
    photo: [-0.06219, 1.60465, -1.06994, -0.04209, 1.06316, -0.35043],
  },
  two: {
    rotate: -65,
    boxAspect: 1,
    placement: [1.03781, -0.47905, 0.47469, 1.03798, -0.25637, 0.21991],
    photo: [0.7145, 1.59867, -1.06122, 0.49487, 0.72579, -0.43604],
  },
  three: {
    rotate: 57,
    boxAspect: 1,
    placement: [-0.52469, 0.88756, -0.78616, -0.43171, 1.15636, 0.26849],
    photo: [0.94783, -0.99479, 0.66315, 0.63067, -0.30662, 0.68124],
  },
  four: {
    rotate: -100,
    boxAspect: 0.9655,
    placement: [0.19354, -1.04748, 1.04979, 0.17821, -0.12222, 0.93398],
    photo: [-0.28818, 1.56855, -1.08593, -0.18496, 1.18714, -0.19255],
  },
}
/** Segments each outline is subdivided into. */
const SEGMENTS = 96
/** Superellipse exponent for the hover square: higher = sharper corners. */
const SQUARENESS = 10
/** Longest edge of the exported photos, px. */
const PHOTO_EDGE = 1600

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => arg.split(/=(.*)/s).slice(0, 2)),
)
const ids = Object.keys(LAYOUT)
const missing = ids.filter((id) => !args[id])

if (missing.length) {
  console.error(`Missing exports for: ${missing.join(', ')}`)
  console.error(
    'Usage: node scripts/hero-shapes.mjs one=<svg> two=<svg> three=<svg> four=<svg>',
  )
  process.exit(1)
}

// ── SVG parsing ───────────────────────────────────────────────────────────

function parsePath(d) {
  const tokens = d.match(/[MLCZ]|-?\d*\.?\d+(?:e-?\d+)?/gi)

  if (/[a-z]/.test(d.replace(/e-?\d/gi, '').replace(/[^a-zA-Z]/g, ''))) {
    throw new Error('Relative path commands are not supported')
  }

  const segments = []
  let i = 0
  let cursor = null
  let start = null
  const num = () => Number(tokens[i++])

  while (i < tokens.length) {
    const cmd = tokens[i++]

    if (cmd === 'M') {
      cursor = start = [num(), num()]
    } else if (cmd === 'L') {
      const to = [num(), num()]

      segments.push(lineAsCubic(cursor, to))
      cursor = to
    } else if (cmd === 'C') {
      const c1 = [num(), num()]
      const c2 = [num(), num()]
      const to = [num(), num()]

      segments.push([cursor, c1, c2, to])
      cursor = to
    } else if (cmd === 'Z') {
      if (dist(cursor, start) > 1e-6) segments.push(lineAsCubic(cursor, start))
      cursor = start
    } else {
      throw new Error(`Unsupported path command ${cmd}`)
    }
  }

  return segments
}

function parseTransform(value) {
  // Returns [a, b, c, d, e, f] in CSS/SVG matrix order.
  let m = [1, 0, 0, 1, 0, 0]

  for (const [, fn, raw] of value.matchAll(/(\w+)\(([^)]*)\)/g)) {
    const n = raw
      .trim()
      .split(/[\s,]+/)
      .map(Number)
    let t

    if (fn === 'matrix') t = n
    else if (fn === 'translate') t = [1, 0, 0, 1, n[0], n[1] ?? 0]
    else if (fn === 'scale') t = [n[0], 0, 0, n[1] ?? n[0], 0, 0]
    else if (fn === 'rotate') {
      const r = (n[0] * Math.PI) / 180

      t = [Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0]
    } else throw new Error(`Unsupported transform ${fn}`)
    m = multiply(m, t)
  }

  return m
}

function readExport(file) {
  const svg = readFileSync(file, 'utf8')
  const [, w, h] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)
  const paths = [...svg.matchAll(/<path d="([^"]+)"/g)]

  if (paths.length !== 1) {
    throw new Error(`${file}: expected one <path>, found ${paths.length}`)
  }
  if (!/patternContentUnits="objectBoundingBox"/.test(svg)) {
    throw new Error(`${file}: expected an objectBoundingBox image pattern`)
  }

  const [, transform] = svg.match(/<use[^>]*transform="([^"]+)"/)
  const image = svg.match(
    /<image[^>]*width="([\d.]+)" height="([\d.]+)"[^>]*href="data:image\/\w+;base64,([^"]+)"/,
  )

  return {
    width: Number(w),
    height: Number(h),
    segments: parsePath(paths[0][1]),
    pattern: parseTransform(transform),
    image: {
      width: Number(image[1]),
      height: Number(image[2]),
      data: Buffer.from(image[3], 'base64'),
    },
  }
}

// ── Geometry ──────────────────────────────────────────────────────────────

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const lineAsCubic = (a, b) => [a, lerp(a, b, 1 / 3), lerp(a, b, 2 / 3), b]

function multiply([a1, b1, c1, d1, e1, f1], [a2, b2, c2, d2, e2, f2]) {
  return [
    a1 * a2 + c1 * b2,
    b1 * a2 + d1 * b2,
    a1 * c2 + c1 * d2,
    b1 * c2 + d1 * d2,
    a1 * e2 + c1 * f2 + e1,
    b1 * e2 + d1 * f2 + f1,
  ]
}

const apply = ([a, b, c, d, e, f], [x, y]) => [
  a * x + c * y + e,
  b * x + d * y + f,
]

/** Splits a cubic at t (de Casteljau), returning [left, right]. */
function split([p0, p1, p2, p3], t) {
  const a = lerp(p0, p1, t)
  const b = lerp(p1, p2, t)
  const c = lerp(p2, p3, t)
  const d = lerp(a, b, t)
  const e = lerp(b, c, t)
  const m = lerp(d, e, t)

  return [
    [p0, a, d, m],
    [m, e, c, p3],
  ]
}

/** Exact subdivision so the outline has `total` cubic segments. */
function subdivide(segments, total) {
  const lengths = segments.map(
    (s) => dist(s[0], s[1]) + dist(s[1], s[2]) + dist(s[2], s[3]),
  )
  const sum = lengths.reduce((a, b) => a + b, 0)
  // Share the pieces out by length, at least one each, summing to `total`.
  const pieces = lengths.map((l) => Math.max(1, Math.floor((l / sum) * total)))

  while (pieces.reduce((a, b) => a + b, 0) < total) {
    const worst = lengths
      .map((l, i) => l / pieces[i])
      .reduce((best, v, i, all) => (v > all[best] ? i : best), 0)

    pieces[worst]++
  }

  return segments.flatMap((segment, i) => {
    const out = []
    let rest = segment

    for (let k = pieces[i]; k > 1; k--) {
      const [left, right] = split(rest, 1 / k)

      out.push(left)
      rest = right
    }
    out.push(rest)

    return out
  })
}

/**
 * The hover square: every anchor is pushed out (or in) along its angle from
 * the centre onto a superellipse, in SCREEN space, then rotated back into the
 * photo box's frame. Control points sit on the chord, so each piece is
 * straight; with ~100 pieces the corners still read as rounded.
 */
function squareFor(segments, box, rotateDeg, coverage) {
  const r = (rotateDeg * Math.PI) / 180
  const centre = [box.width / 2, box.height / 2]
  const toScreen = (p) => {
    const x = p[0] - centre[0]
    const y = p[1] - centre[1]

    return [
      x * Math.cos(r) - y * Math.sin(r),
      x * Math.sin(r) + y * Math.cos(r),
    ]
  }
  const toLocal = ([x, y]) => [
    x * Math.cos(-r) - y * Math.sin(-r) + centre[0],
    x * Math.sin(-r) + y * Math.cos(-r) + centre[1],
  ]

  const anchors = segments.map((s) => toScreen(s[0]))
  const xs = anchors.map((p) => p[0])
  const ys = anchors.map((p) => p[1])
  const mid = [
    (Math.min(...xs) + Math.max(...xs)) / 2,
    (Math.min(...ys) + Math.max(...ys)) / 2,
  ]
  const angles = anchors.map((p) => Math.atan2(p[1] - mid[1], p[0] - mid[0]))

  // The radial mapping needs the outline to wind once around the centre.
  let winding = 0

  for (let i = 0; i < angles.length; i++) {
    let step = angles[(i + 1) % angles.length] - angles[i]

    if (step > Math.PI) step -= 2 * Math.PI
    if (step < -Math.PI) step += 2 * Math.PI
    winding += step
  }
  if (Math.abs(Math.abs(winding) - 2 * Math.PI) > 1e-3) {
    throw new Error('Outline does not wind once around its centre')
  }

  const radius = (theta) =>
    (Math.abs(Math.cos(theta)) ** SQUARENESS +
      Math.abs(Math.sin(theta)) ** SQUARENESS) **
    (-1 / SQUARENESS)
  const at = (theta, half) => [
    mid[0] + half * radius(theta) * Math.cos(theta),
    mid[1] + half * radius(theta) * Math.sin(theta),
  ]

  // Largest square (up to the blob's own size) the photo still covers.
  let half =
    Math.min(
      Math.max(...xs) - Math.min(...xs),
      Math.max(...ys) - Math.min(...ys),
    ) / 2

  const covered = (h) =>
    Array.from({ length: 72 }, (_, k) => (k / 72) * 2 * Math.PI).every((t) =>
      coverage(toLocal(at(t, h))),
    )

  while (!covered(half)) half *= 0.98

  const points = angles.map((theta) => toLocal(at(theta, half)))

  return {
    half,
    mid,
    segments: points.map((p, i) => {
      const next = points[(i + 1) % points.length]

      return lineAsCubic(p, next)
    }),
  }
}

/** Point-in-convex-quad test for the photo's footprint. */
function insideQuad(quad, p) {
  let sign = 0

  for (let i = 0; i < 4; i++) {
    const a = quad[i]
    const b = quad[(i + 1) % 4]
    const cross = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])

    if (cross !== 0) {
      if (sign === 0) sign = Math.sign(cross)
      else if (Math.sign(cross) !== sign) return false
    }
  }

  return true
}

// ── Output ────────────────────────────────────────────────────────────────

const pct = (v) => `${Number((v * 100).toFixed(2))}%`
const unit = (v) => Number(v.toFixed(5))

function toShape(segments, box) {
  const p = ([x, y]) => `${pct(x / box.width)} ${pct(y / box.height)}`

  return `shape(from ${p(segments[0][0])}, ${segments
    .map((s) => `curve to ${p(s[3])} with ${p(s[1])} / ${p(s[2])}`)
    .join(', ')}, close)`
}

function toUnitPath(segments, box) {
  const p = ([x, y]) => `${unit(x / box.width)} ${unit(y / box.height)}`

  return `M ${p(segments[0][0])} ${segments
    .map((s) => `C ${p(s[1])} ${p(s[2])} ${p(s[3])}`)
    .join(' ')} Z`
}

const work = mkdtempSync(join(tmpdir(), 'hero-shapes-'))
const shapes = {}

for (const id of ids) {
  const svg = readExport(args[id])
  const { rotate, boxAspect, placement } = LAYOUT[id]
  // Work in photo-box px with height 1; the shapes come out in percentages.
  const box = { width: boxAspect, height: 1 }

  // Tight bounds of the outline: the image fill is laid out against these,
  // not the export's viewBox (a Group export can carry extra padding).
  const samples = svg.segments.flatMap((segment) =>
    Array.from({ length: 64 }, (_, k) => split(segment, k / 64)[1][0]),
  )
  const minX = Math.min(...samples.map((p) => p[0]))
  const minY = Math.min(...samples.map((p) => p[1]))
  const spanX = Math.max(...samples.map((p) => p[0])) - minX
  const spanY = Math.max(...samples.map((p) => p[1])) - minY
  const toBounds = [1 / spanX, 0, 0, 1 / spanY, -minX / spanX, -minY / spanY]
  // vector px -> bounds units -> photo-box units -> photo-box px
  const toBox = multiply([boxAspect, 0, 0, 1, 0, 0], placement)
  const outline = multiply(toBox, toBounds)
  const blob = subdivide(svg.segments, SEGMENTS).map((segment) =>
    segment.map((p) => apply(outline, p)),
  )

  // Image px -> photo-box px: through the fitted crop when there is one,
  // otherwise through the export's own image fill (bounds units).
  const { width: iw, height: ih } = svg.image
  const photo = LAYOUT[id].photo
    ? multiply(multiply([boxAspect, 0, 0, 1, 0, 0], LAYOUT[id].photo), [
        1 / iw,
        0,
        0,
        1 / ih,
        0,
        0,
      ])
    : multiply(toBox, svg.pattern)
  const footprint = [
    [0, 0],
    [iw, 0],
    [iw, ih],
    [0, ih],
  ].map((corner) => apply(photo, corner))

  const square = squareFor(blob, box, rotate, (p) => insideQuad(footprint, p))

  // With the <img> stretched over the photo box, re-express the photo
  // transform in the img's own frame so it is independent of pixel size.
  const [a, b, c, d, e, f] = photo
  const matrix = [
    (a * iw) / boxAspect,
    (b * iw) / boxAspect,
    c * ih,
    d * ih,
  ].map((n) => Number(n.toFixed(6)))
  const photoTransform = `translate(${pct(e / boxAspect)}, ${pct(f)}) matrix(${matrix.join(', ')}, 0, 0)`
  // How wide the photo renders relative to the box, for `sizes`.
  const photoScale = Number(((Math.hypot(a, b) * iw) / boxAspect).toFixed(3))

  // Resize the embedded photo for the web.
  const png = join(work, `${id}.png`)
  const out = `public/images/hero/${id}.webp`

  writeFileSync(png, svg.image.data)
  execFileSync('cwebp', [
    '-quiet',
    '-q',
    '80',
    '-resize',
    ...(iw >= ih ? [String(PHOTO_EDGE), '0'] : ['0', String(PHOTO_EDGE)]),
    png,
    '-o',
    out,
  ])

  shapes[id] = {
    rotate,
    blob: toShape(blob, box),
    square: toShape(square.segments, box),
    clipPath: toUnitPath(blob, box),
    photo: `/images/hero/${id}.webp`,
    photoTransform,
    photoScale,
    // Where the hover square lands on screen: its centre relative to the
    // photo box's centre, and its side, in units of the box height.
    frame: {
      x: Number(square.mid[0].toFixed(4)),
      y: Number(square.mid[1].toFixed(4)),
      size: Number((square.half * 2).toFixed(4)),
    },
  }

  console.log(
    `${id}: ${svg.segments.length} -> ${blob.length} segments, square ${Math.round(
      (square.half * 2 * 100) / Math.min(box.width, box.height),
    )}% of the box, photo ${photoScale}x box width -> ${out}`,
  )
}

// The same superellipse the squares are built on, as a unit-box outline.
const frameShape = `shape(${Array.from({ length: 96 }, (_, k) => {
  const theta = (k / 96) * 2 * Math.PI
  const r =
    (Math.abs(Math.cos(theta)) ** SQUARENESS +
      Math.abs(Math.sin(theta)) ** SQUARENESS) **
    (-1 / SQUARENESS)
  const point = `${pct(0.5 + 0.5 * r * Math.cos(theta))} ${pct(0.5 + 0.5 * r * Math.sin(theta))}`

  return k === 0 ? `from ${point}` : `line to ${point}`
}).join(', ')}, close)`

writeFileSync(
  'src/lib/hero-blob-shapes.generated.ts',
  `// Generated by scripts/hero-shapes.mjs from the Figma hero exports.
// Do not edit by hand — re-run the script instead.

export interface HeroBlobShape {
  /** On-page rotation of the photo box, in degrees. */
  rotate: number
  /** Outline as CSS \`shape()\`, in percentages of the photo box. */
  blob: string
  /** Hover target: same command list as \`blob\`, so it tweens. */
  square: string
  /** Outline in objectBoundingBox units, for the SVG fallback clip. */
  clipPath: string
  photo: string
  /** Places the photo over the box exactly as Figma's image fill does. */
  photoTransform: string
  /** Rendered photo width relative to the box width. */
  photoScale: number
  /**
   * The hover square on screen (upright): centre offset from the photo box's
   * centre and side length, in units of the photo box height.
   */
  frame: { x: number; y: number; size: number }
}

/** The hover square's outline in its own upright box, for the caption layer. */
export const HERO_FRAME_SHAPE = '${frameShape}'

export const HERO_BLOB_SHAPES = ${JSON.stringify(shapes, null, 2)} as const satisfies Record<string, HeroBlobShape>
`,
)
execFileSync(
  'npx',
  ['prettier', '--write', 'src/lib/hero-blob-shapes.generated.ts'],
  {
    stdio: 'ignore',
  },
)
console.log('Wrote src/lib/hero-blob-shapes.generated.ts')
