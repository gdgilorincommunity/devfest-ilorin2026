import { render, screen, within } from '@testing-library/react'

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

  it('renders the venues section with innovation hub details and CTA buttons', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { name: /Venues/i })).toBeInTheDocument()
    expect(screen.getByText(/Innovation/i)).toBeInTheDocument()
    expect(screen.getByText(/hub Ilorin/i)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Get Workshop Ticket/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Get your dinner/i }),
    ).toBeInTheDocument()
  })

  it('renders the tickets section with Day 1, Day 2, and Dinner cards', () => {
    render(<Home />)
    expect(
      screen.getByRole('heading', { name: /^Tickets$/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Day 1/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Day 2/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Dinner/i })).toBeInTheDocument()
    // The event track cards also label themselves Workshop/Conference, so
    // scope these to the ticket tags rather than the whole page.
    const tickets = screen
      .getByRole('heading', { name: /^Tickets$/i })
      .closest('section') as HTMLElement

    expect(within(tickets).getByText(/^Workshop$/)).toBeInTheDocument()
    expect(within(tickets).getByText(/^Conference$/)).toBeInTheDocument()
    expect(within(tickets).getByText(/^VIP$/)).toBeInTheDocument()
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
