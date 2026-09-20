import { render, screen } from '@testing-library/react'

import Home from './page'

describe('Home', () => {
  it('renders the hello world heading', () => {
    render(<Home />)
    expect(
      screen.getByRole('heading', { name: /November 2026/i }),
    ).toBeInTheDocument()
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
})
