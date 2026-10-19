/**
 * @jest-environment node
 */
import { POST } from './route'

const valid = {
  email: 'ada@example.com',
  fullName: 'Ada',
  stage: 'idea',
}

function post(body: unknown) {
  return POST(
    new Request('http://localhost/api/app-showcase', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  )
}

describe('POST /api/app-showcase', () => {
  const fetchMock = jest.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    global.fetch = fetchMock
  })

  it('forwards a valid submission to the Google Form', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        '<script>var FB_PUBLIC_LOAD_DATA_ = [];</script><p>Thanks!</p><a>Submit another response</a>',
      ),
    )

    const response = await post(valid)

    expect(response.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/formResponse'),
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('rejects invalid answers without calling Google', async () => {
    const response = await post({ ...valid, email: '' })

    expect(response.status).toBe(400)
    expect((await response.json()).errors.email).toBeDefined()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('reports a failure when Google sends the form back', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        '<script>var FB_PUBLIC_LOAD_DATA_ = [[846068069,"Full name",null,0,[[916487673]]]];</script>',
      ),
    )

    expect((await post(valid)).status).toBe(502)
  })

  it('reports a failure when Google rejects the answers', async () => {
    fetchMock.mockResolvedValue(new Response('', { status: 400 }))

    expect((await post(valid)).status).toBe(502)
  })

  it('quietly drops submissions that fill the hidden field', async () => {
    const response = await post({ ...valid, website: 'spam.example' })

    expect(response.status).toBe(200)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
