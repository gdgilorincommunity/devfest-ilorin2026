'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Download,
  ImagePlus,
  LoaderCircle,
  RotateCcw,
  Share2,
  TriangleAlert,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  autoPlace,
  drawPoster,
  fitCircle,
  MAX_ZOOM,
  MIN_ZOOM,
  parseFaceBox,
  posterFileName,
  zoomPlacement,
  type Placement,
  type PosterScene,
  type Subject,
} from '@/lib/get-dp/compose'
import { canvasToBlob, loadLayer, preparePhoto } from '@/lib/get-dp/photo'
import { DP_TEMPLATES, RING_COLORS } from '@/lib/get-dp/templates'
import { cn } from '@/lib/utils'

type Photo = Subject & { image: ImageBitmap }

/**
 * `cutout` removes the photo's background so the visitor stands in the
 * poster; `circle` keeps it and frames the photo in a ringed circle.
 */
type PhotoStyle = 'cutout' | 'circle'

/** The uploaded photo, and each style's version of it once made. */
interface Source {
  blob: Blob
  cutout?: Photo
  circle?: Photo
}

const PHOTO_STYLES: { id: PhotoStyle; label: string }[] = [
  { id: 'cutout', label: 'Remove background' },
  { id: 'circle', label: 'Keep background' },
]

interface Layers {
  background: HTMLImageElement
  overlay: HTMLImageElement | null
  foreground: HTMLImageElement
}

type Status =
  | { kind: 'idle' }
  | { kind: 'working' }
  | { kind: 'ready' }
  | { kind: 'error'; message: string; original: Blob | null }

const inputClass =
  'w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-base text-[#1E1E1E] placeholder:text-[#1E1E1E]/35 outline-none transition-colors focus:border-black/40'

/** Arrow keys move the photo this many poster pixels; with Shift, four times. */
const NUDGE = 10

