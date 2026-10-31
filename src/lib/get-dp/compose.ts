import type { DpCircleSlot, DpTemplate, DpTextSlot } from './templates'

export interface Box {
  x: number
  y: number
  width: number
  height: number
}

/** The background-removed photo, with the face found in it if any. */
export interface Subject {
  width: number
  height: number
  face: Box | null
}

/** Where the photo sits on the poster: its top-left corner and its scale. */
export interface Placement {
  x: number
  y: number
  scale: number
}

export interface FittedText {
  fontSize: number
  lines: string[]
}

/** Width of `text` at `fontSize`, in poster pixels. */
export type Measure = (text: string, fontSize: number) => number

/** How far the visitor can zoom, relative to the automatic fit. */
export const MIN_ZOOM = 0.4
export const MAX_ZOOM = 3

// A short photo is enlarged to fill the poster, but never past this many
// times its face-fitted size, or a photo cropped at the chin would be all
// face.
const MAX_LIFT = 2.5

/**
 * Sizes and positions the photo so the face lands where the design expects
 * it. A photo that would then stop short of the bottom, or that has no face
 * found in it, instead fills the poster from the head line down.
 */
export function autoPlace(
  subject: Subject,
  template: Pick<DpTemplate, 'photo'>,
): Placement {
  const slot = template.photo
  const span = slot.minBottom - slot.headTop

  if (!subject.face) {
    const scale = span / subject.height

    return {
      scale,
      x: slot.faceX - (subject.width * scale) / 2,
      y: slot.headTop,
    }
  }

  const faceX = subject.face.x + subject.face.width / 2
  const faceY = subject.face.y + subject.face.height / 2
  const fit = slot.faceWidth / subject.face.width
  const bottom = slot.faceY + (subject.height - faceY) * fit

  if (bottom >= slot.minBottom) {
    return {
      scale: fit,
      x: slot.faceX - faceX * fit,
      y: slot.faceY - faceY * fit,
    }
  }

  const scale = Math.min(Math.max(span / subject.height, fit), fit * MAX_LIFT)

  return {
    scale,
    x: slot.faceX - faceX * scale,
    y: slot.minBottom - subject.height * scale,
  }
}

/**
 * Sizes the photo to just cover the circle frame, centred in it. The
 * background stays, so there is no face to line up: the visitor drags it
 * into place.
 */
export function fitCircle(
  subject: Pick<Subject, 'width' | 'height'>,
  circle: DpCircleSlot,
): Placement {
  const scale = (circle.radius * 2) / Math.min(subject.width, subject.height)

  return {
    scale,
    x: circle.x - (subject.width * scale) / 2,
    y: circle.y - (subject.height * scale) / 2,
  }
}

/** Rescales the photo while keeping the point under (anchorX, anchorY) put. */
export function zoomPlacement(
  placement: Placement,
  scale: number,
  anchorX: number,
  anchorY: number,
): Placement {
  const ratio = scale / placement.scale

  return {
    scale,
    x: anchorX - (anchorX - placement.x) * ratio,
    y: anchorY - (anchorY - placement.y) * ratio,
  }
}

/**
 * Picks the largest font size, down to the slot's minimum, at which the text
 * fits the slot's width and line count. Text that still doesn't fit at the
 * minimum is cut short with an ellipsis.
 */
export function fitText(
  text: string,
  slot: Pick<
    DpTextSlot,
    'maxWidth' | 'maxFontSize' | 'minFontSize' | 'maxLines'
  >,
  measure: Measure,
): FittedText {
  const words = text.trim().split(/\s+/).filter(Boolean)

  if (words.length === 0) return { fontSize: slot.maxFontSize, lines: [] }

  for (let size = slot.maxFontSize; size >= slot.minFontSize; size--) {
    const lines = wrap(words, slot.maxWidth, (line) => measure(line, size))

    if (
      lines.length <= slot.maxLines &&
      lines.every((line) => measure(line, size) <= slot.maxWidth)
    ) {
      return { fontSize: size, lines }
    }
  }

  const size = slot.minFontSize
  const width = (line: string) => measure(line, size)
  const wrapped = wrap(words, slot.maxWidth, width)
  const lines = [
    ...wrapped.slice(0, slot.maxLines - 1),
    wrapped.slice(slot.maxLines - 1).join(' '),
  ].map((line) => ellipsize(line, slot.maxWidth, width))

  return { fontSize: size, lines }
}

