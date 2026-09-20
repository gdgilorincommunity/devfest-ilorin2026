import { render, screen } from '@testing-library/react'

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
    expect(screen.getByText(/^Workshop$/)).toBeInTheDocument()
    expect(screen.getByText(/^Conference$/)).toBeInTheDocument()
    expect(screen.getByText(/^VIP$/)).toBeInTheDocument()
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
