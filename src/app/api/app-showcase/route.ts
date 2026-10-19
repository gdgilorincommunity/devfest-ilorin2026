import {
  APP_SHOWCASE_RESPONSE_URL,
  isFormSentBack,
  toFormBody,
  validateSubmission,
} from '@/lib/app-showcase-form'

/**
 * Forwards an App Showcase submission from the /apps drawer to the Google
 * Form, so it lands in the form's responses sheet like any other response.
 *
 * It goes through the server rather than straight from the browser because
 * Google's `formResponse` endpoint sends no CORS headers: a browser post
 * could not read the reply, and so could not tell the visitor whether the
 * submission was accepted.
 */
export async function POST(request: Request) {
  let input: unknown

  try {
    input = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Bots fill every field, people never see this one. Pretend it worked.
  if ((input as Record<string, unknown> | null)?.website) {
    return Response.json({ ok: true })
  }

  const result = validateSubmission(input)

  if (!result.ok) {
    return Response.json({ errors: result.errors }, { status: 400 })
  }

  let response: Response

  try {
    response = await fetch(APP_SHOWCASE_RESPONSE_URL, {
      method: 'POST',
      body: toFormBody(result.data),
      cache: 'no-store',
    })
  } catch {
    return Response.json(
      { error: 'Could not reach Google Forms. Please try again.' },
      { status: 502 },
    )
  }

  // Google answers 200 both when it records the response and when it sends
  // the form back to be filled in again (say, after a question changed in
  // Google Forms). Both pages embed form data, but only the second lists
  // the questions.
  const html = await response.text()

  if (!response.ok || isFormSentBack(html)) {
    return Response.json(
      { error: 'Google Forms did not accept the submission.' },
      { status: 502 },
    )
  }

  return Response.json({ ok: true })
}
