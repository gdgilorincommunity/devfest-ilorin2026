import { render, screen, within } from '@testing-library/react'

import { SPEAKERS } from '@/lib/speakers'

import SpeakersPage from './page'

describe('SpeakersPage', () => {
  it('renders the page heading with the speaker count', () => {
    render(<SpeakersPage />)
    expect(
      screen.getByRole('heading', { level: 1, name: /Our speakers/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(new RegExp(`${SPEAKERS.length} speakers`)),
    ).toBeInTheDocument()
  })

  it('lists every confirmed speaker with an anchor the agenda can link to', () => {
    render(<SpeakersPage />)
    const grid = screen.getByRole('region', { name: /All speakers/i })
    const cards = within(grid).getAllByRole('figure')

    expect(cards).toHaveLength(SPEAKERS.length)

    for (const speaker of SPEAKERS) {
      expect(document.getElementById(`speaker-${speaker.id}`)).not.toBeNull()
      expect(within(grid).getByText(speaker.name)).toBeInTheDocument()
    }
  })

  it('links across to the agenda', () => {
    render(<SpeakersPage />)
    expect(
      screen.getByRole('link', { name: /See the agenda/i }),
    ).toHaveAttribute('href', '/schedule')
  })
})