/** Fills lines word by word. A word wider than the line gets a line alone. */
function wrap(
  words: string[],
  maxWidth: number,
  width: (line: string) => number,
): string[] {
  const lines: string[] = []
  let line = ''

  for (const word of words) {
    const next = line ? `${line} ${word}` : word

    if (line && width(next) > maxWidth) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }

  lines.push(line)

  return lines
}

function ellipsize(
  line: string,
  maxWidth: number,
  width: (line: string) => number,
): string {
  if (width(line) <= maxWidth) return line

  let cut = line

  while (cut && width(`${cut}…`) > maxWidth) {
    cut = cut.slice(0, -1).trimEnd()
  }

  return `${cut}…`
}

/** Reads the `X-Face-Box` header the background service sends back. */
export function parseFaceBox(header: string | null): Box | null {
  const parts = header?.split(',').map(Number)

  if (parts?.length !== 4 || !parts.every(Number.isFinite)) return null

  const [x, y, width, height] = parts

  return width > 0 && height > 0 ? { x, y, width, height } : null
}

/** A download name like `devfest-ilorin-2026-ada-lovelace.png`. */
export function posterFileName(name: string): string {
  const slug = name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)

  return slug ? `devfest-ilorin-2026-${slug}.png` : 'devfest-ilorin-2026-dp.png'
}

export interface PosterScene {
  template: DpTemplate
  background: CanvasImageSource
  overlay: CanvasImageSource | null
  foreground: CanvasImageSource
  photo: {
    image: CanvasImageSource
    width: number
    height: number
    placement: Placement
  } | null
  /**
   * When set, the photo keeps its own background and is clipped to the
   * template's circle, ringed in this colour.
   */
  ringColor?: string | null
  name: string
  title: string
  /** Shown faintly in place of an empty name or title, in the preview only. */
  placeholders?: { name: string; title: string }
  /** A CSS font-family list, as the page's font is named at runtime. */
  fontFamily: string
}

/** Draws the poster's layers, bottom to top, at the poster's own size. */
export function drawPoster(ctx: CanvasRenderingContext2D, scene: PosterScene) {
  const { template } = scene
  const { width, height } = template

  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(scene.background, 0, 0, width, height)

  const circle = scene.ringColor ? template.circle : null

  if (scene.photo) {
    const { image, placement } = scene.photo

    ctx.save()

    if (circle) {
      ctx.beginPath()
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2)
      ctx.clip()
    }

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(
      image,
      placement.x,
      placement.y,
      scene.photo.width * placement.scale,
      scene.photo.height * placement.scale,
    )
    ctx.restore()
  }

  if (circle && scene.ringColor) {
    // Drawn before the foreground so its stickers still sit on top.
    ctx.beginPath()
    ctx.arc(circle.x, circle.y, circle.radius + circle.ring / 2, 0, Math.PI * 2)
    ctx.lineWidth = circle.ring
    ctx.strokeStyle = scene.ringColor
    ctx.stroke()
  } else if (scene.overlay) {
    // The fade only blends a cut-out's lower edge into the background.
    ctx.drawImage(scene.overlay, 0, 0, width, height)
  }

  ctx.drawImage(scene.foreground, 0, 0, width, height)

  const hasTitle = Boolean(scene.title.trim() || scene.placeholders?.title)
  // Without a title, the name moves down to sit in the middle of the card.
  const name = hasTitle
    ? template.name
    : { ...template.name, y: (template.name.y + template.title.y) / 2 }

  drawText(ctx, scene, name, scene.name, scene.placeholders?.name)
  drawText(ctx, scene, template.title, scene.title, scene.placeholders?.title)
}

function drawText(
  ctx: CanvasRenderingContext2D,
  scene: PosterScene,
  slot: DpTextSlot,
  value: string,
  placeholder?: string,
) {
  const text = value.trim() || placeholder || ''

  if (!text) return

  const font = (size: number) =>
    `${slot.fontWeight} ${size}px ${scene.fontFamily}`
  const fitted = fitText(text, slot, (line, size) => {
    ctx.font = font(size)

    return ctx.measureText(line).width
  })

  ctx.save()
  ctx.font = font(fitted.fontSize)
  ctx.fillStyle = slot.color
  ctx.globalAlpha = value.trim() ? 1 : 0.35
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  fitted.lines.forEach((line, index) => {
    ctx.fillText(
      line,
      slot.x,
      slot.y + index * fitted.fontSize * slot.lineHeight,
    )
  })

  ctx.restore()
}
