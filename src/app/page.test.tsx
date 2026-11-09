import { render, screen, within } from '@testing-library/react'

import config from '@/config'

import Home from './page'

describe('Home', () => {
  it('renders the hero heading', () => {
    render(<Home />)
    expect(
      screen.getByRole('heading', { level: 1, name: /Devfest Ilorin\s*2026/i }),
    ).toBeInTheDocument()
  })

  it('renders every landing section', () => {
    render(<Home />)

    expect(
      screen.getByRole('heading', { name: /Our speakers/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /^Sponsors$/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /^Partners$/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Community Partners/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders the venues section with innovation hub details and the photos link', () => {
    render(<Home />)
    const venues = screen
      .getByRole('heading', { name: /Venues/i })
      .closest('section') as HTMLElement

    expect(within(venues).getByText(/^Innovation$/i)).toBeInTheDocument()
    expect(within(venues).getByText(/^hub Ilorin$/i)).toBeInTheDocument()
    expect(
      within(venues).getByRole('link', { name: /View Photos/i }),
    ).toHaveAttribute('href', config.photosUrl)
  })

  it('thanks attendees and links to the event photos', () => {
    render(<Home />)
    const thanks = screen
      .getByRole('heading', { name: /Thank you for coming/i })
      .closest('section') as HTMLElement

    // The shared Button renders its <a> with role="button", so find the
    // anchor through its label.
    expect(
      within(thanks).getByText('View Photos').closest('a'),
    ).toHaveAttribute('href', config.photosUrl)
    // The event is over, so nothing on the page should still sell tickets.
    expect(screen.queryByRole('link', { name: /Ticket/i })).toBeNull()
  })

  it('renders the event track cards as text labels', () => {
    render(<Home />)
    const tracks = screen.getByRole('region', { name: /Devfest Ilorin 2026/i })

    for (const label of ['Workshop', 'Conference', 'Dinner']) {
      expect(within(tracks).getByText(label)).toBeInTheDocument()
    }
  })

  it('exposes the primary navigation links', () => {
    render(<Home />)

    for (const label of ['Speakers', 'Schedule', 'Sponsors', 'Team']) {
      expect(
        screen.getAllByRole('link', { name: label }).length,
      ).toBeGreaterThan(0)
    }
  })
})
