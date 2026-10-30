// A cold start of the background service loads its model before answering.
export const maxDuration = 60

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

/**
 * Passes a photo from /get-dp to the background removal service in
 * `services/remove-bg` and streams the cut-out PNG back.
 *
 * It goes through the server so the service's address and token stay
 * private, and the browser talks to the site alone. Nothing is stored.
 */
export async function POST(request: Request) {
  const serviceUrl = process.env.REMOVE_BG_URL

  if (!serviceUrl) {
    return Response.json(
      { error: 'Background removal is not set up yet.' },
      { status: 503 },
    )
  }

  let form: FormData

  try {
    form = await request.formData()
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const image = form.get('image')

  if (!(image instanceof File) || !image.type.startsWith('image/')) {
    return Response.json({ error: 'Please choose a photo.' }, { status: 415 })
  }

  if (image.size > MAX_UPLOAD_BYTES) {
    return Response.json({ error: 'That photo is too large.' }, { status: 413 })
  }

  const body = new FormData()

  body.append('image', image, image.name || 'photo.jpg')

  const headers: HeadersInit = {}

  if (process.env.REMOVE_BG_TOKEN) {
    headers.Authorization = `Bearer ${process.env.REMOVE_BG_TOKEN}`
  }

  let response: Response

  try {
    response = await fetch(new URL('/remove-bg', serviceUrl), {
      method: 'POST',
      body,
      headers,
      cache: 'no-store',
      signal: AbortSignal.timeout(55_000),
    })
  } catch {
    return Response.json(
      { error: 'Could not reach the background remover. Please try again.' },
      { status: 502 },
    )
  }

  if (!response.ok) {
    // Problems with the photo itself come with a message written for the
    // visitor. Anything else (a wrong token, a crash) is ours to fix.
    const aboutThePhoto = [413, 415, 422].includes(response.status)
    const detail = aboutThePhoto
      ? await response
          .json()
          .then((json: { detail?: unknown }) => json.detail)
          .catch(() => null)
      : null

    return Response.json(
      {
        error:
          typeof detail === 'string'
            ? detail
            : 'The background remover had a problem. Please try again.',
      },
      { status: aboutThePhoto ? response.status : 502 },
    )
  }

  const responseHeaders = new Headers({
    'Content-Type': 'image/png',
    'Cache-Control': 'no-store',
  })
  const faceBox = response.headers.get('X-Face-Box')

  if (faceBox) responseHeaders.set('X-Face-Box', faceBox)

  return new Response(response.body, { headers: responseHeaders })
}