export function DpGenerator() {
  const [templateId, setTemplateId] = useState(DP_TEMPLATES[0].id)
  const template =
    DP_TEMPLATES.find((t) => t.id === templateId) ?? DP_TEMPLATES[0]
  const [backdropId, setBackdropId] = useState(template.backdrops[0].id)
  const backdrop =
    template.backdrops.find((b) => b.id === backdropId) ?? template.backdrops[0]

  const [photoStyle, setPhotoStyle] = useState<PhotoStyle>('cutout')
  const [ringColor, setRingColor] = useState(RING_COLORS[0].value)
  const isCircle = photoStyle === 'circle'

  const [layers, setLayers] = useState<Layers | null>(null)
  const [photo, setPhoto] = useState<Photo | null>(null)
  const [placement, setPlacement] = useState<Placement | null>(null)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [fontFamily, setFontFamily] = useState('sans-serif')
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [canShare, setCanShare] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sourceRef = useRef<Source | null>(null)
  // Each upload or style change takes a number, so a slow earlier one can't
  // replace a later one when it finally answers.
  const uploadRef = useRef(0)
  const pointersRef = useRef(new Map<number, { x: number; y: number }>())

  const fit = useMemo(() => {
    if (!photo) return null

    return isCircle
      ? fitCircle(photo, template.circle)
      : autoPlace(photo, template)
  }, [photo, template, isCircle])
  // A circle photo zoomed out past its fit would leave gaps in the frame.
  const minZoom = isCircle ? 1 : MIN_ZOOM
  const minScale = (fit?.scale ?? 1) * minZoom
  const maxScale = (fit?.scale ?? 1) * MAX_ZOOM
  const clampScale = (scale: number) =>
    Math.min(maxScale, Math.max(minScale, scale))

  // A new photo or design starts from the automatic fit.
  useEffect(() => setPlacement(fit), [fit])

  useEffect(() => {
    let cancelled = false

    Promise.all([
      loadLayer(backdrop.background),
      backdrop.overlay ? loadLayer(backdrop.overlay) : null,
      loadLayer(template.foreground),
    ])
      .then(([background, overlay, foreground]) => {
        if (!cancelled) setLayers({ background, overlay, foreground })
      })
      .catch(() => {
        if (cancelled) return

        setStatus({
          kind: 'error',
          message: 'The poster design didn’t load. Refresh the page to retry.',
          original: null,
        })
      })

    return () => {
      cancelled = true
    }
  }, [backdrop, template])

  useEffect(() => {
    // The page font is loaded by next/font under a generated name, so read
    // the name back rather than hard-coding it.
    const family = getComputedStyle(document.body).fontFamily || 'sans-serif'

    setFontFamily(family)
    setCanShare(typeof navigator.canShare === 'function')

    // Canvas text doesn't trigger font loading, and doesn't redraw itself
    // when a font arrives.
    Promise.all([
      document.fonts.load(`700 40px ${family}`),
      document.fonts.load(`400 24px ${family}`),
    ])
      .catch(() => null)
      .then(() => setFontsLoaded(true))

    return () => closeSource(sourceRef.current)
  }, [])

  const scene = (preview: boolean): PosterScene | null => {
    if (!layers) return null

    return {
      template,
      ...layers,
      photo:
        photo && placement
          ? {
              image: photo.image,
              width: photo.width,
              height: photo.height,
              placement,
            }
          : null,
      ringColor: isCircle ? ringColor : null,
      name,
      title,
      fontFamily,
      placeholders: preview
        ? { name: 'Your Name', title: template.titlePlaceholder }
        : undefined,
    }
  }

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    const preview = scene(true)

    if (ctx && preview) drawPoster(ctx, preview)
  }, [
    layers,
    photo,
    placement,
    ringColor,
    isCircle,
    name,
    title,
    fontFamily,
    fontsLoaded,
  ])

  // Trackpad pinches arrive as wheel events with Ctrl held. Plain scrolling
  // is left alone so the page still scrolls over the poster. React listens
  // to wheel passively, so this needs its own listener to prevent zooming
  // the whole page.
  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas || !fit) return

    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return

      event.preventDefault()

      const point = toPoster(canvas, event.clientX, event.clientY)
      const ratio = Math.exp(-event.deltaY * 0.01)

      setPlacement(
        (p) =>
          p && zoomPlacement(p, clampScale(p.scale * ratio), point.x, point.y),
      )
    }

    canvas.addEventListener('wheel', onWheel, { passive: false })

    return () => canvas.removeEventListener('wheel', onWheel)
  }, [fit])

  function toPoster(
    canvas: HTMLCanvasElement,
    clientX: number,
    clientY: number,
  ) {
    const rect = canvas.getBoundingClientRect()
    const scale = template.width / rect.width

    return {
      x: (clientX - rect.left) * scale,
      y: (clientY - rect.top) * scale,
    }
  }

  function showPhoto(next: Photo) {
    setPhoto(next)
    setStatus({ kind: 'ready' })
  }

  async function handleFile(file: File | undefined) {
    if (!file) return

    const upload = ++uploadRef.current

    setStatus({ kind: 'working' })

    let blob: Blob

    try {
      blob = await preparePhoto(file)
    } catch {
      if (upload === uploadRef.current) {
        setStatus({
          kind: 'error',
          message: 'We couldn’t open that photo. Try a JPG or PNG.',
          original: null,
        })
      }

      return
    }

    if (upload !== uploadRef.current) return

    closeSource(sourceRef.current)
    sourceRef.current = { blob }
    setPhoto(null)

    await applyStyle(photoStyle)
  }

  /** Shows the current upload in `style`, making that version if needed. */
  async function applyStyle(style: PhotoStyle) {
    const source = sourceRef.current

    if (!source) return

    const upload = ++uploadRef.current
    const ready = source[style]

    if (ready) return showPhoto(ready)

    setStatus({ kind: 'working' })

    if (style === 'circle') {
      const image = await createImageBitmap(source.blob)

      // Keep it for this upload even if the visitor has moved on.
      if (sourceRef.current !== source) return image.close()

      source.circle = {
        image,
        width: image.width,
        height: image.height,
        face: null,
      }

      if (upload === uploadRef.current) showPhoto(source.circle)

      return
    }

    let message = 'Something went wrong. Please try again.'

    try {
      const body = new FormData()

      body.append('image', source.blob, 'photo.jpg')

      const response = await fetch('/api/remove-bg', { method: 'POST', body })

      if (response.ok) {
        const face = parseFaceBox(response.headers.get('X-Face-Box'))
        const image = await createImageBitmap(await response.blob())

        if (sourceRef.current !== source) return image.close()

        source.cutout = {
          image,
          width: image.width,
          height: image.height,
          face,
        }

        if (upload === uploadRef.current) showPhoto(source.cutout)

        return
      }

      const json = (await response.json().catch(() => null)) as {
        error?: string
      } | null

      if (json?.error) message = json.error
    } catch {
      message = 'We couldn’t reach the server. Check your connection and retry.'
    }

    if (upload === uploadRef.current) {
      setStatus({ kind: 'error', message, original: source.blob })
    }
  }

  function chooseStyle(style: PhotoStyle) {
    if (style === photoStyle) return

    setPhotoStyle(style)
    setPhoto(null)
    applyStyle(style)
  }

  function onPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!placement) return

    event.currentTarget.setPointerCapture(event.pointerId)
    pointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    })
  }

  function onPointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    const pointers = pointersRef.current
    const last = pointers.get(event.pointerId)

    if (!last) return

    const canvas = event.currentTarget
    const now = { x: event.clientX, y: event.clientY }

    pointers.set(event.pointerId, now)

    if (pointers.size === 1) {
      const scale = template.width / canvas.getBoundingClientRect().width
      const dx = (now.x - last.x) * scale
      const dy = (now.y - last.y) * scale

      setPlacement((p) => p && { ...p, x: p.x + dx, y: p.y + dy })

      return
    }

    // Pinch: zoom around the finger that stayed put, by how much the
    // distance to it changed, so the photo follows both fingers.
    const other = [...pointers].find(([id]) => id !== event.pointerId)?.[1]

    if (!other) return

    const before = Math.hypot(last.x - other.x, last.y - other.y)
    const after = Math.hypot(now.x - other.x, now.y - other.y)

    if (before < 1) return

    const anchor = toPoster(canvas, other.x, other.y)

    setPlacement(
      (p) =>
        p &&
        zoomPlacement(
          p,
          clampScale((p.scale * after) / before),
          anchor.x,
          anchor.y,
        ),
    )
  }

  function onPointerEnd(event: React.PointerEvent<HTMLCanvasElement>) {
    pointersRef.current.delete(event.pointerId)
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLCanvasElement>) {
    if (!placement) return

    const step = event.shiftKey ? NUDGE * 4 : NUDGE
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    }

    if (moves[event.key]) {
      event.preventDefault()

      const [dx, dy] = moves[event.key]

      setPlacement((p) => p && { ...p, x: p.x + dx, y: p.y + dy })
    } else if (event.key === '+' || event.key === '=' || event.key === '-') {
      event.preventDefault()
      zoomBy(event.key === '-' ? 1 / 1.05 : 1.05)
    }
  }

  function zoomTo(scale: number) {
    const anchor = isCircle
      ? template.circle
      : { x: template.photo.faceX, y: template.photo.faceY }

    setPlacement(
      (p) => p && zoomPlacement(p, clampScale(scale), anchor.x, anchor.y),
    )
  }

  function zoomBy(ratio: number) {
    if (placement) zoomTo(placement.scale * ratio)
  }

  async function exportPoster() {
    const finished = scene(false)

    if (!finished) return null

    const canvas = document.createElement('canvas')

    canvas.width = template.width
    canvas.height = template.height

    const ctx = canvas.getContext('2d')

    if (!ctx) return null

    drawPoster(ctx, finished)

    return canvasToBlob(canvas, 'image/png')
  }

  async function handleDownload() {
    setIsExporting(true)

    try {
      const blob = await exportPoster()

      if (blob) saveBlob(blob, posterFileName(name))
    } finally {
      setIsExporting(false)
    }
  }

  async function handleShare() {
    setIsExporting(true)

    try {
      const blob = await exportPoster()

      if (!blob) return

      const file = new File([blob], posterFileName(name), { type: blob.type })

      if (!navigator.canShare?.({ files: [file] })) {
        return saveBlob(blob, file.name)
      }

      await navigator.share({ files: [file], text: template.shareText })
    } catch (error) {
      // Closing the share sheet rejects too; that isn't a failure.
      if ((error as Error)?.name !== 'AbortError') {
        setStatus({
          kind: 'error',
          message: 'Sharing didn’t work here. Download your DP instead.',
          original: null,
        })
      }
    } finally {
      setIsExporting(false)
    }
  }

  const isWorking = status.kind === 'working'
  const canDownload = Boolean(photo && placement && name.trim() && layers)
  const zoom = fit && placement ? placement.scale / fit.scale : 1

  return (
    <section
      aria-label="Make your DP"
      className="w-full bg-[#FDF2F1] py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto grid w-full max-w-378 items-start gap-8 px-4 md:px-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12 lg:px-32">
        <div className="flex flex-col gap-3 lg:sticky lg:top-28">
          <div
            className={cn(
              'relative overflow-hidden rounded-[28px] border bg-white shadow-[0_24px_60px_-30px_rgba(30,30,30,0.35)] transition-colors',
              isDragOver ? 'border-[#3186FF]' : 'border-black/5',
            )}
            onDragLeave={() => setIsDragOver(false)}
            onDragOver={(event) => {
              event.preventDefault()
              setIsDragOver(true)
            }}
            onDrop={(event) => {
              event.preventDefault()
              setIsDragOver(false)
              handleFile(event.dataTransfer.files[0])
            }}
          >
            <canvas
              ref={canvasRef}
              aria-label={
                photo
                  ? 'Your DP. Drag to move your photo, pinch to zoom, or use the arrow keys.'
                  : 'Your DP'
              }
              className={cn(
                'block h-auto w-full bg-[#F4ECEC] outline-none focus-visible:ring-3 focus-visible:ring-[#3186FF]/50',
                photo && 'cursor-grab touch-none active:cursor-grabbing',
              )}
              height={template.height}
              role="img"
              tabIndex={photo ? 0 : -1}
              width={template.width}
              onKeyDown={onKeyDown}
              onPointerCancel={onPointerEnd}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerEnd}
            />

            {!photo && !isWorking && (
              <button
                className={cn(
                  'absolute flex cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed border-[#1E1E1E]/25 bg-white/60 px-4 text-center backdrop-blur-sm transition-colors hover:border-[#1E1E1E]/50 hover:bg-white/75',
                  // Matches the circle frame: 580px across, centred at
                  // (540, 590) on the 1080 × 1210 poster.
                  isCircle
                    ? 'top-[24.8%] left-[23.15%] aspect-square w-[53.7%] rounded-full'
                    : 'inset-x-[22%] top-[27%] bottom-[30%] rounded-[28px]',
                )}
                type="button"
                onClick={() => inputRef.current?.click()}
              >
                <span className="flex size-14 items-center justify-center rounded-full bg-[#1E1E1E] text-white">
                  <ImagePlus className="size-6" />
                </span>
                <span className="text-base font-bold text-[#1E1E1E] sm:text-lg">
                  Add your photo
                </span>
                <span className="hidden text-sm font-medium text-[#1E1E1E]/60 sm:block">
                  Tap to choose, or drop it here
                </span>
              </button>
            )}

            {isWorking && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/60 backdrop-blur-sm">
                <LoaderCircle className="size-9 animate-spin text-[#1E1E1E]" />
                <span className="text-base font-bold text-[#1E1E1E]">
                  {isCircle
                    ? 'Opening your photo…'
                    : 'Removing the background…'}
                </span>
              </div>
            )}
          </div>

          {photo && (
            <p className="text-center text-sm font-medium text-[#1E1E1E]/55">
              Drag to move your photo. Pinch or use the slider to zoom.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Step
            number={1}
            title={
              DP_TEMPLATES.length > 1 ? 'Pick a design' : 'Pick a background'
            }
          >
            {/* With a single design there is nothing to pick. */}
            {DP_TEMPLATES.length > 1 && (
              <div
                aria-label="Design"
                className="flex flex-wrap gap-2"
                role="group"
              >
                {DP_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    aria-pressed={t.id === template.id}
                    className={cn(
                      'cursor-pointer rounded-full border px-5 py-2.5 text-sm font-bold transition-colors',
                      t.id === template.id
                        ? 'border-black bg-black text-white'
                        : 'border-black/10 bg-white text-[#1E1E1E]/70 hover:text-[#1E1E1E]',
                    )}
                    type="button"
                    onClick={() => setTemplateId(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}

            <div
              className={cn(
                'flex items-center gap-3',
                DP_TEMPLATES.length > 1 && 'mt-5',
              )}
            >
              <span className="text-sm font-bold text-[#1E1E1E]/60">
                Background
              </span>
              <div
                aria-label="Background"
                className="flex gap-2.5"
                role="group"
              >
                {template.backdrops.map((b) => (
                  <button
                    key={b.id}
                    aria-label={b.label}
                    aria-pressed={b.id === backdrop.id}
                    className={cn(
                      'size-9 cursor-pointer rounded-full border-[3px] border-white ring-2 transition-shadow',
                      b.id === backdrop.id
                        ? 'ring-[#1E1E1E]'
                        : 'ring-black/10 hover:ring-black/30',
                    )}
                    style={{ background: b.swatch }}
                    title={b.label}
                    type="button"
                    onClick={() => setBackdropId(b.id)}
                  />
                ))}
              </div>
            </div>
          </Step>

          <Step number={2} title="Add your photo">
            <div
              aria-label="Photo style"
              className="mb-4 flex flex-wrap gap-2"
              role="group"
            >
              {PHOTO_STYLES.map((option) => (
                <button
                  key={option.id}
                  aria-pressed={option.id === photoStyle}
                  className={cn(
                    'cursor-pointer rounded-full border px-5 py-2.5 text-sm font-bold transition-colors',
                    option.id === photoStyle
                      ? 'border-black bg-black text-white'
                      : 'border-black/10 bg-white text-[#1E1E1E]/70 hover:text-[#1E1E1E]',
                  )}
                  disabled={isWorking}
                  type="button"
                  onClick={() => chooseStyle(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {isCircle && (
              <div className="mb-5 flex items-center gap-3">
                <span className="text-sm font-bold text-[#1E1E1E]/60">
                  Border
                </span>
                <div
                  aria-label="Border colour"
                  className="flex flex-wrap gap-2.5"
                  role="group"
                >
                  {RING_COLORS.map((color) => (
                    <button
                      key={color.id}
                      aria-label={color.label}
                      aria-pressed={color.value === ringColor}
                      className={cn(
                        'size-9 cursor-pointer rounded-full border-[3px] border-white ring-2 transition-shadow',
                        color.value === ringColor
                          ? 'ring-[#1E1E1E]'
                          : 'ring-black/10 hover:ring-black/30',
                      )}
                      style={{ background: color.value }}
                      title={color.label}
                      type="button"
                      onClick={() => setRingColor(color.value)}
                    />
                  ))}
                </div>
              </div>
            )}

            <input
              ref={inputRef}
              accept="image/*"
              className="hidden"
              type="file"
              onChange={(event) => {
                handleFile(event.target.files?.[0])
                // Let the same file be picked again after a failure.
                event.target.value = ''
              }}
            />

            <div className="flex flex-wrap gap-2">
              <Button
                disabled={isWorking}
                size="pill"
                variant="black"
                onClick={() => inputRef.current?.click()}
              >
                <ImagePlus className="size-4" />
                {photo ? 'Change photo' : 'Upload photo'}
              </Button>

              {photo && (
                <Button
                  className="h-12 rounded-full border-black/10 bg-white px-5 text-sm font-bold lg:h-[55px]"
                  disabled={isWorking}
                  variant="outline"
                  onClick={() => setPlacement(fit)}
                >
                  <RotateCcw className="size-4" />
                  Reset position
                </Button>
              )}
            </div>

            <div aria-live="polite">
              {isWorking && !isCircle && (
                <p className="mt-3 text-sm font-medium text-[#1E1E1E]/60">
                  Removing the background. This takes a few seconds.
                </p>
              )}

              {status.kind === 'error' && (
                <div className="mt-4 flex gap-3 rounded-2xl bg-[#EA4335]/8 p-4 text-sm text-[#A52714]">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                  <div className="flex flex-col items-start gap-2">
                    <p className="font-medium">{status.message}</p>
                    {status.original && (
                      <button
                        className="cursor-pointer font-bold underline underline-offset-4"
                        type="button"
                        onClick={() => chooseStyle('circle')}
                      >
                        Keep my background, in a circle frame
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {photo && (
              <div className="mt-5 flex items-center gap-3">
                <button
                  aria-label="Zoom out"
                  className="cursor-pointer text-[#1E1E1E]/60 hover:text-[#1E1E1E]"
                  type="button"
                  onClick={() => zoomBy(1 / 1.1)}
                >
                  <ZoomOut className="size-5" />
                </button>
                <input
                  aria-label="Zoom"
                  className="h-1.5 w-full cursor-pointer accent-[#1E1E1E]"
                  max={MAX_ZOOM}
                  min={minZoom}
                  step={0.01}
                  type="range"
                  value={zoom}
                  onChange={(event) =>
                    fit && zoomTo(fit.scale * Number(event.target.value))
                  }
                />
                <button
                  aria-label="Zoom in"
                  className="cursor-pointer text-[#1E1E1E]/60 hover:text-[#1E1E1E]"
                  type="button"
                  onClick={() => zoomBy(1.1)}
                >
                  <ZoomIn className="size-5" />
                </button>
              </div>
            )}
          </Step>

          <Step number={3} title="Add your details">
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-[#1E1E1E]">
                  Your name
                </span>
                <input
                  autoComplete="name"
                  className={inputClass}
                  maxLength={40}
                  placeholder="Ada Lovelace"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-[#1E1E1E]">
                  Role and company{' '}
                  <span className="font-medium text-[#1E1E1E]/45">
                    (optional)
                  </span>
                </span>
                <input
                  autoComplete="organization-title"
                  className={inputClass}
                  maxLength={60}
                  placeholder={template.titlePlaceholder}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </label>
            </div>
          </Step>

          <Step number={4} title="Download and share">
            <div className="flex flex-wrap gap-2">
              <Button
                disabled={!canDownload || isExporting}
                size="pill"
                variant="gradient"
                onClick={handleDownload}
              >
                <Download className="size-4" />
                Download DP
              </Button>
              {canShare && (
                <Button
                  disabled={!canDownload || isExporting}
                  size="pill"
                  variant="black"
                  onClick={handleShare}
                >
                  <Share2 className="size-4" />
                  Share
                </Button>
              )}
            </div>
            {!canDownload && (
              <p className="mt-3 text-sm font-medium text-[#1E1E1E]/55">
                Add your photo and name to download your DP.
              </p>
            )}
          </Step>

          <p className="px-2 text-sm text-[#1E1E1E]/50">
            Your photo is only used to make your DP. It isn’t stored.
          </p>
        </div>
      </div>
    </section>
  )
}

function Step({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-5 sm:p-6">
      <h2 className="mb-4 flex items-center gap-3 text-lg font-bold text-[#1E1E1E]">
        <span className="flex size-7 items-center justify-center rounded-full bg-[#1E1E1E] text-xs text-white">
          {number}
        </span>
        {title}
      </h2>
      {children}
    </div>
  )
}

function closeSource(source: Source | null) {
  source?.cutout?.image.close()
  source?.circle?.image.close()
}

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  document.body.append(link)
  link.click()
  link.remove()
  // Some browsers start the download after click() returns.
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

export default DpGenerator
