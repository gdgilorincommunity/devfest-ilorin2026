// Phone photos run to 12 megapixels and several megabytes. The poster is
// about 1080px wide, so anything past this is upload time and data spent on
// pixels nobody sees.
const MAX_SIDE = 1600

/**
 * Shrinks a chosen photo to at most 1600px on its longest side, upright and
 * re-encoded as JPEG, ready to upload.
 */
export async function preparePhoto(file: File): Promise<Blob> {
  // Browsers apply the photo's EXIF rotation when decoding.
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')

  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)

  const ctx = canvas.getContext('2d')

  if (!ctx) throw new Error('Canvas is not available.')

  // JPEG has no transparency, so give see-through PNGs a white backing.
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  return canvasToBlob(canvas, 'image/jpeg', 0.9)
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error('Could not export image.')),
      type,
      quality,
    )
  })
}

const layerCache = new Map<string, Promise<HTMLImageElement>>()

/** Loads a poster layer once and shares it between redraws. */
export function loadLayer(src: string): Promise<HTMLImageElement> {
  let layer = layerCache.get(src)

  if (!layer) {
    const image = new Image()

    image.src = src
    layer = image.decode().then(() => image)
    // Let a failed load be retried rather than cached.
    layer.catch(() => layerCache.delete(src))
    layerCache.set(src, layer)
  }

  return layer
}
