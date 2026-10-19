import { fireEvent, render, screen, within } from '@testing-library/react'

import { AppSubmitDrawer } from './app-submit-drawer'

// jsdom has no fetch Response; the drawer only reads ok and json().
function reply(status: number, body: unknown) {
  return { ok: status < 400, status, json: async () => body }
}

async function openAndFillIdea() {
  render(<AppSubmitDrawer />)
  fireEvent.click(screen.getByRole('button', { name: /Submit your app/i }))

  const drawer = await screen.findByRole('dialog')

  fireEvent.change(within(drawer).getByLabelText(/Email/), {
    target: { value: 'ada@example.com' },
  })
  fireEvent.change(within(drawer).getByLabelText(/Full name/), {
    target: { value: 'Ada' },
  })
  fireEvent.click(within(drawer).getByLabelText('Just an idea'))

  return drawer
}

describe('AppSubmitDrawer', () => {
  const fetchMock = jest.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    global.fetch = fetchMock
  })

  it('thanks the visitor once Google records the submission', async () => {
    fetchMock.mockResolvedValue(reply(200, { ok: true }))

    const drawer = await openAndFillIdea()

    fireEvent.click(within(drawer).getByRole('button', { name: /Send/ }))

    expect(await screen.findByText(/Thanks, we got it/)).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/app-showcase',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('keeps the answers and shows the error when sending fails', async () => {
    fetchMock.mockResolvedValue(
      reply(502, { error: 'Google Forms did not accept the submission.' }),
    )

    const drawer = await openAndFillIdea()

    fireEvent.click(within(drawer).getByRole('button', { name: /Send/ }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Google Forms did not accept the submission.',
    )
    expect(within(drawer).getByLabelText(/Full name/)).toHaveValue('Ada')
  })

  it('shows the problems without sending when answers are missing', async () => {
    render(<AppSubmitDrawer />)
    fireEvent.click(screen.getByRole('button', { name: /Submit your app/i }))

    const drawer = await screen.findByRole('dialog')

    fireEvent.click(within(drawer).getByRole('button', { name: /Send/ }))

    expect(
      within(drawer).getByText('Enter your full name.'),
    ).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
