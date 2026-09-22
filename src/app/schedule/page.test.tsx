import { render, screen, within } from '@testing-library/react'

import { AGENDA } from '@/lib/agenda'
import { getSpeaker } from '@/lib/speakers'

import SchedulePage from './page'

describe('SchedulePage', () => {
  it('renders the agenda heading and both days', () => {
    render(<SchedulePage />)
    expect(
      screen.getByRole('heading', { level: 1, name: /Agenda/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: /^Day 1$/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: /^Day 2$/ }),
    ).toBeInTheDocument()
  })

  it('renders every track and session from the agenda data', () => {
    render(<SchedulePage />)

    for (const day of AGENDA) {
      const section = screen.getByRole('region', {
        name: new RegExp(`^${day.label},`),
      })

      for (const track of day.tracks) {
        expect(
          within(section).getByRole('heading', { level: 3, name: track.name }),
        ).toBeInTheDocument()

        for (const session of track.sessions) {
          expect(
            within(section).getAllByText(session.title).length,
          ).toBeGreaterThan(0)
        }
      }
    }
  })

  it('links each session speaker to their card on the speakers page', () => {
    render(<SchedulePage />)
    const firstSession = AGENDA[0].tracks[0].sessions[0]
    const speaker = getSpeaker(firstSession.speakerIds![0])

    expect(
      screen.getAllByRole('link', { name: new RegExp(speaker.name) })[0],
    ).toHaveAttribute('href', `/speakers#speaker-${speaker.id}`)
  })

  it('surfaces unconfirmed slots instead of hiding them', () => {
    render(<SchedulePage />)
    expect(screen.getAllByText(/to be announced/i).length).toBeGreaterThan(0)
  })
})
